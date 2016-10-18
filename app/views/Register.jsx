import React from 'react'
import { findDOMNode } from 'react-dom'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { validPassword, validPasswordCheck, signinPasswordError, checkUserExist, startSignin } from 'actions'

require('style!css!sass!app/styles/views/register.scss')

class Register extends React.Component {

  componentDidMount() {
    const $app = document.getElementById('app')
    const $loaderWrapper = document.getElementById('loader-wrapper')
    const $body = document.body
    $body.className = $body.className.replace('app-loading', '')
    $loaderWrapper.className = 'hide'
    $app.className = $app.className.replace('hide', '')
  }

  componentDidUpdate() {
    const { signin } = this.props
    if (signin.username_exist) {
      findDOMNode(this.usernameInput).className = 'invalid'
    } else {
      findDOMNode(this.usernameInput).className = 'valid'
    }
  }

  onRegister() {
    const { dispatch, signin } = this.props
    const username = this.usernameInput.value
    const password = this.passwordInput.value
    if (!signin.usernameExist && signin.validPassword && signin.validPasswordCheck) {
      dispatch(startSignin(username, password)).then((res) => {
        if (res.status === 200) {
          browserHistory.push('/admin')
        }
      })
    }
  }

  checkUserExist() {
    const { dispatch } = this.props
    const username = this.usernameInput.value
    if (username.length) dispatch(checkUserExist(username))
  }

  validatePassword() {
    const { dispatch } = this.props
    const password = this.passwordInput.value
    if (password.length >= 6) {
      dispatch(validPassword(true))
      dispatch(signinPasswordError(null))
      findDOMNode(this.passwordInput).className = 'valid'
    } else {
      dispatch(validPassword(false))
      dispatch(signinPasswordError('Password must be longer than 6 characters'))
      findDOMNode(this.passwordInput).className = 'invalid'
    }
  }

  validateRetypedPassword() {
    const { dispatch } = this.props
    const password = this.passwordInput.value
    const check = this.checkPasswordInput.value

    if (password === check) {
      dispatch(validPasswordCheck(true))
      dispatch(signinPasswordError(null))
      findDOMNode(this.checkPasswordInput).className = 'valid'
    } else {
      findDOMNode(this.checkPasswordInput).className = 'invalid'
      dispatch(signinPasswordError('Password mismatch'))
      dispatch(validPasswordCheck(false))
    }
  }

  formUsernameErrorHandler() {
    let label
    const { usernameError } = this.props.signin
    if (usernameError && usernameError.length) {
      label = (
        <label htmlFor="username-input" className="signin-form-error">{ usernameError }</label>
      )
    }
    return label
  }

  formPasswordErrorHandler() {
    let label
    const { passwordError } = this.props.signin
    if (passwordError && passwordError.length) {
      label = (
        <label htmlFor="password-input" className="signin-form-error">{ passwordError }</label>
      )
    }
    return label
  }

  render() {
    return (
      <div id="signin-form">
        <h1 className="title">Join!</h1>
        <form>
          {this.formUsernameErrorHandler()}
          <input
            ref={(c) => { this.usernameInput = c }}
            id="username-input"
            type="text"
            placeholder="username"
            onKeyUp={() => this.checkUserExist()}
          />
          <input
            ref={(c) => { this.passwordInput = c }}
            id="password-input"
            type="password"
            placeholder="password"
            onKeyUp={() => this.validatePassword()}
          />
          <input
            ref={(c) => { this.checkPasswordInput = c }}
            type="password"
            id="retype-password-input"
            placeholder="retype password"
            onKeyUp={() => this.validateRetypedPassword()}
          />
          {this.formPasswordErrorHandler()}
          <div>
            <input className="register-button" type="button" value="Join" onClick={() => this.onRegister()} />
          </div>
        </form>
      </div>
    )
  }
}

Register.propTypes = {
  signin: React.PropTypes.object,
  dispatch: React.PropTypes.func,
}

export default connect((state) => ({
  signin: state.signin,
}))(Register)
