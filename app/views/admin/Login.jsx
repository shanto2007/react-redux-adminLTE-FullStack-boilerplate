import React from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import { login, loginFormError } from 'actions'

class Login extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const $app = document.getElementById('app')
    const $loader = document.getElementById('app-loader')
    $app.className = $app.className.replace('hide', '')
    document.body.className = document.body.className.replace('app-loading', '')
    $loader.className = 'hide'
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
        <div className="form-container small-12 medium-8 large-6 columns small-centered">
          <h1 className="title text-center brand">Login!</h1>
          <form>
            <input type="text" ref={(c) => { this.usernameInput = c }} placeholder="username" />
            <input id="password-input" type="text" ref={(c) => { this.passwordInput = c }} placeholder="password" />
            {this.formErrorHandler()}
            <div>
              <input className="btn" type="button" value={this.loadingHandler()} onClick={(e) => this.loginHandler(e)} />
            </div>
          </form>
          <p className="sign-in">
            Don't you have an account?
            <Link to="/join">sign in</Link>
          </p>
        </div>
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
