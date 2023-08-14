import { configureStore } from "@reduxjs/toolkit";
import NFTReducer from "./slice/NFTSlice";
import profileReducer from "./slice/profileSlice";
import essayReducer from "./slice/countSlice";
import forgeReducer from "./slice/forgeEssaySlice";
import myEssayReducer from "./slice/myEssaySlice";
import myDraftReducer from "./slice/draftSlice";
import adminDashboardData from "./slice/adminSlice";
import marketPlace from "./slice/marketPlace/marketPlaceSlice";
import marketPlaceDetail from "./slice/marketPlace/nftDetailsMPSlice";
import essayTags from "./slice/tagsSlice"
import annotation from "./slice/annotationSlice"
import myEssayDetailsSlice from "./slice/myEssayDetailsSlice";

export const store = configureStore({
	reducer: {
		profile: profileReducer,
		myNFT: NFTReducer,
		essay: essayReducer,
		forge: forgeReducer,
		myEssays: myEssayReducer,
		myDrafts: myDraftReducer,
		adminDashboardData,
		marketPlace,
		marketPlaceDetail,
		essayTags,
		annotation,
		myEssayDetailsSlice
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
