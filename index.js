import React from 'react';
import ReactDOM from 'react-dom';

// main app
import App from './src/App';
import App2 from './src/App2';

if(document.getElementById('questionsContent')){
  ReactDOM.render(<App />, document.getElementById('questionsContent'))
}
if(document.getElementById('profilesContent')){
  ReactDOM.render(<App2 />, document.getElementById('profilesContent'))
}