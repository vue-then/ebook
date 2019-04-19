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
import { ebookMixin } from "../../utils/mixin";
import {
	getFontFamily,
	saveFontFamily,
	getFontSize,
	saveFontSize,
	getTheme,
	saveTheme,
	getLocation
} from "../../utils/localStorage";
import { flatten } from '../../utils/book'
global.ePub = Epub;

export default {
	name: "EbookReader",
	mixins: [ebookMixin],
	mounted() {
		const fileName = this.$route.params.fileName.split("|").join("/");
		this.setFileName(fileName).then(() => {
			this.initEpub();
        });
        // axios.get('/api/ab').then(res =>{
        //     console.log(res,'123456')
        // })
	},
	methods: {
		initEpub() {
			const baseUrl = "/resource/epub/";
			const url = baseUrl + this.fileName + ".epub";
			this.book = new Epub(url);
			this.setCurrentBook(this.book);
			this.initRendition();
			this.initGesture();
			this.parseBook();
			// console.log( this.book,bookHome,url);
			// http://localhost:8092/#/ebook/History|2017_Book_InterdisciplinaryPerspectivesO at

			this.book.ready
				.then(() => {
					return this.book.locations.generate(
						750 *
							(window.innerWidth / 375) *
							(getFontSize(this.fileName) / 16)
					);
				})
				.then(locations => {
					this.navigation.forEach(nav => {
						nav.pagelist = [];
					});
					locations.forEach(item => {
						const loc = item.match(/\[(.*)\]!/)[1];
						this.navigation.forEach(nav => {
							if (nav.href) {
								const href = nav.href.match(/^(.*)\.html$/)[1];
								if (href === loc) {
									nav.pagelist.push(item);
								}
							}
						});
						let currentPage = 1;
						this.navigation.forEach((nav, index) => {
							if (index === 0) {
								nav.page = 1;
							} else {
								nav.page = currentPage;
							}
							currentPage += nav.pagelist.length + 1;
						});
					});
					this.setPagelist(locations);
					this.setBookAvailable(true);
					this.refreshLocation();
				});
		},

		parseBook() {
			this.book.loaded.cover.then(cover => {
				this.book.archive.createUrl(cover).then(url => {
					this.setCover(url);
				});
			});
			this.book.loaded.metadata.then(metadata => {
				this.setMetadata(metadata);
			});
			this.book.loaded.navigation.then(nav => {
				const navItem = flatten(nav.toc);
				function find(item, level = 0) {
					return !item.parent
						? level
						: find(
								navItem.filter(
									parentItem => parentItem.id === item.parent
								)[0],
								++level
						  );
				}

				navItem.forEach(item => {
					item.level = find(item);
				});
				this.setNavigation(navItem);
			});
		},
		initRendition() {
			this.rendition = this.book.renderTo("read", {
				width: innerWidth,
				height: innerHeight
				//   method: 'default'
			});
			const location = getLocation(this.fileName);
			this.display(location, () => {
				this.initTheme();
				this.initFontSize();
				this.initFontFamily();
				this.initGlobalStyle();
			});

			this.rendition.hooks.content.register(contents => {
                console.log(process.env.VUE_APP_RES_URL,'process.env.VUE_APP_RES_URL')
				Promise.all([
					contents.addStylesheet(
						`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`
					),
					contents.addStylesheet(
						`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`
					),
					contents.addStylesheet(
						`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`
					),
					contents.addStylesheet(
						`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`
					)
				]).then(() => {});
			});
		},
		prevPage() {
			if (this.rendition) {
				this.rendition.prev().then(() => {
					this.refreshLocation();
				});
				this.hideTitleAndMenu(); //翻页的时候隐藏上下控制栏
			}
		},
		nextPage() {
			if (this.rendition) {
				this.rendition.next().then(() => {
					this.refreshLocation();
				});
				this.hideTitleAndMenu(); //翻页的时候隐藏上下控制栏
			}
		},
		toggleTitleAndMenu() {
			if (this.menuVisible) {
				this.setSettingVisible(-1);
				this.setFontFamilyVisible(false);
			}
			this.setMenuVisible(!this.menuVisible);
		},
		initFontSize() {
			let fontSize = getFontSize(this.fileName);
			if (!fontSize) {
				saveFontSize(this.fileName, this.defaultFontSize);
			} else {
				this.rendition.themes.fontSize(fontSize);
				this.setDefaultFontSize(fontSize);
			}
		},
		initFontFamily() {
			let font = getFontFamily(this.fileName);
			if (!font) {
				saveFontFamily(this.fileName, this.defaultFontFamily);
			} else {
				this.rendition.themes.font(font);
				this.setDefaultFontFamily(font);
			}
		},
		initTheme() {
			let defaultTheme = getTheme(this.fileName);
			if (!defaultTheme) {
				defaultTheme = this.themeList[0].name;
				saveTheme(this.fileName, defaultTheme);
			}
			this.setDefaultTheme(defaultTheme);
			this.themeList.forEach(theme => {
				this.rendition.themes.register(theme.name, theme.style);
			});
			this.rendition.themes.select(defaultTheme);
		},
		initGesture() {
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
		}
	}
};
</script>
