import ReactQuill from 'react-quill';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './EditorComponent.scss';
import { QuizStore } from '../../modules';


class EditorComponent extends Component {
  static propTypes = { 
    content: PropTypes.string, 
    formats: PropTypes.array, 
    modules: PropTypes.array, 
    id: PropTypes.string,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    readOnly: PropTypes.bool,
    type: PropTypes.string,
    parentId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    selfId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ])
  };

  constructor(props){
    super(props);
    this.state = {
      content: null
    }
  }

  handleOnChange = (content, delta, source, editor) => {
    this.setState({ content })
  }

  componentWillMount(){
    this.setState({
      content : this.props.content
    })
  }

  onKeyEnterHandler = () => {
    console.log('Enter!', this.props.parentId, this.props.selfId);
    QuizStore.addAnswer(this.props.parentId || this.props.selfId);
    this.focusNewAnser();
  }

  focusNewAnser = () =>{
    const questionClass = document.activeElement.parentNode.parentNode.classList[1];
    let allEl = document.querySelectorAll(`.${questionClass}`);
    let lastEl = allEl[allEl.length - 1]
    lastEl.querySelector('.ql-editor').focus();
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
          enter: {
            key: 13,
            handler: this.onKeyEnterHandler
          }
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
                  bounds='#questionsContent'
                  >
      </ReactQuill>
    )
  }
}

export default EditorComponent;