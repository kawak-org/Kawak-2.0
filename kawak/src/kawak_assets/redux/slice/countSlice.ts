import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { useHTMLtoTextConverter } from "../../utils/htmlToText";

export interface CountState {
	words: number | undefined;
	forgeLength: number
}

// Define the initial state using that type
const initialState: CountState = {
	words: 0,
	forgeLength: 0
};

export const essaySlice = createSlice({
	name: "essayCount",
	initialState,
	reducers: {
		setEssayCount: (state) => {
			const text = localStorage.getItem("last_essay");
			const text_ = useHTMLtoTextConverter(text);
			const noOfWords: number = text_.split(" ").length;
			state.words = noOfWords;
		},
		resetCount: (state) => {
			state.words = 0;
		},

		setForgeLength : (state, { payload }: PayloadAction<number>) => {
			state.forgeLength = payload;

		}
	},
});

export const { setEssayCount, resetCount, setForgeLength } = essaySlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default essaySlice.reducer;
