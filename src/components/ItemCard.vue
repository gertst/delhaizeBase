<template>


	<md-whiteframe md-elevation="3" class="input-item-whiteframe" v-show="isVisible">

		<md-toolbar class="md-dense">
			<md-button class="md-icon-button" @click.native="isVisible = false">
				<md-icon>close</md-icon>
			</md-button>

			<h2 v-if="!isEdit" class="md-title" style="flex: 1">Add an item</h2>
			<h2 v-if="isEdit" class="md-title" style="flex: 1">Edit an item</h2>

			<!--<span style="flex: 1"></span>-->
			<md-button @click="update()"
			           :disabled="!(department && item && qty)">
				<span>Save</span>
			</md-button>
			<!--<md-button v-if="isEdit" @click="deleteItem()" class="md-icon-button">-->
				<!--<md-icon class="">more_vert</md-icon>-->
			<!--</md-button>-->
			<md-menu md-direction="bottom left" v-if="isEdit">
				<md-button md-menu-trigger style="min-width: 30px"><md-icon class="">more_vert</md-icon></md-button>
				<md-menu-content>
					<md-menu-item @click="deleteItem()">Delete Item</md-menu-item>
				</md-menu-content>
			</md-menu>

		</md-toolbar>

		<md-card class="md-accent item-card">

			<md-card-media class="item-image" :style="imageStyle(innerHeight)">
				<md-button class="md-icon-button add-image" @click.native="">
					<md-icon>add_a_photo</md-icon>
				</md-button>
				<img src="http://del.h-cdn.co/assets/17/03/980x490/landscape-1484949428-gettyimages-185201379.jpg"
				     alt="People">
			</md-card-media>


			<md-card-content>
				<v-select :value="department"
				          placeholder="Department"
				          :taggable="true"
				          :on-change="onChangeDepartment"
				          :options="$root.departments"
				></v-select>

				<md-input-container>
					<label>Qty</label>
					<md-input type="number" v-model="qty"></md-input>
				</md-input-container>

				<v-select :value="item"
				          placeholder="Item"
				          :options="departmentItems"
				          :taggable="true"
				          :on-change="onChangeItem">
				</v-select>
			</md-card-content>


		</md-card>
	</md-whiteframe>

</template>

<script>

	//import AutoComplete from "./AutoComplete.vue"
	import MdInput from "../../node_modules/vue-material/src/components/mdInputContainer/mdInput.vue";
	import vSelect from "vue-select"
	import {snapshotToArray} from "../utils/firebaseUtils";

	export default {

		components: {
			MdInput,
			vSelect
		},
		props: {},
		data() {

			return {
				isVisible: false,
				currentItem: {},
				department: null,
				qty: 1,
				item: "",
				isEdit: true,
				departmentItems: [],
				innerHeight
			}
		},
		mounted() {
			this.$root.$on("SHOW_ITEM_CARD", (payload) => {
				if (payload) {
					this.isEdit = true;
					this.onChangeDepartment(payload.department);
					this.department = payload.department;
					this.qty = payload.qty;
					this.item = payload.name;
					this.currentItem = payload;
				} else {
					//add new
					this.isEdit = false;
					this.department = "";
					this.qty = 1;
					this.item = "";
					this.currentItem = {};
				}
				this.isVisible = true;
				this.showNewDepartment = false;
			});
			window.addEventListener('resize', this.handleResize)

		},
		beforeDestroy() {
			window.removeEventListener('resize', this.handleResize)
		},
		computed: {

		},
		methods: {
			imageStyle(innerHeight) {
				return "max-height:" + (innerHeight - 530) + "px"
			},

			onChangeDepartment(val) {
				if (this.department !== val) {
					console.log("onChangeDepartment:", val);
					this.department = val;
					this.$root.firebase.database().ref("departmentItems/" + this.department).on("value", snapshot => {
						this.departmentItems = snapshotToArray(snapshot);
					});
				}
			},
			onChangeItem(val) {
				//picked from existing item? yes
				if (val && val.label) {
					this.item = val.label;
				} else {
					this.item = val;
				}
			},

			update() {
				this.isVisible = false;
				let oldDepartment = this.currentItem.department;
				if (this.isEdit) {
					const key = this.currentItem['.key'];
					// remove the .key attribute
					//delete this.currentItem['.key'];
					this.$root.firebase.database().ref('orderLines/' + this.$root.currentOrder[".key"] + "/" + key).update({
						"user": this.currentItem.user,
						"userPhoto": this.currentItem.userPhoto,
						"department": this.department,
						"name": this.item,
						"qty": this.qty,
						"price": ""
					});

				} else { //add
					this.$root.firebase.database().ref("orderLines/" + this.$root.currentOrder[".key"]).push(
						{
							"user": this.$root.user.displayName.split(" ").join("_"),
							//crop photo to 80 px
							"userPhoto": this.$root.user.photoURL.split("/photo.jpg").join("/s64-c/photo.jpg"),
							"department": this.department,
							"name": this.item,
							"qty": this.qty,
							"price": ""
						}
					);
				}
				//add department if it does not yet exist
				if (!Object.values(this.$root.departments).find(i => {
						return this.department === i
					})) {
					this.$root.firebase.database().ref("departments/" + this.department).update({label: this.department});
				}

				//add or remove item to department
				if (oldDepartment !== this.department) {
					//console.log("item", this.currentItem.name, this.item);
					console.log("departmentItems:", this.departmentItems);
					if (this.currentItem.name !== this.item && this.currentItem.name) {
						//check to remove old
					}
				}
				//already in list? no
				if (!this.departmentItems.find(item => {
						return item.label === this.item
					})) {
					//add new
					this.$root.firebase.database().ref("departmentItems/" + this.department + "/" + this.item).update({
						label: this.item
					});
				}
			},

			deleteItem() {
				const key = this.currentItem['.key'];
				this.$root.firebase.database().ref("orderLines/" + this.$root.currentOrder[".key"] + "/" + key).remove();
				this.isVisible = false;
			},

			addNewDepartment() {
				this.showNewDepartment = false;
			},

			handleResize() {
				this.innerHeight = window.innerHeight;
				//console.log("innerh:", this.innerHeight)
			}
		}
	}
</script>

<style>

	.add-item-btn {
		position: fixed !important;
	}

	.input-item-whiteframe {
		z-index: 10;
		width: 100%;
		height: 100%;
		position: fixed;
		padding: 0 0px;
	}

	.item-card {
		display: flex;
		height: 100%;
	}

	.md-theme-accent {
		background-color: #e91e63;
		color: rgba(255, 255, 255, .87);
	}

	.v-select .selected-tag {
		color: #fff;
		background-color: #2196f3;
		border: none;
		border-radius: 4px;
		height: 26px;
		margin: 4px 2px 0 3px;
		padding: 2px .5em;
		float: left;
		line-height: 24px;
		font-size: 1rem;
	}

	.dropdown-menu {
		/*color: #000000 !important;*/
	}

	::-webkit-input-placeholder { /* Chrome */
		color: white;
	}

	.add-image {
		position: absolute;
	}

	.add-image .md-icon {
		text-shadow: 2px 2px 3px #4b4b4b;
	}
	.item-image {
		/*max-height: 9px;*/
		overflow: hidden;
	}

</style>