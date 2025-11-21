import { useState } from "react";
import {
  useKitchenOrders,
  useOrderHistory,
  useMarkOrderReady,
} from "@/hooks/useOrders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, CheckCircle2, ChefHat } from "lucide-react";
// Simple date formatting without external dependencies

export const Orders = () => {
  const [activeTab, setActiveTab] = useState("active");

  const { data: kitchenData, isLoading: isLoadingKitchen } = useKitchenOrders();
  const { data: historyData, isLoading: isLoadingHistory } = useOrderHistory();
  const markReadyMutation = useMarkOrderReady();

  const kitchenOrders = kitchenData?.orders || [];
  const orderHistory = historyData?.orders || [];

  // Filter orders for better tab separation
  // Active: received, preparing, ready
  // History: completed, cancelled
  const activeOrders = kitchenOrders.filter(
    (order) => order.status !== "completed" && order.status !== "cancelled"
  );
  const completedOrders = kitchenOrders.filter(
    (order) => order.status === "completed" || order.status === "cancelled"
  );

  const handleMarkReady = (id: string) => {
    markReadyMutation.mutate(id);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        label: string;
      }
    > = {
      received: { variant: "secondary", label: "Received" },
      preparing: { variant: "default", label: "Preparing" },
      ready: { variant: "outline", label: "Ready" },
      completed: { variant: "default", label: "Completed" },
      cancelled: { variant: "destructive", label: "Cancelled" },
    };

    const config = variants[status] || { variant: "secondary", label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Kitchen Orders</h1>
        <p className="text-muted-foreground">
          Manage incoming orders and view order history
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="active">
            <ChefHat className="h-4 w-4 mr-2" />
            Active Orders ({activeOrders.length})
          </TabsTrigger>
          <TabsTrigger value="history">
            <Clock className="h-4 w-4 mr-2" />
            Order History
          </TabsTrigger>
        </TabsList>

        {/* Active Orders Tab */}
        <TabsContent value="active" className="space-y-4">
          {isLoadingKitchen ? (
            <>
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </>
          ) : activeOrders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ChefHat className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-xl font-semibold mb-2">No active orders</p>
                <p className="text-muted-foreground">
                  New orders will appear here automatically
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {activeOrders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Order #{order.id.slice(0, 8)}
                      </CardTitle>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.receivedAt).toLocaleString()}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Order Items */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Items:</p>
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between text-sm bg-muted/50 p-2 rounded"
                          >
                            <span>
                              {item.quantity}x {item.name}
                            </span>
                            <span className="font-medium">
                              ${item.price.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Total */}
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="font-semibold">Total:</span>
                        <span className="text-lg font-bold">
                          ${Number(order.total).toFixed(2)}
                        </span>
                      </div>

                      {/* Preparation Time */}
                      {order.preparationTime && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Prep time: {order.preparationTime} min</span>
                        </div>
                      )}

                      {/* Mark Ready Button */}
                      {order.status !== "ready" &&
                        order.status !== "completed" &&
                        order.status !== "cancelled" && (
                          <Button
                            onClick={() => handleMarkReady(order.id)}
                            disabled={markReadyMutation.isPending}
                            className="w-full mt-2"
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Mark as Ready
                          </Button>
                        )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Order History Tab */}
        <TabsContent value="history">
          {isLoadingHistory ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : orderHistory.length === 0 && completedOrders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-xl font-semibold mb-2">No order history</p>
                <p className="text-muted-foreground">
                  Completed orders will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {/* Show completed orders from kitchen first */}
              {completedOrders.map((order) => (
                <Card key={`kitchen-${order.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-semibold">
                            #{order.id.slice(0, 8)}
                          </p>
                          <Badge variant="outline">{order.status}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>Items: {order.items.length}</p>
                          <p>Total: ${Number(order.total).toFixed(2)}</p>
                          <p>
                            Completed:{" "}
                            {new Date(
                              order.readyAt || order.receivedAt
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
                            {/* Then show order history from order service */}              {orderHistory.map((order) => (                <Card key={order.id}>                  <CardContent className="p-4">                    <div className="flex items-center justify-between">                      <div className="flex-1">                        <div className="flex items-center gap-3 mb-2">                          <p className="font-semibold">                            #{order.id.slice(0, 8)}                          </p>
                          <Badge variant="outline">{order.status}</Badge>
                          <Badge variant="secondary">
                            {order.paymentStatus}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.items.length} items
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">
                          ${Number(order.total).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
