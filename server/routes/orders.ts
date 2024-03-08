import { useApi } from "~/server/helpers/useApi";

export default defineEventHandler(async (event) => {
    try {
        const session = event.context.session;

        if (!session.accessToken) {
            return { error: 'Access token is required for this API request' };
        }

       const existingProductIds = [
           "1a2144fb-57cf-41df-abf9-5ee039b7bd07",
           "3d3c90d2-542d-4d59-ac93-59c230766360",
           "779cf470-31c8-450c-8a4e-13bc1944fb12",
           "f20e41f1-b90a-45da-965c-117b7447b63e",
           "c821e727-1599-4c70-8fb8-55024a327c6d"
       ];

        function generateRandomInfo() {
            const uniqueProductId = existingProductIds.pop();
            if (!uniqueProductId) {
                return null;
            }

            return {
                product_id: uniqueProductId,
                orders: Math.floor(Math.random() * 100) + 1,
                confirmed: Math.floor(Math.random() * 50) + 1,
                delivered: Math.floor(Math.random() * 25) + 1,
                product_cost: Math.floor(Math.random() * 10) + 1,
                product_price: Math.floor(Math.random() * 50) + 1,
                ship_fee: Math.floor(Math.random() * 5) + 1,
                confirm_fee: Math.floor(Math.random() * 2) + 1,
                marketing_fee: Math.floor(Math.random() * 5) + 1,
                fix_fee: Math.floor(Math.random() * 2),
            };
        }

        return Array.from({ length: 5 }, generateRandomInfo);
    } catch ( error:any ) {
        return { error: error.message };
    }
});
