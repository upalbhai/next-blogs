import { toast } from "@/hooks/use-toast";
import { featurePost } from "@/lib/blogs/_requests";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react"; // Import a loading spinner

type FeaturePostEditProps = {
    postId: any;
    isOpen: boolean;
    onClose: () => void;
    featured:boolean,
    fetchPost:any
  };
const FeaturePostEdit = ({ postId, isOpen, onClose,featured,fetchPost }: FeaturePostEditProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const updateFeature = async () => {
    try {
      setIsLoading(true); // Start loading
      const response = await featurePost(postId);
      if (response?.meta?.success) {
        toast({
          description: `${response?.meta?.message}`,
          className:
            "bg-green-100 text-green-800 border border-green-600 dark:bg-green-800 dark:text-white dark:border-green-600",
        });
        fetchPost();
        onClose(); // Close the dialog on success
      }
    } catch (error) {
      console.error("ERROR EDIT FEATURE POST", error);
      toast({
        description: "Something went wrong. Please try again.",
        className:
          "bg-red-100 text-red-800 border border-red-600 dark:bg-red-800 dark:text-white dark:border-red-600",
      });
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
            {
                featured ? (
                    <>
                    <DialogTitle>Unfeature This Post?</DialogTitle>
          <DialogDescription>
            Are you sure you want to unfeature this post? Featuring a post will not
            highlight it on the homepage.
          </DialogDescription>
                    </>
                ) : (
                    <>
                    
          <DialogTitle>Feature This Post?</DialogTitle>
          <DialogDescription>
            Are you sure you want to feature this post? Featuring a post will
            highlight it on the homepage.
          </DialogDescription>
                    </>
                )
            }
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={updateFeature} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeaturePostEdit;