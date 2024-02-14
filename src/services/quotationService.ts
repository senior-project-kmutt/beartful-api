import { IQuotation, Quotation } from "../models/quotation";
import { Users } from "../models/user";

export const createQuotation = async (quotation: IQuotation) => {
  try {
    const newQuotation = new Quotation(quotation)
    await newQuotation.validate();
    const response = await newQuotation.save();
    return response;
  } catch (error: any) {
    if (error.errors) {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      console.error("Validation errors:", validationErrors);
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }
    console.error("Error create artwork:", error);
    throw error;
  }
};

export const getQuotationByCustomerId = async (customerId: string) => {
  try {
    const user = await Users.find({ _id: customerId });
    if (user) {
      const quotations = await Quotation.find({customerUsername: user[0].username})
      return quotations;
    }
  } catch (error: any) {
    if (error.errors) {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      console.error("Validation errors:", validationErrors);
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }
    console.error("Error create artwork:", error);
    throw error;
  }
};
