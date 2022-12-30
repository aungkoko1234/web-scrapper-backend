export const getResponseFormat = (
  statusCode: number,
  message: string,
  data: any = null,
  error: any = null,
) => ({
  statusCode,
  message,
  data,
  error,
});