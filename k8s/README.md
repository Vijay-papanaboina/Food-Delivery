# Food Delivery Kubernetes Deployment

This directory contains all Kubernetes manifests for deploying the Food Delivery application.

## Directory Structure

```
k8s/
├── base/                  # Base configurations
│   └── namespace.yaml     # Application namespace
├── secrets/               # Secret configurations
│   └── app-secrets.yaml   # Application secrets (DB, JWT, Stripe)
├── configmaps/           # ConfigMap resources
│   └── kafka-config.yaml
├── infrastructure/       # Infrastructure services
│   ├── mongo/             # MongoDB configuration
│   │   ├── deployment.yaml
│   │   └── service.yaml
│   ├── kafka-deployment.yaml
│   └── zookeeper-deployment.yaml
├── microservices/       # Backend microservices
│   ├── user-service.yaml
│   ├── order-service.yaml
│   ├── payment-service.yaml
│   ├── delivery-service.yaml
│   ├── restaurant-service.yaml
│   └── notification-service.yaml
├── frontends/           # Frontend applications
│   ├── customers-frontend.yaml
│   ├── drivers-frontend.yaml
│   └── restaurants-frontend.yaml
└── ingress/            # Ingress configurations
    └── ingress.yaml
```

## Prerequisites

1. **Kubernetes Cluster** (v1.24+)

   - Minikube, Docker Desktop, or cloud provider (GKE, EKS, AKS)

2. **kubectl** installed and configured

3. **NGINX Ingress Controller**

   ```bash
   kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml
   ```

4. **Docker Images**
   - Build and push all Docker images to your registry
   - Update image names in deployment files

## Deployment Steps

### 1. Update Configuration

**Important:** Before deploying, update the following:

1. **Secrets** (`secrets/app-secrets.yaml`):
   - **Security Note:** Do NOT commit real secrets to git. The `secrets/` directory is ignored.
   - Copy the example secrets:
     ```bash
     cp -r k8s/secrets-example k8s/secrets
     ```
   - Edit `k8s/secrets/app-secrets.yaml`. **Note:** This file uses `data`, so values must be **Base64 encoded**.
   - To encode a value:
     ```bash
     echo -n "your-secret-value" | base64
     ```
   - Replace the placeholders with your encoded real values:
     - `MONGO_ROOT_PASSWORD`
     - `MONGO_URI_*`
     - `JWT_SECRET` & `REFRESH_TOKEN_SECRET`
     - `STRIPE_*` keys

2. **Image Registry** (all deployment files):
   - Replace `your-registry/` with your actual registry
   - Example: `docker.io/yourusername/` or `gcr.io/yourproject/`
   - **Private Registry:** If using a private registry, verify `k8s/secrets/ghcr-secret.yaml` is configured.
   - **Public Registry:** If your images are public, you do **not** need `ghcr-secret.yaml`. However, you must remove the `imagePullSecrets` section from the deployment YAMLs in `k8s/microservices/` and `k8s/frontends/`.

### 2. Deploy Infrastructure First

```bash
# Create namespace
kubectl apply -f base/namespace.yaml

# Apply secrets and configmaps
kubectl apply -f secrets/
kubectl apply -f configmaps/

# Deploy infrastructure (order matters)
kubectl apply -f infrastructure/zookeeper-deployment.yaml
kubectl apply -f infrastructure/kafka-deployment.yaml
kubectl apply -f infrastructure/mongo/

# Wait for infrastructure to be ready
kubectl wait --for=condition=ready pod -l app=zookeeper -n food-delivery --timeout=300s
kubectl wait --for=condition=ready pod -l app=kafka -n food-delivery --timeout=300s
kubectl wait --for=condition=ready pod -l app=mongo -n food-delivery --timeout=300s
```

### 3. Database Initialization

MongoDB with Mongoose handles schema creation automatically. For initial data:

```bash
# (Optional) Run a seeding job if you have one configured, 
# or exec into a service pod to run the seed script if available.
# Example:
# kubectl exec -it <backend-service-pod> -n food-delivery -- npm run seed
```

### 4. Deploy Microservices

```bash
# Deploy all microservices
kubectl apply -f microservices/

# Wait for all services to be ready
kubectl wait --for=condition=ready pod -l app=user-service -n food-delivery --timeout=300s
kubectl wait --for=condition=ready pod -l app=order-service -n food-delivery --timeout=300s
kubectl wait --for=condition=ready pod -l app=payment-service -n food-delivery --timeout=300s
kubectl wait --for=condition=ready pod -l app=delivery-service -n food-delivery --timeout=300s
kubectl wait --for=condition=ready pod -l app=restaurant-service -n food-delivery --timeout=300s
kubectl wait --for=condition=ready pod -l app=notification-service -n food-delivery --timeout=300s
```

### 5. Deploy Frontends

```bash
# Deploy all frontend applications
kubectl apply -f frontends/

# Wait for frontends to be ready
kubectl wait --for=condition=ready pod -l app=customers-frontend -n food-delivery --timeout=300s
kubectl wait --for=condition=ready pod -l app=drivers-frontend -n food-delivery --timeout=300s
kubectl wait --for=condition=ready pod -l app=restaurants-frontend -n food-delivery --timeout=300s
```

### 6. Deploy Ingress

```bash
# Deploy ingress
kubectl apply -f ingress/

# Get ingress IP
kubectl get ingress -n food-delivery
```

### 7. Update /etc/hosts (for local development)

```bash
# Get ingress IP
INGRESS_IP=$(kubectl get ingress food-delivery-ingress -n food-delivery -o jsonpath='{.status.loadBalancer.ingress[0].ip}')

# Add to /etc/hosts (Linux/Mac) or C:\Windows\System32\drivers\etc\hosts (Windows)
echo "$INGRESS_IP customers.fooddelivery.local" | sudo tee -a /etc/hosts
echo "$INGRESS_IP drivers.fooddelivery.local" | sudo tee -a /etc/hosts
echo "$INGRESS_IP restaurants.fooddelivery.local" | sudo tee -a /etc/hosts
echo "$INGRESS_IP api.fooddelivery.local" | sudo tee -a /etc/hosts
```

## Quick Deploy (All at Once)

```bash
# Deploy everything in order
kubectl apply -f base/
kubectl apply -f secrets/
kubectl apply -f configmaps/
kubectl apply -f infrastructure/zookeeper-deployment.yaml
kubectl apply -f infrastructure/kafka-deployment.yaml
kubectl apply -f infrastructure/mongo/
sleep 30
kubectl apply -f microservices/
kubectl apply -f frontends/
kubectl apply -f ingress/
```

## Useful Commands

### Check Status

```bash
# Get all resources
kubectl get all -n food-delivery

# Check pod status
kubectl get pods -n food-delivery

# Check logs
kubectl logs -f <pod-name> -n food-delivery

# Describe pod
kubectl describe pod <pod-name> -n food-delivery
```

### Scaling

```bash
# Scale a deployment
kubectl scale deployment user-service --replicas=3 -n food-delivery

# Auto-scale
kubectl autoscale deployment user-service --min=2 --max=5 --cpu-percent=80 -n food-delivery
```

### Updates

```bash
# Update image
kubectl set image deployment/user-service user-service=your-registry/user-service:v2 -n food-delivery

# Rollout status
kubectl rollout status deployment/user-service -n food-delivery

# Rollback
kubectl rollout undo deployment/user-service -n food-delivery
```

### Debugging

```bash
# Get shell in pod
kubectl exec -it <pod-name> -n food-delivery -- sh

# Port forward to local
kubectl port-forward svc/user-service 3000:3000 -n food-delivery

# View events
kubectl get events -n food-delivery --sort-by='.lastTimestamp'
```

### Cleanup

```bash
# Delete everything
kubectl delete namespace food-delivery

# Or delete selectively
kubectl delete -f ingress/
kubectl delete -f frontends/
kubectl delete -f microservices/
kubectl delete -f infrastructure/mongo/
kubectl delete -f infrastructure/kafka-deployment.yaml
kubectl delete -f infrastructure/zookeeper-deployment.yaml
kubectl delete -f configmaps/
kubectl delete -f secrets/
kubectl delete -f base/
```

## Access URLs

After deployment:

- Customer App: http://customers.fooddelivery.local
- Drivers App: http://drivers.fooddelivery.local
- Restaurant App: http://restaurants.fooddelivery.local
- API Gateway: http://api.fooddelivery.local

## Production Considerations

1. **Secrets Management**
   - Use external secrets management (HashiCorp Vault, AWS Secrets Manager)
   - Enable secret encryption at rest

2. **Monitoring**
   - Add Prometheus and Grafana
   - Configure alerts

3. **Logging**
   - Deploy ELK stack or use cloud logging
   - Configure log aggregation

4. **Backup**
   - Set up MongoDB backups (e.g., MongoDB Atlas, or scheduled dumps)
   - Use VolumeSnapshots

5. **Security**
   - Enable Pod Security Policies
   - Use Network Policies
   - Enable TLS/SSL

6. **High Availability**
   - Run multiple replicas
   - Use PodDisruptionBudgets
   - Configure auto-scaling
   - Consider using a MongoDB Replica Set (StatefulSet) instead of a single Deployment

7. **Resource Limits**
   - Adjust resource requests/limits based on actual usage
   - Use Vertical Pod Autoscaler

## Troubleshooting

### Pods not starting

```bash
kubectl describe pod <pod-name> -n food-delivery
kubectl logs <pod-name> -n food-delivery
```

### Database connection issues

```bash
# Check mongo service
kubectl get svc mongo-service -n food-delivery

# Test connection (if you have a mongo client pod or using curl)
# kubectl run tmp-shell --rm -i --tty --image nicolaka/netshoot -- /bin/bash
# nc -zv mongo-service 27017
```

### Kafka connection issues

```bash
# Check kafka service
kubectl get svc kafka-service -n food-delivery

# Check kafka logs
kubectl logs -l app=kafka -n food-delivery
```

## Support

For issues and questions, please refer to the main project documentation.