const CategoriesSection = () => {
    const categories = [
      {
        id: 1,
        name: "Technology",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        link: "/category/technology",
      },
      {
        id: 2,
        name: "Travel",
        image: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        link: "/category/travel",
      },
      // Add more categories
    ];
  
    return (
      <div className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Explore Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <div key={category.id} className="relative group">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center">
                  <a
                    href={category.link}
                    className="text-white text-2xl font-bold hover:underline"
                  >
                    {category.name}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default CategoriesSection;