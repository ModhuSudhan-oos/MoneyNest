// === /js/blog.js ===
const blogPostsContainer = document.getElementById('blog-posts');

// Fetch and display latest blog posts
const fetchBlogPosts = async () => {
  try {
    const snapshot = await db.collection('blogs')
      .orderBy('publishDate', 'desc')
      .limit(3)
      .get();
    
    const blogPosts = [];
    snapshot.forEach(doc => {
      blogPosts.push({ id: doc.id, ...doc.data() });
    });
    
    renderBlogPosts(blogPosts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
  }
};

// Render blog posts
const renderBlogPosts = (posts) => {
  blogPostsContainer.innerHTML = '';
  
  posts.forEach(post => {
    const postCard = document.createElement('div');
    postCard.classList.add('bg-white', 'dark:bg-gray-800', 'rounded-xl', 'overflow-hidden', 'shadow-lg');
    
    postCard.innerHTML = `
      <div class="h-48 overflow-hidden">
        <img src="${post.coverImage || '/assets/default-blog.jpg'}" alt="${post.title}" class="w-full h-full object-cover">
      </div>
      <div class="p-6">
        <div class="flex flex-wrap gap-2 mb-3">
          ${post.tags ? post.tags.map(tag => 
            `<span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">${tag}</span>`
          ).join('') : ''}
        </div>
        <h3 class="text-xl font-bold mb-2">${post.title}</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-4">${post.excerpt || post.body.substring(0, 120)}...</p>
        <a href="/blog-single.html?id=${post.id}" class="text-blue-600 font-medium hover:underline">Read more</a>
      </div>
    `;
    
    blogPostsContainer.appendChild(postCard);
  });
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', fetchBlogPosts);
