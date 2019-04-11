<template>
	<div id="app">
		<router-view/>
	</div>
</template>

<script>
document.addEventListener("DOMContentLoaded", () => {
	let fontSize = window.innerWidth / 10;
	fontSize = fontSize > 50 ? 50 : fontSize;
	const html = document.querySelector("html");
	html.style.fontSize = fontSize + "px";
});
import {mapGetters} from 'vuex'
const getters = {
    a: () => 1,
    b: () => 2,
    c: () => 3
}
function fn(keys){
    const data = {}
    keys.forEach(key => {
        if(getters.hasOwnProperty(key)){
            data[key] = getters[key]
        }
    })
    return data;
}

export default {
    computed: {
        ...mapGetters(['test']),
        ...fn(['a','b','c'])
    },
    name: "app",
    mounted() {
        console.log(this.a,this.b,this.c)
        this.$store.dispatch('setTest',6).then(()=>{
            console.log(this.test)
        })
    }
};
</script>
