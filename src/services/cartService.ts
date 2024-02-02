import { Carts, ICartItem, ICarts } from "../models/cart";
import { IUsers, Users } from "../models/user";

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

