const FeaturedPosts = () => {
    const posts = [
      {
        id: 1,
        title: "The Future of Web Development",
        excerpt: "Explore the latest trends in web development and how they shape the future.",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        link: "/blog/future-of-web-development",
      },
      {
        id: 2,
        title: "Mastering React in 2024",
        excerpt: "Learn how to master React with the latest features and best practices.",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        link: "/blog/mastering-react",
      },
      {
        id: 3,
        title: "Mastering React in 2024",
        excerpt: "Learn how to master React with the latest features and best practices.",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        link: "/blog/mastering-react",
      },
      {
        id: 4,
        title: "Mastering React in 2024",
        excerpt: "Learn how to master React with the latest features and best practices.",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        link: "/blog/mastering-react",
      },
      // Add more posts
    ];
  
    return (
      <div className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Featured Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {post.excerpt}
                  </p>
                  <div className='flex justify-end'>

                  <a
                    href={post.link}
                    className="inline-block  px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                  >
                    Read More
                  </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default FeaturedPosts;