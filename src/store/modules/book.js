const book = {
	state: {
		fileName: "",
		menuVisible: false
	},
	mutations: {
		SET_FILENAME: (state, fileName) => {
			state.fileName = fileName;
		},
		SET_MENU_VISIBLE: (state, visible) => {
			state.menuVisible = visible;
		}
	}
};

export default book;