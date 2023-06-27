import AvatarList from "@apps/components/common/AvatarList"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import {
  sortFieldsDisplay,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { isArray } from "@apps/utility/handleData"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import notification from "@apps/utility/notification"
import UILoader from "@core/components/ui-loader"
import { isBoolean, isEmpty, isUndefined, toArray } from "lodash"
import { isFunction } from "lodash-es"
import React, { Fragment, useEffect, useRef, useState } from "react"
import { AlignRight, Download, Info, Settings } from "react-feather"
import { useForm } from "react-hook-form"
import PerfectScrollbar from "react-perfect-scrollbar"
import { useSelector } from "react-redux"
import {
  Button,
  Col,
  Form,
  Nav,
  NavItem,
  NavLink,
  Spinner,
  TabContent,
  TabPane,
  UncontrolledTooltip
} from "reactstrap"
import { FieldHandle } from "../../../../../utility/FieldHandler"
import DetailAuditDataDefaultModule from "../../detail/DetailAuditDataDefaultModule"
import PermissionModalDefaultModule, {
  handlePermissionArray
} from "../../modals/PermissionModalDefaultModule"
//import FileUploadFormDefaultModule from "./FileUploadFormDefaultModule"
const NavForm = (props) => {
  const { active, toggle, isUpdate } = props
  return (
    <Fragment>
      <Nav tabs>
        <NavItem>
          <NavLink
            active={active === "1"}
            onClick={() => {
              toggle("1")
            }}>
            <AlignRight size={15} />
            {useFormatMessage("module.default.form.tabs.data")}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === "2"}
            onClick={() => {
              toggle("2")
            }}>
            <Download size={15} />{" "}
            {useFormatMessage("module.default.form.tabs.files")}
          </NavLink>
        </NavItem>
      </Nav>
      {isUpdate && (
        <NavLink
          active={active === "3"}
          onClick={() => {
            toggle("3")
          }}>
          <Info size={15} />
        </NavLink>
      )}
    </Fragment>
  )
}

const MainFormDefaultModule = (props) => {
  const mainFormRef = useRef()
  const submitForm = () => {
    if (mainFormRef.current) {
      mainFormRef.current.props.onSubmit()
    }
  }

  const [active, setActive] = useState("1")
  const {
    module,
    metas,
    updateData,
    updateDataId,
    options,
    files_upload_module,
    fastForm,
    saveApi
  } = props
  const metasList = isArray(metas) ? metas : toArray(metas)
  const isUpdate = isBoolean(updateData) ? updateData : true
  const userData = useSelector((state) => state.auth.userData)
  const defaultOwner = {
    label: userData.username,
    value: userData.id
  }
  const [state, setState] = useMergedState({
    permissions: {
      owner: defaultOwner,
      view_permissions: [],
      update_permissions: []
    },
    block: false,
    listPermission: [],
    files_upload_module: [],
    permissionModal: false,
    files: [],
    filesDataWillDelete: [],
    filesDataWillUpdate: [],
    filesOtherWillDelete: []
  })

  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
  }
  const onSubmit = (data) => {
    props.beforeSubmit()
    setState({ block: true })
    if (updateDataId) data.id = updateDataId
    const submitData = {
      ...data,
      ...state.permissions,
      files_upload_module: state.files,
      filesWillDelete: {
        data: state.filesDataWillDelete,
        other: state.filesOtherWillDelete
      },
      filesDataWillUpdate: state.filesDataWillUpdate
    }
    const api = isUndefined(saveApi)
      ? defaultModuleApi.postSave(module.name, submitData)
      : saveApi(submitData)
    api
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        props.afterSubmit()
        setState({ block: false })
      })
      .catch((err) => {
        props.submitError()
        setState({ block: false })
        console.log(err)
        notification.showError({
          text: useFormatMessage("notification.save.error")
        })
      })
  }
  const onFileFieldDelete = (file, index, key) => {
    setState({
      filesOtherWillDelete: {
        ...state.filesOtherWillDelete,
        [key]:
          state.filesOtherWillDelete[key] !== undefined
            ? [
                ...state.filesOtherWillDelete[key],
                {
                  file: file,
                  index
                }
              ]
            : [
                {
                  file: file,
                  index
                }
              ]
      }
    })
  }

  const tooglePermissionModal = () =>
    setState({
      permissionModal: !state.permissionModal
    })

  const handlePermission = (data) => {
    const listPers = handlePermissionArray(data)
    const ownerData = isEmpty(data.owner) ? defaultOwner : data.owner
    setState({
      permissions: {
        owner: ownerData,
        view_permissions: data.view_permissions,
        update_permissions: data.update_permissions
      },
      listPermission: listPers
    })
  }

  const methods = useForm({
    mode: "onSubmit"
  })

  const { handleSubmit } = methods
  useEffect(() => {
    handlePermission(props.updateData)
  }, [props.updateData])
  const HeaderTag = props.headerTag ? props.headerTag : "div"
  const BodyTag = props.bodyTag ? props.bodyTag : "div"
  const FooterTag = props.footerTag ? props.footerTag : "div"
  const CancelButton = props.cancelButton ? props.cancelButton : false
  const AdvancedButton = props.advancedButton ? props.advancedButton : false
  const uploadFiles = isUndefined(props.uploadFiles) ? true : props.uploadFiles
  const permissionsSelect = isUndefined(props.permissionsSelect)
    ? true
    : props.permissionsSelect
  return (
    <React.Fragment>
      <HeaderTag>
        {!fastForm && (
          <NavForm toggle={toggle} active={active} isUpdate={isUpdate} />
        )}
      </HeaderTag>
      <PerfectScrollbar
        className="modal-ps-scrollbar"
        options={{
          scrollXMarginOffset: 20
        }}>
        <BodyTag>
          <UILoader blocking={state.block} loader={<DefaultSpinner />}>
            {fastForm && uploadFiles && (
              <NavForm toggle={toggle} active={active} />
            )}
            <TabContent className="py-50" activeTab={active}>
              <TabPane tabId="1">
                <Form ref={mainFormRef} onSubmit={handleSubmit(onSubmit)}>
                  <div className="row">
                    {metasList
                      .filter((field) => {
                        if (field.field_form_show && field.field_enable) {
                          if (isFunction(props.filterMetas)) {
                            return props.filterMetas(field)
                          } else {
                            return true
                          }
                        } else {
                          return false
                        }
                      })
                      .sort((a, b) => {
                        return sortFieldsDisplay(a, b)
                      })
                      .map((field, key) => {
                        const checkUpdateData = isUndefined(
                          updateData[field.field]
                        )
                          ? {}
                          : updateData[field.field]
                        return (
                          <Col key={key} md={field.field_form_col_size}>
                            <FieldHandle
                              updateDataId={updateDataId}
                              module={module.name}
                              fieldData={field}
                              useForm={methods}
                              options={options}
                              updateData={checkUpdateData}
                              onFileDelete={onFileFieldDelete}
                            />
                          </Col>
                        )
                      })}
                  </div>
                </Form>
              </TabPane>
              <TabPane tabId="2">
                {/* <FileUploadFormDefaultModule
                  files_upload_module={files_upload_module}
                  setFiles={(filesNew, filesUpdate) => {
                    setState({
                      files: filesNew,
                      filesDataWillUpdate: filesUpdate
                    })
                  }}
                  onFileDelete={(file) => {
                    setState({
                      filesDataWillDelete: [
                        ...state.filesDataWillDelete,
                        file.name
                      ]
                    })
                  }}
                /> */}
              </TabPane>
              {isUpdate && (
                <TabPane tabId="3">
                  <DetailAuditDataDefaultModule data={updateData} />
                </TabPane>
              )}
            </TabContent>
          </UILoader>
        </BodyTag>
      </PerfectScrollbar>
      <FooterTag>
        <Button.Ripple color="primary" type="submit" onClick={submitForm}>
          {(state.block || state.loading) && (
            <Spinner size="sm" className="me-50" />
          )}
          {useFormatMessage("app.save")}
        </Button.Ripple>
        {CancelButton && <CancelButton />}
        {AdvancedButton && <AdvancedButton />}
        {permissionsSelect && (
          <div className="d-flex ms-auto align-middle align-items-center">
            <UncontrolledTooltip target="permission_btn">
              {useFormatMessage("app.permissions")}
            </UncontrolledTooltip>
            <Button.Ripple
              size="sm"
              id="permission_btn"
              className="btn-icon rounded-circle py-0"
              outline
              color="flat-secondary"
              onClick={tooglePermissionModal}>
              <Settings className="align-middle" size={15} />
            </Button.Ripple>
            {state.listPermission.length > 0 && (
              <AvatarList
                size="sm"
                data={state.listPermission}
                moreOnclick={tooglePermissionModal}
              />
            )}
          </div>
        )}
      </FooterTag>

      <PermissionModalDefaultModule
        modal={state.permissionModal}
        handleModal={tooglePermissionModal}
        handleSubmit={handlePermission}
        permissions={state.permissions}
      />
    </React.Fragment>
  )
}

export default MainFormDefaultModule
