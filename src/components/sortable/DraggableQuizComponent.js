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
      labels: this.props.labels
    };
  }

  componentWillReceiveProps(nextProps) {
    if(JSON.stringify(this.state.item) != JSON.stringify(nextProps.item)){
      this.setState({item: nextProps.item});
    }
    if(JSON.stringify(this.state.labels) != JSON.stringify(nextProps.labels)){
      this.setState({labels: nextProps.labels});
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    return (JSON.stringify(this.state.item) != JSON.stringify(nextState.item) ||
           (JSON.stringify(this.state.labels) != JSON.stringify(nextProps.labels)));
  }

  createCheckbox = () => {
    let item = this.state.item;
    if(this.props.type.indexOf('answer') >= 0){
      return (<Checkbox label={this.state.labels && this.state.labels["pages.quiz.correct_answer"]} isChecked={item.correct} className={`correct-answer-${item.questionId}`} questionId={item.questionId} answerId={item.id}/>);
    }
    else if (this.props.type.indexOf('question') >= 0){
      return(<Checkbox label={this.state.labels && this.state.labels["general.mandatory"]} isChecked={item.required} className='required-question' questionId={item.id}/>)
    }
    return ;
  }

  createActions = () => {
    let item = this.state.item;
    if(this.props.type.indexOf('answer') >= 0){
      return (
        <div className='actions-wrapper'>
          <button className='remove-action' onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.removeAnswer();}}>{this.state.labels && this.state.labels["general.remove"]}</button>
        </div>  
      );
    }
    else if (this.props.type.indexOf('question') >= 0){
      return (
        <div className='actions-wrapper'>
          <button className='remove-action' onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.removeQuestion();}}>{this.state.labels && this.state.labels["general.remove"]}</button>
          <button className='duplicate-action' onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.duplicateQuestion();}}>{this.state.labels && this.state.labels["general.duplicate"]}</button>
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
    const componentFormat = this.props.type == 'profiles' ? 'profiles' : 'quiz'
    return(<DroppableComponent labels={this.state.labels} questionId={questionId} componentFormat={componentFormat} key={`answer-${questionId}`} type={`answer-${questionId}`} items={answers} droppableId={`answer-droppable-${questionId}`}/>)    
    // return false;
  }

  render() {
    const { index, type } = this.props;
    const item = this.state.item;
    let customClassName = '';
    let placeholder = '';
    let questionId = item.id
    if(type == 'question'){
      customClassName = `question-${item.id}`;
      placeholder = this.props.labels && this.props.labels["pages.quiz.new_question"];
    }
    else{
      customClassName = `question-${item.questionId} answer-${item.id}`;
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
              <li>
                <QuizEditorComponent placeholder={placeholder} content={item.text} className={customClassName} type={type} parentId={item.questionId} id={item.id} ></QuizEditorComponent>
                { item.answers && item.answers.length ? 
                  this.renderAnswers(item.answers, item.id)
                  :
                  <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); QuizStore.addAnswer(questionId);}}>{this.props.labels && this.props.labels["pages.quiz.add_new_answer"]}</button>
                }
                {this.createCheckbox()}
                {this.createActions()}
              </li>
            </div>
            {provided.placeholder}
            { (type == 'question')?
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); QuizStore.addQuestion(item.quizId, item.id);}}>{this.props.labels && this.props.labels["pages.quiz.add_new_question"]}</button>
              :
              null
            }
          </div>
        )}
      </Draggable>

    )
  }
}