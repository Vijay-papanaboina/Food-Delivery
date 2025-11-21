# Food Delivery Kubernetes Cleanup Script
# This script deletes the food-delivery namespace and ALL infrastructure (Ingress, Cert-Manager)

$ErrorActionPreference = "Continue"
$NAMESPACE = "food-delivery"

function Print-Info { param([string]$Message) Write-Host "ℹ $Message" -ForegroundColor Cyan }
function Print-Success { param([string]$Message) Write-Host "✓ $Message" -ForegroundColor Green }
function Print-Error { param([string]$Message) Write-Host "✗ $Message" -ForegroundColor Red }

Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Blue
Write-Host "║   Food Delivery Kubernetes Cleanup Script             ║" -ForegroundColor Blue
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Blue
Write-Host ""

Write-Host "This will delete:"
Write-Host "1. Namespace: $NAMESPACE (App, DB, Kafka)"
Write-Host "2. ClusterIssuer (Cert-Manager config)"
Write-Host "3. Namespace: ingress-nginx (Ingress Controller)"
Write-Host "4. Namespace: cert-manager (Cert Manager)"
Write-Host ""

$confirmation = Read-Host "Are you sure you want to completely wipe the cluster? (y/n)"
if ($confirmation -notmatch "^[Yy]$") {
    Print-Info "Cleanup cancelled"
    exit 0
}

Write-Host ""
Print-Info "Starting cleanup..."

# 1. Delete App Namespace
Print-Info "Deleting namespace: $NAMESPACE..."
kubectl delete namespace $NAMESPACE --timeout=120s 2>&1 | Out-Null

# 2. Delete ClusterIssuer
Print-Info "Deleting ClusterIssuer..."
kubectl delete -f infrastructure/cert-manager/cluster-issuer.yaml --ignore-not-found=$true 2>&1 | Out-Null

# 3. Delete Ingress Controller
Print-Info "Deleting Ingress Controller..."
kubectl delete namespace ingress-nginx --timeout=120s 2>&1 | Out-Null

# 4. Delete Cert Manager
Print-Info "Deleting Cert Manager..."
kubectl delete namespace cert-manager --timeout=120s 2>&1 | Out-Null

Write-Host ""
Print-Success "Full cleanup completed!"
