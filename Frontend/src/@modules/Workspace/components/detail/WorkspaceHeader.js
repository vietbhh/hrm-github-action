import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { workspaceApi } from "@modules/Workspace/common/api"
import CoverEditor from "components/hrm/CoverEditor/CoverEditor"
import { Button, Card, CardBody, Nav, NavItem, NavLink } from "reactstrap"
import defaultWorkspaceCover from "../../assets/images/default_workspace_cover.webp"
import InviteWorkspaceModal from "../modals/InviteWorkspaceModal"
import { Dropdown, Space } from "antd"
import SetupNotificationModal from "../modals/SetupNotificationModal"
import notification from "@apps/utility/notification"
const WorkspaceHeader = (props) => {
  const { tabActive, tabToggle, data, loadData } = props
  const [state, setState] = useMergedState({
    coverImage: defaultWorkspaceCover,
    inviteModal: false,
    setupNotifiModal: false
  })
  const onClickInvite = () => {
    setState({ inviteModal: !state.inviteModal })
  }
  const saveCoverImage = (image) => {
    setState({ coverImage: image })
    const dataPost = { ...data, image: image, id: data?._id }
    workspaceApi.saveCoverImage(dataPost).then((res) => {
      console.log("resssss todo", res)
    })
  }

  const handleDoneInvite = (dataUpdate, field) => {
    const infoWorkspace = { ...data }
    const arrID = infoWorkspace.members.concat(
      dataUpdate.map((x) => x["id"] * 1)
    )

    infoWorkspace.members = JSON.stringify(arrID)
    console.log("infoWorkspace.members ", infoWorkspace.members)
    workspaceApi.update(infoWorkspace).then((res) => {
      if (res.statusText) {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        onClickInvite()
        setState({ loading: false })
        loadData()
      }
    })
  }
  const handleSetupNotification = () => {
    setState({ setupNotifiModal: !state.setupNotifiModal })
  }
  const items = [
    {
      label: (
        <div>
          <i className="fa-regular fa-list-ul"></i> Waiting for approval post
        </div>
      ),
      key: "0"
    },
    {
      label: (
        <div>
          <i className="fa-sharp fa-regular fa-bells"></i> Setup notification
        </div>
      ),
      key: "1",
      onClick: () => handleSetupNotification()
    },
    {
      label: (
        <a>
          <i className="fa-regular fa-square-check"></i> Setup follow
        </a>
      ),
      key: "2"
    },
    {
      label: (
        <a href={`/workspace/${data._id}/setting`}>
          <i className="fa-regular fa-gear"></i> Workspace settings
        </a>
      ),
      key: "3"
    },
    {
      label: (
        <a href={`/workspace/${data._id}/pending-posts`}>
          <i className="fa-light fa-list-check"></i> Pending posts
        </a>
      ),
      key: "4"
    }
  ]
  return (
    <Card className="pb-0">
      <div className="image-cover">
        <img src={state.coverImage} className="w-100 workspaceCover" />
        <CoverEditor
          src=""
          className="btn-cover"
          saveCoverImage={saveCoverImage}
        />
      </div>

      <CardBody className="pb-0">
        <div className="d-flex justify-content-between align-content-center">
          <div className="workspaceInformation">
            <h2 className="workspaceName">{data?.name}</h2>
            <p>
              <i className="fa-regular fa-earth-asia"></i> Public ·{" "}
              {data?.members && data?.members.length} members ·{" "}
              {data?.pinPosts && data?.pinPosts.length} posts
            </p>
          </div>
          <div className="workspaceAction">
            <Button className="btn btn-success" onClick={() => onClickInvite()}>
              <i className="fa-regular fa-plus me-50"></i>Invite
            </Button>
          </div>
        </div>
        <hr
          style={{
            margin: "0.5rem 0"
          }}
        />
        <Nav tabs className="mb-0">
          <NavItem>
            <NavLink
              active={tabActive === 1}
              onClick={() => {
                tabToggle(1)
              }}>
              {useFormatMessage("modules.workspace.display.feed")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={tabActive === 2}
              onClick={() => {
                tabToggle(2)
              }}>
              {useFormatMessage("modules.workspace.display.pinned")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={tabActive === 3}
              onClick={() => {
                tabToggle(3)
              }}>
              {useFormatMessage("modules.workspace.display.introduction")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={tabActive === 4}
              onClick={() => {
                tabToggle(4)
              }}>
              {useFormatMessage("modules.workspace.display.member")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={tabActive === 5}
              onClick={() => {
                tabToggle(5)
              }}>
              {useFormatMessage("modules.workspace.display.media")}
            </NavLink>
          </NavItem>
          <div className="ms-auto">
            <Dropdown
              menu={{
                items
              }}
              placement="bottomRight"
              trigger={["click"]}>
              <Button color="flat-secondary">
                <i className="fa-light fa-ellipsis"></i>
              </Button>
            </Dropdown>
          </div>
        </Nav>
        <InviteWorkspaceModal
          modal={state.inviteModal}
          handleModal={onClickInvite}
          handleDone={handleDoneInvite}
          member_selected={data?.members}
        />
        <SetupNotificationModal
          modal={state.setupNotifiModal}
          dataWorkspace={data}
          handleModal={handleSetupNotification}
        />
      </CardBody>
    </Card>
  )
}

export default WorkspaceHeader
