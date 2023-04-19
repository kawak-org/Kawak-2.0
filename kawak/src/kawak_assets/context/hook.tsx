import React, { useContext } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { UserContext } from "./userContext";
import { Actor, Identity } from "@dfinity/agent";
import { canisterId, createActor } from "../../declarations/kawak";

const HandleAuthenticated_ = async (authClient: AuthClient) => {
	const { setActor } = useContext(UserContext);

	const identity = (await authClient.getIdentity()) as unknown as Identity;

	const whoami_actor = createActor(canisterId as string, {
		agentOptions: {
			identity,
		},
	});
	setActor(whoami_actor);

	// Invalidate identity then render login when user goes idle
	authClient.idleManager?.registerCallback(() => {
		Actor.agentOf(whoami_actor)?.invalidateIdentity?.();
	});

	return (
		<div>
			<div>1</div>
		</div>
	);
};
export default HandleAuthenticated_;
