import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ErrorMessage } from './components/error';
import { QuizStore } from './modules';

export default class Alerts extends Component{

  static propTypes = { 
    errors: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
      PropTypes.string
    ])
  };

  constructor(props) {
    super(props);
    this.state = {
      msgs: this.props.msgs
    };
    if(window){
      window.updateLabels = this.updateLabels;
    }
  }

  state = {
    msgs: []
  }

  updateLabels = labels => {
    QuizStore.labels = labels;
  }

  componentDidMount() {
    window.quizMsg = this.quizMsg;
    window.updateLabels = this.updateLabels;
  }

  quizMsg = obj => {
    obj = JSON.parse(obj);
    this.setState({ msgs: obj.keyMessages, type: obj.type || 'error' });
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.state.msgs) != JSON.stringify(nextProps.msgs)) {
      this.setState({msgs: nextProps.msgs});
    }
  }

  createErrorMessage = errorList => {
    let html = '';
    errorList.map( error => {
      html += `<li>${QuizStore.labels[error]}</li>`;
    });
    return {__html: html};
  }


  render() {
    let { msgs, type } = this.state;

    if (!msgs || !msgs.length) {
      return null;
    }


    return (
      <ErrorMessage type={type} show={true}>
        {type == 'ERROR' && QuizStore.labels["general.we_had_problems"]}
        <ul dangerouslySetInnerHTML={this.createErrorMessage(msgs)}></ul>
      </ErrorMessage>
    );
  }
}