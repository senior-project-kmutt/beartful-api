import { Category } from "../models/category";

export const getCategory = async () => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        return categories;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};
