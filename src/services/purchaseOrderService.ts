import { IPurchaseOrderItem, PurchaseOrderItems } from "../models/purchaseOderItem";
import { ICustomerGetPurchaseOrder, IFreelanceGetPurchaseOrder, IGetOrder, IPurchaseOrder, PurchaseOrders } from "../models/purchaseOrder";
import { IQuotation, Quotation } from "../models/quotation";
import { IUserFreelance, IUsers, Users } from "../models/user";
import { getUserById } from "./userService";
import { ITransaction, Transactions } from "../models/transaction";

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

export const createTransaction = async (type: string, omiseTransactionId: string, freelanceId: string, amount: number, name:string ) => {
  try {
    const newTransaction = new Transactions({ type: type, omiseTransactionId: omiseTransactionId, freelanceId: freelanceId, amount: amount, from: name });
    await newTransaction.validate();
    const response = await newTransaction.save();
    return response;
  } catch (error: any) {
    if (error.errors) {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      console.error("Validation errors:", validationErrors);
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }
    console.error("Error create transaction:", error);
    throw error;
  }
};

export const getTransactionByFreelanceId = async (freelanceId: string) => {
  try {
    const transaction: ITransaction[] = await Transactions.find({ freelanceId: freelanceId }).sort({ createdAt: -1 });
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    return transaction;
  } catch (error) {
    console.error("Error get transaction:", error);
    throw error;
  }
};

const transformToICustomerGetPurchaseOrder = async (purchaseOrders: IPurchaseOrder[]): Promise<ICustomerGetPurchaseOrder[]> => {
  const result: ICustomerGetPurchaseOrder[] = [];

  for (const purchaseOrder of purchaseOrders) {
    const user: IUsers = await Users.findOne({ _id: purchaseOrder.freelanceId });
    const freelanceUsername = user ? user.username : "Unknown";

    const existingPurchaseOrder = result.find((order) => order.freelanceId === purchaseOrder.freelanceId);
    let purchaseOderItem: IPurchaseOrderItem | undefined;
    let quotation: IQuotation | undefined;
    let orders: IGetOrder | undefined;
    if (purchaseOrder.type === 'readyMade') {
      purchaseOderItem = await PurchaseOrderItems.findOne({ purchaseOrderId: purchaseOrder._id });
      orders = {
        purchaseOrder: purchaseOrder,
        purchaseOrderItem: purchaseOderItem
      }
    } else if (purchaseOrder.type === 'hired') {
      quotation = await Quotation.findOne({ _id: purchaseOrder.quotationId });
      orders = {
        purchaseOrder: purchaseOrder,
        quotation: quotation
      }
    }

    if (orders) {
      if (existingPurchaseOrder) {
        existingPurchaseOrder.order.push(orders);
      } else {
        result.push({
          freelanceId: purchaseOrder.freelanceId || '',
          freelanceUsername: freelanceUsername,
          order: [orders],
        });
      }
    }
  }
  return result;
}

const transformToIFreelanceGetPurchaseOrder = async (purchaseOrders: IPurchaseOrder[]): Promise<IFreelanceGetPurchaseOrder[]> => {
  const result: IFreelanceGetPurchaseOrder[] = [];

  for (const purchaseOrder of purchaseOrders) {
    const user: IUsers = await Users.findOne({ _id: purchaseOrder.customerId });
    const customerUsername = user ? user.username : "Unknown";

    const existingPurchaseOrder = result.find((order) => order.customerId === purchaseOrder.customerId);
    let purchaseOderItem: IPurchaseOrderItem | undefined;
    let quotation: IQuotation | undefined;
    let orders: IGetOrder | undefined;
    if (purchaseOrder.type === 'readyMade') {
      purchaseOderItem = await PurchaseOrderItems.findOne({ purchaseOrderId: purchaseOrder._id });
      orders = {
        purchaseOrder: purchaseOrder,
        purchaseOrderItem: purchaseOderItem
      }
    } else if (purchaseOrder.type === 'hired') {
      quotation = await Quotation.findOne({ _id: purchaseOrder.quotationId });
      orders = {
        purchaseOrder: purchaseOrder,
        quotation: quotation
      }
    }

    if (orders) {
      if (existingPurchaseOrder) {
        existingPurchaseOrder.order.push(orders);
      } else {
        result.push({
          customerId: purchaseOrder.customerId || '',
          customerUsername: customerUsername,
          order: [orders],
        });
      }
    }
  }
  return result;
}

export const transformToIGetPurchaseOrder = async (purchaseOrder: IPurchaseOrder): Promise<IGetOrder> => {
  let purchaseOderItem: IPurchaseOrderItem | undefined;
  let quotation: IQuotation | undefined;
  let orders: IGetOrder = {
    purchaseOrder: purchaseOrder
  };
  if (purchaseOrder.type === 'readyMade') {
    purchaseOderItem = await PurchaseOrderItems.findOne({ purchaseOrderId: purchaseOrder._id });
    orders = {
      purchaseOrder: purchaseOrder,
      purchaseOrderItem: purchaseOderItem
    }
  } else if (purchaseOrder.type === 'hired') {
    quotation = await Quotation.findOne({ _id: purchaseOrder.quotationId });
    orders = {
      purchaseOrder: purchaseOrder,
      quotation: quotation
    }
  }
  return orders
}
export const getCustomerPurchaseOrderByCustomerID = async (userId: string, status: string) => {
  try {
    let query: any = { customerId: userId };
    if (status == 'pending') {
      query.status = { $in: ['pending', 'delivered'] };
    } else if (status !== 'all') {
      query.status = status;
    }
    const customerPurchaseOrder = await PurchaseOrders.find(query).sort({ createdAt: -1 });
    const transformedPurchaseOrder = await transformToICustomerGetPurchaseOrder(customerPurchaseOrder);
    return transformedPurchaseOrder;
  } catch (error) {
    console.error("Error fetching purchaseOrder:", error);
    throw error;
  }
}

export const getFreelanceWorkByFreelanceID = async (userId: string, status: string) => {
  try {
    let query: any = { freelanceId: userId };
    if (status == 'pending') {
      query.status = { $in: ['pending', 'delivered'] };
    } else if (status !== 'all') {
      query.status = status;
    }
    const customerPurchaseOrder = await PurchaseOrders.find(query).sort({ createdAt: -1 });
    const transformedPurchaseOrder = await transformToIFreelanceGetPurchaseOrder(customerPurchaseOrder);
    return transformedPurchaseOrder;
  } catch (error) {
    console.error("Error fetching purchaseOrder:", error);
    throw error;
  }
}

export const getPurchaseOrderById = async (purchaseOrderId: string) => {
  try {
    const response = await PurchaseOrders.findOne({ _id: purchaseOrderId });
    return response;
  } catch (error) {
    console.error("Error get purchase order by Id:", error);
    throw error;
  }
};

export const updatePurchaseOrderStatus = async (purchaseOrderId: string, updatePurchaseOrder: Object) => {
  try {
    await PurchaseOrders.updateOne({ _id: purchaseOrderId }, { $set: updatePurchaseOrder });
    return updatePurchaseOrder;
  } catch (error) {
    console.error("Error edit artwork:", error);
    throw error;
  }
};

export const getPurchaseOrderDetailById = async (purchaseOrderId: string) => {
  try {
    const purchaseOrder: IPurchaseOrder = await PurchaseOrders.findOne({ _id: purchaseOrderId });
    if (purchaseOrder) {
      const order = await transformToIGetPurchaseOrder(purchaseOrder);
      const freelance: IUserFreelance[] = await getUserById(purchaseOrder.freelanceId || '');
      const customer: IUsers[] = await getUserById(purchaseOrder.customerId);
      console.log(freelance);
      console.log(customer);
      const response = {
        freelance: {
          firstname: freelance[0].firstname,
          lastname: freelance[0].lastname,
          address: freelance[0].address
        },
        customer: {
          firstname: customer[0].firstname,
          lastname: customer[0].lastname
        },
        order: order
      }
      return response;
    }
  } catch (error) {
    console.error("Error get purchase order by Id:", error);
    throw error;
  }
};