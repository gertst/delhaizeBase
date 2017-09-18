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

					<span @click="$root.$emit('SHOW_ORDER_PICKER')">{{orderDayRelative}}</span>

					<md-button class="md-icon-button" @click.native="$root.$emit('SHOW_ORDER_PICKER')">
						<md-icon>date_range</md-icon>
					</md-button>

					<md-avatar class="md-small avatar" @click.native="$root.$emit('SHOW_ORDER_PICKER')">
						<img :src="getCurrentOrderUserPhotoURL" >
					</md-avatar>


				</div>
			</md-toolbar>

			<md-stepper @click.native="stepClick(this)">
				<md-step v-for="step in stepData"
						 :key="step.label"
						 :md-label="step.label"
						 :md-disabled="step.disabled"
						 :md-icon="step.icon">
				</md-step>
			</md-stepper>
		</md-whiteframe>

		<main class="main-content">


			<groceriesView v-if="$root.user.email"></groceriesView>
			<loginView v-if="!$root.user.email"></loginView>

		</main>

		<itemCard></itemCard>

		<order-picker></order-picker>

		<!--<md-boards class="onboarding-unregistered-user" :md-controls="false" v-show="isVisible">-->
			<!--<md-board id="slide1">-->
				<!--<h1>Welcome {{$root.user.displayName}}!</h1>-->
				<!--<p>You're almost ready to add groceries!</p>-->
				<!--<p>Ask your administrator to get access.</p>-->
				<!--<md-button class="md-raised md-accent" @click.native="">-->
					<!--Ask Access-->
				<!--</md-button>-->
			<!--</md-board>-->
		<!--</md-boards>-->

		<md-snackbar md-position="bottom center" ref="snackbar" :md-duration="4000">
			<span>Grocery deleted</span>
			<md-button class="md-accent" @click="$refs.snackbar.close()">Undo</md-button>
		</md-snackbar>

	</div>

</template>

<script>
	import Vue from "vue"
	import VueMaterial from 'vue-material'
	import SideBar from "./components/SideBar.vue"
	import LoginView from './components/LoginView.vue'
	import GroceriesView from './components/GroceriesView.vue'
	import ItemCard from "./components/ItemCard.vue";
	import OrderPicker from "./components/OrderPicker.vue";
	import moment from "moment";

	Vue.use(VueMaterial)

	export default {
		name: 'app',

		components: {
			SideBar,
			LoginView,
			GroceriesView,
			ItemCard,
			OrderPicker
		},

		data() {
			return {
				root: this.$root,
				initialStepData: [
					{label:"Basket", disabled: false, icon:"shopping_basket"},
					{label:"Shop", disabled: true, icon:"shopping_cart"},
					{label:"Settle", disabled: true, icon:"attach_money"}
				]
			}
		},


		computed: {
			getCurrentOrderUserPhotoURL() {
				return this.$root.currentOrder && this.$root.currentOrder.paidByPhotoURL ? this.$root.currentOrder.paidByPhotoURL.split("/photo.jpg").join("/s64-c/photo.jpg") : "static/img/user.png"
			},

			orderDayRelative() {
				if (this.$root.currentOrder) {
					const today = moment().format("YYYY-MM-DD");
					if (moment(this.$root.currentOrder[".key"]).format("YYYY-MM-DD") === today) {
						return "Today";
					} else {
						return moment(this.$root.currentOrder[".key"]).from(moment(today));
					}
				} else {
					return ""
				}
			},
			stepData() {
				let stepData = this.initialStepData;
				if (this.$root.currentOrderLines) {
					stepData[1].disabled = this.$root.currentOrderLines.length == 0
					stepData[2].disabled = this.$root.currentOrderLines.length == 0
				}
				return stepData
			}

		},

		methods: {

			logOut() {
				this.$root.firebase.auth().signOut();
				Vue.nextTick(() => {
					location.reload();
				});
			},

			stepClick() {
				console.log("step");
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
					const userPath = 'users/' + user.displayName;
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
						const isShopper = snapshot.val().isShopper;
						console.log("user profile", snapshot.val());
						if (!isShopper) {

						}
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

	.onboarding-unregistered-user {
		background-color: white;
		z-index: 20;
		width: 100%;
		height: 100%;
		position: fixed;
		padding: 0 0px;
	}

</style>
