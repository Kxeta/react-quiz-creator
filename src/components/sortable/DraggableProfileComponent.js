import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import { ProfileEditorComponent, ImageUploader } from '..';
import { QuizStore } from '../../modules';
import './SortableComponent.scss';

export default class DraggableProfileComponent extends Component{
  static propTypes = { 
    item: PropTypes.object,
    index: PropTypes.number,
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

  createActions = () => {
    let item = this.state.item;
    return (
      <div className='actions-wrapper action-wrapper-profile'>
        <button className='btn btn-quiz-action remove-action' onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.removeProfile();}}><i class="button-icon glyphicon glyphicon-trash" /> {this.state.labels && this.state.labels["general.remove"]}</button>
        <button className='btn btn-quiz-action duplicate-action' onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.duplicateProfile();}}><i class="button-icon glyphicon glyphicon-duplicate" /> {this.state.labels && this.state.labels["general.duplicate"]}</button>
      </div>  
    );
  }

  removeProfile = () => {
    let item = this.state.item;
    if(item.code){
      window.removeMedia(item.code);
    }
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
    if(this.state.item.code){
      window.removeMedia(this.state.item.code);
    }
    QuizStore.updateProfileBadge(this.state.item.id, file, base64);
  }

  render() {
    const { index, type } = this.props;
    const item = this.state.item;
    let profileId = item.id
    let customClassName = `profile-${item.id}`;
    let customDescriptionClassName = customClassName + ' description-editor';
    let titlePlaceholder = this.state.labels && this.state.labels["pages.quiz.add_new_profile"];
    let descriptionPlaceholder = this.state.labels && this.state.labels["pages.quiz.new_description_profile"];
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
                <li className='rc-quiz-content'>
                  <ProfileEditorComponent placeholder={titlePlaceholder} content={item.name} profileId={item.id} className={customClassName} type='title' id={item.id} ></ProfileEditorComponent>
                  <ProfileEditorComponent placeholder={descriptionPlaceholder} content={item.description} profileId={item.id} className={customDescriptionClassName} type='description' id={`${item.id}-description`} ></ProfileEditorComponent>
                  <div className='profile-image-upload-wrapper'>
                    <p className='profile-image-upload-title'>{this.state.labels && this.state.labels["pages.quiz.insert_image"]}</p>
                    <div className='profile-image-upload-content'>
                      <div className='profile-image-upload'>
                        <ImageUploader labels={this.state.labels} onChange={this.onBadgeChange} badge={item.badge}></ImageUploader>
                      </div>
                      <div className='profile-image-upload-description'>
                        <p>{this.state.labels && this.state.labels["pages.quiz.insert_image_tip_1"]}</p>
                        <p>{this.state.labels && this.state.labels["pages.quiz.insert_image_tip_2"]}</p>
                        <p>{this.state.labels && this.state.labels["pages.quiz.insert_image_tip_3"]}</p>
                      </div>

                    </div>

                  </div>
                </li>
                {this.createActions()}
              </div>
            </div>
            {provided.placeholder}
          </div>
        )}
      </Draggable>

    )
  }
}