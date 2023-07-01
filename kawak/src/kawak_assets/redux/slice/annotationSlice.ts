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
		removeAnnotation: (state, { payload }: PayloadAction<number>) => {
			const tag = state.findIndex((obj) => obj.id === +payload);
			state.splice(tag, 1);
			return;
		},
	},
});

export const { addAnnotation, removeAnnotation } = annotationSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default annotationSlice.reducer;
