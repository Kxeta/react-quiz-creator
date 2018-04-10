import ReactQuill from 'react-quill';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './EditorComponent.scss';


@inject('QuizStore')
@observer
class EditorComponent extends Component {
  static propTypes = { 
    content: PropTypes.string, 
    formats: PropTypes.array, 
    modules: PropTypes.array, 
    id: PropTypes.string,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    readOnly: PropTypes.bool,
    QuizStore: PropTypes.object
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

  render() {
    let formats = this.props.formats || [
      'bold', 'italic', 'link'
    ];
    let modules = this.props.modules || {
      toolbar:[
        ['bold', 'italic', 'link']
      ]
    };
    let classNames = this.props.className + ' editor-wrapper';
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
                  bounds='#app'
                  >
      </ReactQuill>
    )
  }
}

export default EditorComponent;