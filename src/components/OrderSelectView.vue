<template>
	<div class="card-image">
		<span>post order</span>
		<button @click.prevent="postOrder()">new order</button>
	</div>
</template>
<script>
	export default {
		methods: {
			postOrder () {
				this.$root.$firebaseRefs["orderLines"].push(
					{
						"department": "Bakkerij",
						"itemId":"jkl",
						"itemName": "klein bruin brood",
						"qty": 1,
						"price": 4.3,
						"orderedById": "jkl",
						"state": ""
					})
					.then(this.$router.push('/'))
			}
		},

		mounted() {

		}
	}
</script>
<style scoped>
</style>