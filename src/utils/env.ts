export const isProduction = process.env.NODE_ENV === 'production';

const devBaseUrl = '/';

const proBaseUrl = 'https://jsonplaceholder.typicode.com/';

export const baseURL = !isProduction ? devBaseUrl : proBaseUrl;
