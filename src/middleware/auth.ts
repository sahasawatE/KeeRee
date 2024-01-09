export default defineNuxtRouteMiddleware(async (to) => {
  if (process.client) {
    const app = useNuxtApp();
    const checked_token = await app.$auth.checkToken();
    if (checked_token) {
      if (to.path === "/") {
        return false;
      } else {
        return true;
      }
    } else {
      return "/";
    }
  }
});
