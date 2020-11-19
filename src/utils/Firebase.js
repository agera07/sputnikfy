import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBWHFfKT0WNqUUcziE4DEipHUfZ-FMrJZA",
  authDomain: "sputnikfy-d5f68.firebaseapp.com",
  databaseURL: "https://sputnikfy-d5f68.firebaseio.com",
  projectId: "sputnikfy-d5f68",
  storageBucket: "sputnikfy-d5f68.appspot.com",
  messagingSenderId: "601989120293",
  appId: "1:601989120293:web:3b5bab2d884eb3b5119acc",
};

export default firebase.initializeApp(firebaseConfig);
