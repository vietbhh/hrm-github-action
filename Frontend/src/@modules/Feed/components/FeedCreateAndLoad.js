import { useMergedState } from "@apps/utility/common"
import CreatePost from "@src/components/hrm/CreatePost/CreatePost"
import LoadFeed from "./LoadFeed"
import { useSelector } from "react-redux"
import { feedApi } from "../common/api"
import { useEffect, useRef } from "react"
import { Card, CardBody, CardTitle } from "reactstrap"
import { Collapse } from "antd"
import LoadPost from "@src/components/hrm/LoadPost/LoadPost"
import "react-perfect-scrollbar/dist/css/styles.css"

import SwiperCore, {
  Autoplay,
  Navigation,
  Pagination,
  Scrollbar,
  A11y
} from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"
import { handleDataMention } from "../common/common"
const FeedCreateAndLoad = (props) => {
  const {
    workspace = [], // arr workspace: []
    apiLoadFeed = null, // api load feed
    paramsLoadFeed = {}, // add param load feed api
    approveStatus = "approved", // approved / rejected / pending
    customAction = {} // custom dropdown post header
  } = props
  const [state, setState] = useMergedState({
    dataCreateNew: {},

    // ** event
    options_employee_department: [],
    optionsMeetingRoom: [],
    listAnnouncement: [],
    dataMention: []
  })
  const userData = useSelector((state) => state.auth.userData)
  const userId = userData.id
  const dataEmployee = useSelector((state) => state.users.list)

  // ** function
  const setDataCreateNew = (value) => {
    setState({ dataCreateNew: value })
  }

  // ** useEffect
  useEffect(() => {
    const data_options = []
    _.forEach(dataEmployee, (item) => {
      data_options.push({
        value: `${item.id}_employee`,
        label: item.full_name,
        avatar: item.avatar,
        tag: item.email
      })
    })
    feedApi
      .getGetInitialEvent()
      .then((res) => {
        _.forEach(res.data.dataDepartment, (item) => {
          data_options.push({
            value: `${item.id}_department`,
            label: item.name,
            avatar: "",
            tag: "department"
          })
        })

        setState({
          options_employee_department: data_options,
          optionsMeetingRoom: res.data.dataMeetingRoom
        })
      })
      .catch((err) => {
        setState({
          options_employee_department: data_options,
          optionsMeetingRoom: []
        })
      })
  }, [])

  useEffect(() => {
    const data_mention = handleDataMention(dataEmployee, userId)
    setState({ dataMention: data_mention })
  }, [dataEmployee])
  const renderAnnouncement = (data = []) => {
    return data.map((item, key) => {
      return (
        <SwiperSlide>
          <div className="announcement-item">
            <LoadPost
              data={item}
              dataMention={state.dataMention}
              dataLink={item.dataLink}
            />
          </div>
        </SwiperSlide>
      )
    })
  }
  const items = [
    {
      key: "1",
      label: (
        <>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
              stroke="#696760"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 8V13"
              stroke="#696760"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.9941 16H12.0031"
              stroke="#696760"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {"  "}
          Announcements Were Pinned
        </>
      ),
      children: (
        <>
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            slidesPerView={3}
            Autoplay
            navigation={true}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 30
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30
              },
              1024: {
                slidesPerView: 2,
                spaceBetween: 30
              }
            }}
            className="announcements">
            {renderAnnouncement(state.listAnnouncement)}
          </Swiper>
        </>
      )
    }
  ]
  const loadAnnouncementPost = () => {
    feedApi
      .loadAnnouncementPost()
      .then((res) => {
        setState({ listAnnouncement: res?.data.results })
      })
      .catch((err) => {
        console.log("error loadAnnouncementPost", err)
      })
  }

  useEffect(() => {
    loadAnnouncementPost()
  }, [])
  return (
    <div className="feed">
      <CreatePost
        setDataCreateNew={setDataCreateNew}
        workspace={workspace}
        approveStatus={approveStatus}
        options_employee_department={state.options_employee_department}
        optionsMeetingRoom={state.optionsMeetingRoom}
      />
      {state.listAnnouncement.length > 0 && (
        <Card className="card-announcement mb-1 rounded">
          <CardTitle className="mb-0">
            <Collapse
              defaultActiveKey={["1"]}
              ghost
              items={items}
              expandIconPosition={"end"}
              expandIcon={(panelProps) => {
                return panelProps.isActive ? (
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M27.9201 16.95L21.4001 23.47C20.6301 24.24 19.3701 24.24 18.6001 23.47L12.0801 16.95"
                      stroke="#696760"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M27.9201 16.95L21.4001 23.47C20.6301 24.24 19.3701 24.24 18.6001 23.47L12.0801 16.95"
                      stroke="#696760"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )
              }}
            />
          </CardTitle>
        </Card>
      )}

      <LoadFeed
        dataCreateNew={state.dataCreateNew}
        setDataCreateNew={setDataCreateNew}
        workspace={workspace}
        apiLoadFeed={apiLoadFeed}
        customAction={customAction}
        paramsLoadFeed={paramsLoadFeed}
        options_employee_department={state.options_employee_department}
        optionsMeetingRoom={state.optionsMeetingRoom}
      />
    </div>
  )
}

export default FeedCreateAndLoad
