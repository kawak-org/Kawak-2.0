import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { AutoScrollPlugin } from "@lexical/react/LexicalAutoScrollPlugin";
import { CharacterLimitPlugin } from "@lexical/react/LexicalCharacterLimitPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin";
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import React from "react";
import { useRef, useState, useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback } from "react";
import { createWebsocketProvider } from "../collaboration";
import { useSettings } from "../context/SettingsContext";
import { useSharedHistoryContext } from "../context/SharedHistoryContext";
import ActionsPlugin from "../plugins/ActionsPlugin";
import AutocompletePlugin from "../plugins/AutocompletePlugin";
import AutoEmbedPlugin from "../plugins/AutoEmbedPlugin";
import AutoLinkPlugin from "../plugins/AutoLinkPlugin";
import ClickableLinkPlugin from "../plugins/ClickableLinkPlugin";
import CodeActionMenuPlugin from "../plugins/CodeActionMenuPlugin";
import CodeHighlightPlugin from "../plugins/CodeHighlightPlugin";
import AddCommentPlugin from "../plugins/AddCommentPlugin/AddCommentPlugin";
import ComponentPickerPlugin from "../plugins/ComponentPickerPlugin";
import EmojisPlugin from "../plugins/EmojisPlugin";
import FigmaPlugin from "../plugins/FigmaPlugin";
import FloatingLinkEditorPlugin from "../plugins/FloatingLinkEditorPlugin";
import FloatingTextFormatToolbarPlugin from "../plugins/FloatingTextFormatToolbarPlugin";
import HorizontalRulePlugin from "../plugins/HorizontalRulePlugin";
import ImagesPlugin from "../plugins/ImagesPlugin";
import KeywordsPlugin from "../plugins/KeywordsPlugin";
import ListMaxIndentLevelPlugin from "../plugins/ListMaxIndentLevelPlugin";
import MarkdownShortcutPlugin from "../plugins/MarkdownShortcutPlugin";
import { MaxLengthPlugin } from "../plugins/MaxLengthPlugin";
import MentionsPlugin from "../plugins/MentionsPlugin";
import PollPlugin from "../plugins/PollPlugin";
import ReadOnlyPlugin from "../plugins/ReadOnlyPlugin";
import SpeechToTextPlugin from "../plugins/SpeechToTextPlugin";
import TabFocusPlugin from "../plugins/TabFocusPlugin";
import TableCellActionMenuPlugin from "../plugins/TableActionMenuPlugin";
import TableCellResizer from "../plugins/TableCellResizer";
import TableOfContentsPlugin from "../plugins/TableOfContentsPlugin";
import ToolbarPlugin from "../plugins/ToolbarPlugin";
import TreeViewPlugin from "../plugins/TreeViewPlugin";
import TwitterPlugin from "../plugins/TwitterPlugin";
import YouTubePlugin from "../plugins/YouTubePlugin";
import ContentEditable from "../ui/ContentEditable";
import Placeholder from "../ui/Placeholder";

const skipCollaborationInit =
  // @ts-ignore
  window.parent != null && window.parent.frames.right === window;

// type Props = {
//   handleEditorChange: (html: any) => void,
// }

function CommentEditor(): JSX.Element {
  const { historyState } = useSharedHistoryContext();
  const {
    settings: {
      isCollab,
      isAutocomplete,
      isMaxLength,
      isCharLimit,
      isCharLimitUtf8,
      isRichText,
      showTreeView,
      showTableOfContents,
    },
  } = useSettings();
  const text = isCollab
    ? "Enter some collaborative rich text..."
    : isRichText
    ? "Enter some text..."
    : "Enter some plain text...";
  const placeholder = <Placeholder>{text}</Placeholder>;
  const scrollRef = useRef(null);
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  type Props = {
    id?: string;
  };

  function ReadOnlyContentEditable(props: Props): JSX.Element {
    const [editor] = useLexicalComposerContext();
    const ref = useCallback(
      (rootElement: null | HTMLElement) => {
        editor.setRootElement(rootElement);
      },
      [editor]
    );

    return <div contentEditable={false} id={props.id} ref={ref} />;
  }

  return (
    <>
      {isRichText}
      <div
        className={`editor-container dark:bg-[#323f4b] dark:text-white/70 ${
          showTreeView ? "tree-view" : ""
        } ${!isRichText ? "plain-text" : ""}`}
        ref={scrollRef}
      >
        {isMaxLength && <MaxLengthPlugin maxLength={30} />}
        <AutoFocusPlugin />
        <ClearEditorPlugin />
        <ComponentPickerPlugin />
        <AutoEmbedPlugin />
        <MentionsPlugin />
        <EmojisPlugin />
        <HashtagPlugin />
        <KeywordsPlugin />
        <SpeechToTextPlugin />
        <AutoLinkPlugin />
        <AutoScrollPlugin scrollRef={scrollRef} />

        {isRichText ? (
          <>
            {isCollab ? (
              <CollaborationPlugin
                id="main"
                providerFactory={createWebsocketProvider}
                shouldBootstrap={!skipCollaborationInit}
              />
            ) : (
              <HistoryPlugin externalHistoryState={historyState} />
            )}
            <RichTextPlugin
              contentEditable={
                <div className="editor-scroller">
                  <div className="editor" ref={onRef}>
                    <ContentEditable />
                  </div>
                </div>
              }
              placeholder={placeholder}
              // TODO Collab support until 0.4
              initialEditorState={isCollab ? null : undefined}
            />
            {/* <OnChangePlugin onChange={onChange} /> */}

            <MarkdownShortcutPlugin />
            <CodeHighlightPlugin />
            <ListPlugin />
            <CheckListPlugin />
            <ListMaxIndentLevelPlugin maxDepth={7} />
            <TablePlugin />
            <TableCellResizer />
            <ImagesPlugin />
            <LinkPlugin />
            <PollPlugin />
            <TwitterPlugin />
            <YouTubePlugin />
            <FigmaPlugin />
            <ClickableLinkPlugin />
            <HorizontalRulePlugin />
            {/* <EquationsPlugin />
             */}
            <TabFocusPlugin />
            {floatingAnchorElem && (
              <>
                <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
                <TableCellActionMenuPlugin anchorElem={floatingAnchorElem} />
                <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} />
                <FloatingTextFormatToolbarPlugin
                  anchorElem={floatingAnchorElem}
                />
              </>
            )}
          </>
        ) : (
          <>
            <PlainTextPlugin
              contentEditable={<ContentEditable />}
              placeholder={placeholder}
              // TODO Collab support until 0.4
              initialEditorState={isCollab ? null : undefined}
            />
            <HistoryPlugin externalHistoryState={historyState} />
          </>
        )}
        {(isCharLimit || isCharLimitUtf8) && (
          <CharacterLimitPlugin charset={isCharLimit ? "UTF-16" : "UTF-8"} />
        )}
        {isAutocomplete && <AutocompletePlugin />}
        <div>{showTableOfContents && <TableOfContentsPlugin />}</div>
        <div className="toc">
          {showTableOfContents && <TableOfContentsPlugin />}
        </div>
        <ReadOnlyPlugin isRichText={isRichText} />
      </div>
      {showTreeView && <TreeViewPlugin />}
    </>
  );
}

export default CommentEditor;
