import React, { Component } from 'react';
import './styles/main.scss';
import { SortableList, DragDropComponent } from './components';



export default class App extends Component {

 
  updateStateJSON = () => {

  }
  
  getContentJSON = () => {
    const json = [{
      id: 1,
      order: 1,
      content: "Question 1 - criando um quiz novo",
      quizId: null,
      required: true,
      answers: [
          {
              content: "Resposta da pergunta novo 1 - 1",
              correct: true,
              id: 11,
              order: 1,
              questionId: null,
          },
          {
              content: "Resposta da pergunta novo 1 - 2",
              correct: false,
              id: 12,
              order: 2,
              questionId: null,
          }
      ]
  },
      {
          id: 2,
          order: 2,
          content: "Question 2 - criando um quiz novo 2",
          quizId: null,
          required: false,
          answers: [
              {
                  content: "Resposta da pergunta novo 2 - 1",
                  correct: false,
                  id: 21,
                  order: 1,
                  questionId: null,
              },
              {
                  content: "Resposta da pergunta novo 2 - 2",
                  correct: true,
                  id: 22,
                  order: 2,
                  questionId: null,
              }
          ]
      },
      {
          id: 3,
          order: 3,
          content: "Question 3 - criando um quiz novo 3",
          quizId: null,
          required: false,
          answers: [
              {
                  content: "Resposta da pergunta novo 3 - 1",
                  correct: false,
                  id: 31,
                  order: 1,
                  questionId: null,
              },
              {
                  content: "Resposta da pergunta novo 3 - 2",
                  correct: true,
                  id: 31,
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