<template>
	<div class="app-viewport" id="file-list">
		<sideBar></sideBar>

		<md-whiteframe md-elevation="3" class="main-toolbar">
			<md-toolbar>
				<div class="md-toolbar-container">
					<md-button class="md-icon-button" @click="$root.$emit('sideBarToggle')">
						<md-icon>menu</md-icon>
					</md-button>

					<h2 class="md-title">DelhaizeBase</h2>

					<span style="flex: 1"></span>

					<md-button class="md-icon-button">
						<md-icon>search</md-icon>
					</md-button>

					<md-button class="md-icon-button">
						<md-icon>view_module</md-icon>
					</md-button>
				</div>
			</md-toolbar>
			<md-stepper>
				<md-step md-label="Add" :md-editable="true" @click="stepClick(event)"></md-step>
				<md-step md-label="Shop" :md-editable="true"></md-step>
				<md-step md-label="Settle" :md-editable="true"></md-step>
			</md-stepper>
		</md-whiteframe>

		<main class="main-content">


			<groceriesView v-if="$root.user.email"></groceriesView>
			<loginView v-if="!$root.user.email"></loginView>

		</main>
	</div>

</template>

<script>
	import Vue from "vue"
	import VueMaterial from 'vue-material'
	import SideBar from "./components/SideBar.vue"
	import LoginView from './components/LoginView.vue'
	import GroceriesView from './components/GroceriesView.vue'

	Vue.use(VueMaterial)

	export default {
		name: 'app',

		components: {
			SideBar,
			LoginView,
			GroceriesView
		},

		data() {
			return {

			}
		},


		computed: {

		},

		methods: {

			logOut() {
				this.$root.firebase.auth().signOut();
				//user = {};
			},

			stepClick(event) {
				console.log("step", event);
			}

		},

		mounted() {


			this.$root.firebase.auth().onAuthStateChanged((user) => {
				if (user) {
					this.$root.user = user;
					this.$root.firebase.database().ref('users/' + user.displayName.split(" ").join("_")).set(
						{
							userName: user.displayName,
							email: user.email,
							photoURL: user.photoURL,
							lastSeen: new Date().toISOString()
						});
					//console.log("user", user);
				} else {

				}
			});

		}
	}
</script>

<style>
	html,
	body,
	.app-viewport {
		height: 100%;
		overflow: hidden;
	}

	.app-viewport {
		display: flex;
		flex-flow: column;
	}

	.main-toolbar {
		position: relative;
		z-index: 10;
	}

	.md-title {
		padding-left: 8px;
		color: #fff;
	}

	.main-content {
		position: relative;
		z-index: 1;
		overflow: auto;
	}

	.md-list-action {
		color: rgba(0, 0, 0, 0.26);
	}

	.md-avatar-icon {
		color: #fff !important;
	}

	.md-sidenav .md-list-text-container > :nth-child(2) {
		color: rgba(255, 255, 255, 0.54);
	}

	.md-account-header .md-list-item:hover {
		background-color: inherit;
	}
	.md-account-header .md-avatar-list .md-list-item-container:hover {
		background: none !important;
	}
	/*hide stepper steps*/
	div.md-stepper.md-theme-default > div {
		display: none;
	}

</style>
