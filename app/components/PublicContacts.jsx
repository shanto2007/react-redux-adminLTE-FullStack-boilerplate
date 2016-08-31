import React from 'react'
import PublicContactForm from 'PublicContactForm'

class PublicContacts extends React.Component {
  render() {
    return (
      <div id="contacts" className="columns">
        <div className="row clearfix">
          <h2 className="section-title">Contact me</h2>
          <div className="small-12 medium-4 columns text-contact">
            <div className="contact-wrapper address">
              <div className="title">Address</div>
              <div className="info">
                Address
                <br />
                City
              </div>
            </div>
            <div className="contact-wrapper mail">
              <div className="title">Mail</div>
              <div className="info">
                MAIL
              </div>
            </div>
          </div>
          <div className="small-12 medium-8 columns mail-form">
            <h3>REACH ME OUT</h3>
            <PublicContactForm />
          </div>
        </div>
      </div>
    )
  }
}

export default PublicContacts;
