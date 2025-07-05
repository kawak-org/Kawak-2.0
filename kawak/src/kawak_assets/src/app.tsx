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
import AuthGuard from "../components/AuthGuard";

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
const SignatureTest = lazy(() => import("../components/SignatureTest"));

export default function App() {
    const location = useLocation();

    const { enableLinkTracking } = useMatomo();

    enableLinkTracking();

    const { handleAuthenticated, setIIAuth, isAuthenticated, actor } = useContext(UserContext);
    const navigate = useNavigate();
    const [actorRestated, setActorRestated] = useState<boolean>(false);

    useEffect(() => {
        const runOnMount = async () => {
            try {
                const authClient = await AuthClient.create();
                const isUserAuthenticated = await authClient.isAuthenticated();
                
                if (isUserAuthenticated) {
                    handleAuthenticated(authClient);
                    if (location.pathname === "/") {
                        console.log("kawak", location.pathname);
                        navigate("/forge");
                    }
                    setIIAuth(true);
                    setActorRestated(true);
                } else {
                    // Check if user is authenticated via MetaMask
                    if (isAuthenticated && actor) {
                        setActorRestated(true);
                        if (location.pathname === "/") {
                            navigate("/forge");
                        }
                    } else if (location.pathname !== "/") {
                        toast.error("You must log in");
                        navigate("/");
                    }
                }
            } catch (error) {
                console.error("Authentication check failed:", error);
                // Check if user is authenticated via MetaMask even if II fails
                if (isAuthenticated && actor) {
                    setActorRestated(true);
                    if (location.pathname === "/") {
                        navigate("/forge");
                    }
                } else if (location.pathname !== "/") {
                    toast.error("Authentication error");
                    navigate("/");
                }
            }
        };

        runOnMount();
    }, [location.pathname, isAuthenticated, actor]);

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
                            <Route path='forge/*' element={
                                <AuthGuard>
                                    <Dashboard />
                                </AuthGuard>
                            } />
							<Route path='forge/:id' element={
                                <AuthGuard>
                                    <EssayDetails />
                                </AuthGuard>
                            } />
							<Route path='profile' element={
                                <AuthGuard>
                                    <Profile />
                                </AuthGuard>
                            } />
							<Route path='my-essay' element={
                                <AuthGuard>
                                    <MyEssays />
                                </AuthGuard>
                            }>
								<Route index element={<AllEssays />} />
								<Route path='all-essays' element={<AllEssays />} />
								<Route path='reviewed-essay' element={<ReviewedEssay />} />
								<Route
									path='not-reviewed-essay'
									element={<NotReviewedEssay />}
								/>
								<Route path='draft' element={<Draft />} />
							</Route>
							<Route path='my-essay/:id' element={
                                <AuthGuard>
                                    <MyEssayDetails />
                                </AuthGuard>
                            } />
							<Route path='my-essay/draft/:id' element={
                                <AuthGuard>
                                    <DraftDetails />
                                </AuthGuard>
                            } />
							<Route path='my-NFTs' element={
                                <AuthGuard>
                                    <AllMintedEssays />
                                </AuthGuard>
                            } />
							<Route path='marketplace' element={
                                <AuthGuard>
                                    <MarketPlace />
                                </AuthGuard>
                            } />
							<Route path='nft-details' element={
                                <AuthGuard>
                                    <NftDetails />
                                </AuthGuard>
                            } />
							<Route
								path='marketplace-essay-view/:id'
								element={
                                    <AuthGuard>
                                        <MarketplaceEssayView />
                                    </AuthGuard>
                                }
							/>
							<Route path='craft' element={
                                <AuthGuard>
                                    <CraftEssay />
                                </AuthGuard>
                            } />
							<Route path='aadjf0afu8au38afu380b0' element={
                                <AuthGuard>
                                    <Admin />
                                </AuthGuard>
                            } />
							<Route path='privacy-policy' element={<PrivacyPolicy />} />
							<Route path='admin' element={
                                <AuthGuard>
                                    <AdminNavbar />
                                </AuthGuard>
                            }>
								<Route index element={<AdminDashboard />} />
								<Route path='all-users' element={<AllUser />} />
							</Route>
							<Route
								path='terms-and-conditions'
								element={<TermsAndConditions />}
							/>
							<Route
								path='test-signature'
								element={<SignatureTest />}
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