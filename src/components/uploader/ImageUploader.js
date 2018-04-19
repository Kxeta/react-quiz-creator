
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ImageUploader extends Component {
  static propTypes = { 
    onChange: PropTypes.func,
    badge: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {file: '',imageBase64: ''};
  }

  _handleSubmit(e) {
    e.preventDefault();
    // TODO: do something with -> this.state.file
    console.log('handle uploading-', { "file": this.state.file });
  }

  _handleImageChange(e) {
    e.preventDefault();
    const MaxFileSize = this.props.maxFileSize || (1024*1024*2) // 2MB 
    let reader = new FileReader();
    let file = e.target.files[0];

    console.log(file);

    if(file.size < MaxFileSize){
      reader.onloadend = () => {
        this.setState({
          file: file,
          imageBase64: reader.result,
        });
        this.props.onChange(file, reader.result);
        console.log(reader.result);
      }
  
      reader.readAsDataURL(file)
    }
    else{
      alert('Arquivo muito grande!')
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    let url='';
    if(nextProps.badge.mediaUpload.data){
      url = `data:${nextProps.badge.mediaUpload.type};base64,${nextProps.badge.mediaUpload.data}`
    }
    else{
      url = nextProps.badge.url;
    }
    console.log(url)
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
      $imagePreview = (<img src={imageBase64} />);
    } else {
      $imagePreview = (<div></div>);
    }

    return (
      <div className="previewComponent">
        <form onSubmit={(e)=>this._handleSubmit(e)}>
          <input className="fileInput" 
            type="file" 
            accept="image/*"
            onChange={(e)=>this._handleImageChange(e)} />
          <button className="submitButton" 
            type="submit" 
            onClick={(e)=>this._handleSubmit(e)}>Upload Image</button>
        </form>
        <div className="imgPreview">
          {$imagePreview}
        </div>
      </div>
    )
  }
}