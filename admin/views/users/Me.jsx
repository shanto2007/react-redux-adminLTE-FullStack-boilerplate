import React from 'react'
import { connect } from 'react-redux'
import {
  accountStartCheckPassword,
  accountStartCheckEmailExist,
  accountStartChangePassword,
  accountStartChangeEmail,
} from 'actions/actions'
import validator from 'validator'

import Box from 'shared/Box'

class AdminUserPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      passwordChangeSuccess: null,
      currentPassword: null,
      newPassword: null,
      newPasswordValid: false,
      newPasswordCheckValid: false,
      newPasswordError: '',
      newPasswordCheckError: '',
      emailChangeSuccess: null,
      newEmail: '',
      newEmailValid: null,
    }
  }

  onPasswordCheck(e) {
    const password = e.target.value
    const { dispatch } = this.props
    const { _id } = this.props.user
    if (password && password.length >= 6) {
      dispatch(accountStartCheckPassword(_id, password)).then((res) => {
        if (res.data.success) {
          this.setState({
            currentPassword: password,
          })
        }
      })
    } else {
      this.setState({
        currentPassword: null,
      })
    }
  }

  onPasswordChange(e) {
    e.preventDefault()
    e.stopPropagation()
    const { _id } = this.props.user
    const { dispatch } = this.props
    const { currentPassword, newPassword, newPasswordValid, newPasswordCheckValid } = this.state
    const { checkPassword } = this.props.account
    if (newPasswordValid && newPasswordCheckValid && checkPassword) {
      dispatch(accountStartChangePassword(_id, currentPassword, newPassword))
      .then(() => this.defaultPasswordState())
    }
  }

  onEmailChange(e) {
    e.preventDefault()
    e.stopPropagation()
    const { dispatch } = this.props
    const { _id } = this.props.user
    const { newEmail, newEmailValid, newEmailExist } = this.state
    if (newEmail && newEmailValid && !newEmailExist) {
      dispatch(accountStartChangeEmail(_id, newEmail))
      .then(() => this.defaultEmailState())
    }
  }

  onNewEmailInput(e) {
    e.preventDefault()
    e.stopPropagation()
    const { dispatch } = this.props
    const email = e.target.value.trim()
    if (validator.isEmail(email)) {
      dispatch(accountStartCheckEmailExist(email))
      .then((res) => {
        this.setState({
          newEmail: email,
          newEmailValid: true,
          newEmailExist: res.data.exist,
        })
      })
      .catch((err) => {
        this.setState({
          newEmail: '',
          newEmailValid: false,
          newEmailExist: err.reponse.data.exist || true,
        })
      })
    } else {
      this.setState({
        newEmail: '',
        newEmailValid: false,
      })
    }
  }

  onNewPasswordInput(e) {
    e.preventDefault()
    e.stopPropagation()
    const password = e.target.value.trim()
    if (password.length >= 6) {
      this.setState({
        newPassword: password,
        newPasswordCheck: '',
        newPasswordValid: true,
      })
    } else {
      this.setState({
        newPassword: '',
        newPasswordValid: false,
        newPasswordError: 'Password must be at least 6 characters long',
      })
    }
  }
  onNewPasswordCheckInput(e) {
    e.preventDefault()
    e.stopPropagation()
    const password = e.target.value.trim()
    if (password === this.state.newPassword) {
      this.setState({
        newPasswordCheckValid: true,
        newPasswordCheckError: '',
      })
    } else {
      this.setState({
        newPasswordCheckValid: false,
        newPasswordCheckError: 'Password mismatch.',
      })
    }
  }

  defaultPasswordState() {
    this.setState({
      passwordChangeSuccess: null,
      currentPassword: null,
      newPassword: null,
      newPasswordValid: false,
      newPasswordCheckValid: false,
      newPasswordError: '',
      newPasswordCheckError: '',
    })
    this.currentPasswordInput.value = ''
    this.newPasswordInput.value = ''
    this.newPasswordCheckInput.value = ''
  }

  defaultEmailState() {
    this.setState({
      emailChangeSuccess: null,
      newEmail: '',
      newEmailValid: null,
    })
    this.emailInput.value = this.props.user.email
  }

  render() {
    const { user, account } = this.props
    const { newPasswordValid, newPasswordCheckValid, newEmailValid } = this.state
    if (user) {
      return (
        <Box title="User Account">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <p name="username">{user.username}</p>
          </div>
          <h3 className="title">Change Email</h3>
          <form>
            <div className={`form-group ${account.checkEmailExist ? 'has-error' : ''} ${newEmailValid ? 'has-success' : ''} ${!newEmailValid && newEmailValid !== null ? 'has-error' : ''}`}>
              <label htmlFor="user-email">email</label>
              <input
                ref={(c) => { this.emailInput = c }}
                className="form-control"
                name="user-email"
                type="email"
                defaultValue={user.email}
                onChange={e => this.onNewEmailInput(e)}
              />
              <span className={`help-block ${!newEmailValid && newEmailValid !== null ? '' : 'hide'}`}> Invalid Email </span>
              <span className={`help-block ${account.checkEmailExist ? '' : 'hide'}`}> This user email already exist </span>
              <span className="help-block">
                <i className={`fa fa-check ${newEmailValid && !account.checkEmailExist ? '' : 'hide'}`}></i>
              </span>
            </div>
            <button
              className="btn btn-primary pull-right" onClick={e => this.onEmailChange(e)}
              disabled={!this.state.newEmail.length || !newEmailValid || account.checkEmailExist}
            >
              CHANGE EMAIL
            </button>
          </form>
          <div className="clearfix"></div>
          <h3 className="title">Change Password</h3>
          <form>
            <div className={`form-group ${account.checkPassword ? 'has-success' : ''} ${!account.checkPassword && account.checkPassword !== null ? 'has-error' : ''}`}>
              <label htmlFor="user-email">Current Password</label>
              <input
                className="form-control"
                name="current-password"
                type="password"
                ref={(c) => { this.currentPasswordInput = c }}
                onChange={e => this.onPasswordCheck(e)}
              />
              <span className={`help-block ${!account.checkPassword ? '' : 'hide'}`}> Invalid Password </span>
              <span className="help-block">
                <i className={`fa fa-check ${account.checkPassword ? '' : 'hide'}`}></i>
              </span>
            </div>
            <div className={`form-group ${newPasswordValid ? 'has-success' : ''}`}>
              <label htmlFor="new-password">New Password</label>
              <input
                className="form-control"
                name="new-password"
                type="password"
                ref={(c) => { this.newPasswordInput = c }}
                onChange={e => this.onNewPasswordInput(e)}
              />
              <span className={`help-block ${!newPasswordValid ? '' : 'hide'}`}> { this.state.newPasswordError} </span>
              <span className="help-block">
                <i className={`fa fa-check ${newPasswordValid ? '' : 'hide'}`}></i>
              </span>
            </div>
            <div className={`form-group ${newPasswordCheckValid ? 'has-success' : ''}`}>
              <label htmlFor="retype-new-password">Retype new Password</label>
              <input
                ref={(c) => { this.newPasswordCheckInput = c }}
                className="form-control"
                name="retype-new-password"
                type="password"
                onChange={e => this.onNewPasswordCheckInput(e)}
              />
              <span className={`help-block ${!newPasswordCheckValid ? '' : 'hide'}`}> { this.state.newPasswordCheckError} </span>
              <span className="help-block">
                <i className={`fa fa-check ${newPasswordCheckValid ? '' : 'hide'}`}></i>
              </span>
            </div>
            <button
              className="btn btn-primary pull-right" onClick={e => this.onPasswordChange(e)}
              disabled={!newPasswordValid || !newPasswordCheckValid || !account.checkPassword}
            >
              CHANGE PASSWORD
            </button>
          </form>
          <div className="clearfix"></div>
        </Box>
      )
    }
    return null
  }
}

AdminUserPage.propTypes = {
  dispatch: React.PropTypes.func,
  user: React.PropTypes.object,
  account: React.PropTypes.object,
}

export default connect(state => ({
  user: state.account.user,
  account: state.account,
}))(AdminUserPage)
