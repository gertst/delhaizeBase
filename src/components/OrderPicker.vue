<template>


	<md-whiteframe md-elevation="O" class="order-picker color-blue" v-show="isVisible">

		<vue-datepicker-es6></vue-datepicker-es6>
	</md-whiteframe>

</template>

<script>

	import {snapshotToArray} from "../utils/firebaseUtils";
	import VueDatepickerEs6 from "vue-datepicker-es6"

	export default {

		components: {
			VueDatepickerEs6
		},
		props: {},
		data() {

			return {
				isVisible: false
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
		background-color: ;
	}


</style>