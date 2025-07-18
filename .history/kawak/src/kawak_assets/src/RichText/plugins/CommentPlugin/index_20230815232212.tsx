/**
 *
 */

import type {
  EditorState,
  LexicalCommand,
  LexicalEditor,
  NodeKey,
} from "lexical";
import type { Doc } from "yjs";

import "./main.css";

import {
  $createMarkNode,
  $getMarkIDs,
  $isMarkNode,
  $unwrapMarkNode,
  $wrapSelectionInMarkNode,
  MarkNode,
} from "@lexical/mark";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { useCollaborationContext } from "@lexical/react/LexicalCollaborationContext";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { createDOMRange, createRectsFromDOMRange } from "@lexical/selection";
import { $isRootTextContentEmpty, $rootTextContent } from "@lexical/text";
import { mergeRegister, registerNestedElementResolver } from "@lexical/utils";
import {
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  CLEAR_EDITOR_COMMAND,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  KEY_ESCAPE_COMMAND,
} from "lexical";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import React from "react";
import { createPortal } from "react-dom";
import useLayoutEffect from "../../shared/folder/useLayoutEffect";
import { WebsocketProvider } from "y-websocket";

import {
  Comment,
  Comments,
  CommentStore,
  createComment,
  createThread,
  Thread,
  useCommentStore,
} from "../../commenting";
import useModal from "../../hooks/useModal";
import CommentEditorTheme from "../../themes/CommentEditorTheme";
import Button from "../../ui/Button";
import ContentEditable from "../../ui/ContentEditable";
import Placeholder from "../../ui/Placeholder";
import { RiDeleteBin6Line } from "react-icons/ri";
import { UserContext } from "../../../../context/userContext";
import { useParams } from "react-router-dom";

export const INSERT_INLINE_COMMAND: LexicalCommand<void> = createCommand();

function AddCommentBox({
  anchorKey,
  editor,
  onAddComment,
}: {
  anchorKey: NodeKey;
  editor: LexicalEditor;
  onAddComment: () => void;
}): JSX.Element {
  const boxRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    const boxElem = boxRef.current;
    const rootElement = editor.getRootElement();
    const anchorElement = editor.getElementByKey(anchorKey);

    if (boxElem !== null && rootElement !== null && anchorElement !== null) {
      const { right } = rootElement.getBoundingClientRect();
      const { top } = anchorElement.getBoundingClientRect();
      boxElem.style.left = `${right - 20}px`;
      boxElem.style.top = `${top - 30}px`;
    }
  }, [anchorKey, editor]);

  useEffect(() => {
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
    };
  }, [editor, updatePosition]);

  useLayoutEffect(() => {
    updatePosition();
  }, [anchorKey, editor, updatePosition]);

  return (
    <div className="CommentPlugin_AddCommentBox" ref={boxRef}>
      <button
        className="CommentPlugin_AddCommentBox_button dark:bg-[#495561]"
        onClick={onAddComment}
      >
        <i className="icon add-comment" />
      </button>
    </div>
  );
}

function EditorRefPlugin({
  editorRef,
}: {
  editorRef: { current: null | LexicalEditor };
}): null {
  const [editor] = useLexicalComposerContext();

  useLayoutEffect(() => {
    editorRef.current = editor;
    return () => {
      editorRef.current = null;
    };
  }, [editor, editorRef]);

  return null;
}

function EscapeHandlerPlugin({
  onEscape,
}: {
  onEscape: (e: KeyboardEvent) => boolean;
}): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      KEY_ESCAPE_COMMAND,
      (event: KeyboardEvent) => {
        return onEscape(event);
      },
      2
    );
  }, [editor, onEscape]);

  return null;
}

function PlainTextEditor({
  className,
  autoFocus,
  onEscape,
  onChange,
  editorRef,
  placeholder = "Type a comment...",
}: {
  autoFocus?: boolean;
  className?: string;
  editorRef?: { current: null | LexicalEditor };
  onChange: (editorState: EditorState, editor: LexicalEditor) => void;
  onEscape: (e: KeyboardEvent) => boolean;
  placeholder?: string;
}) {
  const initialConfig = {
    namespace: "Commenting",
    nodes: [],
    onError: (error: Error) => {
      throw error;
    },
    theme: CommentEditorTheme,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="CommentPlugin_CommentInputBox_EditorContainer">
        <PlainTextPlugin
          contentEditable={<ContentEditable className={className} />}
          placeholder={<Placeholder>{placeholder}</Placeholder>}
        />
        <OnChangePlugin onChange={onChange} />
        <HistoryPlugin />
        {autoFocus !== false && <AutoFocusPlugin />}
        <EscapeHandlerPlugin onEscape={onEscape} />
        <ClearEditorPlugin />
        {editorRef !== undefined && <EditorRefPlugin editorRef={editorRef} />}
      </div>
    </LexicalComposer>
  );
}

function useOnChange(
  setContent: (text: string) => void,
  setCanSubmit: (canSubmit: boolean) => void
) {
  return useCallback(
    (editorState: EditorState, _editor: LexicalEditor) => {
      editorState.read(() => {
        setContent($rootTextContent());
        setCanSubmit(!$isRootTextContentEmpty(_editor.isComposing(), true));
      });
    },
    [setCanSubmit, setContent]
  );
}

function CommentInputBox({
  editor,
  cancelAddComment,
  submitAddComment,
}: {
  cancelAddComment: () => void;
  editor: LexicalEditor;
  submitAddComment: (
    commentOrThread: Comment | Thread,
    isInlineComment: boolean
  ) => void;
}) {
  const [content, setContent] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const selectionState = useMemo(
    () => ({
      container: document.createElement("div"),
      elements: [],
    }),
    []
  );
  const author = useCollabAuthorName();

  const updateLocation = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        const anchor = selection.anchor;
        const focus = selection.focus;
        const range = createDOMRange(
          editor,
          anchor.getNode(),
          anchor.offset,
          focus.getNode(),
          focus.offset
        );
        const boxElem = boxRef.current;
        if (range !== null && boxElem !== null) {
          const { left, bottom, width } = range.getBoundingClientRect();
          const selectionRects = createRectsFromDOMRange(editor, range);
          let correctedLeft =
            selectionRects.length === 1 ? left + width / 2 - 125 : left - 125;
          if (correctedLeft < 10) {
            correctedLeft = 10;
          }
          boxElem.style.left = `${correctedLeft}px`;
          boxElem.style.top = `${bottom + 20}px`;
          const selectionRectsLength = selectionRects.length;
          const { container } = selectionState;
          const elements: Array<HTMLSpanElement> = selectionState.elements;
          const elementsLength = elements.length;

          for (let i = 0; i < selectionRectsLength; i++) {
            const selectionRect = selectionRects[i];
            let elem: HTMLSpanElement = elements[i];
            if (elem === undefined) {
              elem = document.createElement("span");
              elements[i] = elem;
              container.appendChild(elem);
            }
            const color = "255, 212, 0";
            const style = `position:absolute;top:${selectionRect.top}px;left:${selectionRect.left}px;height:${selectionRect.height}px;width:${selectionRect.width}px;background-color:rgba(${color}, 0.3);pointer-events:none;z-index:5;`;
            elem.style.cssText = style;
          }
          for (let i = elementsLength - 1; i >= selectionRectsLength; i--) {
            const elem = elements[i];
            container.removeChild(elem);
            elements.pop();
          }
        }
      }
    });
  }, [editor, selectionState]);

  useLayoutEffect(() => {
    updateLocation();
    const container = selectionState.container;
    const body = document.body;
    if (body !== null) {
      body.appendChild(container);
      return () => {
        body.removeChild(container);
      };
    }
  }, [selectionState.container, updateLocation]);

  useEffect(() => {
    window.addEventListener("resize", updateLocation);

    return () => {
      window.removeEventListener("resize", updateLocation);
    };
  }, [updateLocation]);

  const onEscape = (event: KeyboardEvent): boolean => {
    event.preventDefault();
    cancelAddComment();
    return true;
  };

  const submitComment = () => {
    if (canSubmit) {
      let quote = editor.getEditorState().read(() => {
        const selection = $getSelection();
        return selection !== null ? selection.getTextContent() : "";
      });
      if (quote.length > 100) {
        quote = quote.slice(0, 99) + "…";
      }
      submitAddComment(
        createThread(quote, [createComment(content, author)]),
        true
      );
    }
  };

  const onChange = useOnChange(setContent, setCanSubmit);

  return (
    <div
      className="CommentPlugin_CommentInputBox dark:before:border-[#415160] dark:border-white/30 dark:bg-[#415160] "
      ref={boxRef}
    >
      <PlainTextEditor
        className="CommentPlugin_CommentInputBox_Editor dark:focus:outline-white/30 dark:placeholder:text-white/90 dark:bg-[#425363] dark:border dark:border-solid dark:border-white/30 dark:text-white/90"
        onEscape={onEscape}
        onChange={onChange}
      />
      <div className="CommentPlugin_CommentInputBox_Buttons">
        <Button
          onClick={cancelAddComment}
          className="CommentPlugin_CommentInputBox_Button dark:text-white/90 dark:bg-white/20 dark:hover:dark:bg-white/20"
        >
          Cancel
        </Button>
        <Button
          onClick={submitComment}
          disabled={!canSubmit}
          className="CommentPlugin_CommentInputBox_Button  dark:bg-[#323f4b] dark:text-white/90 dark:hover:bg-[#323f4b]"
        >
          Comment
        </Button>
      </div>
    </div>
  );
}

function CommentsComposer({
  submitAddComment,
  thread,
  placeholder,
}: {
  placeholder?: string;
  submitAddComment: (
    commentOrThread: Comment,
    isInlineComment: boolean,
    // eslint-disable-next-line no-shadow
    thread?: Thread
  ) => void;
  thread?: Thread;
}) {
  const [content, setContent] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const editorRef = useRef<LexicalEditor>(null);
  const author = useCollabAuthorName();

  const onChange = useOnChange(setContent, setCanSubmit);

  const submitComment = () => {
    if (canSubmit) {
      submitAddComment(createComment(content, author), false, thread);
      const editor = editorRef.current;
      if (editor !== null) {
        editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
      }
    }
  };

  return (
    <>
      <PlainTextEditor
        className="CommentPlugin_CommentsPanel_Editor"
        autoFocus={false}
        onEscape={() => {
          return true;
        }}
        onChange={onChange}
        editorRef={editorRef}
        placeholder={placeholder}
      />
      <Button
        className="CommentPlugin_CommentsPanel_SendButton"
        onClick={submitComment}
        disabled={!canSubmit}
      >
        <i className="send" />
      </Button>
    </>
  );
}

function ShowDeleteCommentOrThreadDialog({
  commentOrThread,
  deleteCommentOrThread,
  onClose,
  thread = undefined,
}: {
  commentOrThread: Comment | Thread;

  deleteCommentOrThread: (
    comment: Comment | Thread,
    // eslint-disable-next-line no-shadow
    thread?: Thread
  ) => void;
  onClose: () => void;
  thread?: Thread;
}): JSX.Element {
  return (
    <>
      Are you sure you want to delete this {commentOrThread.type}?
      <div className="Modal__content">
        <Button
          onClick={() => {
            deleteCommentOrThread(commentOrThread, thread);
            onClose();
          }}
        >
          Delete
        </Button>{" "}
        <Button
          onClick={() => {
            onClose();
          }}
        >
          Cancel
        </Button>
      </div>
    </>
  );
}

function CommentsPanelListComment({
  comment,
  deleteComment,
  thread,
  rtf,
}: {
  comment: Comment;
  deleteComment: (
    commentOrThread: Comment | Thread,
    // eslint-disable-next-line no-shadow
    thread?: Thread
  ) => void;
  rtf: Intl.RelativeTimeFormat;
  thread?: Thread;
}): JSX.Element {
  const seconds = Math.round((comment.timeStamp - performance.now()) / 1000);
  const minutes = Math.round(seconds / 60);
  const [modal, showModal] = useModal();

  return (
    <li className="CommentPlugin_CommentsPanel_List_Comment">
      {/* <div className="CommentPlugin_CommentsPanel_List_Details">
        <span className="CommentPlugin_CommentsPanel_List_Comment_Author">
          {comment.author}
        </span>
        <span className="CommentPlugin_CommentsPanel_List_Comment_Time">
          · {seconds > -10 ? 'Just now' : rtf.format(minutes, 'minute')}
        </span>
      </div> */}
      <p
        className={
          comment.deleted
            ? "CommentPlugin_CommentsPanel_DeletedComment dark:text-white/90"
            : " dark:text-white/90"
        }
      >
        {comment.content}
      </p>
      {/* {!comment.deleted && (
        <>
          <Button
            onClick={() => {
              showModal('Delete Comment', (onClose) => (
                <ShowDeleteCommentOrThreadDialog
                  commentOrThread={comment}
                  deleteCommentOrThread={deleteComment}
                  thread={thread}
                  onClose={onClose}
                />
              ));
            }}
            className="CommentPlugin_CommentsPanel_List_DeleteButton">
            <i className="delete" />
          </Button>
          {modal}
        </>
      )} */}
    </li>
  );
}

function CommentsPanelList({
  activeIDs,
  comments,
  deleteCommentOrThread,
  listRef,
  submitAddComment,
  markNodeMap,
}: {
  activeIDs: Array<string>;
  comments: Comments;
  deleteCommentOrThread: (
    commentOrThread: Comment | Thread,
    thread?: Thread
  ) => void;
  listRef: { current: null | HTMLUListElement };
  markNodeMap: Map<string, Set<NodeKey>>;
  submitAddComment: (
    commentOrThread: Comment | Thread,
    isInlineComment: boolean,
    thread?: Thread
  ) => void;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [counter, setCounter] = useState(0);
  const [modal, showModal] = useModal();
  const rtf = useMemo(
    () =>
      new Intl.RelativeTimeFormat("en", {
        localeMatcher: "best fit",
        numeric: "auto",
        style: "short",
      }),
    []
  );

  useEffect(() => {
    // Used to keep the time stamp up to date
    const id = setTimeout(() => {
      setCounter(counter + 1);
    }, 10000);

    return () => {
      clearTimeout(id);
    };
  }, [counter]);

  return (
    <ul className="" ref={listRef}>
      {comments.map((commentOrThread) => {
        const id = commentOrThread.id;
        if (commentOrThread.type === "thread") {
          const handleClickThread = () => {
            const markNodeKeys = markNodeMap.get(id);
            if (
              markNodeKeys !== undefined &&
              (activeIDs === null || activeIDs.indexOf(id) === -1)
            ) {
              const activeElement = document.activeElement;
              // Move selection to the start of the mark, so that we
              // update the UI with the selected thread.
              editor.update(
                () => {
                  const markNodeKey = Array.from(markNodeKeys)[0];
                  const markNode = $getNodeByKey<MarkNode>(markNodeKey);
                  if ($isMarkNode(markNode)) {
                    markNode.selectStart();
                  }
                },
                {
                  onUpdate() {
                    // Restore selection to the previous element
                    if (activeElement !== null) {
                      (activeElement as HTMLElement).focus();
                    }
                  },
                }
              );
            }
          };

          return (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <li
              key={id}
              onClick={handleClickThread}
              className={`CommentPlugin_CommentsPanel_List_Thread dark:bg-[#495561] active:dark:bg-[#495561] dark:hover:bg-[#495561]   ${
                markNodeMap.has(id)
                  ? "interactive dark:bg-[#495561] active:dark:bg-[#495561]"
                  : ""
              } ${activeIDs.indexOf(id) === -1 ? "" : "active"}`}
            >
              <div className="CommentPlugin_CommentsPanel_List_Thread_QuoteBox">
                <blockquote className="CommentPlugin_CommentsPanel_List_Thread_Quote  ">
                  <span className="dark:bg-[#5e6d7b] dark:text-white/90 p-2">
                    {commentOrThread.quote}
                  </span>
                </blockquote>
                {/* INTRODUCE DELETE THREAD HERE*/}
                <Button
                  onClick={() => {
                    showModal("Delete Thread", (onClose) => (
                      <ShowDeleteCommentOrThreadDialog
                        commentOrThread={commentOrThread}
                        deleteCommentOrThread={deleteCommentOrThread}
                        onClose={onClose}
                      />
                    ));
                  }}
                  className="CommentPlugin_CommentsPanel_List_DeleteButton "
                >
                  {/* <i className="delete dark:text-white" /> */}
                  <RiDeleteBin6Line className="delete dark:text-white text-black" />
                </Button>
                {modal}
              </div>
              <ul className="CommentPlugin_CommentsPanel_List_Thread_Comments ">
                {commentOrThread.comments.map((comment) => (
                  <CommentsPanelListComment
                    key={comment.id}
                    comment={comment}
                    deleteComment={deleteCommentOrThread}
                    thread={commentOrThread}
                    rtf={rtf}
                  />
                ))}
              </ul>
              {/* <div className="CommentPlugin_CommentsPanel_List_Thread_Editor">
                <CommentsComposer
                  submitAddComment={submitAddComment}
                  thread={commentOrThread}
                  placeholder="Reply to comment..."
                />
              </div> */}
            </li>
          );
        }
        return (
          <CommentsPanelListComment
            key={id}
            comment={commentOrThread}
            deleteComment={deleteCommentOrThread}
            rtf={rtf}
          />
        );
      })}
    </ul>
  );
}

function CommentsPanel({
  activeIDs,
  deleteCommentOrThread,
  comments,
  submitAddComment,
  markNodeMap,
}: {
  activeIDs: Array<string>;
  comments: Comments;
  deleteCommentOrThread: (
    commentOrThread: Comment | Thread,
    thread?: Thread
  ) => void;
  markNodeMap: Map<string, Set<NodeKey>>;
  submitAddComment: (
    commentOrThread: Comment | Thread,
    isInlineComment: boolean,
    thread?: Thread
  ) => void;
}): JSX.Element {
  const listRef = useRef<HTMLUListElement>(null);
  const isEmpty = comments.length === 0;
  const { actor } = useContext(UserContext);
  const { id } = useParams();
  const value = [];
  const [essay, setEssay] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const onMount = () => {
      actor.getessay(BigInt(id)).then((d) => {
        if (d) {
          value.push(d[0]);
          setEssay(value);
          setLoading(false);
          console.log("from index: ", value);
          console.log("description: ", value[0].description);
        }
      });
    };
    onMount();
  }, [essay]);

  return (
    <div className="CommentPlugin_CommentsPanel">
      <div className="bg-white">
        <div className="dark:bg-[#323f4b] bg-[#F98E2D]/10 z-50 mt-[1rem] rounded-[10px] h-[100vh] md:h-[88vh] mb-24 w-[20rem] py-8 px-4  ">
          <div className="flex flex-col">
            <div className="flex flex-row justify-between items-center ">
              <div className="flex flex-row">
                <img
                  className="w-[40px] h-[40px]"
                  src={`avatar.png`}
                  alt="avatar"
                />
                <span className="ml-3 flex flex-col justify-between ">
                  <h2 className=" text-[#08172E] font-bold text-sm"></h2>

                  <p className="text-gray-400 text-xs">Autho</p>
                </span>
              </div>

              <div className="flex flex-row justify-center items-center">
                {/* <img
                src={`token-icon.png`}
                alt="token" />
              <p className="text-[#2F6FED] ml-1 text-base">3</p> */}
              </div>
            </div>

            <div className="border-b-2 bg-gray-400 my-2" />

            <div className="flex flex-row justify-between items-center ">
              <p className="text-gray-400 text-xs">words</p>
              <p className="text-[#EF4444]  text-sm font-medium ">
                Not Reviewed
              </p>
            </div>

            <div className="flex flex-col mt-3 ">
              <h4 className="text-[#F98E2D] dark:text-[#F98E2D]/60 text-base font-bold mb-2 ">
                Description:
              </h4>
              <div className="flex flex-row  mb-2">
                <div className=" w-1 mt-[6px] p-1 h-1 rounded-full  justify-center items-center dark:text-[#F98E2D]/50 bg-[#F98E2D] "></div>
                {(loading == false && essay[0].description !== null) ||
                undefined ? (
                  <p className="text-[#08172E] dark:text-gray-400  ml-2 text-xs font-medium ml-2">
                    {essay[0].description}
                  </p>
                ) : (
                  <p>Essay has no description</p>
                )}
              </div>
              {/* <div className="flex flex-row  mb-2">
                              <div className=" w-1 mt-[6px] p-1 h-1 rounded-full justify-center items-center dark:text-[#F98E2D]/50 bg-[#F98E2D] "></div>
                              <p className="text-[#08172E] dark:text-gray-400 text-xs font-medium ml-2">
                                After reading through the essay be sure to give
                                your overall feedback
                              </p>
                            </div> */}
            </div>
            <div className=" comment-scroll overflow-y-scroll mt-4 h-[350px]">
              <CommentsPanelList
                activeIDs={activeIDs}
                comments={comments}
                deleteCommentOrThread={deleteCommentOrThread}
                listRef={listRef}
                submitAddComment={submitAddComment}
                markNodeMap={markNodeMap}
              />
            </div>
          </div>
        </div>

        {/* <div className="mt-4">
          <h4 className="text-[#08172E] font-semibold text-sm">
            Overall Feedback
          </h4>
          <textarea
            placeholder='Enter review'
            style={{ resize: 'none' }}
            className='w-[100%] h-[130px] p-3 text-xs mt-2 placeholder:text-xs '
          />
        </div> */}
      </div>
      {/* <h2 className="CommentPlugin_CommentsPanel_Heading">Comments</h2>
      {isEmpty ? (
        <div className="CommentPlugin_CommentsPanel_Empty">No Comments</div>
      ) : (
        <CommentsPanelList
          activeIDs={activeIDs}
          comments={comments}
          deleteCommentOrThread={deleteCommentOrThread}
          listRef={listRef}
          submitAddComment={submitAddComment}
          markNodeMap={markNodeMap}
        />
      )} */}
    </div>
  );
}

function useCollabAuthorName(): string {
  const collabContext = useCollaborationContext();
  const { yjsDocMap, name } = collabContext;
  return yjsDocMap.has("comments") ? name : "Playground User";
}

interface Props {
  providerFactory?: (
    id: string,
    yjsDocMap: Map<string, Doc>
  ) => WebsocketProvider;

  commentData: (comment: any) => void;
}

function CommentPlugin(Props: Props): JSX.Element {
  const collabContext = useCollaborationContext();
  const [editor] = useLexicalComposerContext();
  const commentStore = useMemo(() => new CommentStore(editor), [editor]);
  const comments = useCommentStore(commentStore);
  const markNodeMap = useMemo<Map<string, Set<NodeKey>>>(() => {
    return new Map();
  }, []);
  const [activeAnchorKey, setActiveAnchorKey] = useState<NodeKey | null>();
  const [activeIDs, setActiveIDs] = useState<Array<string>>([]);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const { yjsDocMap } = collabContext;

  useEffect(() => {
    if (Props.providerFactory) {
      const provider = Props.providerFactory("comments", yjsDocMap);
      return commentStore.registerCollaboration(provider);
    }
  }, [commentStore, Props.providerFactory, yjsDocMap]);

  const cancelAddComment = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      // Restore selection
      if (selection !== null) {
        selection.dirty = true;
      }
    });
    setShowCommentInput(false);
  }, [editor]);

  const deleteCommentOrThread = useCallback(
    (comment: Comment | Thread, thread?: Thread) => {
      if (comment.type === "comment") {
        const deletionInfo = commentStore.deleteCommentOrThread(
          comment,
          thread
        );
        if (!deletionInfo) return;
        const { markedComment, index } = deletionInfo;
        commentStore.addComment(markedComment, thread, index);
      } else {
        commentStore.deleteCommentOrThread(comment);
        // Remove ids from associated marks
        const id = thread !== undefined ? thread.id : comment.id;
        const markNodeKeys = markNodeMap.get(id);
        if (markNodeKeys !== undefined) {
          // Do async to avoid causing a React infinite loop
          setTimeout(() => {
            editor.update(() => {
              for (const key of Array.from(markNodeKeys)) {
                const node: null | MarkNode = $getNodeByKey(key);
                if ($isMarkNode(node)) {
                  node.deleteID(id);
                  if (node.getIDs().length === 0) {
                    $unwrapMarkNode(node);
                  }
                }
              }
            });
          });
        }
      }
    },
    [commentStore, editor, markNodeMap]
  );

  Props.commentData(commentStore.getComments());

  const submitAddComment = useCallback(
    (
      commentOrThread: Comment | Thread,
      isInlineComment: boolean,
      thread?: Thread
    ) => {
      commentStore.addComment(commentOrThread, thread);
      if (isInlineComment) {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const focus = selection.focus;
            const anchor = selection.anchor;
            const isBackward = selection.isBackward();
            const id = commentOrThread.id;

            // Wrap content in a MarkNode
            $wrapSelectionInMarkNode(selection, isBackward, id);

            // Make selection collapsed at the end
            if (isBackward) {
              focus.set(anchor.key, anchor.offset, anchor.type);
            } else {
              anchor.set(focus.key, focus.offset, focus.type);
            }
          }
        });
        setShowCommentInput(false);
      }
    },
    [commentStore, editor]
  );

  useEffect(() => {
    const changedElems: Array<HTMLElement> = [];
    for (let i = 0; i < activeIDs.length; i++) {
      const id = activeIDs[i];
      const keys = markNodeMap.get(id);
      if (keys !== undefined) {
        for (const key of Array.from(keys)) {
          const elem = editor.getElementByKey(key);
          if (elem !== null) {
            elem.classList.add("selected");
            changedElems.push(elem);
            setShowComments(true);
          }
        }
      }
    }
    return () => {
      for (let i = 0; i < changedElems.length; i++) {
        const changedElem = changedElems[i];
        changedElem.classList.remove("selected");
      }
    };
  }, [activeIDs, editor, markNodeMap]);

  useEffect(() => {
    const markNodeKeysToIDs: Map<NodeKey, Array<string>> = new Map();

    return mergeRegister(
      registerNestedElementResolver<MarkNode>(
        editor,
        MarkNode,
        (from: MarkNode) => {
          return $createMarkNode(from.getIDs());
        },
        (from: MarkNode, to: MarkNode) => {
          // Merge the IDs
          const ids = from.getIDs();
          ids.forEach((id) => {
            to.addID(id);
          });
        }
      ),
      editor.registerMutationListener(MarkNode, (mutations: any) => {
        editor.getEditorState().read(() => {
          for (const [key, mutation] of mutations) {
            const node: null | MarkNode = $getNodeByKey(key);
            let ids: NodeKey[] = [];

            if (mutation === "destroyed") {
              ids = markNodeKeysToIDs.get(key) || [];
            } else if ($isMarkNode(node)) {
              ids = node.getIDs();
            }

            for (let i = 0; i < ids.length; i++) {
              const id = ids[i];
              let markNodeKeys = markNodeMap.get(id);
              markNodeKeysToIDs.set(key, ids);

              if (mutation === "destroyed") {
                if (markNodeKeys !== undefined) {
                  markNodeKeys.delete(key);
                  if (markNodeKeys.size === 0) {
                    markNodeMap.delete(id);
                  }
                }
              } else {
                if (markNodeKeys === undefined) {
                  markNodeKeys = new Set();
                  markNodeMap.set(id, markNodeKeys);
                }
                if (!markNodeKeys.has(key)) {
                  markNodeKeys.add(key);
                }
              }
            }
          }
        });
      }),
      editor.registerUpdateListener(({ editorState, tags }) => {
        editorState.read(() => {
          const selection = $getSelection();
          let hasActiveIds = false;
          let hasAnchorKey = false;

          if ($isRangeSelection(selection)) {
            const anchorNode = selection.anchor.getNode();

            if ($isTextNode(anchorNode)) {
              const commentIDs = $getMarkIDs(
                anchorNode,
                selection.anchor.offset
              );
              if (commentIDs !== null) {
                setActiveIDs(commentIDs);
                hasActiveIds = true;
              }
              if (!selection.isCollapsed()) {
                setActiveAnchorKey(anchorNode.getKey());
                hasAnchorKey = true;
              }
            }
          }
          if (!hasActiveIds) {
            setActiveIDs((_activeIds) =>
              _activeIds.length === 0 ? _activeIds : []
            );
          }
          if (!hasAnchorKey) {
            setActiveAnchorKey(null);
          }
        });
        if (!tags.has("collaboration")) {
          setShowCommentInput(false);
        }
      }),
      editor.registerCommand(
        INSERT_INLINE_COMMAND,
        () => {
          const domSelection = window.getSelection();
          if (domSelection !== null) {
            domSelection.removeAllRanges();
          }
          setShowCommentInput(true);
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor, markNodeMap]);

  const onAddComment = () => {
    editor.dispatchCommand(INSERT_INLINE_COMMAND, undefined);
  };

  return (
    <>
      {showCommentInput &&
        createPortal(
          <CommentInputBox
            editor={editor}
            cancelAddComment={cancelAddComment}
            submitAddComment={submitAddComment}
          />,
          document.body
        )}
      {activeAnchorKey !== null &&
        activeAnchorKey !== undefined &&
        !showCommentInput &&
        createPortal(
          <AddCommentBox
            anchorKey={activeAnchorKey}
            editor={editor}
            onAddComment={onAddComment}
          />,
          document.body
        )}
      {createPortal(
        <Button
          className={`CommentPlugin_ShowCommentsButton dark:active:bg-[#495561] dark:hover:bg-[#495561] lg:hidden  flex ${
            showComments ? "active" : ""
          }`}
          onClick={() => setShowComments(!showComments)}
          title={showComments ? "Hide Comments" : "Show Comments"}
        >
          <i className="comments" />
        </Button>,
        document.body
      )}
      {showComments &&
        createPortal(
          <CommentsPanel
            comments={comments}
            submitAddComment={submitAddComment}
            deleteCommentOrThread={deleteCommentOrThread}
            activeIDs={activeIDs}
            markNodeMap={markNodeMap}
          />,
          document.body
        )}
    </>
  );
}

export default React.memo(CommentPlugin);
