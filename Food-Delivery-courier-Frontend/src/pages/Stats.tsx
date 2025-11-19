import { useDriverStats } from "@/hooks/useDelivery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, TrendingUp, Star, DollarSign } from "lucide-react";

export const Stats = () => {
  const { data: stats, isLoading } = useDriverStats();

  const statsCards = [
    {
      title: "Total Deliveries",
      value: stats?.totalDeliveries || 0,
      icon: Package,
      description: "Lifetime deliveries",
    },
    {
      title: "Completed Today",
      value: stats?.completedToday || 0,
      icon: TrendingUp,
      description: "Deliveries completed today",
    },
    {
      title: "Average Rating",
      value: stats?.averageRating || "0.0",
      icon: Star,
      description: "Customer satisfaction",
    },
    {
      title: "Today's Earnings",
      value: `$${stats?.earnings || "0.00"}`,
      icon: DollarSign,
      description: "Earnings today",
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Driver Statistics</h1>
        <p className="text-muted-foreground mt-2">
          Track your performance and earnings
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            {statsCards.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>

      {/* Additional stats section - can be expanded later */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Total Deliveries
              </span>
              <span className="font-medium">{stats?.totalDeliveries || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Completed Today
              </span>
              <span className="font-medium">{stats?.completedToday || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Average Rating
              </span>
              <span className="font-medium">
                {stats?.averageRating || "0.0"} ⭐
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Today's Earnings
              </span>
              <span className="font-medium">${stats?.earnings || "0.00"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
