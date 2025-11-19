import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMyDeliveries } from "@/hooks/useDelivery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, MapPin, Store, DollarSign, ArrowRight } from "lucide-react";
import type { Delivery } from "@/types";

export const ActiveDeliveries = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const navigate = useNavigate();

  // Get deliveries with different statuses
  const { data: assignedData, isLoading: assignedLoading } =
    useMyDeliveries("assigned");
  const { data: pickedUpData, isLoading: pickedUpLoading } =
    useMyDeliveries("picked_up");

  // Filter by acceptance status
  const pendingDeliveries =
    assignedData?.deliveries?.filter((d) => d.acceptanceStatus === "pending") ||
    [];
  const acceptedDeliveries =
    assignedData?.deliveries?.filter(
      (d) => d.acceptanceStatus === "accepted"
    ) || [];
  const pickedUpDeliveries = pickedUpData?.deliveries || [];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Active Deliveries</h1>
        <p className="text-muted-foreground mt-2">
          Manage your ongoing deliveries
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingDeliveries.length})
          </TabsTrigger>
          <TabsTrigger value="accepted">
            Accepted ({acceptedDeliveries.length})
          </TabsTrigger>
          <TabsTrigger value="picked_up">
            Picked Up ({pickedUpDeliveries.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {assignedLoading ? (
            <DeliverySkeletons />
          ) : pendingDeliveries.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {pendingDeliveries.map((delivery) => (
                <DeliveryCard
                  key={delivery.deliveryId}
                  delivery={delivery}
                  onViewDetails={() =>
                    navigate(`/deliveries/${delivery.deliveryId}`)
                  }
                />
              ))}
            </div>
          ) : (
            <EmptyState message="No pending delivery requests" />
          )}
        </TabsContent>

        <TabsContent value="accepted" className="mt-6">
          {assignedLoading ? (
            <DeliverySkeletons />
          ) : acceptedDeliveries.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {acceptedDeliveries.map((delivery) => (
                <DeliveryCard
                  key={delivery.deliveryId}
                  delivery={delivery}
                  onViewDetails={() =>
                    navigate(`/deliveries/${delivery.deliveryId}`)
                  }
                />
              ))}
            </div>
          ) : (
            <EmptyState message="No accepted deliveries at the moment" />
          )}
        </TabsContent>

        <TabsContent value="picked_up" className="mt-6">
          {pickedUpLoading ? (
            <DeliverySkeletons />
          ) : pickedUpDeliveries.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {pickedUpDeliveries.map((delivery) => (
                <DeliveryCard
                  key={delivery.deliveryId}
                  delivery={delivery}
                  onViewDetails={() =>
                    navigate(`/deliveries/${delivery.deliveryId}`)
                  }
                />
              ))}
            </div>
          ) : (
            <EmptyState message="No picked up deliveries at the moment" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface DeliveryCardProps {
  delivery: Delivery;
  onViewDetails: () => void;
}

function DeliveryCard({ delivery, onViewDetails }: DeliveryCardProps) {
  const getStatusBadge = () => {
    if (delivery.acceptanceStatus === "pending") {
      return <Badge variant="secondary">Pending</Badge>;
    }
    if (delivery.status === "picked_up") {
      return <Badge>In Transit</Badge>;
    }
    return <Badge variant="outline">Accepted</Badge>;
  };

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={onViewDetails}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">
              Order #{delivery.orderId.slice(0, 8)}
            </CardTitle>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Restaurant Info */}
        {delivery.restaurantName && (
          <div className="flex items-start gap-2">
            <Store className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="flex-1 text-sm">
              <p className="font-medium">Pickup from:</p>
              <p className="text-muted-foreground">{delivery.restaurantName}</p>
              {delivery.restaurantAddress && (
                <p className="text-muted-foreground text-xs">
                  {typeof delivery.restaurantAddress === "string"
                    ? delivery.restaurantAddress
                    : `${delivery.restaurantAddress.street}, ${delivery.restaurantAddress.city}`}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Delivery Address */}
        {delivery.deliveryAddress && (
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="flex-1 text-sm">
              <p className="font-medium">Deliver to:</p>
              <p className="text-muted-foreground">
                {delivery.deliveryAddress.street}
              </p>
              <p className="text-muted-foreground text-xs">
                {delivery.deliveryAddress.city},{" "}
                {delivery.deliveryAddress.state}
              </p>
            </div>
          </div>
        )}

        {/* Delivery Fee */}
        {delivery.deliveryFee && (
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="font-medium">Your Earning:</span>
            </div>
            <span className="font-semibold text-green-600">
              ${delivery.deliveryFee.toFixed(2)}
            </span>
          </div>
        )}

        <Button className="w-full mt-3" variant="outline">
          View Details
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}

function DeliverySkeletons() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-center">{message}</p>
      </CardContent>
    </Card>
  );
}
