export default defineEventHandler(async (event) => {
    const session = event.context.session;

    const response = await fetch('https://issam-elkhadir.youcanshop.dev/api/products', {
        headers: {
            Authorization: 'Bearer ' + session.accessToken
        }
    });
    return await response.json();
});