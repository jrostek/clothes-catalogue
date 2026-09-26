export const SWAGGER_PATH = 'swagger';

// Swagger UI and its assets (/swagger, /swagger/*, /swagger-json), which are
// kept out of request logs and traces.
export const isSwaggerRequest = (url: string | undefined): boolean =>
  url?.startsWith(`/${SWAGGER_PATH}`) ?? false;
