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

// Only create Matomo instance if we're in production and the URL is valid
let instance = null;
if (process.env.NODE_ENV === "production") {
  try {
    instance = createInstance({
      urlBase: "https://kawak.matomo.cloud/",
      siteId: 1,
      linkTracking: false, // Important!
    });
  } catch (error) {
    console.warn("Failed to initialize Matomo analytics:", error);
  }
}

root.render(
	<HashRouter window={routerWindow}>
		<Provider store={store}>
			<UserProvider>
				<EssayEditorProvider>
					<Toaster />
					{instance ? (
						<MatomoProvider value={instance}>
							<App />
						</MatomoProvider>
					) : (
						<App />
					)}
				</EssayEditorProvider>
			</UserProvider>
		</Provider>
	</HashRouter>
);
