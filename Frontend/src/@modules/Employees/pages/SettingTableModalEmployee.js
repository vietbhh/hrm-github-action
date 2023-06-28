import { ErpCheckbox, ErpInput } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import React, { Fragment, useEffect, useRef } from "react"
import { FormProvider, useForm } from "react-hook-form"
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner
} from "reactstrap"
import { employeesApi } from "../common/api"

const SettingTableModalEmployee = (props) => {
  const { modal, handleModal, loadData, metas, updateModules } = props

  const getFieldId = () => {
    let data = {}
    _.forEach(metas, (item) => {
      if (item.field_options.form && item.field_options.form.tabId) {
        const perId = parseInt(item.id)
        data = {
          ...data,
          [perId]: {
            id: perId,
            title: useFormatMessage(`modules.employees.fields.${item.field}`),
            checked:
              item.field_table_show ||
              !_.isUndefined(
                item.field_options.table && item.field_options.table.defaultShow
              ),
            defaultShow: !_.isUndefined(
              item.field_options.table && item.field_options.table.defaultShow
            )
          }
        }
      }
    })
    return data
  }

  const [state, setState] = useMergedState({
    loading: false,
    settingColumn: {},
    settingColumnSearch: {},
    searchVal: "",
    searchValue: ""
  })
  const [checkbox, setCheckbox] = useMergedState(getFieldId())

  useEffect(() => {
    if (modal) {
      setCheckbox(getFieldId())
    }
  }, [modal])

  const onSubmit = (values) => {
    setState({ loading: true })
    employeesApi
      .postSaveSettingColumnTable(checkbox)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        updateModules(res.data.modules)
        handleModal()
        loadData()
        setState({ loading: false })
      })
      .catch((err) => {
        setState({ loading: false })
        notification.showError({
          text: useFormatMessage("notification.save.error")
        })
      })
  }

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit } = methods

  const loadSettingColumn = () => {
    employeesApi.getSettingColumnTable().then((res) => {
      setState({ settingColumn: res.data })
    })
  }

  useEffect(() => {
    loadSettingColumn()
  }, [])

  const debounceSearch = useRef(
    _.debounce(
      (nextValue) =>
        setState({
          searchVal: nextValue ? nextValue : ""
        }),
      import.meta.env.VITE_APP_DEBOUNCE_INPUT_DELAY
    )
  ).current

  const handleSearchVal = (e) => {
    const value = e.target.value
    setState({ searchValue: value })
    debounceSearch(value.toLowerCase())
  }

  useEffect(() => {
    if (modal) {
      const dataSearchCheckbox = _.filter(checkbox, (value) => {
        const title = value.title.toLowerCase()
        return title.includes(state.searchVal)
      })
      let dataColumn = {}
      _.forEach(state.settingColumn, (value, index) => {
        dataColumn = { ...dataColumn, [index]: [] }
      })
      _.forEach(state.settingColumn, (value, index) => {
        _.forEach(value, (item) => {
          const checkData = dataSearchCheckbox.filter(
            (val) => val.id.toString() === item.id.toString()
          )
          if (!_.isEmpty(checkData)) {
            dataColumn[index].push(item)
          }
        })
      })

      setState({ settingColumnSearch: dataColumn })
    }
  }, [modal, state.searchVal])

  const renderCheckbox = (val) => {
    if (val.field_options.table && val.field_options.table.defaultShow) {
      return (
        <>
          <i className="fa-regular fa-lock icon-checkbox-block"></i>
          <ErpCheckbox
            label={useFormatMessage(`modules.employees.fields.${val.field}`)}
            readOnly={true}
            defaultChecked={true}
          />
        </>
      )
    } else {
      const perId = parseInt(val.id)
      return (
        <>
          <i className="fa-regular fa-lock-open icon-checkbox"></i>{" "}
          <ErpCheckbox
            label={useFormatMessage(`modules.employees.fields.${val.field}`)}
            checked={checkbox?.[perId]?.checked}
            onChange={(e) => {
              setCheckbox({
                [perId]: {
                  id: perId,
                  title: useFormatMessage(
                    `modules.employees.fields.${val.field}`
                  ),
                  checked: e.target.checked,
                  defaultShow: false
                }
              })
            }}
          />
        </>
      )
    }
  }

  const renderDivCheckbox = () => {
    return _.map(state.settingColumnSearch, (value, index) => {
      return (
        !_.isEmpty(value) && (
          <Col sm="6" key={index} className="mb-2">
            <h6>{useFormatMessage(`modules.employees.tabs.tabId.${index}`)}</h6>
            {_.map(value, (val, key) => {
              return (
                <Row key={key}>
                  <Col sm="12">
                    <div className="d-flex align-items-center bg-box-checkbox">
                      {renderCheckbox(val)}
                    </div>
                  </Col>
                </Row>
              )
            })}
          </Col>
        )
      )
    })
  }

  const renderTextCountCheckbox = () => {
    let totalCheckbox = 0
    let countCheckedCheckbox = 0
    _.forEach(checkbox, (value) => {
      totalCheckbox++
      if (value.checked) {
        countCheckedCheckbox++
      }
    })
    return (
      <span className="ms-auto">
        {countCheckedCheckbox}/{totalCheckbox}
      </span>
    )
  }

  const clickSelectAll = () => {
    setState({ searchVal: "", searchValue: "" })
    let data = {}
    _.forEach(checkbox, (value) => {
      data = {
        ...data,
        [value.id]: {
          id: value.id,
          title: value.title,
          checked: true,
          defaultShow: value.defaultShow
        }
      }
    })
    setCheckbox(data)
  }

  const clickClearAll = () => {
    setState({ searchVal: "", searchValue: "" })
    let data = {}
    _.forEach(checkbox, (value) => {
      data = {
        ...data,
        [value.id]: {
          id: value.id,
          title: value.title,
          checked: value.defaultShow,
          defaultShow: value.defaultShow
        }
      }
    })
    setCheckbox(data)
  }

  return (
    <Fragment>
      <Modal
        isOpen={modal}
        toggle={() => handleModal()}
        className="new-profile-modal employee-setting-table-modal">
        <ModalHeader toggle={() => handleModal()}>
          {useFormatMessage("module.default.modal.settingModalTitle")}
        </ModalHeader>
        <FormProvider {...methods}>
          <ModalBody>
            <Row>
              <Col sm="12">
                <ErpInput
                  onChange={(e) => {
                    handleSearchVal(e)
                  }}
                  formGroupClass="search-filter"
                  placeholder={useFormatMessage(
                    "modules.team_attendance.fields.search"
                  )}
                  prepend={<i className="iconly-Search icli"></i>}
                  nolabel
                  value={state.searchValue}
                />
              </Col>
            </Row>
            <Row>{renderDivCheckbox()}</Row>
          </ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalFooter className="pt-2">
              <Button type="submit" color="primary" disabled={state.loading}>
                {state.loading && <Spinner size="sm" className="me-50" />}
                {useFormatMessage("app.save")}
              </Button>
              <Button color="flat-danger" onClick={() => handleModal()}>
                {useFormatMessage("button.cancel")}
              </Button>

              {renderTextCountCheckbox()}
              <Button color="flat-primary" onClick={() => clickSelectAll()}>
                {useFormatMessage("modules.employees.settings.text.select_all")}
              </Button>
              <Button color="flat-danger" onClick={() => clickClearAll()}>
                {useFormatMessage("modules.employees.settings.text.clear_all")}
              </Button>
            </ModalFooter>
          </form>
        </FormProvider>
      </Modal>
    </Fragment>
  )
}

export default SettingTableModalEmployee
