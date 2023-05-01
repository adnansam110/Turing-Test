import axios from "axios";

export const apiCall = async (
  endpoint: string,
  method: string,
  body?: any
) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const accessToken = localStorage.getItem("access_token");
  const headers = {
    "Content-Type": "application/json",
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
  };
  try {
    const response = await axios({
      method: method,
      url: `${baseUrl}${endpoint}`,
      ...(!body && {
        data: body,
      }),
      headers
    });
    return response.data;
  } catch (error) {
    console.log("🚀 ~ file: api-helper.ts:24 ~ error:", error)
    return error
  }
};
