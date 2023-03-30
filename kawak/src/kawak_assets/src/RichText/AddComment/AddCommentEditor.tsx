import { LexicalComposer}  from '@lexical/react/LexicalComposer';
import React, { useCallback, useEffect, useState } from 'react';
import {SettingsContext, useSettings} from '../context/SettingsContext';
import {SharedAutocompleteContext} from '../context/SharedAutocompleteContext';
import {SharedHistoryContext} from '../context/SharedHistoryContext';
import CommentEditor from './CommentEditor';
import PlaygroundNodes from '../nodes/PlaygroundNodes';
import PlaygroundEditorTheme from '../themes/PlaygroundEditorTheme';
import { $getRoot, $getSelection, EditorState, LexicalEditor, RangeSelection} from 'lexical';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$generateNodesFromDOM} from '@lexical/html';
import {$generateHtmlFromNodes} from '@lexical/html';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import CommentPlugin from '../plugins/CommentPlugin';
import { createWebsocketProvider } from '../collaboration';
import { Comments } from '../commenting';

interface dataProps  {
  handleData: (htmlString: any) => void,
  essay: any,
  commentData: (comment: any) =>void
}

function AddCommentEditor(Props: dataProps ) {
  let data: any;
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

  const PushDataPlugin = useCallback(()=>{

      const [editor] = useLexicalComposerContext();

        useEffect(()=>{
          editor.update(()=>{
            const parser = new DOMParser();
            const dom = parser.parseFromString(Props.essay, "text/html");
            const nodes = $generateNodesFromDOM(editor, dom);
            $getRoot().select()

            const selection = $getSelection() as RangeSelection;
            selection.insertNodes(nodes);
            // let root = $getRoot();
            // nodes.forEach(
            //   AddText
            // )
            // function AddText(item){

            // }
            })
        },[])

      return null;

  },[])

  const onChange = (editorState: EditorState, editor: LexicalEditor) =>{
      editor.update(() => {
        const editorState = editor.getEditorState();
        const jsonString = JSON.stringify(editorState);
        // console.log('jsonString', jsonString);
        const htmlString = $generateHtmlFromNodes(editor, null);
        Props.handleData(jsonString)
        // console.log('htmlString', htmlString);
      })

   }


  return (
    <SettingsContext>
    <LexicalComposer initialConfig={initialConfig}>
      <SharedHistoryContext>
        <SharedAutocompleteContext>
       
          <div className="">
            <CommentEditor
            />
            <PushDataPlugin/>
            <OnChangePlugin onChange={onChange}
             />
               <CommentPlugin
                providerFactory={isCollab ? createWebsocketProvider : undefined}
                commentData = {(comment)=>{
                     data = comment
                     Props.commentData(data)
                     }}
                  />
          </div>
           
        </SharedAutocompleteContext>
      </SharedHistoryContext>
    </LexicalComposer>
    </SettingsContext>
  );
}

export default AddCommentEditor;
  


