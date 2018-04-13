import React, { Component } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import DroppableComponent from './DroppableComponent';
import './SortableComponent.scss';
import { QuizStore } from '../../modules';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  result[startIndex].order = startIndex + 1;
  result[endIndex].order = endIndex + 1;

  return result;
};

@inject('QuizStore')
@observer
export default class DragDropComponent extends Component{

  static propTypes = { 
    QuizStore: PropTypes.object,
    type: PropTypes.string,
    droppableId: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    if(result.type.indexOf('question') >= 0){
      const destination = result.destination.index;
      const begin = result.source.index;
      let items = [...this.props.QuizStore.items];
      items = reorder(items, begin, destination)
      console.log('Reordered', items);
      QuizStore.setQuiz(items);
    }

    else if(result.type.indexOf('answer') >= 0){
      let items = this.props.QuizStore.items;
      let questionId = parseInt(result.type.split('-')[1]);
      let questionIndex = items.findIndex((item) => {return item.id === questionId});
      if(questionIndex >= 0){
        var list = items[questionIndex].answers;
        let answers = reorder(
          list,
          result.source.index,
          result.destination.index
        );
        items[questionIndex].answers = answers;
        console.log('Reordered', items);
        QuizStore.setQuiz(items);
      }
      else{
        return;
      }
    }
  }

  render() {
    console.log('Render DragDrop!', this.props.QuizStore.items); 
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <DroppableComponent type={ this.props.type } items={this.props.QuizStore.items} droppableId={ this.props.droppableId }>
        </DroppableComponent>
      </DragDropContext>
    );
  }
  
}