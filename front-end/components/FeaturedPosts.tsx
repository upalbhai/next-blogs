"use client"
import { getFeaturePost } from "@/lib/blogs/_requests";
import { useEffect, useState } from "react";
import BlogPostList from "./BlogPostList";
import { toast } from "@/hooks/use-toast";

const FeaturedPosts = () => {
    const [posts,setPosts] = useState();
    const [loading,setLoading] = useState(false)
    const getData=async()=>{
        try {
            setLoading(true)
            const response = await getFeaturePost();
        if(response?.meta?.success){
            setPosts(response?.data ?? [])
        }
        } catch (error) {
         console.error("ERROR IN GETTING FEATURE POSTS",error)   
        }
        finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        getData();
    },[])

  
    return (
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Featured Posts
          </h2>
          <BlogPostList posts={posts} loading={loading} />
          </div>
    );
  };
  
  export default FeaturedPosts;