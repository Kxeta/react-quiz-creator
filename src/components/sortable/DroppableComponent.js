import React, { Component } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import { QuizStore } from '../../modules';
import DraggableComponent from './DraggableComponent';
import './SortableComponent.scss';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default class DroppableComponent extends Component{

  static propTypes = { 
    items: PropTypes.object,
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


    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );
    this.setState({
      items
    });
    QuizStore.setQuiz(items);
  }

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="quiz-droppable-wrapper">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}>
              {this.state.items.map((item, index) => (
                <DraggableComponent item={ item } index={ index }></DraggableComponent>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
  
}