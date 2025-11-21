#!/bin/bash

# Food Delivery Kubernetes Cleanup Script
# This script deletes all Kubernetes resources

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

NAMESPACE="food-delivery"

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to delete resources
delete_resources() {
    echo "╔════════════════════════════════════════════════════════╗"
    echo "║   Food Delivery Kubernetes Cleanup Script             ║"
    echo "╚════════════════════════════════════════════════════════╝"
    echo ""
    
    print_warning "This will delete ALL resources in the $NAMESPACE namespace!"
    read -p "Are you sure you want to continue? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Cleanup cancelled"
        exit 0
    fi
    
    echo ""
    print_info "Starting cleanup..."
    echo ""
    
    # Delete Ingress
    print_info "Deleting Ingress..."
    kubectl delete ingress --all -n $NAMESPACE 2>/dev/null || print_warning "No ingress found"
    
    # Delete Frontends
    print_info "Deleting frontend deployments and services..."
    kubectl delete deployment,service -l tier=frontend -n $NAMESPACE 2>/dev/null || true
    kubectl delete -R -f frontends/ 2>/dev/null || print_warning "Frontend resources already deleted"
    
    # Delete Microservices
    print_info "Deleting microservice deployments and services..."
    kubectl delete deployment,service -l tier=backend -n $NAMESPACE 2>/dev/null || true
    kubectl delete -R -f microservices/ 2>/dev/null || print_warning "Microservice resources already deleted"
    
    # Delete Jobs
    print_info "Deleting jobs..."
    kubectl delete jobs --all -n $NAMESPACE 2>/dev/null || print_warning "No jobs found"
    
    # Delete Infrastructure (Kafka, MongoDB)
    print_info "Deleting infrastructure..."
    kubectl delete -f infrastructure/kafka/ 2>/dev/null || print_warning "Kafka resources already deleted"
    kubectl delete -f infrastructure/mongo/ 2>/dev/null || print_warning "MongoDB resources already deleted"
    
    # Delete ConfigMaps
    print_info "Deleting ConfigMaps..."
    kubectl delete configmap --all -n $NAMESPACE 2>/dev/null || print_warning "No ConfigMaps found"
    
    # Delete Secrets
    print_info "Deleting Secrets..."
    kubectl delete secret --all -n $NAMESPACE 2>/dev/null || print_warning "No Secrets found"
    
    # Delete PVCs (this will also delete PVs)
    print_info "Deleting PersistentVolumeClaims..."
    kubectl delete pvc --all -n $NAMESPACE 2>/dev/null || print_warning "No PVCs found"
    
    # Wait a bit for resources to terminate
    print_info "Waiting for resources to terminate..."
    sleep 5
    
    # Delete Namespace
    print_warning "Deleting namespace: $NAMESPACE"
    kubectl delete namespace $NAMESPACE 2>/dev/null || print_warning "Namespace already deleted"
    
    echo ""
    print_success "Cleanup completed!"
    echo ""
    print_info "All resources in the $NAMESPACE namespace have been deleted."
}

# Function to delete everything (including namespace)
delete_all() {
    print_info "Deleting entire namespace and all resources..."
    kubectl delete namespace $NAMESPACE --grace-period=30 --timeout=60s
    print_success "Namespace deleted"
}

# Function to show current resources
show_resources() {
    echo ""
    print_info "Current resources in namespace $NAMESPACE:"
    echo ""
    kubectl get all -n $NAMESPACE 2>/dev/null || print_warning "Namespace not found or empty"
    echo ""
}

# Main menu
case "${1:-}" in
    --all|-a)
        delete_all
        ;;
    --show|-s)
        show_resources
        ;;
    --help|-h)
        echo "Food Delivery Kubernetes Cleanup Script"
        echo ""
        echo "Usage: $0 [option]"
        echo ""
        echo "Options:"
        echo "  (no option)    Interactive cleanup (default)"
        echo "  --all, -a      Delete entire namespace immediately (no confirmation)"
        echo "  --show, -s     Show current resources"
        echo "  --help, -h     Show this help message"
        echo ""
        ;;
    *)
        delete_resources
        show_resources
        ;;
esac

