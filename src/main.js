// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuefire from 'vuefire'
//import firebase from './service/firebase'
import firebase from "firebase";
import axios from 'axios'
import VueAxios from 'vue-axios'


Vue.use(Vuefire);
Vue.use(VueAxios, axios)

Vue.config.productionTip = false;

new Vue({
	el: '#app',
	name: 'root',
	template: '<App/>',
	components: {
		App
	},
	data: {
		firebase: null,
		orders: null,
		currentOrder: null,
		currentOrderLines: null,
		departments: [],
		user:{}
	},
	created() {
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
		this.firebase = firebase;
	},
	mounted() {

		this.$bindAsArray("orders", this.firebase.database().ref('orders').limitToLast(1), null, function(e) {
			this.currentOrder = this.orders[0];
			let orderKey = this.orders[0][".key"];
			this.$bindAsArray("currentOrderLines", this.firebase.database().ref('orderLines/' + orderKey), function(e) {
				console.log("orders loaded");
			});
		});
		let self = this;
		this.firebase.database().ref('departments').on('value', function(snapshot) {
			let arr = [];
			Object.values(snapshot.val()).forEach(item => {
				arr.push(item.label);
			});
			self.departments = arr;
			//console.log("val:", self.departments);
		});

	}
})

