import { Category } from "../models/category";

export const getCategory = async () => {
    try {
        const category = await Category.find()
        return category;
    } catch (error) {
        console.error("Error fetching category:", error);
        throw error;
    }
};
