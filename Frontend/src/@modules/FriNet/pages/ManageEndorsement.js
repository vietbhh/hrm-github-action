import { useFormatMessage } from "@apps/utility/common"
import React from "react"
import { Card, CardBody, CardHeader } from "reactstrap"
import { Tabs } from "antd"
import "../assets/scss/manage_endorsement.scss"
import BadgeSetting from "../components/ManageEndorsement/BadgeSetting"
import Leaderboard from "../components/ManageEndorsement/Leaderboard"
import { useDispatch } from "react-redux"
import { setAppTitle } from "../../../redux/app/app"

const ManageEndorsement = () => {
  const items = [
    {
      key: "1",
      label: useFormatMessage("modules.manage_endorsement.badge_setting.title"),
      children: <BadgeSetting />
    },
    {
      key: "2",
      label: useFormatMessage("modules.manage_endorsement.leaderboard.title"),
      children: <Leaderboard />
    }
  ]

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setAppTitle("Endorsements Management"))
  }, [])

  return (
    <div className="setting-member medal-management">
      <Card>
        <CardHeader>
          <div className="menu-icon blue">
            <i className="fa-solid fa-medal"></i>
          </div>
          <span className="title">
            {useFormatMessage("layout.manage_endorsement")}
          </span>
        </CardHeader>
      </Card>

      <Card>
        <CardBody>
          <Tabs defaultActiveKey="1" items={items} onChange={() => {}} />
        </CardBody>
      </Card>
    </div>
  )
}

export default ManageEndorsement
