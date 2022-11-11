import { ErpInput, ErpSelect } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { yupResolver } from "@hookform/resolvers/yup"
import { isEmpty } from "lodash"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import ReactJson from "react-json-view"
import { Col, Form, Label } from "reactstrap"
import * as Yup from "yup"
import { moduleManagerApi } from "../../../common/api"
const modeOptions = [
  {
    label: "quick",
    value: "quick"
  },
  {
    label: "full",
    value: "full"
  },
  {
    label: "only_quick",
    value: "only_quick"
  },
  {
    label: "only_full",
    value: "only_full"
  }
]

const ModuleMainForm = (props) => {
  const validateSchema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .lowercase()
      .matches(/^[a-zA-Z0-9_]*$/, useFormatMessage("validate.textNum"))
      .min(4, useFormatMessage("validate.min", { num: 4 }))
      .required(useFormatMessage("validate.required"))
      .test(
        "checkName",
        useFormatMessage("validate.exists", {
          name: useFormatMessage("manage.module.name")
        }),
        async (value) => {
          if (
            props.updateData &&
            props.updateData.name &&
            props.updateData.name === value
          )
            return true
          if (
            typeof value !== undefined &&
            value !== undefined &&
            value !== null &&
            value !== "" &&
            value.length >= 4
          ) {
            let result = true

            await moduleManagerApi
              .moduleExists("name", value)
              .then(() => {
                result = true
              })
              .catch(() => {
                result = false
              })
            return result
          } else {
            return true
          }
        }
      ),
    type: Yup.mixed().required(useFormatMessage("validate.required")),
    tableName: Yup.string()
      .trim()
      .lowercase()
      .matches(/^[a-zA-Z0-9_]*$/, useFormatMessage("validate.textNum"))
      .min(4, useFormatMessage("validate.min", { num: 4 }))
      .required(useFormatMessage("validate.required"))
      .test(
        "checkTableName",
        useFormatMessage("validate.exists", {
          name: useFormatMessage("manage.module.tableName")
        }),
        async (value) => {
          if (
            props.updateData &&
            props.updateData.tableName &&
            props.updateData.tableName === value
          )
            return true
          if (
            typeof value !== undefined &&
            value !== undefined &&
            value !== null &&
            value !== "" &&
            value.length >= 4
          ) {
            let result = true
            await moduleManagerApi
              .moduleExists("table", value)
              .then(() => {
                result = true
              })
              .catch(() => {
                result = false
              })
            return result
          } else {
            return true
          }
        }
      )
  })

  const [state, setState] = useMergedState({
    options: {}
  })

  const onSubmit = (data) => {
    data.options = JSON.stringify(isEmpty(state.options) ? {} : state.options)
    props.moduleFormHandleSubmit(data)
  }

  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver(validateSchema)
  })

  const { handleSubmit, setValue, trigger, getValues, reset } = methods
  useEffect(() => {
    reset(props.updateData)
    setState({
      options: isEmpty(props.updateData?.options)
        ? {}
        : props.updateData?.options
    })
  }, [props.updateData])
  return (
    <Form
      ref={props.innerRef}
      className="row"
      onSubmit={handleSubmit(onSubmit)}>
      <Col
        md={getValues("type") && getValues("type").value === "default" ? 4 : 8}>
        <ErpInput
          type="text"
          name="name"
          id="name"
          placeholder=""
          label={useFormatMessage("manage.module.name")}
          useForm={methods}
          onChange={(e) => {
            setValue("name", e.target.value)
            setValue(
              "tableName",
              props.moduleConfig.moduleTablePrefix + e.target.value
            )
            trigger("tableName")
          }}
          required
          readOnly={props.updateData && true}
        />
      </Col>
      {getValues("type") && getValues("type").value === "default" && (
        <Col md="4">
          <ErpInput
            useForm={methods}
            type="text"
            name="tableName"
            id="tableName"
            placeholder=""
            label={useFormatMessage("manage.module.tableName")}
            required
            readOnly
          />
        </Col>
      )}
      <Col md="4">
        <ErpSelect
          name="type"
          id="type"
          label={useFormatMessage("manage.module.type")}
          options={props.moduleConfig.fields.modules.type}
          defaultValue={props.moduleConfig.fields.modules.type[0]}
          useForm={methods}
          onChange={(e) => {
            setValue("type", e)
            props.setCurentType(e.value)
          }}
          isDisabled={props.updateData && true}
        />
      </Col>
      <Col md="4">
        <ErpSelect
          name="layout"
          id="layout"
          label={useFormatMessage("manage.module.layout")}
          options={props.moduleConfig.fields.modules.layout}
          useForm={methods}
          defaultValue={props.moduleConfig.fields.modules.layout[0]}
        />
      </Col>
      <Col md="4">
        <ErpSelect
          name="fullWidth"
          id="fullWidth"
          label={useFormatMessage("manage.module.fullWidth")}
          options={props.moduleConfig.fields.modules.fullWidth}
          defaultValue={props.moduleConfig.fields.modules.fullWidth[0]}
          useForm={methods}
        />
      </Col>
      <Col md="4">
        <ErpInput
          type="text"
          name="icon"
          id="icon"
          placeholder=""
          defaultValue="fal fa-bars"
          label={useFormatMessage("manage.module.icon")}
          useForm={methods}
        />
      </Col>
      <Col md="4">
        <ErpSelect
          name="add_mode"
          id="add_mode"
          label={useFormatMessage("manage.module.add_mode")}
          options={modeOptions}
          useForm={methods}
          defaultValue={modeOptions[0]}
        />
      </Col>
      <Col md="4">
        <ErpSelect
          name="update_mode"
          id="update_mode"
          label={useFormatMessage("manage.module.update_mode")}
          options={modeOptions}
          useForm={methods}
          defaultValue={modeOptions[0]}
        />
      </Col>
      <Col md="4">
        <ErpSelect
          name="view_mode"
          id="view_mode"
          label={useFormatMessage("manage.module.view_mode")}
          options={modeOptions}
          useForm={methods}
          defaultValue={modeOptions[0]}
        />
      </Col>
      <Col md={12}>
        <Label for="options">{useFormatMessage("manage.module.options")}</Label>
        <ReactJson
          src={state.options}
          name="options"
          id="options"
          theme="monokai"
          iconStyle="square"
          onAdd={(e) =>
            setState({
              options: e.updated_src
            })
          }
          onEdit={(e) =>
            setState({
              options: e.updated_src
            })
          }
          onDelete={(e) =>
            setState({
              options: e.updated_src
            })
          }
          collapsed={true}
        />
      </Col>
    </Form>
  )
}

export default ModuleMainForm
