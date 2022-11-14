import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import AppSpinner from "@apps/components/spinner/AppSpinner"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Fragment, useContext } from "react"
import { Navigate } from "react-router-dom"
import { AbilityContext } from "utility/context/Can"
import Attendance from "../components/layout/Attendance"

const TeamAttendance = () => {
  const ability = useContext(AbilityContext)

  if (ability.can("accessTeamAttendance", "attendances") === false) {
    return (
      <>
        <Navigate to="/not-found" replace={true} />
        <AppSpinner />
      </>
    )
  }

  const [state, setState] = useMergedState({
    type: "team"
  })

  return (
    <Fragment>
      <Breadcrumbs
        className="team-attendance-breadcrumbs"
        list={[
          {
            title: useFormatMessage("modules.team_attendance.attendance")
          },
          {
            title: useFormatMessage("modules.team_attendance.title")
          }
        ]}
      />

      <Attendance type={state.type} />
    </Fragment>
  )
}

export default TeamAttendance
