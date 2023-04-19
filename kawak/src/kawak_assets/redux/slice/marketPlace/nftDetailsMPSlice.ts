import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type ItemType = {
	id: number | undefined;
	owner: string | undefined;
	avatar: string | undefined;
	content: string | undefined;
	title: string | undefined;
	price: number | undefined;
	listed: boolean | undefined;
};

// Define the initial state using that type
const initialState: ItemType = {
	id: undefined,
	owner: undefined,
	avatar: undefined,
	content: undefined,
	title: undefined,
	price: undefined,
	listed: undefined,
};

//TODO: removeEssay
export const marketPlaceDetail = createSlice({
	name: "marketPlaceDetail",
	initialState,
	reducers: {
		addMarketPlaceDetail: (state, { payload }: PayloadAction<ItemType>) => {
			state.id = payload.id;
			state.owner = payload.owner;
			state.content = payload.content;
			state.title = payload.title;
			state.price = payload.price;
			state.listed = payload.listed;
			state.avatar = payload.avatar;
		},
	},
});

export const { addMarketPlaceDetail } = marketPlaceDetail.actions; // Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default marketPlaceDetail.reducer;
