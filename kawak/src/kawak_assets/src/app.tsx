import React, { useEffect, useContext, useState, lazy, Suspense } from "react";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import HomePage from "../pages/HomePage";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AuthClient } from "@dfinity/auth-client";
import { UserContext } from "../context/userContext";
import toast from "react-hot-toast";
import { steps, tourOptions } from "../constants/shepard/index";
import { ShepherdTour } from "react-shepherd";
import Loader from "../components/Loaders/Loader";


const Onboarding = lazy(() => import("../pages/Onboard/Onboarding"));
const Onboarding1 = lazy(() => import("../pages/Onboard/Onboarding1"));
const Onboarding2 = lazy(() => import("../pages/Onboard/Onboarding2"));
const Onboarding3 = lazy(() => import("../pages/Onboard/Onboarding3"));
const CraftEssay = lazy(() => import("../pages/CraftEssay"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const MyEssayDetails = lazy(() => import('../components/essay/MyEssayDetails'));
const MyEssays = lazy(()=> import('../pages/MyEssays'));
const AllEssays = lazy(()=> import('../components/essay/AllEssays'));
const ReviewedEssay = lazy(()=> import('../components/essay/ReviewedEssay'));
const NotReviewedEssay = lazy(()=> import('../components/essay/NotReviewedEssay'));
const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("../pages/TermsAndConditions"));
const NftDetails = lazy(() => import("../pages/NftDetails"));
const Admin = lazy(() => import("../components/Admin"));
const AdminNavbar  = lazy(() => import("../pages/Admin/AdminNavbar"));
const AdminDashboard = lazy(() => import("../pages/Admin/AdminDashboard"));
const AllUser = lazy(() => import("../pages/Admin/AllUser"));
const EssayDetails = lazy(() => import("../components/essay/EssayDetails"));
const Profile = lazy(() => import("../pages/User/Profile"));
const Draft = lazy(() => import("../components/essay/Draft/Draft"));
const DraftDetails  = lazy(() => import("../components/essay/Draft/DraftDetails"));
const AllMintedEssays = lazy(() => import("../pages/User/MintedEssays/AllMintedEssays"));
const MarketPlace = lazy(() => import("../pages/MarketPlace"));
const MarketplaceEssayView = lazy(() => import("../pages/MarketplaceEssayView"));

export default function App() {
    const location = useLocation();

    const { enableLinkTracking } = useMatomo();

    enableLinkTracking();

    const { handleAuthenticated, setIIAuth } = useContext(UserContext);
    const navigate = useNavigate();
    const [actorRestated, setActorRestated] = useState<boolean>(false);

    useEffect(() => {
        const runOnMounth = async () => {
            const authClient = await AuthClient.create();
            if (await authClient.isAuthenticated()) {
                // setTour(tour_);
                handleAuthenticated(authClient);
                if (location.pathname === "/") {
                    console.log("kawak", location.pathname);
                    navigate("/forge");
                }
                setIIAuth(true);
                setActorRestated(true);
            } else {
                toast.error("you must log in");
                navigate("/");
            }
        };

        runOnMounth();
    }, []);

    if (actorRestated) {
        return (
            <React.Fragment>
                <ShepherdTour steps={steps} tourOptions={tourOptions}>
                    <Suspense
                        fallback={
                            <div className='flex w-full h-screen justify-center items-center'>
                                <Loader />
                            </div>
                        }
                    >
                        <Routes>
                            <Route path='/' element={<HomePage />} />
                            <Route path='forge/*' element={<Dashboard />} />
							<Route path='forge/:id' element={<EssayDetails />} />
							<Route path='profile' element={<Profile />} />
							<Route path='my-essay' element={<MyEssays />}>
								<Route index element={<AllEssays />} />
								<Route path='all-essays' element={<AllEssays />} />
								<Route path='reviewed-essay' element={<ReviewedEssay />} />
								<Route
									path='not-reviewed-essay'
									element={<NotReviewedEssay />}
								/>
								<Route path='draft' element={<Draft />} />
							</Route>
							<Route path='my-essay/:id' element={<MyEssayDetails />} />
							<Route path='my-essay/draft/:id' element={<DraftDetails />} />
							<Route path='my-NFTs' element={<AllMintedEssays />} />
							<Route path='marketplace' element={<MarketPlace />} />
							<Route path='nft-details' element={<NftDetails />} />
							<Route
								path='marketplace-essay-view/:id'
								element={<MarketplaceEssayView />}
							/>
							<Route path='craft' element={<CraftEssay />} />
							<Route path='onboarding' element={<Onboarding />} />
							<Route path='aadjf0afu8au38afu380b0' element={<Admin />} />
							{/* <Route path='adminloginpage' element={<AdminLoginPage />} /> */}
						{/* <Route path='admindashboard' element={<AdminDashboard />} /> */}
						{/* <Route path='allusersonboarding' element={<AllUser />} />  */}
							<Route path='onboarding1' element={<Onboarding1 />} />
							<Route path='onboarding2' element={<Onboarding2 />} />
							<Route path='onboarding3' element={<Onboarding3 />} />
							<Route path='privacy-policy' element={<PrivacyPolicy />} />
							<Route path='admin' element={<AdminNavbar />}>
								<Route index element={<AdminDashboard />} />
								<Route path='all-users' element={<AllUser />} />
							</Route>
							<Route
								path='terms-and-conditions'
								element={<TermsAndConditions />}
							/>
                        </Routes>
                    </Suspense>
                </ShepherdTour>
            </React.Fragment>
        );
    } else {
        return (
            <React.Fragment>
                <main className=''>
                    <Routes>
                        <Route path='/' element={<HomePage />} />
                    </Routes>
                </main>
            </React.Fragment>
        );
    }
}