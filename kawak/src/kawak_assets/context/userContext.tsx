import React, { useState, useContext, useEffect } from "react";
import { Actor, Identity, ActorSubclass } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { canisterId, createActor } from "../../declarations/kawak";
import { useLocation, useNavigate } from "react-router-dom";
import { _SERVICE } from "../../declarations/kawak/kawak.did";
import { ShepherdTourContext } from "react-shepherd";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import toast from "react-hot-toast";
// import Onboarding from "../pages/Onboard/Onboarding";
import {
  clearAuthClientStorage,
  deriveKeysFromSeedPhrase,
  createIdentityFromKeyPair,
  validateAndFixSeedPhrase,
  generateSeedPhrase,
} from "../utils/CryptoUtils"
import MetaMaskService from "../services/MetaMaskService"
import { WalletUtils } from "../utils/WalletUtils"

export const UserContext = React.createContext<{
	Auth: any;
	actor: ActorSubclass<_SERVICE> | undefined;
	setActor: any;
	iiAuth: boolean;
	setIIAuth: any;
	changeAuthStatus: any;
	loginWithMetaMask: any;
	handleAuthenticated: (arg0: any) => any;
	logout: () => Promise<void>;
	isAuthenticated: boolean;
	isLoading: boolean;
	tour: any;
	setTour: any;
	checkedEssayPage: boolean;
	setCheckedEssayPage: any;
	checkedDraftPage: boolean;
	setCheckedDraftPage: any;
	checkedNftPage: boolean;
	setCheckedNftPage: any;
}>({
	Auth: undefined,
	actor: undefined,
	setActor: undefined,
	iiAuth: false,
	setIIAuth: false,
	loginWithMetaMask: null,
	changeAuthStatus: undefined,
	handleAuthenticated: undefined,
	logout: async () => {},
	isAuthenticated: false,
	isLoading: true,
	tour: undefined,
	setTour: undefined,
	checkedEssayPage: false,
	setCheckedEssayPage: undefined,
	checkedDraftPage: false,
	setCheckedDraftPage: undefined,
	checkedNftPage: false,
	setCheckedNftPage: undefined,
});

export const UserProvider = ({ children }) => {
	const tour_ = useContext(ShepherdTourContext);
	const [actor, setActor] = useState<ActorSubclass<_SERVICE>>();
	const [iiAuth, setIIAuth] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	const [tour, setTour] = useState(null);
	const [checkedEssayPage, setCheckedEssayPage] = useState(false);
	const [checkedDraftPage, setCheckedDraftPage] = useState(false);
	const [checkedNftPage, setCheckedNftPage] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [notAuthenticated, setNotAuthenticated] = useState(true);
	const [authClient, setAuthClient] = useState(null);
	const [identity, setIdentity] = useState(null);
	const [principal, setPrincipal] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	const { trackEvent } = useMatomo();

	// Initialize authentication status on app load
	useEffect(() => {
		const initializeAuth = async () => {
			try {
				const authClient = await AuthClient.create();
				setAuthClient(authClient);
				
				if (await authClient.isAuthenticated()) {
					await handleAuthenticated(authClient);
					setIIAuth(true);
					setNotAuthenticated(false);
					setIsAuthenticated(true);
				}
			} catch (error) {
				console.error("Failed to initialize authentication:", error);
			} finally {
				setIsLoading(false);
			}
		};

		initializeAuth();
	}, []);

	async function Auth(e) {
		e.preventDefault();
		console.log("You clicked ssetCheckedDraftPageubmit.");
		trackEvent({ category: "Authentication", action: "sign-in/sign-up" });
		const authClient = await AuthClient.create();
		if (await authClient.isAuthenticated()) {
			handleAuthenticated(authClient);
			setTour(tour_);
			if (location.pathname === "/") {
				navigate("/forge");
			}
			setIIAuth(true);
			setNotAuthenticated(false);
		}

		const loginButton = document.getElementById(
			"loginButton"
		) as HTMLButtonElement;

		const days = BigInt(1);
		const hours = BigInt(24);
		const nanoseconds = BigInt(3600000000000);

		const APPLICATION_NAME = "KawaK";
		const APPLICATION_LOGO_URL =
			"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJR6SAoiTMNdmt6tabURYYwvSp9XcA9IgMjw&usqp=CAU";

		const AUTH_PATH =
			"/authenticate/?applicationName=" +
			APPLICATION_NAME +
			"&applicationLogo=" +
			APPLICATION_LOGO_URL +
			"#authorize";

		await authClient.login({
			onSuccess: async () => {
				handleAuthenticated(authClient);
				navigate("/");
				setIIAuth(true);
				setNotAuthenticated(false);
			},
			windowOpenerFeatures:
				`left=${window.screen.width / 2 - 525 / 2}, ` +
				`top=${window.screen.height / 2 - 705 / 2},` +
				`toolbar=0,location=0,menubar=0,width=525,height=705`,
			identityProvider:
				process.env.DFX_NETWORK === "ic"
					? "https://nfid.one" + AUTH_PATH
					: process.env.LOCAL_II_CANISTER,
			// Maximum authorization expiration is 8 days
			maxTimeToLive: days * hours * nanoseconds,
		});
	}

	  const loginWithMetaMask = async (e) => {
		e.preventDefault();
		trackEvent({ category: "Authentication", action: "sign-in/sign-up" });
		
		try {
			const authClient = await AuthClient.create();
			if (await authClient.isAuthenticated()) {
				await handleAuthenticated(authClient);
				setTour(tour_);
				if (location.pathname === "/") {
					navigate("/forge");
				}
				setIIAuth(true);
				setNotAuthenticated(false);
				return;
			}

			// Check if MetaMask is available
			const isMetaMaskInstalled = await MetaMaskService.isMetaMaskInstalled();
			if (!isMetaMaskInstalled) {
				toast.error("MetaMask is not installed. Please install MetaMask to continue.");
				return;
			}

			// Get Ethereum address for deterministic identity
			const ethereumAddress = await MetaMaskService.getEthereumAddress();
			console.log("Ethereum address:", ethereumAddress);

			// Create a simple deterministic seed from the address
			// This avoids any hex string processing issues
			const addressHash = ethereumAddress.slice(2).toLowerCase(); // Remove 0x and lowercase
			const seedString = `kawak-${addressHash.slice(0, 16)}`; // Use first 16 chars for simplicity
			
			console.log("Creating deterministic seed from address...");
			const seedPhrase = await generateSeedPhrase(seedString);
			console.log("Seed phrase generated:", seedPhrase);

			// Validate and potentially fix the seed phrase
			const validSeedPhrase = validateAndFixSeedPhrase(seedPhrase);
			console.log("Validated seed phrase:", validSeedPhrase);
			console.log("Processing login with seed phrase");
			
			// Derive keys and create identity
			const keyPair = deriveKeysFromSeedPhrase(validSeedPhrase);
			const identity = createIdentityFromKeyPair(keyPair);
			console.log("Creating identity from key pair...");
			
			setIdentity(identity);
			const principal = identity.getPrincipal();
			setPrincipal(principal);
			console.log("Principal:", principal.toString());
			
			const actor = createActor(canisterId, {
				agentOptions: {
					identity,
				},
			});
			setActor(actor);
			console.log("Actors created successfully");
			
			setTour(tour_);
			setIIAuth(true);
			setNotAuthenticated(false);
			setIsAuthenticated(true);
			
			toast.success("Successfully signed in with MetaMask!");
			navigate("/forge");
		} catch (error) {
			console.error("MetaMask login error:", error);
			
			// Use the improved error handling
			const errorMessage = WalletUtils.handleWalletError(error);
			toast.error(errorMessage);
		}
	}


	async function handleAuthenticated(authClient: AuthClient) {
		try {
			const identity = (await authClient.getIdentity()) as unknown as Identity;

			const whoami_actor = createActor(canisterId as string, {
				agentOptions: {
					identity,
				},
			});
			setActor(whoami_actor);
			setTour(tour_);
			setIsAuthenticated(true);
			setNotAuthenticated(false);

			// Invalidate identity then render login when user goes idle
			authClient.idleManager?.registerCallback(() => {
				Actor.agentOf(whoami_actor)?.invalidateIdentity?.();
			});

			return whoami_actor;
		} catch (error) {
			console.error("Failed to handle authentication:", error);
			throw error;
		}
	}

	const changeAuthStatus = () => {
		setIIAuth((prevState) => !prevState);
	};

	const logout = async () => {
		try {
			if (authClient) {
				await authClient.logout();
			}
			setActor(undefined);
			setIIAuth(false);
			setIsAuthenticated(false);
			setNotAuthenticated(true);
			setIdentity(null);
			setPrincipal(null);
			await clearAuthClientStorage();
			navigate("/");
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	return (
		<UserContext.Provider
			value={{
				Auth,
				actor,
				setActor,
				iiAuth,
				setIIAuth,
				loginWithMetaMask,
				handleAuthenticated,
				changeAuthStatus,
				logout,
				isAuthenticated,
				isLoading,
				tour,
				setTour,
				checkedEssayPage,
				setCheckedEssayPage,
				checkedDraftPage,
				setCheckedDraftPage,
				checkedNftPage,
				setCheckedNftPage,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};
