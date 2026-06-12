# Deployment Guide — UST × Premera Engagement Portal

## Docker (Recommended)

### Files added
| File | Purpose |
|---|---|
| `Dockerfile` | Multi-stage build — Node builds, Nginx serves |
| `nginx.conf` | Nginx config with React Router & asset caching |
| `docker-compose.yml` | One-command run |
| `.dockerignore` | Keeps the image lean |

### Deploy on the Linux server

```bash
# 1. Clone / pull latest code
git clone https://github.com/vinothust/premera-engagement.git
cd premera-engagement

# 2. Build and start (runs on port 80)
docker compose up -d --build
```

**That's it.** The container builds the React app internally — no local `npm run build` needed.

### Common commands
```bash
# View logs
docker compose logs -f

# Stop
docker compose down

# Rebuild after code changes
docker compose up -d --build

# Check running containers
docker ps
```

### Run on a different port (e.g. 8080)
Edit `docker-compose.yml`:
```yaml
ports:
  - "8080:80"
```
Then run `docker compose up -d --build`.

---

## Manual Deploy (without Docker)

## 1. Build Locally (Windows)

```powershell
npm run build
```

This produces a `dist/` folder containing the static site.

---

## 2. Copy `dist/` to the Linux Server

**Using SCP:**
```bash
scp -r dist/ user@your-server-ip:/var/www/premera-portal
```

**Using rsync (recommended for re-deploys — only transfers changes):**
```bash
rsync -avz --delete dist/ user@your-server-ip:/var/www/premera-portal
```

---

## 3. Nginx Configuration (on the Linux server)

Create the site config:
```bash
sudo nano /etc/nginx/sites-available/premera-portal
```

Paste the following:
```nginx
server {
    listen 80;
    server_name your-domain.com;   # or your server IP

    root /var/www/premera-portal;
    index index.html;

    # Required for React Router (client-side routing)
    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
}
```

Enable the site and reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/premera-portal /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 4. HTTPS with Let's Encrypt (Optional but Recommended)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

Certbot will automatically update the Nginx config with SSL settings and set up auto-renewal.

---

## Notes

- **Sub-path deployment** — If the app is served from a sub-path (e.g. `https://your-server.com/portal/`), add a `base` option to `vite.config.ts` before building:
  ```ts
  export default defineConfig({
    base: '/portal/',
    plugins: [react()],
  })
  ```
- **Re-deploy** — Repeat steps 1 and 2. No server restart needed (Nginx serves static files directly).
- **Firewall** — Ensure ports `80` (HTTP) and `443` (HTTPS) are open on the server.
