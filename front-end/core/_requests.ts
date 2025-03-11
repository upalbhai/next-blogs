import axios, { AxiosResponse } from 'axios';
import { BASE_URL, QUERIES } from './_consts';

interface GoogleAuthRequest {
//   token: string; // Modify this based on actual expected fields
name:string;
email:string;
profilePicture:string;
}

interface GoogleAuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    // Add other fields if needed
  };
  token: string;
}

export const google = async (reqObj: GoogleAuthRequest): Promise<GoogleAuthResponse | null> => {
  try {
    const response: AxiosResponse<GoogleAuthResponse> = await axios.post(
      `${BASE_URL}${QUERIES.GOOGLE}`,
      reqObj,{withCredentials:true}
    );
    return response.data;
  } catch (error) {
    console.error('Google Auth API Error:', error);
    return null; // Or handle the error differently (e.g., throw it)
  }
};



export const logout = async () => {
  const response = await axios.post(
    `${BASE_URL}${QUERIES.LOGOUT}`, 
    {}, // Empty body (if needed)
    { withCredentials: true } // Pass in config object
  );
  return response.data;
};

export const subscription = async(email:string)=>{
  const response = await axios.post(`${BASE_URL}${QUERIES.SUBSCRIBTION}`,{
    email
  });
  return response.data
}
