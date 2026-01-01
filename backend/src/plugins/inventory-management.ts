import { Plugin } from "@shared/plugins";
import { prisma } from "../db";

interface InventoryPluginSettings {
  enabled: boolean;
  lowStockThreshold: number;
  preventOverselling: boolean;
  notifyOnLowStock: boolean;
}

class InventoryManagementPlugin implements Plugin {
  name = "inventory-management";
  version = "1.0.0";
  description = "Automatic inventory tracking and stock management";
  type = "service" as const;
  settings = [];

  private config: InventoryPluginSettings = {
    enabled: true,
    lowStockThreshold: 10,
    preventOverselling: true,
    notifyOnLowStock: true,
  };

  async initialize(settings?: Partial<InventoryPluginSettings>) {
    console.log("[Inventory Plugin] Initializing...");
    if (settings) {
      this.config = { ...this.config, ...settings };
    }
    console.log("[Inventory Plugin] Settings:", this.config);
  }

  /**
   * Hook: onOrderCreate
   * Deduct inventory when an order is created
   */
  async onOrderCreate(data: any) {
    if (!this.config.enabled) return;
    console.log(`[Inventory Plugin] Processing order: ${data.orderNumber}`);

    try {
      // Get order items
      const orderItems = data.items || [];

      for (const item of orderItems) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          console.error(`[Inventory Plugin] Product ${item.productId} not found`);
          continue;
        }

        // Check if we have enough stock
        const newQuantity = product.quantity - item.quantity;

        if (newQuantity < 0 && this.config.preventOverselling) {
          console.error(
            `[Inventory Plugin] Insufficient stock for ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}`
          );
          throw new Error(
            `Insufficient stock for ${product.name}. Only ${product.quantity} available.`
          );
        }

        // Deduct stock
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            quantity: Math.max(0, newQuantity),
            inStock: newQuantity > 0,
          },
        });

        console.log(
          `[Inventory Plugin] Deducted ${item.quantity} units from ${product.name}. New stock: ${newQuantity}`
        );

        // Check for low stock
        if (
          newQuantity <= this.config.lowStockThreshold &&
          newQuantity > 0 &&
          this.config.notifyOnLowStock
        ) {
          console.warn(
            `[Inventory Plugin] LOW STOCK ALERT: ${product.name} has only ${newQuantity} units remaining`
          );
          // TODO: Send notification to admin
          // await notificationPlugin.sendLowStockAlert(product);
        }

        // Out of stock
        if (newQuantity <= 0) {
          console.warn(`[Inventory Plugin] OUT OF STOCK: ${product.name}`);
          // TODO: Send notification to admin
          // await notificationPlugin.sendOutOfStockAlert(product);
        }
      }
    } catch (error) {
      console.error("[Inventory Plugin] Error processing order:", error);
      throw error;
    }
  }

  /**
   * Hook: onOrderCancel
   * Restore inventory when an order is cancelled
   */
  async onOrderCancel(data: any) {
    if (!this.config.enabled) return;
    console.log(`[Inventory Plugin] Restoring inventory for cancelled order: ${data.orderNumber}`);

    try {
      const orderItems = data.items || [];

      for (const item of orderItems) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          console.error(`[Inventory Plugin] Product ${item.productId} not found`);
          continue;
        }

        // Restore stock
        const newQuantity = product.quantity + item.quantity;

        await prisma.product.update({
          where: { id: item.productId },
          data: {
            quantity: newQuantity,
            inStock: true,
          },
        });

        console.log(
          `[Inventory Plugin] Restored ${item.quantity} units to ${product.name}. New stock: ${newQuantity}`
        );
      }
    } catch (error) {
      console.error("[Inventory Plugin] Error restoring inventory:", error);
    }
  }

  /**
   * Check stock availability for a product
   */
  async checkStock(productId: string, requestedQuantity: number): Promise<boolean> {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error(`Product ${productId} not found`);
    }

    return product.quantity >= requestedQuantity;
  }

  /**
   * Get low stock products
   */
  async getLowStockProducts(): Promise<any[]> {
    return await prisma.product.findMany({
      where: {
        quantity: {
          lte: this.config.lowStockThreshold,
          gt: 0,
        },
      },
      orderBy: {
        quantity: "asc",
      },
    });
  }

  /**
   * Get out of stock products
   */
  async getOutOfStockProducts(): Promise<any[]> {
    return await prisma.product.findMany({
      where: {
        quantity: 0,
      },
    });
  }

  /**
   * Manual stock adjustment (for admin)
   */
  async adjustStock(
    productId: string,
    adjustment: number,
    reason: string
  ): Promise<void> {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error(`Product ${productId} not found`);
    }

    const newQuantity = Math.max(0, product.quantity + adjustment);

    await prisma.product.update({
      where: { id: productId },
      data: {
        quantity: newQuantity,
        inStock: newQuantity > 0,
      },
    });

    console.log(
      `[Inventory Plugin] Manual adjustment: ${product.name} ${adjustment > 0 ? "+" : ""}${adjustment} (${reason}). New stock: ${newQuantity}`
    );

    // TODO: Log to audit trail
  }
}

// Export plugin instance
export const inventoryPlugin = new InventoryManagementPlugin();
