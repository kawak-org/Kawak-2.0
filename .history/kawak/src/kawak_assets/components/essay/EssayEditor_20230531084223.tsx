import { Editor } from "react-draft-wysiwyg";
import { convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import React, { useContext } from "react";
import draftToHtml from "draftjs-to-html";
import { EssayEditorContext } from "../../context/EssayEditorContext";

type Props = {
  handleEditorChange?: (html: any) => void;
};

const EssayEditor = ({ handleEditorChange }: Props) => {
  // const [editorState, setEditorState] = useState(() => {
  // 	EditorState.createEmpty();
  // });
  const { editorState, handleChange } = useContext(EssayEditorContext);

  return (
    // <EssayEditorProvider>
    <Editor
      editorClassName="dark:bg-[#323f4b] dark:text-white/90 bg-white px-6 py-3 my-2 dark:border-[#3e5060] editor-class border-inherit border-2  min-h-screen"
      wrapperClassName="wrapper-class "
      toolbarClassName="toolbar-class dark:bg-[#323f4b]"
      toolbar={{
        options: ["inline", "blockType", "fontSize", "list", "link"],
        inline: {
          options: ["bold", "italic", "underline"],
        },
      }}
      editorState={editorState}
      onEditorStateChange={(state) => {
        handleChange(state);
        if (handleEditorChange !== undefined) {
          handleEditorChange(
            draftToHtml(convertToRaw(state.getCurrentContent()))
          );
        }
      }}
    />
    // </EssayEditorProvider>
  );
};

export default EssayEditor;
