import LockedCard from "@apps/components/common/LockedCard"
import { FormHorizontalLoader } from "@apps/components/spinner/FormLoader"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import notification from "@apps/utility/notification"
import { filter, isEmpty, isFunction, map, orderBy } from "lodash"
import { isUndefined } from "lodash-es"
import { Fragment, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { Button, Card, CardBody, CardHeader, Col, Spinner } from "reactstrap"

const DetailForm = (props) => {
  const {
    options,
    updateData,
    updateId,
    onSubmit,
    loading,
    filterField,
    handleField
  } = props
  const fields = { ...props.fields }
  const methods = useForm({
    mode: "onSubmit"
  })

  const readOnly = props.readOnly
  const { handleSubmit, reset, unregister } = methods

  const onSubmitFrm = (values) => {
    onSubmit(values)
  }

  const cancelUpdate = () => {
    reset(updateData)
    props.cancelUpdate()
    if (!isEmpty(fields)) {
      map(
        filter(
          fields,
          (field) =>
            field.field_enable && field.field_form_show && filterField(field)
        ),
        (field, key) => {
          if (!isUndefined(global[`ref_${field.field}`])) {
            global[`ref_${field.field}`].flatpickr.setDate(
              updateData[field.field]
            )
          }
        }
      )
    }
  }

  useEffect(() => {
    return () => {
      unregister()
    }
  }, [])

  if (loading) {
    return <FormHorizontalLoader rows={4} />
  }
  return (
    <Fragment>
      <div className="row">
        {!isEmpty(fields) &&
          orderBy(
            map(
              filter(
                fields,
                (field) =>
                  field.field_enable &&
                  field.field_form_show &&
                  filterField(field)
              ),
              (fieldItem, key) => {
                const positionField = key % 2 ? "field-r" : "field-l"
                const field = isFunction(handleField)
                  ? handleField(fieldItem)
                  : fieldItem
                const fieldProps = {
                  module: field.moduleName,
                  fieldData: { ...field },
                  useForm: methods,
                  options,
                  updateData: updateData?.[field.field],
                  updateDataId: updateId,
                  labelInline: true,
                  inlineClassLabel: "col-xxl-3",
                  inlineClassInput: "col-xxl-9"
                }
                return (
                  <Fragment key={key}>
                    {field.field_options?.form?.break_row_before && (
                      <div className="w-100" />
                    )}
                    <Col
                      md={field.field_form_col_size}
                      className={`${positionField}`}>
                      <FieldHandle {...fieldProps} />
                    </Col>
                    {field.field_options?.form?.break_row_after && (
                      <div className="w-100" />
                    )}
                  </Fragment>
                )
              }
            ),
            (field) => parseInt(field.field_form_order),
            "asc"
          )}
      </div>
      {!readOnly && (
        <div className="row pt-2">
          <form
            className="col-12 text-center"
            onSubmit={handleSubmit(onSubmitFrm)}>
            <Button.Ripple
              type="submit"
              color="primary"
              className="btn-next me-1"
              disabled={props.saving}>
              <span className="align-middle d-sm-inline-block d-none">
                {props.saving && <Spinner size="sm" className="me-50" />}
                {useFormatMessage("button.save")}
              </span>
            </Button.Ripple>
            <Button.Ripple
              type="button"
              color="primary"
              className="btn-next"
              onClick={cancelUpdate}
              disabled={props.saving}>
              <span className="align-middle d-sm-inline-block d-none">
                {useFormatMessage("button.cancel")}
              </span>
            </Button.Ripple>
          </form>
        </div>
      )}
    </Fragment>
  )
}

const TabUserGeneral = (props) => {
  const { options, loading, api, userData, onlyView } = props

  const [state, setState] = useMergedState({
    readOnly: true,
    saving: false
  })
  const usersModule = useSelector((state) => state.app.modules.users)
  const updateBtn = () => {
    setState({
      readOnly: false
    })
  }
  const cancelUpdate = () => {
    setState({
      readOnly: true,
      saving: false
    })
  }
  return (
    <LockedCard blocking={false}>
      <Card className="card-inside with-border-radius life-card">
        <CardHeader>
          <div className="d-flex flex-wrap w-100">
            <h1 className="card-title">
              <span className="title-icon">
                <i className="iconly-Document icli"></i>
              </span>
              <span>
                {useFormatMessage("modules.users.display.informations")}
              </span>
            </h1>
            <div className="d-flex ms-auto">
              {!onlyView && (
                <Button
                  color="flat-primary"
                  tag="div"
                  className="text-primary btn-table-more btn-icon"
                  onClick={updateBtn}>
                  <i className="iconly-Edit icli"></i>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <DetailForm
            fields={usersModule.metas}
            options={options}
            filterField={(field) => {
              if (
                !isEmpty(field.field_options) &&
                !isEmpty(field.field_options.form) &&
                !isEmpty(field.field_options.form.tabId) &&
                field.field_options.form.tabId === "general"
              ) {
                return field
              }
            }}
            handleField={(fieldItem) => {
              const field = { ...fieldItem }
              field.field_form_col_size = 6
              field.field_readonly =
                field.field !== "username" ? state.readOnly : true
              return field
            }}
            readOnly={state.readOnly}
            updateBtn={updateBtn}
            cancelUpdate={cancelUpdate}
            updateData={userData}
            updateId={userData?.id}
            onSubmit={(values) => {
              setState({
                saving: true
              })
              api
                .save(values)
                .then((result) => {
                  notification.showSuccess({
                    text: useFormatMessage("notification.save.success")
                  })
                  cancelUpdate()
                })
                .catch((err) => {
                  notification.showError({
                    text: useFormatMessage("notification.save.error")
                  })
                })
            }}
            loading={loading}
            saving={state.saving}
          />
        </CardBody>
      </Card>
      <Card className="card-inside with-border-radius life-card">
        <CardHeader>
          <div className="d-flex flex-wrap w-100">
            <h1 className="card-title">
              <span className="title-icon">
                <i className="iconly-Document icli"></i>
              </span>
              <span>{useFormatMessage("modules.users.display.other")}</span>
            </h1>
            <div className="d-flex ms-auto"></div>
          </div>
        </CardHeader>
        <CardBody>
          <DetailForm
            fields={usersModule.metas}
            options={options}
            filterField={(field) => {
              if (
                !isEmpty(field.field_options) &&
                !isEmpty(field.field_options.form) &&
                !isEmpty(field.field_options.form.tabId) &&
                field.field_options.form.tabId === "job"
              ) {
                return field
              }
            }}
            handleField={(fieldItem) => {
              const field = { ...fieldItem }
              field.field_readonly = true
              field.field_form_col_size = 6
              return field
            }}
            readOnly={true}
            updateBtn={() => {}}
            cancelUpdate={() => {}}
            updateData={userData}
            updateId={userData?.id}
            onSubmit={(values) => {
              setState({
                saving: true
              })
              api
                .save(values)
                .then((result) => {
                  notification.showSuccess({
                    text: useFormatMessage("notification.save.success")
                  })
                  cancelUpdate()
                })
                .catch((err) => {
                  notification.showError({
                    text: useFormatMessage("notification.save.error")
                  })
                })
            }}
            loading={loading}
            saving={state.saving}
          />
        </CardBody>
      </Card>
    </LockedCard>
  )
}

export default TabUserGeneral
