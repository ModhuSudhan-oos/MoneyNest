// === /js/subscribe.js ===
const subscribeForm = document.getElementById('subscribe-form');
const subscribeMessage = document.getElementById('subscribe-message');

// Handle newsletter subscription
subscribeForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  
  // Simple email validation
  if (!email || !email.includes('@')) {
    showMessage('Please enter a valid email address', 'error');
    return;
  }
  
  try {
    // Add to Firestore subscribers collection
    await db.collection('subscribers').add({
      email: email,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    showMessage('Thank you for subscribing!', 'success');
    subscribeForm.reset();
  } catch (error) {
    console.error('Subscription error:', error);
    showMessage('Something went wrong. Please try again.', 'error');
  }
});

// Show subscription message
const showMessage = (text, type) => {
  subscribeMessage.textContent = text;
  subscribeMessage.className = ''; // Reset classes
  subscribeMessage.classList.add(
    type === 'success' ? 'text-green-500' : 'text-red-500'
  );
  
  // Clear message after 5 seconds
  setTimeout(() => {
    subscribeMessage.textContent = '';
  }, 5000);
};
