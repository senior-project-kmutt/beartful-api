import { Carts, ICartAdd, ICartEdit, ICartItem, ICarts } from "../models/cart";
import { IUsers, Users } from "../models/user";

export const createCartItem = async (userId: string, body: ICartItem) => {
    try {
        const cart: ICartAdd = {
            customerId: userId,
            type: body.type,
            description: body.description,
            amount: body.amount,
            quantity: body.quantity,
            netAmount: body.amount * body.quantity,
            freelanceId: body.freelanceId,
            artworkId: body._id,
            artworkName: body.artworkName
        }
        const response = await Carts.create(cart);
        return response;
    } catch (error) {
        console.error("Error add carts:", error);
        throw error;
    }
};

export const getCustomerCartByUserId = async (userId: string, type: string) => {
    try {
        let query: any = { customerId: userId };

        if (type !== undefined) {
            query.type = type;
        }
        const carts = await Carts.find(query).sort({ createdAt: -1 });
        const transformedCarts = await transformToICarts(carts);
        return transformedCarts;
    } catch (error) {
        console.error("Error fetching carts:", error);
        throw error;
    }
};

export const getCartById = async (cartId: string) => {
    try {
        const response = await Carts.findOne({ _id: cartId });
        return response;
    } catch (error) {
        console.error("Error get cart by Id:", error);
        throw error;
    }
};

const transformToICarts = async (cartItems: ICartItem[]): Promise<ICarts[]> => {
    const result: ICarts[] = [];

    for (const cartItem of cartItems) {
        const user: IUsers = await Users.findOne({ _id: cartItem.freelanceId });
        const freelanceUsername = user ? user.username : "Unknown";

        const existingCart = result.find((cart) => cart.freelanceId === cartItem.freelanceId);

        if (existingCart) {
            existingCart.cartItem.push(cartItem);
        } else {
            result.push({
                freelanceId: cartItem.freelanceId,
                freelanceUsername: freelanceUsername,
                cartItem: [cartItem],
            });
        }
    }

    return result;
};

export const updateCart = async (cartId: string, updateCart: ICartEdit) => {
    try {
        const response = await Carts.updateOne({ _id: cartId }, { $set: updateCart });
        return response;
    } catch (error) {
        console.error("Error edit cart:", error);
        throw error;
    }
};

export const deleteCart = async (cartId: string) => {
    try {
        const response = await Carts.deleteOne({ _id: cartId });
        return response;
    } catch (error) {
        console.error("Error delete cart:", error);
        throw error;
    }
};

