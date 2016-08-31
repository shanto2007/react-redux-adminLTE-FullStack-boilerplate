import React from 'react'
import { Link, browserHistory } from 'react-router'
import $ from 'jquery'

const navOnScrollHandler = () => {
  const $nav = document.getElementById('main-navigation')
  const navHeight = $nav.clientHeight
  if (document.body.scrollTop > navHeight) {
    $nav.className = 'fixed'
  } else {
    $nav.className = 'static'
  }
}

class PublicNav extends React.Component {

  componentDidMount() {
    window.addEventListener('scroll', navOnScrollHandler)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', navOnScrollHandler)
  }

  scrollTo(id) {
    browserHistory.push('/')
    setTimeout(() => {
      $('html, body').animate({
        scrollTop: $(id).offset().top,
      }, 500)
    }, 150)
  }

  render() {
    return (
      <nav id="main-navigation">
        <div className="row clearfix">
          <div className="brand float-left">
            LOGO
          </div>
          <ul className="navigation float-right">
            <li className="menu-item">
              <a onClick={() => this.scrollTo('#landing')}>Home</a>
            </li>
            <li className="menu-item show-for-medium">
              <a onClick={() => this.scrollTo('#about-me')}>About</a>
            </li>
            <li className="menu-item">
              <Link to="/projects">Portfolio</Link>
            </li>
            <li className="menu-item show-for-medium">
              <a onClick={() => this.scrollTo('#contacts')}>Contacts</a>
            </li>
          </ul>
          <div className="social-icons float-right"></div>
        </div>
      </nav>
    )
  }
}

export default PublicNav;
