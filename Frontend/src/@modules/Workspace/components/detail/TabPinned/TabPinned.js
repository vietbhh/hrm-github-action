import Avatar from "@apps/modules/download/pages/Avatar"
import Photo from "@apps/modules/download/pages/Photo"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { workspaceApi } from "@modules/Workspace/common/api"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { Card, CardBody, Col, Row, Button } from "reactstrap"

import moment from "moment"
import ReactHtmlParser from "react-html-parser"
import { Dropdown } from "antd"
import { PushpinOutlined } from "@ant-design/icons"
import Introduction from "../TabIntroduction/Introduction"
import { EmptyContent } from "@apps/components/common/EmptyContent"

const TabPinned = (props) => {
  const { detailWorkspace, handlePinPost, handleUnPinPost } = props
  const [state, setState] = useMergedState({
    prevScrollY: 0,
    dataCreateNew: {},
    approveStatus: "pending",
    dataPin: [],
    loading: false
  })

  const userId = parseInt(useSelector((state) => state.auth.userData.id)) || 0
  const params = useParams()
  const workspaceID = params?.id

  const loadData = (paramsX = {}) => {
    paramsX.id = workspaceID
    workspaceApi.loadPinned(paramsX).then((res) => {
      setState({ dataPin: res.data.dataPost })
    })
  }
  const renderPostPinned = (data = []) => {
    if (data.length === 0) {
      return (
        <div className="empty-pinned pt-1">
          <div className="w-100 d-flex flex-column justify-content-center align-items-center mb-2">
            <EmptyContent
              className="custom-empty-content"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  version="1.1"
                  id="Layer_1"
                  x="0px"
                  y="0px"
                  width="130px"
                  height="120px"
                  viewBox="0 0 130 120"
                  enableBackground="new 0 0 130 120"
                  xmlSpace="preserve">
                  {" "}
                  <image
                    id="image0"
                    width="130"
                    height="120"
                    x="0"
                    y="0"
                    href="data:image/png;base64,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 SUVORK5CYII="
                  />
                </svg>
              }
              title={useFormatMessage(
                "modules.workspace.display.empty_pinned.title"
              )}
              text={useFormatMessage(
                "modules.workspace.display.empty_pinned.description"
              )}
            />
          </div>
        </div>
      )
    }

    return data.map((item, key) => {
      const items = [
        {
          label: (
            <div className="d-flex">
              <PushpinOutlined style={{ fontSize: "18px" }} className="me-50" />
              <span>
                {useFormatMessage("modules.workspace.text.unpin_post")}
              </span>
            </div>
          ),
          key: "0",
          onClick: () => handleUnPinPost(item?._id)
        },
        {
          label: (
            <div>
              <i className="fa-regular fa-arrow-up me-50"></i>
              <span>
                {useFormatMessage("modules.workspace.text.move_to_top")}
              </span>
            </div>
          ),
          key: "1",
          onClick: () => handlePinPost(item?._id)
        }
      ]
      return (
        <Col sm={12} key={key}>
          <Card>
            <CardBody>
              <div className="d-flex">
                <Avatar src={item.created_by?.avatar} className="me-1" />
                <div>
                  <h6 className="fw-blod mb-0">
                    {item.created_by?.full_name}
                    <i className="fa-solid fa-caret-right ms-50 me-50"></i>
                    {detailWorkspace.name}
                  </h6>
                  <small className="text-muted">
                    {moment(item?.created_at).format("DD MMM, YYYY")}
                  </small>
                </div>
                <div className="ms-auto">
                  <Dropdown
                    menu={{
                      items
                    }}
                    trigger={["click"]}>
                    <Button className="ms-1" color="flat-secondary" size="sm">
                      <i className="fa-solid fa-ellipsis-vertical"></i>
                    </Button>
                  </Dropdown>
                </div>
              </div>
              <div className="d-flex mt-1">
                <div>{ReactHtmlParser(item?.content)}</div>
                <div className="ms-auto">
                  {item?.thumb && <Photo src={item?.thumb} width={"100px"} />}
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      )
    })
  }

  const setIntroduction = (data) => {
    setState({ loading: true })
    detailWorkspace.introduction = data
    setState({ loading: false })
  }

  useEffect(() => {
    const arrAdmin = detailWorkspace?.administrators
      ? detailWorkspace?.administrators
      : []
    const isAdmin = arrAdmin.includes(userId)
    if (isAdmin) {
      setState({ approveStatus: "approved" })
    } else {
      if (detailWorkspace?.review_post) {
        setState({ approveStatus: "pending" })
      } else {
        setState({ approveStatus: "approved" })
      }
    }

    loadData({})
  }, [])

  useEffect(() => {
    setState({ dataPin: detailWorkspace?.pinPosts })
  }, [detailWorkspace])

  return (
    <div className="div-content">
      <div className="div-left">
        <Row>{renderPostPinned(state.dataPin)}</Row>
      </div>
      <div className="div-right">
        <div id="div-sticky">
          <Introduction
            id={workspaceID}
            loading={state.loading}
            workspaceInfo={detailWorkspace}
            introduction={detailWorkspace.introduction}
            setIntroduction={setIntroduction}
          />
        </div>
      </div>
    </div>
  )
}

export default TabPinned
