import { Button } from "reactstrap"
import { Link } from "react-router-dom"
import notAuthImg from "@src/assets/images/pages/not-authorized.svg"

import "@styles/base/pages/page-misc.scss"
import { useSelector } from "react-redux"
import Logo from "../download/pages/Logo"

const Restrict = () => {
  const logo = useSelector((state) => state.layout.logo_default)
  return (
    <div className="misc-wrapper">
      <a className="brand-logo" href="/">
        <Logo src={logo} className="logo" />
      </a>
      <div className="misc-inner p-2 p-sm-3">
        <div className="w-100 text-center">
          <h2 className="mb-1">You are not authorized! 🔐</h2>
          <p className="mb-2">You dont have permission to access this page.</p>
          <Button
            tag={Link}
            to="/"
            color="primary"
            className="btn-sm-block mb-1">
            Back to home
          </Button>
          <img
            className="img-fluid"
            src={notAuthImg}
            alt="Not authorized page"
          />
        </div>
      </div>
    </div>
  )
}
export default Restrict
