import { useApi } from "~/server/helpers/useApi";

export default defineEventHandler(async (event) => {
    try {
        const session = event.context.session;

        if (!session.accessToken) {
            return { error: 'Access token is required for this API request' };
        }

        return await useApi('https://api.youcanshop.dev/me', 'GET', session.accessToken);
    } catch (error : any) {
        return { error: error.message };
    }
});
