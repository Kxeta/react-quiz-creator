import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import './styles/main.scss';
import { EditorComponent } from './components';
import { QuizStore } from './modules';



export default class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      items: []
    }
    this.questions = [];
  }

  componentWillMount(){
    let items = this.getContentJSON();
    this.setState({items});
    QuizStore.setQuestions(items);
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
  render () {
    return (
      <Provider QuizStore = { QuizStore }>
        <EditorComponent />
      </Provider>
    );
  }
}