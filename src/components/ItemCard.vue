<template>



	<md-whiteframe md-elevation="3" class="input-item-whiteframe" v-show="isVisible">
			<md-card class="md-accent">
				<!--<md-card-media>-->
					<!--<img src="assets/card-image-1.jpg" alt="People">-->
				<!--</md-card-media>-->

				<md-card-header>
					<div v-if="!isEdit" class="md-title">Add an item</div>
					<div v-if="isEdit" class="md-title">Edit item</div>
					<!--<div class="md-subhead">Subtitle here</div>-->
				</md-card-header>

				<md-card-content>
					<!--<auto-complete-->
							<!--v-model="department"-->
							<!--:list="$root.departments" -->
							<!--label=""-->
							<!--placeholder="">-->
					<!--</auto-complete>-->
					<!--<md-layout md-gutter>-->
						<!--<md-layout md-flex>-->
							<!--<v-select :value.sync="department" :options="$root.departments"></v-select>-->

							<!--<md-input-container>-->
								<!--<label>Department</label>-->
								<!--<md-select v-model="department"-->
								           <!--v-if="!showNewDepartment" md-theme="default">-->
									<!--<md-option :key="depItem" v-for="depItem in $root.departments" :value="depItem">{{depItem}}</md-option>-->
								<!--</md-select>-->
								<!--<md-input v-if="showNewDepartment" v-model="department"></md-input>-->
							<!--</md-input-container>-->
						<!--</md-layout>-->
						<!--<md-layout>-->
							<!--<md-button v-if="!showNewDepartment" @click="showNewDepartment = true;">Add New</md-button>-->
							<!--<md-button v-if="showNewDepartment" @click="showNewDepartment = false; department='';">Undo</md-button>-->
						<!--</md-layout>-->
					<!--</md-layout>-->

					<v-select :value="department"
					          :taggable="true"
					          :on-change="onChangeDepartment"
					          :options="$root.departments"
					></v-select>

					<md-input-container>
						<label>Qty</label>
						<md-input type="number" v-model="qty"></md-input>
					</md-input-container>
					<md-input-container>
						<label>Item</label>
						<md-input v-model="item"></md-input>
					</md-input-container>
					<v-select :value.sync="item" :options="departmentItems"></v-select>
				</md-card-content>
				<md-card-actions>
					<md-button v-if="isEdit" @click="deleteItem()" class="md-icon-button">
						<md-icon class="">delete</md-icon>
					</md-button>
					<span style="flex: 1"></span>
					<md-button @click="isVisible=false">Cancel</md-button>
					<md-button @click="update()"
					           :disabled="!(department && item && qty)">
						<span v-if="isEdit">Update</span>
						<span v-else>Add</span>
					</md-button>
				</md-card-actions>

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
		props:{

		},
		data() {

			return {
				isVisible: false,
				currentItem: {},
				department: null,
				qty: 1,
				item: "",
				isEdit: true,
				departmentItems: []
			}
		},
		mounted() {
			this.$root.$on("SHOW_ITEM_CARD", (payload) => {
				if (payload) {
					this.isEdit = true;
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
		},
		computed: {

		},
		methods: {
			onChangeDepartment(val) {
				//console.log("dept:", val);
				this.department = val;
				this.$root.firebase.database().ref("departmentItems/" + this.department).on("value", snapshot => {
					this.departmentItems = snapshotToArray(snapshot);
				});
			},

			update() {
				this.isVisible = false;
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
							"userPhoto": this.$root.user.photoURL,
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
					this.$root.firebase.database().ref("departments/" + this.department).update({label:this.department});
				}
			},

			deleteItem() {
				const key = this.currentItem['.key'];
				this.$root.firebase.database().ref("orderLines/" + this.$root.currentOrder[".key"] + "/" + key).remove();
				this.isVisible = false;
			},

			addNewDepartment() {
				this.showNewDepartment = false;
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
		z-index: 10000;
	}
	.md-theme-accent {
		background-color: #e91e63;
		color: rgba(255, 255, 255, .87);
	}

</style>