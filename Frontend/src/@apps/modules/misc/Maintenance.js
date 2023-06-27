import { Button, Form, Input, Row, Col } from "reactstrap"
import maintenanceImg from "@src/assets/images/pages/under-maintenance.svg"

import "@styles/base/pages/page-misc.scss"
import { useSelector } from "react-redux"
import Logo from "../download/pages/Logo"

const Maintenance = () => {
  const logo = useSelector((state) => state.layout.logo_default)
  return (
    <div className="misc-wrapper">
      <a className="brand-logo" href="/">
        <Logo src={logo} className="logo" />
      </a>
      <div className="misc-inner p-2 p-sm-3">
        <div className="w-100 text-center">
          <h2 className="mb-1">Under Maintenance 🛠</h2>
          <p className="mb-3">
            Sorry for the inconvenience but we're performing some maintenance at
            the moment
          </p>
          <Form
            tag={Row}
            className="justify-content-center m-0 mb-2"
            inline
            onSubmit={(e) => e.preventDefault()}>
            <Col
              tag={Input}
              className="mb-1 ms-md-2"
              md="5"
              sm="12"
              placeholder="john@example.com"
            />
            <Button className="btn-sm-block mb-1" color="primary">
              Notify
            </Button>
          </Form>
          <img
            className="img-fluid"
            src={maintenanceImg}
            alt="Under maintenance page"
          />
        </div>
      </div>
    </div>
  )
}
export default Maintenance
