import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Truck } from "lucide-react";

interface TrackingNumberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  orderNumber: string;
  currentTracking?: {
    trackingNumber?: string;
    trackingUrl?: string;
    estimatedDelivery?: string;
  };
  onSuccess: () => void;
}

export default function TrackingNumberDialog({
  open,
  onOpenChange,
  orderId,
  orderNumber,
  currentTracking,
  onSuccess,
}: TrackingNumberDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState(currentTracking?.trackingNumber || "");
  const [trackingUrl, setTrackingUrl] = useState(currentTracking?.trackingUrl || "");
  const [estimatedDelivery, setEstimatedDelivery] = useState(
    currentTracking?.estimatedDelivery
      ? new Date(currentTracking.estimatedDelivery).toISOString().split("T")[0]
      : ""
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/orders/${orderId}/tracking`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          trackingNumber: trackingNumber || null,
          trackingUrl: trackingUrl || null,
          estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery).toISOString() : null,
        }),
      });

      if (!response.ok) throw new Error("Failed to update tracking");

      toast({
        title: "Success",
        description: "Tracking information updated successfully",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Update tracking error:", error);
      toast({
        title: "Error",
        description: "Failed to update tracking information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Update Tracking Information
          </DialogTitle>
          <DialogDescription>
            Add or update tracking details for order #{orderNumber}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="trackingNumber">Tracking Number</Label>
            <Input
              id="trackingNumber"
              placeholder="e.g., 1Z999AA10123456784"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trackingUrl">Tracking URL (Optional)</Label>
            <Input
              id="trackingUrl"
              type="url"
              placeholder="e.g., https://tracking.carrier.com/..."
              value={trackingUrl}
              onChange={(e) => setTrackingUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Full URL to track this shipment
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedDelivery">Estimated Delivery Date (Optional)</Label>
            <Input
              id="estimatedDelivery"
              type="date"
              value={estimatedDelivery}
              onChange={(e) => setEstimatedDelivery(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Tracking Info"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
