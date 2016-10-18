import React from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import { login, loginFormError } from 'actions'

require('style!css!sass!app/styles/views/login.scss')

class Login extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const $app = document.getElementById('app')
    const $loaderWrapper = document.getElementById('loader-wrapper')
    const $body = document.body
    $body.className = $body.className.replace('app-loading', '')
    $loaderWrapper.className = 'hide'
    $app.className = $app.className.replace('hide', '')
  }

  formErrorHandler() {
    let label;
    const { formError } = this.props.auth
    if (formError.length) {
      label = (
        <label htmlFor="password-input" className="login-form-error">{ formError }</label>
      )
    }
    return label
  }

  loginHandler(e) {
    e.preventDefault()
    const { dispatch } = this.props
    const username = this.usernameInput.value
    const password = this.passwordInput.value
    if (!username.length || !password.length) {
      dispatch(loginFormError('Username or Password not provided!'))
    } else {
      dispatch(login(username, password)).then(() => browserHistory.push('/admin'))
    }
  }

  loadingHandler() {
    const { loading } = this.props.auth
    if (loading) {
      return '...'
    }
    return 'Login'
  }

  render() {
    return (
      <div id="login-form">
        <h1 className="title">Login</h1>
        <form>
          <input className="form-control" id="username-input" type="text" ref={(c) => { this.usernameInput = c }} placeholder="username" />
          <input className="form-control" id="password-input" type="password" ref={(c) => { this.passwordInput = c }} placeholder="password" />
          <div>
            <input className="login-button" type="button" value={this.loadingHandler()} onClick={(e) => this.loginHandler(e)} />
          </div>
        </form>
        {this.formErrorHandler()}
        <p className="sign-in-cta">
          Don't you have an account? &nbsp;
          <Link to="/join">sign in</Link>
        </p>
      </div>
    )
  }

}

Login.propTypes = {
  auth: React.PropTypes.object,
  dispatch: React.PropTypes.func,
}

export default connect(state => ({
  auth: state.auth,
}))(Login);
