import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import { EditorComponent, Checkbox } from '..';
import DroppableComponent from './DroppableComponent';
import { QuizStore } from '../../modules';
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

  componentWillReceiveProps(nextProps) {
    if(JSON.stringify(this.state.item) != JSON.stringify(nextProps.item)){
      this.setState({item: nextProps.item});
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    return (JSON.stringify(this.state.item) != JSON.stringify(nextState.item));
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

  createActions = () => {
    let item = this.state.item;
    if(this.props.type.indexOf('answer') >= 0){
      return (
        <div className='actions-wrapper'>
          <button className='remove-action' onClick={this.removeAnswer}>Remover</button>
        </div>  
      );
    }
    else if (this.props.type.indexOf('question') >= 0){
      return (
        <div className='actions-wrapper'>
          <button className='remove-action' onClick={this.removeQuestion}>Remover</button>
          <button className='duplicate-action' onClick={this.duplicateQuestion}>Duplicar</button>
        </div>  
      );
    }
    return ;
  }

  removeAnswer = () => {
    let item = this.state.item;
    QuizStore.removeAnswer(item.id, item.questionId);
  }

  removeQuestion = () => {
    let item = this.state.item;
    QuizStore.removeQuestion(item.id);
  }

  duplicateQuestion = () => {
    let item = this.state.item;
    let createdQuestion = QuizStore.duplicateQuestion(item.id);
    console.log(createdQuestion);    
    setTimeout(() => {
      this.focusDuplicatedQuestion(createdQuestion);
    }, 500);
  }

  focusDuplicatedQuestion = (id) => {
    let questionEl = document.querySelector(`.question-${id}`)
    let offset = questionEl.offsetTop - (questionEl.scrollTop || document.documentElement.scrollTop) + questionEl.clientTop
    window.scrollTo(
      document.querySelector(`.question-${id}`).offset,
      1000
    );
    questionEl.querySelector('.ql-editor').focus();
  }

  renderAnswers = (answers, questionKey) => {
    return(<DroppableComponent key={`answer-${questionKey}`} type={`answer-${questionKey}`} items={answers} droppableId={`answer-droppable-${questionKey}`}/>)    
    // return false;
  }

  render() {
    const { index, type } = this.props;
    const item = this.state.item;
    let customClassName = '';
    let placeholder = '';
    if(type == 'question'){
      customClassName = `question-${item.id}`;
      placeholder = 'New Question';
    }
    else{
      customClassName = `question-${item.questionId} answer-${item.id}`;
      placeholder = 'New Answer';
    }
    return (
      <Draggable key={`${type}-${item.id}`} type={ type } draggableId={`${type}-${item.id}`} id={index} index={index}>
        {(provided, snapshot) => (
          <div>
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              className='rc-quiz-container'>
              <span {...provided.dragHandleProps} style={{ display: 'inline-block', margin: '0 10px', border: '1px solid #000'}}>Drag</span>
              <EditorComponent placeholder={placeholder} content={item.text} className={customClassName} type={type} parentId={item.questionId} selfId={item.id} ></EditorComponent>
              {this.createCheckbox()}
              {this.createActions()}
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