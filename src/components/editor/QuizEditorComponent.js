import ReactQuill from 'react-quill';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './EditorComponent.scss';
import { QuizStore } from '../../modules';


class QuizEditorComponent extends Component {
  static propTypes = { 
    content: PropTypes.string, 
    formats: PropTypes.array, 
    modules: PropTypes.array, 
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    className: PropTypes.string,
    placeholder: PropTypes.string,
    readOnly: PropTypes.bool,
    type: PropTypes.string,
    parentId: PropTypes.oneOfType([
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
    QuizStore.updateQuizContent(this.props.id, this.props.parentId, content);
  }

  handleOnBlur = () => {
    QuizStore.updateQuizContent(this.props.id, this.props.parentId, this.state.content);
  }

  componentDidMount(){
    let quillElements = document.getElementsByClassName("ql-tooltip-editor");
    for(let i = 0; i < quillElements.length; i++){
      quillElements[i].getElementsByTagName("INPUT")[0].name = 'link-input';
    };
  }

  componentWillMount(){
    this.setState({
      content : this.props.content
    })
  }

  onKeyEnterHandler = () => {
    QuizStore.addAnswer(this.props.parentId || this.props.id);
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
      'bold', 'italic', 'underline', 'link'
    ];
    let modules = this.props.modules || {
      toolbar:[
        ['bold', 'italic', 'underline', 'link']
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
                  onBlur={this.handleOnBlur}
                  bounds='#questionsContent'
                  name={this.props.id + '-' + this.props.parentId}
                  >
      </ReactQuill>
    )
  }
}

export default QuizEditorComponent;