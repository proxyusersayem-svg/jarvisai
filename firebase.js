/**
 * KAISAR TALKING AI - Firebase Core Config
 */
const firebaseConfig = {
    apiKey: "AIzaSyBchtm5yS1ZuW1b-5DWAIncTysOv09bYX0",
    authDomain: "stevenx-4ef00.firebaseapp.com",
    projectId: "stevenx-4ef00",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "882062097165",
    appId: "1:882062097165:android:3eb7501b29a3d54b06ce44"
};

// Initialize Firebase App
if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
} else {
    console.warn("Firebase SDK not detected. Include script tags in your HTML.");
}

const auth = typeof firebase !== 'undefined' ? firebase.auth() : null;
const db = typeof firebase !== 'undefined' ? firebase.firestore() : null;
