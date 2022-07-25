import * as React from "react"
import PropTypes from "prop-types"

const Header = ({ siteTitle }) => (
  <header>
    <div>
      <h1>{siteTitle}</h1>
      <small>Up to date with version 2.3</small>
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
