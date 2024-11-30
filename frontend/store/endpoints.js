const baseUrl =
  "https://d8gwvgvje9.execute-api.us-east-1.amazonaws.com/prod/banking-app";

export default {
  login: `${baseUrl}/login`,
  register: `${baseUrl}/register`,
  user: `${baseUrl}/user`,
  transaction: `${baseUrl}/transaction`,
  transactions: `${baseUrl}/transactions`,
};
