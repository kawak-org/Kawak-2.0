import { LexicalComposer}  from '@lexical/react/LexicalComposer';
import React, { useEffect } from 'react';
import {SettingsContext, useSettings} from '../context/SettingsContext';
import {SharedAutocompleteContext} from '../context/SharedAutocompleteContext';
import {SharedHistoryContext} from '../context/SharedHistoryContext';
import CommentEditor from '../AddComment/CommentEditor';
import PlaygroundNodes from '../nodes/PlaygroundNodes';
import PlaygroundEditorTheme from '../themes/PlaygroundEditorTheme';
import { $getRoot, $getSelection, LexicalEditor, RangeSelection} from 'lexical';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$generateNodesFromDOM} from '@lexical/html';




function ReviewCommentEditor(review: any) {

  const {
    settings: {isCollab, emptyEditor},
  } = useSettings();


  const initialConfig = {
    editorState: isCollab
    ? null
    : emptyEditor
    ? undefined
    : "",
    namespace: 'Playground',
    nodes: [...PlaygroundNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
  };

  const PushDataPlugin =()=>{
    const [editor] = useLexicalComposerContext();
    useEffect(()=>{
      editor.update(()=>{
        const editorState = editor.parseEditorState(review.review);
        // console.log(editorState)
        editor.setEditorState(editorState);

        })
 
    },[])
  
    return null;
  }


  return (
    <SettingsContext>
    <LexicalComposer initialConfig={initialConfig}>
      <SharedHistoryContext>
        <SharedAutocompleteContext>
       
          <div className="review-editor">
            <CommentEditor
            />
            <PushDataPlugin/>
          </div>
           
        </SharedAutocompleteContext>
      </SharedHistoryContext>
    </LexicalComposer>
    </SettingsContext>
  );
}

export default React.memo(ReviewCommentEditor);
  



