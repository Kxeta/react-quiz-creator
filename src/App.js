import React, { Component } from 'react';
import './styles/main.scss';
import { SortableList, DragDropComponent } from './components';



export default class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      items: []
    }
  }

  componentDidMount() {
    window.updateQuizStateJSON = this.updateQuizStateJSON;
    window.getQuizStateJSON = this.getQuizStateJSON;
    this.updateQuizStateJSON(this.getContentJSON());
   }

  getQuizStateJSON = () =>{
    return this.state.items;
  }
 
  updateQuizStateJSON = (items) => {

    this.setState({
      items
    });
  }
  
  getContentJSON = () => {
    const json = [
      { 
        "id":211,
        "text":"Pergunta 1",
        "quizId":107,
        "answers":[
          { "id":462,
            "text":"Resposta 1 - pergunta 1",
            "correct":true,
            "order":1,
            "questionId": 221
          },
          { "id":463,
            "text":"Resposta 2 - pergunta 1",
            "correct":false,
            "order":2,
            "questionId": 221
          },
          { "id":464,
            "text":"Resposta 3 - pergunta 1",
            "correct":false,
            "order":3,
            "questionId": 221
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
    return <DragDropComponent type='question' items={this.state.items} callbackUpdate={this.updateQuizStateJSON} droppableId='question-droppable'/>
  }
}