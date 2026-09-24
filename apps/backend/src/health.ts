export const HEALTH_PATH = 'health';

// The aggregate health endpoint, which the Aspire AppHost polls every few
// seconds and is therefore kept out of request logs and traces.
export const isHealthRequest = (url: string | undefined): boolean =>
  url === `/${HEALTH_PATH}` || (url?.startsWith(`/${HEALTH_PATH}?`) ?? false);
