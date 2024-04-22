import { Artworks, IArtworkEditForm, IArtworks } from "../models/artwork";
import { Carts } from "../models/cart";

export const getArtwork = async (page?: string, pageSize?: string, type?: string, category?: string) => {
  const pages = page ? parseInt(page) : 1;
  const pageSizes = pageSize ? parseInt(pageSize) : 0;

  try {
    let query: any = {};
    if (type) {
      query.type = type;
    }
    if (category) {
      query.categoryId = { $in: [category] };
    }

    const artworksQuery = pageSizes > 0
      ? Artworks.find(query).skip((pages - 1) * pageSizes).limit(pageSizes)
      : Artworks.find(query);

    const artworks = await artworksQuery.exec();
    const shuffledArtworks = artworks.sort(() => Math.random() - 0.5);
    return shuffledArtworks;
  } catch (error) {
    console.error("Error fetching artworks:", error);
    throw error;
  }
};

export const getArtworkById = async (artworkId: string) => {
  try {
    const response = await Artworks.findOne({ _id: artworkId });
    return response;
  } catch (error) {
    console.error("Error get artwork by Id:", error);
    throw error;
  }
};

export const createArtwork = async (artwork: IArtworks) => {
  try {
    const newArtwork = new Artworks(artwork);
    await newArtwork.validate();
    const response = await newArtwork.save();
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

export const deleteArtwork = async (artworkId: string) => {
  try {
    const response = await Artworks.deleteOne({ _id: artworkId });
    await Carts.deleteMany({artworkId: artworkId})
    return response;
  } catch (error) {
    console.error("Error delete artwork:", error);
    throw error;
  }
};

export const updateArtwork = async (artworkId: string, updateArtwork: IArtworkEditForm) => {
  try {
    const response = await Artworks.updateOne({ _id: artworkId }, { $set: updateArtwork });
    return response;
  } catch (error) {
    console.error("Error edit artwork:", error);
    throw error;
  }
};

