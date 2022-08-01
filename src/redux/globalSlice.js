import { createSlice } from "@reduxjs/toolkit";

const KEY = "global";

const globalSlice = createSlice({
	name: KEY,
	initialState: {
		isLoading: false,
		isLogin: true,
		user: { id: 1 },
	},

	reducers: {
		setLoading: (state, action) => {
			state.isLoading = action.payload;
		},
		setLogin: (state, action) => {
			state.isLogin = action.payload;
		},
		logout: (state, action) => {
			state.isLogin = false;
			state.user = null;
		},
	},

	extraReducers: {},
});

const { reducer, actions } = globalSlice;
export const { setLoading, setLogin, logout } = actions;
export default reducer;
