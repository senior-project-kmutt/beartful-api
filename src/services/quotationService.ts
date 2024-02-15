import { ICreateQuotation, IQuotation, Quotation } from "../models/quotation";
import { IUsers, Users } from "../models/user";

interface IGetQuotationResponse {
  freelanceId: string
  freelanceUsername: string
  cartItem: IQuotation[]
}

export const createQuotation = async (quotation: ICreateQuotation) => {
  try {
    const customerProfile = await Users.findOne({ username: quotation.customerUsername });
    const newData = {
      ...quotation,
      customerId: customerProfile._id
    } as IQuotation
    const newQuotation = new Quotation(newData)
    await newQuotation.validate();
    const response = await newQuotation.save();
    return response;
  } catch (error: any) {
    if (error.errors) {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }
    console.error("Error create artwork:", error);
    throw error;
  }
};

export const getQuotationById = async (quotationId: string) => {
  try {
    const quotation = await Quotation.findOne({ _id: quotationId });
    return quotation
  } catch (error: any) {
    console.error("Error get quotation:", error);
    throw error;
  }
};

export const getQuotationByCustomerId = async (customerId: string) => {
  try {
    const user = await Users.find({ _id: customerId });
    if (user) {
      const quotations = await Quotation.find({customerId: customerId.toString(), status: 'inCart'}).sort({ createdAt: -1 });
      const transformQuotation = await transformToICarts(quotations);
      return transformQuotation;
    }
  } catch (error: any) {
    if (error.errors) {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      console.error("Validation errors:", validationErrors);
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }
    console.error("Error get quotation:", error);
    throw error;
  }
};

const transformToICarts = async (quotationItems: IQuotation[]): Promise<IGetQuotationResponse[]> => {
  const result: IGetQuotationResponse[] = [];

  for (const quotation of quotationItems) {
      const user: IUsers = await Users.findOne({ _id: quotation.freelanceId });
      const existingQuotation = result.find((item) => item.freelanceId.toString() == quotation.freelanceId.toString());
      if (existingQuotation) {
          existingQuotation.cartItem.push(quotation);
      } else {
          result.push({
              freelanceId: user._id,
              freelanceUsername: user.username,
              cartItem: [quotation],
          });
      }
  }

  return result;
};

export const updateQuotationStatus = async (quotationId: string, status: string) => {
  try {
    const newStatus = {
      status: status
    }
    const response = await Quotation.updateOne({ _id: quotationId }, { $set: newStatus });
    return response;
  } catch (error: any) {
    console.error("Error create artwork:", error);
    throw error;
  }
};
