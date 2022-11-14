import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import { useMergedState } from "@apps/utility/common"
import WidgetPreview1 from "@modules/Dashboard/assets/images/WidgetPreview1.svg"
import "@modules/Dashboard/assets/scss/dnd.scss"
import { Drawer } from "antd"
import React, { Fragment, useEffect } from "react"
import { Responsive, WidthProvider } from "react-grid-layout"
import { Button, Card, CardBody } from "reactstrap"
import "../../../../node_modules/react-grid-layout/css/styles.css"
import "../../../../node_modules/react-resizable/css/styles.css"
const ResponsiveReactGridLayout = WidthProvider(Responsive)

const BackgroundWidget = () => {
  return <img className="img" src={WidgetPreview1} />
}

const Test = () => {
  // const settingWidget = useSelector(
  //   (state) => state.auth.settings.dashboard_widget
  // )
  const settingWidget = [
    { i: "box_1", x: 0, y: 0, w: 8, h: 2, minW: 4, minH: 1 },
    { i: "box_2", x: 8, y: 0, w: 4, h: 2, minW: 4, minH: 1 }
  ]

  const [state, setState] = useMergedState({
    visible: false,
    data_drop: { i: "", w: 4, h: 2 },
    loading_drop: false,
    layouts: {
      lg: []
    },
    data: [],
    countWidget: -1
  })

  const listComponent = [
    {
      id: "box_1",
      title: "box 111",
      component: "box 111",
      data_grid: { i: "box_1", x: 0, y: 0, w: 4, h: 2, minW: 4, minH: 1 },
      background: <BackgroundWidget />,
      show: false
    },
    {
      id: "box_2",
      title: "box 222",
      component: "box 222",
      data_grid: { i: "box_2", x: 0, y: 0, w: 4, h: 2, minW: 4, minH: 1 },
      background: <BackgroundWidget />,
      show: false
    },
    {
      id: "box_3",
      title: "box 333",
      component: "box 3",
      data_grid: { i: "box_3", x: 0, y: 0, w: 6, h: 2, minW: 4, minH: 1 },
      background: <BackgroundWidget />,
      show: false
    },
    {
      id: "box_4",
      title: "box 444",
      component: "box 4",
      data_grid: { i: "box_4", x: 0, y: 0, w: 4, h: 2, minW: 4, minH: 1 },
      background: <BackgroundWidget />,
      show: false
    },
    {
      id: "box_5",
      title: "box 555",
      component: "box 5",
      data_grid: { i: "box_5", x: 0, y: 0, w: 4, h: 2, minW: 4, minH: 1 },
      background: <BackgroundWidget />,
      show: false
    },
    {
      id: "box_6",
      title: "box 666",
      component: "box 6",
      data_grid: { i: "box_6", x: 0, y: 0, w: 4, h: 2, minW: 4, minH: 1 },
      background: <BackgroundWidget />,
      show: false
    }
  ]

  useEffect(() => {
    const data = [...listComponent]
    let _settingWidget = settingWidget
    if (_settingWidget !== undefined) {
      _.forEach(_settingWidget, (value) => {
        const index = data.findIndex((item) => item.id === value.i)
        if (index > -1) {
          data[index] = { ...data[index], data_grid: value, show: true }
        }
      })
    } else {
      _settingWidget = []
      _.forEach(data, (value, index) => {
        data[index] = { ...data[index], show: true }
        _settingWidget.push(value.data_grid)
      })
    }
    setState({ data: data, layouts: { lg: _settingWidget } })
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

  const onLayoutChange = (layout, layouts) => {
    if (!state.loading_drop) {
      console.log("onLayoutChange", layout, layouts)
    }
  }

  const onDrop = (layout, layoutItem) => {
    if (layoutItem && layoutItem.i !== "") {
      const newData = [...state.data]
      _.forEach(layout, (value) => {
        const index = newData.findIndex((item) => item.id === value.i)
        if (index > -1) {
          newData[index] = { ...newData[index], data_grid: value, show: true }
        }
      })

      setState({
        data: newData,
        layouts: { lg: layout },
        loading_drop: false
      })
    }
  }

  const deleteWidget = (id) => {
    const newLayout = state.layouts.lg.filter((item) => item.i !== id)
    const newData = [...state.data]
    const index = newData.findIndex((item) => item.id === id)
    if (index > -1) {
      newData[index] = { ...newData[index], show: false }
    }

    setState({
      data: newData,
      layouts: { lg: newLayout }
    })
  }

  if (_.isEmpty(state.data)) {
    return <DefaultSpinner />
  }

  return (
    <Fragment>
      <Card>
        <CardBody className="dnd">
          <Button
            color="primary"
            onClick={() => setState({ visible: !state.visible })}>
            Open
          </Button>

          {state.countWidget === 0 && (
            <h1>
              Drag and drop widgets here. Open the Customize pane to get started
            </h1>
          )}

          <ResponsiveReactGridLayout
            className="layout"
            layouts={state.layouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={100}
            onLayoutChange={onLayoutChange}
            onDrop={onDrop}
            isDroppable={true}
            droppingItem={state.data_drop}>
            {_.map(
              _.filter(state.data, (item) => {
                return item.show === true
              }),
              (value, index) => {
                return (
                  <div key={value.id} data-grid={value.data_grid}>
                    {value.title}
                    <Button
                      color="danger"
                      outline
                      onClick={() => deleteWidget(value.id)}>
                      x
                    </Button>
                  </div>
                )
              }
            )}
          </ResponsiveReactGridLayout>
        </CardBody>
      </Card>
      <Drawer
        title="Widget"
        placement="right"
        width={360}
        className="dnd"
        mask={false}
        onClose={() => setState({ visible: !state.visible })}
        visible={state.visible}>
        {_.map(
          _.filter(state.data, (item) => {
            return item.show === false
          }),
          (value, index) => {
            return (
              <div
                key={index}
                draggable={true}
                onDragStart={(e) => {
                  // const crt = e.target.cloneNode(true)
                  // crt.classList.add("dnd")
                  // crt.classList.add("isDndHold")
                  // document.body.appendChild(crt)
                  // e.dataTransfer.setDragImage(crt, 0, 0)

                  e.target.classList.add("isDragging")
                  setState({
                    data_drop: { ...state.data_drop, ...value.data_grid },
                    loading_drop: true
                  })
                }}
                onDragEnd={(e) => {
                  e.target.classList.remove("isDragging")
                  // const elements = document.getElementsByClassName("isDndHold")
                  // while (elements.length > 0) {
                  //   elements[0].parentNode.removeChild(elements[0])
                  // }
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

export default Test
