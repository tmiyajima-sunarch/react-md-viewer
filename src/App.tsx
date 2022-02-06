import React, { useCallback, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ReactMDViewer } from '../lib';
import initialText from './initial.md?raw';
import styles from './App.module.css';

function App() {
  const [text, setText] = useState(initialText);

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = event.target.value;
      setText(value);
    },
    []
  );

  return (
    <div className={styles.root}>
      <div className={styles.column}>
        <h1>Editor</h1>
        <textarea className={styles.editor} onChange={onChange}>
          {text}
        </textarea>
      </div>
      <div className={styles.column}>
        <h1>Viewer</h1>
        <div className={styles.viewer}>
          <ErrorBoundary
            fallbackRender={(props) => (
              <pre style={{ color: 'red' }}>
                {props.error.name}: {props.error.message}
                {props.error.stack}
              </pre>
            )}
          >
            <ReactMDViewer
              text={text}
              classNames={{
                blockquote: styles.blockquote,
                ul: styles.ul,
                ol: styles.ol,
                code: styles.code,
                pre: styles.pre,
              }}
            />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}

export default App;
