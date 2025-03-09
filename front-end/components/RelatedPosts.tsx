const RelatedPosts = ({ currentPostId }: { currentPostId: string }) => {
    // Fetch related posts based on currentPostId
    const relatedPosts = [
      { id: 1, title: "Related Post 1", slug: "/post-1" },
      { id: 2, title: "Related Post 2", slug: "/post-2" },
    ];
  
    return (
      <div>
        <h3 className="text-xl font-bold mb-4">Related Posts</h3>
        <ul>
          {relatedPosts.map((post) => (
            <li key={post.id}>
              <a href={post.slug}>{post.title}</a>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default RelatedPosts;