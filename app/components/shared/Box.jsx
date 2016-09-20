import React from 'react'

const overlayStyle = {
  position: 'relative',
  top: '50%',
  transform: 'translateY(-50%)',
  padding: 0,
  margin: '0 auto',
  textTransform: 'uppercase',
  fontWeight: 'bold',
  textAlign: 'center',
}

const Box = function Box(props) {
  let LoadingOverlay, actionButtons
  if (props.loading) {
    LoadingOverlay = (
      <div className="overlay">
        <i className="fa fa-refresh fa-spin"></i>
      </div>
    )
  } else if (props.overlay) {
    LoadingOverlay = (
      <div className="overlay">
        <h3 style={overlayStyle}>{props.overlay}</h3>
      </div>
    )
  } else {
    LoadingOverlay = null;
  }

  return (
    <div className={`box box-solid box-default ${props.className || ''}`}>
      <div className="box-header">
        <h3 className="box-title">{props.title}</h3>
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
