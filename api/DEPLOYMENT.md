# Deployment Guide - Guinness Split the G API

This guide covers different deployment options for the Guinness Split the G API.

## Table of Contents

1. [Local Development](#local-development)
2. [Docker Deployment](#docker-deployment)
3. [Production Deployment](#production-deployment)
4. [Cloud Deployment Options](#cloud-deployment-options)

---

## Local Development

### Quick Start

```bash
cd api
chmod +x start.sh
./start.sh
```

The API will be available at `http://localhost:5000`

### Manual Setup

1. Create virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the application:
```bash
python app.py
```

---

## Docker Deployment

### Using Docker Compose (Recommended)

1. Build and run:
```bash
docker-compose up -d
```

2. View logs:
```bash
docker-compose logs -f
```

3. Stop:
```bash
docker-compose down
```

### Using Docker Directly

1. Build the image:
```bash
docker build -t guinness-split-api .
```

2. Run the container:
```bash
docker run -d -p 5000:5000 --name guinness-api guinness-split-api
```

3. Check logs:
```bash
docker logs -f guinness-api
```

4. Stop and remove:
```bash
docker stop guinness-api
docker rm guinness-api
```

---

## Production Deployment

### Prerequisites

- Python 3.11+
- Reverse proxy (nginx or Apache)
- SSL certificate (Let's Encrypt recommended)
- Process manager (systemd, supervisord, or PM2)

### Using Gunicorn (Recommended for Production)

1. Install Gunicorn:
```bash
pip install gunicorn
```

2. Create a Gunicorn configuration file `gunicorn_config.py`:
```python
bind = "0.0.0.0:5000"
workers = 4
worker_class = "sync"
timeout = 120
accesslog = "logs/access.log"
errorlog = "logs/error.log"
loglevel = "info"
```

3. Run with Gunicorn:
```bash
gunicorn -c gunicorn_config.py app:app
```

### Systemd Service

Create `/etc/systemd/system/guinness-api.service`:

```ini
[Unit]
Description=Guinness Split the G API
After=network.target

[Service]
Type=notify
User=www-data
WorkingDirectory=/var/www/guinness-api
Environment="FLASK_ENV=production"
ExecStart=/var/www/guinness-api/venv/bin/gunicorn -c gunicorn_config.py app:app
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable guinness-api
sudo systemctl start guinness-api
sudo systemctl status guinness-api
```

### Nginx Reverse Proxy

Create `/etc/nginx/sites-available/guinness-api`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/guinness-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Cloud Deployment Options

### AWS (Elastic Beanstalk)

1. Install EB CLI:
```bash
pip install awsebcli
```

2. Initialize:
```bash
eb init -p python-3.11 guinness-split-api
```

3. Create environment and deploy:
```bash
eb create guinness-api-env
eb deploy
```

### Google Cloud Platform (Cloud Run)

1. Build and push image:
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/guinness-api
```

2. Deploy:
```bash
gcloud run deploy guinness-api \
  --image gcr.io/PROJECT_ID/guinness-api \
  --platform managed \
  --allow-unauthenticated \
  --memory 2Gi
```

### Heroku

1. Create `Procfile`:
```
web: gunicorn app:app
```

2. Deploy:
```bash
heroku create guinness-split-api
git push heroku main
```

### DigitalOcean App Platform

1. Create `app.yaml`:
```yaml
name: guinness-split-api
services:
- name: api
  github:
    repo: your-username/your-repo
    branch: main
    deploy_on_push: true
  run_command: gunicorn app:app
  environment_slug: python
  instance_count: 1
  instance_size_slug: basic-xxs
  routes:
  - path: /
```

2. Deploy via DigitalOcean dashboard or CLI

---

## Environment Variables

Set these in production:

```bash
# Required
export FLASK_ENV=production
export SECRET_KEY=your-secret-key-here

# Optional
export CORS_ORIGINS=https://your-frontend.com
export LOG_LEVEL=INFO
```

---

## Health Checks

The API provides a health check endpoint:

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "guinness-split-scorer",
  "version": "1.0.0"
}
```

---

## Monitoring

### Basic Logging

Logs are written to:
- `logs/access.log` - Access logs
- `logs/error.log` - Error logs

### Application Monitoring

Consider integrating:
- **Sentry** - Error tracking
- **Datadog** - Application performance monitoring
- **New Relic** - Full-stack monitoring

---

## Performance Optimization

### Recommendations

1. **Enable caching** for repeated image analysis
2. **Use CDN** for static assets
3. **Scale horizontally** with multiple workers
4. **Optimize image processing** with GPU acceleration (if available)
5. **Implement rate limiting** to prevent abuse

### Scaling

For high traffic, consider:
- Load balancer (nginx, HAProxy, AWS ALB)
- Multiple Gunicorn workers
- Container orchestration (Kubernetes)
- Caching layer (Redis)

---

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Set strong SECRET_KEY
- [ ] Configure CORS properly
- [ ] Implement rate limiting
- [ ] Validate file uploads thoroughly
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets
- [ ] Enable firewall rules
- [ ] Implement authentication (if needed)
- [ ] Regular security audits

---

## Troubleshooting

### Common Issues

**502 Bad Gateway (Nginx)**
- Check if Gunicorn is running: `sudo systemctl status guinness-api`
- Check Gunicorn logs: `tail -f logs/error.log`

**Memory Issues**
- Increase worker timeout in Gunicorn config
- Reduce number of workers
- Increase instance size

**Slow Response Times**
- Optimize image processing
- Add caching
- Scale horizontally

---

## Backup and Recovery

Regularly backup:
- Application code (version control)
- Configuration files
- Uploaded images (if stored)
- Logs (for audit)

---

For questions or issues, refer to the main README.md or create an issue in the repository.
