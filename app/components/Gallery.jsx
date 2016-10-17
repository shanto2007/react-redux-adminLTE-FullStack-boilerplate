import React from 'react'
import { connect } from 'react-redux'
import Masonry from 'react-masonry-component'
import { browserHistory } from 'react-router'
import { startGetCategories } from 'actions'

const masonryOptions = {
  transitionDuration: 0,
};

/**
 * FIXME: There are placeholder from a preview project, change accordingly to your need.
 */
class Gallery extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedCategory: undefined,
    }
  }
  componentWillMount() {
    const { dispatch } = this.props
    dispatch(startGetCategories())
  }

  renderCategories() {
    const { categories } = this.props;
    const { selectedCategory } = this.state
    if (categories) {
      return categories.map((cat, i) => {
        const dinamicClass = selectedCategory === cat._id ? 'active' : ''
        return (
          <span className={`gallery-category ${dinamicClass}`} key={i} onClick={() => this.setState({ selectedCategory: cat._id })}>{cat.name}</span>
        )
      })
    }
    return null;
  }

  render() {
    const { selectedCategory } = this.state
    const childElements = this.props.elements.map((element, i) => {
      let dinamicClass
      if (!selectedCategory) {
        dinamicClass = 'show-item'
      } else if (element.category) {
        dinamicClass = selectedCategory && selectedCategory === element.category._id ? 'show-item' : 'hide-item'
      } else {
        dinamicClass = 'hide-item'
      }
      return (
        <div
          className={`grid-item ${dinamicClass}`}
          key={i}
          onClick={() => browserHistory.push(`/projects/${element.slug}`)}
          data-title={element.title}
        >
          <div className="overlay">
            <span className="overlay-title">{element.title}</span>
            <span className="overlay-category">{element.category ? element.category.name : '' }</span>
            <i className="icon icon-right"></i>
          </div>
          <img src={element.featured ? element.featured.path : ''} role="presentation" />
        </div>
      )
    })

    return (
      <div>
        <div className="gallery-categories show-for-medium">
          <span
            className={`gallery-category ${!selectedCategory ? 'active' : ''}`}
            onClick={() => this.setState({ selectedCategory: undefined })}
          >
            All
          </span>
          {this.renderCategories()}
        </div>
        <Masonry
          className={'grid-container'} // default ''
          elementType={'div'} // default 'div'
          options={masonryOptions} // default {}
          disableImagesLoaded={false} // default false
          updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
        >
          {childElements}
        </Masonry>
      </div>
    );
  }
}

Gallery.propTypes = {
  latest: React.PropTypes.bool,
  categories: React.PropTypes.array,
  elements: React.PropTypes.array,
  dispatch: React.PropTypes.func,
}

export default connect((state) => ({
  categories: state.categories.categories,
}))(Gallery)
