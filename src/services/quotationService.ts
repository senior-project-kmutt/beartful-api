import { IQuotation, Quotation } from "../models/quotation";

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
