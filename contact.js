// === /js/contact.js ===
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

// Handle contact form submission
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;
  
  // Simple validation
  if (!name || !email || !subject || !message) {
    showFormMessage('Please fill in all fields', 'error');
    return;
  }
  
  if (!email.includes('@')) {
    showFormMessage('Please enter a valid email address', 'error');
    return;
  }
  
  try {
    // Save message to Firestore
    await db.collection('messages').add({
      name: name,
      email: email,
      subject: subject,
      message: message,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    // Show success message
    showFormMessage('Your message has been sent! We\'ll get back to you soon.', 'success');
    
    // Reset form
    contactForm.reset();
  } catch (error) {
    console.error('Error saving message:', error);
    showFormMessage('Something went wrong. Please try again.', 'error');
  }
});

// Show form message
function showFormMessage(text, type) {
  formMessage.textContent = text;
  formMessage.className = ''; // Reset classes
  formMessage.classList.add(
    type === 'success' ? 'text-green-500' : 'text-red-500',
    'text-center',
    'py-2'
  );
  
  // Clear message after 5 seconds
  setTimeout(() => {
    formMessage.textContent = '';
  }, 5000);
}
