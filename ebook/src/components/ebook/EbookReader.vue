<style lang="scss" scoped>
</style>

<template>
	<div class="ebook-reader">
		<div id="read"></div>
	</div>
</template>
<script>
import Epub from "epubjs";
import { mapGetters } from "vuex";
import axios from "axios";
// import bookHome from "../../mock/bookHome.js"

global.ePub = Epub;

export default {
	name: "EbookReader",
	computed: {
		...mapGetters(["fileName"])
	},
	mounted() {
		const fileName = this.$route.params.fileName.split("|").join("/");
		this.$store.dispatch("setFileName", fileName).then(() => {
			this.initEpub();
		});
	},
	methods: {
		initEpub() {
			const baseUrl = "/resource/epub/";
			const url = baseUrl + this.fileName + ".epub";
			this.book = new Epub(url);
            // console.log( this.book,bookHome,url);
            // http://localhost:8092/#/ebook/History|2017_Book_InterdisciplinaryPerspectivesO at
			this.rendition = this.book.renderTo('read',{
				width: window.innerWidth,
				height: window.innerHeight,
				method: "default"
            });
            this.rendition.display()
			// axios.get('/book/home').then(res =>{
			//     console.log(res,'123456')
			// })
		}
	}
};
</script>
