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

  renderAnswers(items) {
    return (
      <DroppableComponent items={items} />
    )

  }

  render() {
    const { item, index } = this.props;

    return (
      <Draggable key={item.id} draggableId={item.id} index={index}>
        {(provided, snapshot) => (
          <div>
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              className={'quiz-container ' + this.props.type && this.props.type == 'answer' ? 'answer-container' : ''}>
              <span {...provided.dragHandleProps} style={{ display: 'inline-block', margin: '0 10px', border: '1px solid #000'}}>Drag</span>
              <EditorComponent content={item.content}></EditorComponent>
              { sizeof(item.answers) ? 
                this.renderAnswers(item.answers)
                :
                ''
              }
            </div>
            {provided.placeholder}
          </div>
        )}
      </Draggable>
    )
  }
}