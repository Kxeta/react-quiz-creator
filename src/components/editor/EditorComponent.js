import ReactQuill from 'react-quill';
import React, { Component } from 'react';
import './EditorComponent.scss';

class EditorComponent extends Component {

  constructor(props){
    super(props);
    this.state = {
      content: null
    }
  }

  handleOnChange = (content, delta, source, editor) => {
    console.log(content);
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