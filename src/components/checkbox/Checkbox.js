import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { QuizStore } from '../../modules';

class Checkbox extends Component {

  static propTypes = {
    label: PropTypes.string.isRequired,
    handleCheckboxChange: PropTypes.func,
    answerId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.id
    ]),
    questionId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.id
    ])
  };
  
  constructor(props){
    super(props);
    this.state = {
      isChecked: this.props.isChecked || false,
      parentId: this.props.parentId
    }
  }

  componentWillReceiveProps(nextProps) {
    if(JSON.stringify(this.state.isChecked) != JSON.stringify(nextProps.isChecked)){
      this.setState({isChecked: nextProps.isChecked});
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    return (JSON.stringify(this.state.isChecked) != JSON.stringify(nextState.isChecked));
  }

  toggleCheckboxChange = () => {
    const { handleCheckboxChange, label } = this.props;
    let toggled = !this.state.isChecked;
    if (toggled || !this.props.answerId) {
      this.setState(({ isChecked }) => (
        {
          isChecked: !isChecked,
        }
      ));
      if (this.props.answerId) {
        QuizStore.updateCorrectAnswer(toggled, this.props.answerId, this.props.questionId);
      } else {
        QuizStore.updateRequiredQuestion(toggled, this.props.questionId);
      }
    }
  }

  handleKeyPress = event => {
    event.preventDefault();
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == 13) {
      this.toggleCheckboxChange();
    }   
    event.stopPropagation();
  }

  render() {
    const { label, className } = this.props;
    const { isChecked } = this.state;

    return (
      <div className={`checkbox ${className}`}>
        <label>
          <input
            type="checkbox"
            value={label}
            checked={isChecked}
            onChange={this.toggleCheckboxChange}
            name="checkbox"
            onKeyPress={this.handleKeyPress}
          />

          {label}
        </label>
      </div>
    );
  }
}



export default Checkbox;