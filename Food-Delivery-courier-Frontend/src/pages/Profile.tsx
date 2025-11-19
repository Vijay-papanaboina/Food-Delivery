import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Truck } from "lucide-react";

export const Profile = () => {
  const { user } = useAuthStore();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Driver Profile</h1>
        <p className="text-muted-foreground mt-2">
          View and manage your profile information
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{user?.name || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <Badge variant="secondary">{user?.role || "driver"}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">User ID</p>
              <p className="font-mono text-sm mt-1">
                {user?.userId?.slice(0, 8) || "N/A"}...
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Account Type</p>
              <p className="font-medium mt-1">Delivery Driver</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant="default" className="mt-1">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            More profile features coming soon. You'll be able to update your
            vehicle information, contact details, and availability settings.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
