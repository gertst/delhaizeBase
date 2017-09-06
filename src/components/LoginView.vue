<template lang="html">
	<div>
		  <div id="firebaseui-auth-container"></div>
	 </div>
</template>

<script>
	import firebase from 'firebase';
	import firebaseui from 'firebaseui'

	export default {
		name: 'auth',
		mounted() {
			var uiConfig = {
				signInSuccessUrl: '/',
				signInOptions: [
					firebase.auth.GoogleAuthProvider.PROVIDER_ID
//					firebase.auth.EmailAuthProvider.PROVIDER_ID
				]
			};
			if (this.$root.ui) {
				this.$root.ui.reset();
			} else {
				this.$root.ui = new firebaseui.auth.AuthUI(firebase.auth());
				this.$root.ui.start('#firebaseui-auth-container', uiConfig);
			}
		}
	}
</script>