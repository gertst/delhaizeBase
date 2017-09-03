<template>

	<div>

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
				<md-table-header >
					<md-table-row >
						<md-table-head width="40px">User</md-table-head>
						<md-table-head>Department</md-table-head>
						<md-table-head width="30px">Qty</md-table-head>
						<md-table-head>Item</md-table-head>
						<md-table-head width="50px">Edit</md-table-head>
					</md-table-row>
				</md-table-header>

				<md-table-body>
					<md-table-row v-for="(row, rowIndex) in $root.currentOrderLines"
					              :key="rowIndex"
					              :md-item="row" :md-selection="false">
						<md-table-cell :md-numeric="false">
							<md-avatar class="md-small">
								<img :src="row.userPhoto" alt="People">
							</md-avatar>
						</md-table-cell>
						<md-table-cell  :md-numeric="false">
							<span>{{ row.department }}</span>
						</md-table-cell>

						<md-table-cell  :md-numeric="true">
							<span>{{ row.qty }}</span>
						</md-table-cell>

						<md-table-cell :md-numeric="false">
							<span>{{ row.name }}</span>
						</md-table-cell>

						<md-table-cell :md-numeric="false">
							<md-button
									v-if="canEdit(row)"
									@click="editItem(row)" class="md-icon-button">
								<md-icon>edit</md-icon>
							</md-button>
						</md-table-cell>

					</md-table-row>
				</md-table-body>
			</md-table>

			<md-button @click="addItem()" class="add-item-btn md-fab md-fab-bottom-right">
				<md-icon>add</md-icon>
			</md-button>

			<itemCard></itemCard>

		</md-table-card>

	</div>

</template>

<script>

	import ItemCard from "./ItemCard.vue";

	export default {

		components: {
			ItemCard
		},
		data() {
			return {

			}
		},
		computed: {

		},
		methods: {
			addItem() {
				this.$root.$emit("SHOW_ITEM_CARD");
			},
			editItem(row) {
				this.$root.$emit("SHOW_ITEM_CARD", row);
			},
			canEdit(row) {
				return row.userPhoto === this.$root.user.photoURL || this.$root.user.profile === "admin";
			}
		}
	}
</script>

<style>
	.add-item-btn {
		position: fixed !important;
	}
	.input-item-whiteframe {
		width: 100%;
		padding: 0 14px;
		bottom: 0;
		position: fixed;

	}
	.md-theme-accent {
		background-color: #e91e63;
		color: rgba(255, 255, 255, .87);
	}
	.md-table-cell-container {
		padding: 6px 4px 6px 4px !important;
	}
	.md-table-head-text {
		padding-right: 4px !important;
		padding-left: 4px !important;
	}

</style>