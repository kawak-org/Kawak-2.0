import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { convert } from "html-to-text";
import { ChatIcon, TrashIcon } from "@heroicons/react/solid";
import toast from "react-hot-toast";
import StarsRatings from "react-star-ratings";
import { UserContext } from "../../context/userContext";
// import Popup from "../shared/Popup";
import { Principal } from "@dfinity/principal";
import ReviewCommentEditor from "../../src/RichText/ReviewCommentEditor/ReviewCommentEditor";
import MintEssayModal from "../mint/MintEssayModal";
import Navbar from "../../components/shared/navbar/Navbar";
import LexicalRichTextEditor from "../../src/RichText/LexicalRichTextEditor";
import { BiArrowBack } from "react-icons/bi";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import Loader from "../Loaders/Loader";
import { Carousel } from "react-responsive-carousel";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import {
  addAnnotation,
  clearAnnotation,
} from "../../redux/slice/annotationSlice";
// import CustomPrompt from "../../utils/navigation-block/CustomPrompt";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ShowComment from "./ShowComment";
import FeedbackModal from "../../components/Modal/FeedbackModal";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import {
  setEssayVisibility,
  setReviewVisibility,
} from "../../redux/slice/myEssayDetailsSlice";

type ReviewType = {
  id: number;
  user: Principal;
  quote: string;
  comments: string;
  rated: boolean;
};

const MyEssayDetails = () => {
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const value = [];
  const [review, setReview] = useState<[ReviewType]>([null]);
  const [isLoading2, setIsLoading2] = useState(true);
  const { id } = useParams();
  const [rating, setRating] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [essay, setEssay] = useState(null);
  const { actor } = useContext(UserContext);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [rateModal, setRateModal] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [reviewId, setReviewId] = useState(null);
  const annotations = useAppSelector((state) => state.annotation);
  const dispatch = useAppDispatch();
  const [annotationPosition, setAnnotationPosition] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [disabled_, setDisabled_] = useState(false);
  // const [visibility, setVisibility] = useState(false);
  const [reviewStatus, setReviewStatus] = useState(true);
  const myEssay = useAppSelector((state) => state.myEssayDetailsSlice);
  // const [openComment, setOpenComment] = useState(false);
  // var unserialized:any =  annotations[annotationPosition] == null ? undefined : JSON.parse(annotations[annotationPosition]?.quote);
  var unserialized: any =
    annotations[annotationPosition] == null
      ? undefined
      : JSON.parse(annotations[annotationPosition]?.quote);

  console.log(typeof unserialized);

  // console.log("unserialized", unserialized, "annotation", annotations);
  const { trackEvent } = useMatomo();

  // const { deleting, handleDelete } = deleteEssay(BigInt(id));
  const handleDelete = () => {
    setDeleting(true);
    actor
      .DeleteEssay(BigInt(id))
      .then((d) => {
        setDeleting(false);
        toast.success("Essay Deleted");
        navigate("/my-essay");
      })
      .catch((err) => {
        toast.error("something went wrong, could not delete essay");
      });
  };
  useEffect(() => {
    const callOnMount = () => {
      actor
        ?.getessay(BigInt(id))
        .then((d) => {
          if (d) {
            value.push(d[0]);
            setEssay(value);
            dispatch(setEssayVisibility(value[0]._public));
            // setVisibility(value[0]._public);
            // console.log(value)
            const rev: [ReviewType] = [null];
            // console.log(d)
            dispatch(clearAnnotation());
            const dd = d[0]?.reviews.map((review) => {
              const val = {
                id: Number(review.id),
                user: review.user,
                quote: review.quote,
                comments: review.comments,
                rated: review.rated,
              };

              dispatch(addAnnotation(val));
            });
            setIsLoading2(false);
            setReview(rev);
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("could not get an essay with this id");
        });
    };

    const getReviewStatus = () => {
      actor
        ?.GetReviewStatus(BigInt(id))
        .then((d) => {
          if (d.length === 0) {
            return;
          }
          // else {
          console.log("review status", d);
          dispatch(setReviewVisibility(d[0].status));
          // setReviewStatus(d[0].status);
          // }
        })
        .catch((err) => {
          console.log(err);
          // toast.error(err)
        });
    };
    callOnMount();
    getReviewStatus();
  }, []);

  const ratingChanged = (val: number) => {
    setRating(val);
    setTimeout(() => {
      setOpenModal(true);
    }, 500);
  };

  // const submitRating = () => {
  //   setModalLoading(true);
  //   console.log("id: ", id, "Rating:", rating);
  //   console.log("Annotation:", annotations[annotationPosition]?.id);
  //   actor
  //     .AddRatingNow(
  //       BigInt(id),
  //       BigInt(annotations[annotationPosition]?.id),
  //       BigInt(rating) /* annotations[annotationPosition]?.user */
  //     )
  //     // actor.AddRating(BigInt(id), BigInt(annotations[annotationPosition]?.id), BigInt(rating)/* , annotations[annotationPosition]?.user */)
  //     .then((data) => {
  //       console.log("add rating result: ", data);
  //       toast.success("User's rating successfully added");
  //       setModalLoading(false);
  //       navigate(-1);
  //     })
  //     .catch((err) => {
  //       console.log("Error message: ", err);
  //       setModalLoading(false);
  //       toast.error(err);
  //     });
  // };

  const submitRating = async () => {
    setModalLoading(true);
    try {
      console.log("id: ", id, "Rating:", rating);
      console.log("Annotation:", annotations[annotationPosition]?.id);
      const data = await actor.AddRatingNow(
        BigInt(id),
        BigInt(annotations[annotationPosition]?.id),
        BigInt(rating)
      );
      console.log("add rating result: ", data);
      toast.success("User's rating successfully added");
      setModalLoading(false);
      navigate(-1);
    } catch (err) {
      console.error("Error message: ", err);
      setModalLoading(false);
      toast.error(err.message || "An error occurred");
    }
  };

  const handleCarouselChange = (index: number) => {
    setAnnotationPosition(index);
  };

  const handleSetVisibility = (e: any) => {
    setDisabled(true);
    actor
      .updatePublicStatus(e.target.checked, BigInt(id))
      .then((d) => {
        setDisabled(false);
        dispatch(setEssayVisibility(!myEssay.visibility.essay));
      })
      .catch((err) => {
        setDisabled(false);
        console.log(err);
      });
  };

  const handleSetReviewVisibility = (e: any) => {
    setDisabled_(true);
    actor
      .SetReviewStatus(BigInt(id), e.target.checked)
      .then((d) => {
        setDisabled_(false);
        dispatch(setReviewVisibility(!myEssay.visibility.review));
      })
      .catch((err) => {
        setDisabled_(false);
        console.log(err);
      });
  };

  if (isLoading2) {
    return (
      <div>
        <Navbar />
        <div className=" w-full h-screen flex m-auto justify-center items-center mt-[3rem]">
          <Loader />
        </div>
      </div>
    );
  } else if (value) {
    return (
      <div className="">
        <Navbar />
        <div className="relative px-6 mb-8 mt-[6rem]">
          <div className="flex flex-col">
            <div className="mx-4 sm:ml-16 ">
              <div className="flex flex-row gap-6 relative">
                <div className="xl:mr-16 w-full lg:w-[72%]  mt-8  ">
                  <div
                    onClick={() => navigate(-1)}
                    className="flex flex-row absolute left-[-1.5rem] sm:left-[-3rem] top-[-.2rem] items-center cursor-pointer"
                  >
                    <BiArrowBack className="text-sm dark:text-white" />
                    <p className="text-[#08172E] dark:text-white text-lg font-semibold ml-4 ">
                      Back
                    </p>
                  </div>
                  <h2 className="justify-center dark:text-white m-auto text-3xl font-bold mt-4">
                    {essay[0].title}
                  </h2>
                  <div className="border-b-[1px] bg-gray-400 mt-3 mb-7" />
                  {annotations?.length < 1 ? (
                    <div>
                      <LexicalRichTextEditor essay={essay[0].text} />
                      <div className="w-full flex justify-center items-center">
                        <p className="my-4 py-2 p-4 sm:p-4 w-fit dark:bg-[#323f4b] dark:text-white/80 bg-[#08172E33]/20 text-[#08172E]">
                          No one has annotated on your essay yet
                        </p>
                      </div>
                    </div>
                  ) : (
                    <Carousel
                      showArrows={true}
                      onChange={(e) => handleCarouselChange(e)}
                    >
                      {annotations?.map((review_) => (
                        <ReviewCommentEditor
                          key={review_.comments}
                          review={review_.comments}
                        />
                      ))}
                    </Carousel>
                  )}
                </div>
                {/* for mobile view */}
                {/* ----------------BEGINNING OF MOBILE-------------------------- */}

                <button
                  onClick={() => setShowComment(!showComment)}
                  className="py-2 fixed dark:bg-[#627D98] dark:hover:bg-[#9AA5B1] dark:hover:text-white  top-[4.7rem] sm:top-[4.5rem] lg:hidden right-[1rem] px-8 text-white  bg-[#F98E2D] cursor-pointer"
                >
                  Comment
                </button>

                {showComment && (
                  <ShowComment
                    annotationPosition={annotationPosition}
                    setRateModal={setRateModal}
                    setShowComment={setShowComment}
                    essay={essay}
                    setModalIsOpen={setModalIsOpen}
                    handleDelete={handleDelete}
                    deleting={deleting}
                    unserialized={unserialized}
                    rateModal={rateModal}
                    ratingChanged={ratingChanged}
                    submitRating={submitRating}
                    rating={rating}
                  />
                )}
                {/* ----------------END OF MOBILE-------------------------- */}

                {annotations?.length < 1 ? (
                  <div className="dark:bg-[#323f4b] bg-[#F98E2D]/10 rounded-[10px] hidden lg:flex flex-col h-[37rem] w-[25%] py-8 px-4 mt-[.4rem] ">
                    <div className="flex bg-[#F98E2D]x flex-col">
                      <div className="flex flex-row justify-end items-center ">
                        <div className="flex flex-row justify-center items-center">
                          <img
                            src={`wood-log.png`}
                            className="w-[2rem]"
                            alt="token"
                          />
                          <p className="text-[#2F6FED] ml-1 text-base">3</p>
                        </div>
                      </div>

                      <div className="border-b-[1px] bg-gray-400 my-2" />

                      {myEssay && (
                        <div className="flex flex-col gap-4 py-4 ">
                          <div className="flex flex-row gap-4 justify-start items-center ">
                            <p className="dark:text-white text-black pr-1">
                              Essay visibility
                            </p>
                            <Toggle
                              checked={myEssay.visibility?.essay}
                              onChange={(e) => handleSetVisibility(e)}
                              disabled={disabled}
                            />
                          </div>

                          <div className="flex flex-row gap-4  justify-start items-center">
                            <p className="dark:text-white text-black ">
                              Comment visibility
                            </p>
                            <Toggle
                              checked={myEssay.visibility?.review}
                              onChange={(e) => handleSetReviewVisibility(e)}
                              disabled={disabled_}
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex flex-row justify-between items-center ">
                        <p className="text-gray-400 text-xs">
                          {Number(essay[0].wordCount)} words
                        </p>
                        <p className="text-[#EF4444]  text-sm font-medium ">
                          Not Reviewed
                        </p>
                      </div>
                    </div>
                    <div className="w-full flex  flex-col  my-4">
                      <button
                        className="py-2 w-full text-sm text-center my-2 text-white bg-[#F98E2D] "
                        onClick={() => setModalIsOpen(true)}
                      >
                        Mint
                      </button>

                      {modalIsOpen && (
                        <MintEssayModal
                          body={convert(essay[0].text)}
                          title={essay[0].title}
                          Modal={setModalIsOpen}
                        />
                      )}
                      <button
                        className="py-2 w-full text-sm text-center my-2 text-[#B91C1C]  "
                        onClick={handleDelete}
                      >
                        {deleting ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="dark:bg-[#323f4b] bg-[#F98E2D]/10 rounded-[10px] hidden lg:flex flex-col h-[37rem] w-[25%] py-8 px-4 mt-[.4rem] ">
                    {/* <div className="flebg-[#F98E2D]x flex-col">
                      <div className="flex flex-row justify-between items-center ">
                        <div className="flex flex-row"></div>

                        <div className="flex flex-row justify-center items-center">
                          <img src={`token-icon.png`} alt="token" />
                          <p className="text-[#2F6FED] ml-1 text-base">
                            {" "}
                            {Number(essay[0].essayCost)}
                          </p>
                        </div>
                      </div>

                      <div className="border-b-[1px] bg-gray-400 my-2" />

                      <div className="flex flex-row justify-between items-center ">
                        <p className="text-gray-400 text-xs">
                          {Number(essay[0].wordCount)} words
                        </p>
                        <p className="text-[#08875D]  text-sm font-medium ">
                          Reviewed
                        </p>
                      </div>
                    </div> */}
                    <div className="flex bg-[#F98E2D]x flex-col">
                      <div className="flex flex-row justify-end items-center ">
                        <div className="flex flex-row justify-center items-center">
                          <img
                            src={`wood-log.png`}
                            className="w-[2rem]"
                            alt="token"
                          />
                          <p className="text-[#2F6FED] ml-1 text-base">3</p>
                        </div>
                      </div>

                      <div className="border-b-[1px] bg-gray-400 my-2" />

                      {myEssay && (
                        <div className="flex flex-col gap-4 py-4 ">
                          <div className="flex flex-row gap-4 justify-start items-center ">
                            <p className="dark:text-white text-black pr-1">
                              Essay Visibility
                            </p>
                            <Toggle
                              checked={myEssay.visibility?.essay}
                              onChange={(e) => handleSetVisibility(e)}
                              disabled={disabled}
                            />
                          </div>

                          <div className="flex flex-row gap-4  justify-start items-center">
                            <p className="dark:text-white text-black ">
                              Review Visibility
                            </p>
                            <Toggle
                              checked={myEssay.visibility?.review}
                              onChange={(e) => handleSetReviewVisibility(e)}
                              disabled={disabled_}
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex flex-row justify-between items-center ">
                        <p className="text-gray-400 text-xs">
                          {Number(essay[0].wordCount)} words
                        </p>
                        <p className="text-[#EF4444]  text-sm font-medium ">
                          Reviewed
                        </p>
                      </div>
                    </div>

                    <div className=" comment-scroll mt-3 overflow-y-scroll h-[20rem]">
                      {typeof unserialized === "object" ? (
                        unserialized?.map((item) => {
                          return (
                            <div
                              key={item.id}
                              className="flex flex-col p-2 my-3 bg-white"
                            >
                              <p className="mt-1 font-medium rounded-md w-fit text-sm px-2 bg-[#FFFF00]/10">
                                {item.quote}
                              </p>

                              <p className="text-sm mt-2 ">
                                {item.comments[0].content}
                              </p>
                            </div>
                          );
                        })
                      ) : (
                        <></>
                      )}
                    </div>

                    <button
                      className="py-2 w-full text-sm text-center mt-8 mb-4 text-white bg-[#F98E2D] "
                      onClick={() => setModalIsOpen(true)}
                    >
                      Mint
                    </button>

                    {annotations[annotationPosition]?.rated === false ? (
                      <button
                        className="py-2 w-full text-sm text-center mt-4 mb-4 text-white bg-[#F98E2D] "
                        onClick={() => setRateModal(true)}
                      >
                        Rate Review
                      </button>
                    ) : (
                      <></>
                    )}

                    {modalIsOpen && (
                      <MintEssayModal
                        body={convert(essay[0].text)}
                        title={essay[0].title}
                        Modal={setModalIsOpen}
                      />
                    )}

                    {rateModal && (
                      <FeedbackModal
                        rating={rating}
                        ratingChanged={ratingChanged}
                        submitRating={submitRating}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex justify-center items-center text-blue-300 font-semibold text-lg mt-5">
        could not find essay with such id
      </div>
    );
  }
};

export default MyEssayDetails;
