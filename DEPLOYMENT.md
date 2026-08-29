# QuantStudio — Production Deployment & Architecture Guide

This guide outlines how to deploy the **QuantStudio Strategy Backtesting Engine** as a production-grade SaaS product with containerization, security hardening, load balancing, and cloud infrastructure choices.

---

## 🏗️ Production Architecture Overview

```
                        ┌─────────────────────────┐
                        │      Client Browser     │
                        └────────────┬────────────┘
                                     │
                        ┌────────────▼────────────┐
                        │ Next.js App Router (UI) │
                        │  (Vercel / Cloudflare)  │
                        └────────────┬────────────┘
                                     │ HTTPS REST API
                        ┌────────────▼────────────┐
                        │  FastAPI Backend API    │
                        │ (GCP Cloud Run / AWS)   │
                        └──────┬───────────┬──────┘
                               │           │
                 ┌─────────────▼──┐     ┌──▼──────────────────┐
                 │ yfinance / Data│     │  Redis Cache Core   │
                 │   Providers    │     │  (Market Data/Rate) │
                 └────────────────┘     └─────────────────────┘
```

---

## 🔒 Production Hardening & Security Checklist

### 1. Python Code Execution Security
- **Execution Timeouts**: Enforce a hard 5-second CPU limit per backtest request to prevent infinite loops in custom user code (`exec()`).
- **AST Parsing / Sandbox**: Restricted globals (`pd`, `np` only) without access to OS system calls (`os`, `sys`, `subprocess`).
- **Worker Isolation**: In high-scale SaaS deployments, isolate backtest tasks using Celery worker processes or AWS Lambda / GCP Cloud Run container instances.

### 2. CORS Whitelisting & Environment Variables
- Set strict CORS origins in `backend/app/main.py`:
  ```bash
  ALLOWED_ORIGINS="https://quantstudio.yourdomain.com"
  ```
- Store all production secrets in environment variables (`.env`).

### 3. API Rate Limiting
- Add rate limiting (e.g. 30 backtests/minute per IP) using `slowapi` or Redis-backed rate limiting.

---

## 🐳 Option 1: Docker Compose (Single Server / VPS)

For deploying on a DigitalOcean Droplet, AWS EC2 instance, or Hetzner server:

1. **Clone the Repository & Set Environment Variables**:
   ```bash
   cp .env.example .env
   ```

2. **Build and Run the Production Stack**:
   ```bash
   docker compose up -d --build
   ```

3. **Verify Health Probes**:
   - Backend API: `http://your-server-ip:8001/health`
   - Next.js Web App: `http://your-server-ip:3000`

---

## ☁️ Option 2: Managed Cloud Deployment (Recommended)

### A. Deploy Frontend on Vercel (Free / High Performance)
1. Push project to GitHub.
2. Connect repository to [Vercel](https://vercel.com).
3. Set Root Directory to `frontend`.
4. Add Environment Variable:
   ```env
   NEXT_PUBLIC_API_URL=https://api-quantstudio.yourdomain.com
   ```

### B. Deploy Backend API on GCP Cloud Run / Render / Railway
1. **Render / Railway**: Connect GitHub repository, select `backend` folder, and use `backend/Dockerfile`.
2. **GCP Cloud Run**:
   ```bash
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/quantstudio-api ./backend
   gcloud run deploy quantstudio-api --image gcr.io/YOUR_PROJECT_ID/quantstudio-api --platform managed --allow-unauthenticated --port 8001
   ```

---

## 📈 Monitoring & Logging

- **Liveness Probes**: `/health` (returns `{"status": "healthy"}`)
- **Readiness Probes**: `/ready` (returns `{"status": "ready"}`)
- **Structured JSON Logging**: FastAPI structured logging with `structlog` for Grafana / CloudWatch / Datadog telemetry.
