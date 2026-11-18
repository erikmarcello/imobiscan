from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.orm import Session

from . import models, schemas
from .db import Base, SessionLocal, engine, get_db
from .seed import popular_se_vazio


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        popular_se_vazio(db)
    yield


app = FastAPI(title="ImobiScan API", version="0.2.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/imoveis", response_model=list[schemas.ImovelOut])
def listar_imoveis(
    bairro: str | None = None,
    tipo: str | None = None,
    quartos_min: int | None = Query(None, ge=0),
    preco_max: float | None = Query(None, gt=0),
    busca: str | None = None,
    db: Session = Depends(get_db),
):
    q = select(models.Imovel)
    if bairro:
        q = q.where(models.Imovel.bairro == bairro)
    if tipo:
        q = q.where(models.Imovel.tipo == tipo)
    if quartos_min is not None:
        q = q.where(models.Imovel.quartos >= quartos_min)
    if preco_max is not None:
        q = q.where(models.Imovel.preco <= preco_max)
    if busca:
        q = q.where(models.Imovel.titulo.ilike(f"%{busca}%"))
    return db.scalars(q.order_by(models.Imovel.anunciado_em.desc())).all()


@app.get("/api/imoveis/{imovel_id}", response_model=schemas.ImovelOut)
def obter_imovel(imovel_id: int, db: Session = Depends(get_db)):
    imovel = db.get(models.Imovel, imovel_id)
    if not imovel:
        raise HTTPException(404, "Imóvel não encontrado")
    return imovel


@app.post("/api/imoveis", response_model=schemas.ImovelOut, status_code=201)
def criar_imovel(dados: schemas.ImovelCreate, db: Session = Depends(get_db)):
    valores = dados.model_dump(exclude_none=True)
    imovel = models.Imovel(**valores)
    db.add(imovel)
    db.commit()
    db.refresh(imovel)
    return imovel


@app.put("/api/imoveis/{imovel_id}", response_model=schemas.ImovelOut)
def atualizar_imovel(imovel_id: int, dados: schemas.ImovelUpdate, db: Session = Depends(get_db)):
    imovel = db.get(models.Imovel, imovel_id)
    if not imovel:
        raise HTTPException(404, "Imóvel não encontrado")
    for campo, valor in dados.model_dump(exclude_none=True).items():
        setattr(imovel, campo, valor)
    db.commit()
    db.refresh(imovel)
    return imovel


@app.delete("/api/imoveis/{imovel_id}", status_code=204)
def remover_imovel(imovel_id: int, db: Session = Depends(get_db)):
    imovel = db.get(models.Imovel, imovel_id)
    if not imovel:
        raise HTTPException(404, "Imóvel não encontrado")
    db.delete(imovel)
    db.commit()


@app.get("/api/bairros", response_model=list[str])
def listar_bairros(db: Session = Depends(get_db)):
    return db.scalars(select(models.Imovel.bairro).distinct().order_by(models.Imovel.bairro)).all()
