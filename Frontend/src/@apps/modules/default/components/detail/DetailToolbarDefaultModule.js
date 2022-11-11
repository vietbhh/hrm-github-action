import GoBack from "@apps/components/common/GoBack"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import notification from "@apps/utility/notification"
import { canDeleteData, canUpdateData } from "@apps/utility/permissions"
import SwAlert from "@apps/utility/SwAlert"
import { isUndefined } from "lodash"
import { Fragment, useContext } from "react"
import { Edit, Trash } from "react-feather"
import { useSelector } from "react-redux"
import { NavLink, useNavigate } from "react-router-dom"
import { Button, Card, CardBody } from "reactstrap"
import { AbilityContext } from "utility/context/Can"
import FormModalDefaultModule from "../modals/FormModalDefaultModule"

export const DetailToolbarDefaultModule = (props) => {
  const { module, data, metas, options, loadData } = props
  const [state, setState] = useMergedState({
    modal: false
  })
  const updateBtn = isUndefined(props.updateBtn) ? true : props.updateBtn
  const deleteBtn = isUndefined(props.deleteBtn) ? true : props.deleteBtn
  const backBtn = isUndefined(props.backBtn) ? true : props.backBtn
  const customBtn = props.customBtn
  const ability = useContext(AbilityContext)
  const userId = useSelector((state) => state.auth.userData.id) || 0
  const canUpdate = updateBtn
    ? canUpdateData(ability, module.name, userId, data?.informations)
    : false
  const canDelete = deleteBtn
    ? canDeleteData(ability, module.name, userId, data?.informations)
    : false
  const history = useNavigate()
  const handleModel = () => {
    setState({
      modal: !state.modal
    })
  }
  const handleUpdateClick = (id) => {
    setState({
      modal: true
    })
  }
  const deleteConfirmHander = (ids) => {
    defaultModuleApi
      .delete(module.name, ids.join())
      .then((result) => {
        notification.showSuccess({
          text: useFormatMessage("notification.delete.success")
        })
        history(`/${module.name}`)
      })
      .catch((err) => {
        notification.showError({ text: err.message })
      })
  }

  const handleDeleteClick = (idDelete = "") => {
    if (idDelete !== "") {
      const ids = [idDelete]
      SwAlert.showWarning({
        confirmButtonText: useFormatMessage("button.delete")
      }).then((res) => {
        if (res.value) {
          deleteConfirmHander(ids)
        }
      })
    }
  }
  return (
    <Fragment>
      {backBtn && (
        <span>
          <GoBack />
        </span>
      )}
      {deleteBtn && canDelete && (
        <span className="float-end">
          {" "}
          <Button.Ripple
            color="flat-danger"
            size="md"
            onClick={() => {
              handleDeleteClick(data?.id)
            }}
          >
            <Trash size={14} /> {useFormatMessage("button.delete")}
          </Button.Ripple>
        </span>
      )}
      {updateBtn && canUpdate && module.update_mode !== "full" && (
        <Fragment>
          <span className="float-end">
            <Button.Ripple
              title={`update ${data?.id}`}
              color="flat-warning"
              size="md"
              onClick={() => {
                handleUpdateClick(data?.id)
              }}
            >
              <Edit size={14} /> {useFormatMessage("button.update")}
            </Button.Ripple>
          </span>
        </Fragment>
      )}
      {updateBtn && canUpdate && module.update_mode === "full" && (
        <span className="float-end">
          {" "}
          <Button.Ripple
            to={`/${module.name}/update/${data?.id}`}
            tag={NavLink}
            color="flat-warning"
            size="md"
          >
            <Edit size={14} /> {useFormatMessage("button.update")}
          </Button.Ripple>
        </span>
      )}
      {updateBtn && canUpdate && module.update_mode !== "full" && (
        <FormModalDefaultModule
          loadData={loadData}
          metas={metas}
          modal={state.modal}
          module={module}
          handleModal={handleModel}
          options={options}
          updateDataId={data?.id}
        />
      )}
      {customBtn}
    </Fragment>
  )
}

export const DetailToolbarWarpperDefaultModule = (props) => {
  return (
    <Fragment>
      <Card className="no-box-shadow">
        <CardBody className="p-0">
          <DetailToolbarDefaultModule {...props} />
        </CardBody>
      </Card>
    </Fragment>
  )
}
