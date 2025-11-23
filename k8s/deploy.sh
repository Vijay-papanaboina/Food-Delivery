#!/bin/bash

# Food Delivery Kubernetes Deployment Script
# This script deploys the entire Food Delivery application to Kubernetes

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

NAMESPACE="food-delivery"
TOTAL_STEPS=6
CURRENT_STEP=0

# Function to print colored output
print_header() {
    echo ""
    echo -e "${BLUE}===============================================${NC}"
    echo -e "${BLUE} $1${NC}"
    echo -e "${BLUE}===============================================${NC}"
    echo ""
}

print_step() {
    CURRENT_STEP=$((CURRENT_STEP + 1))
    echo -e "${YELLOW}[$CURRENT_STEP/$TOTAL_STEPS] $1${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Function to check if kubectl is installed
check_kubectl() {
    if ! command -v kubectl &> /dev/null; then
        print_error "kubectl is not installed. Please install it first."
        exit 1
    fi
    print_success "kubectl is installed"
}

# Function to check if cluster is accessible
check_cluster() {
    if ! kubectl cluster-info &> /dev/null; then
        print_error "Cannot connect to Kubernetes cluster"
        exit 1
    fi
    print_success "Connected to Kubernetes cluster"
}

# Function to check if NGINX Ingress Controller is installed
check_ingress_controller() {
    print_info "Checking for NGINX Ingress Controller..."
    if kubectl get namespace ingress-nginx &> /dev/null; then
        print_success "NGINX Ingress Controller is installed"
    else
        print_warning "NGINX Ingress Controller not found"
        print_info "Installing it with:"
        kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.0/deploy/static/provider/cloud/deploy.yaml
        echo ""
        # No need for read -p here
    fi
}

# Function to check for cert-manager
check_cert_manager() {
    print_info "Checking for cert-manager..."
    if kubectl get namespace cert-manager &> /dev/null; then
        print_success "cert-manager is installed"
    else
        print_warning "cert-manager not found (Required for TLS)"
        print_info "Installing it with:"
        kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.14.0/cert-manager.yaml
        echo ""
        # No need for read -p here
    fi
}

# Function to deploy namespace
deploy_namespace() {
    print_step "Creating Namespace"
    if kubectl get namespace $NAMESPACE &> /dev/null; then
        print_info "Namespace $NAMESPACE already exists"
    else
        kubectl apply -f base/namespace.yaml
        print_success "Namespace created"
    fi
}

# Function to deploy secrets
deploy_secrets() {
    print_step "Deploying Secrets"
    
    # Check if secrets folder exists and has files
    if [ ! -d "secrets" ] || [ -z "$(ls -A secrets)" ]; then
        print_error "No secrets found in secrets/ directory!"
        print_info "Please copy secrets-example/ to secrets/ and configure your credentials."
        exit 1
    fi

    print_warning "Make sure you've updated the secrets in secrets/app-secrets.yaml"
    read -p "Have you updated the secrets? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Please update the secrets before deploying"
        exit 1
    fi
    
    kubectl apply -f secrets/
    print_success "Secrets deployed"
}

# Function to deploy configmaps
deploy_configmaps() {
    print_step "Deploying ConfigMaps"
    kubectl apply -f configmaps/
    print_success "ConfigMaps deployed"
}

# Function to deploy infrastructure
deploy_infrastructure() {
    print_step "Deploying Infrastructure (Kafka, MongoDB)"

    # 1. Deploy ClusterIssuer (Only in Prod/if cert-manager exists)
    if [ "$IS_PROD" = true ] && [ -d "infrastructure/cert-manager" ]; then
        print_info "Applying ClusterIssuer..."
        kubectl apply -f infrastructure/cert-manager/ || true
    fi

    # 2. Deploy MongoDB
    print_info "Deploying MongoDB..."
    kubectl apply -f infrastructure/mongo/pvc.yaml
    kubectl apply -f infrastructure/mongo/service.yaml
    kubectl apply -f infrastructure/mongo/deployment.yaml
    
    print_info "Waiting for MongoDB to be ready..."
    kubectl wait --for=condition=ready pod -l app=mongo -n $NAMESPACE --timeout=120s || true

    # 3. Deploy Kafka
    print_info "Deploying Kafka..."
    kubectl apply -f infrastructure/kafka/pvc.yaml
    kubectl apply -f infrastructure/kafka/service.yaml
    kubectl apply -f infrastructure/kafka/deployment.yaml
    
    print_info "Waiting for Kafka to be ready..."
    kubectl wait --for=condition=ready pod -l app=kafka -n $NAMESPACE --timeout=120s || true

    # 4. Initialize Kafka topics
    print_info "Creating Kafka topics..."
    kubectl apply -f infrastructure/kafka/topics-init-job.yaml
    
    print_success "Infrastructure deployed and ready"
}

# Function to deploy microservices
deploy_microservices() {
    print_step "Deploying Microservices"

    # Apply all microservice subdirectories recursively
    kubectl apply -R -f microservices/

    print_info "Waiting for microservices to be ready..."
    
    services=("user-service" "order-service" "payment-service" "delivery-service" "restaurant-service" "notification-service")
    for service in "${services[@]}"; do
        print_info "Waiting for $service..."
        kubectl wait --for=condition=ready pod -l app=$service -n $NAMESPACE --timeout=120s || true
    done

    print_success "Microservices deployed"
}

# Function to deploy frontends
deploy_frontends() {
    print_step "Deploying Frontend Applications"

    # Apply all frontend subdirectories recursively
    kubectl apply -R -f frontends/

    print_info "Waiting for frontends to be ready..."
    
    frontends=("customers-frontend" "drivers-frontend" "restaurants-frontend")
    for frontend in "${frontends[@]}"; do
         print_info "Waiting for $frontend..."
         kubectl wait --for=condition=ready pod -l app=$frontend -n $NAMESPACE --timeout=120s || true
    done

    print_success "Frontends deployed"
}

# Function to deploy ingress
deploy_ingress() {
    print_step "Deploying Ingress"
    
    if [ "$IS_PROD" = true ]; then
        # Prompt user for DNS update confirmation before applying TLS ingress
        print_warning "Ensure DNS records for *.your.domain point to: $INGRESS_IP"
        read -p "Have you updated your DNS records? Press Enter to apply TLS Ingress (or Ctrl+C to cancel)..." -n 1 -r
        echo ""
        
        print_info "Deploying TLS Ingress..."
        kubectl apply -f ingress/ingress-with-tls.yaml
    else
        print_info "Deploying HTTP Ingress (Dev Mode)..."
        kubectl apply -f ingress/ingress.yaml
    fi
    
    print_success "Ingress deployed"
}

# Function to show deployment status
show_status() {
    print_header "Deployment Complete - Status Check"
    echo ""
    kubectl get all -n $NAMESPACE
    echo ""
    print_info "Ingress:"
    kubectl get ingress -n $NAMESPACE
    echo ""
}

# Function to show access URLs
show_urls() {
    print_header "Application URLs"
    echo "Customer App:    http://customers.fooddelivery.local"
    echo "Drivers App:     http://drivers.fooddelivery.local"
    echo "Restaurant App:  http://restaurants.fooddelivery.local"
    echo "API Gateway:     http://api.fooddelivery.local"
    echo ""
    print_warning "Don't forget to add these to your /etc/hosts file!"
    echo ""
    print_info "Get the ingress IP:"
    echo "kubectl get ingress food-delivery-ingress -n $NAMESPACE"
}

# Main deployment flow
main() {
    print_header "Food Delivery Platform - Deployment Script"
    echo "Prerequisites:"
    echo "- Kubernetes cluster running"
    echo "- kubectl configured"
    echo ""

    check_kubectl
    check_cluster

    echo ""
    read -p "Deploy for Production (with TLS & Ingress Controller checks)? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        IS_PROD=true
        check_ingress_controller

        # NEW STEP 1.5: Get and display Ingress External IP (Production Only)
        print_step "Waiting for Ingress External IP"
        INGRESS_IP=""
        for i in {1..30}; do # Try for 5 minutes (30 * 10s)
            INGRESS_IP=$(kubectl get svc -n ingress-nginx ingress-nginx-controller -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null)
            if [ -n "$INGRESS_IP" ]; then
                print_success "Ingress External IP: $INGRESS_IP"
                break
            fi
            print_info "Waiting for Ingress External IP to be assigned... (attempt $i/30)"
            sleep 10
        done

        if [ -z "$INGRESS_IP" ]; then
            print_error "Failed to get Ingress External IP after 5 minutes. Check Ingress Controller deployment."
            exit 1
        fi

        print_warning "ACTION REQUIRED: Update your DNS A records for *.yourdomain.com to point to: $INGRESS_IP"
        read -p "(IP copied to clipboard, press Enter to continue deployment) " -n 1 -r || true # Non-blocking for deployment logic
        echo ""
        print_info "Deployment will continue. You will be asked to confirm DNS update before Ingress is applied at the end."
        echo ""

        check_cert_manager
    else
        IS_PROD=false
        print_info "Development mode: Skipping Ingress Controller & Cert-Manager checks."
    fi

    echo ""
    read -p "Press Enter to continue or Ctrl+C to cancel"
    echo ""

    deploy_namespace
    deploy_secrets
    deploy_configmaps
    deploy_infrastructure
    deploy_microservices
    deploy_frontends
    deploy_ingress

    show_status
    show_urls
    
    print_success "Deployment process completed!"
}

# Run main function
main