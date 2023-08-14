import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {EssayType} from "./myEssaySlice"


export interface EssayDetailsType  {
    visibility?: {
        essay: boolean;
        review: boolean
      }
};

// Define the initial state using that type
const initialState: EssayDetailsType = {
    visibility: {
        essay: false,
        review:false
    }
};

//TODO: removeEssay
export const myEssayDetailsSlice = createSlice({
  name: "myEssayDetails",
  initialState,
  reducers: {
    setEssayVisibility: (state, {payload}: PayloadAction<boolean>) => {
        state.visibility.essay = payload
    },
    setReviewVisibility: (state, { payload}: PayloadAction<boolean>) => {
        state.visibility.review = payload
    }
  },
});

export const { setEssayVisibility, setReviewVisibility } = myEssayDetailsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default myEssayDetailsSlice.reducer;
