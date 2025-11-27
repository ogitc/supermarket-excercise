from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from db.database import init_db
from api import router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure database schema exists (tables are created by db-init container)
    print("Verifying database schema...")
    init_db()
    yield

app = FastAPI(
    title="Cash Register Service",
    lifespan=lifespan,
)


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
