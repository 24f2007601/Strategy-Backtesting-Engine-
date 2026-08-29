# QuantStudio — Comprehensive Frontend & Backend Production Deployment Guide

This document provides a step-by-step guide to deploying both the **Next.js Frontend** and **FastAPI Python Backend** for production.

---

## 📋 Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Method 1: Cloud Serverless Deployment (Recommended)](#2-method-1-cloud-serverless-deployment-recommended)
   - [A. Backend Deployment on Render / GCP Cloud Run](#a-backend-deployment-on-render--gcp-cloud-run)
   - [B. Frontend Deployment on Vercel](#b-frontend-deployment-on-vercel)
3. [Method 2: Single VPS / Docker Deployment (DigitalOcean / AWS EC2)](#3-method-2-single-vps--docker-deployment-digitalocean--aws-ec2)
   - [A. Docker Compose Setup](#a-docker-compose-setup)
   - [B. Nginx Reverse Proxy & SSL (HTTPS)](#b-nginx-reverse-proxy--ssl-https)
4. [Method 3: Security & Health Monitoring Checklist](#4-method-3-security--health-monitoring-checklist)

---

## 1. Architecture Overview

```
                      ┌─────────────────────────────────┐
                      │    User Browser (HTTPS)         │
                      └────────────────┬────────────────┘
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            │                                                     │
┌───────────▼─────────────────────┐     ┌─────────────────────────▼─────────┐
│ Next.js Web App (Frontend)       │     │ FastAPI Python Engine (Backend)   │
│ - Hosted on Vercel              │     │ - Hosted on Cloud Run / Render    │
│ - Port 3000 / Custom Domain     │     │ - Port 8001 / Custom Domain       │
└─────────────────────────────────┘     └────────────────────┬──────────────┘
                                                             │
                                                ┌────────────▼──────────────┐
                                                │ yfinance / Global Data    │
                                                │ In-Memory & Redis Cache   │
                                                └───────────────────────────┘
```

---

## 2. Method 1: Cloud Serverless Deployment (Recommended)

This method provides **zero server maintenance**, automatic scaling, free SSL certificates, and high availability.

### A. Backend Deployment on Render (or GCP Cloud Run / Railway)

#### Step A1: Push Code to GitHub
Ensure your latest repository code is committed to GitHub.

#### Step A2: Create Web Service on Render
1. Sign up at [Render.com](https://render.com).
2. Click **New +** → Select **Web Service**.
3. Connect your GitHub repository: `Strategy-Backtesting-Engine-`.
4. Configure service settings:
   - **Name**: `quantstudio-api`
   - **Root Directory**: `backend`
   - **Runtime**: `Docker`
   - **Dockerfile Path**: `backend/Dockerfile`
   - **Instance Type**: Free or Starter ($7/mo)

#### Step A3: Set Backend Environment Variables
In the Render dashboard under **Environment Variables**, add:
| Key | Value | Note |
|---|---|---|
| `PORT` | `8001` | Server port |
| `HOST` | `0.0.0.0` | Bind address |
| `ALLOWED_ORIGINS` | `https://your-frontend.vercel.app` | CORS security |

Click **Deploy Web Service**. Once deployed, Render will provide a live API URL:
`https://quantstudio-api.onrender.com`

---

### B. Frontend Deployment on Vercel

#### Step B1: Import Project to Vercel
1. Sign up at [Vercel.com](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Select your GitHub repository: `Strategy-Backtesting-Engine-`.

#### Step B2: Configure Vercel Build Settings
1. **Framework Preset**: Next.js
2. **Root Directory**: Click *Edit* and select **`frontend`**.
3. **Environment Variables**: Add your live backend URL:
   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_API_URL` | `https://quantstudio-api.onrender.com` |

#### Step B3: Deploy
Click **Deploy**. Vercel will compile the Next.js frontend and provide a global HTTPS domain:
`https://quantstudio.vercel.app`

---

## 3. Method 2: Single VPS / Docker Deployment (DigitalOcean / AWS EC2)

Deploy both frontend and backend on a single Linux server ($5–$12/month).

### A. Docker Compose Setup

1. **SSH into your server**:
   ```bash
   ssh root@YOUR_SERVER_IP
   ```

2. **Install Docker and Docker Compose**:
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   ```

3. **Clone your repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Strategy-Backtesting-Engine-.git
   cd Strategy-Backtesting-Engine-
   ```

4. **Configure Production `.env`**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env`:
   ```env
   ALLOWED_ORIGINS=http://YOUR_SERVER_IP:3000,https://yourdomain.com
   NEXT_PUBLIC_API_URL=http://YOUR_SERVER_IP:8001
   ```

5. **Start Docker Production Stack**:
   ```bash
   docker compose up -d --build
   ```

---

### B. Nginx Reverse Proxy & SSL (HTTPS)

To run on a custom domain (e.g. `app.yourdomain.com`) with free SSL:

1. **Install Nginx & Certbot**:
   ```bash
   sudo apt update && sudo apt install -y nginx certbot python3-certbot-nginx
   ```

2. **Configure Nginx Site (`/etc/nginx/sites-available/quantstudio`)**:
   ```nginx
   server {
       server_name app.yourdomain.com;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }

   server {
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://127.0.0.1:8001;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

3. **Enable Site & Obtain SSL**:
   ```bash
   sudo ln -s /etc/nginx/sites-available/quantstudio /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   sudo certbot --nginx -d app.yourdomain.com -d api.yourdomain.com
   ```

---

## 4. Method 3: Security & Health Monitoring Checklist

- [x] **Health Check Endpoints**: Verify `/health` (Liveness) and `/ready` (Readiness).
- [x] **CORS Origin Whitelist**: Ensure backend `ALLOWED_ORIGINS` restricts access to your frontend domain only.
- [x] **Non-Root Container Users**: Backend Docker container runs under `appuser` security profile.
- [x] **In-Memory & Redis Caching**: Automatic caching for stock data to avoid Yahoo Finance rate limits.
