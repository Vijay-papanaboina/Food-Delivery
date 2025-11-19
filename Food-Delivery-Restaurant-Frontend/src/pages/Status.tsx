import {
  useRestaurantProfile,
  useUpdateRestaurantStatus,
} from "@/hooks/useRestaurant";
import { useOrderStats } from "@/hooks/useOrders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { DollarSign, ShoppingBag, Clock, Store } from "lucide-react";

export const Status = () => {
  const { data: restaurantData, isLoading: isLoadingRestaurant } =
    useRestaurantProfile();
  const { data: statsData, isLoading: isLoadingStats } = useOrderStats();
  const updateStatus = useUpdateRestaurantStatus();

  const restaurant = restaurantData?.restaurant;
  const stats = statsData;

  const handleStatusToggle = (checked: boolean) => {
    updateStatus.mutate(checked);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Restaurant Status</h1>
        <p className="text-muted-foreground">
          Manage your restaurant's availability and view today's statistics
        </p>
      </div>

      {/* Restaurant Status Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Store className="h-6 w-6" />
              <div>
                <CardTitle>Restaurant Status</CardTitle>
                {isLoadingRestaurant ? (
                  <Skeleton className="h-4 w-32 mt-1" />
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">
                    {restaurant?.name}
                  </p>
                )}
              </div>
            </div>
            {!isLoadingRestaurant && (
              <Badge
                variant={restaurant?.is_open ? "default" : "secondary"}
                className="text-base px-4 py-1"
              >
                {restaurant?.is_open ? "Open" : "Closed"}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingRestaurant ? (
            <Skeleton className="h-12 w-full" />
          ) : (
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-semibold text-lg">
                  {restaurant?.is_open ? "Currently Open" : "Currently Closed"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Toggle to change restaurant availability
                </p>
              </div>
              <Switch
                checked={restaurant?.is_open || false}
                onCheckedChange={handleStatusToggle}
                disabled={updateStatus.isPending}
                className="scale-125"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Today's Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Orders
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">
                {stats?.todayOrders || 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Total orders today
            </p>
          </CardContent>
        </Card>

        {/* Today's Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">
                ${parseFloat(stats?.todayRevenue || "0").toFixed(2)}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Total revenue today
            </p>
          </CardContent>
        </Card>

        {/* Average Preparation Time */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Prep Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">
                {stats?.averagePreparationTime || 0} min
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Average time per order
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
