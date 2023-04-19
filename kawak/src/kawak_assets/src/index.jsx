import React from "react";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, HashRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { MatomoProvider, createInstance } from "@datapunt/matomo-tracker-react";
import routerWindow from "../utils/navigation-block/routerWindow";
import App from "./app";
import "./index.css";
import { UserProvider } from "../context/userContext";
import store from "../redux/store";
import { EssayEditorProvider } from "../context/EssayEditorContext";
const container = document.getElementById("app");
const root = createRoot(container);

const instance = createInstance({
	urlBase: "https://kawak.matomo.cloud/",
	siteId: process.env.NODE_ENV === "production" ? 1 : 3,
	linkTracking: false, // Important!
});

root.render(
	<HashRouter window={routerWindow}>
		<Provider store={store}>
			<UserProvider>
				<EssayEditorProvider>
					<Toaster />
					<MatomoProvider value={instance}>
						<App />
					</MatomoProvider>
				</EssayEditorProvider>
			</UserProvider>
		</Provider>
	</HashRouter>
);
