import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Principal } from "@dfinity/principal";


export type ReviewType = {
  id: number;
  user: Principal;
  quote: string;
  comments: string;
  rated: boolean;
};


// Define the initial state using that type
const initialState: ReviewType[] = [];

export const annotationSlice = createSlice({
	name: "annotation",
	initialState,
	reducers: {
		addAnnotation: (state, { payload }: PayloadAction<ReviewType>) => {
            state.push(payload);
	
		},
		clearAnnotation: () => {
			return initialState;
		},
	},
});

export const { addAnnotation,  clearAnnotation } = annotationSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default annotationSlice.reducer;
