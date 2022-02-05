import React, { useCallback, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ReactMDViewer } from '../lib';
import initialText from './initial.md?raw';

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
    <div
      style={{
        margin: '0 auto',
        maxWidth: '60rem',
        display: 'flex',
        justifyContent: 'stretch',
        alignItems: 'stretch',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          padding: '0.5rem',
        }}
      >
        <h1>Editor</h1>
        <textarea style={{ flex: '1', padding: '0.5rem' }} onChange={onChange}>
          {text}
        </textarea>
      </div>
      <div
        style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          padding: '0.5rem',
        }}
      >
        <h1>Viewer</h1>
        <div
          style={{
            flex: '1',
            border: '1px solid #666',
            padding: '0.5rem',
          }}
        >
          <ErrorBoundary
            fallbackRender={(props) => (
              <pre style={{ color: 'red' }}>
                {props.error.name}: {props.error.message}
                {props.error.stack}
              </pre>
            )}
          >
            <ReactMDViewer text={text} />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}

export default App;
