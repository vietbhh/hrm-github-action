// ** React Imports
import { workspaceApi } from "@modules/Workspace/common/api"
import { useMergedState } from "@apps/utility/common"
import { Fragment, useEffect } from "react"
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"
// ** Styles
// ** Components
import WorkspaceItem from "../../../../Workspace/components/detail/ListWorkSpace/WorkspaceItem"

SwiperCore.use([Navigation, Autoplay])

const WorkspaceSlide = (props) => {
  const {
    // ** props
    employeeData
    // ** methods
  } = props

  const [state, setState] = useMergedState({
    loading: true,
    data: []
  })

  const loadData = () => {
    setState({
      loading: true
    })

    workspaceApi
      .getList({
        page: 1,
        limit: 15,
        workspace_type: "managed",
        user_id: employeeData.id
      })
      .then((res) => {
        setState({
          data: res.data.results,
          loading: false
        })
      })
      .catch((err) => {
        setState({
          data: [],
          loading: false
        })
      })
  }

  // ** effect
  useEffect(() => {
    loadData()
  }, [])

  // ** render
  const renderComponent = () => {
    if (state.loading === true) {
      return ""
    }

    if (state.data.length === 0) {
      return ""
    }

    return (
      <div className="mb-1 workspace-slide-section">
        <div className="workspace-list workspace-manage-list">
          <Swiper
            slidesPerView={1}
            spaceBetween={10}
            pagination={{
              clickable: true
            }}
            //loop={true}
            navigation={true}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 40
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 5
              }
            }}
            className="mySwiper">
            {state.data.map((item, index) => {
              return (
                <SwiperSlide key={`workspace-item-${index}`}>
                  <WorkspaceItem workspaceType="manage" infoWorkspace={item} />
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>
      </div>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default WorkspaceSlide
