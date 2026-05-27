# Pulse Iran Web — Setup Guide

## Local Development

### 1. Install frontend dependencies
```bash
cd ~/pulse-iran-web
npm install
cp .env.local.example .env.local
# Edit .env.local if API runs on a different port
npm run dev
```

### 2. Start the FastAPI backend
```bash
cd ~/telegram-channels
pip install -r api/requirements.txt
# Set env vars:
export ADMIN_PASSWORD=your-password
export ADMIN_JWT_SECRET=your-32-char-secret
uvicorn api.main:app --reload --port 8000
```

Visit: http://localhost:3000

---

## Production Deployment

### Prerequisites on server
- Node.js 20+
- PM2: `npm i -g pm2`
- Python 3.11+ with venv
- nginx + certbot

### 1. Clone frontend on server
```bash
git clone https://github.com/YOU/pulse-iran-web.git ~/pulse-iran-web
cd ~/pulse-iran-web
npm ci
cp .env.local.example .env.local
# Edit: NEXT_PUBLIC_API_URL=http://localhost:8000
npm run build
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 2. Install API dependencies
```bash
cd ~/telegram-channels
pip install -r api/requirements.txt
# Add to .env:
echo "ADMIN_PASSWORD=your-password" >> .env
echo "ADMIN_JWT_SECRET=$(openssl rand -hex 32)" >> .env
pm2 start api/ecosystem.config.js
pm2 save
```

### 3. nginx
```bash
sudo cp ~/pulse-iran-web/nginx.conf /etc/nginx/sites-available/pulse-iran
# Edit server_name to your domain
sudo ln -s /etc/nginx/sites-available/pulse-iran /etc/nginx/sites-enabled/
sudo certbot --nginx -d pulse-iran.com -d www.pulse-iran.com
sudo nginx -t && sudo systemctl reload nginx
```

### 4. GitHub Actions CI/CD
In your GitHub repo settings → Secrets → Actions, add:
- `DEPLOY_HOST` — server IP/hostname
- `DEPLOY_USER` — ssh user (e.g. `root`)
- `DEPLOY_SSH_KEY` — private SSH key (the server's authorized_keys must have the public key)
- `NEXT_PUBLIC_API_URL` — `http://localhost:8000` (or your domain)

On every push to `main`, the workflow builds and deploys automatically.

---

## Admin Panel

Visit: `https://your-domain.com/admin`

Login with the `ADMIN_PASSWORD` you set. The panel shows:
- **Dashboard**: today's posts, total posts, source breakdown, 7-day chart
- **Sources**: all configured sources with political lean, credibility, daily caps
- **Posts**: browsable list of all published posts
