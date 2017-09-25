// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuefire from 'vuefire'
//import firebase from './service/firebase'
import firebase from "firebase";
import axios from 'axios'
import VueAxios from 'vue-axios'
import moment from "moment";


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
		currentOrder: {},
		currentOrderLines: null,
		departments: [],
		shopperList: [],
		user: {}
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
		//open today
		const dateString = moment().format("YYYY-MM-DD");
		this.openOrder(dateString);


		//get departments
		let self = this;
		this.firebase.database().ref('departments').on('value', function(snapshot) {
			let arr = [];
			Object.values(snapshot.val()).forEach(item => {
				arr.push(item.label);
			});
			self.departments = arr;
			//console.log("val:", self.departments);
		});

		//get users that have isShopper to true

		this.$bindAsArray("shopperList", this.firebase.database().ref('users').orderByChild("isShopper").equalTo(true), null, (e) => {
			console.log("shopperList loaded");
			this.shopperList.sort(function (a, b) {
				if (!a.debet) a.debet = {amount: 0};
				if (!b.debet) b.debet = {amount: 0};
				return a.debet.amount - b.debet.amount;
			});
		});


		// this.firebase.database().ref('users').orderByChild("isShopper").equalTo(true).on('value', function(snapshot) {
		// 	let arr = [];
		// 	Object.values(snapshot.val()).forEach(item => {
		// 		arr.push(item);
		// 	});
		// 	//sort by debet
		// 	arr = arr.sort(function (a, b) {
		// 		if (!a.debet) a.debet = {amount: 0};
		// 		if (!b.debet) b.debet = {amount: 0};
		// 		return a.debet.amount - b.debet.amount;
		// 	});
		// 	self.shopperList = arr;
		// 	//console.log("val:", self.shopperList);
		// });

		this.$on("OPEN_ORDER", dateString => {
			this.openOrder(dateString);
		});

	},

	methods: {
		openOrder(dateString) {
			console.log("open order", dateString);
			this.$bindAsObject("currentOrder", this.firebase.database().ref('orders/' + dateString), null, function(e) {
				if (this.currentOrder.hasOwnProperty("paidBy")) {
					//this.currentOrder = this.orders[0];
					this.$bindAsArray("currentOrderLines", this.firebase.database().ref('orderLines/' + dateString).orderByChild("state").equalTo("open"), null, function (e) {
						console.log("order loaded");
						this.$root.$emit("CURRENT_ORDER_OPENED");
					});
					this.firebase.database().ref('orderLines/' + dateString).update({
						paidBy: this.currentOrder.paidBy
					});
				} else {
					this.$root.$emit("SHOW_ORDER_PICKER");
				}

			});
		}

	}
});

