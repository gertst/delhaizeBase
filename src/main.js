// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuefire from 'vuefire'
import firebase from './service/firebase'
import VueMdl from 'vue-mdl'
import axios from 'axios'
import VueAxios from 'vue-axios'


Vue.use(Vuefire);
Vue.use(VueMdl);
Vue.use(VueAxios, axios)

Vue.config.productionTip = false;

new Vue({
	el: '#app',
	firebase: {
		//orders: firebase.database.ref('orders'),
		//orderLines: firebase.database.ref('orderLines'),
		users: firebase.database.ref('users')
	},
	router,
	template: '<App/>',
	components: {
		App
	},
	mounted() {
		Vue.nextTick(() => {
			//console.log("firebase:", firebase);
			firebase.api.auth().onAuthStateChanged((user) => {
				if (user) {
					this.$router.push('/');
				} else {
					this.$router.push('/login');
				}
			});
		});
	}
})

