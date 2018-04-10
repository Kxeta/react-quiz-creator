import React, { Component } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import DroppableComponent from './DroppableComponent';
import './SortableComponent.scss';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};


export default class DragDropComponent extends Component{

  static propTypes = { 
    items: PropTypes.array,
    type: PropTypes.string,
    droppableId: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      items: this.props.items
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

 

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }


    let items = this.state.items;


    if(result.type.indexOf('question') >= 0){
      let list = this.state.items
      items = reorder(
        list,
        result.source.index,
        result.destination.index
      );
      items[result.destination.index].order = result.destination.index + 1;
      items[result.source.index].order = result.source.index + 1;
    }

    if(result.type.indexOf('answer') >= 0){
      let questionId = parseInt(result.type.split('answer-')[1]) - 1;
      var list = this.state.items[questionId].answers;
      let answers = reorder(
        list,
        result.source.index,
        result.destination.index
      );
      answers[result.destination.index].order = result.destination.index + 1;
      answers[result.source.index].order = result.source.index + 1;
      let items = this.state.items;
      items[questionId].answers = answers;
    }

    this.setState({items});

    // QuizStore.setQuiz(items);
  }

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <DroppableComponent type={ this.props.type } items={this.state.items} droppableId={ this.props.droppableId }>
        </DroppableComponent>
      </DragDropContext>
    );
  }
  
}