<template>


	<md-whiteframe md-elevation="O" class="order-picker color-blue" v-show="isVisible">
		<calendar
				:value="orderDate"
				:disabled-days-of-week="disabled"
				format="d/MM/YYYY"
				:clear-button="false"
				placeholder="Date"
				:pane="1"
				:has-input="false"
				i18n="en"
		></calendar>
	</md-whiteframe>

</template>

<script>

	import {snapshotToArray} from "../utils/firebaseUtils";
	import Calendar from "./vue2-calendar/src/calendar.vue";

	export default {

		components: {
			Calendar
		},
		props: {},
		data() {

			return {
				isVisible: false,
				orderDate: {
					time: new Date()
				}
			}
		},
		mounted() {
			this.$root.$on("SHOW_ORDER_PICKER", (payload) => {
				if (payload) {

				}
				this.isVisible = true;
			});

		},
		computed: {

		},
		methods: {

		}
	}
</script>

<style>

	.order-picker {
		//background-color: ;
	}


</style>