import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Checkbox extends Component {

  static propTypes = {
    label: PropTypes.string.isRequired,
    handleCheckboxChange: PropTypes.func,
  };
  
  constructor(props){
    super(props);
    this.state = {
      isChecked: this.props.isChecked || false,
      parentId: this.props.parentId
    }
  }

  toggleCheckboxChange = () => {
    const { handleCheckboxChange, label } = this.props;

    this.setState(({ isChecked }) => (
      {
        isChecked: !isChecked,
      }
    ));

    // handleCheckboxChange(label);
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
          />

          {label}
        </label>
      </div>
    );
  }
}



export default Checkbox;