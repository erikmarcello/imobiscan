from datetime import date

from pydantic import BaseModel, ConfigDict, Field

TIPOS = ("Apartamento", "Casa", "Cobertura", "Sala comercial")


class ImovelBase(BaseModel):
    titulo: str = Field(min_length=3, max_length=120)
    bairro: str = Field(min_length=2, max_length=60)
    tipo: str = Field(default="Apartamento")
    area_m2: float = Field(gt=0)
    quartos: int = Field(default=0, ge=0)
    vagas: int = Field(default=0, ge=0)
    preco: float = Field(gt=0)
    condominio: float = Field(default=0, ge=0)
    iptu: float = Field(default=0, ge=0)
    lat: float | None = None
    lng: float | None = None
    anunciado_em: date | None = None
    descricao: str = ""


class ImovelCreate(ImovelBase):
    pass


class ImovelUpdate(ImovelBase):
    pass


class ImovelOut(ImovelBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    anunciado_em: date
    preco_m2: float
