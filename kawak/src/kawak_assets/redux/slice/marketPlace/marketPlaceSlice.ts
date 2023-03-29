import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type ItemType = {
	id: number | undefined;
	owner: string;
	avatar: string;
	content: string;
	title: string;
	price: number;
	listed: boolean;
};

// Define the initial state using that type
const initialState: ItemType[] = [];

//TODO: removeEssay
export const marketPlace = createSlice({
	name: "marketPlace",
	initialState,
	reducers: {
		addToMarketPlace: (state, { payload }: PayloadAction<ItemType>) => {
			state.push(payload);
		},
		clearMarketPlace: () => {
			return initialState;
		},
	},
});

export const { addToMarketPlace, clearMarketPlace } = marketPlace.actions; // Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default marketPlace.reducer;
