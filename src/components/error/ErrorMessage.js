import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { QuizStore } from '../../modules';
import './ErrorMessage.scss';

export default class ErrorMessage extends Component {
  static propTypes = { 
    message: PropTypes.string, 
    type: PropTypes.string, 
    show: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      type: this.props.type
    };
  }

  setMessageVisible = () => {
    this.setState({
        show: true
      },
      () => {setTimeout(() => { 
          this.setState({
            show: false
          })
          QuizStore.clearErrors()
        }, 5000)
      }
    );
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.show){
      this.setMessageVisible();
    }
  }

  componentWillMount() {
    if (this.props.show) {
      this.setMessageVisible();
    }
  }

  render() {
    let classNameMessage = `quiz-message quiz-message-${this.props.type.toLocaleLowerCase()}`;
    classNameMessage += this.state.show ? ' active' : '';

    return (
      <div className={classNameMessage}>
        <div className='quiz-message-content'>
          <button onClick={(e) => {e.preventDefault(); e.stopPropagation(); this.setState({show: false}); QuizStore.clearErrors()}} className='quiz-message-close'><i className='glyphicon glyphicon-remove'></i></button>
          {this.props.children}
        </div>
      </div>
    )
  }
  


}