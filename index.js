import React from 'react';
import ReactDOM from 'react-dom';

// main app
import Questions from './src/Questions';
import Profiles from './src/Profiles';

if(document.getElementById('questionsContent')){
  ReactDOM.render(<Questions />, document.getElementById('questionsContent'))
  console.log('Questions')
}
if(document.getElementById('profilesContent')){
  ReactDOM.render(<Profiles />, document.getElementById('profilesContent'))
  console.log('Profiles');
}