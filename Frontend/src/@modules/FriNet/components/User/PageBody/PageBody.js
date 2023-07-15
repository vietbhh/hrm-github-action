// ** React Imports
// ** Styles
// ** Components
import TimelineEndorsement from "../Timeline/TimelineEndorsement"
import AboutMe from "./AboutMe"
import Skill from "./Skill/Skill"
import WorkspaceSlide from "./WorkspaceSlide"

const PageBody = (props) => {
  const {
    // ** props
    identity,
    employeeData,
    userAuth
    // ** methods
  } = props

  // ** render
  return (
    <div className="mt-1 page-body">
      <div className="div-timeline div-content ">
        <div className="div-left">
          <AboutMe employeeData={employeeData} userAuth={userAuth} />
          <Skill employeeData={employeeData} userAuth={userAuth} />
          <WorkspaceSlide employeeData={employeeData} userAuth={userAuth} />
        </div>
        <div className="div-right">
          <div id="div-sticky-height"></div>
          <div id="div-sticky">
            <TimelineEndorsement
              employeeId={employeeData?.id}
              employeeData={employeeData}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageBody
