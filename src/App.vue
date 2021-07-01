<template>
  <v-app id="app">
    <v-main>
        <router-view/>
    </v-main>
  </v-app>
</template>

<style lang="scss">
$bg: #e3e0e7;
body {
	overflow-x: scroll;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
	background: $bg;
	text-align: left;
	padding: 8px;
}
#app {
	background: $bg;
	.v-btn {
		text-transform: capitalize;
		// box-shadow: 0 2px 4px rgba(100, 100, 100, .15);
	}
}
</style>
