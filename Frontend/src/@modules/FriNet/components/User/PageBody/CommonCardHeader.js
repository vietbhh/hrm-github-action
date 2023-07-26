// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Fragment } from "react"
// ** Styles
import { Button } from "reactstrap"
import { Dropdown } from "antd"
// ** Components

const CommonCardHeader = (props) => {
  const {
    // ** props
    title,
    userAuth,
    employeeData,
    isEmptyContent,
    showButtonAction = true,
    /// ** methods
    handleEdit
  } = props

  // ** render
  const renderAction = () => {
    if (showButtonAction === false) {
      return ""
    }

    if (parseInt(userAuth.id) !== parseInt(employeeData.id)) {
      return ""
    }

    const items = [
      {
        key: "1",
        label: (
          <Button.Ripple
            size="sm"
            color="flat-secondary"
            onClick={() => handleEdit()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              version="1.1"
              id="Layer_1"
              x="0px"
              y="0px"
              width="16px"
              height="16px"
              viewBox="0 0 16 16"
              enableBackground="new 0 0 16 16"
              xmlSpace="preserve"
              className="me-50">
              {" "}
              <image
                id="image0"
                width="16"
                height="16"
                x="0"
                y="0"
                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAXVBMVEUAAAAwQFAwQEwwQFAw Q1ExQ08wQk4zQ08zQ1AyRFAyQk4wRVAyQ08xQ04xQU4yQ08xQk8wQ0wyQ08wSFAyQ08xQ04yQk8w Qk0yQk4xQ08yQk4yQk00QEwyQ0/////yBvhaAAAAHXRSTlMAEEAgX+9/z1CAgDDvoKDf31CfIOCw n2CQv8BgQJov16UAAAABYktHRB5yCiArAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5wca BhUcbSgsmAAAAHRJREFUGNNVjmEXgjAIRVloaVsyXWZl7///zYbORvcD7HI4bxAduBOTpWmBs3Vc uh7Xn3sER3TTsnvezwkDyoBb8RLHEVPxKImSAOKqa8zWMsP2KGPlPv876e/WGY/lGUOqR76A8Pbm al4/fFAWKpqfVoOnL15QCKLQonlrAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIzLTA3LTI2VDA0OjIx OjI4KzAyOjAwVKOAIgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMy0wNy0yNlQwNDoyMToyOCswMjow MCX+OJ4AAAAASUVORK5CYII="
              />
            </svg>
            {useFormatMessage("button.edit")}
          </Button.Ripple>
        )
      }
    ]

    return (
      <Dropdown
        placement="bottomRight"
        menu={{ items }}
        trigger="click"
        overlayClassName="dropdown-workspace-about-group">
        <Button.Ripple color="secondary" className="btn-icon btn-action-empty">
          <i className="fas fa-ellipsis-h" />
        </Button.Ripple>
      </Dropdown>
    )
  }

  return (
    <div className="d-flex align-items-center justify-content-between header">
      <div className="">
        <h5 className="common-card-title">{title}</h5>
      </div>
      <div>
        <Fragment>{renderAction()}</Fragment>
      </div>
    </div>
  )
}

export default CommonCardHeader
