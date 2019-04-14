<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .ebook-reader {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .ebook-reader-mask {
      position: absolute;
      z-index: 150;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
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
             this.rendition.on('touchstart', event => {
                console.log(event,'touchstart')
                this.touchStartX = event.changedTouches[0].clientX
                this.touchStartTime = event.timeStamp
            })
            this.rendition.on('touchend',event => {
                console.log(event,12345)
                event.preventDefault()
                event.stopPropagation()
            })
		}
	}
};
</script>
