"""
database.py — Cria e popula a base de dados SQLite para o projeto Visitar Guimarães.
Executa este script uma vez antes de iniciar o servidor: python database.py
"""

import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "guimaraes.db")


PLACES = [
    {
        "category_pt": "Palácios",
        "category_en": "Palaces",
        "title_pt": "Paço dos Duques de Bragança",
        "title_en": "Palace of the Dukes of Braganza",
        "description_pt": "Construído no século XV pelo 1.º Duque de Bragança, é um dos palácios medievais mais marcantes de Portugal.",
        "description_en": "Built in the 15th century by the 1st Duke of Braganza, it is one of Portugal's most striking medieval palaces.",
        "image_class": "image-paco-duques",
        "badge": "Imperdível",
    },
    {
        "category_pt": "Monumentos",
        "category_en": "Monuments",
        "title_pt": "Castelo de Guimarães",
        "title_en": "Guimarães Castle",
        "description_pt": "Símbolo da fundação de Portugal e um dos monumentos mais icónicos da cidade.",
        "description_en": "A symbol of Portugal's foundation and one of the city's most iconic monuments.",
        "image_class": "image-castelo-guimaraes",
        "badge": None,
    },
    {
        "category_pt": "Centro Histórico",
        "category_en": "Historic Centre",
        "title_pt": "Centro Histórico",
        "title_en": "Historic Centre",
        "description_pt": "Ruas medievais, praças animadas e um ambiente único que convida a explorar a pé.",
        "description_en": "Medieval streets, lively squares and a unique atmosphere that invites you to explore on foot.",
        "image_class": "image-centro-historico",
        "badge": "UNESCO",
    },
    {
        "category_pt": "Igrejas",
        "category_en": "Churches",
        "title_pt": "Igreja da Oliveira",
        "title_en": "Oliveira Church",
        "description_pt": "Um dos marcos religiosos e históricos mais importantes do coração da cidade.",
        "description_en": "One of the most important religious and historical landmarks in the heart of the city.",
        "image_class": "image-igreja-oliveira",
        "badge": None,
    },
    {
        "category_pt": "Museus",
        "category_en": "Museums",
        "title_pt": "Museu Martins Sarmento",
        "title_en": "Martins Sarmento Museum",
        "description_pt": "Coleção arqueológica de referência para conhecer melhor a herança castreja e romana da região.",
        "description_en": "A landmark archaeological collection to better understand the region's Celtic and Roman heritage.",
        "image_class": "image-museu-martins",
        "badge": None,
    },
    {
        "category_pt": "Natureza",
        "category_en": "Nature",
        "title_pt": "Serra da Penha",
        "title_en": "Penha Mountain",
        "description_pt": "Suba de teleférico ou a pé e descubra uma das melhores vistas panorâmicas sobre Guimarães.",
        "description_en": "Go up by cable car or on foot and enjoy one of the best panoramic views over Guimarães.",
        "image_class": "image-serra-penha",
        "badge": None,
    },
    {
        "category_pt": "Museus",
        "category_en": "Museums",
        "title_pt": "Museu Alberto Sampaio",
        "title_en": "Alberto Sampaio Museum",
        "description_pt": "Instalado no antigo convento da Colegiada, alberga peças de ourivesaria, escultura e têxteis medievais.",
        "description_en": "Housed in the former collegiate convent, it holds outstanding medieval goldwork, sculpture and textiles.",
        "image_class": "image-museu-alberto",
        "badge": None,
    },
    {
        "category_pt": "Palácios",
        "category_en": "Palaces",
        "title_pt": "Sala de Armas do Paço dos Duques",
        "title_en": "Dukes' Palace — Armoury",
        "description_pt": "Uma das salas mais imponentes do Paço, com uma vasta coleção de armaduras e armas históricas.",
        "description_en": "One of the palace's most impressive rooms, featuring a remarkable collection of armour and historic weapons.",
        "image_class": "image-paco-armas",
        "badge": None,
    },
    {
        "category_pt": "Monumentos",
        "category_en": "Monuments",
        "title_pt": "Muralhas Medievais",
        "title_en": "Medieval Walls",
        "description_pt": "Troços das antigas muralhas que cercavam a cidade medieval, testemunhas silenciosas de séculos de história.",
        "description_en": "Remaining sections of the walls that once enclosed the medieval city, silent witnesses to centuries of history.",
        "image_class": "image-muralhas",
        "badge": None,
    },
    {
        "category_pt": "Igrejas",
        "category_en": "Churches",
        "title_pt": "Igreja de São Francisco",
        "title_en": "São Francisco Church",
        "description_pt": "Igreja do século XV com belos azulejos barrocos e um claustro sereno no coração da cidade.",
        "description_en": "A 15th-century church with beautiful baroque azulejos and a serene cloister in the heart of the city.",
        "image_class": "image-sao-francisco",
        "badge": None,
    },
    {
        "category_pt": "Cultura",
        "category_en": "Culture",
        "title_pt": "Plataforma das Artes e da Cultura",
        "title_en": "Platform for Arts and Culture",
        "description_pt": "Espaço cultural contemporâneo com exposições, workshops e uma programação vibrante ao longo do ano.",
        "description_en": "A contemporary cultural space with exhibitions, workshops and a vibrant programme throughout the year.",
        "image_class": "image-plataforma-artes",
        "badge": None,
    },
    {
        "category_pt": "Natureza",
        "category_en": "Nature",
        "title_pt": "Parque da Cidade",
        "title_en": "City Park",
        "description_pt": "Um pulmão verde no coração de Guimarães, ideal para caminhadas, piqueniques e momentos de lazer.",
        "description_en": "A green lung in the heart of Guimarães, perfect for walks, picnics and relaxing moments.",
        "image_class": "image-parque-cidade",
        "badge": None,
    },
]


def init_db():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.execute("DROP TABLE IF EXISTS places")

    cur.execute("""
        CREATE TABLE places (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            category_pt TEXT    NOT NULL,
            category_en TEXT    NOT NULL,
            title_pt    TEXT    NOT NULL,
            title_en    TEXT    NOT NULL,
            description_pt TEXT NOT NULL,
            description_en TEXT NOT NULL,
            image_class TEXT    NOT NULL,
            badge       TEXT
        )
    """)

    cur.executemany("""
        INSERT INTO places
            (category_pt, category_en, title_pt, title_en,
             description_pt, description_en, image_class, badge)
        VALUES
            (:category_pt, :category_en, :title_pt, :title_en,
             :description_pt, :description_en, :image_class, :badge)
    """, PLACES)

    conn.commit()
    conn.close()
    print(f"Base de dados criada em '{DB_PATH}' com {len(PLACES)} pontos de interesse.")


if __name__ == "__main__":
    init_db()
