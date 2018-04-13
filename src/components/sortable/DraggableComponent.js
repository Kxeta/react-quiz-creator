import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import { EditorComponent, Checkbox } from '..';
import DroppableComponent from './DroppableComponent';
import './SortableComponent.scss';

export default class DraggableComponent extends Component{
  static propTypes = { 
    item: PropTypes.object,
    index: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.state = {
      item: this.props.item
    };
  }

  shouldComponentUpdate(nextProps, nextState){
    return ((JSON.stringify(this.state.item) != JSON.stringify(nextProps.item)) ||
           (JSON.stringify(this.state.item) != JSON.stringify(nextState.item)));
   }

  createCheckbox = () => {
    let item = this.state.item;
    if(this.props.type.indexOf('answer') >= 0){
      return (<Checkbox label={'Correta'} isChecked={item.correct} className={`correct-answer-${item.questionId}`}/>);
    }
    else if (this.props.type.indexOf('question') >= 0){
      return(<Checkbox label={'Obrigatória'} isChecked={item.required} className='required-question'/>)
    }
    return ;
  }

  renderAnswers = (answers, questionKey) => {
    let answersArr = [];
    return(<DroppableComponent key={`answer-${questionKey}`} type={`answer-${questionKey}`} items={answers} droppableId={`answer-droppable-${questionKey}`}/>)    
  }

  render() {
    const { index, type } = this.props;
    const item = this.state.item;
    this.renderAnswers();
    console.log('Render Drag!', this.state.item);
    return (
      <Draggable key={`${type}-${item.id}`} type={ type } draggableId={`${type}-${item.id}`} index={index}>
        {(provided, snapshot) => (
          <div>
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              className='rc-quiz-container'>
              <span {...provided.dragHandleProps} style={{ display: 'inline-block', margin: '0 10px', border: '1px solid #000'}}>Drag</span>
              <EditorComponent content={item.text} type={type} parentId={item.questionId} selfId={item.id} ></EditorComponent>
              {this.createCheckbox()}
              { item.answers && item.answers.length ? 
                this.renderAnswers(item.answers, item.id)
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