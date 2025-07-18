// === /js/firebase-config.js ===
const firebaseConfig = {
  apiKey: "AIzaSyAFIonE-mcnhxFPDSLFiiIs1-tURXqgGYE",
  authDomain: "modhusudhan-654e7.firebaseapp.com",
  projectId: "modhusudhan-654e7",
  storageBucket: "modhusudhan-654e7.appspot.com",
  messagingSenderId: "221731458319",
  appId: "1:221731458319:web:127f4d6f18abf1451e027a",
  measurementId: "G-S8WE56VM8X"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Set Firestore security rules as provided
// Note: ADMIN_UID should be set in Firebase security rules
