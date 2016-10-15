import React from 'react'
import { connect } from 'react-redux'
import { startSendMail } from 'actions'
import $ from 'jquery'

class PublicContactForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: null,
      email: null,
      subject: null,
      message: null,
    }
  }

  onNameChange(e) {
    const validName = e.target.value.length >= 3
    if (validName) {
      this.setState({
        ...this.state,
        name: e.target.value,
      })
      e.target.className = 'valid'
    } else {
      this.setState({
        ...this.state,
        name: null,
      })
      e.target.className = 'invalid'
    }
  }

  onEmailChange(e) {
    const validEmail = e.target.value.match(/^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    if (validEmail) {
      this.setState({
        ...this.state,
        email: e.target.value,
      })
      e.target.className = 'valid'
    } else {
      this.setState({
        ...this.state,
        email: null,
      })
      e.target.className = 'invalid'
    }
  }

  onSubjectChange(e) {
    this.setState({
      ...this.state,
      subject: e.target.value,
    })
  }

  onMessageChange(e) {
    const validMessage = e.target.value.length >= 10
    if (validMessage) {
      this.setState({
        ...this.state,
        message: e.target.value,
      })
      e.target.className = 'valid'
    } else {
      e.target.className = 'invalid'
    }
  }

  onSubmit(e) {
    e.preventDefault()
    const { dispatch } = this.props
    dispatch(startSendMail(this.state))
  }

  formMessageHandler() {
    const { mail } = this.props
    if (mail.success) {
      return <h3>Mail sent, thank you!</h3>
    }
    if (mail.fail) {
      return <h3>Error, try again!</h3>
    }
    return null
  }

  render() {
    const { mail } = this.props
    const $form = $('#home-contact-form')
    const enableSendButton = !!this.state.name && !!this.state.email && !!this.state.message
    if (mail.loading || mail.success) {
      $form.slideUp()
    } else if (mail.fail) {
      $form.slideDown()
    }
    return (
      <div>
        {this.formMessageHandler()}
        <form id="home-contact-form">
          <input type="text" placeholder="Your name *" onChange={(e) => this.onNameChange(e)} />
          <input type="text" placeholder="Your email *" onChange={(e) => this.onEmailChange(e)} />
          <input type="text" placeholder="Subject" onChange={(e) => this.onSubjectChange(e)} />
          <textarea placeholder="your message" onChange={(e) => this.onMessageChange(e)}></textarea>
          <button disabled={!enableSendButton} className="float-right" onClick={(e) => this.onSubmit(e)}>Send Message</button>
        </form>
      </div>
    )
  }
}

PublicContactForm.propTypes = {
  dispatch: React.PropTypes.func,
  mail: React.PropTypes.object,
}

export default connect((state) => ({
  mail: state.mail,
}))(PublicContactForm)
