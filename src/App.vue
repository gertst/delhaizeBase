<template>
	<div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
		<header class="mdl-layout__header">
			<div class="mdl-layout__header-row">
				<div class="mdl-layout-spacer"></div>
				<nav class="mdl-navigation ">
					<!--<router-link to="/order">Go to Foo</router-link>-->
					<a class="mdl-navigation__link" href="#order">
						<i class="material-icons">today</i>
						<span>Today</span>
					</a>
					<a class="mdl-navigation__link" href="#">
						<i class="material-icons">list</i>
						<span>Groceries</span>
					</a>
					<a class="mdl-navigation__link" href="#">
						<i class="material-icons">shopping_cart</i>
						<span>{{displayName}}</span>
						<i class="material-icons">more_vert</i>
					</a>



				</nav>
			</div>
		</header>

		<div class="mdl-layout__drawer">
			<span class="mdl-layout-title">DelhaizeBase</span>
			<nav class="mdl-navigation">
				<router-link class="mdl-navigation__link" to="/profile" @click.native="hideMenu()">User Profile</router-link>
				<router-link class="mdl-navigation__link" to="/" @click.native="logOut();hideMenu();">Log Out {{displayName}}</router-link>
			</nav>

		</div>

		<main class="mdl-layout__content">
			<div class="page-content">
				<router-view></router-view>
			</div>
		</main>
	</div>
</template>

<script>
	require('material-design-lite');

	import firebase from './service/firebase'


	export default {
		name: 'app',

		data() {
			return {
				user: {}
			}
		},


		computed: {
			displayName() {
				let v = "Unknown";
				if (this.user && this.user.displayName) {
					v = this.user.displayName.split(" ")[0];
				}
				return v
			}
		},

		methods: {
			hideMenu: function () {
				document.getElementsByClassName('mdl-layout__drawer')[0].classList.remove('is-visible')
				document.getElementsByClassName('mdl-layout__obfuscator')[0].classList.remove('is-visible')
			},

			logOut() {
				firebase.api.auth().signOut();
			}
		},

		created() {


			firebase.api.auth().onAuthStateChanged((user) => {
				if (user) {
//					console.log("user:", user);
					this.user = user;

				} else {
					this.$router.push('/login')
				}
			});

			this.$router.beforeEach((to, from_, next) => {
				if(to.path !== '/login') {
					if(!this.user || !this.user.email) {
						//logger('There is no token, redirect to login. (' + to.path + ')');
						next('login');
					} else {
						//logger('There is a token, resume. (' + to.path + ')');
						next();
					}
				} else {
					//logger('You\'re on the login page');
					next(); // This is where it should have been
				}
				// next(); - This is in the wrong place
			})
		}
	}
</script>

<style>
	@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
	@import url('https://code.getmdl.io/1.3.0/material.deep_orange-orange.min.css');
</style>
