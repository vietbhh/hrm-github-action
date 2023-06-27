import errorImg from "@src/assets/images/pages/error.svg"
import { Link } from "react-router-dom"
import { Button } from "reactstrap"

import "@styles/base/pages/page-misc.scss"
import { useSelector } from "react-redux"
import Logo from "../download/pages/Logo"

const Error = () => {
  const logo = useSelector((state) => state.layout.logo_default)
  return (
    <div className="misc-wrapper">
      <a className="brand-logo" href="/">
        <Logo src={logo} className="logo" />
      </a>
      <div className="misc-inner p-2 p-sm-3">
        <div className="w-100 text-center">
          <h2 className="mb-1">Page Not Found 🕵🏻‍♀️</h2>
          <p className="mb-2">
            Oops! 😖 The requested URL was not found on this server.
          </p>
          <Button
            tag={Link}
            to="/"
            color="primary"
            className="btn-sm-block mb-2">
            Back to home
          </Button>
          <img className="img-fluid" src={errorImg} alt="Not authorized page" />
        </div>
      </div>
    </div>
  )
}
export default Error
