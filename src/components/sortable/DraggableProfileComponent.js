import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import { ProfileEditorComponent, ImageUploader } from '..';
import { QuizStore } from '../../modules';
import './SortableComponent.scss';

export default class DraggableProfileComponent extends Component{
  static propTypes = { 
    item: PropTypes.object,
    index: PropTypes.number
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

  createActions = () => {
    let item = this.state.item;
    return (
      <div className='actions-wrapper'>
        <button className='remove-action' onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.removeProfile();}}>Remover</button>
        <button className='duplicate-action' onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.duplicateProfile();}}>Duplicar</button>
      </div>  
    );
  }

  removeProfile = () => {
    let item = this.state.item;
    QuizStore.removeProfile(item.id);
  }

  duplicateProfile = () => {
    let item = this.state.item;
    let createdProfile = QuizStore.duplicateProfile(item.id);
    setTimeout(() => {
      this.focusDuplicatedProfile(createdProfile);
    }, 500);
  }

  focusDuplicatedProfile = (id) => {
    let profileEl = document.querySelector(`.profile-${id}`)
    let offset = profileEl.offsetTop - (profileEl.scrollTop || document.documentElement.scrollTop) + profileEl.clientTop
    window.scrollTo(
      document.querySelector(`.profile-${id}`).offset,
      1000
    );
    profileEl.querySelector('.ql-editor').focus();
  }

  onBadgeChange = (file, base64) => {
    QuizStore.updateProfileBadge(this.state.item.id, file, base64);
  }

  render() {
    const { index, type } = this.props;
    const item = this.state.item;
    let profileId = item.id
    let customClassName = `profile-${item.id}`;
    let titlePlaceholder = 'New Profile';
    let descriptionPlaceholder = 'New Profile Text';
    return (
      <Draggable key={`${type}-${item.id}`} type={ type } draggableId={`${type}-${item.id}`} id={index} index={index}>
        {(provided, snapshot) => (
          <div className={`draggable-${ type }`}>
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              className='rc-quiz-container'>
              <span {...provided.dragHandleProps} style={{ display: 'inline-block', margin: '0 10px', border: '1px solid #000'}}>Drag</span>
              <ProfileEditorComponent placeholder={titlePlaceholder} content={item.name} profileId={item.id} className={customClassName} type='title' id={item.id} ></ProfileEditorComponent>
              <ProfileEditorComponent placeholder={descriptionPlaceholder} content={item.description} profileId={item.id} className={customClassName} type='description' id={`${item.id}-description`} ></ProfileEditorComponent>
              <ImageUploader onChange={this.onBadgeChange} badge={item.badge}></ImageUploader>
              {this.createActions()}
            </div>
            {provided.placeholder}
          </div>
        )}
      </Draggable>

    )
  }
}