// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { Link } from "react-router-dom"
// ** Styles
import { Button, Card, CardBody } from "reactstrap"
// ** Components
import notification from "@apps/utility/notification"

const LinkInfo = (props) => {
  const {
    // ** props
    employeeData
    // ** methods
  } = props

  const fullLink = import.meta.env.VITE_APP_URL + "/u/" + employeeData.username

  const handleClickCopy = () => {
    navigator.clipboard.writeText(fullLink)
    notification.showSuccess()
  }

  // ** render
  return (
    <Card className="mb-1 link-info-section">
      <CardBody>
        <div className="d-flex align-items-center justify-content-between">
          <div className="w-50" style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}>
          <Link to={`/u/${employeeData.username}`}>{fullLink}</Link>
          </div>
          <Button.Ripple
            size="sm"
            className="d-flex align-items-center copy-button"
            onClick={() => handleClickCopy()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              version="1.1"
              id="Layer_1"
              x="0px"
              y="0px"
              width="18px"
              height="18px"
              viewBox="0 0 18 18"
              enableBackground="new 0 0 18 18"
              xmlSpace="preserve"
              className="me-25">
              {" "}
              <image
                id="image0"
                width="18"
                height="18"
                x="0"
                y="0"
                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAQAAAD8x0bcAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZ cwAACxMAAAsTAQCanBgAAAAHdElNRQfnBxMLKC66x+l/AAAAj0lEQVQoz6WS0Q3DIAxEH1UHYAS6 QUZgBDboiB0h3SDZoIzABtePKgRIlVrq/VhYT8a6MxjkPkUTvms/D6QWjXrJ90jUN8WduFh2OoEU NSv9mhSIPOQt303/79RDxQJl8qGfyVSnruAKt9Y6AFYC9waCLSulmmDakdG++TyezeNRC9RTqVgg NM/iVotFALwB7T1p0YvkttUAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjMtMDctMTlUMDk6NDA6NDYr MDI6MDBf2A9FAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIzLTA3LTE5VDA5OjQwOjQ2KzAyOjAwLoW3 +QAAAABJRU5ErkJggg=="
              />
            </svg>
            {useFormatMessage("modules.employees.buttons.copy")}
          </Button.Ripple>
        </div>
      </CardBody>
    </Card>
  )
}

export default LinkInfo
