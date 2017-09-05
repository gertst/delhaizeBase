<template>
	<div class="app-viewport" id="file-list">
		<sideBar></sideBar>

		<md-whiteframe md-elevation="3" class="main-toolbar">
			<md-toolbar class="md-dense">
				<div class="md-toolbar-container">
					<md-button class="md-icon-button" @click="$root.$emit('sideBarToggle')">
						<md-icon>menu</md-icon>
					</md-button>

					<h2 class="md-title">DelhaizeBase</h2>

					<span style="flex: 1"></span>

					<span>Today</span>

					<md-button class="md-icon-button">
						<md-icon>date_range</md-icon>
					</md-button>

					<md-avatar class="md-small avatar" @click.native="onAvatarClicked()">
						<img :src="getCurrentOrderUserPhotoURL" >
					</md-avatar>


				</div>
			</md-toolbar>
			<md-stepper @click.native="stepClick(this)">
				<md-step md-label="Add" :md-editable="true"></md-step>
				<md-step md-label="Shop" :md-editable="true"></md-step>
				<md-step md-label="Settle" :md-editable="true"></md-step>
			</md-stepper>
		</md-whiteframe>

		<main class="main-content">


			<groceriesView v-if="$root.user.email"></groceriesView>
			<loginView v-if="!$root.user.email"></loginView>

		</main>

		<itemCard></itemCard>

	</div>

</template>

<script>
	import Vue from "vue"
	import VueMaterial from 'vue-material'
	import SideBar from "./components/SideBar.vue"
	import LoginView from './components/LoginView.vue'
	import GroceriesView from './components/GroceriesView.vue'
	import ItemCard from "./components/ItemCard.vue";

	Vue.use(VueMaterial)

	export default {
		name: 'app',

		components: {
			SideBar,
			LoginView,
			GroceriesView,
			ItemCard
		},

		data() {
			return {

			}
		},


		computed: {
			getCurrentOrderUserPhotoURL() {
				return this.$root.currentOrder ? this.$root.currentOrder.paidByPhotoURL.split("/photo.jpg").join("/s64-c/photo.jpg") : "static/img/user.png"
			}
		},

		methods: {

			logOut() {
				this.$root.firebase.auth().signOut();
				location.reload();
				//user = {};
			},

			stepClick(event, a) {
				console.log("step", event, a);
			},

			onAvatarClicked() {
				console.log("avatar");
			}

		},

		mounted() {
			Vue.material.registerTheme('default', {
				primary: 'blue',
				accent: 'pink',
				warn: 'red',
				background: 'white'
			})

			this.$root.firebase.auth().onAuthStateChanged((user) => {
				if (user) {
					const userPath = 'users/' + user.displayName.split(" ").join("_");
					//update or create user record
					this.$root.firebase.database().ref(userPath).update(
						{
							userName: user.displayName,
							email: user.email,
							photoURL: user.photoURL,
							lastSeen: new Date().toISOString()
						}
					);
					this.$root.user = user;

					//get user profile and store in local user
					this.$root.firebase.database().ref(userPath).once('value').then(snapshot => {
						this.$root.user.profile = snapshot.val().profile;
					});

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

	.avatar {
		width: 32px;
		min-width: 32px;
		height: 32px;
		min-height: 32px;
	}

</style>
