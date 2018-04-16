import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import './styles/main.scss';
import { DragDropComponent } from './components';
import { QuizStore } from './modules';



export default class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      items: []
    }
    if(window){
      window.updateQuizStateJSON = this.updateQuizStateJSON;
      window.getQuizStateJSON = this.getQuizStateJSON;
    }
  }

  componentDidMount() {
    window.updateQuizStateJSON = this.updateQuizStateJSON;
    window.getQuizStateJSON = this.getQuizStateJSON;
    window.getQuizStateStringifiedJSON = this.getQuizStateStringifiedJSON;
    // this.updateQuizStateJSON(this.getContentJSON());
   }

  getQuizStateJSON = () =>{
    return QuizStore.getJSONQuiz();
  }

  getQuizStateStringifiedJSON = () =>{
    return QuizStore.getStringfiedJSONQuiz();
  }
 
  updateQuizStateJSON = (items) => {
    QuizStore.quiz = items;
  }
  
  getContentJSON = () => {
    const json = [
      { 
        "id":567,
        "text":"Pergunta 1",
        "quizId":107,
        "answers":[
          { "id":462,
            "text":"Resposta 1 - pergunta 1",
            "correct":true,
            "order":1,
            "questionId": 567
          },
          { "id":463,
            "text":"Resposta 2 - pergunta 1",
            "correct":false,
            "order":2,
            "questionId": 567
          },
          { "id":464,
            "text":"Resposta 3 - pergunta 1",
            "correct":false,
            "order":3,
            "questionId": 567
          }
        ],
        "order":1,
        "required":true
      },
      { 
        "id":221,
        "text":"Pergunta 2",
        "quizId":107,
        "answers":[
          { "id":231,
            "text":"Resposta 1 - pergunta 2",
            "correct":true,
            "order":1,
            "questionId": 221
          },
          { "id":232,
            "text":"Resposta 2 - pergunta 2",
            "correct":false,
            "order":2,
            "questionId": 221
          },
          { "id":233,
            "text":"Resposta 3 - pergunta 2",
            "correct":false,
            "order":3,
            "questionId": 221
          }
        ],
        "order":2,
        "required":false
      }
    ];
  return json;
  }

  render () {
    return (
      <Provider QuizStore = { QuizStore }>
        <div>
          <DragDropComponent type='question' items={ QuizStore } callbackUpdate={this.updateQuizStateJSON} droppableId='question-droppable'/>
          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); QuizStore.getJSONQuiz(); } }>Get Json!</button>
        </div>
      </Provider>
    );
  }
}