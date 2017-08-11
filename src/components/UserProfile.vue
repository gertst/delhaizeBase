<template>
	<div>
		<div class="user-card mdl-card mdl-shadow--2dp">

			<div class="mdl-card__photo"
				 :style="'background: url(' + photoURL + ') center / cover;'"></div>

			<div class="mdl-card__supporting-text">
				<mdl-textfield floating-label="Display name" v-model="this.$parent.user.displayName" disabled></mdl-textfield>
				<mdl-textfield floating-label="Email" v-model="this.$parent.user.email" disabled></mdl-textfield>
			</div>

			<div class="mdl-card__actions mdl-card--border">
				<a @click.prevent="$parent.logOut()" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
					Log out
				</a>
			</div>

		</div>
	</div>
</template>
<script>

	import Vue from 'vue'
	//import firebase from '../service/firebase'

	export default {

		computed: {

			photoURL: {
				get() {
					let v = "";
					if (this.$parent && this.$parent.user && this.$parent.user.photoURL) {
						v = this.$parent.user.photoURL;
					}
					return v;
				}
//				set(v) {
//					this.$parent.user.photoURL = v;
//
//				}
			}
		},

		methods: {
			/*

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
			}*/
		},

		mounted() {
			//console.log("user:", firebase.api.auth().currentUser);
			/*
			if (!this.$parent.user.photoURL) {
				//get random user image for now
				Vue.axios.get("https://randomuser.me/api/").then((response) => {
					//console.log("img:", response.data.results[0].picture.large);
					this.photoURL = response.data.results[0].picture.large;
				});
				/*
				firebase.database()
  .ref(`/users/${currentUser.uid}/products/${productKey}`)
  .update({category: name});
				*/
				/*
				//loop provider data to find a profile photo
				firebase.api.auth().currentUser.providerData.forEach(function(profile) {
					console.log("Sign-in provider: " + profile.providerId);
					console.log("  Provider-specific UID: " + profile.uid);
					console.log("  Name: " + profile.displayName);
					console.log("  Email: " + profile.email);
					console.log("  Photo URL: " + profile.photoURL);
				});
				*/

			//}
		}
	}
</script>

<style>
	.user-card.mdl-card {
		margin: 2rem auto;
		min-height: 10px;

	}
	.user-card.mdl-card .mdl-card__photo {
		color: #fff;
		height: 200px;
	}
</style>