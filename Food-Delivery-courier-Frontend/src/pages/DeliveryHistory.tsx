import { useMyDeliveries } from "@/hooks/useDelivery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package } from "lucide-react";

export const DeliveryHistory = () => {
  const { data, isLoading } = useMyDeliveries("completed");

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Delivery History</h1>
        <p className="text-muted-foreground mt-2">
          View your completed deliveries
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Completed Deliveries ({data?.total || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : data?.deliveries && data.deliveries.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Completed At</TableHead>
                    <TableHead className="text-right">Earning</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.deliveries.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell className="font-medium">
                        #{delivery.orderId.slice(0, 8)}
                      </TableCell>
                      <TableCell>
                        {delivery.deliveryAddress ? (
                          <div className="text-sm">
                            <p>{delivery.deliveryAddress.street}</p>
                            <p className="text-muted-foreground">
                              {delivery.deliveryAddress.city},{" "}
                              {delivery.deliveryAddress.state}
                            </p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {delivery.actualDeliveryTime ? (
                          <div className="text-sm">
                            {new Date(
                              delivery.actualDeliveryTime
                            ).toLocaleDateString()}
                            <br />
                            <span className="text-muted-foreground">
                              {new Date(
                                delivery.actualDeliveryTime
                              ).toLocaleTimeString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-green-600">
                        ${delivery.deliveryFee?.toFixed(2) || "3.50"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">Completed</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                No completed deliveries yet
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
