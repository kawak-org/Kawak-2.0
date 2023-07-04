import React, { useState } from "react";
import { EditorState, ContentState, convertFromHTML } from "draft-js";

export const EssayEditorContext = React.createContext<{
  essay: string;
  setEssay: any;
  editorState: any;
  handleChange: (arg: any) => any;
  setStateEmpty: () => any;
  step: number;
  setStep: any;
  title: string;
  setTitle: any;
  essayCost: number;
  setEssayCost: any;
  editingDraftId: number | null;
  setEditingDraftId: any;
  convertHTMLtoEditorContent: (arg2: string) => void;
  visibility:boolean;
  setVisibility:any;
  description:string;
  setDescription:any
}>({
  essay: "",
  setEssay: undefined,
  editorState: EditorState.createEmpty(),
  handleChange: undefined,
  setStateEmpty: undefined,
  step: 1,
  setStep: undefined,
  title: undefined,
  setTitle: undefined,
  essayCost: 0,
  setEssayCost: undefined,
  editingDraftId: null,
  setEditingDraftId: undefined,
  convertHTMLtoEditorContent: undefined,
  visibility:false,
  setVisibility:undefined,
  description:"",
  setDescription:undefined
});

export const EssayEditorProvider = ({ children }) => {
  const [editorState, setEditorState] = useState(() => {
    EditorState.createEmpty();
  });
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [essayCost, setEssayCost] = useState(0);
  const [essay, setEssay] = useState("");
  const [editingDraftId, setEditingDraftId] = useState(null);
  const [visibility, setVisibility] = useState(true)
  const [description, setDescription] = useState("")


  const handleChange = (state: any) => {
    setEditorState(state);
  };
  const setStateEmpty = () => {
    setEditorState(() => {
      EditorState.createEmpty();
    });
    setTitle("");
    setStep(1);
    setEssayCost(0);
  };
  const convertHTMLtoEditorContent = (html: string) => {
    const blocksFromHTML = convertFromHTML(html);
    const state = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    setEssay(html);
    setEditorState(EditorState.createWithContent(state));
  };

  return (
    <EssayEditorContext.Provider
      value={{
        essay,
        setEssay,
        editorState,
        handleChange,
        setStateEmpty,
        step,
        setStep,
        title,
        setTitle,
        essayCost,
        setEssayCost,
        editingDraftId,
        setEditingDraftId,
        convertHTMLtoEditorContent,
      visibility, 
      setVisibility,
      description,
      setDescription
      }}
    >
      {children}
    </EssayEditorContext.Provider>
  );
};
