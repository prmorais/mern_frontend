import firebase from 'firebase';

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyDzA3ZcDfnS-UPqdi4k4subAtZA9NQA-XU",
	authDomain: "gqlreactnode13.firebaseapp.com",
	// databaseURL: "https://gqlreactnode13.firebaseio.com",
	projectId: "gqlreactnode13",
	storageBucket: "gqlreactnode13.appspot.com",
	// messagingSenderId: "188148665103",
	appId: "1:188148665103:web:865768b6d9bb95ec6b8c7a"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// export default firebaseConfig;

export const auth = firebase.auth()

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider()