export const environment = {
  production: false,
  apiBaseUrl: (() => {
    const host = window.location.hostname;
    return `https://${host}:44392`;
  })()
};