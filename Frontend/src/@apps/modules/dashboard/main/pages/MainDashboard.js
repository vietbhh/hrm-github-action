import { EmptyContent } from "@apps/components/common/EmptyContent"
import { ErpSwitch } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import "@styles/react/libs/charts/apex-charts.scss"
import { Drawer, Skeleton } from "antd"
import classNames from "classnames"
import { Fragment, useContext, useEffect, useState } from "react"
import { Responsive, WidthProvider } from "react-grid-layout"
import { useDispatch, useSelector } from "react-redux"
import { updateLoadingDashboard } from "@store/layout"
import { Col, Row } from "reactstrap"
import { handleFetchProfile } from "redux/authentication"
import { AbilityContext } from "utility/context/Can"
import "../../../../../../node_modules/react-grid-layout/css/styles.css"
import "../../../../../../node_modules/react-resizable/css/styles.css"
import "../../assets/css/dashboard.scss"
import "../../assets/css/dnd.scss"
import { DashboardApi } from "../common/api"
import { ListComponentConfig } from "../components/ListComponentConfig"
const ResponsiveReactGridLayout = WidthProvider(Responsive)

const LoadingComponent = () => {
  return (
    <>
      <Row>
        <Col sm="12" className="mb-2">
          <Skeleton active style={{ height: "150px" }} />
        </Col>
        <Col sm="8" className="mb-2">
          <Skeleton.Input active block style={{ height: "250px" }} />
        </Col>
        <Col sm="4" className="mb-2">
          <Skeleton.Input active block style={{ height: "250px" }} />
        </Col>
        <Col sm="8" className="mb-2">
          <Skeleton.Input active block style={{ height: "250px" }} />
        </Col>
        <Col sm="4" className="mb-2">
          <Skeleton.Input active block style={{ height: "250px" }} />
        </Col>
      </Row>
    </>
  )
}

const MainDashboard = ({
  listComponent,
  key_dashboard_widget = "dashboard_widget_default"
}) => {
  const auth = useSelector((state) => state.auth)
  const dataDashboardWidget = { ...auth.settings.dashboard_widget }
  const settingWidget = auth.settings.dashboard_widget[key_dashboard_widget]
  const loadingDashboard = useSelector((state) => state.layout.loadingDashboard)
  const dispatch = useDispatch()
  const ability = useContext(AbilityContext)
  const customizeDashboard = auth.settings.widget_dnd
  const [state, setState] = useMergedState({
    windowWidthDefault: window.innerWidth,

    // widget
    visible: false,
    data_drop: { i: "", w: 4, h: 2 },
    loading_drop: false,
    layouts: {
      lg: []
    },
    data: [],
    countWidget: -1,
    loadingOnChange: false,
    loadingRemove: false,
    breakPoints: "lg"
  })
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  // ** Update Window Width
  const handleWindowWidth = () => {
    setWindowWidth(window.innerWidth)
  }
  //** Sets Window Size & Layout Props
  useEffect(() => {
    if (window !== undefined) {
      window.addEventListener("resize", handleWindowWidth)
    }

    // { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }
    let breakPoints = ""
    if (windowWidth >= 0) {
      breakPoints = "xxs"
    }
    if (windowWidth >= 480) {
      breakPoints = "xs"
    }
    if (windowWidth >= 768) {
      breakPoints = "sm"
    }
    if (windowWidth >= 996) {
      breakPoints = "md"
    }
    if (windowWidth >= 1200) {
      breakPoints = "lg"
    }
    setState({ breakPoints: breakPoints })
  }, [windowWidth])

  const handleWidget = (id, action = "remove", params = {}) => {
    const data = listComponent
      ? listComponent({ handleWidget })
      : ListComponentConfig({ handleWidget })

    const _settingWidget = JSON.parse(localStorage.getItem("dashboard_widget"))
    if (_settingWidget !== undefined && !_.isEmpty(_settingWidget)) {
      const dataLayout = _settingWidget
      _.forEach(dataLayout, (val, key_val) => {
        if (key_val === state.breakPoints) {
          _.forEach(val, (value, key) => {
            const index = data.findIndex((item) => item.id === value.i)
            if (index > -1) {
              data[index] = {
                ...data[index],
                data_grid: {
                  ...value,
                  minW: data[index]["data_grid"]["minW"],
                  minH: data[index]["data_grid"]["minH"],
                  maxW: data[index]["data_grid"]["maxW"],
                  maxH: data[index]["data_grid"]["maxH"],
                  static: !customizeDashboard,
                  isDraggable: customizeDashboard
                },
                show: true
              }
            }
          })
        }
      })
      if (action === "static") {
        if (params.modal) {
          _.forEach(dataLayout, (val, key_val) => {
            _.forEach(val, (value, key) => {
              if (value.i === id) {
                val[key] = {
                  ...val[key],
                  static: true,
                  isDraggable: false
                }
              }
            })
          })
          const index = data.findIndex((item) => item.id === id)
          if (index > -1) {
            data[index] = {
              ...data[index],
              data_grid: {
                ...data[index]["data_grid"],
                static: true,
                isDraggable: false
              }
            }
          }
          setState({ data: data, layouts: dataLayout })
        } else {
          _.forEach(dataLayout, (val, key_val) => {
            _.forEach(val, (value, key) => {
              if (value.i === id) {
                val[key] = {
                  ...val[key],
                  static: false,
                  isDraggable: true
                }
              }
            })
          })
          const index = data.findIndex((item) => item.id === id)
          if (index > -1) {
            data[index] = {
              ...data[index],
              data_grid: {
                ...data[index]["data_grid"],
                static: false,
                isDraggable: true
              }
            }
          }
          setState({ data: data, layouts: dataLayout })
        }
      } else {
        setState({ loadingRemove: true })
        _.forEach(dataLayout, (val, key_val) => {
          const newLayout = val.filter((item) => item.i !== id)
          dataLayout[key_val] = newLayout
        })
        const index = data.findIndex((item) => item.id === id)
        if (index > -1) {
          data[index] = { ...data[index], show: false }
        }
        setState({ data: data, layouts: dataLayout })
        saveWidget(dataLayout)
      }
    } else {
      setState({ loadingRemove: true })
      const _settingWidget = []
      _.forEach(data, (value, index) => {
        data[index] = { ...data[index], show: true }
        _settingWidget.push(value.data_grid)
      })
      const newLayout = _settingWidget.filter((item) => item.i !== id)
      const index = data.findIndex((item) => item.id === id)
      if (index > -1) {
        data[index] = { ...data[index], show: false }
      }
      setState({ data: data, layouts: { lg: newLayout } })
      saveWidget({ lg: newLayout })
    }
  }

  const handleDataLayout = (dataComponent, dataLayout) => {
    const dataLayout_ = { ...dataLayout }
    _.forEach(dataLayout_, (val, key_val) => {
      if (key_val === state.breakPoints) {
        const val_layout = [...val]
        _.forEach(val_layout, (value, key) => {
          const index = dataComponent.findIndex((item) => item.id === value.i)
          if (index > -1) {
            dataComponent[index] = {
              ...dataComponent[index],
              data_grid: {
                ...value,
                minW: dataComponent[index]["data_grid"]["minW"],
                minH: dataComponent[index]["data_grid"]["minH"],
                maxW: dataComponent[index]["data_grid"]["maxW"],
                maxH: dataComponent[index]["data_grid"]["maxH"],
                static: !customizeDashboard,
                isDraggable: customizeDashboard
              },
              show: true
            }

            val_layout[key] = dataComponent[index]["data_grid"]
          }
        })
        dataLayout_[key_val] = val_layout
      }
    })

    setState({ data: dataComponent, layouts: dataLayout_ })
  }

  useEffect(() => {
    const data = listComponent
      ? listComponent({ handleWidget })
      : ListComponentConfig({ handleWidget })
    if (settingWidget !== undefined && !_.isEmpty(settingWidget)) {
      handleDataLayout(data, settingWidget)
      localStorage.setItem("dashboard_widget", JSON.stringify(settingWidget))
    } else {
      const _settingWidget = []
      _.forEach(data, (value, index) => {
        data[index] = { ...data[index], show: true }
        _settingWidget.push(value.data_grid)
      })
      setState({ data: data, layouts: { lg: _settingWidget } })
      localStorage.setItem("dashboard_widget", JSON.stringify(_settingWidget))
    }
  }, [])

  useEffect(() => {
    let count = 0
    _.forEach(state.data, (value) => {
      if (value.show === true) {
        count++
      }
    })
    setState({ countWidget: count })
  }, [state.data])

  const setReduxAuth = (dashboard_widget) => {
    dispatch(
      handleFetchProfile({
        userData: auth.userData,
        permits: auth.permits,
        settings: {
          ...auth.settings,
          dashboard_widget: dashboard_widget
        }
      })
    )
  }

  const saveWidget = (data) => {
    dataDashboardWidget[key_dashboard_widget] = data
    const param = { data: JSON.stringify(dataDashboardWidget) }
    DashboardApi.postSaveWidget(param).then((res) => {
      setReduxAuth(res.data)
      localStorage.setItem("dashboard_widget", JSON.stringify(data))
      setState({ loadingOnChange: false, loadingRemove: false })
    })
  }

  const onLayoutChange = (layout, layouts) => {
    if (!state.loadingOnChange && !state.loadingRemove) {
      const newData = [...state.data]
      const _settingWidget = layouts
      handleDataLayout(newData, _settingWidget)
      setState({ loadingOnChange: true })
      saveWidget(layouts)
    }
  }

  const onDrop = (layout, layoutItem) => {
    if (layoutItem && layoutItem.i !== "") {
      const newData = [...state.data]
      const _settingWidget = { lg: layout }
      handleDataLayout(newData, _settingWidget)
    }
  }

  if (_.isEmpty(state.data) || loadingDashboard) {
    return (
      <div id="dashboard-analytics" className="mb-2">
        <Row className="match-height dnd">
          <Col sm="12">
            <LoadingComponent />
          </Col>
        </Row>
      </div>
    )
  }

  if (!_.isEmpty(state.data) && !loadingDashboard) {
    return (
      <Fragment>
        <div id="dashboard-analytics" className="mb-5">
          <div className="d-flex mb-1">
            <a
              className="ms-auto"
              href="/"
              onClick={(e) => {
                e.preventDefault()
                setState({ visible: !state.visible })
              }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none">
                <path
                  d="M4.23 11.25H8.27C10.28 11.25 11.25 10.27 11.25 8.27V4.23C11.25 2.22 10.27 1.25 8.27 1.25H4.23C2.22 1.25 1.25 2.23 1.25 4.23V8.27C1.25 10.27 2.23 11.25 4.23 11.25ZM8.27 2.75C9.45 2.75 9.75 3.05 9.75 4.23V8.27C9.75 9.45 9.45 9.75 8.27 9.75H4.23C3.05 9.75 2.75 9.45 2.75 8.27V4.23C2.75 3.05 3.05 2.75 4.23 2.75H8.27Z"
                  fill="#32434F"
                />
                <path
                  d="M15.73 11.25H19.77C21.78 11.25 22.75 10.36 22.75 8.52V3.98C22.75 2.14 21.77 1.25 19.77 1.25H15.73C13.72 1.25 12.75 2.14 12.75 3.98V8.51C12.75 10.36 13.73 11.25 15.73 11.25ZM19.77 2.75C21.11 2.75 21.25 3.13 21.25 3.98V8.51C21.25 9.37 21.11 9.74 19.77 9.74H15.73C14.39 9.74 14.25 9.36 14.25 8.51V3.98C14.25 3.12 14.39 2.75 15.73 2.75H19.77Z"
                  fill="#32434F"
                />
                <path
                  d="M15.73 22.75H19.77C21.78 22.75 22.75 21.77 22.75 19.77V15.73C22.75 13.72 21.77 12.75 19.77 12.75H15.73C13.72 12.75 12.75 13.73 12.75 15.73V19.77C12.75 21.77 13.73 22.75 15.73 22.75ZM19.77 14.25C20.95 14.25 21.25 14.55 21.25 15.73V19.77C21.25 20.95 20.95 21.25 19.77 21.25H15.73C14.55 21.25 14.25 20.95 14.25 19.77V15.73C14.25 14.55 14.55 14.25 15.73 14.25H19.77Z"
                  fill="#32434F"
                />
                <path
                  d="M3.5 18.25H9.5C9.91 18.25 10.25 17.91 10.25 17.5C10.25 17.09 9.91 16.75 9.5 16.75H3.5C3.09 16.75 2.75 17.09 2.75 17.5C2.75 17.91 3.09 18.25 3.5 18.25Z"
                  fill="#32434F"
                />
                <path
                  d="M6.5 21.25C6.91 21.25 7.25 20.91 7.25 20.5V14.5C7.25 14.09 6.91 13.75 6.5 13.75C6.09 13.75 5.75 14.09 5.75 14.5V20.5C5.75 20.91 6.09 21.25 6.5 21.25Z"
                  fill="#32434F"
                />
              </svg>
            </a>
          </div>

          <Row className="match-height dnd">
            <Col sm="12">
              {state.countWidget === 0 && (
                <EmptyContent
                  icon={<i className="iconly-Home icli"></i>}
                  title={useFormatMessage("modules.dashboard.no_widget")}
                  text={useFormatMessage("modules.dashboard.empty")}
                />
              )}

              <ResponsiveReactGridLayout
                className="layout"
                layouts={state.layouts}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 }}
                margin={[0, 30]}
                containerPadding={[0, 0]}
                rowHeight={10}
                onLayoutChange={onLayoutChange}
                onDrop={onDrop}
                isDraggable={customizeDashboard}
                isResizable={customizeDashboard}
                isBounded={customizeDashboard}
                isDroppable={customizeDashboard}
                droppingItem={state.data_drop}>
                {_.map(
                  _.filter(state.data, (item) => {
                    return (
                      item.show === true &&
                      ability.can(item.action, item.resource)
                    )
                  }),
                  (value, index) => {
                    return (
                      <div
                        key={value.id}
                        data-grid={value.data_grid}
                        className={classNames({
                          "widget-full":
                            value.data_grid.x === 0 && value.data_grid.w === 12,
                          "widget-left":
                            value.data_grid.x === 0 && value.data_grid.w < 12,
                          "widget-right":
                            value.data_grid.x > 0 &&
                            value.data_grid.x + value.data_grid.w === 12,
                          "widget-center":
                            value.data_grid.x > 0 &&
                            value.data_grid.x + value.data_grid.w < 12
                        })}>
                        {value.component}
                      </div>
                    )
                  }
                )}
              </ResponsiveReactGridLayout>
            </Col>
          </Row>
        </div>

        <Drawer
          title={
            <>
              <div className="widget-drawer-icon"></div>
              <span className="widget-drawer-title">
                {useFormatMessage("modules.dashboard.add_widget")}
              </span>
            </>
          }
          placement="right"
          width={360}
          className="dnd widget-drawer"
          mask={false}
          onClose={() => setState({ visible: !state.visible })}
          visible={state.visible}
          footer={
            <>
              <span>
                {useFormatMessage("modules.dashboard.lock_homepage_layout")}
              </span>
              <ErpSwitch
                defaultValue={!customizeDashboard}
                nolabel
                className=""
                onChange={(e) => {
                  dispatch(updateLoadingDashboard(true))
                  setTimeout(() => {
                    dispatch(
                      handleFetchProfile({
                        userData: auth.userData,
                        permits: auth.permits,
                        settings: {
                          ...auth.settings,
                          widget_dnd: !e.target.checked
                        }
                      })
                    )
                    dispatch(updateLoadingDashboard(false))
                  }, 300)
                }}
              />
            </>
          }>
          {_.map(
            _.filter(state.data, (item) => {
              return (
                item.show === false && ability.can(item.action, item.resource)
              )
            }),
            (value, index) => {
              return (
                <div
                  key={index}
                  draggable={true}
                  onDragStart={(e) => {
                    e.target.classList.add("isDragging")
                    setState({
                      data_drop: { ...state.data_drop, ...value.data_grid },
                      loading_drop: true
                    })
                  }}
                  onDragEnd={(e) => {
                    e.target.classList.remove("isDragging")
                    setState({
                      data_drop: { i: "", w: 4, h: 2 },
                      loading_drop: false
                    })
                  }}>
                  <div className="droppable-element">
                    <span className="span">{value.title}</span>
                    {value.background}
                  </div>
                </div>
              )
            }
          )}
        </Drawer>
      </Fragment>
    )
  }
}

export default MainDashboard
