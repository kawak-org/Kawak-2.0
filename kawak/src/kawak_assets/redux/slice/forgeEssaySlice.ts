import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type EssayType = {
  id: number | undefined;
  owner: string;
  avatar?: string | null;
  reviewed: boolean;
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
export const forgeEssaySlice = createSlice({
  name: "forgeEssay",
  initialState,
  reducers: {
    addToForge: (state, { payload }: PayloadAction<EssayType>) => {
      state.push(payload);
    },
    setEssayToReviewed: (state, action: PayloadAction<number>) => {
      // console.log("should set reveiwed to true");
    },
    clearForge: () => {
      return initialState;
    },
  },
});

export const { addToForge, setEssayToReviewed, clearForge } =
  forgeEssaySlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default forgeEssaySlice.reducer;
