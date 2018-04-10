import React, { Component } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import DraggableComponent from './DraggableComponent';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default class DroppableComponent extends Component{

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
  }

  render() {
    return (
      <Droppable type={ this.props.type } droppableId={ this.props.droppableId } key={ this.props.droppableId }>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}>
            {this.props.items.map((item, index) => (
              <DraggableComponent type={ this.props.type } item={ item } index={ index }></DraggableComponent>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  }
  
}