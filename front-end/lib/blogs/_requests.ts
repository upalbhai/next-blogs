import { BASE_URL } from "@/core/_consts"
import axios from "axios"
import { QUERIES } from "./_consts"

interface PostData {
    title: string;
    category: string;
    content: string;
    tags: string[];
  }
export const createPosts = async(reqObj:any)=>{
    const response = await axios.post(`${BASE_URL}${QUERIES.CREATE_POSTS}`,{
        ...reqObj
    },{
        withCredentials:true
    });
    return response.data
}


export const getAllPosts = async ({ search = "", status = "", page = 1, limit = 10 }) => {
    const response = await axios.get(`${BASE_URL}${QUERIES.GET_POST}`, {
      params: { search, status, page, limit },
      withCredentials: true,
    });
    return response.data;
  };
export const getAllPostsUSers = async ({ search = "", status = "", page = 1, limit = 10 }) => {
    const response = await axios.get(`${BASE_URL}${QUERIES.GET_POST_USERS}`, {
      params: { search, status, page, limit },
      withCredentials: true,
    });
    return response.data;
  };

  export const getPostById=async(id:any)=>{
    const response = await axios.get(`${BASE_URL}${QUERIES.GET_POST_BY_ID}/${id}`);
    return response.data;
  }

  export const editPost = async (id: any, body: PostData): Promise<any> => {
    const response = await axios.put(`${BASE_URL}${QUERIES.EDIT_POST}/${id}`, body, {
      withCredentials: true, // Correct placement of withCredentials
    });
    return response.data;
  };
  

  export const deletepostbyId = async(id:string)=>{
    const response = await axios.delete(`${BASE_URL}${QUERIES.DELETE_POST}/${id}`,{
        withCredentials:true
    });
    return response.data
  }

  export const updateStadusById = async(id:string,newStatus:string)=>{
    const response = await axios.put(`${BASE_URL}${QUERIES.UPADATE_STATUS}/${id}`,{
      status: newStatus,
    },{
    withCredentials:true
  })
  return response.data
}


export const featurePost = async(postId:any)=>{
  const response = await axios.put(`${BASE_URL}${QUERIES.FEATURE_POSTS}/${postId}`,{},{
    withCredentials:true
  })
  return response.data
}

export const getFeaturePost = async()=>{
  const response = await axios.get(`${BASE_URL}${QUERIES.FEATURE_POSTS}`);
  return response.data
}

export const getCategories = async()=>{
  const response = await axios.get(`${BASE_URL}${QUERIES.GET_CATEGORIES}`);
  return response.data
}