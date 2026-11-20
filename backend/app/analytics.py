"""Cálculos de mercado: preço por m², estatísticas por bairro e tendência mensal."""
from collections import defaultdict
from statistics import mean, median

from .models import Imovel


def _stats(valores: list[float]) -> dict:
    return {
        "media": round(mean(valores), 2),
        "mediana": round(median(valores), 2),
        "minimo": round(min(valores), 2),
        "maximo": round(max(valores), 2),
    }


def resumo_geral(imoveis: list[Imovel]) -> dict:
    if not imoveis:
        return {"total": 0, "preco_medio": 0, "preco_m2_medio": 0, "area_media": 0, "bairros": 0}
    return {
        "total": len(imoveis),
        "preco_medio": round(mean(i.preco for i in imoveis), 2),
        "preco_m2_medio": round(mean(i.preco_m2 for i in imoveis), 2),
        "area_media": round(mean(i.area_m2 for i in imoveis), 1),
        "bairros": len({i.bairro for i in imoveis}),
    }


def por_bairro(imoveis: list[Imovel]) -> list[dict]:
    grupos: dict[str, list[Imovel]] = defaultdict(list)
    for i in imoveis:
        grupos[i.bairro].append(i)
    linhas = []
    for bairro, lista in grupos.items():
        m2 = _stats([i.preco_m2 for i in lista])
        linhas.append(
            {
                "bairro": bairro,
                "quantidade": len(lista),
                "preco_medio": round(mean(i.preco for i in lista), 2),
                "preco_m2_medio": m2["media"],
                "preco_m2_mediano": m2["mediana"],
                "preco_m2_min": m2["minimo"],
                "preco_m2_max": m2["maximo"],
            }
        )
    return sorted(linhas, key=lambda l: l["preco_m2_mediano"], reverse=True)


def tendencia_mensal(imoveis: list[Imovel]) -> dict:
    """Índice mensal de preço por m².

    Cada anúncio é comparado com a mediana do seu bairro, para que a mistura de bairros
    em um mês não distorça a tendência. O índice é convertido de volta para R$/m².
    """
    if not imoveis:
        return {"serie": [], "variacao_pct": 0.0}

    por_bairro_m2: dict[str, list[float]] = defaultdict(list)
    for i in imoveis:
        por_bairro_m2[i.bairro].append(i.preco_m2)
    mediana_bairro = {b: median(v) for b, v in por_bairro_m2.items()}
    base = median(i.preco_m2 for i in imoveis)

    grupos: dict[str, list[float]] = defaultdict(list)
    for i in imoveis:
        grupos[i.anunciado_em.strftime("%Y-%m")].append(i.preco_m2 / mediana_bairro[i.bairro])

    serie = [
        {"mes": m, "preco_m2_indice": round(median(grupos[m]) * base, 2), "anuncios": len(grupos[m])}
        for m in sorted(grupos)
    ]

    variacao = 0.0
    if len(serie) >= 6:
        inicio = mean(p["preco_m2_indice"] for p in serie[:3])
        fim = mean(p["preco_m2_indice"] for p in serie[-3:])
        variacao = (fim / inicio - 1) * 100
    return {"serie": serie, "variacao_pct": round(variacao, 1)}
