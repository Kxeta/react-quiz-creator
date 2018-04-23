import ReactQuill from 'react-quill';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './EditorComponent.scss';
import { QuizStore } from '../../modules';


class ProfileEditorComponent extends Component {
  static propTypes = { 
    content: PropTypes.string, 
    formats: PropTypes.array, 
    modules: PropTypes.array, 
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    profileId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    className: PropTypes.string,
    placeholder: PropTypes.string,
    readOnly: PropTypes.bool,
    type: PropTypes.string
  };

  constructor(props){
    super(props);
    this.state = {
      content: null
    }
  }

  handleOnChange = (content, delta, source, editor) => {
    this.setState({ content })
    QuizStore.updateProfileContent(this.props.profileId, this.props.type, content);
  }

  handleOnBlur = () => {
    QuizStore.updateProfileContent(this.props.profileId, this.props.type, this.state.content);
  }

  componentWillMount(){
    this.setState({
      content : this.props.content
    })
  }

  render() {
    let formats = this.props.formats || [
      'bold', 'italic', 'link'
    ];
    let modules = this.props.modules || {
      toolbar:[
        ['bold', 'italic', 'link']
      ],
      keyboard: {
        bindings: {
          tab: 'disabled',
        }
      }
    };
    let classNames = this.props.className + ' rc-editor-wrapper';
    return (
      <ReactQuill value={ this.state.content || this.props.content }
                  theme="bubble"
                  formats={ formats }
                  modules={ modules }
                  id={ this.props.id || "" }
                  placeholder={ this.props.placeholder || "" }
                  readOnly={ this.props.readOnly == true }
                  className={ classNames }
                  onChange={this.handleOnChange}
                  onBlur={this.handleOnBlur}
                  bounds='#questionsContent'
                  name={this.props.id + '-' + this.props.profileId}
                  >
      </ReactQuill>
    )
  }
}

export default ProfileEditorComponent;