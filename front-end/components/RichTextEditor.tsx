"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button"; // ShadCN Button
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"; // ShadCN Modal
import { Input } from "@/components/ui/input"; // ShadCN Input

const RichTextEditor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [content, setContent] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageAlign, setImageAlign] = useState<string>("left");
  const [showImageModal, setShowImageModal] = useState<boolean>(false);

  // Update content when editor changes
  const updateContent = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  // Apply formatting commands
  const applyFormatting = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    updateContent();
  };

  // Insert Image into Editor
  const insertImage = () => {
    if (imageUrl) {
      const img = document.createElement("img");
      img.src = imageUrl;
      img.alt = "Inserted Image";
      img.style.width = "100%";
      img.style.maxWidth = "400px";
      img.style.display = "block";
      img.style.margin = imageAlign === "center" ? "0 auto" : imageAlign === "right" ? "0 0 0 auto" : "0";
      editorRef.current?.appendChild(img);
      updateContent();
    }
    setShowImageModal(false);
    setImageUrl("");
  };

  useEffect(() => {
    document.addEventListener("selectionchange", updateContent);
    return () => document.removeEventListener("selectionchange", updateContent);
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => applyFormatting("bold")}>
          B
        </Button>
        <Button variant="outline" onClick={() => applyFormatting("italic")}>
          I
        </Button>
        <Button variant="outline" onClick={() => applyFormatting("underline")}>
          U
        </Button>
        <Button variant="outline" onClick={() => applyFormatting("strikeThrough")}>
          S
        </Button>
        <Button variant="outline" onClick={() => applyFormatting("justifyLeft")}>Left</Button>
        <Button variant="outline" onClick={() => applyFormatting("justifyCenter")}>Center</Button>
        <Button variant="outline" onClick={() => applyFormatting("justifyRight")}>Right</Button>
        <Button variant="outline" onClick={() => applyFormatting("insertOrderedList")}>1.</Button>
        <Button variant="outline" onClick={() => applyFormatting("insertUnorderedList")}>•</Button>

        {/* Image Insert Modal */}
        <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
          <DialogTrigger asChild>
            <Button variant="outline">🖼️ Insert Image</Button>
          </DialogTrigger>
          <DialogContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Insert Image</h2>
            <Input type="text" placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            <select className="mt-2 p-2 border rounded-md w-full" onChange={(e) => setImageAlign(e.target.value)}>
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={() => setShowImageModal(false)}>Cancel</Button>
              <Button onClick={insertImage}>Insert</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={updateContent}
        className="border border-gray-300 rounded-md p-4 min-h-[300px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{ whiteSpace: "pre-wrap" }}
      ></div>

      {/* Preview */}
      <div className="border-t pt-4">
        <h3 className="text-xl font-semibold">Preview:</h3>
        <div className="mt-4 border p-4 rounded-md bg-gray-50" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
};

export default RichTextEditor;
