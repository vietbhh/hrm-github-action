import { ErpSelect, ErpSwitch } from "@apps/components/common/ErpField"
import SwAlert from "@apps/utility/SwAlert"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { Button, Card, CardBody, Alert } from "reactstrap"
import { workspaceApi } from "../common/api"
import WorkspaceSettingLayout from "../components/detail/WorkspaceSettingLayout/WorkspaceSettingLayout"
import WorkgroupPrivacy from "../components/detail/CreateWorkspace/WorkGroupPrivacy"
import { isEmpty } from "lodash"
import MenuSettingWorkspace from "../components/detail/MenuSettingWorkspace"
import { isMobileView } from "../common/common"
import EditInformation from "../components/modals/EditInformation"

const findKeyByValue = (arr = [], value) => {
  const index = arr.findIndex((p) => p.value === value)
  return index
}

const checkMediaWidth = (x) => {
  if (x.matches) {
    return true
  }

  return false
}
const membership_approval = [
  {
    value: "approver",
    label: "Admins & Moderators",
    icon: (
      <div className="prefix-icon-admin-moderator">
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.5408 4.11984L13.0408 2.05984C12.4708 1.84984 11.5408 1.84984 10.9708 2.05984L5.47078 4.11984C4.41078 4.51984 3.55078 5.75984 3.55078 6.88984V14.9898C3.55078 15.7998 4.08078 16.8698 4.73078 17.3498L10.2308 21.4598C11.2008 22.1898 12.7908 22.1898 13.7608 21.4598L19.2608 17.3498C19.9108 16.8598 20.4408 15.7998 20.4408 14.9898V6.88984C20.4508 5.75984 19.5908 4.51984 18.5408 4.11984ZM15.4808 9.71984L11.1808 14.0198C11.0308 14.1698 10.8408 14.2398 10.6508 14.2398C10.4608 14.2398 10.2708 14.1698 10.1208 14.0198L8.52078 12.3998C8.23078 12.1098 8.23078 11.6298 8.52078 11.3398C8.81078 11.0498 9.29078 11.0498 9.58078 11.3398L10.6608 12.4198L14.4308 8.64984C14.7208 8.35984 15.2008 8.35984 15.4908 8.64984C15.7808 8.93984 15.7808 9.42984 15.4808 9.71984Z" fill="#00B3B3" />
        </svg>
      </div>
    ),
    text: useFormatMessage(
      "modules.workspace.app_options.membership_approval.approver"
    )
  },
  {
    value: "auto",
    label: "Automatically approve",
    icon: (
      <div className="prefix-icon-admin-moderator">
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 22H7C3 22 2 21 2 17V15C2 11 3 10 7 10H17C21 10 22 11 22 15V17C22 21 21 22 17 22Z" stroke="#00B3B3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 10V8C6 4.69 7 2 12 2C16.5 2 18 4 18 7" stroke="#00B3B3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 18.5C13.3807 18.5 14.5 17.3807 14.5 16C14.5 14.6193 13.3807 13.5 12 13.5C10.6193 13.5 9.5 14.6193 9.5 16C9.5 17.3807 10.6193 18.5 12 18.5Z" stroke="#00B3B3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    text: useFormatMessage(
      "modules.workspace.app_options.membership_approval.auto"
    )
  }
]

const SettingWorkspace = () => {
  const [state, setState] = useMergedState({
    prevScrollY: 0,
    tabActive: 1,
    detailWorkspace: {},
    loading: true,
    editMode: false
  })
  const checkMobile = checkMediaWidth(
    window.matchMedia("(max-width: 767.98px)")
  )
  const params = useParams()
  const navigate = useNavigate()
  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, formState, reset, watch } = methods
  const userId = parseInt(useSelector((state) => state.auth.userData.id)) || 0

  const onSubmit = (values) => {
    workspaceApi.update(params.id, values).then((res) => {
      notification.showSuccess({
        text: useFormatMessage("notification.save.success")
      })
      //  reset()
      //  navigate(`/workspace/${res.data._id}`)
    })
  }

  const loadData = () => {
    setState({ loading: true })
    workspaceApi.getDetailWorkspace(params.id).then((res) => {
      setState({ detailWorkspace: res.data, loading: false })
    })
  }
  useEffect(() => {
    loadData()
  }, [])
  const handleEditInformation = () => {
    setState({ editMode: !state.editMode })
  }

  const handleDeleteWS = () => {
    SwAlert.showWarning({
      confirmButtonText: useFormatMessage("button.delete")
    }).then((res) => {
      if (res.value) {
        workspaceApi.delete({ _id: state.detailWorkspace._id }).then((res) => {
          navigate(`/workspace/list`)
        })
      }
    })
  }
  const Url_workspace =
    import.meta.env.VITE_APP_URL + "/workspace/" + state.detailWorkspace?._id
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(Url_workspace)
    notification.showSuccess({
      text: "Path has been copied"
    })
    // path has been copied
  }
  const changeTypeMode = (e) => {
    if (!isEmpty(e)) {
      onSubmit(e)
    }
  }
  const isAdmin = state.detailWorkspace?.administrators
    ? state.detailWorkspace?.administrators.includes(userId)
    : false

  if (!isAdmin && !state.loading) {
    return <Navigate to="/not-found" replace />
  }

  return (
    <WorkspaceSettingLayout>
      <div className="workspace-setting row">
        {checkMobile && (
          <div className="col-md-12 ">
            <MenuSettingWorkspace menu={"setting"} idWorkgroup={params.id} />
          </div>
        )}

        <div className="col-md-12 ">
          <Card>
            <CardBody className="d-flex align-items-center w-100 body-title">
              <div className="url_workspace">{Url_workspace}</div>
              <Button
                color="success"
                className="btn-blue ms-auto btn-sm"
                onClick={() => handleCopyUrl()}>
                <span>
                  {useFormatMessage("modules.workspace.buttons.copy")}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none">
                  <path
                    d="M13.33 13.65H15.5C15.6382 13.65 15.75 13.7605 15.75 13.9V17.82C15.75 19.0373 15.3289 19.945 14.684 20.5505C14.0341 21.1606 13.1179 21.5 12.07 21.5H6.18C5.13209 21.5 4.21587 21.1606 3.56598 20.5505C2.92107 19.945 2.5 19.0373 2.5 17.82V11.18C2.5 9.96273 2.92107 9.055 3.56598 8.44952C4.21587 7.83938 5.13209 7.5 6.18 7.5H9.35C9.48952 7.5 9.6 7.61179 9.6 7.75V9.92C9.6 11.9872 11.2749 13.65 13.33 13.65Z"
                    fill="#F7F7F5"
                    stroke="#F7F7F5"
                  />
                  <path
                    d="M17.8198 2H15.8498H14.7598H11.9298C9.66977 2 7.83977 3.44 7.75977 6.01C7.81977 6.01 7.86977 6 7.92977 6H10.7598H11.8498H13.8198C16.1298 6 17.9998 7.5 17.9998 10.18V12.15V14.86V16.83C17.9998 16.89 17.9898 16.94 17.9898 16.99C20.2198 16.92 21.9998 15.44 21.9998 12.83V10.86V8.15V6.18C21.9998 3.5 20.1298 2 17.8198 2Z"
                    fill="#F7F7F5"
                  />
                  <path
                    d="M11.9806 7.14975C11.6706 6.83975 11.1406 7.04975 11.1406 7.47975V10.0998C11.1406 11.1998 12.0706 12.0998 13.2106 12.0998C13.9206 12.1098 14.9106 12.1098 15.7606 12.1098C16.1906 12.1098 16.4106 11.6098 16.1106 11.3098C15.0206 10.2198 13.0806 8.26975 11.9806 7.14975Z"
                    fill="#F7F7F5"
                  />
                </svg>
              </Button>
            </CardBody>
          </Card>

          <div className="title-setting">
            {useFormatMessage("modules.workspace.display.group_information")}
          </div>
          <Card>
            <CardBody>
              <div className="workspace_infomation d-flex w-100">
                <div className="w-100">
                  {state.editMode && (
                    <EditInformation
                      handleEditInformation={handleEditInformation}
                      infoWorkspace={state.detailWorkspace}
                      loadData={loadData}
                    />
                  )}
                  {!state.editMode && (
                    <div className="d-flex w-100 align-items-start">
                      <div>
                        <div className="workspace_name">
                          {state.detailWorkspace?.name}
                        </div>
                        <div className="workspace_introduction">
                          {state.detailWorkspace?.description}
                        </div>
                      </div>
                      <div className="ms-auto">
                        <span
                          className="workspace-text-link"
                          onClick={() => handleEditInformation()}>
                          Edit
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>

          <div className="title-setting">Group privacy</div>
          <div className="create-workspace-form">
            <Card>
              <CardBody>
                <div>
                  <WorkgroupPrivacy
                    methods={methods}
                    onChange={changeTypeMode}
                    typdeDefault={state.detailWorkspace?.type}
                    modeDefault={state.detailWorkspace?.mode}
                  />
                </div>
              </CardBody>
            </Card>

            <div className="title-setting">Manage membership</div>
            <Card className="manage_membership">
              <CardBody>
                <div>
                  <FormProvider {...methods}>
                    <div className="field_switch">
                      <div>
                        <div className="label">
                          {" "}
                          {useFormatMessage(
                            "modules.workspace.display.review_post"
                          )}
                        </div>
                        <div className="sub-label">
                          {useFormatMessage(
                            "modules.workspace.text.sub_review_post"
                          )}
                        </div>
                      </div>
                      <ErpSwitch
                        formGroupClass="ms-auto mb-0"
                        name="review_post"
                        loading={state.loading}
                        defaultValue={state.detailWorkspace?.review_post}
                        onClick={(e) =>
                          onSubmit({ review_post: e.target.checked })
                        }
                      />
                    </div>
                    <div className="field_select">
                      <ErpSelect
                        name="membership_approval"
                        loading={state.loading}
                        label={useFormatMessage(
                          "modules.workspace.fields.membership_approval"
                        )}
                        options={membership_approval}
                        defaultValue={
                          state.detailWorkspace?.membership_approval
                            ? membership_approval[
                            findKeyByValue(
                              membership_approval,
                              state.detailWorkspace?.membership_approval
                            )
                            ]
                            : membership_approval[0]
                        }
                        isClearable={false}
                        isSearchable={false}
                        onChange={(e) => onSubmit({ membership_approval: e })}
                        styles={{
                          option: (styles, state) => ({
                            ...styles,
                            backgroundColor: state.isFocused ? "red" : ""
                          })
                        }}
                      />
                    </div>
                  </FormProvider>
                </div>
              </CardBody>
            </Card>

            <div className="title-setting">Group management</div>
            <Card>
              <CardBody>
                <div>
                  <div className="d-flex align-items-center group-management">
                    <div>
                      <svg
                        width={40}
                        height={40}
                        className="icon-group-management"
                        viewBox="0 0 40 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M13.0664 33.3662L15.7164 35.3495C18.0664 37.1162 21.9331 37.1162 24.2831 35.3495L31.4497 29.9995C33.0331 28.8162 34.3331 26.2329 34.3331 24.2662V11.8662"
                          stroke="#696760"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M31.6336 7.23327C31.3836 7.08327 31.1169 6.94994 30.8503 6.83327L22.5336 3.7166C21.1503 3.19993 18.8836 3.19993 17.5003 3.7166L9.16693 6.84994C7.25026 7.5666 5.68359 9.83327 5.68359 11.8666V24.2499C5.68359 26.2166 6.98359 28.7999 8.56693 29.9833L8.90026 30.2333"
                          stroke="#696760"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M36.6673 3.33301L3.33398 36.6663"
                          stroke="#696760"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="label-field">
                      Delete Group
                      <div className="sub-label">
                        By deleting your group, you will delete all information
                        in this group: post, photos, videos,...
                        {state.detailWorkspace.is_system === true ? (
                          <div className="mt-1">
                            <Alert color="danger" className="mb-0 p-25">
                              {useFormatMessage(
                                "modules.workspace.display.warning_delete_system_workgroup"
                              )}
                            </Alert>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    {!isMobileView() ? (
                      <Button
                        color="danger"
                        outline
                        className="ms-auto"
                        disabled={state.detailWorkspace.is_system === true}
                        onClick={() => handleDeleteWS()}>
                        Delete
                      </Button>
                    ) : (
                      <svg
                        width={80}
                        height={40}
                        viewBox="0 0 40 40"
                        fill="none"
                        style={{ marginLeft: "5px" }}
                        xmlns="http://www.w3.org/2000/svg">
                        <rect width={40} height={40} rx={12} fill="#FFE7E5" />
                        <path
                          d="M29 13.9805C25.67 13.6505 22.32 13.4805 18.98 13.4805C17 13.4805 15.02 13.5805 13.04 13.7805L11 13.9805"
                          stroke="#E52717"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16.5 12.97L16.72 11.66C16.88 10.71 17 10 18.69 10H21.31C23 10 23.13 10.75 23.28 11.67L23.5 12.97"
                          stroke="#E52717"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M26.8499 17.1396L26.1999 27.2096C26.0899 28.7796 25.9999 29.9996 23.2099 29.9996H16.7899C13.9999 29.9996 13.9099 28.7796 13.7999 27.2096L13.1499 17.1396"
                          stroke="#E52717"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M18.3301 24.5H21.6601"
                          stroke="#E52717"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M17.5 20.5H22.5"
                          stroke="#E52717"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </WorkspaceSettingLayout>
  )
}

export default SettingWorkspace
