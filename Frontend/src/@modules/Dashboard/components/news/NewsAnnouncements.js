import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { newsApi } from "@modules/News/common/api"
import draftToHtml from "draftjs-to-html"
import moment from "moment"
import { Fragment, useEffect } from "react"
import ReactHtmlParser from "react-html-parser"
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react/swiper-react"
import { Link } from "react-router-dom"
import { EmptyContent } from "@apps/components/common/EmptyContent"
// ** Hooks
import { useRTL } from "@hooks/useRTL"
// ** Styles
import "@styles/react/libs/swiper/swiper.scss"
// ** Init Swiper Functions
SwiperCore.use([Navigation, Pagination, Autoplay])

const NewsAnnouncements = (props) => {
  const [state, setState] = useMergedState({
    news_data_important: [],
    news_data: [],
    news_loading: true,
    news_perPage: 3,
    news_orderCol: "id",
    new_orderType: "desc"
  })
  const [isRtl] = useRTL()

  useEffect(() => {
    news_loadData()
  }, [])

  const news_loadData = (props) => {
    setState({
      news_loading: true
    })
    const params = {
      perPage: state.news_perPage,
      page: 1,
      orderCol: state.news_orderCol,
      orderType: state.new_orderType,
      filters: {
        status: 1
      },
      checkAnnouncements: true
    }
    newsApi
      .getList(params)
      .then((res) => {
        setState({
          news_data_important: res.data.data_important,
          news_data: res.data.data_new,
          news_loading: false
        })
      })
      .catch((err) => {
        setState({
          news_loading: false
        })
      })
  }

  const params = {
    pagination: {
      clickable: true
    },
    autoplay: {
      delay: 10000,
      disableOnInteraction: false
    }
  }

  const renderContent = (content) => {
    try {
      const json = JSON.parse(content)
      return ReactHtmlParser(draftToHtml(json).replace(/<\/?[^>]+(>|$)/g, ""))
    } catch (e) {
      return ""
    }
  }

  return (
    <Fragment>
      {state.news_loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%"
          }}>
          <DefaultSpinner />
        </div>
      )}

      {!state.news_loading && (
        <>
          {_.isEmpty(state.news_data_important) &&
          _.isEmpty(state.news_data) ? (
            <>
              <EmptyContent
                icon={<i className="fal fa-bullhorn"></i>}
                title={useFormatMessage("modules.dashboard.announcement.empty")}
                text={useFormatMessage(
                  "modules.dashboard.announcement.empty_text"
                )}
              />
            </>
          ) : (
            <>
              {!_.isEmpty(state.news_data_important) && (
                <>
                  <div className="div-news-slide">
                    <Swiper {...params} dir={isRtl ? "rtl" : "ltr"}>
                      {_.map(state.news_data_important, (value, index) => {
                        return (
                          <SwiperSlide key={index}>
                            <div className="div-content">
                              <p className="p-date">
                                {moment(value.important_end_date).format(
                                  "DD MMMM, YYYY"
                                )}
                              </p>
                              <Link to={`/news/detail/${value.id}`}>
                                <p className="p-title">{value.title}</p>
                              </Link>
                            </div>
                          </SwiperSlide>
                        )
                      })}
                    </Swiper>
                  </div>

                  <hr />
                </>
              )}

              {!_.isEmpty(state.news_data) && (
                <>
                  {_.map(state.news_data, (value, index) => {
                    return (
                      <div key={index} className="div-news-data">
                        <div className="div-news-data-time">
                          <span className="div-news-data-time-text">
                            {moment().format("YYYY-MM-DD").toString() ===
                            moment(value.created_at)
                              .format("YYYY-MM-DD")
                              .toString()
                              ? useFormatMessage("modules.dashboard.today")
                              : moment(value.created_at).format("MMM, DD")}
                          </span>
                          <span className="div-news-data-time-text">
                            {moment().format("YYYY-MM-DD").toString() ===
                            moment(value.created_at)
                              .format("YYYY-MM-DD")
                              .toString()
                              ? moment(value.created_at).format("HH.mm A")
                              : moment(value.created_at).format("YYYY")}
                          </span>
                        </div>
                        <div className="div-news-data-content">
                          <Link to={`/news/detail/${value.id}`}>
                            <span className="div-news-data-content-title">
                              {value.title}
                            </span>
                          </Link>
                          <span className="div-news-data-content-text">
                            {renderContent(value.content)}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </>
              )}
            </>
          )}
        </>
      )}
    </Fragment>
  )
}

export default NewsAnnouncements
