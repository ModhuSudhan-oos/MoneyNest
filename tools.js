// === /js/tools.js ===
const featuredToolsContainer = document.getElementById('featured-tools');
const toolsGridContainer = document.getElementById('tools-grid');
const categoryFiltersContainer = document.getElementById('category-filters');
const upcomingToolsContainer = document.getElementById('upcoming-tools');

// Fetch and display all tools
const fetchTools = async () => {
  try {
    const snapshot = await db.collection('tools').get();
    const allTools = [];
    const categories = new Set();
    
    snapshot.forEach(doc => {
      const tool = { id: doc.id, ...doc.data() };
      allTools.push(tool);
      
      // Add categories
      if (tool.category) {
        tool.category.forEach(cat => categories.add(cat));
      }
    });
    
    // Render categories
    renderCategories(Array.from(categories));
    
    // Render featured tools
    const featured = allTools.filter(tool => tool.featured);
    renderFeaturedTools(featured);
    
    // Render all tools
    renderToolsGrid(allTools);
    
    // Render upcoming tools
    const upcoming = allTools.filter(tool => tool.status === 'coming-soon');
    renderUpcomingTools(upcoming);
    
  } catch (error) {
    console.error('Error fetching tools:', error);
  }
};

// Render categories filter
const renderCategories = (categories) => {
  categoryFiltersContainer.innerHTML = '';
  
  // Add "All" category
  const allButton = document.createElement('button');
  allButton.textContent = 'All';
  allButton.classList.add('px-4', 'py-2', 'bg-blue-600', 'text-white', 'rounded-lg', 'category-filter');
  allButton.dataset.category = 'all';
  categoryFiltersContainer.appendChild(allButton);
  
  // Add other categories
  categories.forEach(category => {
    const button = document.createElement('button');
    button.textContent = category;
    button.classList.add('px-4', 'py-2', 'bg-white', 'dark:bg-gray-700', 'hover:bg-gray-100', 'dark:hover:bg-gray-600', 'rounded-lg', 'border', 'border-gray-200', 'dark:border-gray-600', 'category-filter');
    button.dataset.category = category;
    categoryFiltersContainer.appendChild(button);
  });
  
  // Add event listeners
  document.querySelectorAll('.category-filter').forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.category;
      filterToolsByCategory(category);
    });
  });
};

// Filter tools by category
const filterToolsByCategory = (category) => {
  const allCards = document.querySelectorAll('.tool-card');
  
  allCards.forEach(card => {
    if (category === 'all' || card.dataset.categories.includes(category)) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
};

// Render featured tools
const renderFeaturedTools = (tools) => {
  featuredToolsContainer.innerHTML = '';
  
  tools.forEach(tool => {
    const toolCard = createToolCard(tool);
    featuredToolsContainer.appendChild(toolCard);
  });
};

// Render tools grid
const renderToolsGrid = (tools) => {
  toolsGridContainer.innerHTML = '';
  
  tools.forEach(tool => {
    const toolCard = createToolCard(tool);
    toolsGridContainer.appendChild(toolCard);
  });
};

// Create tool card element
const createToolCard = (tool) => {
  const card = document.createElement('div');
  card.classList.add('tool-card', 'bg-white', 'dark:bg-gray-800', 'rounded-xl', 'overflow-hidden', 'shadow-lg', 'border', 'border-gray-100', 'dark:border-gray-700', 'transition', 'duration-300');
  
  // Add categories as data attribute for filtering
  if (tool.category) {
    card.dataset.categories = tool.category.join(',');
  }
  
  card.innerHTML = `
    <div class="h-48 overflow-hidden">
      <img src="${tool.imageUrl || '/assets/default-tool.jpg'}" alt="${tool.name}" class="w-full h-full object-cover">
    </div>
    <div class="p-6">
      <div class="flex justify-between items-start mb-3">
        <h3 class="text-xl font-bold">${tool.name}</h3>
        ${tool.featured ? '<span class="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded">Featured</span>' : ''}
      </div>
      <p class="text-gray-600 dark:text-gray-300 mb-4">${tool.description.substring(0, 100)}...</p>
      <div class="flex flex-wrap gap-2 mb-4">
        ${tool.category ? tool.category.map(cat => 
          `<span class="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">${cat}</span>`
        ).join('') : ''}
      </div>
      <a href="${tool.url}" target="_blank" class="block w-full text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition">
        Visit Tool
      </a>
    </div>
  `;
  
  return card;
};

// Render upcoming tools
const renderUpcomingTools = (tools) => {
  upcomingToolsContainer.innerHTML = '';
  
  tools.forEach(tool => {
    const toolCard = document.createElement('div');
    toolCard.classList.add('inline-block', 'w-64', 'm-4', 'bg-gradient-to-br', 'from-gray-50', 'to-gray-100', 'dark:from-gray-800', 'dark:to-gray-900', 'rounded-xl', 'p-6', 'border', 'border-gray-200', 'dark:border-gray-700');
    
    toolCard.innerHTML = `
      <div class="flex items-center mb-4">
        <div class="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-4">
          <i class="fas fa-clock text-blue-500"></i>
        </div>
        <h3 class="font-bold">${tool.name}</h3>
      </div>
      <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">${tool.description.substring(0, 80)}...</p>
      <div class="text-xs text-blue-500">Coming soon</div>
    `;
    
    upcomingToolsContainer.appendChild(toolCard);
  });
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', fetchTools);
