<template lang="html">
	<div>
		<div class="order-card mdl-card mdl-shadow--6dp">
			<div class="mdl-card__title mdl-color--primary mdl-color-text--white">
				<h2 class="mdl-card__title-text">Order</h2>
			</div>
			<div class="mdl-card__supporting-text">
				<form action="#">
					<date-picker :date="orderDate" :option="datePickerOptions"></date-picker>

				</form>
			</div>
			<div class="mdl-card__actions mdl-card--border">
				<button @click="addOrder()" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">ADD</button>
			</div>
		</div>

	 </div>
</template>

<script>
	import moment from "moment";
	import myDatepicker from 'vue-datepicker/vue-datepicker-es6.vue'

	export default {
		name: 'OrderView',
		components: {
			'date-picker': myDatepicker
		},
		data() {
			return {
				orderDate: {
					time: new Date()
				},
				datePickerOptions: {
					type: 'day',
					week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
					month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
					placeholder: 'Set Order Date',
					inputStyle: {
						'display': 'inline-block',
						'padding': '6px',
						'line-height': '22px',
						'font-size': '14px',
						'border': '2px solid #fff',
						'box-shadow': '0 1px 3px 0 rgba(0, 0, 0, 0.2)',
						'border-radius': '2px',
						'color': '#5F5F5F'
					},
					color: {
						header: 'rgb(53, 97, 153)',
						headerText: 'rgb(255, 87, 34)'
					},
					buttons: {
						ok: 'Ok',
						cancel: 'Cancel'
					},
					overlayOpacity: 0.5, // 0.5 as default
					dismissible: true // as true as default
				}/*,

				limit: [

					{
						type: 'fromto',
						from: '2017-08-22',
						to: '2018-02-20'
					}
				]*/


			}
		},

		mounted() {
		},

		methods: {
			addOrder() {
				let ordersRef = this.$root.firebase.database().ref("orders").push();
				let key = ordersRef.key;
				ordersRef.set({
					createdAt: this.orderDate.time,
					paidBy: "Gert (WIP)"
				});
			}
		}


	}
</script>

<style>
	.order-card {
		margin: 2% 2%;
		width: 96%;
	}
</style>