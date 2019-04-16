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
import axios from "axios";
import { ebookMixin } from '../../utils/mixin'

global.ePub = Epub;

export default {
	name: "EbookReader",
	mixins: [ebookMixin],
	mounted() {
		const fileName = this.$route.params.fileName.split("|").join("/");
		this.setFileName(fileName).then(() => {
			this.initEpub();
		});
	},
	methods: {
		initEpub() {
			const baseUrl = "/resource/epub/";
			const url = baseUrl + this.fileName + ".epub";
            this.book = new Epub(url);
            this.setCurrentBook(this.book)
			// console.log( this.book,bookHome,url);
			// http://localhost:8092/#/ebook/History|2017_Book_InterdisciplinaryPerspectivesO at
			this.rendition = this.book.renderTo("read", {
				width: window.innerWidth,
				height: window.innerHeight
				// method: "default"
			});
			this.rendition.display();
			// axios.get('/book/home').then(res =>{
			//     console.log(res,'123456')
			// })
			this.rendition.on("touchstart", event => {
				this.touchStartX = event.changedTouches[0].clientX;
				this.touchStartTime = event.timeStamp;
			});
			this.rendition.on("touchend", event => {
				const offsetX =
					event.changedTouches[0].clientX - this.touchStartX;
				const time = event.timeStamp - this.touchStartTime;

				if (time < 500 && offsetX > 40) {
					//touch_左
					this.prevPage();
				} else if (time < 500 && offsetX < -40) {
					//touch_右
					this.nextPage();
				} else {
					//touch_中间
					this.toggleTitleAndMenu();
				}

				event.preventDefault();
				event.stopPropagation();
            });
            
		},
		prevPage() {
			if (this.rendition) {
				this.rendition.prev().then(() => {
					// this.refreshLocation();
				});
				this.hideTitleAndMenu();//翻页的时候隐藏上下控制栏
			}
		},
		nextPage() {
			if (this.rendition) {
				this.rendition.next().then(() => {
					// this.refreshLocation();
				});
				this.hideTitleAndMenu();//翻页的时候隐藏上下控制栏
			}
        },
        toggleTitleAndMenu(){
            this.setMenuVisible(!this.menuVisible);
        },
	}
};
</script>
