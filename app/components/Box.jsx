import React from 'react'

const Box = function Box(props) {
  let LoadingOverlay;
  if (props.loading) {
    LoadingOverlay = (
      <div className="overlay">
        <i className="fa fa-refresh fa-spin"></i>
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
};

export default Box;
