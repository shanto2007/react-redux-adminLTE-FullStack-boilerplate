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

  return (
    <div className={`box box-solid box-default ${props.className || ''}`}>
      <div className="box-header">
        <h3 className="box-title pull-left">{props.title}</h3>
        <h6 className="box-title box-subtitle pull-right">{props.title}</h6>
        <div className="clearfix"></div>
      </div>
      <div className="box-body">
        { props.children }
      </div>
      {LoadingOverlay}
    </div>
  )
}

Box.propTypes = {
  title: React.PropTypes.string,
  className: React.PropTypes.string,
  children: React.PropTypes.node,
  loading: React.PropTypes.bool,
  actions: React.PropTypes.object,
  overlay: React.PropTypes.string,
}

export default Box;
