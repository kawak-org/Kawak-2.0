import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface NFTState {
	id: number | undefined;
	title: string;
	content: string | undefined;
}

// Define the initial state using that type
const initialState: NFTState[] = [];

export const NFTSlice = createSlice({
	name: "myNFT",
	initialState,
	reducers: {
		addAllNFTs: (state, { payload }: PayloadAction<NFTState[]>) => {
			payload.map((nft) => {
				const { title, id, content } = nft;
				const data = {
					title,
					id: Number(id),
					content,
				};
				state.push(data);
			});
		},
		addNFT: (state, { payload }: PayloadAction<NFTState>) => {
			state.push(payload);
		},
	},
});

export const { addNFT, addAllNFTs } = NFTSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default NFTSlice.reducer;
