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
				<md-table-header>
					<md-table-row>
						<md-table-head width="50px" md-sort-by="user">User</md-table-head>
						<md-table-head md-sort-by="department">Department</md-table-head>
						<md-table-head width="50px" md-sort-by="qty" md-numeric md-tooltip="Always set to 1 for weighted items">Qty</md-table-head>
						<md-table-head md-sort-by="item">Item</md-table-head>
					</md-table-row>
				</md-table-header>

				<md-table-body>
					<md-table-row v-for="(row, rowIndex) in $root.currentOrderLines"
					              :key="rowIndex"
					              :md-item="row" :md-selection="true">
						<md-table-cell :md-numeric="false">
							<md-avatar class="md-small">
								<img src="https://lh5.googleusercontent.com/-xUgN6pRDvTY/AAAAAAAAAAI/AAAAAAABGVM/O4uoSmzYS0E/photo.jpg" alt="People">
							</md-avatar>
						</md-table-cell>
						<md-table-cell  :md-numeric="false">
							<!--<md-button class="md-icon-button">
								<md-icon>edit</md-icon>
							</md-button>-->
							<span>{{ row.department }}</span>
						</md-table-cell>

						<md-table-cell  :md-numeric="true">
							<span>{{ row.qty }}</span>
						</md-table-cell>

						<md-table-cell :md-numeric="false">
							<span>{{ row.name }}</span>
						</md-table-cell>


					</md-table-row>
				</md-table-body>
			</md-table>

			<md-button @click="addItem()" class="add-item-btn md-fab md-fab-bottom-right">
				<md-icon>add</md-icon>
			</md-button>


		</md-table-card>

		<md-whiteframe md-elevation="3" class="input-item-whiteframe" v-if="showInputItem">
			<md-card md-theme="accent">
				<!--<md-card-media>-->
					<!--<img src="assets/card-image-1.jpg" alt="People">-->
				<!--</md-card-media>-->

				<md-card-header>
					<div class="md-title">Add an item</div>
					<!--<div class="md-subhead">Subtitle here</div>-->
				</md-card-header>

				<md-card-content>
					<md-input-container>
						<label>Category</label>
						<md-input></md-input>
					</md-input-container>
					<md-input-container>
						<label>Qty</label>
						<md-input type="number"></md-input>
					</md-input-container>
					<md-input-container>
						<label>Item</label>
						<md-input></md-input>
					</md-input-container>
				</md-card-content>

				<md-card-actions>
					<md-button>Add</md-button>
					<md-button>Cancel</md-button>
				</md-card-actions>

			</md-card>
		</md-whiteframe>
	</div>

</template>

<script>


	export default {

		components: {

		},
		data() {
			return {
				showInputItem: false
			}
		},
		mounted() {

		},
		methods: {
			addItem() {
				this.showInputItem = true;
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

</style>