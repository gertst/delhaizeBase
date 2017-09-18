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
				<label for="shopper">Shopper</label>
				<md-select name="shopper" id="shopper" v-model="shopper">
					<md-option v-for="user in $root.shopperList" :key="user.userName" :value="user.userName">{{user.userName}}</md-option>
				</md-select>
			</md-input-container>

		</div>

	</md-whiteframe>

</template>

<script>

	import {snapshotToArray} from "../utils/firebaseUtils";
	import DatePicker from "./DatePicker.vue";
	import moment from "moment";

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
				activities:{}
			}
		},
		mounted() {
			this.$root.$on("SHOW_ORDER_PICKER", (payload) => {
				if (payload) {

				}
				if (this.$root.currentOrder && this.$root.currentOrder[".key"]) {
					this.orderDate = this.$root.currentOrder[".key"];
					console.log("orderdate", this.orderDate);
				}
				if (this.$root.currentOrder && this.$root.currentOrder.paidBy) {
					this.shopper = this.$root.currentOrder.paidBy;
				}
				this.isVisible = true;
				console.log("SHOW_ORDER_PICKER");
				this.$bindAsArray("activities", this.$root.firebase.database().ref().child('orders')
					.orderByChild("yyyy-mm").equalTo(this.orderDate.substr(0, 7)), null, (e) => {
					console.log("new activities loaded", this.$root);
					this.$root.$emit("MONTH_ACTIVITIES_UPDATED", this.activities);
				});
			});

			this.$refs.datepicker.$on("DOUBLE_CLICK", () => {
				console.log("double click");
				this.open();
			});
			console.log("this.$refs.datepicker", this.$refs.datepicker);

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
							this.shopper = snapshot.val().paidBy
						} else {
							this.shopper = "";
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
				this.$root.firebase.database().ref('orders/' + this.orderDate.substr(0, 10)).update({
					"yyyy-mm": this.orderDate.substr(0, 7),
					"paidBy": this.shopper,
					"paidByPhotoURL": this.photoURL
				}).then(() => {
					this.$root.$emit("OPEN_ORDER", this.orderDate.substr(0, 10));
					this.isVisible = false;
				});
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
		margin: 8px auto;
		width: 308px;
	}

	.btn-holder {
		width: 100%;
	}
	.btn-open {
		right: 0;
	}


</style>