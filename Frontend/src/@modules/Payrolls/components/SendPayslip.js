import { ErpEditor, ErpInput } from "@apps/components/common/ErpField"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import Avatar from "@apps/modules/download/pages/Avatar"
import {
  addComma,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import notification from "@apps/utility/notification"
import "@styles/react/libs/editor/editor.scss"
import { Drawer, Popconfirm, Space } from "antd"
import classNames from "classnames"
import { Fragment, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { Button, Spinner } from "reactstrap"
import { PayrollApi } from "../common/api"

const SendPayslip = (props) => {
  const { modal, toggleModal, data_table, settingMail, dateCutOff } = props

  const [state, setState] = useMergedState({
    loadingPage: true,
    loading: false,
    showContentMail: false,
    data_table: [],
    dataEmployeeMail: [],
    employeeIdMail: 0,
    loadingSaveMail: false,
    dataMailBody: ""
  })

  const setData = (data) => {
    setState({ data_table: data })
  }

  useEffect(() => {
    if (modal) {
      const urlPayroll = `${process.env.REACT_APP_URL}/profile/payroll`
      const subject = "Time to review payroll"
      const data = _.cloneDeep(data_table)
      const newData = {}
      _.forEach(data, (value, index) => {
        const mapObj = {
          "@name@": value.employee_name,
          "@date@": dateCutOff,
          "@total_comp@": addComma(value.total_comp),
          "@salary@": addComma(value.salary),
          "@actual@": addComma(value.actual),
          "@recurring@": addComma(value.recurring),
          "@one_off@": addComma(value.one_off),
          "@offset@": addComma(value.offset),
          "@ot@": addComma(value.ot),
          "@off_cycle@": addComma(value.off_cycle),
          "@unpaid@": addComma(value.unpaid),
          "@deficit@": addComma(value.deficit),
          "@url_payroll@": urlPayroll
        }
        let _settingMail = settingMail
        _settingMail = _settingMail.replace(
          /@name@|@date@|@total_comp@|@salary@|@actual@|@recurring@|@one_off@|@offset@|@ot@|@off_cycle@|@unpaid@|@deficit@|@url_payroll@/gi,
          function (matched) {
            return mapObj[matched]
          }
        )
        newData[index] = {
          avatar: value.avatar,
          employee_name: value.employee_name,
          email: value.email,
          subject: subject,
          mail_body: _settingMail
        }
      })
      setData(newData)
      setState({
        loadingPage: false,
        employeeIdMail: 0,
        loadingSaveMail: false
      })
    }
  }, [modal, data_table])

  const toggleModalMail = () => {
    setState({ showContentMail: !state.showContentMail, employeeIdMail: 0 })
  }

  const onCloseModal = () => {
    setState({ showContentMail: false })
    toggleModal()
  }

  const setActiveEmployee = (
    showContentMail,
    employeeIdMail,
    dataEmployeeMail,
    dataMailBody
  ) => {
    setState({
      showContentMail: showContentMail,
      employeeIdMail: employeeIdMail,
      dataEmployeeMail: dataEmployeeMail,
      dataMailBody: dataMailBody
    })
  }

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, setValue, reset } = methods

  const handleDeleteMenu = (key) => {
    const newData = {
      ..._.filter(state.data_table, (value, index) => {
        return index !== key
      })
    }
    setData(newData)
    if (key === state.employeeIdMail) {
      setActiveEmployee(false, 0, [], "")
      reset()
    }
  }

  const renderMenuLabel = (key, avatar, name) => {
    return (
      <>
        <div className="d-flex align-items-center w-100">
          <div
            className="d-flex align-items-center w-100 cursor-pointer"
            onClick={() => {
              if (
                key === state.employeeIdMail &&
                state.showContentMail === true
              ) {
                setActiveEmployee(false, 0, [], "")
                reset()
                return
              }

              const data = {
                ..._.filter(state.data_table, (value, index) => {
                  return index === key
                })
              }
              setActiveEmployee(true, key, data[0], data[0].mail_body)
              setValue("email", data[0].email)
              setValue("subject", data[0].subject)
            }}>
            <Avatar className="img me-50" size="sm" src={avatar} />
            <span>{name}</span>
          </div>
          <Popconfirm
            title={useFormatMessage("modules.payrolls.modal.sure_to_delete")}
            onConfirm={() => handleDeleteMenu(key)}>
            <Button.Ripple
              color="danger"
              outline
              className="button-delete ms-auto">
              <i className="far fa-trash"></i>
            </Button.Ripple>
          </Popconfirm>
        </div>
      </>
    )
  }

  const renderBodyModal = () => {
    const handleSendPayslip = () => {
      setState({ loading: true, showContentMail: false, employeeIdMail: 0 })
      const params = {
        data: state.data_table
      }
      PayrollApi.postSendPayslip(params)
        .then((res) => {
          notification.showSuccess({
            text: useFormatMessage("modules.payrolls.modal.noti.success")
          })
          setState({ loading: false })
          onCloseModal()
        })
        .catch((err) => {
          notification.showError({
            text: useFormatMessage("modules.payrolls.modal.noti.error")
          })
          setState({ loading: false })
        })
    }

    return (
      <>
        <div className="drawer-body">
          <ul className="menu-ul">
            {_.map(state.data_table, (value, index) => {
              return (
                <li
                  key={index}
                  className={classNames("menu-li", {
                    "menu-li-active": index === state.employeeIdMail
                  })}>
                  {renderMenuLabel(index, value.avatar, value.employee_name)}
                </li>
              )
            })}
          </ul>
        </div>
        <hr />
        <Space>
          <Button
            color="primary"
            disabled={_.isEmpty(state.data_table) || state.loading}
            onClick={() => {
              handleSendPayslip()
            }}>
            {state.loading && <Spinner size="sm" className="me-50" />}
            {useFormatMessage(`modules.payrolls.button.send_payslip`)}
          </Button>
          <Button.Ripple
            color="flat-danger"
            disabled={state.loading}
            onClick={() => {
              onCloseModal()
            }}>
            {useFormatMessage("button.cancel")}
          </Button.Ripple>
        </Space>
      </>
    )
  }

  const renderTitleModalMail = () => {
    return (
      <>
        <div className="d-flex align-items-center w-100">
          <Avatar
            className="img me-50"
            size="sm"
            src={state.dataEmployeeMail.avatar}
          />
          <span>{state.dataEmployeeMail.employee_name}</span>
        </div>
      </>
    )
  }

  const onSubmit = (values) => {
    setState({ loadingSaveMail: true })
    const newData = state.data_table
    newData[state.employeeIdMail]["subject"] = values.subject
    newData[state.employeeIdMail]["mail_body"] = values.mail_body
    notification.showSuccess({
      text: useFormatMessage("notification.save.success")
    })
    setState({ loadingSaveMail: false })
  }

  const renderBodyModalMail = () => {
    return (
      <>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ErpInput
              label={useFormatMessage(`modules.payrolls.modal.email`)}
              readOnly
              name="email"
              useForm={methods}
            />
            <ErpInput
              label={useFormatMessage(`modules.payrolls.modal.subject`)}
              name="subject"
              useForm={methods}
            />
            <ErpEditor
              name="mail_body"
              useForm={methods}
              wrapperClassName="payslip-mail-editor"
              defaultValue={state.dataMailBody}
              editorStyle={{
                minHeight: "30rem",
                maxHeight: "30rem"
              }}
              wrapperStyle={{
                minHeight: "32rem",
                maxHeight: "32rem"
              }}
            />
            <hr />
            <Space>
              <Button
                type="submit"
                color="primary"
                disabled={state.loadingSaveMail || state.loading}>
                {state.loadingSaveMail && (
                  <Spinner size="sm" className="me-50" />
                )}
                {useFormatMessage(`button.save`)}
              </Button>
              <Button.Ripple
                color="flat-danger"
                onClick={() => {
                  toggleModalMail()
                }}>
                {useFormatMessage("button.cancel")}
              </Button.Ripple>
            </Space>
          </form>
        </FormProvider>
      </>
    )
  }

  return (
    <Fragment>
      <Drawer
        className="send-payslip-drawer"
        placement="left"
        width={378}
        zIndex={9999}
        onClose={() => {
          onCloseModal()
        }}
        title={useFormatMessage(`modules.payrolls.modal.payslip`)}
        closable={true}
        open={modal}
        mask={true}>
        <div className="drawer-content">
          {state.loadingPage && <DefaultSpinner />}

          {!state.loadingPage && renderBodyModal()}
        </div>
      </Drawer>

      <Drawer
        className={
          state.showContentMail === true ? "send-payslip-drawer-mail" : ""
        }
        placement="left"
        size="large"
        zIndex={9999}
        title={renderTitleModalMail()}
        closable={true}
        onClose={toggleModalMail}
        open={state.showContentMail}
        mask={false}>
        {renderBodyModalMail()}
      </Drawer>
    </Fragment>
  )
}

export default SendPayslip
