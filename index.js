import React from 'react';
import ReactDOM from 'react-dom';

// main app
import Questions from './src/Questions';
import Profiles from './src/Profiles';
import Alerts from './src/Alerts';

if (document.getElementById('questionsContent')) {
  ReactDOM.render(<div><Questions /><Alerts /></div>, document.getElementById('questionsContent'))
} else if (document.getElementById('profilesContent')) {
  ReactDOM.render(<div><Profiles /><Alerts /></div>, document.getElementById('profilesContent'))
} else {
  ReactDOM.render(<Alerts />, document.getElementById('quizContent'))
}