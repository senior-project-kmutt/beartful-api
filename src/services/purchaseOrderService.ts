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

export const getCustomerPurchaseOrderByCustomerID = async (userId: string, status: string) => {
  try {
    let query: any = { customerId: userId };
    if (status !== 'all') {
      query.status = status;
    }
    const customerPurchaseOrder = await PurchaseOrders.find(query).sort({ createdAt: -1 });
    return customerPurchaseOrder;
  } catch (error) {
    console.error("Error fetching purchaseOrder:", error);
    throw error;
  }
}

export const getFreelanceWorkByFreelanceID = async (userId: string, status: string) => {
  try {
    let query: any = { freelanceId: userId };
    if (status !== 'all') {
      query.status = status;
    }
    const customerPurchaseOrder = await PurchaseOrders.find(query).sort({ createdAt: -1 });
    return customerPurchaseOrder;
  } catch (error) {
    console.error("Error fetching purchaseOrder:", error);
    throw error;
  }
}
