"use client";
import React from "react";
import { Input } from "@/components/ui/input"; // shadcn/ui Input

interface TitleAndTagsInputProps {
  values: {
    title: string;
    category: string;
    tags: string[];
    image: string; // New field for image URL
  };
  setValues: (values: { title: string; category: string; tags: string[]; image: string }) => void;
  isEdit?: boolean; // New prop to determine edit mode
}

const TitleAndTagsInput: React.FC<TitleAndTagsInputProps> = ({ values, setValues, isEdit = false }) => {
  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === "tags") {
      setValues({ ...values, tags: value.split(",").map((tag) => tag.trim()) });
    } else {
      setValues({ ...values, [id]: value });
    }
  };

  // Ensure tags is always an array
  const tagsValue = values.tags || [];

  return (
    <div className="space-y-4 mb-3">
      {/* Title Input */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1 dark:text-white">
          Title
        </label>
        <Input
          id="title"
          type="text"
          placeholder="Enter title"
          value={values.title || ""} // Fallback to empty string
          onChange={handleChange}
          className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
        />
      </div>

      {/* Category Input */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1 dark:text-white">
          Category
        </label>
        <Input
          id="category"
          type="text"
          placeholder="Enter Category"
          value={values.category || ""} // Fallback to empty string
          onChange={handleChange}
          className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
        />
      </div>

      {/* Tags Input */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium mb-1 dark:text-white">
          Tags (comma-separated)
        </label>
        <Input
          id="tags"
          type="text"
          placeholder="Enter tags (e.g., tech, blog, nextjs)"
          value={tagsValue.join(", ")} // Use tagsValue instead of values.tags
          onChange={handleChange}
          className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
        />
      </div>

      {/* Image URL Input */}
      <div>
        <label htmlFor="image" className="block text-sm font-medium mb-1 dark:text-white">
          Image URL
        </label>
        <Input
          id="image"
          type="text"
          placeholder="Enter image URL"
          value={values.image || ""} // Fallback to empty string
          onChange={handleChange}
          className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
        />
      </div>

      {/* Image Preview */}
      {values.image && (
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1 dark:text-white">Image Preview</label>
          <img
            src={values.image}
            alt="Preview"
            className="w-full h-auto rounded-lg shadow-sm border border-gray-300 dark:border-gray-700"
            onError={(e) => {
              // Handle broken image URLs
              e.currentTarget.src = "https://via.placeholder.com/300x150?text=Invalid+URL";
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TitleAndTagsInput;