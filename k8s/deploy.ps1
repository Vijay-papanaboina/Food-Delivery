# Production Deployment Script for Food Delivery Platform

# Stop on errors
$ErrorActionPreference = "Stop"

# Configuration
$NAMESPACE = "food-delivery"

# Counters
$TOTAL_STEPS = 6
$CURRENT_STEP = 0

# Global flag for Prod/Dev mode
$IS_PROD = $false

# Function to print colored output
function Print-Header {
    param([string]$Message)
    Write-Host ""
    Write-Host "===============================================" -ForegroundColor Blue
    Write-Host " $Message" -ForegroundColor Blue
    Write-Host "===============================================" -ForegroundColor Blue
    Write-Host ""
}

function Print-Step {
    param([string]$Message)
    $script:CURRENT_STEP++
    Write-Host "[$CURRENT_STEP/$TOTAL_STEPS] $Message" -ForegroundColor Yellow
    Write-Host ""
}

function Print-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Print-Error {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Print-Info {
    param([string]$Message)
    Write-Host "ℹ $Message" -ForegroundColor Cyan
}

# Function to execute command and check result
function Invoke-Command {
    param(
        [string]$Command,
        [string]$Description,
        [switch]$ContinueOnError
    )

    Write-Host "Executing: $Command" -ForegroundColor Gray
    Write-Host ""

    try {
        Invoke-Expression $Command
        if ($LASTEXITCODE -ne 0 -and -not $ContinueOnError) {
            throw "Command failed with exit code $LASTEXITCODE"
        }
        Print-Success $Description
    } catch {
        if ($ContinueOnError) {
            Print-Error "Warning: $Description failed, but continuing..."
        } else {
            Print-Error "Failed: $Description"
            throw
        }
    }
    Write-Host ""
}

# Start deployment
Print-Header "Food Delivery Platform - Deployment Script"
Write-Host "Prerequisites:"
Write-Host "- Kubernetes cluster running (GKE, Minikube, etc.)"
Write-Host "- kubectl configured"
Write-Host ""

# Mode Selection Prompt
$mode = Read-Host "Deploy for Production (with TLS & Ingress Controller checks)? (y/n)"
if ($mode -match "^[Yy]$") {
    $IS_PROD = $true
    Print-Info "Production mode selected. Will check for Ingress Controller and Cert-Manager."
} else {
    $IS_PROD = $false
    Print-Info "Development mode selected. Skipping Ingress Controller & Cert-Manager checks."
}
Write-Host ""

# Confirmation
$null = Read-Host "Press Enter to continue or Ctrl+C to cancel"

# Step 1: Install NGINX Ingress Controller (Prod Only)
Print-Step "Checking Ingress Controller"
if ($IS_PROD) {
    Invoke-Command "kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.0/deploy/static/provider/cloud/deploy.yaml" "Installed NGINX Ingress Controller"
    Invoke-Command "kubectl wait --namespace ingress-nginx --for=condition=ready pod --selector=app.kubernetes.io/component=controller --timeout=120s" "Waited for NGINX Ingress to be ready"
} else {
    Print-Info "Skipping Ingress Controller check (Dev Mode)"
}
Write-Host ""

# Step 2: Install cert-manager (Prod Only)
Print-Step "Checking cert-manager"
if ($IS_PROD) {
    Invoke-Command "kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.14.0/cert-manager.yaml" "Installed cert-manager"
    Invoke-Command "kubectl wait --namespace cert-manager --for=condition=ready pod --selector=app.kubernetes.io/instance=cert-manager --timeout=120s" "Waited for cert-manager to be ready"
} else {
    Print-Info "Skipping cert-manager check (Dev Mode)"
}
Write-Host ""

# Step 3: Create ClusterIssuer
Print-Step "Configuring ClusterIssuer"
if ($IS_PROD) {
    Invoke-Command "kubectl apply -f infrastructure/cert-manager/" "Created ClusterIssuer"
} else {
    Print-Info "Skipping ClusterIssuer (Dev Mode)"
}
Write-Host ""

# Step 4: Deploy Application
Print-Step "Deploying Application"
Invoke-Command "kubectl apply -f base/namespace.yaml" "Created namespace"

Invoke-Command "kubectl apply -f configmaps/" "Deployed ConfigMaps"

Invoke-Command "kubectl apply -f secrets/" "Deployed secrets"

Invoke-Command "kubectl apply -f infrastructure/mongo/" "Deployed infrastructure (MongoDB)"
Invoke-Command "kubectl apply -f infrastructure/kafka/" "Deployed infrastructure (Kafka)"

Print-Info "Waiting for infrastructure to be ready..."
Invoke-Command "kubectl wait --for=condition=ready pod -l app=mongo -n $NAMESPACE --timeout=120s" "MongoDB ready"
Invoke-Command "kubectl wait --for=condition=ready pod -l app=kafka -n $NAMESPACE --timeout=120s" "Kafka ready"

Invoke-Command "kubectl apply -f microservices/user-service/" "Deployed user service"
Invoke-Command "kubectl apply -f microservices/order-service/" "Deployed order service"
Invoke-Command "kubectl apply -f microservices/payment-service/" "Deployed payment service"
Invoke-Command "kubectl apply -f microservices/delivery-service/" "Deployed delivery service"
Invoke-Command "kubectl apply -f microservices/restaurant-service/" "Deployed restaurant service"
Invoke-Command "kubectl apply -f microservices/notification-service/" "Deployed notification service"

Print-Info "Waiting for microservices to be ready..."
Invoke-Command "kubectl wait --for=condition=ready pod -l app=user-service -n $NAMESPACE --timeout=60s" "User service ready"
Invoke-Command "kubectl wait --for=condition=ready pod -l app=order-service -n $NAMESPACE --timeout=60s" "Order service ready"
Invoke-Command "kubectl wait --for=condition=ready pod -l app=payment-service -n $NAMESPACE --timeout=60s" "Payment service ready"
Invoke-Command "kubectl wait --for=condition=ready pod -l app=delivery-service -n $NAMESPACE --timeout=60s" "Delivery service ready"
Invoke-Command "kubectl wait --for=condition=ready pod -l app=restaurant-service -n $NAMESPACE --timeout=60s" "Restaurant service ready"
Invoke-Command "kubectl wait --for=condition=ready pod -l app=notification-service -n $NAMESPACE --timeout=60s" "Notification service ready"

Invoke-Command "kubectl apply -f frontends/customers-frontend/" "Deployed customer frontend"
Invoke-Command "kubectl apply -f frontends/drivers-frontend/" "Deployed drivers frontend"
Invoke-Command "kubectl apply -f frontends/restaurants-frontend/" "Deployed restaurant frontend"

Print-Info "Waiting for frontends to be ready..."
Invoke-Command "kubectl wait --for=condition=ready pod -l app=customers-frontend -n $NAMESPACE --timeout=60s" "Customer frontend ready"
Invoke-Command "kubectl wait --for=condition=ready pod -l app=drivers-frontend -n $NAMESPACE --timeout=60s" "Drivers frontend ready"
Invoke-Command "kubectl wait --for=condition=ready pod -l app=restaurants-frontend -n $NAMESPACE --timeout=60s" "Restaurant frontend ready"
Write-Host ""

# Step 5: Deploy Ingress
Print-Step "Deploying Ingress"
if ($IS_PROD) {
    Print-Info "Deploying TLS Ingress..."
    Invoke-Command "kubectl apply -f ingress/ingress-with-tls.yaml" "Deployed TLS ingress"
} else {
    Print-Info "Deploying HTTP Ingress (Dev Mode)..."
    Invoke-Command "kubectl apply -f ingress/ingress.yaml" "Deployed HTTP ingress"
}
Write-Host ""

# Step 6: Final Status Check
Print-Header "Deployment Complete - Status Check"
Write-Host ""

# Check all resources
Invoke-Command "kubectl get all -n $NAMESPACE" "Application status"
Invoke-Command "kubectl get ingress -n $NAMESPACE" "Ingress status"

Write-Host ""
Print-Header "Deployment Summary"
Write-Host ""
if ($IS_PROD) {
    Print-Success "✅ NGINX Ingress Controller installed"
    Print-Success "✅ cert-manager installed"
    Print-Success "✅ ClusterIssuer created"
} else {
    Print-Info "ℹ Skipped Prod Infrastructure (Ingress/Cert-Manager)"
}
Print-Success "✅ Application deployed with mock data"
Print-Success "✅ Ingress deployed"
Write-Host ""
Print-Info "🎉 Food Delivery Platform deployed successfully!"
Write-Host ""
Print-Info "To check everything: kubectl get all -n $NAMESPACE"
Write-Host ""