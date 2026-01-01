import { useState } from "react";
import { Badge } from "@/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  orderId: string;
  onStatusChange?: (newStatus: OrderStatus) => void;
  disabled?: boolean;
  className?: string;
}

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; icon: string }
> = {
  pending: {
    label: "Pending",
    color:
      "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200",
    icon: "⏱️",
  },
  processing: {
    label: "Processing",
    color: "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200",
    icon: "⚙️",
  },
  shipped: {
    label: "Shipped",
    color:
      "bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200",
    icon: "📦",
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-800 border-green-300 hover:bg-green-200",
    icon: "✓",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800 border-red-300 hover:bg-red-200",
    icon: "✕",
  },
};

const STATUS_OPTIONS: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function OrderStatusBadge({
  status,
  orderId,
  onStatusChange,
  disabled = false,
  className = "",
}: OrderStatusBadgeProps) {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);

  const config = STATUS_CONFIG[currentStatus];

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (newStatus === currentStatus) return;

    setIsUpdating(true);
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        toast({
          title: "Authentication error",
          description: "Please log in again",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update status");
      }

      const data = await response.json();
      if (data.success) {
        // Optimistic update
        setCurrentStatus(newStatus);
        onStatusChange?.(newStatus);

        toast({
          title: "Status updated",
          description: `Order status changed to ${newStatus}`,
        });
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update order status";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      // Revert optimistic update
      setCurrentStatus(status);
    } finally {
      setIsUpdating(false);
    }
  };

  if (disabled) {
    return (
      <Badge className={`capitalize border ${config.color} ${className}`}>
        {config.icon} {config.label}
      </Badge>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Badge
          className={`capitalize border cursor-pointer transition-colors ${config.color} ${className}`}
        >
          {isUpdating ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
              Updating...
            </>
          ) : (
            <>
              {config.icon} {config.label}
            </>
          )}
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {STATUS_OPTIONS.map((s) => (
          <DropdownMenuItem
            key={s}
            onClick={() => handleStatusChange(s)}
            disabled={s === currentStatus || isUpdating}
            className={s === currentStatus ? "bg-secondary" : ""}
          >
            <span className="mr-2">{STATUS_CONFIG[s].icon}</span>
            <span className="capitalize">{STATUS_CONFIG[s].label}</span>
            {s === currentStatus && <span className="ml-auto text-xs">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
