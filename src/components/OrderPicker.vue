<template>


	<md-whiteframe md-elevation="O" class="order-picker color-blue" v-show="isVisible">
		test
		test 2
	</md-whiteframe>

</template>

<script>

	import {snapshotToArray} from "../utils/firebaseUtils";

	export default {

		components: {
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