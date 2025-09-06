# 🚀 Deployment Guide - Project Delta

## Deployment Overview

Project Delta je připravena pro deployment na různé platformy díky Astro SSR adaptéru pro Node.js.

## Prerequisites

### System Requirements

- **Node.js**: 18.x nebo vyšší
- **npm**: 9.x nebo vyšší
- **RAM**: Minimum 512MB, doporučeno 1GB
- **Storage**: Minimum 1GB volného místa
- **OS**: Linux, macOS, Windows Server

### Required Services

- **Email Service**: Resend API
- **Domain**: Vlastní doména s DNS přístupem
- **SSL Certificate**: Let's Encrypt nebo jiný

## Environment Variables

### 1. Vytvoření .env souboru

```bash
# Zkopírujte template
cp .env.example .env

# Editujte proměnné
nano .env
```

### 2. Požadované proměnné

```env
# Email Service
RESEND_API_KEY="re_xxxxxxxxxx"

# MCP Server Keys (pokud používáte)
BRAVE_API_KEY="BSAxxxxxxxxxx"
SUPABASE_ACCESS_TOKEN="sbp_xxxxxxxxxx"

# Application
NODE_ENV="production"
PORT=4321
HOST="0.0.0.0"
```

### 3. Validace environment

```bash
# Script pro kontrolu env variables
node -e "
const required = ['RESEND_API_KEY'];
const missing = required.filter(key => !process.env[key]);
if (missing.length) {
  console.error('Missing env vars:', missing);
  process.exit(1);
}
console.log('✅ All required env vars present');
"
```

## Build Process

### 1. Install Dependencies

```bash
# Clean install
npm ci --production=false

# Nebo standard install
npm install
```

### 2. Run Tests

```bash
# Lint check
npm run lint

# Type check
npx tsc --noEmit

# Format check
npm run format:check
```

### 3. Production Build

```bash
# Build aplikace
npm run build

# Výstup bude v ./dist
ls -la dist/
```

### 4. Test Production Build

```bash
# Lokální test produkční verze
npm run preview

# Otevřete http://localhost:4321
```

## Deployment Platforms

### Option 1: VPS (DigitalOcean, Linode, AWS EC2)

#### Setup Script

```bash
#!/bin/bash
# deploy-vps.sh

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone https://github.com/your-repo/project-delta.git
cd project-delta

# Install dependencies
npm ci --production=false

# Build
npm run build

# Setup environment
cp .env.example .env
# Edit .env with your values

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### PM2 Configuration

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'project-delta',
      script: './dist/server/entry.mjs',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 4321,
      },
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      watch: false,
      max_memory_restart: '1G',
      cron_restart: '0 2 * * *',
    },
  ],
};
```

### Option 2: Vercel

#### vercel.json

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "astro",
  "functions": {
    "dist/server/entry.mjs": {
      "maxDuration": 30
    }
  }
}
```

#### Deploy Command

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Option 3: Netlify

#### netlify.toml

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "dist/server"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
```

### Option 4: Docker

#### Dockerfile

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --production=false

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install production dependencies only
RUN npm ci --production

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

# Expose port
EXPOSE 4321

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4321/api/health', (r) => {r.statusCode === 200 ? process.exit(0) : process.exit(1)})"

# Start application
CMD ["node", "./dist/server/entry.mjs"]
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '4321:4321'
    environment:
      - NODE_ENV=production
      - PORT=4321
      - HOST=0.0.0.0
    env_file:
      - .env
    restart: unless-stopped
    logging:
      driver: 'json-file'
      options:
        max-size: '10m'
        max-file: '3'
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:4321/api/health']
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

## Nginx Configuration

### Reverse Proxy Setup

```nginx
# /etc/nginx/sites-available/project-delta
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;

    # Proxy Settings
    location / {
        proxy_pass http://localhost:4321;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|webp|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## SSL Certificate

### Let's Encrypt Setup

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal
sudo certbot renew --dry-run

# Add to crontab
0 0,12 * * * /usr/bin/certbot renew --quiet
```

## Monitoring & Logging

### 1. Application Monitoring

```bash
# PM2 Monitoring
pm2 monit

# PM2 Logs
pm2 logs

# PM2 Status
pm2 status
```

### 2. System Monitoring

```bash
# Install monitoring tools
sudo apt install htop nethogs iotop

# Check resource usage
htop

# Check network usage
sudo nethogs

# Check disk I/O
sudo iotop
```

### 3. Log Management

```bash
# Application logs
tail -f /var/log/project-delta/app.log

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# System logs
journalctl -u project-delta -f
```

### 4. Health Checks

```javascript
// Add health endpoint to src/pages/api/health.ts
export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
```

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: |
          npm run lint
          npx tsc --noEmit

      - name: Build
        run: npm run build

      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/project-delta
            git pull origin main
            npm ci --production=false
            npm run build
            pm2 restart project-delta
```

## Backup Strategy

### 1. Code Backup

```bash
# Git repository (automatic)
git push origin main

# Additional backup
tar -czf backup-$(date +%Y%m%d).tar.gz /var/www/project-delta
```

### 2. Environment Backup

```bash
# Backup .env file
cp .env .env.backup-$(date +%Y%m%d)

# Encrypt sensitive backup
gpg -c .env.backup-*
```

### 3. Automated Backups

```bash
# Cron job for daily backups
0 3 * * * /usr/local/bin/backup-project-delta.sh
```

## Rollback Procedure

### Quick Rollback

```bash
# Using PM2
pm2 restart project-delta --update-env

# Using Git
git revert HEAD
npm run build
pm2 restart project-delta

# Using Docker
docker-compose down
docker-compose up -d --build
```

## Performance Optimization

### 1. CDN Setup (Cloudflare)

```bash
# DNS Settings
A record: @ -> your-server-ip
CNAME: www -> your-domain.com

# Cloudflare Settings
- SSL: Full (strict)
- Caching: Standard
- Minification: HTML, CSS, JS
- Brotli: On
```

### 2. Database Optimization (Future)

```sql
-- Indexes for common queries
CREATE INDEX idx_forms_email ON forms(email);
CREATE INDEX idx_forms_created_at ON forms(created_at);
```

### 3. Redis Setup (Future)

```bash
# Install Redis
sudo apt install redis-server

# Configure Redis
sudo nano /etc/redis/redis.conf
# maxmemory 256mb
# maxmemory-policy allkeys-lru

# Restart Redis
sudo systemctl restart redis
```

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Find process using port
sudo lsof -i :4321

# Kill process
sudo kill -9 <PID>
```

#### Permission Denied

```bash
# Fix permissions
sudo chown -R www-data:www-data /var/www/project-delta
sudo chmod -R 755 /var/www/project-delta
```

#### Memory Issues

```bash
# Increase Node memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

#### SSL Certificate Issues

```bash
# Renew certificate
sudo certbot renew --force-renewal

# Check certificate
openssl x509 -in /etc/letsencrypt/live/your-domain.com/cert.pem -text -noout
```

## Security Checklist

Pre-deployment:

- [ ] Environment variables set
- [ ] HTTPS configured
- [ ] Security headers enabled
- [ ] Rate limiting configured
- [ ] Firewall rules set
- [ ] SSH key-only access
- [ ] Fail2ban installed
- [ ] Regular backups scheduled

Post-deployment:

- [ ] Monitor logs for errors
- [ ] Check SSL certificate
- [ ] Test all endpoints
- [ ] Verify email sending
- [ ] Check performance metrics
- [ ] Security scan (OWASP ZAP)

## Support

### Deployment Support

- **Documentation**: This guide
- **Issues**: GitHub Issues
- **Email**: deploy-support@vojtechkochta.cz
- **Emergency**: +420 XXX XXX XXX

---

_Deployment Guide v1.0.0_
_Last Updated: December 2024_
