import { ErpSwitch } from "@apps/components/common/ErpField"
import SquareLoader from "@apps/components/spinner/SquareLoader"
import FormModalDefaultModule from "@apps/modules/default/components/modals/FormModalDefaultModule"
import {
  addComma,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import notification from "@apps/utility/notification"
import SwAlert from "@apps/utility/SwAlert"
import React, { Fragment, useEffect } from "react"
import { useSelector } from "react-redux"
import {
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledButtonDropdown
} from "reactstrap"

const OfficesSetting = () => {
  const [state, setState] = useMergedState({
    data: [],
    loading: true,
    modal: false,
    updateDataId: false
  })
  const moduleName = "offices"
  const module = useSelector((state) => state.app.modules[moduleName])
  const loadData = () => {
    defaultModuleApi
      .getList(moduleName, {
        orderType: "ASC"
      })
      .then((data) => {
        setState({
          data: data.data.results,
          loading: false
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleFormModal = ({ id = false }) =>
    setState({ modal: !state.modal, updateDataId: id })

  const handleUpdateClick = (id) => {
    handleFormModal({ id: id })
  }
  const handleDeleteClick = (id) => {
    SwAlert.showWarning({
      confirmButtonText: useFormatMessage("button.delete")
    }).then((res) => {
      if (res.value) {
        _handleDeleteClick(id)
      }
    })
  }

  const _handleDeleteClick = (id) => {
    defaultModuleApi
      .delete(moduleName, id)
      .then((result) => {
        loadData()
        notification.showSuccess({
          text: useFormatMessage("notification.delete.success")
        })
      })
      .catch((err) => {
        notification.showError({ text: err.message })
      })
  }

  const _handleUpdateActive = (id, value) => {
    defaultModuleApi
      .postSave(
        moduleName,
        {
          id: id,
          is_active: value
        },
        true
      )
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
      })
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <Fragment>
      <div className="setting-offices-wrapper">
        <div className="d-flex align-items-center justify-content-between">
          <h2 className="mb-0 title">
            {useFormatMessage("modules.offices.title")}
          </h2>
          <Button.Ripple
            className="btn-add"
            color="primary"
            onClick={handleFormModal}>
            <i className="icpega Actions-Plus"></i>
            <span className="align-self-center">
              {useFormatMessage("modules.offices.buttons.add")}
            </span>
          </Button.Ripple>
        </div>
        {state.loading ? (
          <SquareLoader className="mt-3" />
        ) : (
          state.data.map((item) => (
            <Fragment key={item.id}>
              <div className="d-block with-box-shadow with-border-radius offices-row mt-2">
                <div className="d-flex">
                  <p className="offices-title d-flex">
                    {item.name}{" "}
                    {item.is_headquarter && (
                      <span className="is_headquarter">HEADQUARTER</span>
                    )}
                  </p>

                  <UncontrolledButtonDropdown className="ms-auto">
                    <DropdownToggle color="flat-primary">
                      <i className="iconly-Filter icli"></i>
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem
                        onClick={() => {
                          handleUpdateClick(item.id)
                        }}>
                        {useFormatMessage("button.update")}
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => {
                          handleDeleteClick(item.id)
                        }}>
                        {useFormatMessage("button.delete")}
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledButtonDropdown>
                </div>
                <div
                  className="d-flex"
                  style={{
                    marginTop: "8px"
                  }}>
                  <span>
                    <i className="iconly-Location icli text-primary"></i>{" "}
                    {item.address}
                  </span>
                  <span className="ms-auto">
                    <ErpSwitch
                      id={`is_active_${item.id}`}
                      name="is_active"
                      inline
                      defaultChecked={item.is_active}
                      onChange={(e) => {
                        _handleUpdateActive(item.id, e.target.checked)
                      }}
                    />
                  </span>
                </div>
                <hr className="hr-primary" />

                <div className="row offices-detail-row">
                  <div className="col-sm-12 col-md-6">
                    <span className="offices-label">
                      {useFormatMessage(
                        "modules.offices.display.num_of_employees"
                      )}
                    </span>
                  </div>
                  <div className="col-sm-12 col-md-6">
                    {addComma(item.num_of_employees || 0)}{" "}
                    {useFormatMessage("modules.offices.display.employees")}
                  </div>
                </div>
                <div className="row offices-detail-row">
                  <div className="col-sm-12 col-md-6">
                    <span className="offices-label">
                      {useFormatMessage("modules.offices.fields.phone")}
                    </span>
                  </div>
                  <div className="col-sm-12 col-md-6">{item.phone}</div>
                </div>
                <div className="row offices-detail-row">
                  <div className="col-sm-12 col-md-6">
                    <span className="offices-label">
                      {useFormatMessage("modules.offices.fields.email")}
                    </span>
                  </div>
                  <div className="col-sm-12 col-md-6">{item.email}</div>
                </div>
              </div>
            </Fragment>
          ))
        )}
      </div>

      <FormModalDefaultModule
        loadData={loadData}
        modal={state.modal}
        metas={module.metas}
        module={module.config}
        handleModal={handleFormModal}
        options={module.options}
        updateDataId={state.updateDataId}
        uploadFiles={false}
        permissionsSelect={false}
        modalProps={{
          className: "modal-sx modal-add"
        }}
        advButton={false}
        modalTitle="modules.offices.buttons.add"
      />
    </Fragment>
  )
}

export default OfficesSetting