import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import { QuizEditorComponent, Checkbox } from '..';
import DroppableComponent from './DroppableComponent';
import { QuizStore } from '../../modules';
import './SortableComponent.scss';

export default class DraggableQuizComponent extends Component{
  static propTypes = { 
    item: PropTypes.object,
    index: PropTypes.number,
    itemsQuantity: PropTypes.number,
    lastItem: PropTypes.bool,
    labels: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object
    ]),
  };

  constructor(props) {
    super(props);
    this.state = {
      item: this.props.item,
      labels: this.props.labels,
      itemsQuantity: this.props.itemsQuantity,
      
    };
  }

  componentWillReceiveProps(nextProps) {
    if(JSON.stringify(this.state.item) != JSON.stringify(nextProps.item)){
      this.setState({item: nextProps.item});
    }
    if(JSON.stringify(this.state.labels) != JSON.stringify(nextProps.labels)){
      this.setState({labels: nextProps.labels});
    }
    if(this.state.itemsQuantity != nextProps.itemsQuantity){
      this.setState({itemsQuantity: nextProps.itemsQuantity});
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    return (JSON.stringify(this.state.item) != JSON.stringify(nextState.item) ||
           (JSON.stringify(this.state.labels) != JSON.stringify(nextProps.labels)) ||
           (this.state.itemsQuantity != nextProps.itemsQuantity));
  }

  createActions = () => {
    let item = this.state.item;
    if(this.props.type.indexOf('answer') >= 0){
      return (
        <div className='bottom-actions'>
          <Checkbox label={this.state.labels && this.state.labels["pages.quiz.correct_answer"]} isChecked={item.correct} className={`correct-answer-${item.questionId}`} questionId={item.questionId} answerId={item.id}/>
          <div className='actions-wrapper'>
            <button className='btn btn-quiz-action remove-action' onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.removeAnswer();}} disabled={this.props.itemsQuantity <= 1 || window.minAnswers > 1}><i className="button-icon glyphicon glyphicon-trash" /> {this.state.labels && this.state.labels["general.remove"]}</button>
          </div>  
        </div>  
      );
    }
    else if (this.props.type.indexOf('question') >= 0){
      return (
        <div className='bottom-actions bottom-actions-card'>
          <Checkbox label={this.state.labels && this.state.labels["general.mandatory"]} isChecked={item.required} className='required-question' questionId={item.id}/>
          <div className='actions-wrapper'>
            <button className='btn btn-quiz-action remove-action' onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.removeQuestion();}} disabled={this.props.itemsQuantity <= 1}><i className="button-icon glyphicon glyphicon-trash" /> {this.state.labels && this.state.labels["general.remove"]}</button>
            <button className='btn btn-quiz-action duplicate-action' onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.duplicateQuestion();}}><i className="button-icon glyphicon glyphicon-duplicate" /> {this.state.labels && this.state.labels["general.duplicate"]}</button>
          </div>  
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

  renderAnswers = (answers, questionId) => {
    return(<DroppableComponent labels={this.state.labels} questionId={questionId} componentFormat={'quiz'} key={`answer-${questionId}`} type={`answer-${questionId}`} items={answers} droppableId={`answer-droppable-${questionId}`}/>)    
    // return false;
  }

  render() {
    const { index, type } = this.props;
    const item = this.state.item;
    let customClassName = '';
    let placeholder = '';
    let questionId = item.id
    if(type == 'question'){
      customClassName = `question-${item.id} question-editor`;
      placeholder = this.props.labels && this.props.labels["pages.quiz.new_question"];
    }
    else{
      customClassName = `question-${item.questionId} answer-${item.id} answer-editor`;
      placeholder = this.props.labels && this.props.labels["pages.quiz.new_answer"];
      questionId = item.questionId
    }
    return (
      <Draggable key={`${type}-${item.id}`} type={ type } draggableId={`${type}-${item.id}`} id={index} index={index}>
        {(provided, snapshot) => (
          <div className={`draggable-${ type }`}>
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              className={'rc-quiz-container ' + type}>
              <span {...provided.dragHandleProps} className='drag-handler'>
                <span>&middot;</span>
                <span>&middot;</span>
                <span>&middot;</span>
              </span>
              <div className='rc-quiz-content-wrapper'>
                <li className={'rc-quiz-content ' + type}>
                  <QuizEditorComponent placeholder={placeholder} content={item.text} className={customClassName} type={type} parentId={item.questionId} id={item.id} ></QuizEditorComponent>
                  { item.answers && item.answers.length ? 
                    this.renderAnswers(item.answers, item.id)
                    :
                    null
                  }
                </li>
                {this.createActions()}
              </div>
            </div>
            {provided.placeholder}
            { (type == 'question')?
              <button className='btn btn-add-hovering' onClick={(e) => { e.preventDefault(); e.stopPropagation(); QuizStore.addQuestion(item.quizId, item.id);}}>
                <span>
                  <i className='glyphicon glyphicon-plus'></i>
                  {this.props.labels && this.props.labels["pages.quiz.add_new_question"]}
                </span>
              </button>
              :
              null
            }
          </div>
        )}
      </Draggable>

    )
  }
}