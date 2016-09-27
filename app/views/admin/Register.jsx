import React from 'react'
import { findDOMNode } from 'react-dom'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { validPassword, validPasswordCheck, signinPasswordError, checkUserExist, startSignin } from 'actions'

class Register extends React.Component {

  componentDidMount() {
    const $app = document.getElementById('app')
    const $loader = document.getElementById('app-loader')
    $app.className = $app.className.replace('hide', '')
    document.body.className = document.body.className.replace('app-loading', '')
    $loader.className = 'hide'
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
        <label htmlFor="username-input" className="login-form-error">{ usernameError }</label>
      )
    }
    return label
  }

  formPasswordErrorHandler() {
    let label
    const { passwordError } = this.props.signin
    if (passwordError && passwordError.length) {
      label = (
        <label htmlFor="password-input" className="login-form-error">{ passwordError }</label>
      )
    }
    return label
  }

  render() {
    return (
      <div id="signin-form">
        <div className="form-container small-12 medium-8 large-6 columns small-centered">
          <h1 className="title text-center brand">Join!</h1>
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
              type="text"
              placeholder="password"
              onKeyUp={() => this.validatePassword()}
            />
            <input
              ref={(c) => { this.checkPasswordInput = c }}
              type="text"
              placeholder="retype password"
              onKeyUp={() => this.validateRetypedPassword()}
            />
            {this.formPasswordErrorHandler()}
            <div>
              <input className="btn" type="button" value="Join" onClick={() => this.onRegister()} />
            </div>
          </form>
        </div>
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
