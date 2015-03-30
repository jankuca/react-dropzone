var React = require('react');

var Dropzone = React.createClass({
  getInitialState: function() {
    return {
      isDragActive: false
    }
  },

  propTypes: {
    onDrop: React.PropTypes.func.isRequired,
    formats: React.PropTypes.array,
    size: React.PropTypes.number,
    style: React.PropTypes.object
  },

  onDragLeave: function(e) {
    this.setState({
      isDragActive: false
    });
  },

  onDragOver: function(e) {
    e.preventDefault();

    var files = this._getFilesFromEvents(e);
    if (files.length) {
      e.dataTransfer.dropEffect = "copy";
      this.setState({
        isDragActive: true
      });
    } else {
      e.dataTransfer.dropEffect = "none";
      this.setState({
        isDragActive: false
      });
    }
  },

  onDrop: function(e) {
    e.preventDefault();

    this.setState({
      isDragActive: false
    });

    if (this.props.onDrop) {
      var files = this._getFilesFromEvents(e);
      this.props.onDrop(files);
    }
  },

  onClick: function () {
    this.refs.fileInput.getDOMNode().click();
  },

  _getFilesFromEvents: function (e) {
    var files = [];
    if (e.dataTransfer) {
      files = Array.prototype.slice.call(e.dataTransfer.files);
    } else if (e.target) {
      files = Array.prototype.slice.call(e.target.files);
    }

    var formatPattern = this._getFormatPattern();
    files = files.filter(function (file) {
      return formatPattern.test(file.name);
    });

    return files;
  },

  _getFormatPattern: function () {
    if (!this._formatPattern) {
      var formats = this.props.format;
      var source = '.+';
      if (formats) {
        var extSources = Array.isArray(formats) ? formats : formats.split(',');
        extSources = extSources.map(function (extSource) {
          return extSources.replace(/\./g, '\\.');
        });
        source = '(' + extSources.join('|') + ')$';
      }
      this._formatPattern = new RegExp(source);
    }
    return this._formatPattern
  },

  render: function() {
    var className = this.props.className || 'dropzone';
    if (this.state.isDragActive) {
      className += ' active';
    };

    var style = this.props.style || {
      width: this.props.size || 100,
      height: this.props.size || 100,
      borderStyle: this.state.isDragActive ? "solid" : "dashed"
    };

    if (this.props.className) {
      style = this.props.style;
    }

    var dropzoneAttrs = {
      className: className,
      style: style,
      onClick: this.onClick,
      onDragLeave: this.onDragLeave,
      onDragOver: this.onDragOver,
      onDrop: this.onDrop
    };
    var inputAttrs = {
      style: { display: 'none' },
      type: 'file',
      multiple: 'multiple',
      ref: 'fileInput',
      onChange: this.onDrop
    };

    return (
      React.createElement('div', dropzoneAttrs, [
        React.createElement('input', inputAttrs, this.props.children)
      ])
    );
  }
});

module.exports = Dropzone;
