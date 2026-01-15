from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

app = FastAPI(title="REvaluation API")

class EstimateRequest(BaseModel):
    property_type: str  # house|apartment|office
    lat: float
    lon: float
    surface_sqm: float
    rooms: Optional[int] = None
    floor: Optional[int] = None
    condition: int  # 1..5

class PriceRange(BaseModel):
    min: float
    median: float
    max: float

class SourceInfo(BaseModel):
    name: str
    dataset_url: Optional[str] = None
    matched_count: int

class EstimateResponse(BaseModel):
    price_per_sqm: PriceRange
    total_price: PriceRange
    comparables_count: int
    comps_date_range: Optional[List[str]] = None
    confidence_score: float
    confidence_label: str
    sources: List[SourceInfo]
    comps_sample: List[dict]
    method: str

@app.post("/api/estimate", response_model=EstimateResponse)
def estimate(req: EstimateRequest):
    # Placeholder algorithm (replace with real queries + weighting)
    base_ppsm = 4500  # €/m2 default for demo
    variance = 0.12
    min_ppsm = base_ppsm * (1 - variance)
    max_ppsm = base_ppsm * (1 + variance)
    median_ppsm = base_ppsm
    total_median = median_ppsm * req.surface_sqm

    # Example source info (to be filled by ETL queries)
    sources = [
        {"name": "DVF (France)", "dataset_url": "https://www.data.gouv.fr", "matched_count": 12},
        {"name": "Luxembourg open data", "dataset_url": "https://data.public.lu", "matched_count": 3}
    ]

    confidence = 0.6
    label = "medium"
    comps_sample = [
        {"lat": req.lat + 0.001, "lon": req.lon + 0.001, "date": "2025-10-12", "price": 380000, "surface": 80, "price_per_sqm": 4750}
    ]

    return {
        "price_per_sqm": {"min": min_ppsm, "median": median_ppsm, "max": max_ppsm},
        "total_price": {"min": min_ppsm * req.surface_sqm, "median": total_median, "max": max_ppsm * req.surface_sqm},
        "comparables_count": 15,
        "comps_date_range": ["2023-01-01", "2025-11-01"],
        "confidence_score": confidence,
        "confidence_label": label,
        "sources": sources,
        "comps_sample": comps_sample,
        "method": "comps"
    }
