<template>


	<md-whiteframe md-elevation="O" class="order-picker color-blue" v-show="isVisible">

		<md-toolbar class="md-dense">
			<md-button class="md-icon-button" @click.native="isVisible = false">
				<md-icon>close</md-icon>
			</md-button>

			<h2 class="md-title" style="flex: 1">Grocery List</h2>
			<!--<h2 v-if="isEdit" class="md-title" style="flex: 1">Edit an item</h2>-->

			<!--<span style="flex: 1"></span>-->
			<md-button @click="open()"
			           :disabled="false">
				<span>Open</span>
			</md-button>



		</md-toolbar>

		<div class="panel">
			<date-picker color="#F44336"
			             :format="formatDate"
			             :value="orderDate"
			             v-model="orderDate"
			             ref="datepicker"
			             :activities="activities">
			</date-picker>

			<md-input-container class="shopper-dropdown">
				<label for="shopper">
					Shopper - {{ this.settled ? 'settled' : 'not settled' }}
				</label>
				<md-select name="shopper" id="shopper" v-model="shopper" :disabled="settled">
					<md-option v-for="user in $root.shopperList" :key="user.userName" :value="user.userName">{{user.userName}} (€ {{debetAmount(user)}})</md-option>
				</md-select>
			</md-input-container>

		</div>

	</md-whiteframe>

</template>

<script>

	import {snapshotToArray} from "../utils/firebaseUtils";
	import DatePicker from "./DatePicker.vue";
	import moment from "moment";
	import numeral from "numeral";

	export default {

		components: {
			DatePicker
		},
		props: {},
		data() {

			return {
				privateOrderDate: "",
				isVisible: false,
				shopper: "",
				activities:{},
				settled: false,
				state: "order"
			}
		},
		mounted() {
			this.$root.$on("SHOW_ORDER_PICKER", (payload) => {
				if (payload) {

				}
				if (this.$root.currentOrder[".key"]) {
					this.orderDate = this.$root.currentOrder[".key"];
				}
				if (this.$root.currentOrder.paidBy) {
					this.shopper = this.$root.currentOrder.paidBy;
				}
				this.state = this.$root.currentOrder.state;
				if (!this.state) {
					this.state = "order";
				}
				this.isVisible = true;
				this.$bindAsArray("activities", this.$root.firebase.database().ref().child('orders')
					.orderByChild("yyyy-mm").equalTo(this.orderDate.substr(0, 7)), null, (e) => {
					//console.log("new activities loaded", this.$root);
					this.$root.$emit("MONTH_ACTIVITIES_UPDATED", this.activities);
				});
			});

			this.$refs.datepicker.$on("DOUBLE_CLICK", () => {
				this.open();
			});


		},
		computed: {
			orderDate: {
				get() {
					return this.privateOrderDate;
				},
				set(v) {
					this.privateOrderDate = v;
					this.$root.firebase.database().ref("orders/" + this.orderDate.substr(0, 10)).on('value', (snapshot) => {
						if (snapshot.val()) {
							//console.log("shopper", snapshot.val());
							this.shopper = snapshot.val().paidBy;
							this.settled = snapshot.val().settled;
							this.state = snapshot.val().state;
							this.paidBy = snapshot.val().paidBy;
						} else {
							this.shopper = "";
							this.settled = false;
							this.state = "order";
							this.paidBy = "";
						}
					});
				}
			},
			photoURL() {
				if (this.shopper) {
					return this.$root.shopperList.find(shopper => {
						return shopper.userName === this.shopper
					}).photoURL
				} else {
					return ""
				}
			},
			today() {
				return moment().format("YYYY-MM-DD");
			}

		},
		methods: {
			formatDate (date) {
				//console.log("formatDate", moment(date).format("YYYY-MM-DD"));
				return moment(date).format("YYYY-MM-DD");
			},

			open() {
				console.log("open", this.shopper, this.photoURL);

				let orderData = {
					"yyyy-mm": this.orderDate.substr(0, 7),
					paidBy: this.shopper,
					paidByPhotoURL: this.photoURL
				};

				this.$root.firebase.database().ref('orders/' + this.orderDate.substr(0, 10)).once('value').then(freshOrderData => {
					if (freshOrderData.state) {
						orderData.state = freshOrderData.state;
					} else {
						orderData.state = "order";
						orderData.settled = false;
					}

					console.log("orderData", orderData);
					this.$root.firebase.database().ref('orders/' + this.orderDate.substr(0, 10)).update(orderData).then(() => {
						this.$root.$emit("OPEN_ORDER", this.orderDate.substr(0, 10));
						this.isVisible = false;
					});
					this.$root.firebase.database().ref('orders/' + this.orderDate.substr(0, 10)).off();
				});


			},
			debetAmount(user) {
				if (user.debet) {
					return numeral(user.debet.amount).format();
				} else {
					return 0;
				}
			}
		}
	}
</script>

<style scoped>

	.order-picker {
		z-index: 11;
		width: 100%;
		height: 100%;
		position: fixed;
		padding: 0 0px;
		background-color: white;
	}

	.panel {
		margin: 8px 8px;
		/*width: 350px;*/
	}

	.btn-holder {
		width: 100%;
	}
	.btn-open {
		right: 0;
	}

	.shopper-dropdown {
		margin: 4px auto;
		width: 300px;
	}


</style>