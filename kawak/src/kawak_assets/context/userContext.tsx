import React, { useState, useContext } from "react";
import { Actor, Identity, ActorSubclass } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { canisterId, createActor } from "../../declarations/kawak";
import { useLocation, useNavigate } from "react-router-dom";
import { _SERVICE } from "../../declarations/kawak/kawak.did";
import { ShepherdTourContext } from "react-shepherd";
import { useMatomo } from "@datapunt/matomo-tracker-react";
// import Onboarding from "../pages/Onboard/Onboarding";
import {
  clearAuthClientStorage,
  deriveKeysFromSeedPhrase,
  createIdentityFromKeyPair,
  validateAndFixSeedPhrase,
  generateSeedPhrase,
} from "../utils/CryptoUtils"
import MetaMaskService from "../services/MetaMaskService"

export const UserContext = React.createContext<{
	Auth: any;
	actor: ActorSubclass<_SERVICE> | undefined;
	setActor: any;
	iiAuth: boolean;
	setIIAuth: any;
	changeAuthStatus: any;
	loginWithMetaMask: any
	handleAuthenticated: (arg0: any) => any;
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
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [notAuthenticated, setNotAuthenticated] = useState(true)
	const [authClient, setAuthClient] = useState(null)
	const [identity, setIdentity] = useState(null)
	const [principal, setPrincipal] = useState(null)

	const { trackEvent } = useMatomo();

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
    try {
      // Unique message for signature to create deterministic seed
      const uniqueMessage =
        "Sign this message to log in with your Ethereum wallet"

      console.log("Requesting MetaMask signature...")
      const signature = await MetaMaskService.signMessage(uniqueMessage)
      console.log("MetaMask Signature received")

      if (!signature) {
        throw new Error("Failed to sign with MetaMask.")
      }

      // Generate seed phrase from signature
      console.log("Generating seed phrase from signature...")
      const seedPhrase = await generateSeedPhrase(signature)

      // Wait for this to fully complete before continuing
      console.log("Initializing login flow with seed phrase...")
      // await this.handleLoginFlow(seedPhrase, { source: 'metamask', retry: true });
      // Validate and potentially fix the seed phrase
      const validSeedPhrase = validateAndFixSeedPhrase(seedPhrase)
      console.log(`Processing login with seed phrase `)
      // Derive keys and create identity
      const keyPair = deriveKeysFromSeedPhrase(validSeedPhrase)
      const identity = createIdentityFromKeyPair(keyPair)
      console.log("Creating identity from key pair...")
      setIdentity(identity)
      setIsAuthenticated(true)
      const principal = identity.getPrincipal()
      setPrincipal(principal)
      console.log("Principal:", principal.toString())
      const actor = createActor(canisterId, {
        agentOptions: {
          identity,
        },
      })
      setActor(actor);
      console.log("Actors created successfully")
	  setTour(tour_);
	  handleAuthenticated(authClient);
      setIIAuth(true);
	  setNotAuthenticated(false);
      return navigate("/")
    } catch (error) {
      console.error("MetaMask login error:", error)
      throw new Error(`MetaMask login failed: ${error.message}`)
    }
  }


	async function handleAuthenticated(authClient: AuthClient) {
		const identity = (await authClient.getIdentity()) as unknown as Identity;

		const whoami_actor = createActor(canisterId as string, {
			agentOptions: {
				identity,
			},
		});
		setActor(whoami_actor);
		setTour(tour_);

		// Invalidate identity then render login when user goes idle
		authClient.idleManager?.registerCallback(() => {
			Actor.agentOf(whoami_actor)?.invalidateIdentity?.();
		});
	}

	const changeAuthStatus = () => {
		setIIAuth((prevState) => prevState !== prevState);
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
