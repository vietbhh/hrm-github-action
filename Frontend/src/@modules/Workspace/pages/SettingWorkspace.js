import { ErpSelect, ErpSwitch } from "@apps/components/common/ErpField"
import SwAlert from "@apps/utility/SwAlert"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { Button, Card, CardBody, Alert } from "reactstrap"
import AvatarBox from "../../../@apps/components/common/AvatarBox"
import { workspaceApi } from "../common/api"
import WorkspaceSettingLayout from "../components/detail/WorkspaceSettingLayout/WorkspaceSettingLayout"
import EditInformationModal from "../components/modals/EditInformationModal"
import WorkgroupPrivacy from "../components/detail/CreateWorkspace/WorkGroupPrivacy"
import { isEmpty } from "lodash"
import { Dropdown, Space } from "antd"
import MenuSettingWorkspace from "../components/detail/MenuSettingWorkspace"

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
    label: "Admin",
    icon: (
      <div className="vector-green me-50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none">
          <path
            d="M18.54 4.11984L13.04 2.05984C12.47 1.84984 11.54 1.84984 10.97 2.05984L5.47005 4.11984C4.41005 4.51984 3.55005 5.75984 3.55005 6.88984V14.9898C3.55005 15.7998 4.08005 16.8698 4.73005 17.3498L10.23 21.4598C11.2 22.1898 12.79 22.1898 13.76 21.4598L19.26 17.3498C19.91 16.8598 20.4401 15.7998 20.4401 14.9898V6.88984C20.4501 5.75984 19.59 4.51984 18.54 4.11984ZM15.48 9.71984L11.18 14.0198C11.03 14.1698 10.84 14.2398 10.65 14.2398C10.46 14.2398 10.27 14.1698 10.12 14.0198L8.52005 12.3998C8.23005 12.1098 8.23005 11.6298 8.52005 11.3398C8.81005 11.0498 9.29005 11.0498 9.58005 11.3398L10.66 12.4198L14.43 8.64984C14.72 8.35984 15.2 8.35984 15.49 8.64984C15.78 8.93984 15.78 9.42984 15.48 9.71984Z"
            fill="white"
          />
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
      <div className="vector-green me-50">
        <i className="fa-duotone fa-unlock"></i>
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
    editModal: false
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
    setState({ editModal: !state.editModal })
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
            <CardBody className="p-50 d-flex align-items-center w-100">
              <span className="url_workspace">{Url_workspace}</span>
              <Button
                color="success"
                className="btn-blue ms-auto btn-sm"
                onClick={() => handleCopyUrl()}>
                {useFormatMessage("modules.workspace.buttons.copy")}{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none">
                  <path
                    d="M1.80005 3.54526C1.80005 2.58127 2.58152 1.7998 3.5455 1.7998H10.5273C11.4913 1.7998 12.2728 2.58127 12.2728 3.54526V10.5271C12.2728 11.4911 11.4913 12.2725 10.5273 12.2725H3.5455C2.58152 12.2725 1.80005 11.4911 1.80005 10.5271V3.54526Z"
                    fill="white"
                  />
                  <path
                    d="M6.60005 13.5816C6.35905 13.5816 6.16369 13.777 6.16369 14.018C6.16369 14.982 6.94515 16.1998 7.90914 16.1998H14.4546C15.4186 16.1998 16.2 15.4183 16.2 14.4544V7.03617C16.2 6.07218 15.4186 5.29071 14.4546 5.29071H14.0819C13.8057 5.29071 13.5819 5.51457 13.5819 5.79071V10.5271C13.5819 12.2141 12.2143 13.5816 10.5273 13.5816H6.60005Z"
                    fill="white"
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
                <div className="rounded-circle" style={{ width: "100px " }}>
                  <AvatarBox
                    currentAvatar={state.detailWorkspace?.avatar}
                    loading={state.loading}
                    readOnly={true}
                  />
                </div>
                <div className="d-flex ms-1 w-100">
                  <div>
                    <div className="workspace_name">
                      {state.detailWorkspace?.name}
                    </div>
                    <div className="workspace_introduction">
                      {state.detailWorkspace?.description}
                    </div>
                  </div>
                  <div
                    className="ms-auto vector"
                    onClick={() => handleEditInformation()}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none">
                      <path
                        d="M12.3278 6.37223L15.6278 9.67223M4.07788 17.9222L8.08003 17.1158C8.2925 17.073 8.48758 16.9684 8.64079 16.8151L17.6 7.85098C18.0295 7.42119 18.0292 6.72454 17.5993 6.29512L15.7015 4.39938C15.2717 3.97013 14.5754 3.97043 14.146 4.40003L5.18591 13.3651C5.033 13.5181 4.92859 13.7128 4.88574 13.9248L4.07788 17.9222Z"
                        stroke="#32434F"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <div className="title-setting">Group privacy</div>
          <div className="create-workspace-form">
            <Card>
              <CardBody>
                <div className="pt-25 mb-1 ps-1 pe-1">
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
                <div className="ps-1 pe-1">
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
                    />
                  </FormProvider>
                </div>
              </CardBody>
            </Card>

            <div className="title-setting">Group management</div>
            <Card>
              <CardBody>
                <div className="ps-1 pe-1">
                  <div className="d-flex align-items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none">
                      <path
                        d="M7.83997 20.0201L9.42997 21.2101C10.84 22.2701 13.16 22.2701 14.57 21.2101L18.87 18.0001C19.82 17.2901 20.6 15.7401 20.6 14.5601V7.12012"
                        stroke="#32434F"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M18.98 4.34006C18.83 4.25006 18.67 4.17006 18.51 4.10006L13.52 2.23006C12.69 1.92006 11.33 1.92006 10.5 2.23006L5.50003 4.11006C4.35003 4.54006 3.41003 5.90006 3.41003 7.12006V14.5501C3.41003 15.7301 4.19003 17.2801 5.14003 17.9901L5.34003 18.1401"
                        stroke="#32434F"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M22 2L2 22"
                        stroke="#32434F"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="label-field ms-1">
                      Deleting the group
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
                    <Button
                      color="secondary"
                      className="btn-secondary ms-auto"
                      disabled={state.detailWorkspace.is_system === true}
                      onClick={() => handleDeleteWS()}>
                      Delete
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
      <EditInformationModal
        modal={state.editModal}
        infoWorkspace={state.detailWorkspace}
        handleModal={handleEditInformation}
        loadData={loadData}
      />
    </WorkspaceSettingLayout>
  )
}

export default SettingWorkspace
