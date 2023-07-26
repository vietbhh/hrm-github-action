// ** React Imports
import { Fragment } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
import { Card, CardBody } from "reactstrap"
// ** Components
import CommonCardHeader from "../CommonCardHeader"
import CreateSkillFolderModal from "../../../modals/CreateSkill/CreateSkillModal"

const Skill = (props) => {
  const {
    // ** props
    userAuth,
    employeeData
    // ** methods
  } = props

  const [state, setState] = useMergedState({
    isEdit: false,
    skill: employeeData.skill === null ? [] : JSON.parse(employeeData.skill),
    modal: false
  })

  const toggleModal = () => {
    setState({
      modal: !state.modal
    })
  }

  const setSkill = (data) => {
    setState({
      skill: data
    })
  }

  const handleEdit = () => {
    toggleModal()
  }

  // ** render
  const renderContent = () => {
    if (state.skill.length === 0) {
      return <span>{useFormatMessage("modules.employees.text.empty_skill")}</span>
    }

    return (
      <Fragment>
        {state.skill.map((item) => {
          return (
            <div
              className="mb-75 me-50 skill-item"
              key={`skill-item-${item.value}`}>
              {item.label}
            </div>
          )
        })}
      </Fragment>
    )
  }

  const renderBody = () => {
    if (state.modal === false) {
      return ""
    }

    return (
      <CreateSkillFolderModal
        modal={state.modal}
        skill={state.skill}
        employeeData={employeeData}
        setSkill={setSkill}
        handleModal={toggleModal}
      />
    )
  }

  return (
    <Fragment>
      <Card className="mb-1 skill-section">
        <CardBody>
          <CommonCardHeader
            title={useFormatMessage("modules.employees.fields.skill")}
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
      <Fragment>{renderBody()}</Fragment>
    </Fragment>
  )
}

export default Skill
