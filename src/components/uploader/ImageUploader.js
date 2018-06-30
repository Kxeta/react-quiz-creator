
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import './ImageUploader.scss';
import AvatarEditor from 'react-avatar-editor'

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
      labels: this.props.labels,
      imgSaved: false
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
      imageBase64: '',
      imgSaved: false
    });
    this.props.onChange(null, null, true);
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

    if (!file) {
      return;
    }

    if (file.size < MaxFileSize) {
      reader.onloadend = () => {
        this.setState({
          file: file,
          imageBase64: reader.result,
          imgSaved: false
        });
        this.props.onChange(file, reader.result, false);
      }
  
      reader.readAsDataURL(file)
    } else {
      alert('Arquivo muito grande!')
    }
  }

  componentWillReceiveProps(nextProps) {
    let url = '';

    if (nextProps.badge && nextProps.badge.mediaUpload && nextProps.badge.mediaUpload.data) {
      url = `data:${nextProps.badge.mediaUpload.type};base64,${nextProps.badge.mediaUpload.data}`
    } else {
      url = nextProps.badge && nextProps.badge.url;
    }

    if (this.state.imageBase64 != url) {
      this.setState({imageBase64: url});
    }

    if (JSON.stringify(this.state.labels) != JSON.stringify(nextProps.labels)) {
      this.setState({labels: nextProps.labels});
    }
  }

  render() {
    let {imageBase64} = this.state;
    let $imagePreview = null;
    let classNamePreview='imgPreview';
    if (imageBase64) {
      classNamePreview += ' hasPreview'
      $imagePreview = (
      <Fragment>
        <img src={imageBase64} />
        <div className='img-preview-actions'>
          <button className='btn btn-change' onClick={(e)=>this._handleChangeImage(e)}>{this.state.labels && this.state.labels["general.change"]}</button>
          <button className='btn btn-remove' onClick={(e)=>this._handleRemoveImage(e)}>{this.state.labels && this.state.labels["general.remove"]}</button>
        </div>
      </Fragment>
    );
  } else {
    $imagePreview = (
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="28" viewBox="0 0 36 28">
            <g fill="#9BA5AF" fillRule="nonzero">
                <path d="M0 0v28h36V0H0zm.973 21.314l10.275-10.21 7.842 7.786-2.963 2.936.686.685 5.736-5.682 10.284 10.205H.973v-5.72zm34.054 5.72h-.817L22.534 15.448l-2.773 2.747-8.513-8.448-10.275 10.2V.967h34.054v26.068z"/>
                <path d="M29.758 8.475a2.759 2.759 0 0 0 2.55-1.691 2.722 2.722 0 0 0-.6-2.984 2.774 2.774 0 0 0-3.009-.59A2.737 2.737 0 0 0 27 5.742a2.748 2.748 0 0 0 2.758 2.733zm0-4.505c.986 0 1.786.794 1.786 1.772 0 .979-.8 1.772-1.786 1.772a1.779 1.779 0 0 1-1.785-1.772c0-.47.188-.92.523-1.253a1.792 1.792 0 0 1 1.262-.519z"/>
            </g>
        </svg>
        <p>{this.state.labels && this.state.labels["general.send_image"]}</p>
      </div>);
    }

    return (
      <React.Fragment>
      <div className="previewComponent">
        <form ref="imageForm" onSubmit={(e)=>this._handleSubmit(e)}>
          <label ref="imageController">
            <input className="fileInput hidden" 
              type="file" 
              accept="image/*"
              onChange={(e)=>this._handleImageChange(e)}
              name="imageSubmitter" 
              ref="imageInput"
              />
            <div className={classNamePreview}>
              {!this.state.file && !this.state.imgSaved && (
                $imagePreview
              )}
              {this.state.imgSaved && (
                $imagePreview
              )}
            </div>
          </label>
          <div className="crop-badge">
            {this.state.file && !this.state.imgSaved && (
              <AvatarEditor
                ref={ref => this.editor = ref}
                image={this.state.file}
                width={147}
                height={147}
                border={0}
                borderRadius={100}
                color={[35, 35, 35, 0.6]}
              />
            )}
            <div className="img-preview-actions">
              {this.state.file && !this.state.imgSaved && this.state.imageBase64 && (
                <button className="btn btn-save" onClick={e => this.onClickSave(e)}>Save</button>
              )}
            </div>
          </div>
        </form>
      </div>
      </React.Fragment>
    );
  }

  onClickSave = e => {
    e.preventDefault();
    e.stopPropagation();

    if (this.editor) {
      const canvas = this.editor.getImageScaledToCanvas().toDataURL();

      fetch(canvas)
        .then(res => res.blob())
        .then(blob => {
          this.blobToBase64(blob, base64 => {
            this.setState({ imgSaved: true, imageBase64: base64 });
            this.props.onChange(blob, base64, true);
          });
        });
    }
  }

  blobToBase64 = (blob, callBack) => {
    var reader = new FileReader();
    reader.readAsDataURL(blob);

    reader.onloadend = function() {
      const base64 = reader.result;
      callBack(base64);
    }
  }
}