import api from './api';

const client = api;

const config = {
  headers: {
    'Content-Type': 'application/json',
    // Authorization: `Token ${token}`,
  },
};

export async function getAlertsSetting(userToken) {
  config.headers.Authorization = `Token ${userToken}`;

  const response = await client.get(`alerts-setting/?isMine=true`, config);
  return response;
}

// export async function getSetting(id: number) {
//   const response = await client.get<Article>(`/articles/${id}`);
//   return response.data;
// }
