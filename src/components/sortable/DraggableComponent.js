import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import { EditorComponent } from '..';
import './SortableComponent.scss';

export default class DraggableComponent extends Component{
  static propTypes = { 
    item: PropTypes.object,
    index: PropTypes.number,
  };

  render() {
    const { item, index } = this.props;
    return (
      <Draggable key={item.id} draggableId={item.id} index={index}>
        {(provided, snapshot) => (
          <div>
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className='quiz-container'>
              <EditorComponent content={item.content}></EditorComponent>
            </div>
            {provided.placeholder}
          </div>
        )}
      </Draggable>
    )
  }
}