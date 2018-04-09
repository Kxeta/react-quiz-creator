import React, { Component } from 'react';
import './styles/main.scss';



export default class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      items: []
    }
    this.questions = [];
  }

  componentWillMount(){
    console.log(this.getContentJSON());
    this.setState({items: this.getContentJSON()})
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
    return <div/>;
  }
}