const book = {
	state: {
		fileName: "",
        menuVisible: false,
        settingVisible: -1,
        defaultFontSize: 16,
        defaultFontFamily: 'Default',
        fontFamilyVisible: false,
	},
	mutations: {
		'SET_FILENAME': (state, fileName) => {
			state.fileName = fileName;
		},
		'SET_MENU_VISIBLE': (state, visible) => {
			state.menuVisible = visible;
        },
        'SET_SETTING_VISIBLE': (state, visible) => {
            state.settingVisible = visible
            console.log(visible, "visible");
        },
        'SET_DEFAULT_FONT_SIZE': (state, fontSize) => {
            state.defaultFontSize = fontSize
        },
        'SET_DEFAULT_FONT_FAMILY': (state, font) => {
            state.defaultFontFamily = font
        },
        'SET_FONT_FAMILY_VISIBLE': (state, visible) => {
            state.fontFamilyVisible = visible
        },
	}
};

export default book;