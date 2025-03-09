import React from "react";
import AdSense from "@/components/Adsense"; // Custom AdSense component
import RelatedPosts from "@/components/RelatedPosts"; // Related posts component
import Comments from "@/components/Comments"; // Comments component
import SocialShareButtons from "@/components/SocialShareButtons"; // Social sharing buttons

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Main Content */}
      <article className="prose prose-lg dark:prose-invert">
        {children}
      </article>

      {/* AdSense Banner (Top) */}
      <div className="my-8">
        <AdSense slot="top-banner" />
      </div>

      {/* Social Sharing Buttons */}
      <div className="my-8">
        <SocialShareButtons
          url="https://yourblog.com/post-slug"
          title="Your Blog Post Title"
        />
      </div>

      {/* Related Posts */}
      <div className="my-8">
        <RelatedPosts currentPostId="123" /> {/* Pass the current post ID */}
      </div>

      {/* AdSense Banner (Middle) */}
      <div className="my-8">
        <AdSense slot="middle-banner" />
      </div>

      {/* Comments Section */}
      

      {/* AdSense Banner (Bottom) */}
      <div className="my-8">
        <AdSense slot="bottom-banner" />
      </div>
    </div>
  );
};

export default Layout;