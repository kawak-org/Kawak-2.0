import { useContext, useState } from "react";
import { UserContext } from "../context/userContext";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { updateProfile } from "../redux/slice/profileSlice";
import { kawak } from "../../declarations/kawak/index";
import { EssayEntry } from "./types";
import { Result, TokenMetadata } from "../../declarations/kawak/kawak.did";
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
import { setForgeLength } from "../redux/slice/countSlice";
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
        if (!profile || !profile[0]) {
          // User doesn't have a profile yet - this is normal for new MetaMask users
          console.log("User profile not found - user may need to complete onboarding");
          // Set a default profile state to prevent errors
          const defaultData = {
            avatar: "",
            username: "",
            onboarding: false,
            reviewingEssay: 0,
            tokenBalance: 0,
            noOfDrafts: 0,
            noOfEssays: 0,
            isLoading: false,
          };
          dispatch(updateProfile(defaultData));
          return;
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
      }).catch((error) => {
        console.error("Error fetching user profile:", error);
        // Set default profile on error
        const defaultData = {
          avatar: "",
          username: "",
          onboarding: false,
          reviewingEssay: 0,
          tokenBalance: 0,
          noOfDrafts: 0,
          noOfEssays: 0,
          isLoading: false,
        };
        dispatch(updateProfile(defaultData));
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
          const val = data[i];

          var val_: EssayType = {
            id: Number(val.id),
            essayCost: Number(val.essayCost),
            wordCount: Number(val.wordCount),
            owner: val.owner,
            avatar: val.userDetails.avatar,
            reviewed: val.reviewed,
            text: val.text,
            title: val.title,
            reviewTimes: Number(val.reviewTimes),
            public: val._public,
            description: val.description,
            tags: val.topic,
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

export  const useForgeLength = () => {
  const [loading, setLoading] = useState(false);
  const { actor } = useContext(UserContext);
  const dispatch = useAppDispatch();
  try {
    const countForge = async () => {
      setLoading(true);
      const data = await actor?.getAllEssays();
      if (data) {
        dispatch(setForgeLength(data.length))
        setLoading(false);
      }
      setLoading(false);
    };
    return { countForge, loading };
  } catch (err) {
    toast.error("something went wrong");
    setLoading(false);
    console.log(err);
  }
}

export const useGetPaginatedForge = () => {
  const [loading, setLoading] = useState(false);
  const { actor } = useContext(UserContext);
  const dispatch = useAppDispatch();

  try {
    const fetchData = async (pag:number) => {
      setLoading(true)
     const data = await actor?.GetPageEssay(BigInt(pag))
      if (data) {
        console.log("pagination data",data)
        for (let i = 0; i < data.length; i++) {
          const val = data[i];

          var val_: EssayType = {
            id: Number(val.id),
            essayCost: Number(val.essayCost),
            wordCount: Number(val.wordCount),
            owner: val.owner,
            avatar: val.userDetails.avatar,
            reviewed: val.reviewed,
            text: val.text,
            title: val.title,
            reviewTimes: Number(val.reviewTimes),
            public: val._public,
            description: val.description,
            tags: val.topic,
          };
          dispatch(addToForge(val_));
        }
        setLoading(false);
      }
      setLoading(false);

    }


    return {fetchData, loading}
  }
  catch (err) {
    toast.error("something went wrong");
    setLoading(false);
    console.log(err);
  }
}

export const useGetRecentForge = () => {
  const [loading, setLoading] = useState(false);
  const { actor } = useContext(UserContext);
  const dispatch = useAppDispatch();
  const array: EssayType[] = [];
  const newEssays: EssayType[] = [];
  const forge = useAppSelector((state) => state.forge);
  try {
    const fetchData = async (pag:number) => {
      setLoading(true);
      const data = await actor?.GetPageEssay(BigInt(pag));
      // const data = await actor?.getAllEssays()
      if (data) {
        console.log(data);
        for (let i = 0; i < data.length; i++) {
          const val = data[i];
          var val_: EssayType = {
            id: Number(val.id),
            essayCost: Number(val.essayCost),
            wordCount: Number(val.wordCount),
            owner: val.owner,
            reviewed: val.reviewed,
            avatar: val.userDetails.avatar,
            text: val.text,
            title: val.title,
            reviewTimes: Number(val.reviewTimes),
            public: val._public,
            description: val.description,
            tags: val.topic,
          };
          array.push(val_);
        }

        dispatch(clearForge());
        array.forEach((d) => {
          dispatch(addToForge(d));
        });

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

export const useGetMyDrafts = () => {
  const [loading, setLoading] = useState(false);
  const { actor } = useContext(UserContext);
  const dispatch = useAppDispatch();
  try {
    const fetchData = async () => {
      setLoading(true);
      const username = localStorage.getItem("username");
      const data = await actor?.getMyDrafts(username);
      if (data) {
        for (let i = 0; i < data[0].length; i++) {
          const val = data[0][i];
          if (!val) {
            setLoading(false);
            return;
          }
          var val_: DraftType = {
            id: Number(val.id),
            text: val.text,
            title: val.title,
          };
          dispatch(addToMyDraft(val_));
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

export const useGetMyEssays = () => {
  const [loading, setLoading] = useState(false);
  const { actor } = useContext(UserContext);
  const dispatch = useAppDispatch();
  try {
    const fetchData = async () => {
      setLoading(true);
      const username = localStorage.getItem("username");
      const data = await actor?.getUserEssays(username);
      if (data) {
        //   console log data
        console.log(data);
        for (let i = 0; i < data[0].length; i++) {
          const val = data[0][i];
          if (!val) {
            setLoading(false);
            return;
          }
          var val_: EssayType_ = {
            id: Number(val.id),
            essayCost: Number(val.essayCost),
            wordCount: Number(val.wordCount),
            owner: val.owner,
            avatar: val.userDetails.avatar,
            reviewed: val.reviewed,
            text: val.text,
            title: val.title,
            reviewTimes: Number(val.reviewTimes),
            public: val._public,
            description: val.description,
            tags: val.topic,
          };
          dispatch(addToMyEssay(val_));
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

export const useGetAllNFTs = () => {
  const { actor } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  try {
    const handleGetNFTs = () => {
      setLoading(true);
      actor
        ?.nftOwnerTokenMetadata()
        .then((nfts: any) => {
          if (nfts) {
            const nfts_ = nfts["ok"];
            const data_ = [];
            nfts_.map((nft: TokenMetadata) => {
              const { title, token_identifier: id, content } = nft;
              const data = {
                title,
                id: Number(id),
                content,
              };
              data_.push(data);
            });
            dispatch(addAllNFTs(data_));
            setLoading(false);
          }
        })
        .catch((err) => {
          setLoading(false);
          ErrorHandler(err);
          console.log(err);
        });
    };

    return { handleGetNFTs, loading };
  } catch (err) {
    console.log(err);
    toast.error(err || err.message);
  }
};

//MARKETPLACE FUNCTIONS

export const useMarketPlaceLists = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  try {
    const { actor } = useContext(UserContext);
    const handleMarketPlace = () => {
      setLoading(true);
      actor
        ?.ViewMarket()
        .then((d) => {
          let marketPlace: ItemType[] = [];
          for (let i = 0; i < d.length; i++) {
            const item = d[i];
            marketPlace.push({
              id: Number(item.itemId),
              owner: item.metadata.userEntry[0].userName,
              content: item.metadata.content,
              title: item.metadata.title,
              price: Number(item.price),
              listed: item.status.listed,
              avatar: item.metadata.userEntry[0].avatar,
            });
          }

          dispatch(clearMarketPlace());
          marketPlace.forEach((d) => {
            dispatch(addToMarketPlace(d));
          });
          setLoading(false);
          return;
        })
        .catch((err) => {
          setLoading(false);
          ErrorHandler(err);
        });
    };
    return { handleMarketPlace, loading };
  } catch (err) {
    toast.error("something went wrong");
    setLoading(false);
  }
};

export const useListNFTonMarketPlace = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  try {
    const { actor } = useContext(UserContext);
    const handleAddToMarketPlace = (nftId: number, price: number) => {
      setLoading(true);
      actor
        ?.ListItem(BigInt(nftId), BigInt(price))
        .then((d) => {
          setLoading(false);
          navigate("/marketplace");
          toast.success("successfully listed");
        })
        .catch((err) => {
          setLoading(false);
          ErrorHandler(err);
          console.log(err);
        });
    };
    return { handleAddToMarketPlace, loading };
  } catch (err) {
    toast.error("something went wrong");
    setLoading(false);
  }
};

export const useGetNFTDetailsMP = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  try {
    const { actor } = useContext(UserContext);
    const handleGetDetails = (nftId: string) => {
      // setLoading(true);
      // actor
      //   .mp_viewListedNFT(BigInt(nftId))
      //   .then((d: any) => {
      //     console.log("detail", d);
      //     const data = {
      //       id: Number(d.ok.itemId),
      //       owner: d.ok.metadata.userEntry[0].userName,
      //       content: d.ok.metadata.content,
      //       title: d.ok.metadata.title,
      //       price: Number(d.ok.price),
      //       listed: d.ok.status.listed,
      //       avatar: d.ok.metadata.userEntry[0].avatar,
      //     };
      //     // console.log("data", data, d);
      //     dispatch(addMarketPlaceDetail(data));
      //     setLoading(false);
      //   })
      //   .catch((err) => {
      //     ErrorHandler(err);
      //     setLoading(false);
      //   });
    };

    return { handleGetDetails, loading };
  } catch (err) {
    toast.error("something went wrong");
    setLoading(false);
  }
};

//SEARCH

export const useFilterEssay = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  try {
    const { actor } = useContext(UserContext);
    const handleFilterEssay = (text: [string]) => {
      setLoading(true);
      actor
        ?.getFilteredEssays(text)
        .then((d) => {
          console.log(d);
          // let marketPlace: ItemType[] = [];
          // for (let i = 0; i < d.length; i++) {
          // 	const item = d[i];
          // 	marketPlace.push({
          // 		id: Number(item.itemId),
          // 		owner: item.metadata.userEntry[0].userName,
          // 		content: item.metadata.content,
          // 		title: item.metadata.title,
          // 		price: Number(item.price),
          // 		listed: item.status.listed,
          // 		avatar: item.metadata.userEntry[0].avatar,
          // 	});
          // }

          // dispatch(clearMarketPlace());
          // marketPlace.forEach((d) => {
          // 	dispatch(addToMarketPlace(d));
          // });
          setLoading(false);
          return;
        })
        .catch((err) => {
          setLoading(false);
          ErrorHandler(err);
        });
    };
    return { handleFilterEssay, loading };
  } catch (err) {
    toast.error("something went wrong");
    setLoading(false);
  }
};

export const useCreateProfile = () => {
  const { actor } = useContext(UserContext);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const createProfile = async (username: string, avatar: string) => {
    try {
      setLoading(true);
      const result = await actor?.createProfile(username, avatar);
      if (result && 'ok' in result) {
        toast.success("Profile created successfully!");
        // Refresh profile data
        const profile = await actor?.getUser();
        if (profile && profile[0]) {
          const {
            userName,
            myEssays,
            myDrafts,
            token_balance,
            reviewingEssay,
            onBoarding,
            avatar: userAvatar,
          } = profile[0];
          const data = {
            avatar: userAvatar,
            username: userName,
            onboarding: onBoarding,
            reviewingEssay: Number(reviewingEssay),
            tokenBalance: Number(token_balance),
            noOfDrafts: myDrafts.length,
            noOfEssays: myEssays.length,
            isLoading: false,
          };
          dispatch(updateProfile(data));
        }
        setLoading(false);
        return true;
      } else {
        toast.error("Failed to create profile");
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      toast.error("Error creating profile");
      setLoading(false);
      return false;
    }
  };

  return { createProfile, loading };
};

// EssayCoin functions
export const useCreateEssayCoin = () => {
  const { actor } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const createEssayCoin = async (
    essayID: number,
    contract_address: string,
    name: string,
    symbol: string,
    total_supply: number,
    metadata: string
  ) => {
    setLoading(true);
    try {
      const currentTime = Math.floor(Date.now() / 1000); // Current timestamp in seconds
      console.log('Creating EssayCoin in backend:', {
        essayID,
        contract_address,
        name,
        symbol,
        total_supply,
        metadata,
        currentTime
      });
      
      await actor?.createEssayCoin(
        BigInt(essayID),
        contract_address,
        name,
        symbol,
        BigInt(total_supply),
        metadata,
        BigInt(currentTime)
      );
      
      console.log("✅ EssayCoin saved to backend successfully");
      toast.success("EssayCoin created and saved successfully!");
      setLoading(false);
      return true;
    } catch (error) {
      console.error("Error creating EssayCoin:", error);
      toast.error("Failed to create EssayCoin");
      setLoading(false);
      return false;
    }
  };

  return { createEssayCoin, loading };
};

export const useGetEssayCoin = () => {
  const { actor } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const getEssayCoin = async (essayID: number) => {
    setLoading(true);
    try {
      const essayCoin = await actor?.getEssayCoin(BigInt(essayID));
      setLoading(false);
      return essayCoin;
    } catch (error) {
      console.error("Error fetching EssayCoin:", error);
      setLoading(false);
      return null;
    }
  };

  return { getEssayCoin, loading };
};

export const useGetAllEssayCoins = () => {
  const { actor } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const getAllEssayCoins = async () => {
    setLoading(true);
    try {
      const essayCoins = await actor?.getEssayCoins();
      setLoading(false);
      return essayCoins || [];
    } catch (error) {
      console.error("Error fetching all EssayCoins:", error);
      setLoading(false);
      return [];
    }
  };

  return { getAllEssayCoins, loading };
};

export const useGetOwnerEssayCoins = () => {
  const { actor } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const getOwnerEssayCoins = async (owner: Principal) => {
    setLoading(true);
    try {
      const essayCoins = await actor?.getOwnerEssayCoins(owner);
      setLoading(false);
      return essayCoins || [];
    } catch (error) {
      console.error("Error fetching owner EssayCoins:", error);
      setLoading(false);
      return [];
    }
  };

  return { getOwnerEssayCoins, loading };
};

export const useEssayIsCoin = () => {
  const { actor } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const essayIsCoin = async (essayID: number): Promise<boolean> => {
    setLoading(true);
    try {
      const result = await actor?.essayIsCoin(BigInt(essayID));
      setLoading(false);
      return !!result;
    } catch (error) {
      console.error("Error checking if essay is coin:", error);
      setLoading(false);
      return false;
    }
  };

  return { essayIsCoin, loading };
};
