#!/bin/bash

# Food Delivery Kubernetes Cleanup Script
# This script deletes the food-delivery namespace and ALL infrastructure (Ingress, Cert-Manager)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

NAMESPACE="food-delivery"

print_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

echo "╔════════════════════════════════════════════════════════╗"
echo "║   Food Delivery Kubernetes Cleanup Script             ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

echo "This will delete:"
echo "1. Namespace: $NAMESPACE (App, DB, Kafka)"
echo "2. ClusterIssuer (Cert-Manager config)"
echo "3. Namespace: ingress-nginx (Ingress Controller)"
echo "4. Namespace: cert-manager (Cert Manager)"
echo ""
read -p "Are you sure you want to completely wipe the cluster? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_info "Cleanup cancelled"
    exit 0
fi

echo ""
print_info "Starting cleanup..."

# 1. Delete App Namespace
print_info "Deleting namespace: $NAMESPACE..."
kubectl delete namespace $NAMESPACE --timeout=120s 2>/dev/null || true

# 2. Delete ClusterIssuer
print_info "Deleting ClusterIssuer..."
if [ -d "infrastructure/cert-manager" ]; then
    kubectl delete -f infrastructure/cert-manager/ 2>/dev/null || true
fi

# 3. Delete Ingress Controller
print_info "Deleting Ingress Controller..."
kubectl delete namespace ingress-nginx --timeout=120s 2>/dev/null || true

# 4. Delete Cert Manager
print_info "Deleting Cert Manager..."
kubectl delete namespace cert-manager --timeout=120s 2>/dev/null || true

echo ""
print_success "Full cleanup completed!"
