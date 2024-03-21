import { IReview, Review } from "../models/review";

export const createNewReview = async (body: IReview) => {
  try {
    const newReview = new Review(body);
    await newReview.validate();
    const response = await newReview.save();
    return response
  } catch (error: any) {
    if (error.errors) {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      console.error("Validation errors:", validationErrors);
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }
  }
}
