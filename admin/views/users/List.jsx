import React from 'react'
import { connect } from 'react-redux'

import { startGetUsersList, startDeleteUser } from 'actions/actions'

class AdminUserList extends React.Component {
  constructor(props) {
    super(props)
    this.renderList.bind(this)
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(startGetUsersList())
  }

  onDeleteUser(user) {
    const { dispatch } = this.props
    if (user && confirm(`Do you want to remove the project: ${user.username}?`)) {
      dispatch(startDeleteUser(user._id))
    }
  }

  renderList() {
    const { users } = this.props
    if (users) {
      return users.map((user, i) => (
        <tr key={i}>
          <td style={{ cursor: 'pointer' }} onClick={() => this.onDeleteUser(user)}> <i className="fa fa-remove"></i> </td>
          <td>{ user.username }</td>
          <td>{ user.admin ? 'admin' : 'normal' }</td>
        </tr>
      ))
    }
    return null
  }

  render() {
    return (
      <div className="box">
        <div className="box-body no-padding text-center">
          <table className="table table-condensed text-center">
            <tbody>
              <tr>
                <th style={{ width: '50px' }}> <i className="fa fa-cog"></i> </th>
                <th>User</th>
                <th>Type</th>
              </tr>
              { this.renderList() }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

AdminUserList.propTypes = {
  dispatch: React.PropTypes.func,
  users: React.PropTypes.array,
}

export default connect((state) => ({
  users: state.users.users,
}))(AdminUserList)
