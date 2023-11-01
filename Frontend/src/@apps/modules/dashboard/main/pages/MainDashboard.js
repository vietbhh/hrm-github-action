import { EmptyContent } from "@apps/components/common/EmptyContent"
import { ErpSwitch } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { updateLoadingDashboard } from "@store/layout"
import "@styles/react/libs/charts/apex-charts.scss"
import { Drawer, Skeleton } from "antd"
import classNames from "classnames"
import { Fragment, useContext, useEffect, useRef } from "react"
import { Responsive, WidthProvider } from "react-grid-layout"
import { useDispatch, useSelector } from "react-redux"
import { Col, Row } from "reactstrap"
import { handleFetchProfile } from "@store/authentication"
import { AbilityContext } from "utility/context/Can"
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"
import "../../assets/css/dashboard.scss"
import "../../assets/css/dnd.scss"
import catGif from "../../assets/images/cat.gif"
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
  key_dashboard_widget = "dashboard_widget_default",
  breakpoints = { lg: 996, md: 768, sm: 480, xs: 10, xxs: 0 },
  cols = { lg: 3, md: 2, sm: 1, xs: 1, xxs: 1 },
  resizeHandles = ["e"],
  customButtonPosition = "top", // top or bottom
  placementDrawer = "right" // right or left
}) => {
  const auth = useSelector((state) => state.auth)
  const dataDashboardWidget = { ...auth.settings.dashboard_widget }
  const settingWidget = auth.settings.dashboard_widget[key_dashboard_widget]
  const loadingDashboard = useSelector((state) => state.layout.loadingDashboard)
  const dispatch = useDispatch()
  const ability = useContext(AbilityContext)
  const customizeDashboard = auth.settings.widget_dnd
  const [state, setState] = useMergedState({
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
    breakPoints: "lg",

    // check handleWidget
    check_is_handleWidget: false
  })
  const widgetMargin = [0, 15]
  const widgetRowHeight = 10

  // ** ref
  const refLayout = useRef(null)
  const ListDataComponent = listComponent
    ? listComponent()
    : ListComponentConfig()
  global.widget = {}
  _.forEach(ListDataComponent, (val) => {
    global.widget["widget_" + val.id] = useRef(null)
  })

  const handleWidget = (id, action = "remove", params = {}) => {
    const data = listComponent
      ? listComponent({ handleWidget, handleLayouts })
      : ListComponentConfig({ handleWidget, handleLayouts })

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
          setState({
            data: data,
            layouts: dataLayout,
            check_is_handleWidget: true
          })
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
          setState({
            data: data,
            layouts: dataLayout,
            check_is_handleWidget: false
          })
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

  const calculateHeightWidget = (i, data_grid_h, data_grid_minH) => {
    let h = data_grid_h < data_grid_minH ? data_grid_minH : data_grid_h
    if (global.widget["widget_" + i] && global.widget["widget_" + i].current) {
      let _h =
        (global.widget["widget_" + i].current.clientHeight - widgetMargin[1]) /
        (widgetRowHeight + widgetMargin[1])
      const _h_abs = Math.abs(_h)
      const _h_decimal = _h_abs - Math.floor(_h_abs)
      if (_h_decimal >= 0.95) {
        _h = _h + 1
      }
      h = Math.ceil(_h) + 1
    }
    if (h < data_grid_minH) {
      h = data_grid_minH
    }

    return h
  }

  const handleLayouts = () => {
    setTimeout(() => {
      const dataLayout_ = JSON.parse(localStorage.getItem("dashboard_widget"))
      _.forEach(dataLayout_, (val, key_val) => {
        if (key_val === state.breakPoints) {
          const val_layout = [...val]
          _.forEach(val_layout, (value, key) => {
            const h = calculateHeightWidget(value.i, value.h, value.minH)
            val_layout[key] = { ...value, h: h }
          })
          dataLayout_[key_val] = val_layout
        }
      })

      setState({ layouts: dataLayout_ })
    }, 500)
  }

  const handleDataLayout = (dataComponent, dataLayout) => {
    if (state.check_is_handleWidget === false) {
      const dataLayout_ = { ...dataLayout }
      _.forEach(dataLayout_, (val, key_val) => {
        if (key_val === state.breakPoints) {
          const val_layout = [...val]
          _.forEach(val_layout, (value, key) => {
            const index = dataComponent.findIndex((item) => item.id === value.i)
            if (index > -1) {
              const h = calculateHeightWidget(
                value.i,
                dataComponent[index]["data_grid"]["h"],
                dataComponent[index]["data_grid"]["minH"]
              )

              dataComponent[index] = {
                ...dataComponent[index],
                data_grid: {
                  ...value,
                  minW: dataComponent[index]["data_grid"]["minW"],
                  minH: dataComponent[index]["data_grid"]["minH"],
                  maxW: dataComponent[index]["data_grid"]["maxW"],
                  isDraggable: customizeDashboard,
                  h: h
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
  }

  useEffect(() => {
    const data = listComponent
      ? listComponent({ handleWidget, handleLayouts })
      : ListComponentConfig({ handleWidget, handleLayouts })
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
  }, [customizeDashboard])

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
    if (
      !state.loadingOnChange &&
      !state.loadingRemove &&
      !state.check_is_handleWidget
    ) {
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

  const onBreakpointChange = (newBreakpoint, newCols) => {
    setState({ breakPoints: newBreakpoint })
  }

  const renderButtonAddWidget = () => {
    return (
      <div
        className={classNames("d-flex", {
          "mt-1": customButtonPosition === "bottom",
          "mb-1": customButtonPosition === "top"
        })}>
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
    )
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
          {customButtonPosition === "top" && renderButtonAddWidget()}

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
                ref={refLayout}
                layouts={state.layouts}
                breakpoints={breakpoints}
                cols={cols}
                autoSize={true}
                margin={widgetMargin}
                containerPadding={[0, 0]}
                rowHeight={widgetRowHeight}
                resizeHandles={resizeHandles ? resizeHandles : ["se"]}
                onLayoutChange={onLayoutChange}
                onBreakpointChange={onBreakpointChange}
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
                            value.data_grid.x === 0 &&
                            (((state.breakPoints === "lg" ||
                              state.breakPoints === "md") &&
                              value.data_grid.w === 3) ||
                              (state.breakPoints === "sm" &&
                                value.data_grid.w === 2) ||
                              ((state.breakPoints === "xs" ||
                                state.breakPoints === "xxs") &&
                                value.data_grid.w === 1)),
                          "widget-left":
                            state.breakPoints !== "xs" &&
                            state.breakPoints !== "xxs" &&
                            value.data_grid.x === 0 &&
                            (((state.breakPoints === "lg" ||
                              state.breakPoints === "md") &&
                              value.data_grid.w < 3) ||
                              (state.breakPoints === "sm" &&
                                value.data_grid.w < 2)),
                          "widget-right":
                            state.breakPoints !== "xs" &&
                            state.breakPoints !== "xxs" &&
                            value.data_grid.x > 0 &&
                            (((state.breakPoints === "lg" ||
                              state.breakPoints === "md") &&
                              value.data_grid.x + value.data_grid.w === 3) ||
                              (state.breakPoints === "sm" &&
                                value.data_grid.x + value.data_grid.w === 2)),
                          "widget-center":
                            state.breakPoints !== "xs" &&
                            state.breakPoints !== "xxs" &&
                            value.data_grid.x > 0 &&
                            (((state.breakPoints === "lg" ||
                              state.breakPoints === "md") &&
                              value.data_grid.x + value.data_grid.w < 3) ||
                              (state.breakPoints === "sm" &&
                                value.data_grid.x + value.data_grid.w < 2))
                        })}>
                        <div ref={global.widget["widget_" + value.id]}>
                          {value.component}
                        </div>
                      </div>
                    )
                  }
                )}
              </ResponsiveReactGridLayout>
            </Col>
          </Row>

          {customButtonPosition === "bottom" && renderButtonAddWidget()}
        </div>

        <Drawer
          title={
            <>
              <div className="widget-drawer-icon">
                <img src={catGif} />
              </div>
              <span className="widget-drawer-title">
                {useFormatMessage("modules.dashboard.add_widget")}
              </span>
            </>
          }
          placement={placementDrawer}
          width={360}
          className="dnd widget-drawer"
          mask={false}
          onClose={() => setState({ visible: !state.visible })}
          open={state.visible}
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
                    const param = { data: !e.target.checked }
                    DashboardApi.postSaveWidgetLock(param).then((res) => {})
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
