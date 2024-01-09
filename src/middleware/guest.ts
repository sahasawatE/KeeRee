export default defineNuxtRouteMiddleware(async (to, from) => {
  const app = useNuxtApp();

  if (to.path === "/" && from.path === "/") {
    if (process.client) {
      const checked_token = await app.$auth.checkToken();
      if (checked_token) {
        return "/home";
      } else {
        return true;
      }
    }
  }

  if (from.path !== "/") {
    const checked_token = await app.$auth.checkToken();
    if (checked_token) {
      return false;
    } else {
      return true;
    }
  }
});
