"""
app.py — Servidor Flask para o projeto Visitar Guimarães.

Endpoints:
  GET  /api/places          → lista pontos de interesse (suporta ?q=&lang=)
  GET  /api/places/<id>     → detalhe de um ponto
  POST /api/contact         → valida/modera mensagem com Google Gemini
  POST /api/newsletter      → subscrição de newsletter (guarda em SQLite)

Dependências:
  pip install flask flask-cors google-generativeai

Variáveis de ambiente necessárias:
  GEMINI_API_KEY=<a-tua-chave>   (obtém em https://aistudio.google.com/apikey)

Como correr:
  python database.py      # apenas na primeira vez (cria a BD)
  python app.py
"""

import os
import sqlite3
import re

# Carrega variáveis do ficheiro .env (se existir)
try:
    from dotenv import load_dotenv
    from pathlib import Path
    load_dotenv(dotenv_path=Path(__file__).parent / ".env")
except ImportError:
    pass

from flask import Flask, jsonify, request
from flask_cors import CORS

# ── Google Gemini ──────────────────────────────────────────────────────────────
try:
    from google import genai as google_genai
    GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
    if GEMINI_API_KEY:
        _gemini_client = google_genai.Client(api_key=GEMINI_API_KEY)
        GEMINI_AVAILABLE = True
    else:
        _gemini_client = None
        GEMINI_AVAILABLE = False
        print("[AVISO] GEMINI_API_KEY não definida. A moderação de IA está desativada.")
except ImportError:
    _gemini_client = None
    GEMINI_AVAILABLE = False
    print("[AVISO] google-genai não instalado. Corre: pip install google-genai")

# ── Configuração ───────────────────────────────────────────────────────────────
DB_PATH = os.path.join(os.path.dirname(__file__), "guimaraes.db")

app = Flask(__name__)
CORS(app)  # permite pedidos do frontend (localhost com ficheiro aberto)


# ── Utilitário BD ──────────────────────────────────────────────────────────────
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


# ══════════════════════════════════════════════════════════════════════════════
#  GET /api/places
#  Parâmetros opcionais:
#    q    → pesquisa por título, descrição ou categoria (insensível a acentos)
#    lang → "pt" (default) ou "en"
# ══════════════════════════════════════════════════════════════════════════════
@app.route("/api/places", methods=["GET"])
def get_places():
    lang = request.args.get("lang", "pt").lower()
    if lang not in ("pt", "en"):
        lang = "pt"

    query = request.args.get("q", "").strip().lower()

    conn = get_db()
    cur = conn.cursor()

    if query:
        like = f"%{query}%"
        cur.execute(f"""
            SELECT id, category_{lang} AS category, title_{lang} AS title,
                   description_{lang} AS description, image_class, badge
            FROM places
            WHERE LOWER(title_{lang})       LIKE ?
               OR LOWER(description_{lang}) LIKE ?
               OR LOWER(category_{lang})    LIKE ?
            ORDER BY id
        """, (like, like, like))
    else:
        cur.execute(f"""
            SELECT id, category_{lang} AS category, title_{lang} AS title,
                   description_{lang} AS description, image_class, badge
            FROM places
            ORDER BY id
        """)

    rows = [dict(row) for row in cur.fetchall()]
    conn.close()

    return jsonify({"results": rows, "total": len(rows), "lang": lang})


# ══════════════════════════════════════════════════════════════════════════════
#  GET /api/places/<id>
# ══════════════════════════════════════════════════════════════════════════════
@app.route("/api/places/<int:place_id>", methods=["GET"])
def get_place(place_id):
    lang = request.args.get("lang", "pt").lower()
    if lang not in ("pt", "en"):
        lang = "pt"

    conn = get_db()
    cur = conn.cursor()
    cur.execute(f"""
        SELECT id, category_{lang} AS category, title_{lang} AS title,
               description_{lang} AS description, image_class, badge
        FROM places WHERE id = ?
    """, (place_id,))
    row = cur.fetchone()
    conn.close()

    if row is None:
        return jsonify({"error": "Ponto de interesse não encontrado."}), 404

    return jsonify(dict(row))


# ══════════════════════════════════════════════════════════════════════════════
#  POST /api/contact
#  Body JSON: { name, email, subject, message }
#  Resposta:  { ok, classification, reason, message }
#
#  O Gemini classifica a mensagem como:
#    "aprovada"  → conteúdo legítimo, avança normalmente
#    "suspeita"  → possível spam ou conteúdo inadequado
#    "rejeitada" → conteúdo claramente indevido/ofensivo
# ══════════════════════════════════════════════════════════════════════════════
@app.route("/api/contact", methods=["POST"])
def contact():
    data = request.get_json(silent=True) or {}

    name    = str(data.get("name",    "")).strip()
    email   = str(data.get("email",   "")).strip()
    subject = str(data.get("subject", "")).strip()
    message = str(data.get("message", "")).strip()

    # Validação básica dos campos obrigatórios
    if not all([name, email, subject, message]):
        return jsonify({
            "ok": False,
            "classification": "erro",
            "reason": "Todos os campos são obrigatórios.",
            "message": "Por favor preencha todos os campos."
        }), 400

    # Validação simples do email
    if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
        return jsonify({
            "ok": False,
            "classification": "erro",
            "reason": "Endereço de email inválido.",
            "message": "Por favor introduza um email válido."
        }), 400

    # ── Moderação com Gemini ───────────────────────────────────────────────
    classification = "aprovada"
    reason         = "Mensagem válida."

    if GEMINI_AVAILABLE:
        try:
            prompt = f"""És um moderador de conteúdo para o website de turismo de Guimarães, Portugal.
Analisa a seguinte mensagem de contacto e classifica-a numa de três categorias:

- "aprovada"  → mensagem legítima relacionada com turismo, dúvidas, sugestões ou elogios
- "suspeita"  → possível spam, conteúdo ambíguo ou fora de contexto
- "rejeitada" → conteúdo ofensivo, ameaçador, publicitário ou claramente inadequado

Responde APENAS com um objeto JSON com dois campos:
  "classification": "aprovada" | "suspeita" | "rejeitada"
  "reason": uma frase curta a explicar a classificação (em português)

Dados da mensagem:
  Nome: {name}
  Email: {email}
  Assunto: {subject}
  Mensagem: {message}
"""
            response = _gemini_client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt
            )
            raw = response.text.strip()

            # Extrai JSON mesmo que o modelo adicione markdown
            json_match = re.search(r"\{.*?\}", raw, re.DOTALL)
            if json_match:
                import json
                parsed = json.loads(json_match.group())
                classification = parsed.get("classification", "aprovada")
                reason         = parsed.get("reason", "")
            else:
                # Se não conseguir parsear, aprova por defeito
                classification = "aprovada"
                reason = "Não foi possível analisar automaticamente."

        except Exception as e:
            print(f"[Gemini] Erro: {e}")
            classification = "aprovada"
            reason = "Moderação temporariamente indisponível."

    # ── Construção da resposta ─────────────────────────────────────────────
    if classification == "rejeitada":
        return jsonify({
            "ok": False,
            "classification": classification,
            "reason": reason,
            "message": "A sua mensagem não pôde ser enviada por conter conteúdo inadequado."
        }), 422

    if classification == "suspeita":
        # Aceita mas avisa (podes guardar em BD para revisão manual)
        return jsonify({
            "ok": True,
            "classification": classification,
            "reason": reason,
            "message": "Mensagem recebida e em análise. Responderemos em breve."
        })

    # Aprovada
    return jsonify({
        "ok": True,
        "classification": classification,
        "reason": reason,
        "message": "Mensagem enviada com sucesso! Responderemos em breve."
    })


# ══════════════════════════════════════════════════════════════════════════════
#  POST /api/newsletter
#  Body JSON: { email }
#  Resposta:  { ok, duplicate, message }
# ══════════════════════════════════════════════════════════════════════════════
@app.route("/api/newsletter", methods=["POST"])
def newsletter():
    data  = request.get_json(silent=True) or {}
    email = str(data.get("email", "")).strip().lower()

    if not email or not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
        return jsonify({
            "ok": False,
            "duplicate": False,
            "message": "Email inválido."
        }), 400

    conn = get_db()
    cur  = conn.cursor()

    # Garante que a tabela existe (cria se necessário)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS newsletter (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            email      TEXT    NOT NULL UNIQUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)

    try:
        cur.execute("INSERT INTO newsletter (email) VALUES (?)", (email,))
        conn.commit()
        conn.close()
        return jsonify({
            "ok": True,
            "duplicate": False,
            "message": "Subscrição confirmada!"
        })
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({
            "ok": True,
            "duplicate": True,
            "message": "Este email já está subscrito."
        })


# ── Arranque ───────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    if not os.path.exists(DB_PATH):
        print("[INFO] Base de dados não encontrada. A criar automaticamente...")
        from database import init_db
        init_db()

    print("\n🏰  Servidor Visitar Guimarães a correr em http://localhost:5000\n")
    app.run(debug=True, port=5000)
