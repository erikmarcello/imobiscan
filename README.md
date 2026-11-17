# ImobiScan

Plataforma de inteligência imobiliária: analisa o mercado, ajuda a encontrar oportunidades de compra, compara imóveis e apresenta dados para clientes.

> Projeto em desenvolvimento.

## Stack

- **Front-end:** React + TypeScript + Tailwind CSS (Vite)
- **Back-end:** Python + FastAPI

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
- [ ] Cadastro de imóveis
- [ ] Preço por m² e análise de mercado
- [ ] Comparação e detector de oportunidades
- [ ] Simulador financeiro
- [ ] Relatórios e IA
