import { useFormatMessage } from "@apps/utility/common"
import "@styles/react/pages/page-authentication.scss"
import { Home, User } from "react-feather"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { Button, Card, CardBody, CardText, CardTitle } from "reactstrap"
import { useSkin } from "utility/hooks/useSkin"
import PhotoPublic from "../download/pages/PhotoPublic"
const Start = (props) => {
  const { skin } = useSkin()
  const logo = useSelector((state) =>
    skin === "dark" ? state.layout.logo_white : state.layout.logo_default
  )
  const appName = useSelector((state) => state.layout.app_name)
  return (
    <div className="auth-wrapper auth-v1 px-2">
      <div className="auth-inner py-2">
        <Card className="mb-0">
          <CardBody>
            <Link className="brand-logo" to="/">
              <h2 className="brand-text text-primary ms-1">
                <PhotoPublic src={logo} width="70" />
              </h2>
            </Link>
            <CardTitle tag="h4" className="mb-1">
              {useFormatMessage("auth.welcomeStart", { name: appName })}
              <br /> 🥳🥳🎉🎉
            </CardTitle>
            <p>
              {useFormatMessage("auth.welcomeAppUrl")} <br />
              <a href={process.env.REACT_APP_URL}>
                {process.env.REACT_APP_URL}
              </a>
            </p>
            <CardText className="mb-2">
              {useFormatMessage("auth.welcomeText")}
            </CardText>
            <hr />

            <Button.Ripple
              tag={Link}
              to="/profile"
              color="primary"
              className="mb-10"
              block>
              <User size={15} /> {useFormatMessage("auth.updateProfileBtn")}
            </Button.Ripple>

            <Button.Ripple tag={Link} to="/" color="primary" block>
              <Home size={15} /> {useFormatMessage("auth.dashboardBtn")}
            </Button.Ripple>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default Start
