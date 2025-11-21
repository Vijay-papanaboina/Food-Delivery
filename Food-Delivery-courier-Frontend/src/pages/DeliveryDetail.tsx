import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  useDeliveryDetails,
  useAcceptDelivery,
  useDeclineDelivery,
  usePickupDelivery,
  useCompleteDelivery,
} from "@/hooks/useDelivery";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  MapPin,
  Store,
  User,
  Phone,
  Package,
  DollarSign,
} from "lucide-react";

export const DeliveryDetail = () => {
  const { deliveryId } = useParams<{ deliveryId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showDeclineDialog, setShowDeclineDialog] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  const { data, isLoading } = useDeliveryDetails(deliveryId!);
  const acceptMutation = useAcceptDelivery();
  const declineMutation = useDeclineDelivery();
  const pickupMutation = usePickupDelivery();
  const completeMutation = useCompleteDelivery();

  const delivery = data?.delivery;

  const handleAccept = () => {
    acceptMutation.mutate(deliveryId!, {
      onSuccess: () => {
        navigate("/deliveries");
      },
    });
  };

  const handleDeclineConfirm = () => {
    declineMutation.mutate(
      { id: deliveryId!, reason: declineReason },
      {
        onSuccess: () => {
          setShowDeclineDialog(false);
          navigate("/deliveries");
        },
      }
    );
  };

  const handlePickup = () => {
    if (user?.id && delivery) {
      pickupMutation.mutate(
        {
          id: deliveryId!,
          orderId: delivery.orderId,
          driverId: user.id,
        },
        {
          onSuccess: () => {
            navigate("/deliveries");
          },
        }
      );
    }
  };

  const handleComplete = () => {
    if (user?.id && delivery) {
      completeMutation.mutate(
        {
          id: deliveryId!,
          orderId: delivery.orderId,
          driverId: user.id,
        },
        {
          onSuccess: () => {
            navigate("/deliveries");
          },
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Delivery Not Found</h2>
          <Button asChild>
            <Link to="/deliveries">Back to Deliveries</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadge = () => {
    if (delivery.acceptanceStatus === "pending") {
      return <Badge variant="secondary">Pending</Badge>;
    }
    if (delivery.status === "picked_up") {
      return <Badge>In Transit</Badge>;
    }
    if (delivery.status === "completed") {
      return <Badge variant="outline">Completed</Badge>;
    }
    return <Badge variant="secondary">Assigned</Badge>;
  };

  const showAcceptDecline = delivery.acceptanceStatus === "pending";
  const showPickup =
    delivery.acceptanceStatus === "accepted" && delivery.status === "assigned";
  const showComplete = delivery.status === "picked_up";

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/deliveries">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Deliveries
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Delivery #{deliveryId?.slice(0, 8)}
            </h1>
            <p className="text-muted-foreground">
              Order #{delivery.orderId.slice(0, 8)}
            </p>
          </div>
          {getStatusBadge()}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Restaurant Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Pickup Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {delivery.restaurantName && (
              <div>
                <p className="font-semibold text-lg">
                  {delivery.restaurantName}
                </p>
              </div>
            )}
            {delivery.restaurantAddress && (
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  {typeof delivery.restaurantAddress === "string" ? (
                    <p>{delivery.restaurantAddress}</p>
                  ) : (
                    <>
                      <p>{delivery.restaurantAddress.street}</p>
                      <p>
                        {delivery.restaurantAddress.city},{" "}
                        {delivery.restaurantAddress.state}{" "}
                        {delivery.restaurantAddress.zipCode}
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
            {delivery.restaurantPhone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{delivery.restaurantPhone}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Delivery Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {delivery.customerName && (
              <div>
                <p className="font-semibold text-lg">{delivery.customerName}</p>
              </div>
            )}
            {delivery.deliveryAddress && (
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p>{delivery.deliveryAddress.street}</p>
                  <p>
                    {delivery.deliveryAddress.city},{" "}
                    {delivery.deliveryAddress.state}{" "}
                    {delivery.deliveryAddress.zipCode}
                  </p>
                </div>
              </div>
            )}
            {delivery.customerPhone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{delivery.customerPhone}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Items */}
        {delivery.orderItems && delivery.orderItems.length > 0 && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items ({delivery.orderItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {delivery.orderItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <span className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between items-center font-semibold">
                  <span>Order Total</span>
                  <span>${delivery.orderTotal?.toFixed(2) || "0.00"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Delivery Information */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Delivery Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Your Earning:</span>
              <span className="font-semibold text-lg text-green-600">
                ${delivery.deliveryFee?.toFixed(2) || "3.50"}
              </span>
            </div>
            {delivery.estimatedDeliveryTime && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Time:</span>
                <span>
                  {new Date(
                    delivery.estimatedDeliveryTime
                  ).toLocaleTimeString()}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            {showAcceptDecline && (
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowDeclineDialog(true)}
                  disabled={declineMutation.isPending}
                >
                  Decline
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleAccept}
                  disabled={acceptMutation.isPending}
                >
                  {acceptMutation.isPending
                    ? "Accepting..."
                    : "Accept Delivery"}
                </Button>
              </div>
            )}

            {showPickup && (
              <Button
                className="w-full"
                onClick={handlePickup}
                disabled={pickupMutation.isPending}
              >
                {pickupMutation.isPending
                  ? "Processing..."
                  : "Mark as Picked Up"}
              </Button>
            )}

            {showComplete && (
              <Button
                className="w-full"
                onClick={handleComplete}
                disabled={completeMutation.isPending}
              >
                {completeMutation.isPending
                  ? "Processing..."
                  : "Mark as Delivered"}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Decline Dialog */}
      <AlertDialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Decline Delivery?</AlertDialogTitle>
            <AlertDialogDescription>
              This delivery will be reassigned to another driver.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea
              id="reason"
              placeholder="e.g., Too far away, taking a break..."
              value={declineReason}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setDeclineReason(e.target.value)
              }
              className="mt-2"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeclineConfirm}
              disabled={declineMutation.isPending}
            >
              {declineMutation.isPending ? "Declining..." : "Decline Delivery"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
