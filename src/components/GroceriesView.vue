<template>
	<md-table-card>
		<!--<md-toolbar>
			<h1 class="md-title">Groceries</h1>
			<md-button class="md-icon-button">
				<md-icon>filter_list</md-icon>
			</md-button>

			<md-button class="md-icon-button">
				<md-icon>search</md-icon>
			</md-button>
		</md-toolbar>-->

		<!--<md-table-alternate-header md-selected-label="selected">
			<md-button class="md-icon-button">
				<md-icon>delete</md-icon>
			</md-button>

			<md-button class="md-icon-button">
				<md-icon>more_vert</md-icon>
			</md-button>
		</md-table-alternate-header>-->

		<md-table md-sort="">
			<md-table-header>
				<md-table-row>
					<md-table-head md-sort-by="department">Department</md-table-head>
					<md-table-head md-sort-by="qty" md-numeric md-tooltip="Always set to 1 for weighted items">Qty</md-table-head>
					<md-table-head md-sort-by="item">Item</md-table-head>
				</md-table-row>
			</md-table-header>

			<md-table-body>
				<md-table-row v-for="(row, rowIndex) in $root.currentOrderLines"
				              :key="rowIndex"
				              :md-item="row" :md-selection="true">
					<md-table-cell :key="department" :md-numeric="false">
						<!--<md-button class="md-icon-button">
							<md-icon>edit</md-icon>
						</md-button>-->
						<span>{{ row.department }}</span>
					</md-table-cell>

					<md-table-cell :key="qty" :md-numeric="true">
						<span>{{ row.qty }}</span>
					</md-table-cell>

					<md-table-cell :key="item" :md-numeric="false">
						<span>{{ row.name }}</span>
					</md-table-cell>


				</md-table-row>
			</md-table-body>
		</md-table>
	</md-table-card>

</template>

<script>

	export default {

		components: {

		},
		data() {
			return {

			}
		},
		mounted() {

		},
		methods: {

		}
	}
</script>

<style>


</style>