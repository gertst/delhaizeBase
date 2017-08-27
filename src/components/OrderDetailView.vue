<template>
	<div>
		<div class="list-action mdl-list">

			<div @click="showEditPanel('edit', orderline)" v-for="orderline in $root.currentOrderLines" class="mdl-list__item">
	            <span class="mdl-list__item-primary-content">
		             <i class="material-icons mdl-list__item-avatar">person</i>
		             <span>{{orderline.department}}: {{orderline.qty}} x {{orderline.name}}</span>
	            </span>
				<a class="mdl-list__item-secondary-action" href="#"><i class="material-icons">star</i></a>
			</div>

		</div>

		<button @click="showEditPanel('add', emptyItem)"
		        class="add-order-line mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
			<i class="material-icons">add</i>
		</button>

		<div v-show="showAddOrderPanel" class="new-order-line-input mdl-card mdl-shadow--6dp">
			<div class="mdl-card__title mdl-color--primary mdl-color-text--white">
				<h2 class="mdl-card__title-text">New Item</h2>
			</div>
			<div class="mdl-card__supporting-text">
				<form action="#">
					<mdl-textfield floating-label="Department" v-model="currentItem.department"></mdl-textfield>
					<mdl-textfield floating-label="Item" v-model="currentItem.name"></mdl-textfield>
					<mdl-textfield floating-label="Quantity" v-model="currentItem.qty"></mdl-textfield>
				</form>
			</div>
			<div class="mdl-card__actions mdl-card--border">
				<button v-if="action=='edit'" @click="addOrEditOrderLine()" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">UPDATE</button>
				<button v-if="action=='add'" @click="addOrEditOrderLine()" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">ADD</button>
				<button @click="cancelAddOrderLine()" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">CANCEL</button>
			</div>
		</div>

	</div>



</template>

<script>

	export default {

		components: {

		},
		data() {
			return {
				showAddOrderPanel: false,
				emptyItem: {
					department: "",
					name: "",
					qty: 1
				},
				action: "edit",
				currentItem: {}
			}
		},
		mounted() {



		},
		methods: {
			addOrEditOrderLine() {
				this.showAddOrderPanel = false;
				if (this.action === 'add') {
					this.$root.firebase.database().ref("orderLines/" + this.$root.currentOrder[".key"]).push(
						{
							"department": this.currentItem.department,
							"id": "",
							"name": this.currentItem.name,
							"qty": this.currentItem.qty,
							"price": ""
						}
					).then();
				} else {
					console.log("edit");
					const key = this.currentItem['.key'];
					// remove the .key attribute
					delete this.currentItem['.key'];
					this.$root.firebase.database().ref('orderLines/' + this.$root.currentOrder[".key"] + "/" + key).update(this.currentItem);

				}

			},

			cancelAddOrderLine() {
				this.showAddOrderPanel = false;
			},

			showEditPanel(action, item) {
				this.action = action;
				this.showAddOrderPanel = true;
				this.currentItem = JSON.parse(JSON.stringify(item));
			}
		}
	}
</script>

<style>
	.list-action {
		margin: auto;
		width: 96%;
	}
	.add-order-line {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
	}

	.new-order-line-input {
		position: fixed;
		bottom: 0px;
		margin: 0px 2%;
		width: 96%;
	}

</style>