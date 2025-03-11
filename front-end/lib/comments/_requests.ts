import { BASE_URL } from "@/core/_consts"
import axios from "axios"
import { QUERIES } from "./_consts"


export const createComment = async(reqObj:{
    content: string,
    authorId: string,
    blogId: string
    parentCommentId:string
}) =>{
    const response :any =await axios.post(`${BASE_URL}${QUERIES.CREATE_COMMENTS}`,{
        ...reqObj
    },{
        withCredentials:true
    });
    return response.data
}

export const getComments = async(blogId:string,page:Number)=>{
    const response :any =await axios.get(`${BASE_URL}${QUERIES.GET_COMMENTS}/${blogId}`,{
        params:{page}
    });
    return response.data
}

    export const deleteComment = async(commentId:string)=>{
        const response = await axios.delete(`${BASE_URL}${QUERIES.DELETE_COMMENTS}/${commentId}`,{
            withCredentials:true
        })
        return response.data
    }