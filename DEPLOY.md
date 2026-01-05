# Deployment Guide

## Docker

### Build Image

```bash
docker build -t ngx-blog:latest .
```

### Run with Docker Compose

```bash
# Copy environment file
cp .env.docker .env

# Start services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### With Redis

```bash
docker-compose --profile with-redis up -d
```

### With Nginx

```bash
docker-compose --profile with-nginx up -d
```

## Kubernetes

### Apply Manifests

```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Create secrets (update first!)
kubectl apply -f k8s/secret.yaml

# Create configmap
kubectl apply -f k8s/configmap.yaml

# Deploy PostgreSQL
kubectl apply -f k8s/postgres-deployment.yaml

# Deploy application
kubectl apply -f k8s/app-deployment.yaml

# Create ingress
kubectl apply -f k8s/ingress.yaml

# Create HPA
kubectl apply -f k8s/hpa.yaml
```

### Check Status

```bash
kubectl get all -n ngx-blog
kubectl logs -f deployment/ngx-blog-app -n ngx-blog
```

## Helm

### Install

```bash
# Add repository (if published)
helm repo add ngx-blog https://charts.example.com

# Install from local
helm install ngx-blog ./helm \
  --namespace ngx-blog \
  --create-namespace \
  --set image.repository=your-registry/ngx-blog \
  --set image.tag=1.0.0 \
  --set ingress.hosts[0].host=blog.example.com \
  --set secrets.jwtSecret=your-secret

# Or with values file
helm install ngx-blog ./helm -f values-prod.yaml
```

### Upgrade

```bash
helm upgrade ngx-blog ./helm --namespace ngx-blog
```

### Uninstall

```bash
helm uninstall ngx-blog --namespace ngx-blog
```

## Production Checklist

- [ ] Change all default passwords
- [ ] Set strong JWT_SECRET
- [ ] Configure SSL/TLS certificates
- [ ] Set up database backups
- [ ] Configure monitoring (Prometheus/Grafana)
- [ ] Set up logging (ELK/Loki)
- [ ] Configure CDN for static assets
- [ ] Set resource limits
- [ ] Enable HPA
- [ ] Set up CI/CD pipeline
- [ ] Configure external secrets manager
- [ ] Set up disaster recovery
