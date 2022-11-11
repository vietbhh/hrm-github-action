import { ErpInput, ErpSwitch } from "@apps/components/common/ErpField"
import { useFormatMessage } from "@apps/utility/common"
import { yupResolver } from "@hookform/resolvers/yup"
import React, { Fragment, useEffect } from "react"
import { Check, Plus, X } from "react-feather"
import { useForm } from "react-hook-form"
import { ReactSortable } from "react-sortablejs"
import { Button, Col, Form, ListGroupItem, Media, Row } from "reactstrap"
import { isEmpty } from "lodash"
import * as Yup from "yup"

const ModuleRouteForm = (props) => {
  const { updateIdItem, updateDataItem, cancelUpdate, loading } = props
  const validateSchema = Yup.object().shape({
    routePath: Yup.string()
      .trim()
      .min(1, useFormatMessage("validate.min", { num: 1 }))
      .required(useFormatMessage("validate.required"))
      .test(
        "checkRoutePath",
        useFormatMessage("validate.exists", { name: "Route path" }),
        async (value) => {
          if (
            typeof value !== undefined &&
            value !== undefined &&
            value !== null &&
            value !== "" &&
            value.length >= 2
          ) {
            if (value.indexOf("/") === 0) value = value.substring(1)
            value = `/${props.moduleConfig.routeModuleNameVar}/${value}`
            let i = 0
            for (const item of props.data) {
              if (item.routePath === value) {
                if (updateIdItem === i) continue
                return false
              }
              i++
            }
            return true
          } else {
            return true
          }
        }
      )
  })
  const methods = useForm({
    mode: "all",
    resolver: yupResolver(validateSchema),
    defaultValues: {
      customPath: false
    }
  })
  const { handleSubmit, reset } = methods
  const onSubmit = (values) => {
    values.default = false
    if (values.routePath.indexOf("/") === 0)
      values.routePath = values.routePath.substring(1)
    if (!values.customPath)
      values.routePath = `/${props.moduleConfig.routeModuleNameVar}/${values.routePath}`
    else values.routePath = `/${values.routePath}`

    if (_.isString(values.meta) && !isEmpty(values.meta)) {
      values.meta = values.meta
        .replace(/(^"|"$)/g, "")
        .replace(/\s/g, "")
        .replaceAll("'", '"')
      values.meta = JSON.parse(values.meta)
    }
    props.setRouteData(values)
    reset()
  }
  return (
    <React.Fragment>
      <Form className="row" onSubmit={handleSubmit(onSubmit)}>
        <Col md="6">
          <ErpInput
            useForm={methods}
            type="text"
            name="routePath"
            placeholder=""
            label={useFormatMessage("manage.route.routePath")}
            required
            defaultValue={updateDataItem?.routePath}
            loading={loading}
          />
        </Col>
        <Col md="6">
          <ErpInput
            useForm={methods}
            type="text"
            name="componentPath"
            placeholder=""
            label={useFormatMessage("manage.route.componentPath")}
            defaultValue={updateDataItem?.componentPath}
            loading={loading}
          />
        </Col>

        <Col md="4">
          <ErpInput
            useForm={methods}
            type="text"
            name="permitAction"
            placeholder="login"
            label={useFormatMessage("manage.route.permitAction")}
            labelNote="Permission Action for this route"
            defaultValue={updateDataItem?.permitAction}
            loading={loading}
          />
        </Col>
        <Col md="4">
          <ErpInput
            useForm={methods}
            type="text"
            name="permitResource"
            placeholder="app"
            label={useFormatMessage("manage.route.permitResource")}
            labelNote="Permission Resource for this route"
            defaultValue={updateDataItem?.permitResource}
            loading={loading}
          />
        </Col>
        <Col md="4">
          <ErpInput
            useForm={methods}
            type="text"
            name="redirectPath"
            placeholder=""
            label={useFormatMessage("manage.route.redirectPath")}
            labelNote="Redirect path when user access this route"
            defaultValue={updateDataItem?.redirectPath}
            loading={loading}
          />
        </Col>
        <Col md="6">
          <ErpInput
            useForm={methods}
            type="text"
            name="meta"
            placeholder=""
            label={useFormatMessage("manage.route.meta")}
            labelNote="JSON type"
            onChange={(e) => {
              methods.setValue(
                "meta",
                e.target.value.replace(/\s/g, "").replaceAll("'", '"')
              )
            }}
            defaultValue={updateDataItem?.meta}
            loading={loading}
          />
        </Col>
        <Col md="2">
          <ErpSwitch
            useForm={methods}
            name="customPath"
            placeholder=""
            label={useFormatMessage("manage.route.customPath")}
            defaultValue={updateDataItem?.customPath}
            loading={loading}
          />
        </Col>
        <Col md="2">
          <ErpSwitch
            useForm={methods}
            name="isPublic"
            placeholder=""
            label={useFormatMessage("manage.route.isPublic")}
            defaultValue={updateDataItem?.isPublic}
            loading={loading}
          />
        </Col>
        <Col md="2 mb-2">
          {updateDataItem && (
            <Fragment>
              <Button.Ripple
                color="success"
                outline
                className="btn-icon me-1"
                size="sm"
                type="submit">
                <Check size="16" />
              </Button.Ripple>
              <Button.Ripple
                color="danger"
                outline
                className="btn-icon"
                size="sm"
                type="button"
                onClick={cancelUpdate}>
                <X size="16" />
              </Button.Ripple>
            </Fragment>
          )}
          {!updateDataItem && (
            <Button.Ripple
              color="primary"
              outline
              className="btn-icon"
              size="sm"
              type="submit">
              <Plus size="16" />
            </Button.Ripple>
          )}
        </Col>
      </Form>
    </React.Fragment>
  )
}

const ModuleRouteFormComponent = (props) => {
  const [data, setData] = React.useState(props.routes)
  const [updateIdItem, setUpdateId] = React.useState(false)
  const [updateDataItem, setUpdateDataItem] = React.useState(false)
  const [loadingForm, setLoadingForm] = React.useState(false)
  const setRouteData = (values) => {
    if (updateIdItem === false) setData((data) => [...data, values])
    else {
      const newData = [...data]
      newData[updateIdItem] = values
      setData(newData)
    }
    updateRoute(false, false)
  }
  const updateRoute = (item = false, index = false) => {
    setLoadingForm(true)

    const timer = setTimeout(() => {
      let newItem = item
      if (item !== false) {
        newItem = { ...item }
        newItem.meta = isEmpty(item.meta) ? "" : JSON.stringify(item.meta)
        let customPath = false
        if (!item.routePath.includes("{moduleName}")) {
          customPath = true
        }
        newItem.customPath = customPath
        newItem.routePath = newItem.routePath.replace("/{moduleName}", "")
      }
      setLoadingForm(false)
      setUpdateId(index)
      setUpdateDataItem(newItem)
    }, 100)
    return () => clearTimeout(timer)
  }
  const removeRoute = (position) => {
    const newData = [...data]
    newData.splice(position, 1)
    setData(newData)
  }

  useEffect(() => {
    props.setRoutes(data)
  }, [data])

  useEffect(() => {
    setData(props.defaultRoutes)
  }, [props.defaultRoutes])
  return (
    <React.Fragment>
      <Row>
        <Col md="12">
          <ModuleRouteForm
            updateIdItem={updateIdItem}
            updateDataItem={updateDataItem}
            cancelUpdate={() => {
              updateRoute(false, false)
            }}
            data={data}
            {...props}
            setRouteData={setRouteData}
            loading={loadingForm}
          />
        </Col>
        <Col md="12">
          <ReactSortable
            handle=".dragIcon"
            tag="ul"
            className="list-group"
            list={data}
            setList={setData}>
            {data.map((item, index) => {
              return (
                <ListGroupItem key={index} className="cursor-pointer">
                  <Row>
                    <Col sm="10" className="text-start">
                      <Media className="d-flex">
                        <Media
                          left
                          tag="div"
                          className="dragIcon"
                          style={{ cursor: "move" }}>
                          <i className="far fa-ellipsis-v me-1" />
                        </Media>
                        <Media body>
                          <h5 className="mt-0">
                            {item.routePath}{" "}
                            {item.isPublic && (
                              <i className="fa-solid fa-earth-asia"></i>
                            )}
                          </h5>
                          {item.componentPath && item.componentPath}
                          {item.redirectPath && (
                            <Fragment>
                              <i className="iconly-Logout"></i>&nbsp;
                              {item.redirectPath}
                            </Fragment>
                          )}
                          {(item.permitAction || item.permitResource) && (
                            <Fragment>
                              &nbsp;|&nbsp;<i className="iconly-Lock"></i>&nbsp;
                              {item.permitAction} - {item.permitResource}
                            </Fragment>
                          )}
                          {!isEmpty(item.meta) && (
                            <p className="mb-0">
                              <code>{JSON.stringify(item.meta)}</code>
                            </p>
                          )}
                        </Media>
                      </Media>
                    </Col>
                    <Col sm="2">
                      {!item.default && (
                        <Button.Ripple
                          outline
                          color="flat-success"
                          className="btn btn-icon float-end"
                          onClick={() => removeRoute(index)}>
                          <i className="fal fa-trash" />
                        </Button.Ripple>
                      )}
                      {!item.default && (
                        <Button.Ripple
                          outline
                          color="flat-success"
                          className="btn btn-icon float-end"
                          onClick={() => updateRoute(item, index)}>
                          <i className="fal fa-edit" />
                        </Button.Ripple>
                      )}
                    </Col>
                  </Row>
                </ListGroupItem>
              )
            })}
          </ReactSortable>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default ModuleRouteFormComponent
