import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import { EditorComponent } from '..';
import DroppableComponent from './DroppableComponent';
import './SortableComponent.scss';

export default class DraggableComponent extends Component{
  static propTypes = { 
    item: PropTypes.object,
    index: PropTypes.number,
  };

  renderAnswers = (answers, questionKey) => {
    let answersArr = [];
    return(<DroppableComponent key={`answer-${questionKey}`} type={`answer-${questionKey}`} items={answers} droppableId={`answer-droppable-${questionKey}`}/>)    
  }

  render() {
    const { item, index, type } = this.props;
    this.renderAnswers();
    return (
      <Draggable key={`${type}-${item.order}`} type={ type } draggableId={`${type}-${item.order}`} index={index}>
        {(provided, snapshot) => (
          <div>
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              className='quiz-container'>
              <span {...provided.dragHandleProps} style={{ display: 'inline-block', margin: '0 10px', border: '1px solid #000'}}>Drag</span>
              <EditorComponent content={item.content}></EditorComponent>
              { item.answers && item.answers.length ? 
                this.renderAnswers(item.answers, item.order)
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