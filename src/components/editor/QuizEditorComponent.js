import ReactQuill from 'react-quill';
import React, { Component, Fragment } from 'react';
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

  constructor(props) {
    super(props);
    this.state = {
      content: null
    }
  }

  handleOnChange = (content, delta, source, editor) => {
    if (this.props.charLimit && editor.getLength() > this.props.charLimit + 1 && this.reactQuillRef) {
      window.quizMsg(`{"type":"ERROR","keyMessages":["pages.quiz.answer_text_length"]}`);
      const editor2 = this.reactQuillRef.getEditor();
      let delta2 = editor2.getContents();
      delta2 = delta2.slice(0, this.props.charLimit);
      editor2.setContents(delta2);
      this.reactQuillRef.focus();
    } else {
      this.setState({ content });
      QuizStore.updateQuizContent(this.props.id, this.props.parentId, content);
    }
    this.props.updateCharCount(this.props.charLimit - (editor.getLength() - 1));
  }

  handleOnBlur = () => {
    QuizStore.updateQuizContent(this.props.id, this.props.parentId, this.state.content);
  }

  componentDidMount() {
    const { type } = this.props;
    let quillElements = document.getElementsByClassName("ql-tooltip-editor");
    for(let i = 0; i < quillElements.length; i++){
      quillElements[i].getElementsByTagName("INPUT")[0].name = 'link-input';
    };

    if (this.reactQuillRef && type === QuizStore.event) {
      if (QuizStore.questionIndex + 1 === this.props.index) {
        this.reactQuillRef.focus();
      }
      
    } else if (this.reactQuillRef && QuizStore.event.indexOf('answer') !== -1) {
      this.reactQuillRef.focus();
    }
  }

  componentWillMount() {
    this.setState({
      content : this.props.content
    })
  }

  onKeyEnterHandler = () => {
    const value = this.state.content || this.props.content;

    if (!value) {
      return;
    }

    const answerStatus = QuizStore.checkQuestionAnswers(this.props.id);

    if (answerStatus.empty) {
      this.focusNewAnser(answerStatus.index);
    } else {
      QuizStore.addAnswer(this.props.parentId || this.props.id);
      this.focusNewAnser();
    }
  }

  focusNewAnser = index => {
    const questionClass = document.activeElement.parentNode.parentNode.classList[1];
    let allEl = document.querySelectorAll(`.${questionClass}`);
    let lastEl = allEl[index + 1] || allEl[allEl.length - 1];
    lastEl.querySelector('.ql-editor').focus();
  }

  handleKeyUp = () => {
    const editor = this.reactQuillRef.getEditor();

    const text = editor.getText();
    let content = editor.getContents();

    if (text.length > this.props.charLimit + 1) {
      window.quizMsg('{"type":"ERROR","keyMessages":["pages.quiz.max_characters"]}');
      content = content.slice(0, this.props.charLimit);
      editor.setContents(content);
      this.reactQuillRef.focus();
    }
  }

  render() {
    const { className, id, placeholder, readOnly, parentId, charLimit, charCount } = this.props;

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
    
    let classNames = className + ' rc-editor-wrapper';

    let initialLenth = 0;

    if (this.reactQuillRef && charLimit && charCount == 0) {
      const editor = this.reactQuillRef.getEditor();
      initialLenth = editor.getLength() - 1;
      this.props.updateCharCount(charLimit - (charCount || initialLenth));
    }

    return (
      <Fragment>
        <ReactQuill value={ this.state.content || this.props.content }
                    theme="bubble"
                    formats={ formats }
                    modules={ modules }
                    id={ id || "" }
                    placeholder={ placeholder || "" }
                    readOnly={ readOnly == true }
                    className={ classNames }
                    onChange={this.handleOnChange}
                    onBlur={this.handleOnBlur}
                    bounds='#questionsContent'
                    name={id + '-' + parentId}
                    //onKeyUp={this.handleKeyUp}
                    ref={el => { this.reactQuillRef = el }}
                    >
        </ReactQuill>
      </Fragment>
    )
  }
}

export default QuizEditorComponent;