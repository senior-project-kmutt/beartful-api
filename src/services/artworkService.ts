import { Artworks, IArtworks } from "../models/artwork";

export const getArtwork = async (page?: string, pageSize?: string, type?: string) => {
  const pages = page ? parseInt(page) : 1;
  const pageSizes = pageSize ? parseInt(pageSize) : 0;

  try {
    let query = {};
    if (type) {
      query = { type: type }
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

export const createArtwork = async (artwork: IArtworks) => {
  try {
    const response = await Artworks.create(artwork);
    return response;
  } catch (error) {
    console.error("Error create artwork:", error);
    throw error;
  }
};

export const deleteArtwork = async (artworkId: string) => {
  try {
    const response = await Artworks.deleteOne({ _id: artworkId });
    return response;
  } catch (error) {
    console.error("Error delete artwork:", error);
    throw error;
  }
};
