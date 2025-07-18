// === /js/auth.js ===
// Login function
const login = async (email, password) => {
  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (error) {
    throw new Error('Invalid email or password');
  }
};

// Logout function
const logout = async () => {
  try {
    await auth.signOut();
    window.location.href = '/admin/login.html';
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// Check if user is authenticated
const checkAuth = () => {
  return new Promise((resolve) => {
    auth.onAuthStateChanged(user => {
      if (user) {
        resolve(user);
      } else {
        window.location.href = '/admin/login.html';
        resolve(null);
      }
    });
  });
};
