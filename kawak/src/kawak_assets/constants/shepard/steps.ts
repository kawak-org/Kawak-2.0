import { truncate } from "lodash";
import { setOnboarding } from "redux/slice/profileSlice";
import "../../../../node_modules/shepherd.js/dist/css/shepherd.css";
// import { useAppDispatch } from "../../redux/hooks";
const steps = [
	{
		id: "intro",
		attachTo: { element: ".craft-Essay", on: "bottom" as const },
		beforeShowPromise: function () {
			return new Promise<void>(function (resolve) {
				setTimeout(function () {
					window.scrollTo(0, 0);
					resolve();
				}, 500);
			});
		},

		classes: "custom-class-name-1 custom-class-name-2",
		highlightClass: "highlight",
		scrollTo: false,
		cancelIcon: {
			enabled: true,
		},
		title: "Welcome to Kawak, Create an Essay",
		text: [
			"Since you've been rewarded with 10 KawakToken, let try adding our first essay to the forge",
		],
		when: {
			show: () => {
				// console.log("show step");
			},
			hide: () => {
				// console.log("hide step");
			},
		},
	},
	{
		id: "intro2",
		attachTo: { element: ".essay-editor-tour", on: "right-start" as const },
		beforeShowPromise: function () {
			return new Promise<void>(function (resolve) {
				setTimeout(function () {
					window.scrollTo(0, 0);
					resolve();
				}, 500);
			});
		},
		buttons: [
			// {
			// 	// action() {
			// 	// 	const dispatch = useAppDispatch();
			// 	// 	dispatch(setOnboarding(true));
			// 	// },
			// 	classes: "shepherd-button-secondary",
			// 	text: "Skip Tour",
			// 	type: "Cancel",
			// },
			{
				classes: "shepherd-button-primary",
				text: "Next",
				type: "next",
			},
		],
		classes: "custom-class-name-1 custom-class-name-2",
		highlightClass: "highlight",
		scrollTo: false,
		cancelIcon: {
			enabled: true,
		},
		title: "Type in your Essay",
		text: [
			"We provided a text editor for you to craft your essay, essay must be at least a 100 words to proceed",
		],
		when: {
			show: () => {
				// console.log("show step");
			},
			hide: () => {
				// console.log("hide step");
			},
		},
	},
	{
		id: "intro3",
		attachTo: { element: ".continue-essay-btn-tour", on: "bottom" as const },
		beforeShowPromise: function () {
			return new Promise<void>(function (resolve) {
				setTimeout(function () {
					window.scrollTo(0, 0);
					resolve();
				}, 500);
			});
		},
		buttons: [
			{
				classes: "shepherd-button-primary",
				text: "Back",
				type: "back",
			},
		],

		classes: "custom-class-name-1 custom-class-name-2",
		highlightClass: "highlight",
		scrollTo: false,
		cancelIcon: {
			enabled: true,
		},
		title: "Proceed to the next Page",
		text: [
			"After typing your essay, click this button to move to the next step",
		],
		when: {
			show: () => {
				// console.log("show step");
			},
			hide: () => {
				// console.log("hide step");
			},
		},
	},
	{
		id: "intro4",
		attachTo: { element: ".essay-title-tour", on: "bottom" as const },
		beforeShowPromise: function () {
			return new Promise<void>(function (resolve) {
				setTimeout(function () {
					window.scrollTo(0, 0);
					resolve();
				}, 500);
			});
		},
		buttons: [
			{
				classes: "shepherd-button-primary",
				text: "Next",
				type: "next",
			},
		],
		classes: "custom-class-name-1 custom-class-name-2",
		highlightClass: "highlight",
		scrollTo: false,
		cancelIcon: {
			enabled: false,
		},
		title: "Just few more seconds, Give your essay a title",
		text: ["Your essay needs a title to be easily recognized"],
		when: {
			show: () => {
				// console.log("show step");
			},
			hide: () => {
				// console.log("hide step");
			},
		},
	},
	// ...
	// ...
	{
		id: "intro5",
		attachTo: { element: ".essay-token-tour", on: "bottom" as const },
		beforeShowPromise: function () {
			return new Promise<void>(function (resolve) {
				setTimeout(function () {
					window.scrollTo(0, 0);
					resolve();
				}, 500);
			});
		},
		buttons: [
			{
				classes: "shepherd-button-primary",
				text: "Back",
				type: "back",
			},
			{
				classes: "shepherd-button-primary",
				text: "Next",
				type: "next",
			},
		],
		classes: "custom-class-name-1 custom-class-name-2",
		highlightClass: "highlight",
		scrollTo: false,
		cancelIcon: {
			enabled: true,
		},
		title: "Allocate Tokens you are willing to give",
		text: [
			"Once someone annotates your essay, we reward them with tokens, set the amount of tokens you are willing to give",
		],
		when: {
			show: () => {
				// console.log("show step");
			},
			hide: () => {
				// console.log("hide step");
			},
		},
	},
	{
		id: "intro6",
		attachTo: { element: ".essay-submit-tour", on: "bottom" as const },
		beforeShowPromise: function () {
			return new Promise<void>(function (resolve) {
				setTimeout(function () {
					window.scrollTo(0, 0);
					resolve();
				}, 500);
			});
		},

		classes: "custom-class-name-1 custom-class-name-2",
		highlightClass: "highlight",
		scrollTo: false,
		cancelIcon: {
			enabled: true,
		},
		title: "Whupp! we are done",
		text: ["Submit your essay and get rewarded"],
		when: {
			show: () => {
				// console.log("show step");
			},
			hide: () => {
				// console.log("hide step");
			},
		},
	},
	// ...
];

export default steps;
