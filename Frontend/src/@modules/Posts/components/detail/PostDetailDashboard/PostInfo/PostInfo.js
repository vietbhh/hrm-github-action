// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { feedApi } from "@modules/Feed/common/api"
import { Fragment, useEffect } from "react"
import { useNavigate } from "react-router-dom"
// ** Styles
import { Card, CardBody } from "reactstrap"
// ** Components
import LoadPost from "@/components/hrm/LoadPost/LoadPost"
import { Space } from "antd"

const PostInfo = (props) => {
  const {
    // ** props
    idPost
    // ** methods
  } = props

  const [state, setState] = useMergedState({
    loading: true,
    data: {}
  })

  const navigate = useNavigate()

  const loadData = () => {
    setState({
      loading: true
    })

    feedApi
      .getGetFeed(idPost)
      .then((res) => {
        setState({
          data: res.data,
          loading: false
        })
      })
      .catch((err) => {
        setState({
          data: {},
          loading: false
        })
      })
  }

  const handleClickBack = () => {
    navigate(-1)
  }

  const handleClickGoToPost = () => {
    navigate(`/posts/${idPost}`)
  }

  // ** effect
  useEffect(() => {
    loadData()
  }, [idPost])

  // ** render
  const renderButtonLink = () => {
    return (
      <div className="button-link-area">
        <Space>
          <p
            className="mb-0 mt-0 me-50 font-weight-bold text-danger"
            onClick={() => handleClickBack()}>
            <i className="fas fa-arrow-left me-50" />
            {useFormatMessage(
              "modules.posts.post_details.buttons.back_to_management"
            )}
          </p>
          <p
            className="mb-0 mt-0 font-weight-bold text-success"
            onClick={() => handleClickGoToPost()}>
            {useFormatMessage("modules.posts.post_details.buttons.go_to_post")}
            <i className="fas fa-arrow-right ms-50" />
          </p>
        </Space>
      </div>
    )
  }

  const renderLoadPost = () => {
    if (!state.loading) {
      return (
        <Fragment>
          <LoadPost
            data={state.data}
            avatarHeight={20}
            avatarWidth={20}
            offReactionAndComment={true}
            offPostHeaderAction={true}
            renderAppendHeaderComponent={renderButtonLink}
          />
        </Fragment>
      )
    }
  }

  return (
    <Card className="post-info-section">
      <CardBody>
        <Fragment>{renderLoadPost()}</Fragment>
      </CardBody>
    </Card>
  )
}

export default PostInfo
