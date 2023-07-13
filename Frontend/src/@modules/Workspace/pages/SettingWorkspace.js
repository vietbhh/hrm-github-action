import { ErpSelect, ErpSwitch } from "@apps/components/common/ErpField"
import SwAlert from "@apps/utility/SwAlert"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { Fragment, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { Button, Card, CardBody } from "reactstrap"
import AvatarBox from "../../../@apps/components/common/AvatarBox"
import { workspaceApi } from "../common/api"
import EditInformationModal from "../components/modals/EditInformationModal"
const findKeyByValue = (arr = [], value) => {
  const index = arr.findIndex((p) => p.value === value)
  return index
}
const workspace_type = [
  {
    value: "public",
    label: "Public",
    icon: (
      <div className="vector-green me-50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="22"
          viewBox="0 0 25 22"
          fill="none">
          <path
            d="M12.0476 0C6.13257 0 1.33862 4.92422 1.33862 11C1.33862 17.0758 6.13257 22 12.0476 22C17.9627 22 22.7566 17.0758 22.7566 11C22.7566 4.92422 17.9627 0 12.0476 0ZM19.8242 12.1688L18.9666 11.7348C18.787 11.6557 18.6338 11.5246 18.5257 11.3575L17.7727 10.1974C17.5481 9.85102 17.5481 9.39989 17.7727 9.05356L18.5922 7.79114C18.6893 7.64182 18.8226 7.52116 18.9788 7.44094C19.2655 7.2939 19.5745 7.2062 19.8894 7.15309C20.4349 8.31875 20.7487 9.6207 20.7487 11C20.7487 11.5427 20.6937 12.0716 20.603 12.5881L19.8242 12.1688ZM8.68014 2.76074L9.07265 3.14462C9.27119 3.33884 9.49683 3.50157 9.74196 3.62759C9.88909 3.70434 10.0648 3.72109 10.2237 3.6734C10.5166 3.58273 10.7132 3.30559 10.709 2.9932C10.7093 2.71979 10.911 2.4909 11.1758 2.4634C11.2816 2.45182 11.3871 2.44275 11.4929 2.43545C11.6416 2.42571 11.7871 2.48229 11.8924 2.59053L12.9131 3.63896C12.913 3.63896 12.9132 3.63905 12.9131 3.63896C13.1744 3.90752 13.1744 4.34279 12.913 4.61135L12.2847 5.25717C12.1541 5.39136 12.1541 5.60891 12.2847 5.74314L12.4808 5.94462C12.6115 6.07881 12.6115 6.29637 12.4808 6.4306L12.1462 6.77435C12.0853 6.84062 11.9974 6.875 11.9096 6.875H11.5331C11.4452 6.875 11.3616 6.91367 11.2988 6.97383L10.8847 7.39062C10.7801 7.49375 10.755 7.65703 10.8178 7.79023L11.4699 9.13043C11.4954 9.17813 11.508 9.22969 11.508 9.28555C11.5081 9.47547 11.3583 9.62938 11.1735 9.62955H10.9349C10.8541 9.62897 10.7763 9.59842 10.7157 9.54362L10.3283 9.19531C10.1495 9.03586 9.90205 8.98541 9.67742 9.06254L8.37351 9.50898C8.25195 9.55247 8.15122 9.64219 8.09219 9.75975C7.96515 10.0129 8.06188 10.3239 8.30821 10.4541L8.77171 10.6922C9.16539 10.8926 9.60044 11 10.0397 11C10.4798 11 10.9847 12.1726 11.3783 12.375H14.171C14.526 12.3748 14.8667 12.5195 15.1177 12.7771L15.6912 13.3633C15.9308 13.6094 16.0652 13.9434 16.0647 14.2914C16.0652 14.8238 15.8585 15.3343 15.4908 15.7094C15.3277 15.8761 15.1566 16.0509 15.0177 16.1941C14.8929 16.3213 14.8031 16.48 14.7571 16.6543C14.6939 16.8975 14.6412 17.1432 14.5575 17.3791L13.9673 19.1679C13.8854 19.5158 13.6097 19.7772 13.2679 19.8391C13.2102 19.8475 13.1536 19.859 13.0956 19.8662C13.0737 19.8691 13.0521 19.8725 13.0302 19.8752C12.9956 19.8795 12.9609 19.8816 12.9261 19.8816C12.4409 19.8817 12.0477 19.4777 12.0477 19.0179V18.4563C12.1183 17.914 11.7284 16.8987 11.101 16.2541C10.8512 15.9586 10.6713 15.6062 10.709 15.2453V13.8703C10.7103 13.3702 10.4464 12.9091 10.0204 12.6672C9.41931 12.3255 8.56427 11.8482 7.97862 11.5453C7.50048 11.2922 7.05288 10.9785 6.65547 10.609L6.62201 10.5789C6.33755 10.3125 6.08237 10.0117 5.86485 9.68516C5.55947 9.22539 4.86506 8.16406 4.37563 7.4207C4.3087 7.32188 4.27523 7.21016 4.22921 7.10703C5.14952 5.16055 6.73077 3.60422 8.68014 2.76074Z"
            fill="white"
          />
        </svg>
      </div>
    ),
    text: useFormatMessage(
      "modules.workspace.app_options.workspace_type.public"
    )
  },
  {
    value: "private",
    label: "Private",
    icon: (
      <div className="vector-red me-50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M11 4.125C6.41663 4.125 2.50246 6.97583 0.916626 11C2.50246 15.0242 6.41663 17.875 11 17.875C15.5833 17.875 19.4975 15.0242 21.0833 11C19.4975 6.97583 15.5833 4.125 11 4.125ZM11 15.5833C8.46996 15.5833 6.41663 13.53 6.41663 11C6.41663 8.47 8.46996 6.41667 11 6.41667C13.53 6.41667 15.5833 8.47 15.5833 11C15.5833 13.53 13.53 15.5833 11 15.5833ZM8.24996 11C8.24996 9.47833 9.47829 8.25 11 8.25C12.5216 8.25 13.75 9.47833 13.75 11C13.75 12.5217 12.5216 13.75 11 13.75C9.47829 13.75 8.24996 12.5217 8.24996 11Z"
            fill="white"
          />
        </svg>
      </div>
    ),
    text: useFormatMessage(
      "modules.workspace.app_options.workspace_type.private"
    )
  }
]

const workspace_mode = [
  {
    value: "visible",
    label: "Visible",
    icon: (
      <div className="vector-red me-50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M11 4.125C6.41663 4.125 2.50246 6.97583 0.916626 11C2.50246 15.0242 6.41663 17.875 11 17.875C15.5833 17.875 19.4975 15.0242 21.0833 11C19.4975 6.97583 15.5833 4.125 11 4.125ZM11 15.5833C8.46996 15.5833 6.41663 13.53 6.41663 11C6.41663 8.47 8.46996 6.41667 11 6.41667C13.53 6.41667 15.5833 8.47 15.5833 11C15.5833 13.53 13.53 15.5833 11 15.5833ZM8.24996 11C8.24996 9.47833 9.47829 8.25 11 8.25C12.5216 8.25 13.75 9.47833 13.75 11C13.75 12.5217 12.5216 13.75 11 13.75C9.47829 13.75 8.24996 12.5217 8.24996 11Z"
            fill="white"
          />
        </svg>
      </div>
    ),
    text: useFormatMessage(
      "modules.workspace.app_options.workspace_mode.visible"
    )
  },
  {
    value: "hidden",
    label: "Hidden",
    icon: (
      <div className="vector-green me-50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M11 4.125C6.41663 4.125 2.50246 6.97583 0.916626 11C2.50246 15.0242 6.41663 17.875 11 17.875C15.5833 17.875 19.4975 15.0242 21.0833 11C19.4975 6.97583 15.5833 4.125 11 4.125ZM11 15.5833C8.46996 15.5833 6.41663 13.53 6.41663 11C6.41663 8.47 8.46996 6.41667 11 6.41667C13.53 6.41667 15.5833 8.47 15.5833 11C15.5833 13.53 13.53 15.5833 11 15.5833ZM8.24996 11C8.24996 9.47833 9.47829 8.25 11 8.25C12.5216 8.25 13.75 9.47833 13.75 11C13.75 12.5217 12.5216 13.75 11 13.75C9.47829 13.75 8.24996 12.5217 8.24996 11Z"
            fill="white"
          />
        </svg>
      </div>
    ),
    text: useFormatMessage(
      "modules.workspace.app_options.workspace_mode.hidden"
    )
  }
]

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
    icon: "fa-duotone fa-unlock",
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
    loading: false,
    editModal: false
  })
  const params = useParams()
  const navigate = useNavigate()
  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, formState, reset, watch } = methods
  const watchAllFields = watch()

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

  return (
    <Fragment>
      <div className="workspace-setting row">
        <div className="col-md-7 offset-md-3">
          <Card>
            <CardBody className="p-50 d-flex align-items-center w-100">
              <span className="url_workspace">{Url_workspace}</span>
              <Button
                color="success"
                className="ms-auto btn-sm"
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
            {useFormatMessage("modules.workspace.display.workspace_infomation")}
          </div>
          <Card>
            <CardBody>
              <div className="workspace_infomation d-flex">
                <div className="me-2 rounded-circle">
                  <AvatarBox
                    currentAvatar={state.detailWorkspace?.avatar}
                    readOnly={true}
                  />
                </div>
                <div>
                  <div className="d-flex">
                    <div className="workspace_name">
                      {state.detailWorkspace?.name}
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
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                  </div>

                  {state.detailWorkspace?.introduction}
                </div>
              </div>
            </CardBody>
          </Card>

          <div className="title-setting">Group privacy</div>
          <Card>
            <CardBody>
              <FormProvider {...methods}>
                <h6>Setup group privacy</h6>
                <ErpSelect
                  name="type"
                  loading={state.loading}
                  nolabel
                  options={workspace_type}
                  defaultValue={
                    state.detailWorkspace?.type
                      ? workspace_type[
                          findKeyByValue(
                            workspace_type,
                            state.detailWorkspace?.type
                          )
                        ]
                      : workspace_type[0]
                  }
                  isClearable={false}
                  isSearchable={false}
                  onChange={(e) => onSubmit({ type: e })}
                />
                <ErpSelect
                  name="mode"
                  loading={state.loading}
                  nolabel
                  options={workspace_mode}
                  defaultValue={
                    state.detailWorkspace?.mode
                      ? workspace_mode[
                          findKeyByValue(
                            workspace_mode,
                            state.detailWorkspace?.mode
                          )
                        ]
                      : workspace_mode[0]
                  }
                  isClearable={false}
                  isSearchable={false}
                  onChange={(e) => onSubmit({ mode: e })}
                />
              </FormProvider>
            </CardBody>
          </Card>

          <div className="title-setting">Manage membership</div>
          <Card>
            <CardBody>
              <FormProvider {...methods}>
                <div className="mt-2 field_switch">
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
                    onClick={(e) => onSubmit({ review_post: e.target.checked })}
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
            </CardBody>
          </Card>

          <div className="title-setting">Group management</div>
          <Card>
            <CardBody className="d-flex align-items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none">
                <path
                  d="M7.83997 20.0201L9.42997 21.2101C10.84 22.2701 13.16 22.2701 14.57 21.2101L18.87 18.0001C19.82 17.2901 20.6 15.7401 20.6 14.5601V7.12012"
                  stroke="#32434F"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M18.98 4.34006C18.83 4.25006 18.67 4.17006 18.51 4.10006L13.52 2.23006C12.69 1.92006 11.33 1.92006 10.5 2.23006L5.50003 4.11006C4.35003 4.54006 3.41003 5.90006 3.41003 7.12006V14.5501C3.41003 15.7301 4.19003 17.2801 5.14003 17.9901L5.34003 18.1401"
                  stroke="#32434F"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M22 2L2 22"
                  stroke="#32434F"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <div className="label-field ms-1">
                Deleting the group
                <div className="sub-label">
                  By deleting your group, you will delete all information in
                  this group: post, photos, videos,...
                </div>
              </div>
              <Button
                color="secondary"
                className="btn-secondary ms-auto"
                onClick={() => handleDeleteWS()}>
                Delete
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
      <EditInformationModal
        modal={state.editModal}
        infoWorkspace={state.detailWorkspace}
        handleModal={handleEditInformation}
      />
    </Fragment>
  )
}

export default SettingWorkspace
