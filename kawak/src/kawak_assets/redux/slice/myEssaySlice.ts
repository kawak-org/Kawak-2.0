import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type EssayType = {
  id: number | undefined;
  owner: string;
  reviewed: boolean;
  avatar: string;
  text: string;
  title: string;
  wordCount: number;
  essayCost: number;
  reviewTimes: number;
  public: boolean;
  description: string;
  tags: string[];
 
};

// Define the initial state using that type
const initialState: EssayType[] = [];

//TODO: removeEssay
export const myEssaySlice = createSlice({
  name: "myEssay",
  initialState,
  reducers: {
    addToMyEssay: (state, { payload }: PayloadAction<EssayType>) => {
      state.push(payload);
    },
    setMyEssayToReviewed: (state, action: PayloadAction<number>) => {
      console.log("should set reveiwed to true");
    }
  },
});

export const { addToMyEssay, setMyEssayToReviewed } = myEssaySlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default myEssaySlice.reducer;
