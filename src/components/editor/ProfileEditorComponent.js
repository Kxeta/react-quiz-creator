import ReactQuill from 'react-quill';
import React, { Component, Fragment } from 'react';
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

  constructor(props) {
    super(props);
    this.state = {
      content: null,
      charLimit: props.charLimit,
      charCount: 0
    }
  }

  handleOnChange = (content, delta, source, editor) => {
    if (editor.getLength() > this.state.charLimit + 1 && this.reactQuillRef) {
      window.quizMsg(`{"type":"ERROR", "keyMessages":["pages.quiz.answer_text_length"]}`);
      const editor2 = this.reactQuillRef.getEditor();
      let delta2 = editor2.getContents();
      delta2 = delta2.slice(0, this.state.charLimit);
      editor2.setContents(delta2);
      this.reactQuillRef.focus();
    } else {
      this.setState({ content });
      QuizStore.updateProfileContent(this.props.profileId, this.props.type, content);
    }
    this.setState({ charCount: editor.getLength() - 1});
  }

  handleOnBlur = () => {
    QuizStore.updateProfileContent(this.props.profileId, this.props.type, this.state.content);
  }

  componentDidMount() {
    let quillElements = document.getElementsByClassName("ql-tooltip-editor");
    for (let i = 0; i < quillElements.length; i++) {
      quillElements[i].getElementsByTagName("INPUT")[0].name = 'link-input';
    };
  }

  componentWillMount() {
    this.setState({
      content : this.props.content,
      charLimit: this.props.charLimit,
      charCount: 0
    })
  }

  componentDidMount() {
    if (this.reactQuillRef && this.props.type == 'title') {
      this.reactQuillRef.focus();
    }
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

    let initialLenth = 0;

    if (this.reactQuillRef && this.state.charLimit && this.state.charCount == 0) {
      const editor = this.reactQuillRef.getEditor();
      initialLenth = editor.getLength() - 1;
    }

    return (
      <Fragment>
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
                    ref={el => { this.reactQuillRef = el }}
                    >
        </ReactQuill>
        <div className="char__limit">{this.state.charLimit - (this.state.charCount || initialLenth)} caracteres</div>
      </Fragment>
    )
  }
}

export default ProfileEditorComponent;