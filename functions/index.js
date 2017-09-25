// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Listens for new messages added to /messages/:pushId/original and creates an
// // uppercase version of the message to /messages/:pushId/uppercase
// exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
// 	.onWrite(event => {
// 		// Grab the current value of what was written to the Realtime Database.
// 		const original = event.data.val();
// 		console.log('Uppercasing', event.params.pushId, original);
// 		const uppercase = original.toUpperCase();
// 		// You must return a Promise when performing asynchronous tasks inside a Functions such as
// 		// writing to the Firebase Realtime Database.
// 		// Setting an "uppercase" sibling in the Realtime Database returns a Promise.
// 		return event.data.ref.parent.child('uppercase').set(uppercase);
// 	});


// Listens for changes to /orders/*/settled and update the totals
// exports.updateSettlement = functions.database.ref('/orders/{orderDate}/settled')
// 	.onWrite(event => {
// 		// Grab the current value of what was written to the Realtime Database.
// 		const setToSettled = event.data.val();
// 		console.log('settled:', event.params.orderDate, setToSettled);
// 		let cost = 0;
// 		if (setToSettled) {
// 			admin.database().ref('/orderLines/' + event.params.orderDate).on('value', snapshot => {
// 				console.log("inside snapshot", snapshot);
// 				snapshot.forEach(orderLine => {
// 					cost += orderLine.price;
// 					console.log("cost:", cost, orderLine.price);
// 				});
//
// 			});
// 			//settlement = orderLines;
// 		} else {
//
// 		}
//
// 		//write it back to db
// 		return event.data.ref.parent.child('settlement').set(cost);
// 	});