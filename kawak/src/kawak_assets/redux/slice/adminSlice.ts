import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserParams {
	username: string;
	noOfEssays: number;
	noOfNfts: number;
	noOfDispute: number;
}

export interface AdminState {
	totalUsers: number | undefined;
	totalDisputes: number | undefined;
	totalNfts?: number | undefined;
	totalEssays: number | undefined;
	users: UserParams[];
}

// Define the initial state using that type
const initialState: AdminState = {
	totalUsers: 0,
	totalDisputes: 0,
	totalNfts: 0,
	totalEssays: 0,
	users: [],
};

export const adminSlice = createSlice({
	name: "essayCount",
	initialState,
	reducers: {
		addAdminData: (state, { payload }: PayloadAction<AdminState>) => {
			state.totalUsers = payload.totalUsers;
			state.totalEssays = payload.totalEssays;
			state.totalDisputes = payload.totalDisputes;
			payload.users.map((user) => state.users.push(user));
			// state.users.push(payload.users)
		},
		setNFTValue: (state, { payload }: PayloadAction<number>) => {
			state.totalNfts = payload;
		},
	},
});

export const { addAdminData, setNFTValue } = adminSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default adminSlice.reducer;
