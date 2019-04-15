const actions = {
	setMenuVisible: ({ commit }, visible) => {
		return commit("SET_MENU_VISIBLE", visible);
	},
	setFileName: ({ commit }, fileName) => {
		return commit("SET_FILENAME", fileName);
	}
};

export default actions
