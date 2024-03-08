export default defineEventHandler(async (event) => {
  const session = event.context.session;

  const response = await fetch('https://api.youcanshop.dev/me', {
      headers: {
          Authorization: 'Bearer ' + session.accessToken
      }
  });
  const store = await response.json();

  return store;
});
