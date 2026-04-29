"""
EdgeVisionNet Platform — Main FastAPI Application
Mounts all routers, configures CORS, handles auth endpoints.
"""

import os
from datetime import datetime

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

# Internal modules
from database import User, get_db, init_db
from auth import hash_password, verify_password, create_access_token, get_current_user
from telemetry import router as telemetry_router
from prediction import router as prediction_router

# ---------------------------------------------------------------------------
# App Initialisation
# ---------------------------------------------------------------------------

app = FastAPI(
    title       = "EdgeVisionNet API",
    description = "Live Edge AI Energy Intelligence Platform — Backend API",
    version     = "1.0.0",
    docs_url    = "/docs",
    redoc_url   = "/redoc",
)

# ---------------------------------------------------------------------------
# CORS — allow Next.js frontend on port 3000
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins     = ["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials = True,
    allow_methods     = ["*"],
    allow_headers     = ["*"],
)

# ---------------------------------------------------------------------------
# Include Routers
# ---------------------------------------------------------------------------
app.include_router(telemetry_router)
app.include_router(prediction_router)


# ---------------------------------------------------------------------------
# Startup: Initialise DB
# ---------------------------------------------------------------------------

@app.on_event("startup")
def on_startup():
    init_db()
    print("🚀 EdgeVisionNet API started — http://localhost:8000/docs")


# ---------------------------------------------------------------------------
# Auth Schemas
# ---------------------------------------------------------------------------

class SignupRequest(BaseModel):
    name:     str
    email:    str
    password: str


class LoginRequest(BaseModel):
    email:    str
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type:   str = "bearer"
    user: dict


# ---------------------------------------------------------------------------
# Auth Endpoints
# ---------------------------------------------------------------------------

@app.post(
    "/signup",
    response_model = AuthResponse,
    status_code    = status.HTTP_201_CREATED,
    summary        = "Create a new user account",
)
def signup(body: SignupRequest, db: Session = Depends(get_db)):
    # Check duplicate email
    if db.query(User).filter(User.email == body.email).first():
        raise HTTPException(status_code=400, detail="Email already registered.")

    user = User(
        name          = body.name,
        email         = body.email,
        password_hash = hash_password(body.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.email})
    return {
        "access_token": token,
        "token_type":   "bearer",
        "user": {
            "id":         user.id,
            "name":       user.name,
            "email":      user.email,
            "created_at": user.created_at.isoformat(),
        },
    }


@app.post(
    "/login",
    response_model = AuthResponse,
    summary        = "Authenticate and receive a JWT",
)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail      = "Invalid email or password.",
        )

    token = create_access_token({"sub": user.email})
    return {
        "access_token": token,
        "token_type":   "bearer",
        "user": {
            "id":         user.id,
            "name":       user.name,
            "email":      user.email,
            "created_at": user.created_at.isoformat(),
        },
    }


@app.get("/me", summary="Get current authenticated user")
def me(current_user: User = Depends(get_current_user)):
    return {
        "id":         current_user.id,
        "name":       current_user.name,
        "email":      current_user.email,
        "created_at": current_user.created_at.isoformat(),
    }


# ---------------------------------------------------------------------------
# Health Check
# ---------------------------------------------------------------------------

@app.get("/health", tags=["System"])
def health():
    return {
        "status":    "healthy",
        "service":   "EdgeVisionNet API",
        "timestamp": datetime.utcnow().isoformat(),
    }
