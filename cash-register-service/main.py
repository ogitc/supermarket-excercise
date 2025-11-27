from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from db.database import SessionLocal, init_db
from api import router
from load_data import main as load_data_main


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Initializing database schema...")
    init_db()

    db = SessionLocal()
    try:
        load_data_main(db)
    finally:
        db.close()

    yield

app = FastAPI(title="Cash Register Service")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok", "service": "cash-register"}


app.include_router(router)
