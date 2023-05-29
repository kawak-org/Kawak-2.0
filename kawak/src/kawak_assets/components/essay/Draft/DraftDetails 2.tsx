import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../../context/userContext";
import toast from "react-hot-toast";
import { convertFromRaw } from "draft-js";
import { useNavigate } from "react-router-dom";
import LexicalRichTextEditor from "../../../src/RichText/LexicalRichTextEditor";
import AddCommentEditor from "../../../src/RichText/AddComment/AddCommentEditor";
import { useAppDispatch } from "../../../redux/hooks";
import { setEssayToReviewed } from "../../../redux/slice/forgeEssaySlice";
import { setMyEssayToReviewed } from "../../../redux/slice/myEssaySlice";
import Navbar from "../../../components/shared/navbar/Navbar";
import { BiArrowBack } from "react-icons/bi";
import { EssayEditorContext } from "../../../context/EssayEditorContext";
import { removeFromDraft } from "../../../redux/slice/draftSlice";
import { setEssayCount } from "../../../redux/slice/countSlice";

const DraftDetails = () => {
	const { actor } = useContext(UserContext);
	const {
		setEditingDraftId,
		handleChange,
		setTitle,
		convertHTMLtoEditorContent,
	} = useContext(EssayEditorContext);
	const value = [];
	const [isLoading2, setIsLoading2] = useState(true);
	const [essay, setEssay] = useState(null);
	const [added, setAdded] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoading3, setIsLoading3] = useState(false);
	const [noEssay, setNoEssay] = useState(true);
	// const [data, setData] = useState<string>('')
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const { id }: any = useParams();

	let HighlightEssay: string = "";
	let annotation: string = "";

	const handleClick = async () => {
		setIsLoading3(true);
		// actor
		// 	.addReviewingEssay(BigInt(id))
		// 	.then((d) => {
		// 		if (d) {
		// 			setIsLoading3(false);
		// 			return setAdded(true);
		// 		}
		// 		setIsLoading3(false);
		// 		toast.error("something went wrong");
		// 	})
		// 	.catch((err) => {
		// 		setIsLoading3(false);
		// 		alert(err);
		// 		return;
		// 	});
	};

	const handleSubmit = () => {
		setIsLoading(true);
		// actor
		// 	?.submittReviewedEssay(BigInt(id), HighlightEssay, annotation)
		// 	.then((res) => {
		// 		setIsLoading(false);
		// 		dispatch(setEssayToReviewed(+id));
		// 		dispatch(setMyEssayToReviewed(+id));
		// 		toast.success("Annotation Submitted");
		// 		navigate(-1);
		// 	})
		// 	.catch((err) => {
		// 		setIsLoading(false);
		// 		toast.error("something went wrong");
		// 	});
	};

	useEffect(() => {
		const callOnMount = () => {
			// actor
			// 	.getDraft(BigInt(id))
			// 	.then((d) => {
			// 		if (d) {
			// 			value.push(d[0]);
			// 			setEssay(value);
			// 			setIsLoading2(false);
			// 			return;
			// 		}
			// 		setNoEssay(true);
			// 		setIsLoading2(false);
			// 		return null;
			// 	})
			// 	.catch(() => {
			// 		toast.error("could not get an essay with this id");
			// 	});
		};
		callOnMount();
	}, []);

	const handleEditDraft = () => {
		setEditingDraftId(id);
		// const text = convertFromRaw(essay[0].text);
		// handleChange(text)
		convertHTMLtoEditorContent(essay[0].text);
		setTitle(essay[0].title);
		dispatch(setEssayCount());
		navigate("/craft");
	};

	const handleDeleteDraft = () => {
		setDeleting(true);
		actor
			.deleteDraft(BigInt(id))
			.then(() => {
				setDeleting(false);
				dispatch(removeFromDraft(id));
				toast.success("Removed from Draft");
				navigate(-1);
			})
			.catch((err) => {
				setDeleting(false);
				toast.error("could not delete essay");
			});
	};

	if (isLoading2) {
		return (
			<div>
				<Navbar />
				<div className='className=" w-full h-screen flex m-auto justify-center items-center mt-[5rem] '>
					<img
						src={`logo.png`}
						alt=''
						className=' animate-pulse mr-12 text-8xl '
					/>
				</div>
			</div>
		);
	} else if (isLoading2 && noEssay) {
		return (
			<div className='flex justify-center items-center text-blue-300 font-semibold text-lg mt-5'>
				could not find draft with such id
			</div>
		);
	} else {
		return (
			<div>
				<Navbar />
				<div className='relative px-6 mb-8 mt-[6rem]'>
					<div className='flex flex-col'>
						<div className='mx-4 sm:ml-16 '>
							<div className='flex flex-row gap-6 relative'>
								<div className=' flex flex-col xl:mr-16 w-full lg:w-[72%]  mt-8 '>
									<div
										onClick={() => navigate(-1)}
										className='flex flex-row absolute left-[-1.5rem] sm:left-[-3rem] top-[-.2rem] items-center cursor-pointer'
									>
										<BiArrowBack className='text-sm' />
										<p className='text-[#08172E] text-lg font-semibold ml-4 '>
											Back
										</p>
									</div>
									<div className='flex flex-row justify-end mr-[-2rem] lg:hidden'>
										<div className='flex flex-row justify-end my-4 top[-.2rem]  cursor-pointer'>
											<button
												className='craft-Essay ml-5 text-xs text-black border-[1px]'
												onClick={handleEditDraft}
											>
												Edit Draft
											</button>
											<button
												className='craft-Essay ml-5 text-white text-xs bg-[#EF4444]'
												onClick={handleDeleteDraft}
											>
												{deleting ? "deleting" : "Delete Draft"}
											</button>
										</div>
									</div>

									<h2 className='justify-center text-3xl font-bold mt-4'>
										{essay[0].title}
									</h2>
									<div className='border-b-2 bg-gray-400 mt-3 mb-7' />
									<LexicalRichTextEditor essay={essay[0].text} />
								</div>

								{/* Right Hand Side */}

								<div className='bg-[#F98E2D]/10 rounded-[10px] hidden lg:block h-[90vh] w-[28%] py-8 px-8 mt-[1rem] relative'>
									<div className='flebg-[#F98E2D]x flex-col '>
										<div className='flex flex-row justify-between items-center '>
											<p className='text-gray-400 text-xs'>
												{/* {Number(essay[0].wordCount)} words */}
											</p>
											<p className='text-gray-400 text-xs'>Draft</p>
										</div>

										{/* Edit Draft Button */}
										<div className='flex-col absolute inset-x-0 bottom-2  gap-5'>
											<button
												className='w-full py-3  rounded-sm px-2 text-xs text-white bg-[#08172E]'
												onClick={handleEditDraft}
											>
												Edit Draft
											</button>
											{/* Delete Draft Button */}
											<button
												className='py-2 px-3 rounded-sm text-xs text-black w-full'
												onClick={handleDeleteDraft}
											>
												{deleting ? "deleting" : "Delete Draft"}
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
};

export default DraftDetails;
