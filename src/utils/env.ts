export const isProduction = process.env.NODE_ENV === 'production';

const devBaseUrl = '/';
// 后端服务器地址 https://jsonplaceholder.typicode.com/
const proBaseUrl = '/';

export const baseURL = !isProduction ? devBaseUrl : proBaseUrl;
