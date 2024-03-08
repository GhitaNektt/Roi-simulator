export const useApi = async (url : string, method : string, accessToken:string) => {;
  const response = await fetch(url, {
    method: method,
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return await response.json();
};
