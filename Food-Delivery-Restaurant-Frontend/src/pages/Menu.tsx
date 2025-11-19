import { useState } from "react";
import { useMenuItems } from "@/hooks/useMenu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MenuItemModal } from "@/components/MenuItemModal";
import type { MenuItem } from "@/types";
import { Search, UtensilsCrossed, Plus, Clock, DollarSign } from "lucide-react";

export const Menu = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const { data, isLoading } = useMenuItems();

  const menuItems = data?.menu || [];

  const filteredItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddClick = () => {
    setSelectedItem(null);
    setModalMode("add");
    setModalOpen(true);
  };

  const handleCardClick = (item: MenuItem) => {
    setSelectedItem(item);
    setModalMode("edit");
    setModalOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Menu Management</h1>
        <p className="text-muted-foreground">
          Manage your menu items and availability
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle>Menu Items</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleAddClick}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <UtensilsCrossed className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-xl font-semibold mb-2">
                {searchQuery ? "No items found" : "No menu items"}
              </p>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "Try a different search term"
                  : "Add menu items to get started"}
              </p>
              {!searchQuery && (
                <Button onClick={handleAddClick}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Item
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <Card
                  key={item.itemId}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleCardClick(item)}
                >
                  <CardContent className="">
                    {/* Image */}
                    <div className="w-full h-48 bg-muted rounded-md mb-4 flex items-center justify-center overflow-hidden">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UtensilsCrossed className="h-12 w-12 text-muted-foreground" />
                      )}
                    </div>

                    {/* Item Info */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-lg line-clamp-1">
                          {item.name}
                        </h3>
                        <Badge
                          variant={item.isAvailable ? "default" : "secondary"}
                          className="shrink-0"
                        >
                          {item.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>

                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{item.category}</Badge>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-1 text-sm font-semibold">
                          <DollarSign className="h-4 w-4" />
                          {item.price.toFixed(2)}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {item.preparationTime} min
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Menu Item Modal */}
      <MenuItemModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        item={selectedItem}
        mode={modalMode}
      />
    </div>
  );
};
