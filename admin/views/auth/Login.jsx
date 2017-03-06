import React from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import { login, loginFormError } from 'actions/actions'

require('styles/views/login.scss')

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
    const email = this.userEmail.value
    const password = this.passwordInput.value
    if (!email.length || !password.length) {
      dispatch(loginFormError('Username or Password not provided!'))
    } else {
      dispatch(login(email, password)).then(() => browserHistory.push('/admin'))
    }
  }

  loadingHandler() {
    const { loading } = this.props.auth
    if (loading) {
      return (
        <div className="spinner">
          <div className="rect1"></div>
          <div className="rect2"></div>
          <div className="rect3"></div>
          <div className="rect4"></div>
          <div className="rect5"></div>
        </div>
      )
    }
    return 'Login'
  }

  render() {
    return (
      <div id="login-form">
        <h1 className="title">Login</h1>
        <img className="register-logo" title="Globus Cup Register" src="//:0" alt="presentation" />
        <form>
          <input className="form-control" id="username-input" type="email" ref={(c) => { this.userEmail = c }} placeholder="email" />
          <input className="form-control" id="password-input" type="password" ref={(c) => { this.passwordInput = c }} placeholder="password" />
          <button className="login-button" onClick={e => this.loginHandler(e)}>
            {this.loadingHandler()}
          </button>
        </form>
        {this.formErrorHandler()}
        <p className="sign-in-cta">
          Don&apos;t you have an account? &nbsp;
          <Link to="/register">sign in</Link>
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
