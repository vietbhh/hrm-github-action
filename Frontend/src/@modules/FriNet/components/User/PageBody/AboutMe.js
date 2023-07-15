// ** React Imports
import { Fragment } from "react"
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
    about: employeeData.about
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

  // ** render
  const renderContent = () => {
    if (!_.isEmpty(state.about) && state.isEdit === false) {
      return <p className="about-text mt-75">{state.about}</p>
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
        <Fragment>
          <small className="d-block small-description">
            {useFormatMessage("modules.employees.text.about_me_description")}
          </small>
        </Fragment>
      )
    }

    return (
      <p className="introduction-text mt-75 mb-0">
        {useFormatMessage("modules.employees.text.empty_about_me")}
      </p>
    )
  }

  return (
    <Card className="mb-1 about-me-section">
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
