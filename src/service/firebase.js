import firebase from "firebase";

// Initialize Firebase
var config = {
	apiKey: "AIzaSyASNCM4kaDnEphyZmmoQnqsKpjheafLSA0",
	authDomain: "delhaizebase.firebaseapp.com",
	databaseURL: "https://delhaizebase.firebaseio.com",
	projectId: "delhaizebase",
	storageBucket: "delhaizebase.appspot.com",
	messagingSenderId: "602137457616"
};

firebase.initializeApp(config);




export default {
	api: firebase,
	database: firebase.database()
}

