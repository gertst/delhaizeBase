<template>
	<md-sidenav class="md-left md-fixed" :md-swipeable="true" ref="sidebar">
		<md-toolbar class="md-account-header">
			<md-list class="md-transparent">
				<md-list-item class="md-avatar-list">
					<md-avatar v-if="$root.user.email" class="md-large">
						<img :src="$root.user.photoURL.split('/photo.jpg').join('/s128-c/photo.jpg')" alt="$root.user.displayName">
					</md-avatar>
				</md-list-item>

				<md-list-item>
					<div class="md-list-text-container">
						<span>{{$root.user.displayName}}</span>
						<span>{{$root.user.email}}</span>
					</div>

					<md-button class="md-icon-button md-list-action">
						<md-menu md-size="4">
							<md-button class="md-icon-button" md-menu-trigger>
								<md-icon>arrow_drop_down</md-icon>
							</md-button>

							<md-menu-content>
								<md-menu-item v-if="$root.user.email" @click="logOut()">
									<md-icon>close</md-icon>
									<span>Log Out</span>
								</md-menu-item>
							</md-menu-content>
						</md-menu>
					</md-button>
				</md-list-item>
			</md-list>
		</md-toolbar>

		<md-list>
			<md-list-item @click="$refs.sidebar.toggle()" class="md-primary">
				<md-icon>insert_drive_file</md-icon> <span>Option 1</span>
			</md-list-item>

			<md-list-item @click="$refs.sidebar.toggle()">
				<md-icon>people</md-icon> <span>Option 2</span>
			</md-list-item>

			<md-list-item @click="$refs.sidebar.toggle()">
				<md-icon>access_time</md-icon> <span>Option 3</span>
			</md-list-item>

			<md-list-item @click="$refs.sidebar.toggle()">
				<md-icon>start</md-icon> <span>Option 4</span>
			</md-list-item>

			<md-list-item @click="$refs.sidebar.toggle()">
				<md-icon>delete</md-icon> <span>Trash</span>
			</md-list-item>
		</md-list>
	</md-sidenav>
</template>

<script>


	export default {

		Name: "SideBar",

		mounted() {
			this.$root.$on("sideBarToggle", () => {
				this.$refs.sidebar.toggle()
			});
		},

		methods: {

			logOut() {
				this.$root.firebase.auth().signOut();
				this.$root.user = {};
			}
		}


	}
</script>

<style>

</style>
