
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

export default class ImageUploader extends Component {
  static propTypes = { 
    onChange: PropTypes.func,
    badge: PropTypes.object,
    labels: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object
    ]),
  };

  constructor(props) {
    super(props);
    this.state = {
      file: '',
      imageBase64: '',
      labels: this.props.labels
    };
  }

  _handleSubmit(e) {
    e.preventDefault();
    // TODO: do something with -> this.state.file
  }
  _handleRemoveImage(e) {
    e.preventDefault();
    e.stopPropagation();
    this.refs.imageForm.reset();
    this.setState({
      file: '',
      imageBase64: ''
    });
    this.props.onChange(null, null);
  }

  _handleChangeImage(e) {
    e.preventDefault();
    e.stopPropagation();
    this.refs.imageController.click();
  }

  _handleImageChange(e) {
    e.preventDefault();
    e.stopPropagation();
    const MaxFileSize = this.props.maxFileSize || (1024*1024*2) // 2MB 
    let reader = new FileReader();
    let file = e.target.files[0];

    if(file.size < MaxFileSize){
      reader.onloadend = () => {
        this.setState({
          file: file,
          imageBase64: reader.result,
        });
        this.props.onChange(file, reader.result);
      }
  
      reader.readAsDataURL(file)
    }
    else{
      alert('Arquivo muito grande!')
    }
  }

  componentWillReceiveProps(nextProps) {
    if(JSON.stringify(this.state.labels) != JSON.stringify(nextProps.labels)){
      this.setState({labels: nextProps.labels});
    }
  }

  componentWillReceiveProps(nextProps) {
    let url='';
    if(nextProps.badge && nextProps.badge.mediaUpload && nextProps.badge.mediaUpload.data){
      url = `data:${nextProps.badge.mediaUpload.type};base64,${nextProps.badge.mediaUpload.data}`
    }
    else{
      url = nextProps.badge && nextProps.badge.url;
    }
    if(this.state.imageBase64 != url){
      this.setState({imageBase64: url});
    }
  }

  // shouldComponentUpdate(nextProps, nextState){
  //   let url='';
  //   if(nextProps.badge.mediaUpload.data){
  //     url = `data:${nextProps.badge.mediaUpload.type};base64,${nextProps.badge.mediaUpload.data}`
  //   }
  //   else{
  //     url = nextProps.badge.url;
  //   }
  //   return (this.state.imageBase64 != url);
  // }

  render() {
    let {imageBase64} = this.state;
    let $imagePreview = null;
    if (imageBase64) {
      $imagePreview = (
      <Fragment>
        <img src={imageBase64} />
        <button className='btn' onClick={(e)=>this._handleRemoveImage(e)}>{this.state.labels["general.remove"]}</button>
        <button className='btn' onClick={(e)=>this._handleChangeImage(e)}>{this.state.labels["general.change"]}</button>
      </Fragment>
    );
    } else {
      $imagePreview = (<div></div>);
    }

    return (
      <div className="previewComponent">
        <form ref="imageForm" onSubmit={(e)=>this._handleSubmit(e)}>
          <label ref="imageController">
            <input className="fileInput" 
              type="file" 
              accept="image/*"
              onChange={(e)=>this._handleImageChange(e)}
              name="imageSubmitter" 
              ref="imageInput"
              />
            <div className="imgPreview">
              {$imagePreview}
            </div>
          </label>
        </form>
      </div>
    )
  }
}