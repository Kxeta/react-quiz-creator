import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Droppable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import DraggableProfileComponent from './DraggableProfileComponent';
import { QuizStore } from '../../modules';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default class DroppableComponent extends Component{

  static propTypes = { 
    items: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object
    ]),
    type: PropTypes.string,
    droppableId: PropTypes.string,
    componentFormat: PropTypes.string,
    questionId: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ])
  };

  constructor(props) {
    super(props);
    this.state = {
      items: this.props.items
    };
  }

  componentWillReceiveProps(nextProps) {
    if(JSON.stringify(this.state.items) != JSON.stringify(nextProps.items)){
      this.setState({items: nextProps.items});
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (JSON.stringify(this.state.items) != JSON.stringify(nextState.items))
  }

  render() {
    if(!this.state.items){
      return null;
    }
    let lastItemId = 0;
    let quizId = 0;
    if(this.state.items.length){
      lastItemId = this.state.items[this.state.items.length - 1].id;
      quizId = this.state.items[this.state.items.length - 1].quizId;
    }
    return (
      <Droppable type={ this.props.type } droppableId={ this.props.droppableId } key={ this.props.droppableId }>
        {(provided, snapshot) => (
          <div 
            ref={provided.innerRef}>
            {this.state.items.map((item, index) => {
              if(this.props.componentFormat == 'quiz'){
                return(
                  <DraggableQuizComponent type={ this.props.type } item={ item } index={ index } lastItem={ (this.state.items.length-1) == index}></DraggableQuizComponent>
                )
              }
              else{
                return(
                  <DraggableProfileComponent type={ this.props.componentFormat } item={ item } index={ index }></DraggableProfileComponent>
                )
              }
            }
            )}
            {provided.placeholder}
            {
              this.props.componentFormat == 'quiz' ? 
                  this.props.type == 'question' ?
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); QuizStore.addQuestion(quizId, lastItemId);}}>+ Adicionar nova pergunta</button>
                    :
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); QuizStore.addAnswer(this.props.questionId);}}>+ Adicionar nova resposta</button>
                :
                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); QuizStore.addProfile(quizId, lastItemId);}}>+ Adicionar novo perfil</button>
            }
          </div>
        )}
      </Droppable>
    );
  }
  
}