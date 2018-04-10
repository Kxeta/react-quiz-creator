import React, { Component } from 'react';
import './styles/main.scss';
import { SortableList, DragDropComponent } from './components';



export default class App extends Component {

  componentWillMount(){
    let items = this.getContentJSON();
    QuizStore.setQuiz(items);
  }
  updateStateJSON = () => {

  }
  
  getContentJSON = () => {
    const json = [{
      id: null,
      order: 1,
      content: "Question 1 - criando um quiz novo",
      quizId: null,
      required: true,
      answers: [
          {
              content: "Resposta da pergunta novo 1 - 1",
              correct: true,
              id: null,
              order: 1,
              questionId: null,
          },
          {
              content: "Resposta da pergunta novo 1 - 2",
              correct: false,
              id: null,
              order: 2,
              questionId: null,
          }
      ]
  },
      {
          id: null,
          order: 2,
          content: "Question 2 - criando um quiz novo 2",
          quizId: null,
          required: false,
          answers: [
              {
                  content: "Resposta da pergunta novo 2 - 1",
                  correct: false,
                  id: null,
                  order: 1,
                  questionId: null,
              },
              {
                  content: "Resposta da pergunta novo 2 - 2",
                  correct: true,
                  id: null,
                  order: 2,
                  questionId: null,
              }
          ]
      }
  ];
  return json;
  }

  render () {
    return <DragDropComponent type='question' items={this.getContentJSON()}droppableId='question-droppable'/>
  }
}