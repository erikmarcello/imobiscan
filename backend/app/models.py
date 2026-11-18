from datetime import date

from sqlalchemy import Date, Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from .db import Base


class Imovel(Base):
    __tablename__ = "imoveis"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    titulo: Mapped[str] = mapped_column(String(120))
    bairro: Mapped[str] = mapped_column(String(60), index=True)
    tipo: Mapped[str] = mapped_column(String(30), index=True)
    area_m2: Mapped[float] = mapped_column(Float)
    quartos: Mapped[int] = mapped_column(Integer, default=0)
    vagas: Mapped[int] = mapped_column(Integer, default=0)
    preco: Mapped[float] = mapped_column(Float)
    condominio: Mapped[float] = mapped_column(Float, default=0)
    iptu: Mapped[float] = mapped_column(Float, default=0)
    lat: Mapped[float | None] = mapped_column(Float, nullable=True)
    lng: Mapped[float | None] = mapped_column(Float, nullable=True)
    anunciado_em: Mapped[date] = mapped_column(Date, default=date.today)
    descricao: Mapped[str] = mapped_column(Text, default="")

    @property
    def preco_m2(self) -> float:
        return round(self.preco / self.area_m2, 2) if self.area_m2 else 0.0
