export default defineNuxtRouteMiddleware((_to, _from) => {
  const { status } = useSession();

  if (status.value === "authenticated") {
    if (process.server) { return navigateTo({ name: "polls" }); }

    return abortNavigation();
  }
});
