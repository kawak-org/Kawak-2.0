export const HOST =
	process.env.DFX_NETWORK === "ic"
		? "https://ic0.app"
		: "http://localhost:8000";

export const IDENTITY_PROVIDER =
	process.env.DFX_NETWORK === "ic"
		? "https://identity.ic0.app/#authorize"
		: process.env.LOCAL_II_CANISTER;

const days = BigInt(1);
const hours = BigInt(24);
const nanoseconds = BigInt(3600000000000);
export const EXPIRATION = days * hours * nanoseconds;
