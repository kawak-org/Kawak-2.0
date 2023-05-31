import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import React, { useContext, useState } from "react";
import { EssayEditorContext } from "../../context/EssayEditorContext";

const PreviewEssay = () => {
  const { editorState } = useContext(EssayEditorContext);

  return (
    <Editor
      toolbarHidden
      editorClassName="bg-white dark:bg-[#323f4b] py-3 editor-class"
      editorState={editorState}
    />
  );
};

export default PreviewEssay;
