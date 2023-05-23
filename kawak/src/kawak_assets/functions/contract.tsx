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

export const useGetAllEssays = () => {
	const [loading, setLoading] = useState(false);
	const { actor } = useContext(UserContext);
	const dispatch = useAppDispatch();
	try {
		const fetchData = async () => {
			setLoading(true);
			const data = await actor?.getAllEssays();
			if (data) {
				for (let i = 0; i < data.length; i++) {
					const val = data[i][1];
					var val_: EssayType = {
						id: Number(val.id),
						essayCost: Number(val.essayCost),
						wordCount: Number(val.wordCount),
						owner: val.owner,
						avatar: "" /* val.userDetails.avatar */,
						reviewed: val.reviewed,
						text: val.text,
						title: val.title,
						reviewTimes: Number(val.reviewTimes),
					};
					dispatch(addToForge(val_));
				}
				setLoading(false);
			}
			setLoading(false);
		};
		return { fetchData, loading };
	} catch (err) {
		toast.error("something went wrong");
		setLoading(false);
		console.log(err);
	}
};