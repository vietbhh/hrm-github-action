// ** React Imports
import { Fragment } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
import { Card, CardBody } from "reactstrap"
// ** Components
import CommonCardHeader from "../CommonCardHeader"

const Skill = (props) => {
  const {
    // ** props
    userAuth,
    employeeData
    // ** methods
  } = props

  const [state, setState] = useMergedState({
    isEdit: false,
    skill: [
      {
        value: "1",
        label: "Product Design"
      },
      {
        value: "1",
        label: "UX Design"
      },
      {
        value: "1",
        label: "Google Analytics"
      },
      {
        value: "1",
        label: "SEO Content"
      },
      {
        value: "1",
        label: "UI Design"
      },
      {
        value: "1",
        label: "Design Strategy"
      },
      {
        value: "1",
        label: "Web-Development"
      },
      {
        value: "1",
        label: "Front End"
      }
    ]
  })

  const handleEdit = () => {
    setState({
      isEdit: true
    })
  }

  // ** render
  const renderContent = () => {
    return (
      <Fragment>
        {state.skill.map((item) => {
          return <div className="mb-75 me-50 skill-item">{item.label}</div>
        })}
      </Fragment>
    )
  }

  return (
    <Card className="skill-section">
      <CardBody>
        <CommonCardHeader
          title={
            <Fragment>
              {useFormatMessage("modules.employees.fields.skill")}
              <span className="text-danger">.</span>
            </Fragment>
          }
          userAuth={userAuth}
          employeeData={employeeData}
          isEmptyContent={!_.isEmpty(state.skill)}
          handleEdit={handleEdit}
        />
        <div className="d-flex flex-wrap pt-25 skill-list">
          <Fragment>{renderContent()}</Fragment>
        </div>
      </CardBody>
    </Card>
  )
}

export default Skill
