import { LexicalComposer}  from '@lexical/react/LexicalComposer';
import React from 'react';
import {SettingsContext, useSettings} from '../context/SettingsContext';
import {SharedAutocompleteContext} from '../context/SharedAutocompleteContext';
import {SharedHistoryContext} from '../context/SharedHistoryContext';
import TextEditor from './TextEditor';
import PlaygroundNodes from '../nodes/PlaygroundNodes';
import PlaygroundEditorTheme from '../themes/PlaygroundEditorTheme';
import {$createHeadingNode, $createQuoteNode} from '@lexical/rich-text';
import {$createParagraphNode, $createTextNode, $getRoot, $getSelection} from 'lexical';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';




function OnboardEditor():JSX.Element {

  const {
    settings: {isCollab, emptyEditor},
  } = useSettings();

function PreloadedText(){
  const root = $getRoot();
    const quote = $createParagraphNode();
    quote.append(
      $createTextNode('Hello stranger! It seems that you’ve stumbled onto a rather odd corner of the internet')
    )
    const paragraph = $createParagraphNode();
    paragraph.append(
      $createTextNode('                If anything, this page is quite plain and dull to look at. It could in part be due to the fact that we have severely underpaid our UI/UX designer or maybe something else entirely is at play. '), 
    );
    root.append(paragraph);
    const paragraph1 = $createParagraphNode();
    paragraph1.append(
      $createTextNode('                So you’re still reading this? Unlike most websites and applications nowadays we are not trying to grab your attention in the conventional sense. Nor design an algorithm that will reap as much information from you as possible to in turn present content which captivates that monkey brain of ours'), 
    );
    root.append(paragraph1);
    const paragraph2 = $createParagraphNode();
    paragraph2.append(
      $createTextNode('                The now digital gold rush has prospectors running after the ever growing implicit currency of attention and time. An asset where those who find themselves aimless are far too comfortable to dispense with. '), 
    );
    root.append(paragraph2);
  
    const paragraph4 = $createParagraphNode();
    paragraph4.append(
      $createTextNode('                Rather than a reflection of your harvested data identity this website will reflect your effort and nothing more. On the next page, as a title, name a fruit. Had you left the page without even bothering to read this wall of text the attention span filter would have succeeded in its task. If you make it this far and aren’t sufficiently curious to engage with this tool then that is a failure in writing on my end. In which case maybe you’ll take the time to tell us where we lacked clarity and cohesion'), 
    );
    root.append(paragraph4);
    const paragraph5 = $createParagraphNode();
    paragraph5.append(
      $createTextNode('               To avoid spam users give the correct answer to this question  "What is the colour of the sky ?". Do make sure to give your feedback on the above essay as well'),
      )
    root.append(paragraph5);
}

  const initialConfig = {
    editorState: isCollab
      ? PreloadedText
      : PreloadedText,
    namespace: 'Playground',
    nodes: [...PlaygroundNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
  };

  

  return (
    <SettingsContext>
    <LexicalComposer initialConfig={initialConfig}>
      <SharedHistoryContext>
        <SharedAutocompleteContext>
       
          <div className="onboard-editor sm:mx-3rem">
            <TextEditor
            />
          </div>
          
        </SharedAutocompleteContext>
      </SharedHistoryContext>
    </LexicalComposer>
    </SettingsContext>
  );
}

export default OnboardEditor;
