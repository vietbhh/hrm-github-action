import { ErpInput } from "@apps/components/common/ErpField"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import Avatar from "@apps/modules/download/pages/Avatar"
import Photo from "@apps/modules/download/pages/Photo"
import SwAlert from "@apps/utility/SwAlert"
import {
  formatDate,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { arrImage } from "@modules/Feed/common/common"
import { Dropdown } from "antd"
import classNames from "classnames"
import { Fragment, useCallback, useEffect } from "react"
import * as Icon from "react-feather"
import ReactHtmlParser from "react-html-parser"
import InfiniteScroll from "react-infinite-scroll-component"
import "react-perfect-scrollbar/dist/css/styles.css"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { Card, CardBody, Col, Row } from "reactstrap"
import {} from "rsuite"
import { setAppTitle } from "../../../redux/app/app"
import "../assets/scss/postSaved.scss"
import { postSavedApi, savedApi } from "../common/api"
import UnavailableData from "../components/UnavailableData"
import LoadPost from "../../../components/hrm/LoadPost/LoadPost"
import { handleDataMention } from "../common/common"

export default function PostSaved() {
  const [state, setState] = useMergedState({
    page: 1,
    search: null,
    loading: false,
    postsSaved: [],
    isSearch: false,
    hasMoreLoad: true,
    dataMention: []
  })
  const userData = useSelector((state) => state.auth.userData)
  const userId = userData.id
  const dataEmployee = useSelector((state) => state.users.list)
  useEffect(() => {
    const data_mention = handleDataMention(dataEmployee, userId)
    setState({ dataMention: data_mention })
  }, [dataEmployee])
  const getData = async (reload = false) => {
    let postSavedList = []
    setState({ loading: true })

    if (!state.search) {
      postSavedList = await postSavedApi.list(state.page)
      setState({ loading: false })
      if (reload) {
        setState({
          postsSaved: postSavedList.data,
          isSearch: false
        })
      } else if (state.isSearch) {
        setState({
          postsSaved: postSavedList.data,
          isSearch: false
        })
      } else {
        setState({
          postsSaved: state.postsSaved.concat(postSavedList.data)
        })
      }
    } else {
      postSavedList = await postSavedApi.list(state.page, state.search)
      setState({ loading: false })
      setState({
        postsSaved: postSavedList.data,
        isSearch: true
      })
    }

    if (postSavedList.data.length === 0) {
      setState({ hasMoreLoad: false })
    }
  }

  const handleDelete = async (id) => {
    SwAlert.showWarning({
      title: useFormatMessage("notification.confirm.title"),
      text: useFormatMessage("notification.confirm.text")
    }).then(async (result) => {
      if (result["isConfirmed"]) {
        const data = {
          action: "remove",
          type: "post",
          id
        }
        savedApi.postSaveSaved(data).then(async () => {
          notification.showSuccess({
            text: useFormatMessage("notification.save.success")
          })

          const afterDeleteItem = [...state.postsSaved]
          const item = afterDeleteItem.find((item) => item._id === id)
          afterDeleteItem.splice(afterDeleteItem.indexOf(item), 1)
          setState({
            postsSaved: afterDeleteItem
          })
        })
      }
    })
  }

  const renderDropdown = useCallback(
    (id) => {
      let items = [
        {
          label: (
            <div className="div-item-drop">
              <Link to={`/posts/${id}`}>
                <Icon.Shield size={22} />
                <div className="div-text">
                  <span className="div-text__title">
                    {useFormatMessage("modules.feed.post_saved.action.access")}
                  </span>
                </div>
              </Link>
            </div>
          )
        },
        {
          label: (
            <div className="div-item-drop" onClick={() => handleDelete(id)}>
              <Link
                onClick={(e) => {
                  e.preventDefault()
                }}>
                <Icon.XCircle size={22} />
                <div className="div-text">
                  <span className="div-text__title">
                    {useFormatMessage("modules.feed.post_saved.action.remove")}
                  </span>
                </div>
              </Link>
            </div>
          )
        }
      ]

      return (
        <Dropdown
          menu={{ items }}
          placement="bottomRight"
          destroyPopupOnHide={true}
          overlayClassName="post-header-button-dot">
          <Icon.MoreVertical fill="none" />
        </Dropdown>
      )
    },
    [state.postsSaved]
  )

  const setBackgroundImage = useCallback(
    (imageId) => ({
      backgroundImage: `url("${arrImage[imageId - 1].image}")`,
      color: arrImage[imageId - 1].color,
      backgroundSize: "cover"
    }),
    []
  )

  const handleFetchData = () => {
    let newPage = state.page + 1
    setState({
      page: newPage
    })
  }

  useEffect(() => {
    getData()
  }, [state.page, state.search, state.isSearch])

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setAppTitle(useFormatMessage("menu:menu.posts_saved")))
  }, [])
  return (
    <Fragment>
      <div className="div-left">
        <div className="workspace-pending-post row">
          <div id="post-saved" className="col-md-12 feed mb-1">
            <Card>
              <CardBody>
                <Row style={{ marginTop: "-10px" }}>
                  <Col xs={24}>
                    <ErpInput
                      type="text"
                      placeholder="Find post"
                      className="search_post_pending"
                      prepend={
                        <i className="fa-regular fa-magnifying-glass"></i>
                      }
                      onChange={(e) => {
                        setState({ search: e.target.value, page: 1 })
                      }}
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>
            <div className="col-md-12">
              {state.postsSaved.length === 0 && <UnavailableData />}
              {state.postsSaved.length !== 0 && (
                <div className="main-content">
                  <InfiniteScroll
                    dataLength={state.postsSaved.length}
                    next={handleFetchData}
                    hasMore={state.hasMoreLoad}
                    endMessage={
                      <p style={{ textAlign: "center" }}>
                        <b>
                          {useFormatMessage(
                            "modules.feed.post_saved.action.loadCompleted"
                          )}
                        </b>
                      </p>
                    }
                    loader={state.loading ? <DefaultSpinner /> : ""}>
                    {state?.postsSaved?.map((item) => (
                      <section className="card" key={item._id}>
                        <LoadPost
                          data={item}
                          dataMention={state.dataMention}
                          dataLink={item?.dataLink}
                          setData={() => getData(true)}
                        />
                      </section>
                    ))}
                  </InfiniteScroll>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
