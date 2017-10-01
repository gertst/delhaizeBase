<template>
	<div class="app-viewport" id="file-list">

		<sideBar v-if="$root.allowUserAccess"></sideBar>

		<md-whiteframe md-elevation="3" class="main-toolbar" v-if="$root.allowUserAccess">
			<md-toolbar class="md-dense">
				<div class="md-toolbar-container">
					<md-button class="md-icon-button" @click="$root.$emit('sideBarToggle')">
						<md-icon>menu</md-icon>
					</md-button>

					<!--<h2 class="md-title">DelhaizeBase</h2>-->
					<span style="flex: 1"></span>

					<span>{{getTitle}}, {{orderDayRelative}}</span>

					<md-button class="md-icon-button" @click.native="$root.$emit('SHOW_ORDER_PICKER')">
						<md-icon>date_range</md-icon>
					</md-button>

					<!--<md-avatar class="md-small avatar" @click.native="$root.$emit('SHOW_ORDER_PICKER')">-->
						<!--<img :src="getCurrentOrderUserPhotoURL" >-->
					<!--</md-avatar>-->


				</div>
			</md-toolbar>

			<md-stepper @click.native="stepClick(this)" v-cloak ref="stepper" v-show="$root.user && $root.user.displayName === $root.currentOrder.paidBy">
				<md-step v-for="step in stepData"
				         v-show="$root.user && $root.user.displayName === $root.currentOrder.paidBy"
						 :key="step.label"
						 :md-label="step.label"
						 :md-disabled="step.disabled"
				         :md-active="step.active"
						 :md-icon="step.icon">
				</md-step>
			</md-stepper>
		</md-whiteframe>

		<main class="main-content" v-if="$root.allowUserAccess">


			<groceriesView v-if="$root.user.email"></groceriesView>
			<loginView v-if="!$root.user.email"></loginView>

		</main>

		<itemCard v-if="$root.allowUserAccess"></itemCard>

		<order-picker v-if="$root.allowUserAccess"></order-picker>
		<transition appear name="fade" mode="out-in">
			<md-boards v-cloak class="onboarding-unregistered-user " :md-controls="false" v-if="!$root.allowUserAccess">
				<md-board id="slide1" class="md-accent">
					<h1>Welcome</h1>
					<h1>{{$root.user.displayName}}</h1>
					<md-icon class="md-size-4x">local_grocery_store</md-icon>
					<h3>You're almost ready to add groceries.</h3>
					<transition appear name="fade">
					<ol v-show="showOnboardingDelayed">
						<li>Ask your administrator to get access</li>
						<li>Refresh this app</li>
					</ol>
					</transition>
					<!--<md-button class="md-raised md-accent" @click.native="">-->
						<!--Ask Access-->
					<!--</md-button>-->
				</md-board>
			</md-boards>
		</transition>

		<md-toolbar class="md-dense bottom-bar"
		            v-show="$root.currentOrder.state == 'settle'">

			<span>Total: €{{ getCurrentOrderTotal }}</span>
			<span style="flex: 1"></span>
			<span>{{$root.currentOrder.settled ? 'Payment Settled' : 'Unfinished payment.'}}</span>

			<md-button class="md-icon-button" v-show="$root.user.displayName === $root.currentOrder.paidBy">
				<md-icon @click.native="switchSettle()">{{ $root.currentOrder.settled ? 'lock_closed' : 'lock_open' }}</md-icon>
			</md-button>
			<md-icon v-show="$root.user.displayName !== $root.currentOrder.paidBy">
				{{ $root.currentOrder.settled ? 'lock_closed' : 'lock_open' }}
			</md-icon>

		</md-toolbar>

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
	import numeral from "numeral";

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
					{label:"Order", id: "order", disabled: false, icon:"shopping_basket", active: false},
					{label:"Shop", id: "shop", disabled: true, icon:"shopping_cart", active: false},
					{label:"Settle", id: "settle", disabled: true, icon:"attach_money", active: false}
				],
				showOnboardingDelayed: false
			}
		},


		computed: {
			getCurrentOrderUserPhotoURL() {
				return this.$root.currentOrder.paidByPhotoURL ? this.$root.currentOrder.paidByPhotoURL.split("/photo.jpg").join("/s64-c/photo.jpg") : "static/img/user.png"
			},

			orderDayRelative() {
				if (this.$root.currentOrder[".key"]) {
					const today = moment().format("YYYY-MM-DD");
					if (moment(this.$root.currentOrder[".key"]).format("YYYY-MM-DD") === today) {
						return "today";
					} else {
						return moment(this.$root.currentOrder[".key"]).from(moment(today));
					}
				} else {
					return ""
				}
			},

			getTitle() {
				console.log("getTitle", this.$root.currentOrder);
				if (this.$root.currentOrder.paidBy) {
					return this.$root.currentOrder.paidBy;
				} else {
					return "No shopper yet";
				}
			},

			stepData() {
				let stepData = this.initialStepData;
				stepData[0].active = this.isActiveStep("order");
				stepData[1].active = this.isActiveStep("shop");
				stepData[2].active = this.isActiveStep("settle");
				if (this.$root.currentOrderLines) {
					stepData[1].disabled = this.$root.currentOrderLines.length === 0
					stepData[2].disabled = this.$root.currentOrderLines.length === 0
				}
				stepData[0].disabled = this.$root.currentOrder.settled;
				stepData[1].disabled = this.$root.currentOrder.settled;
				stepData[2].disabled = this.$root.currentOrder.settled;
				return stepData
			},

			getCurrentOrderTotal() {
				let total = 0;
				if (this.$root.currentOrderLines) {
					console.log("getCurrentOrderTotal", this.$root.currentOrderLines);
					this.$root.currentOrderLines.forEach(orderLine => {
						if (orderLine.checked) {
							total += orderLine.qty * orderLine.price;
						}
					});
				}
				return numeral(total).format();
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
				if (this.$refs.stepper && this.$refs.stepper.activeStepNumber !== undefined && !this.stepData[this.$refs.stepper.activeStepNumber].disabled) {
					const stepId = this.stepData[this.$refs.stepper.activeStepNumber].id
//					console.log("step", stepId);
					this.$root.firebase.database().ref("orders/" + this.$root.currentOrder[".key"]).update(
						{
							state: stepId
						}
					);
				}
			},

			isActiveStep(stepName) {
				//console.log("**********getActiveStepNumber", stepName);
				return this.$root.currentOrder.state ? this.$root.currentOrder.state === stepName : false;
			},

			switchSettle() {
				console.log("switchSettle");
				this.$root.firebase.database().ref("orders/" + this.$root.currentOrder[".key"]).update(
					{
						settled: !this.$root.currentOrder.settled
					}
				).then(() => {
					this.updatesettlement();
				});
			},

			updatesettlement() {
				console.log("updatesettlement");
				let cost = 0;
				let settlement = this.$root.currentOrder.settlement;
				if (!settlement) {
					settlement = {};
				}
				if (!settlement[this.$root.currentOrder.paidBy]) {
					settlement[this.$root.currentOrder.paidBy] = 0;
				}
				if (this.$root.currentOrder.settled) {
					this.$root.firebase.database().ref('orderLines/' + this.$root.currentOrder[".key"]).on('value', (snapshot) => {
						Object.values(snapshot.val()).forEach((orderLine) => {
							if (orderLine.price && orderLine.checked) {
								cost += (orderLine.price * orderLine.qty);
								console.log("orderLine:", orderLine, cost);
								if (!settlement[orderLine.user]) {
									settlement[orderLine.user] = 0;
								}
								if (orderLine.user !== this.$root.currentOrder.paidBy) {
									settlement[orderLine.user] -= (orderLine.price * orderLine.qty);
									settlement[this.$root.currentOrder.paidBy] += (orderLine.price * orderLine.qty);
								}

							}
						});
						let updates = {};

						//update order
						updates['orders/' + this.$root.currentOrder[".key"] + "/settlement"] = settlement;

						//update debet of users
						Object.keys(settlement).forEach(user => {
							updates['users/' + user + "/debet"] = {amount: this.getUserDebet(user) + settlement[user]};
						});

						this.$root.firebase.database().ref().update(updates).then(() => {
							this.$root.firebase.database().ref('orderLines/' + this.$root.currentOrder[".key"]).off('value');
						});
					});
					//settlement = orderLines;
				} else {

					let updates = {};

					//update order: remove settlement
					updates['orders/' + this.$root.currentOrder[".key"] + "/settlement"] = {};

					//update debet of users
					Object.keys(settlement).forEach(user => {
						updates['users/' + user + "/debet"] = {amount: this.getUserDebet(user) - settlement[user]};
					});
					console.log("updates", settlement, updates);

					this.$root.firebase.database().ref().update(updates);
				}

				//console.log("cost", cost);
			},

			getUserDebet(user) {
				let debet = this.$root.shopperList.find(shopper => {
					return shopper.userName === user
				}).debet;
				if (!debet) debet = {amount:0};
				return debet.amount;
			}

	},

		mounted() {
			Vue.material.registerTheme('default', {
				primary: 'indigo',
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
							setTimeout(() => {
								this.showOnboardingDelayed = true;
							}, 3000);

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
		background-color: #e91f63;
		z-index: 20;
		width: 100%;
		height: 100%;
		position: fixed;
		padding: 0 0px;
		text-align: center;
	}

	.onboarding-unregistered-user .md-icon {
		color: white;
		opacity: 0.8;
	}

	.bottom-bar {
		position: fixed;
		bottom: 0;
		width: 100%;
		z-index: 10;
	}

</style>
