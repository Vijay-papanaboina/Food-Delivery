import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { X, ImageOff } from "lucide-react";
import type { MenuItem } from "@/types";
import {
  useAddMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItem,
} from "@/hooks/useMenu";

interface MenuItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: MenuItem | null;
  mode: "add" | "edit";
}

const CATEGORIES = [
  "Appetizers",
  "Main Course",
  "Desserts",
  "Beverages",
  "Sides",
  "Salads",
  "Soups",
  "Breakfast",
  "Other",
];

export const MenuItemModal = ({
  open,
  onOpenChange,
  item,
  mode,
}: MenuItemModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    preparationTime: "",
    isAvailable: true,
    imageUrl: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  const addMutation = useAddMenuItem();
  const updateMutation = useUpdateMenuItem();
  const deleteMutation = useDeleteMenuItem();

  // Pre-fill form when editing
  useEffect(() => {
    if (mode === "edit" && item) {
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        category: item.category,
        preparationTime: item.preparationTime.toString(),
        isAvailable: item.isAvailable,
        imageUrl: item.imageUrl || "",
      });
    } else {
      // Reset form for add mode
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        preparationTime: "",
        isAvailable: true,
        imageUrl: "",
      });
    }
    setErrors({});
    setImageLoadError(false);
  }, [mode, item, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (!formData.preparationTime || parseInt(formData.preparationTime) <= 0) {
      newErrors.preparationTime = "Preparation time must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const itemData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      category: formData.category,
      preparationTime: parseInt(formData.preparationTime),
      isAvailable: formData.isAvailable,
      imageUrl: formData.imageUrl.trim() || undefined,
    };

    try {
      if (mode === "add") {
        await addMutation.mutateAsync(itemData);
      } else if (mode === "edit" && item) {
        await updateMutation.mutateAsync({
          id: item.id,
          itemData,
        });
      }
      onOpenChange(false);
    } catch (error) {
      // Error toast is handled by the mutation
      console.error("Failed to save menu item:", error);
    }
  };

  const handleDelete = async () => {
    if (!item) return;

    try {
      await deleteMutation.mutateAsync(item.id);
      setShowDeleteDialog(false);
      onOpenChange(false);
    } catch (error) {
      // Error toast is handled by the mutation
      console.error("Failed to delete menu item:", error);
    }
  };

  const isLoading =
    addMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col [&>button]:hidden"
          key={item?.id || "new"}
        >
          <DialogHeader className="sticky top-0 bg-background z-10 pb-4 pt-0 border-b">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle>
                  {mode === "add" ? "Add Menu Item" : "Edit Menu Item"}
                </DialogTitle>
                <DialogDescription>
                  {mode === "add"
                    ? "Add a new item to your menu"
                    : "Update the details of this menu item"}
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="icon-lg"
                className="h-8 w-8 p-0 hover:bg-muted cursor-pointer"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="grid gap-4 py-4">
              {/* Name */}
              <div className="grid gap-2">
                <Label htmlFor="name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Margherita Pizza"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div className="grid gap-2">
                <Label htmlFor="description">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe the dish..."
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Price and Prep Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">
                    Price ($) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="text-sm text-destructive">{errors.price}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="prepTime">
                    Prep Time (min) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="prepTime"
                    type="number"
                    min="1"
                    value={formData.preparationTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preparationTime: e.target.value,
                      })
                    }
                    placeholder="15"
                  />
                  {errors.preparationTime && (
                    <p className="text-sm text-destructive">
                      {errors.preparationTime}
                    </p>
                  )}
                </div>
              </div>

              {/* Category */}
              <div className="grid gap-2">
                <Label htmlFor="category">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select
                  key={formData.category || "new"}
                  value={formData.category || "Select a category"}
                  onValueChange={(value: string) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category">
                      {formData.category
                        ? formData.category
                        : "Select a category"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category}</p>
                )}
              </div>

              {/* Image URL */}
              <div className="grid gap-2">
                <Label htmlFor="imageUrl">Image URL (optional)</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData({ ...formData, imageUrl: e.target.value });
                    setImageLoadError(false);
                  }}
                  placeholder="https://example.com/image.jpg"
                />
                {formData.imageUrl && (
                  <div className="w-full h-48 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                    {!imageLoadError ? (
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onLoad={() => setImageLoadError(false)}
                        onError={() => setImageLoadError(true)}
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <ImageOff className="h-8 w-8" />
                        <p className="text-sm">Failed to load image</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Availability */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="availability" className="text-base">
                    Available
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Is this item currently available to order?
                  </p>
                </div>
                <Switch
                  id="availability"
                  checked={formData.isAvailable}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isAvailable: checked })
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter className="sticky bottom-0 bg-background z-10 pt-4 border-t gap-2">
            {mode === "edit" && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isLoading}
              >
                Delete
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSave} disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : mode === "add"
                ? "Add Item"
                : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{item?.name}" from your menu. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
