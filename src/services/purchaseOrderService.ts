import { IPurchaseOrderItem, PurchaseOrderItems } from "../models/purchaseOderItem";
import { IPurchaseOrder, PurchaseOrders } from "../models/purchaseOrder";

export const createOrder = async (order: IPurchaseOrder) => {
  try {
    const newOrder = new PurchaseOrders(order);
    await newOrder.validate();
    const response = await newOrder.save();
    return response;
  } catch (error: any) {
    if (error.errors) {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      console.error("Validation errors:", validationErrors);
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }
    console.error("Error create purchase order:", error);
    throw error;
  }
};

export const createPurchaseOrderItem = async (item: IPurchaseOrderItem) => {
  try {
    const newOrder = new PurchaseOrderItems(item);
    await newOrder.validate();
    const response = await newOrder.save();
    return response;
  } catch (error: any) {
    if (error.errors) {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      console.error("Validation errors:", validationErrors);
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }
    console.error("Error create purchase order item:", error);
    throw error;
  }
};