import { convert } from "html-to-text";

export const useHTMLtoTextConverter = (html: string) => {
	const text = convert(html, {
		wordwrap: 130,
	});
	return text;
};
