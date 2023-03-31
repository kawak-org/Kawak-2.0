import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $getSelection, RangeSelection } from "lexical";
import React, { useCallback, useEffect } from "react";
// import { log } from "util";
import { SettingsContext, useSettings } from "./context/SettingsContext";
import { SharedAutocompleteContext } from "./context/SharedAutocompleteContext";
import { SharedHistoryContext } from "./context/SharedHistoryContext";
import Editor from "./Editor";
import PlaygroundNodes from "./nodes/PlaygroundNodes";
import PlaygroundEditorTheme from "./themes/PlaygroundEditorTheme";
import { $generateNodesFromDOM } from "@lexical/html";

function LexicalRichTextEditor(essay: any) {
	const {
		settings: { isCollab, emptyEditor },
	} = useSettings();

	const initialConfig = {
		editorState: isCollab ? null : emptyEditor ? undefined : "",
		namespace: "Playground",
		nodes: [...PlaygroundNodes],
		onError: (error: Error) => {
			throw error;
		},
		theme: PlaygroundEditorTheme,
	};

	const PushData = () => {
		const [editor] = useLexicalComposerContext();
		useEffect(() => {
			editor.setReadOnly(editor.isReadOnly());
			editor.update(() => {
				const parser = new DOMParser();
				const dom = parser.parseFromString(essay.essay, "text/html");
				const nodes = $generateNodesFromDOM(editor, dom);
				$getRoot().select();

				const selection = $getSelection() as RangeSelection;
				selection.insertNodes(nodes);
				// let root = $getRoot();
				// nodes.forEach(
				//   AddText
				// )
				// function AddText(item){

				// }
			});
		}, []);

		return null;
	};

	return (
		<SettingsContext>
			<LexicalComposer initialConfig={initialConfig}>
				<SharedHistoryContext>
					<SharedAutocompleteContext>
						<div className='display-editor'>
							<Editor />
							<PushData />
						</div>
					</SharedAutocompleteContext>
				</SharedHistoryContext>
			</LexicalComposer>
		</SettingsContext>
	);
}

export default React.memo(LexicalRichTextEditor);
