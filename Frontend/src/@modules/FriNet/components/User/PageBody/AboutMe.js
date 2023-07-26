// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
import { Card, CardBody } from "reactstrap"
import { employeesApi } from "../../../../Employees/common/api"
// ** Components
import EditIntroduction from "../../../../Workspace/components/detail/TabIntroduction/EditIntroduction"
import CommonCardHeader from "./CommonCardHeader"

const AboutMe = (props) => {
  const {
    // ** props
    employeeData,
    userAuth
    // ** methods
  } = props

  const [state, setState] = useMergedState({
    isEdit: false,
    about: employeeData.about,
    showSeeMore: false,
    seeMore: false
  })

  const setAbout = (str) => {
    setState({
      about: str
    })
  }

  const handleEdit = () => {
    setState({
      isEdit: true
    })
  }

  const handleCancelEdit = () => {
    setState({
      isEdit: false
    })
  }

  // ** effect
  useEffect(() => {
    if (document.getElementById(`about-me-section`)) {
      const height = document.getElementById(`about-me-section`).offsetHeight
      if (height > 240) {
        setState({ showSeeMore: true })
      }
    }
  }, [])

  // ** render
  const renderContent = () => {
    if (!_.isEmpty(state.about) && state.isEdit === false) {
      return (
        <Fragment>
          <div>
            <p>
              <span
                className={`about-text mt-75 ${
                  state.showSeeMore && state.seeMore === false ? "hide" : ""
                }`}>
                {state.about}
              </span>{" "}
              {state.showSeeMore && (
                <a
                  className="btn-see-more"
                  onClick={(e) => {
                    e.preventDefault()
                    setState({ seeMore: !state.seeMore })
                  }}>
                  <p className="mb-0 pt-50 blue-text">
                    {state.seeMore === false
                      ? useFormatMessage("modules.feed.post.text.see_more")
                      : useFormatMessage("modules.feed.post.text.hide")}
                  </p>
                </a>
              )}
            </p>
          </div>
        </Fragment>
      )
    }

    if (state.isEdit) {
      return (
        <EditIntroduction
          id={employeeData.id}
          api={employeesApi.postUpdate}
          introduction={state.about}
          customInputName="about"
          handleCancelEdit={handleCancelEdit}
          setIntroduction={setAbout}
        />
      )
    }

    if (parseInt(userAuth.id) === parseInt(employeeData.id)) {
      return (
        <small className="d-block small-description">
          {useFormatMessage("modules.employees.text.about_me_description")}
        </small>
      )
    }

    return (
      <p className="introduction-text mt-75 mb-0">
        {useFormatMessage("modules.employees.text.empty_about_me")}
      </p>
    )
  }

  return (
    <Card className="mb-1 about-me-section" id="about-me-section">
      <CardBody>
        <CommonCardHeader
          title={
            <Fragment>
              {useFormatMessage("modules.employees.fields.about")}
              <span className="text-danger">.</span>
            </Fragment>
          }
          userAuth={userAuth}
          employeeData={employeeData}
          isEmptyContent={!_.isEmpty(state.about)}
          handleEdit={handleEdit}
        />
        <div className="about-content">
          <Fragment>{renderContent()}</Fragment>
        </div>
      </CardBody>
    </Card>
  )
}

export default AboutMe
