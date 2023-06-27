// ** React Imports
import { Fragment, useContext, useEffect, useState } from "react"

// ** Third Party Components
import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Tooltip } from "antd"
import moment from "moment"
import * as Icon from "react-feather"
import { AbilityContext } from "utility/context/Can"
import { HeaderAssistantApi } from "../common/api"
import HeaderAssistantModal from "./modal/HeaderAssistantModal"

// ** Reactstrap Imports
import { NavItem, NavLink } from "reactstrap"

// ** Hooks
import { useRTL } from "@hooks/useRTL"

// ** Swiper
import "@styles/react/libs/swiper/swiper.scss"
import SwiperCore, { Autoplay } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"
SwiperCore.use([Autoplay])

// ** image
import Photo from "@apps/modules/download/pages/Photo"
import { Link } from "react-router-dom"
import Icon_01d from "../images/01d.png"
import Icon_01n from "../images/01n.png"
import Icon_02d from "../images/02d.png"
import Icon_02n from "../images/02n.png"
import Icon_09d from "../images/09d.png"
import Icon_09n from "../images/09n.png"
import Icon_11d from "../images/11d.png"
import Icon_11n from "../images/11n.png"
import Icon_13d from "../images/13d.png"
import Icon_50d from "../images/50d.png"
import Cloud from "../images/Cloud.svg"
import birthday from "../images/birthday.svg"
import image1 from "../images/image1.png"

const NavbarBookmarks = (props) => {
  // ** Props
  const {
    setMenuVisibility,
    windowWidth,
    windowWidthMin,
    full_name,
    hideIconVisibility
  } = props
  const [good, setGood] = useState("")
  const [isRtl] = useRTL()
  const params = {
    autoplay: {
      delay: 10000,
      disableOnInteraction: false
    }
  }
  const ability = useContext(AbilityContext)

  const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  const getGood = () => {
    const hour = moment().hours()
    if (4 <= hour && hour < 12) {
      setGood(useFormatMessage("layout.header.welcome.morning.title"))
      setState({
        content_welcome: useFormatMessage(
          `layout.header.welcome.morning.content_${randomNumber(1, 38)}`,
          {},
          useFormatMessage(`layout.header.welcome.morning.content_1`)
        )
      })
    } else if (12 <= hour && hour < 18) {
      setGood(useFormatMessage("layout.header.welcome.afternoon.title"))
      setState({
        content_welcome: useFormatMessage(
          `layout.header.welcome.afternoon.content_${randomNumber(1, 23)}`,
          {},
          useFormatMessage(`layout.header.welcome.afternoon.content_1`)
        )
      })
    } else {
      setGood(useFormatMessage("layout.header.welcome.evening.title"))
      setState({
        content_welcome: useFormatMessage(
          `layout.header.welcome.evening.content_${randomNumber(1, 17)}`,
          {},
          useFormatMessage(`layout.header.welcome.evening.content_1`)
        )
      })
    }
  }

  const [state, setState] = useMergedState({
    content_welcome: "",
    data_birthday: [],
    content_birthday: [],
    data_weather: {},
    data_custom: [],
    modal_add_header_assistant: false
  })

  const arrImageWeather = {
    // day
    "01d": Icon_01d,
    "02d": Icon_02d,
    "03d": Icon_02d,
    "04d": Icon_02d,
    "09d": Icon_09d,
    "10d": Icon_09d,
    "11d": Icon_11d,
    "13d": Icon_13d,
    "50d": Icon_50d,

    // night
    "01n": Icon_01n,
    "02n": Icon_02n,
    "03n": Icon_02n,
    "04n": Icon_02n,
    "09n": Icon_09n,
    "10n": Icon_09n,
    "11n": Icon_11n,
    "13n": Icon_13d,
    "50n": Icon_50d
  }

  const getWeather = () => {
    HeaderAssistantApi.getWeather()
      .then((res) => {
        setState({ data_weather: res.data.temp ? res.data : {} })
      })
      .catch((err) => {})
  }

  const getBirthdayAndCustom = () => {
    HeaderAssistantApi.getHeaderAssistant()
      .then((res) => {
        setState({
          data_birthday: res.data.data_birthday?.data,
          content_birthday: res.data.data_birthday?.content,
          data_custom: res.data.data_custom
        })
      })
      .catch((err) => {})
  }

  useEffect(() => {
    getGood()
    getWeather()
    getBirthdayAndCustom()
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      getGood()
      getWeather()
      getBirthdayAndCustom()
    }, 300000)

    return () => clearInterval(intervalId)
  }, [])

  const toggleModalHeaderAssistant = () => {
    setState({ modal_add_header_assistant: !state.modal_add_header_assistant })
  }

  return (
    <Fragment>
      {hideIconVisibility !== true && (
        <ul className="navbar-nav d-xl-none">
          <NavItem className="mobile-menu me-auto">
            <NavLink
              className="nav-menu-main menu-toggle hidden-xs is-active"
              onClick={() => setMenuVisibility(true)}>
              <Icon.Menu className="ficon" />
            </NavLink>
          </NavItem>
        </ul>
      )}

      {windowWidth >= windowWidthMin && (
        <>
          <div className="nav-welcome">
            <Swiper {...params} dir={isRtl ? "rtl" : "ltr"}>
              <SwiperSlide>
                <div className="nav-welcome-text">
                  <span
                    className="text-welcome-1"
                    title={good + ", " + full_name + "!"}>
                    {good}, {full_name}!
                  </span>
                  <span
                    className="text-welcome-2"
                    title={state.content_welcome}>
                    {state.content_welcome}
                  </span>
                </div>
                <div className="image right">
                  <img src={image1} />
                </div>
              </SwiperSlide>

              {/* Weather */}
              {!_.isEmpty(state.data_weather) && (
                <SwiperSlide>
                  <div className="image weather left">
                    <img
                      src={
                        arrImageWeather[state.data_weather?.icon]
                          ? arrImageWeather[state.data_weather?.icon]
                          : Cloud
                      }
                    />
                  </div>
                  <div className="nav-welcome-text weather">
                    <span
                      className="text-welcome-1"
                      title={`${state.data_weather?.temp}°C - ${state.data_weather?.description}`}>
                      {`${state.data_weather?.temp}°C - ${state.data_weather?.description}`}
                    </span>
                    <span
                      className="text-welcome-2"
                      title={useFormatMessage(
                        `layout.header.weather.${state.data_weather?.main}.content_${state.data_weather?.content}`,
                        {},
                        useFormatMessage(
                          `layout.header.weather.${state.data_weather?.main}.content_1`
                        )
                      )}>
                      {useFormatMessage(
                        `layout.header.weather.${state.data_weather?.main}.content_${state.data_weather?.content}`,
                        {},
                        useFormatMessage(
                          `layout.header.weather.${state.data_weather?.main}.content_1`
                        )
                      )}
                    </span>
                  </div>
                </SwiperSlide>
              )}

              {/* birthday */}
              {!_.isEmpty(state.data_birthday) &&
                _.map(state.data_birthday, (value, index) => {
                  return (
                    <SwiperSlide key={index}>
                      <div className="image birthday birthday-avatar left">
                        <Avatar src={value.avatar ? value.avatar : ""} />
                      </div>
                      <div className="nav-welcome-text">
                        <span
                          className="text-welcome-1"
                          title={
                            useFormatMessage("layout.header.birthday.title") +
                            ", " +
                            value.full_name +
                            "!"
                          }>
                          {useFormatMessage("layout.header.birthday.title") +
                            ", " +
                            value.full_name +
                            "!"}
                        </span>
                        <span
                          className="text-welcome-2"
                          title={useFormatMessage(
                            `layout.header.birthday.content_${state.content_birthday[index]}`,
                            {},
                            useFormatMessage(`layout.header.birthday.content_1`)
                          )}>
                          {useFormatMessage(
                            `layout.header.birthday.content_${state.content_birthday[index]}`,
                            {},
                            useFormatMessage(`layout.header.birthday.content_1`)
                          )}
                        </span>
                      </div>
                      <div className="image right">
                        <img src={birthday} />
                      </div>
                    </SwiperSlide>
                  )
                })}

              {/* custom */}
              {!_.isEmpty(state.data_custom) &&
                _.map(state.data_custom, (value, index) => {
                  return (
                    <SwiperSlide key={index}>
                      {value.image_position &&
                        value.image_position === "left" && (
                          <div className="image left">
                            {value.image === "0" || !value.image ? (
                              <img src={image1} />
                            ) : (
                              <Photo src={value.image} />
                            )}
                          </div>
                        )}

                      <div className="nav-welcome-text">
                        {value.link ? (
                          <Link
                            className="text-welcome-1"
                            to={value.link}></Link>
                        ) : (
                          <span className="text-welcome-1" title={value.title}>
                            {value.title}
                          </span>
                        )}

                        <span className="text-welcome-2" title={value.content}>
                          {value.content}
                        </span>
                      </div>
                      {(!value.image_position ||
                        value.image_position === "right") && (
                        <div className="image right">
                          {value.image === "0" || !value.image ? (
                            <img src={image1} />
                          ) : (
                            <Photo src={value.image} />
                          )}
                        </div>
                      )}
                    </SwiperSlide>
                  )
                })}
            </Swiper>

            {ability.can("manage", "header_assistant") && (
              <Tooltip
                title={useFormatMessage("layout.header.header_assistant.add")}>
                <svg
                  onClick={() => toggleModalHeaderAssistant()}
                  className="cursor-pointer btn-add-header-assistant"
                  xmlns="http://www.w3.org/2000/svg"
                  width="35"
                  height="35"
                  viewBox="0 0 35 35"
                  fill="none">
                  <path
                    d="M11.6666 17.5H23.3333"
                    stroke="#32434F"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"></path>
                  <path
                    d="M17.5 23.3333V11.6667"
                    stroke="#32434F"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"></path>
                </svg>
              </Tooltip>
            )}
          </div>
        </>
      )}

      <HeaderAssistantModal
        modal={state.modal_add_header_assistant}
        toggleModal={toggleModalHeaderAssistant}
        getBirthdayAndCustom={getBirthdayAndCustom}
      />
    </Fragment>
  )
}

export default NavbarBookmarks
