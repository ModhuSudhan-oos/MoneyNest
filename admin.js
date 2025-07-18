// === /js/admin.js ===
// Initialize tools management
const initToolsManagement = async () => {
  const toolsList = document.getElementById('tools-list');
  
  // Fetch tools from Firestore
  const snapshot = await db.collection('tools').get();
  toolsList.innerHTML = '';
  
  snapshot.forEach(doc => {
    const tool = doc.data();
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td class="py-4 px-6">${tool.name}</td>
      <td class="py-4 px-6">${tool.category.join(', ')}</td>
      <td class="py-4 px-6">
        <span class="px-3 py-1 rounded-full text-xs 
          ${tool.status === 'live' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
          ${tool.status}
        </span>
      </td>
      <td class="py-4 px-6 flex space-x-2">
        <button class="edit-tool-btn px-3 py-1 bg-blue-600 text-white rounded-lg" data-id="${doc.id}">
          <i class="fas fa-edit"></i>
        </button>
        <button class="delete-tool-btn px-3 py-1 bg-red-600 text-white rounded-lg" data-id="${doc.id}">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    
    toolsList.appendChild(row);
  });
  
  // Add event listeners to edit buttons
  document.querySelectorAll('.edit-tool-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const toolId = btn.dataset.id;
      openToolForm(toolId);
    });
  });
  
  // Add event listeners to delete buttons
  document.querySelectorAll('.delete-tool-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const toolId = btn.dataset.id;
      if (confirm('Are you sure you want to delete this tool?')) {
        deleteTool(toolId);
      }
    });
  });
  
  // Add new tool button
  document.getElementById('add-tool-btn').addEventListener('click', () => {
    openToolForm();
  });
};

// Open tool form modal
const openToolForm = async (toolId = null) => {
  const modal = document.getElementById('tool-modal');
  const modalContent = modal.querySelector('div > div');
  
  let tool = null;
  if (toolId) {
    const doc = await db.collection('tools').doc(toolId).get();
    tool = { id: doc.id, ...doc.data() };
  }
  
  modalContent.innerHTML = `
    <div class="p-8">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-2xl font-bold">${tool ? 'Edit Tool' : 'Add New Tool'}</h3>
        <button id="close-modal" class="text-gray-500 hover:text-gray-700">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <form id="tool-form" class="space-y-6">
        <input type="hidden" id="tool-id" value="${tool ? tool.id : ''}">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-gray-700 mb-2">Tool Name *</label>
            <input type="text" id="tool-name" required value="${tool ? tool.name : ''}"
                   class="w-full px-4 py-3 border border-gray-300 rounded-lg">
          </div>
          
          <div>
            <label class="block text-gray-700 mb-2">Website URL *</label>
            <input type="url" id="tool-url" required value="${tool ? tool.url : ''}"
                   class="w-full px-4 py-3 border border-gray-300 rounded-lg">
          </div>
        </div>
        
        <div>
          <label class="block text-gray-700 mb-2">Description *</label>
          <textarea id="tool-description" required rows="3"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg">${tool ? tool.description : ''}</textarea>
        </div>
        
        <div>
          <label class="block text-gray-700 mb-2">Categories (comma separated)</label>
          <input type="text" id="tool-categories" value="${tool ? tool.category.join(', ') : ''}"
                 class="w-full px-4 py-3 border border-gray-300 rounded-lg">
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-gray-700 mb-2">Image URL</label>
            <input type="url" id="tool-image" value="${tool ? tool.imageUrl || '' : ''}"
                   class="w-full px-4 py-3 border border-gray-300 rounded-lg">
          </div>
          
          <div>
            <label class="block text-gray-700 mb-2">Status</label>
            <select id="tool-status" class="w-full px-4 py-3 border border-gray-300 rounded-lg">
              <option value="live" ${tool && tool.status === 'live' ? 'selected' : ''}>Live</option>
              <option value="coming-soon" ${tool && tool.status === 'coming-soon' ? 'selected' : ''}>Coming Soon</option>
            </select>
          </div>
          
          <div class="flex items-end">
            <div class="flex items-center">
              <input type="checkbox" id="tool-featured" ${tool && tool.featured ? 'checked' : ''}
                     class="w-5 h-5 text-blue-600 rounded">
              <label class="ml-2 text-gray-700">Featured Tool</label>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end space-x-4 pt-4">
          <button type="button" id="cancel-form" class="px-6 py-3 border border-gray-300 rounded-lg">
            Cancel
          </button>
          <button type="submit" class="px-6 py-3 bg-blue-600 text-white rounded-lg">
            ${tool ? 'Update Tool' : 'Add Tool'}
          </button>
        </div>
      </form>
    </div>
  `;
  
  modal.classList.remove('hidden');
  
  // Close modal handlers
  document.getElementById('close-modal').addEventListener('click', () => {
    modal.classList.add('hidden');
  });
  
  document.getElementById('cancel-form').addEventListener('click', () => {
    modal.classList.add('hidden');
  });
  
  // Form submission handler
  document.getElementById('tool-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const toolData = {
      name: document.getElementById('tool-name').value,
      url: document.getElementById('tool-url').value,
      description: document.getElementById('tool-description').value,
      category: document.getElementById('tool-categories').value
        .split(',')
        .map(cat => cat.trim())
        .filter(cat => cat),
      imageUrl: document.getElementById('tool-image').value || null,
      status: document.getElementById('tool-status').value,
      featured: document.getElementById('tool-featured').checked
    };
    
    const toolId = document.getElementById('tool-id').value;
    
    try {
      if (toolId) {
        // Update existing tool
        await db.collection('tools').doc(toolId).update(toolData);
      } else {
        // Add new tool
        await db.collection('tools').add({
          ...toolData,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
      
      modal.classList.add('hidden');
      initToolsManagement(); // Refresh tools list
    } catch (error) {
      console.error('Error saving tool:', error);
      alert('Could not save tool. Please try again.');
    }
  });
};

// Delete tool
const deleteTool = async (toolId) => {
  try {
    await db.collection('tools').doc(toolId).delete();
    initToolsManagement(); // Refresh tools list
  } catch (error) {
    console.error('Error deleting tool:', error);
    alert('Could not delete tool. Please try again.');
  }
};
