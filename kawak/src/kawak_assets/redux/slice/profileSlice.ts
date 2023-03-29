import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ProfileState {
	avatar: string | undefined;
	username: string | undefined;
	onboarding: boolean | undefined;
	reviewingEssay: number | undefined;
	tokenBalance: number | undefined;
	noOfDrafts: number | undefined;
	noOfEssays: number | undefined;
	isLoading: boolean | undefined;
}

// Define the initial state using that type
const initialState: ProfileState = {
	avatar: undefined,
	username: "",
	onboarding: undefined,
	reviewingEssay: undefined,
	tokenBalance: undefined,
	noOfDrafts: undefined,
	noOfEssays: undefined,
	isLoading: undefined,
};

export const profileSlice = createSlice({
	name: "profile",
	initialState,
	reducers: {
		updateProfile: (state, { payload }: PayloadAction<ProfileState>) => {
			localStorage.setItem("username", payload.username);
			state.isLoading = payload.isLoading;
			state.username = payload.username;
			state.noOfDrafts = payload.noOfDrafts;
			state.noOfEssays = payload.noOfEssays;
			state.onboarding = payload.onboarding;
			state.reviewingEssay = payload.reviewingEssay;
			state.tokenBalance = payload.tokenBalance;
			state.avatar = payload.avatar
		},
		setOnboarding: (state, action: PayloadAction<boolean>) => {
			state.onboarding = action.payload;
		},
		setTokenBalance: (state, action: PayloadAction<number>) => {
			state.tokenBalance -= action.payload;
		},
		setnoOfEssays: (state) => {
			state.noOfEssays += 1;
		},
	},
});

export const { updateProfile, setOnboarding, setTokenBalance, setnoOfEssays } =
	profileSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default profileSlice.reducer;
