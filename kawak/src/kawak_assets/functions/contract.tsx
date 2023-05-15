import { useContext, useState } from "react";
import { UserContext } from "../context/userContext";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { updateProfile } from "../redux/slice/profileSlice";
import { kawak } from "../../declarations/kawak/index";
import { EssayEntry } from "./types";
import {
	Result,
	TokenMetadata,
} from "../../declarations/kawak/kawak.did";
import { addAllNFTs } from "../redux/slice/NFTSlice";
import {
	addToForge,
	clearForge,
	EssayType,
} from "../redux/slice/forgeEssaySlice";
import { EssayType as EssayType_ } from "../redux/slice/myEssaySlice";
import { addToMyDraft, DraftType } from "../redux/slice/draftSlice";
import { addToMyEssay } from "../redux/slice/myEssaySlice";
import ErrorHandler from "../utils/ErrorHandler";
import { useNavigate } from "react-router-dom";
import {
	addAdminData,
	setNFTValue,
	UserParams,
} from "../redux/slice/adminSlice";
import { Principal } from "@dfinity/principal";
import {
	addToMarketPlace,
	clearMarketPlace,
	ItemType,
} from "../redux/slice/marketPlace/marketPlaceSlice";
import { addMarketPlaceDetail } from "../redux/slice/marketPlace/nftDetailsMPSlice";
// const Contract = useActor();
// if (Contract_ != undefined|| null) {
// 	console.log(Contract)
// }

export const useFetchProfile = () => {
	const { actor } = useContext(UserContext);
	// const [isLoading, setIsLoading] = useState<boolean>(true);
	const dispatch = useAppDispatch();
	try {
		const handleFetch = () => {
			actor?.getUser().then((profile) => {
				if (!profile) {
					return toast.error("cannot find user");
				} else {
					const {
						userName,
						myEssays,
						myDrafts,
						// pastRatedFeedbacks,
						token_balance,
						reviewingEssay,
						onBoarding,
						avatar,
						// userRating,
					} = profile[0];
					const data = {
						avatar,
						username: userName,
						onboarding: onBoarding,
						reviewingEssay: Number(reviewingEssay),
						// pastRatedFeedbacks: Number(pastRatedFeedbacks)[],
						tokenBalance: Number(token_balance),
						noOfDrafts: myDrafts.length,
						noOfEssays: myEssays.length,
						isLoading: false,
					};
					dispatch(updateProfile(data));
				}
			});
		};

		return { handleFetch };
	} catch (err) {
		ErrorHandler(err);
	}
};
