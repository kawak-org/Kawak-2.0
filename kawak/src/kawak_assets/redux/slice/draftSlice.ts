import { createSlice, current } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type DraftType = {
	id: number;
	text: string;
	title: string;
};

// Define the initial state using that type
const initialState: DraftType[] = [];

//TODO: removeEssay, edit essay(find the essay in the array by id, and edit it or any other better way)
export const myDraftSlice = createSlice({
	name: "myDraft",
	initialState,
	reducers: {
		addToMyDraft: (state, { payload }: PayloadAction<DraftType>) => {
			state.push(payload);
		},
		updateDraftItem: (state, { payload }: PayloadAction<DraftType>) => {
			const upd_draft = state.findIndex((obj) => obj.id === +payload.id);

			if (upd_draft != -1) {
				state[upd_draft].text = payload.text;
				state[upd_draft].title = payload.title;
				return state;
			}
			return;
		},
		removeFromDraft: (state, { payload }: PayloadAction<string>) => {
			const draft = state.findIndex((obj) => obj.id === +payload);
			state.splice(draft, 1);
			return;
		},
	},
});

export const { addToMyDraft, updateDraftItem, removeFromDraft } =
	myDraftSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default myDraftSlice.reducer;
