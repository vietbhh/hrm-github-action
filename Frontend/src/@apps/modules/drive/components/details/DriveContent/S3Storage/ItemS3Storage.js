// ** React Imports
import { Fragment } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
import { Card, CardHeader, CardBody, Progress } from "reactstrap"
// ** Components

const ItemS3Storage = (props) => {
  const {
    // ** props
    icon,
    title,
    totalCapacity,
    usedCapacity,
    isLinked,
    progressStyle
    // ** methods
  } = props

  // ** render
  const renderCapacity = () => {
    if (!isLinked) {
      return (
        <p className="pt-50 small-text">
          {useFormatMessage("modules.drive.text.link_your_account")}
        </p>
      )
    }

    const progress = (usedCapacity / totalCapacity) * 100

    return (
      <Fragment>
        <div className="mt-2">
          <div className="mb-25 d-flex justify-content-between">
            <small className="small-text">{Math.floor(usedCapacity / 1024)} GB</small>
            <small className="small-text">{Math.floor(totalCapacity / 1024)} GB</small>
          </div>
          <Progress value={progress} className={progressStyle} />
        </div>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <Card className="s3-storage-item">
        <CardHeader className="s3-storage-header">
          <div className="w-100 d-flex justify-content-between align-items-start">
            <div className="d-flex align-items-center justify-content-center drive-icon-bg">
              {icon}
            </div>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none">
                <path
                  d="M16.5 4.875H12"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4.5 4.875H1.5"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.5 7.5C8.94975 7.5 10.125 6.32475 10.125 4.875C10.125 3.42525 8.94975 2.25 7.5 2.25C6.05025 2.25 4.875 3.42525 4.875 4.875C4.875 6.32475 6.05025 7.5 7.5 7.5Z"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.5 13.125H13.5"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 13.125H1.5"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.5 15.75C11.9497 15.75 13.125 14.5747 13.125 13.125C13.125 11.6753 11.9497 10.5 10.5 10.5C9.05025 10.5 7.875 11.6753 7.875 13.125C7.875 14.5747 9.05025 15.75 10.5 15.75Z"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </CardHeader>
        <CardBody className="s3-storage-body">
          <div>
            <h6>{title}</h6>
            <div>
              <Fragment>{renderCapacity(0)}</Fragment>
            </div>
          </div>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default ItemS3Storage
