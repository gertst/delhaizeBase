<template>
	<div style="position:relative" v-bind:class="{'open':openSuggestion}">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">

		<input class="form-control" type="text"
		       :value="value"
		       @input="updateValue($event.target.value)"
		       @keydown.enter = 'enter'
		       @keydown.down = 'down'
		       @keydown.up = 'up'

		>
		<ul class="dropdown-menu">
			<li v-for="(suggestion, index) in matches"
			    v-bind:class="{'active': isActive(index)}"
			    @click="suggestionClick(index)"
			>
				<a href="#">{{ suggestion.label }}
				</a>
			</li>
		</ul>
	</div>
</template>

<script>
	export default {

		props: {

			value: {
				type: String,
				required: true
			},

			suggestions: {
				type: Array,
				required: true
			}

		},

		data () {
			return {
				open: false,
				current: 0
			}
		},

		computed: {
			// Filtering the suggestion based on the input
			matches () {
				return this.suggestions.filter((obj) => {
					return obj.label.indexOf(this.value) >= 0
				})
			},

			openSuggestion () {
				return this.selection !== '' &&
					this.matches.length !== 0 &&
					this.open === true
			}
		},

		methods: {

			updateValue (value) {
				if (this.open === false) {
					this.open = true
					this.current = 0
				}
				this.$emit('input', value)
			},

			// When enter pressed on the input
			enter () {
				this.$emit('input', this.matches[this.current].city)
				this.open = false
			},

			// When up pressed while suggestions are open
			up () {
				if (this.current > 0) {
					this.current--
				}
			},

			// When up pressed while suggestions are open
			down () {
				if (this.current < this.matches.length - 1) {
					this.current++
				}
			},

			// For highlighting element
			isActive (index) {
				return index === this.current
			},

			// When one of the suggestion is clicked
			suggestionClick (index) {
				this.$emit('input', this.matches[index].city)
				this.open = false
			},

			blur() {
				this.open = false;
			}

		}

	}
</script>

<style>
	.dropdown-menu {
		position: absolute;
		top: 100%;
		left: 0;
		z-index: 1000;
		display: none;
		float: left;
		min-width: 160px;
		padding: 5px 0;
		margin: 2px 0 0;
		font-size: 14px;
		text-align: left;
		list-style: none;
		background-color: #fff;
		-webkit-background-clip: padding-box;
		background-clip: padding-box;
		border: 1px solid #ccc;
		border: 1px solid rgba(0,0,0,.15);
		border-radius: 4px;
		-webkit-box-shadow: 0 6px 12px rgba(0,0,0,.175);
		box-shadow: 0 6px 12px rgba(0,0,0,.175);

	}
	.open>.dropdown-menu {
		display: block;
	}
	.dropdown-menu>.active>a, .dropdown-menu>.active>a:focus, .dropdown-menu>.active>a:hover {
		color: #fff;
		text-decoration: none;
		background-color: #337ab7;
		outline: 0;
	}
	dropdowns.less:70
	.dropdown-menu>li>a {
		display: block;
		padding: 3px 20px;
		clear: both;
		font-weight: 400;
		line-height: 1.42857143;
		color: #333;
		white-space: nowrap;
	}
	ul, menu, dir {
		display: block;
		list-style-type: disc;
		-webkit-margin-before: 1em;
		-webkit-margin-after: 1em;
		-webkit-margin-start: 0px;
		-webkit-margin-end: 0px;
		-webkit-padding-start: 40px;
	}
</style>