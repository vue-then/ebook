import { mapGetters, mapActions } from "vuex";

export const ebookMixin = {
	computed: {
        ...mapGetters([
            'fileName',
            'menuVisible',
            'settingVisible',
            'defaultFontSize',
            'defaultFontFamily',
            'fontFamilyVisible',
        ])
    },
    methods: {
        ...mapActions([
            'setFileName',
            'setMenuVisible',
            'setSettingVisible',
            'setDefaultFontSize',
            'setDefaultFontFamily',
            'setFontFamilyVisible',
        ]),
        hideTitleAndMenu() {
            this.setMenuVisible(false)
        },
    }
};
