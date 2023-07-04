// import { useContext, useState } from "react";
// import { UserContext } from "../context/userContext";
// import toast from "react-hot-toast";
// import { useAppDispatch, useAppSelector } from "../redux/hooks";
// import { updateProfile } from "../redux/slice/profileSlice";
// import { Contract } from "../../declarations/Contract/index";
// import { EssayEntry } from "./types";
// import {
// 	Result,
// 	TokenMetadata,
// } from "../../declarations/Contract/Contract.did";
// import { addAllNFTs } from "../redux/slice/NFTSlice";
// import {
// 	addToForge,
// 	clearForge,
// 	EssayType,
// } from "../redux/slice/forgeEssaySlice";
// import { EssayType as EssayType_ } from "../redux/slice/myEssaySlice";
// import { addToMyDraft, DraftType } from "../redux/slice/draftSlice";
// import { addToMyEssay } from "../redux/slice/myEssaySlice";
// import ErrorHandler from "../utils/ErrorHandler";
// import { useNavigate } from "react-router-dom";
// import {
// 	addAdminData,
// 	setNFTValue,
// 	UserParams,
// } from "../redux/slice/adminSlice";
// import { Principal } from "@dfinity/principal";
// import {
// 	addToMarketPlace,
// 	clearMarketPlace,
// 	ItemType,
// } from "../redux/slice/marketPlace/marketPlaceSlice";
// import { addMarketPlaceDetail } from "../redux/slice/marketPlace/nftDetailsMPSlice";
// // const Contract = useActor();
// // if (Contract_ != undefined|| null) {
// // 	console.log(Contract)
// // }

// export const ContractFnc = {
// 	login: async () => {
// 		return await Contract?.logIn();
// 	},
// 	createEssay: async (essayEntry: EssayEntry) => {
// 		const essayWords = useAppSelector((state) => state.essay.words);
// 		return await Contract?.createEssay(
// 			essayEntry.title,
// 			essayEntry.topic,
// 			BigInt(essayWords),
// 			essayEntry.essayCost,
// 			essayEntry.text
// 		);
// 	},
// 	deleteEssay: async (id: bigint) => {
// 		return await Contract?.deleteEssay(id);
// 	},
// 	getAllEssays: async () => {
// 		return await Contract?.getAllEssays();
// 	},
// 	getEssay: async (id: bigint) => {
// 		return await Contract?.getEssay(id);
// 	},
// 	addReviewingEssay: async (id: bigint) => {
// 		return await Contract?.addReviewingEssay(id);
// 	},
// 	getReviewingEssay: async () => {
// 		return await Contract?.getReviewingEssay();
// 	},
// 	// submitReviewedEssay: async (essay: string) => {
// 	// 	return await Contract?.submittReviewedEssay(essay);
// 	// },
// 	getReviewsFromEssay: async (id: bigint) => {
// 		return await Contract?.getReviewsFromEssay(id);
// 	},
// 	// pay: async (userEntry: UserEntry, id: bigint) => {
// 	// 	return await Contract?.pay(userEntry, id);
// 	// },
// 	getUserEntrybyPrincipal: async () => {
// 		return await Contract?.getUserEntrybyPrincipal();
// 	},
// 	whoamI: async () => {
// 		return await Contract?.whoami();
// 	},
// 	// createProfile: async (text: string) => {
// 	// 	return await Contract?.createProfile(text);
// 	// },
// 	getUserEssay: async (text: string) => {
// 		return await Contract?.getUserEssay(text);
// 	},
// };
// export const useFetchProfile = () => {
// 	const { actor } = useContext(UserContext);
// 	// const [isLoading, setIsLoading] = useState<boolean>(true);
// 	const dispatch = useAppDispatch();
// 	try {
// 		const handleFetch = () => {
// 			actor?.getUserEntrybyPrincipal().then((profile) => {
// 				if (!profile) {
// 					return toast.error("cannot find user");
// 				} else {
// 					const {
// 						userName,
// 						myEssays,
// 						myDrafts,
// 						// pastRatedFeedbacks,
// 						token_balance,
// 						reviewingEssay,
// 						onBoarding,
// 						avatar,
// 						// userRating,
// 					} = profile[0];
// 					const data = {
// 						avatar,
// 						username: userName,
// 						onboarding: onBoarding,
// 						reviewingEssay: Number(reviewingEssay),
// 						// pastRatedFeedbacks: Number(pastRatedFeedbacks)[],
// 						tokenBalance: Number(token_balance),
// 						noOfDrafts: myDrafts.length,
// 						noOfEssays: myEssays.length,
// 						isLoading: false,
// 					};
// 					dispatch(updateProfile(data));
// 				}
// 			});
// 		};

// 		return { handleFetch };
// 	} catch (err) {
// 		ErrorHandler(err);
// 	}
// };

// export const useGetAllNFTs = () => {
// 	const { actor } = useContext(UserContext);
// 	const [loading, setLoading] = useState(false);
// 	const dispatch = useAppDispatch();

// 	try {
// 		const handleGetNFTs = () => {
// 			setLoading(true);
// 			actor
// 				?.whoami()
// 				.then((d: any) => {
// 					actor
// 						?.nftOwnerTokenMetaData(d)
// 						.then((nfts: any) => {
// 							if (nfts) {
// 								const nfts_ = nfts["ok"];
// 								const data_ = [];
// 								nfts_.map((nft: TokenMetadata) => {
// 									const { title, token_identifier: id, content } = nft;
// 									const data = {
// 										title,
// 										id: Number(id),
// 										content,
// 									};
// 									data_.push(data);
// 								});
// 								dispatch(addAllNFTs(data_));
// 								setLoading(false);
// 							}
// 						})
// 						.catch((err) => {
// 							setLoading(false);
// 							ErrorHandler(err);
// 							console.log(err);
// 						});
// 				})
// 				.catch((err) => {
// 					console.log(err);
// 					setLoading(false);
// 					ErrorHandler(err);
// 					// toast.error("error getting your principal");
// 				});
// 		};

// 		return { handleGetNFTs, loading };
// 	} catch (err) {
// 		console.log(err);
// 		toast.error(err || err.message);
// 	}
// };

// export const useGetAllEssays = () => {
// 	const [loading, setLoading] = useState(false);
// 	const { actor } = useContext(UserContext);
// 	const dispatch = useAppDispatch();
// 	try {
// 		const fetchData = async () => {
// 			setLoading(true);
// 			const data = await actor?.getAllEssays();
// 			if (data) {
// 				for (let i = 0; i < data.length; i++) {
// 					const val = data[i][1];
// 					var val_: EssayType = {
// 						id: Number(val.id),
// 						essayCost: Number(val.essayCost),
// 						wordCount: Number(val.wordCount),
// 						owner: val.owner,
// 						avatar: val.userDetails.avatar,
// 						reviewed: val.reviewed,
// 						text: val.text,
// 						title: val.title,
// 						reviewTimes: Number(val.reviewTimes),
// 					};
// 					dispatch(addToForge(val_));
// 				}
// 				setLoading(false);
// 			}
// 			setLoading(false);
// 		};
// 		return { fetchData, loading };
// 	} catch (err) {
// 		toast.error("something went wrong");
// 		setLoading(false);
// 		console.log(err);
// 	}
// };

// export const useGetMyEssays = () => {
// 	const [loading, setLoading] = useState(false);
// 	const { actor } = useContext(UserContext);
// 	const dispatch = useAppDispatch();
// 	try {
// 		const fetchData = async () => {
// 			setLoading(true);
// 			const username = localStorage.getItem("username");
// 			const data = await actor?.getUserEssay(username);
// 			if (data) {
// 				for (let i = 0; i < data[0].length; i++) {
// 					const val = data[0][i];
// 					if (!val) {
// 						setLoading(false);
// 						return;
// 					}
// 					var val_: EssayType_ = {
// 						id: Number(val.id),
// 						essayCost: Number(val.essayCost),
// 						wordCount: Number(val.wordCount),
// 						owner: val.owner,
// 						avatar: val.userDetails.avatar,
// 						reviewed: val.reviewed,
// 						text: val.text,
// 						title: val.title,
// 						reviewTimes: Number(val.reviewTimes),
// 					};
// 					dispatch(addToMyEssay(val_));
// 				}
// 				setLoading(false);
// 			}
// 			setLoading(false);
// 		};
// 		return { fetchData, loading };
// 	} catch (err) {
// 		toast.error("something went wrong");
// 		setLoading(false);
// 		console.log(err);
// 	}
// };

// export const useGetRecentForge = () => {
// 	const [loading, setLoading] = useState(false);
// 	const { actor } = useContext(UserContext);
// 	const dispatch = useAppDispatch();
// 	const array: EssayType[] = [];
// 	const newEssays: EssayType[] = [];
// 	const forge = useAppSelector((state) => state.forge);
// 	try {
// 		const fetchData = async () => {
// 			setLoading(true);
// 			const data = await actor?.getAllEssays();
// 			if (data) {
// 				for (let i = 0; i < data.length; i++) {
// 					const val = data[i][1];
// 					var val_: EssayType = {
// 						id: Number(val.id),
// 						essayCost: Number(val.essayCost),
// 						wordCount: Number(val.wordCount),
// 						owner: val.owner,
// 						reviewed: val.reviewed,
// 						avatar: val.userDetails.avatar,
// 						text: val.text,
// 						title: val.title,
// 						reviewTimes: Number(val.reviewTimes),
// 					};
// 					array.push(val_);
// 				}

// 				dispatch(clearForge());
// 				array.forEach((d) => {
// 					dispatch(addToForge(d));
// 				});

// 				setLoading(false);
// 			}
// 			setLoading(false);
// 		};
// 		return { fetchData, loading };
// 	} catch (err) {
// 		toast.error("something went wrong");
// 		setLoading(false);
// 		console.log(err);
// 	}
// };

// export const useGetMyDrafts = () => {
// 	const [loading, setLoading] = useState(false);
// 	const { actor } = useContext(UserContext);
// 	const dispatch = useAppDispatch();
// 	try {
// 		const fetchData = async () => {
// 			setLoading(true);
// 			const username = localStorage.getItem("username");
// 			const data = await actor?.getMyDrafts(username);
// 			if (data) {
// 				for (let i = 0; i < data[0].length; i++) {
// 					const val = data[0][i];
// 					if (!val) {
// 						setLoading(false);
// 						return;
// 					}
// 					var val_: DraftType = {
// 						id: Number(val.id),
// 						text: val.text,
// 						title: val.title,
// 					};
// 					dispatch(addToMyDraft(val_));
// 				}
// 				setLoading(false);
// 			}
// 			setLoading(false);
// 		};
// 		return { fetchData, loading };
// 	} catch (err) {
// 		toast.error("something went wrong");
// 		setLoading(false);
// 		console.log(err);
// 	}
// };

// // ---------- ADMIN FUNCTIONS-----------------------------

// export const useMakeAdmin = () => {
// 	const [loading, setLoading] = useState(false);
// 	const navigate = useNavigate();
// 	try {
// 		const { actor } = useContext(UserContext);
// 		const makeAdmin = () => {
// 			actor
// 				._isAdmin(true)
// 				.then((d) => {
// 					toast.success("congrats, you are now an admin");
// 					setLoading(false);
// 					navigate("/admin");
// 				})
// 				.catch((err) => {
// 					console.log(err);
// 					setLoading(false);
// 					ErrorHandler(err);
// 				});
// 		};
// 		return { makeAdmin, loading };
// 	} catch (err) {
// 		toast.error("something went wrong");
// 		setLoading(false);
// 		console.log(err);
// 	}
// };

// // get all users
// export const useGetAllUsers = () => {
// 	const [loading, setLoading] = useState(false);
// 	const navigate = useNavigate();
// 	const dispatch = useAppDispatch();
// 	try {
// 		const { actor } = useContext(UserContext);

// 		//TODO: check first if user is an admin
// 		const getAllUsers = () => {
// 			setLoading(true);
// 			actor
// 				._getAllUsers()
// 				.then((d) => {
// 					let essays = 0;
// 					let users: UserParams[] = [];
// 					for (let i = 0; i < d.length; i++) {
// 						const user = d[i][1];
// 						users.push({
// 							username: user.userName,
// 							noOfEssays: user.myEssays.length,
// 							noOfNfts: 0,
// 							noOfDispute: 0,
// 						});
// 						essays += d[i][1].myEssays.length;
// 					}
// 					const adminDashboardField = {
// 						totalUsers: d.length,
// 						totalDisputes: 0,
// 						totalEssays: essays,
// 						users: users,
// 					};
// 					dispatch(addAdminData(adminDashboardField));
// 					setLoading(false);
// 					return;
// 				})
// 				.catch((err) => {
// 					setLoading(false);
// 					ErrorHandler(err);
// 				});
// 		};
// 		return { getAllUsers, loading };
// 	} catch (err) {
// 		toast.error("something went wrong");
// 		setLoading(false);
// 		console.log(err);
// 	}
// };

// export const useGetAllNFTsCount = () => {
// 	const [loading, setLoading] = useState(false);
// 	const navigate = useNavigate();
// 	const dispatch = useAppDispatch();
// 	try {
// 		const { actor } = useContext(UserContext);
// 		const getNFTCount = () => {
// 			setLoading(true);
// 			actor
// 				.totalSupplyofNFT()
// 				.then((d) => {
// 					setLoading(false);
// 					dispatch(setNFTValue(Number(d)));
// 					console.log(d);
// 				})
// 				.catch((err) => {
// 					setLoading(false);
// 					ErrorHandler(err);
// 				});
// 		};
// 		return { getNFTCount, loading };
// 	} catch (err) {
// 		ErrorHandler(err);
// 		toast.error("something went wrong");
// 		setLoading(false);
// 		console.log(err);
// 	}
// };
// //admin mint

// //MARKETPLACE FUNCTIONS

// export const useMarketPlaceLists = () => {
// 	const [loading, setLoading] = useState(false);
// 	const navigate = useNavigate();
// 	const dispatch = useAppDispatch();
// 	try {
// 		const { actor } = useContext(UserContext);
// 		const handleMarketPlace = () => {
// 			setLoading(true);
// 			actor
// 				?.mp_viewMarket()
// 				.then((d) => {
// 					let marketPlace: ItemType[] = [];
// 					for (let i = 0; i < d.length; i++) {
// 						const item = d[i];
// 						marketPlace.push({
// 							id: Number(item.itemId),
// 							owner: item.metadata.userEntry[0].userName,
// 							content: item.metadata.content,
// 							title: item.metadata.title,
// 							price: Number(item.price),
// 							listed: item.status.listed,
// 							avatar: item.metadata.userEntry[0].avatar,
// 						});
// 					}

// 					dispatch(clearMarketPlace());
// 					marketPlace.forEach((d) => {
// 						dispatch(addToMarketPlace(d));
// 					});
// 					setLoading(false);
// 					return;
// 				})
// 				.catch((err) => {
// 					setLoading(false);
// 					ErrorHandler(err);
// 				});
// 		};
// 		return { handleMarketPlace, loading };
// 	} catch (err) {
// 		toast.error("something went wrong");
// 		setLoading(false);
// 	}
// };

// export const useListNFTonMarketPlace = () => {
// 	const [loading, setLoading] = useState(false);
// 	const navigate = useNavigate();
// 	const dispatch = useAppDispatch();
// 	try {
// 		const { actor } = useContext(UserContext);
// 		const handleAddToMarketPlace = (nftId: number, price: number) => {
// 			setLoading(true);
// 			actor
// 				?.mp_ListItem(BigInt(nftId), BigInt(price))
// 				.then((d) => {
// 					setLoading(false);
// 					navigate("/marketplace");
// 					toast.success("successfully listed");
// 				})
// 				.catch((err) => {
// 					setLoading(false);
// 					ErrorHandler(err);
// 					console.log(err);
// 				});
// 		};
// 		return { handleAddToMarketPlace, loading };
// 	} catch (err) {
// 		toast.error("something went wrong");
// 		setLoading(false);
// 	}
// };

// export const useGetNFTDetailsMP = () => {
// 	const [loading, setLoading] = useState(false);
// 	const navigate = useNavigate();
// 	const dispatch = useAppDispatch();
// 	try {
// 		const { actor } = useContext(UserContext);
// 		const handleGetDetails = (nftId: string) => {
// 			setLoading(true);
// 			actor
// 				.mp_viewListedNFT(BigInt(nftId))
// 				.then((d: any) => {
// 					console.log("detail", d);
// 					const data = {
// 						id: Number(d.ok.itemId),
// 						owner: d.ok.metadata.userEntry[0].userName,
// 						content: d.ok.metadata.content,
// 						title: d.ok.metadata.title,
// 						price: Number(d.ok.price),
// 						listed: d.ok.status.listed,
// 						avatar: d.ok.metadata.userEntry[0].avatar,
// 					};
// 					// console.log("data", data, d);
// 					dispatch(addMarketPlaceDetail(data));
// 					setLoading(false);
// 				})
// 				.catch((err) => {
// 					ErrorHandler(err);
// 					setLoading(false);
// 				});
// 		};

// 		return { handleGetDetails, loading };
// 	} catch (err) {
// 		toast.error("something went wrong");
// 		setLoading(false);
// 	}
// };

// export const usePurchaseNFT = () => {
// 	const [loading, setLoading] = useState(false);
// 	const navigate = useNavigate();
// 	const dispatch = useAppDispatch();
// 	try {
// 		const { actor } = useContext(UserContext);
// 		const purchaseNFT = (itemId: number) => {
// 			setLoading(true);
// 			actor
// 				.mp_purchaseNFT(BigInt(itemId))
// 				.then((d) => {
// 					toast.success("NFT purchased");
// 					setLoading(false);

// 					navigate("/my-NFTs");
// 				})
// 				.catch((err) => {
// 					setLoading(false);
// 					console.log(err);
// 					ErrorHandler(err);
// 				});
// 		};
// 		return { purchaseNFT, loading };
// 	} catch (err) {
// 		toast.error("something went wrong");
// 		setLoading(false);
// 	}
// };
