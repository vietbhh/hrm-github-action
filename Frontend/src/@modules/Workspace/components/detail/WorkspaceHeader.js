import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { workspaceApi } from "@modules/Workspace/common/api"
import CoverEditor from "components/hrm/CoverEditor/CoverEditor"
import { Button, Card, CardBody, Nav, NavItem, NavLink } from "reactstrap"
import defaultWorkspaceCover from "../../assets/images/default_workspace_cover.webp"
import InviteWorkspaceModal from "../modals/InviteWorkspaceModal"
const WorkspaceHeader = (props) => {
  const { tabActive, tabToggle } = props
  const [state, setState] = useMergedState({
    coverImage: defaultWorkspaceCover,
    inviteModal: false
  })
  const onClickInvite = () => {
    setState({ inviteModal: !state.inviteModal })
  }
  const saveCoverImage = (image) => {
    console.log("runnn")
    setState({ coverImage: image })
    const data = { image: image, id: 1 }
    workspaceApi.saveCoverImage(data).then((res) => {
      console.log("resssss", res)
    })
  }
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
            <h2 className="workspaceName">Friday</h2>
            <p>
              <i className="fa-regular fa-earth-asia"></i> Public · 2 members ·
              3 posts
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
            <Button color="sencondary">
              <i className="fa-light fa-ellipsis"></i>
            </Button>
          </div>
        </Nav>
        <InviteWorkspaceModal
          modal={state.inviteModal}
          handleModal={onClickInvite}
        />
      </CardBody>
    </Card>
  )
}

export default WorkspaceHeader
