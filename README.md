# Visitar Guimarães — Instruções de Instalação e Arranque

## Estrutura do projeto

```
projeto/
├── index.html          ← Frontend principal
├── style.css           ← Estilos
├── script.js           ← JavaScript do frontend
├── app.py              ← Servidor Flask (API)
├── database.py         ← Script de criação da BD
├── requirements.txt    ← Dependências Python
└── guimaraes.db        ← Base de dados SQLite (gerada automaticamente)
```

---

## 1. Pré-requisitos

- Python 3.10 ou superior
- Conta Google AI Studio para obter uma chave Gemini (gratuita)

---

## 2. Instalação das dependências

Abre um terminal na pasta do projeto e corre:

```bash
pip install -r requirements.txt
```

---

## 3. Obter a chave da API Gemini

1. Acede a https://aistudio.google.com/apikey
2. Clica em **Create API Key**
3. Copia a chave gerada

---

## 4. Definir a variável de ambiente com a chave

### Windows (PowerShell)
```powershell
$env:GEMINI_API_KEY = "COLA_A_TUA_CHAVE_AQUI"
```

### Windows (Linha de Comandos / CMD)
```cmd
set GEMINI_API_KEY=COLA_A_TUA_CHAVE_AQUI
```

### macOS / Linux
```bash
export GEMINI_API_KEY="COLA_A_TUA_CHAVE_AQUI"
```

> **Nota:** Esta variável tem de ser definida na mesma sessão do terminal onde vais correr o servidor. Se fechares o terminal, tens de a definir novamente.

---

## 5. Inicializar a base de dados (apenas na primeira vez)

```bash
python database.py
```

Deverás ver: `Base de dados criada em 'guimaraes.db' com 12 pontos de interesse.`

---

## 6. Arrancar o servidor Flask

```bash
python app.py
```

O servidor fica disponível em: **http://localhost:5000**

---

## 7. Abrir o frontend

Abre o ficheiro `index.html` diretamente no browser, ou usa a extensão **Live Server** do VS Code.

> O frontend comunica automaticamente com `http://localhost:5000`. Mantém o servidor a correr enquanto usas o site.

---

## Endpoints da API

| Método | Endpoint              | Descrição                                      |
|--------|-----------------------|------------------------------------------------|
| GET    | `/api/places`         | Lista todos os pontos de interesse             |
| GET    | `/api/places?q=texto` | Pesquisa por título, descrição ou categoria    |
| GET    | `/api/places?lang=en` | Resultados em inglês                           |
| GET    | `/api/places/<id>`    | Detalhe de um ponto de interesse               |
| POST   | `/api/contact`        | Envia mensagem (moderada pelo Gemini)          |
| POST   | `/api/newsletter`     | Subscrição de newsletter (guardada em SQLite)  |

---

## Funcionamento da moderação com IA (Gemini)

Quando um utilizador submete o formulário de contacto, o backend:

1. Valida os campos (nome, email, assunto, mensagem)
2. Envia a mensagem ao Google Gemini para moderação
3. O Gemini classifica a mensagem como:
   - **aprovada** → mensagem legítima, resposta de sucesso
   - **suspeita** → possível spam, aceite mas sinalizada para revisão
   - **rejeitada** → conteúdo ofensivo/inadequado, recusada com mensagem de erro
4. O frontend mostra o resultado ao utilizador

Se o Gemini não estiver disponível (sem chave ou erro de rede), o sistema aprova a mensagem por defeito.

---

## Notas para entrega

- O ficheiro `guimaraes.db` é gerado automaticamente ao correr `database.py` ou ao iniciar `app.py`
- O frontend tem fallback automático para dados locais se o servidor não estiver acessível
- A chave GEMINI_API_KEY **não deve ser incluída** no código — é passada como variável de ambiente
