const NewsletterSection = () => {
    return (
      <div className="py-12 bg-gradient-to-r from-zinc-100 to-slate-50 dark:bg-gradient-to-r dark:from-slate-900 dark:to-stone-950">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl dark:text-gray-100 font-bold text-neutral-900 mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-gray-950 dark:text-gray-300 mb-8">
            Get the latest updates, exclusive content, and more delivered straight to your inbox.
          </p>
          <form className="flex flex-col md:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-3 rounded-lg w-full md:w-96 focus:outline-none dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    );
  };
  
  export default NewsletterSection;