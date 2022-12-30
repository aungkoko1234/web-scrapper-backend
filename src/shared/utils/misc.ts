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

export const selectRandomUser = () => {
  const randomNumber = Math.floor(Math.random() * userAgents.length);
  return userAgents[randomNumber];
};
