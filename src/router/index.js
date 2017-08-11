import Vue from 'vue'
import Router from 'vue-router'
import OrderDetailView from '../components/OrderDetailView'
import OrderSelectView from '../components/OrderSelectView'
import LoginView from '../components/LoginView.vue'
import UserProfile from '../components/UserProfile.vue'

Vue.use(Router)
export default new Router({
	mode: 'hash',
	base: "/",
	routes:[
		{
			path: '/',
			name: 'home',
			component: OrderDetailView
		},
		{
			path: '/order',
			name: 'order',
			component: OrderSelectView
		},
		{
			path: '/login',
			name: 'login',
			component: LoginView
		},
		{
			path: '/profile',
			name: 'profile',
			component: UserProfile
		}
	]

})