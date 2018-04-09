import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import './styles/main.scss';
import { SortableList, DroppableComponent } from './components';
import { QuizStore } from './modules';



export default class App extends Component {

  componentWillMount(){
    let items = this.getContentJSON();
    QuizStore.setQuiz(items);
  }
  updateStateJSON = () => {

  }
  
  getContentJSON = () => {
    return [
      {
        "question" : {
          "content" : "<p>Teste questão 1</p>",
          "order" : 1,
          "answers" : []
        }
      },
      {
        "question" : {
          "content" : "<p>Teste questão <b>2</b></p>",
          "order" : 2,
          "answers" : []
        }
      }
    ];
  }

  renderQuiz = () =>{
  }
  render () {
    return (
      <Provider QuizStore = { QuizStore }>
        <DroppableComponent items={QuizStore.questions} />
      </Provider>
    );
  }
}