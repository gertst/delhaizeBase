<template>

	<div>

		<md-table-card>

			<md-table md-sort="">
				<md-table-header>
					<md-table-row>
						<md-table-head v-show="$root.currentOrder.state == 'shop' || $root.currentOrder.state == 'settle'" width="20px">&nbsp;</md-table-head>
						<md-table-head width="30px">User</md-table-head>
						<md-table-head v-show="$root.currentOrder.state == 'order' || $root.currentOrder.state == 'shop'">
							Department
						</md-table-head>
						<md-table-head width="30px">Qty</md-table-head>
						<md-table-head v-show="$root.currentOrder.state == 'settle'" width="60px">Price</md-table-head>
						<md-table-head>Item</md-table-head>
						<md-table-head v-show="$root.currentOrder.state == 'order' || $root.currentOrder.state == 'settle'"
						               width="30px">Edit
						</md-table-head>
					</md-table-row>
				</md-table-header>

				<md-table-body>
					<md-table-row v-for="(row, rowIndex) in $root.currentOrderLines"
					              :key="rowIndex"
					              :md-item="row">

						<md-table-cell v-show="$root.currentOrder.state == 'shop' || $root.currentOrder.state == 'settle'">
							<md-checkbox v-model="row.checked" @change="setChecked(row)" :disabled="$root.user.displayName !== $root.currentOrder.paidBy"></md-checkbox>
						</md-table-cell>

						<md-table-cell>
							<md-avatar class="md-small avatar">
								<img :src="row.userPhoto" alt="">
							</md-avatar>
						</md-table-cell>
						<md-table-cell v-show="$root.currentOrder.state == 'order' || $root.currentOrder.state == 'shop'">
							<span>{{ row.department }}</span>
						</md-table-cell>

						<md-table-cell :md-numeric="true">
							<span>{{ row.qty }}</span>
							<span class="multiply">x</span>
						</md-table-cell>

						<md-table-cell v-if="$root.currentOrder.state == 'settle'">
							<md-input-container>
								<!--<label>With label</label>-->
								<md-input v-model="row.price" @change="setPrice(row)" type="number" :disabled="$root.user.displayName !== $root.currentOrder.paidBy"></md-input>
							</md-input-container>
						</md-table-cell>

						<md-table-cell v-show="$root.currentOrder.state == 'order' || $root.currentOrder.state == 'shop'">
							<span>{{ row.name }}</span>
						</md-table-cell>

						<md-table-cell v-show="$root.currentOrder.state == 'settle'">
							<div class="department">{{ row.department }}</div>
							<div class="name">{{ row.name }}</div>
						</md-table-cell>

						<md-table-cell v-if="$root.currentOrder.state == 'order' || $root.currentOrder.state == 'settle'">
							<md-button
									v-show="canEdit(row)"
									@click="editItem(row)" class="md-icon-button">
								<md-icon>edit</md-icon>
							</md-button>
						</md-table-cell>

					</md-table-row>
				</md-table-body>
			</md-table>

			<md-button @click="addItem()" v-if="$root.currentOrder.state == 'order'" class="add-item-btn md-fab md-fab-bottom-right">
				<md-icon>add</md-icon>
			</md-button>



		</md-table-card>

	</div>

</template>

<script>

	import Vue from "vue";
	import _ from "lodash";


	export default {

		components: {

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
				if (this.$root.currentOrder.state === "settle") {
					return this.$root.currentOrder.paidBy === this.$root.user.displayName;
				} else {
					return row.user === this.$root.user.displayName || this.$root.user.profile === "admin";
				}
			},
			setChecked(row) {
				Vue.nextTick(() => {
					//console.log("setChecked", row.checked);
					const key = row['.key'];
					this.$root.firebase.database().ref('orderLines/' + this.$root.currentOrder[".key"] + "/" + key).update({
						"checked": row.checked
					});
				});
			},
			setPrice(row) {
				Vue.nextTick( () => {
					//console.log(row, this);
					const key = row['.key'];
					this.$root.firebase.database().ref('orderLines/' + this.$root.currentOrder[".key"] + "/" + key).update({
						"price": parseFloat(row.price)
					});
				});
			}
		}
	}
</script>

<style>
	.add-item-btn {
		position: fixed !important;
	}

	.md-theme-accent {
		background-color: #353333;
		color: rgba(255, 255, 255, .87);
	}
	/*.md-table-cell-container {*/
		/*padding: 6px 4px 6px 4px !important;*/
	/*}*/


	.md-table-head-text {
		padding-right: 4px !important;
		padding-left: 4px !important;
	}
	.md-table .md-table-cell .md-table-cell-container {
		padding: 6px 8px 6px 8px;
	}

	.md-table-cell .department {
		font-size: 77%;
		color: #2196f3;
	}

	.md-table .md-table-cell .md-table-cell-container {
		padding: 6px 2px 6px 2px;
	}

	.multiply {
		margin-left: 2px;
	}
</style>