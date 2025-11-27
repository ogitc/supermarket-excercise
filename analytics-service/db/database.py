import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.exc import ProgrammingError, OperationalError, IntegrityError


DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@db:5432/supermarket",
)

engine = create_engine(DATABASE_URL, future=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def init_db():
    from . import models
    try:
        Base.metadata.create_all(bind=engine, checkfirst=True)
    except (ProgrammingError, OperationalError, IntegrityError) as e:
        # If there is a race condition, the other service will retry and succeed.
        error_str = str(e).lower()
        if any(keyword in error_str for keyword in ["already exists", "duplicate key", "pg_type_typname"]):
            pass
        else:
            raise


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
