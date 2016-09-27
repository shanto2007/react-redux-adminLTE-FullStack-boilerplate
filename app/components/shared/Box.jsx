import React from 'react'

const Box = function Box(props) {
  let LoadingOverlay
  if (props.loading) {
    LoadingOverlay = (
      <div className="overlay">
        <i className="fa fa-refresh fa-spin"></i>
      </div>
    )
  } else if (props.overlay) {
    LoadingOverlay = (
      <div className="overlay">
        <h3 className="overlay-title">{props.overlay || 'Loading...'}</h3>
      </div>
    )
  } else {
    LoadingOverlay = null;
  }

  let Filters = null
  if (props.filters) {
    Filters = (
      <div className="box-body box-filters">
        {props.filters}
      </div>
    )
  }

  return (
    <div className={`box ${props.className || ''}`}>
      <div className="box-header with-border">
        <h3 className="box-title">{props.title}</h3>
        <h6 className="box-title box-subtitle">{props.subtitle || ''}</h6>
        <div className="box-tools pull-right">
          <button type="button" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus"></i></button>
        </div>
      </div>
      {Filters}
      <div className="box-body">
        { props.children }
      </div>
      {LoadingOverlay}
    </div>
  )
}

Box.propTypes = {
  title: React.PropTypes.string,
  subtitle: React.PropTypes.string,
  filters: React.PropTypes.element,
  className: React.PropTypes.string,
  children: React.PropTypes.node,
  loading: React.PropTypes.bool,
  overlay: React.PropTypes.string,
}

export default Box;
