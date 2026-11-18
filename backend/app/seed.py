"""Dados de demonstração: imóveis fictícios em bairros do Rio de Janeiro.

Os preços por m² de referência são aproximados e servem apenas para demonstrar a plataforma.
"""
import random
from datetime import date, timedelta

from sqlalchemy.orm import Session

from .models import Imovel

# bairro: (lat, lng, preço médio do m² de referência)
BAIRROS = {
    "Barra da Tijuca": (-23.0004, -43.3659, 12500),
    "Recreio": (-23.0186, -43.4622, 9200),
    "Jacarepaguá": (-22.9637, -43.3640, 6800),
    "Jardim Sulacap": (-22.8846, -43.3986, 5200),
    "Tijuca": (-22.9255, -43.2328, 9600),
    "Copacabana": (-22.9711, -43.1863, 14200),
    "Botafogo": (-22.9519, -43.1846, 15300),
    "Méier": (-22.9024, -43.2786, 6100),
    "Campo Grande": (-22.9035, -43.5617, 4300),
    "Leblon": (-22.9846, -43.2234, 24800),
}

TIPOS = [("Apartamento", 0.70), ("Casa", 0.12), ("Cobertura", 0.10), ("Sala comercial", 0.08)]


def _tipo(rng: random.Random) -> str:
    r, acc = rng.random(), 0.0
    for nome, peso in TIPOS:
        acc += peso
        if r <= acc:
            return nome
    return "Apartamento"


def gerar_imoveis(qtd_por_bairro: int = 7, semente: int = 42) -> list[Imovel]:
    rng = random.Random(semente)
    hoje = date.today()
    imoveis = []
    for bairro, (lat, lng, m2_ref) in BAIRROS.items():
        for _ in range(qtd_por_bairro):
            tipo = _tipo(rng)
            if tipo == "Sala comercial":
                area, quartos = rng.randint(25, 90), 0
            elif tipo == "Casa":
                area, quartos = rng.randint(90, 320), rng.randint(2, 5)
            elif tipo == "Cobertura":
                area, quartos = rng.randint(120, 300), rng.randint(3, 4)
            else:
                area, quartos = rng.randint(40, 160), rng.randint(1, 4)

            fator = rng.uniform(0.85, 1.18)
            if rng.random() < 0.12:  # alguns anúncios bem abaixo do mercado
                fator = rng.uniform(0.68, 0.80)
            if tipo == "Cobertura":
                fator *= 1.15

            preco = round(area * m2_ref * fator, -3)
            imoveis.append(
                Imovel(
                    titulo=f"{tipo} {quartos} quartos em {bairro}" if quartos else f"{tipo} em {bairro}",
                    bairro=bairro,
                    tipo=tipo,
                    area_m2=area,
                    quartos=quartos,
                    vagas=rng.randint(0, 3) if tipo != "Sala comercial" else rng.randint(0, 1),
                    preco=preco,
                    condominio=0 if tipo == "Casa" else round(area * rng.uniform(8, 16), -1),
                    iptu=round(preco * rng.uniform(0.0008, 0.0015) / 12, -1),  # mensal
                    lat=round(lat + rng.uniform(-0.012, 0.012), 6),
                    lng=round(lng + rng.uniform(-0.012, 0.012), 6),
                    anunciado_em=hoje - timedelta(days=rng.randint(0, 365)),
                    descricao="Imóvel de demonstração.",
                )
            )
    return imoveis


def popular_se_vazio(db: Session) -> int:
    if db.query(Imovel).first():
        return 0
    imoveis = gerar_imoveis()
    db.add_all(imoveis)
    db.commit()
    return len(imoveis)
