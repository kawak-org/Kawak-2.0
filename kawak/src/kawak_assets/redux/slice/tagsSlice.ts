import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface TagsState {
        id:number;
        text:string	
}



// Define the initial state using that type
const initialState: TagsState[] = [];

export const tagsSlice = createSlice({
	name: "essayTags",
	initialState,
	reducers: {
		clearTag: () => {
			return initialState;
		},
		addTag: (state, { payload }: PayloadAction<TagsState>) => {
            state.push(payload);
			return
		},
		removeTag: (state, { payload }: PayloadAction<number>) => {
			const tag = state.findIndex((obj) => obj.id === +payload);
			state.splice(tag, 1);
			return;
		},
		
	},
});

export const { addTag, removeTag, clearTag } = tagsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default tagsSlice.reducer;
