import React from 'react'

const Callout = function Callout(props) {
  return (
    <div className={`callout callout-${props.type || 'info'}`}>
      <h4>{props.title}</h4>
      <p>
        {props.message}
      </p>
    </div>
  )
}

Callout.propTypes = {
  title: React.PropTypes.string,
  message: React.PropTypes.string,
  type: React.PropTypes.string,
}

export default Callout
