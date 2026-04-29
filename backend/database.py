"""
EdgeVisionNet Platform — Database Models & Session Management
SQLAlchemy ORM with SQLite (upgrade-ready to PostgreSQL).
"""

from sqlalchemy import (
    create_engine, Column, Integer, Float, String,
    Boolean, DateTime, ForeignKey, Text
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

# ---------------------------------------------------------------------------
# Engine Configuration
# ---------------------------------------------------------------------------
DATABASE_URL = "sqlite:///./edgevisionnet.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},  # Required for SQLite + FastAPI
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# ---------------------------------------------------------------------------
# ORM Models
# ---------------------------------------------------------------------------

class User(Base):
    """Platform user account."""
    __tablename__ = "users"

    id            = Column(Integer, primary_key=True, index=True)
    name          = Column(String(100), nullable=False)
    email         = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at    = Column(DateTime, default=datetime.utcnow)

    # Relationships
    devices     = relationship("Device", back_populates="owner", cascade="all, delete-orphan")
    predictions = relationship("Prediction", back_populates="user", cascade="all, delete-orphan")


class Device(Base):
    """Registered edge device (laptop / android / other)."""
    __tablename__ = "devices"

    id          = Column(Integer, primary_key=True, index=True)
    user_id     = Column(Integer, ForeignKey("users.id"), nullable=False)
    device_name = Column(String(100), nullable=False)
    device_type = Column(String(50), default="laptop")   # laptop | android | raspberry_pi
    device_id   = Column(String(100), unique=True, index=True, nullable=False)
    status      = Column(String(20), default="offline")  # online | offline
    last_seen   = Column(DateTime, default=datetime.utcnow)

    owner             = relationship("User", back_populates="devices")
    telemetry_records = relationship("Telemetry", back_populates="device", cascade="all, delete-orphan")


class Telemetry(Base):
    """Time-series telemetry snapshot from an edge device."""
    __tablename__ = "telemetry"

    id        = Column(Integer, primary_key=True, index=True)
    device_id = Column(String(100), ForeignKey("devices.device_id"), index=True, nullable=False)
    cpu       = Column(Float, default=0.0)      # CPU usage %
    ram       = Column(Float, default=0.0)      # RAM usage %
    battery   = Column(Float, default=0.0)      # Battery %
    temp      = Column(Float, default=0.0)      # Temperature °C
    power_w   = Column(Float, default=0.0)      # Estimated power Watts
    charging  = Column(Boolean, default=False)
    cpu_freq  = Column(Float, default=0.0)      # MHz
    disk      = Column(Float, default=0.0)      # Disk usage %
    net_sent  = Column(Float, default=0.0)      # MB sent since boot
    net_recv  = Column(Float, default=0.0)      # MB recv since boot
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

    device = relationship("Device", back_populates="telemetry_records")


class Prediction(Base):
    """Record of a single AI inference run."""
    __tablename__ = "predictions"

    id              = Column(Integer, primary_key=True, index=True)
    user_id         = Column(Integer, ForeignKey("users.id"), nullable=False)
    device_id       = Column(String(100), nullable=True)
    model_name      = Column(String(100), default="MobileNetV2")
    predicted_class = Column(String(200), nullable=False)
    confidence      = Column(Float, nullable=False)      # 0.0 – 1.0
    latency_ms      = Column(Float, nullable=False)      # milliseconds
    energy_wh       = Column(Float, nullable=False)      # watt-hours
    timestamp       = Column(DateTime, default=datetime.utcnow, index=True)

    user = relationship("User", back_populates="predictions")


# ---------------------------------------------------------------------------
# Dependency Injection Helper
# ---------------------------------------------------------------------------

def get_db():
    """FastAPI dependency that yields a DB session and always closes it."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create all tables if they don't exist yet."""
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables initialized.")
