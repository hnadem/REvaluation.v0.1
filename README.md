# REvaluation.v0.1

MVP scaffold for Real Estate valuation (France + Luxembourg)
- Frontend: React + TypeScript + Leaflet (OSM tiles)
- Backend: FastAPI (Python)
- DB: PostgreSQL + PostGIS (for comparables)
- Geocoding / autocomplete: LocationIQ (OpenStreetMap provider)

Quickstart (local)
1. Copy `.env.example` -> `.env` and set variables (LocationIQ key, DB password).
2. Build & run:
   docker compose up --build
3. Frontend: http://localhost:3000
   Backend API: http://localhost:8000

Notes
- This scaffold includes an ETL stub for DVF (France) and comments explaining how to ingest data into PostGIS.
- Obtain a LocationIQ API key (free tier) and put it in `.env`.
- The `/api/estimate` endpoint returns placeholder values and shows how to integrate real comps later.
