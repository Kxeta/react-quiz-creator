import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Droppable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import DraggableQuizComponent from './DraggableQuizComponent';
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
    labels: PropTypes.oneOfType([
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
      items: this.props.items,
      labels: this.props.labels
    };
  }

  componentWillReceiveProps(nextProps) {
    if(JSON.stringify(this.state.items) != JSON.stringify(nextProps.items)){
      this.setState({items: nextProps.items});
    }
    if(JSON.stringify(this.state.labels) != JSON.stringify(nextProps.labels)){
      this.setState({labels: nextProps.labels});
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (JSON.stringify(this.state.items) != JSON.stringify(nextState.items) ||
           (JSON.stringify(this.state.labels) != JSON.stringify(nextProps.labels)));
  }

  render() {
    if(!this.state.items){
      return null;
    }
    let lastItemId = -1;
    let quizId = null;
    if(this.state.items.length){
      lastItemId = this.state.items[this.state.items.length - 1].id;
      quizId = this.state.items[this.state.items.length - 1].quizId;
    }
    let listClassName = "ordered-list";
    if(this.props.type.indexOf('question') >= 0){
      listClassName += " questions-list";
    }
    else if(this.props.type.indexOf('answer') >= 0){
      listClassName += " answers-list";
    }
    else if(this.props.type.indexOf('profiles') >= 0){
      listClassName += " profiles-list";
    }
    return (
      <Droppable type={ this.props.type } droppableId={ this.props.droppableId } key={ this.props.droppableId }>
        {(provided, snapshot) => (
          <div 
            ref={provided.innerRef}>
            <ol className={listClassName}>
              {this.state.items.map((item, index) => {
                if(this.props.componentFormat == 'quiz'){
                  return(
                    <DraggableQuizComponent labels={this.state.labels} type={ this.props.type } item={ item } index={ index } lastItem={ (this.state.items.length-1) == index}></DraggableQuizComponent>
                  )
                }
                else{
                  return(
                    <DraggableProfileComponent labels={this.state.labels} type={ this.props.componentFormat } item={ item } index={ index }></DraggableProfileComponent>
                  )
                }
              }
              )}
            </ol>
            {provided.placeholder}
            {
              this.props.componentFormat == 'quiz' ? 
                  this.props.type == 'question' ?
                    <div className='new-component-card'>
                      <button className='btn btn-add-new-component add-new-question' onClick={(e) => { e.preventDefault(); e.stopPropagation(); QuizStore.addQuestion(quizId, lastItemId);}}>
                        <i className='glyphicon glyphicon-plus'></i>
                        {this.state.labels && this.state.labels["pages.quiz.add_new_question"]}
                      </button>
                    </div>
                    :
                      <button className='btn btn-add-new-component add-new-answer' onClick={(e) => { e.preventDefault(); e.stopPropagation(); QuizStore.addAnswer(this.props.questionId);}}><i className='glyphicon glyphicon-plus'></i>{this.state.labels && this.state.labels["pages.quiz.add_new_answer"]}</button>
                :
                <div className='new-component-card'>
                  <button className='btn btn-add-new-component add-new-question' onClick={(e) => { e.preventDefault(); e.stopPropagation(); QuizStore.addProfile(quizId);}}>
                    <i className='glyphicon glyphicon-plus'></i>
                    {this.state.labels && this.state.labels["pages.quiz.add_new_profile"]}
                  </button>
                </div>
            }
          </div>
        )}
      </Droppable>
    );
  }
  
}