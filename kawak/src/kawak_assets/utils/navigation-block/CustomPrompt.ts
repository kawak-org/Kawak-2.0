import React, { useEffect, useRef } from "react";
import { blockRouting } from "./routerWindow";

interface CustomPromptProps {
	message?: string;
	when?: boolean;
}

const CustomPrompt: React.FC<CustomPromptProps> = ({ message, when }) => {
	const unblockRef = useRef<ReturnType<typeof blockRouting> | null>(null);

	useEffect(() => {
		if (when) {
			unblockRef.current = blockRouting(message);
		}

		return () => {
			if (unblockRef.current) {
				unblockRef.current();
			}
		};
	}, [when, message]);

	return null;
};

export default CustomPrompt;
