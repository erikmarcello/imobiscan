# ImobiScan

Plataforma de inteligência imobiliária: analisa o mercado, ajuda a encontrar oportunidades de compra, compara imóveis e apresenta dados para clientes.

> Projeto em desenvolvimento.

## Stack

- **Front-end:** React + TypeScript + Tailwind CSS (Vite), gráficos com Recharts
- **Back-end:** Python + FastAPI + SQLAlchemy (SQLite em dev, pronto para PostgreSQL via `DATABASE_URL`)

## Rodando localmente

```bash
# API
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Front-end (outro terminal)
cd frontend
npm install
npm run dev
```

Abra http://localhost:5173.

## Roteiro

- [x] Estrutura e identidade visual
- [x] Cadastro de imóveis
- [x] Preço por m² e análise de mercado
- [ ] Comparação e detector de oportunidades
- [ ] Simulador financeiro
- [ ] Relatórios e IA

## Dados de demonstração

Na primeira execução a API cria 120 imóveis fictícios em 10 bairros do Rio de Janeiro. Os preços são aproximados e servem só para demonstrar a plataforma.
