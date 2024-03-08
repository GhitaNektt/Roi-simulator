import { useApi } from "~/server/helpers/useApi";

export default defineEventHandler(async (event) => {
    try {
        const session = event.context.session;

        if (!session.accessToken) {
            return { error: 'Access token is required for this API request' };
        }

        const storeResponse = await useApi('https://api.youcanshop.dev/me', 'GET', session.accessToken);

        if (storeResponse.error) {
            return { error: 'Failed to fetch store details' };

        }

        const products =  await useApi(`https://${storeResponse.slug}.youcanshop.dev/api/products`, 'GET', session.accessToken);

        const existingProductIds = products?.data.map((p : any)=> p.id);
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
