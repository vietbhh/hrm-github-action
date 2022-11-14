import { EmptyContent } from "@apps/components/common/EmptyContent"
import LockedCard from "@apps/components/common/LockedCard"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import classNames from "classnames"
import { isEmpty, map } from "lodash-es"
import moment from "moment"
import { Fragment, useEffect } from "react"
import { Button, Card, CardBody, CardHeader } from "reactstrap"
import { formatDate } from "utility/Utils"
import EmployeeContractModal from "../modals/EmployeeContractModal"

const EmployeeContracts = (props) => {
  const { api, permits, reload } = props
  const [state, setState] = useMergedState({
    contractModal: false,
    contractLoading: true,
    contractUpdateId: null,
    contractUpdateData: {},
    contractsList: [],
    contractMinDate: "",
    loadingDataEdit: false
  })
  const canView = permits.view || false
  const canUpdate = permits.update || false

  const loadContracts = () => {
    if (!isEmpty(props.employeeData.id)) {
      api.getRelatedList("contracts").then((res) => {
        setState({
          contractLoading: false,
          contractsList: res.data.results,
          contractMinDate: res.data.min_date
        })
      })
    }
  }

  useEffect(() => {
    loadContracts()
  }, [props.employeeData.id])

  const dateToDay = moment().format("YYYY-MM-DD")

  return (
    <Fragment>
      <LockedCard blocking={!canView}>
        <Card className="card-inside with-border-radius life-card">
          <CardHeader>
            <div className="d-flex flex-wrap w-100">
              <h1 className="card-title">
                <span className="title-icon">
                  <i className="fal fa-clipboard-list-check" />
                </span>
                <span>
                  {useFormatMessage("modules.employees.tabs.job.contracts")}
                </span>
              </h1>
              {canUpdate && (
                <div className="d-flex ms-auto">
                  <Button
                    color="flat-primary"
                    tag="div"
                    className="text-primary btn-table-more btn-icon"
                    onClick={() => {
                      setState({
                        contractModal: !state.contractModal
                      })
                    }}>
                    <i className="iconly-Plus icli" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardBody>
            {!state.contractLoading && isEmpty(state.contractsList) && (
              <EmptyContent />
            )}
            {state.contractLoading && <DefaultSpinner center="true" />}
            {!state.contractLoading &&
              map(state.contractsList, (item, index) => (
                <Card
                  key={index}
                  className={classNames("card-list-item", {
                    "border-contract-not-active": item.active === false
                  })}>
                  <CardHeader>
                    <div className="d-flex flex-wrap align-items-center w-100">
                      <h1 className="card-title">
                        <span className="text-primary pr-1">
                          <i className="fal fa-clipboard-list-check" />
                        </span>
                        <span className="ms-50">{item.contract_code}</span>
                      </h1>

                      <span
                        className={classNames("life-badge ms-1", {
                          "border-contract-not-active color-contract-not-active":
                            item.active === false
                        })}>
                        {item.employee_type?.label ||
                          useFormatMessage(
                            "modules.contracts.fields.employee_type"
                          )}
                      </span>

                      <span
                        className={classNames("life-badge ms-1", {
                          "border-contract-not-active color-contract-not-active":
                            item.active === false
                        })}>
                        {useFormatMessage(
                          `${
                            item.contract_type?.label ||
                            "modules.contracts.fields.contract_type"
                          }`
                        )}
                      </span>

                      <div className="d-flex ms-auto">
                        <div>
                          <Button className="btn-sm btn-blue">
                            <i className="fal fa-file-word"></i>{" "}
                            {useFormatMessage("button.download")}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex flex-wrap w-100 mt-1">
                      <span>
                        {item.contract_department?.label ||
                          useFormatMessage(
                            "modules.contracts.fields.contract_department"
                          )}{" "}
                        -{" "}
                        {item.contract_job_title?.label ||
                          useFormatMessage(
                            "modules.contracts.fields.contract_job_title"
                          )}
                      </span>
                      <span className="ms-2">
                        {formatDate(item.contract_date_start)} -{" "}
                        {item.contract_date_end
                          ? formatDate(item.contract_date_end)
                          : useFormatMessage("modules.contracts.no_end_date")}
                      </span>
                      {canUpdate &&
                        (item.active === true ||
                          (state.contractsList.length > 1 &&
                            Date.parse(item.contract_date_start) >=
                              Date.parse(dateToDay))) && (
                          <div className="d-flex ms-auto">
                            <div>
                              <Button
                                outline
                                color="primary"
                                className={classNames("btn-sm me-50 btn-icon", {
                                  "border-contract-not-active color-contract-not-active":
                                    item.active === false
                                })}
                                onClick={() => {
                                  setState({
                                    loadingDataEdit: true,
                                    contractModal: true
                                  })
                                  api
                                    .getRelatedDetail("contracts", item.id)
                                    .then((res) => {
                                      if (!isEmpty(res.data)) {
                                        setState({
                                          contractUpdateId: item.id,
                                          contractUpdateData: res.data.data,
                                          loadingDataEdit: false
                                        })
                                      }
                                    })
                                    .catch((err) => {
                                      notification.showError({
                                        text: useFormatMessage(
                                          "notification.default.error"
                                        )
                                      })
                                      setState({ loadingDataEdit: false })
                                    })
                                }}>
                                <i className="iconly-Edit icli"></i>
                              </Button>
                            </div>
                          </div>
                        )}
                    </div>
                  </CardHeader>
                </Card>
              ))}
          </CardBody>
        </Card>
      </LockedCard>
      {canUpdate && (
        <EmployeeContractModal
          api={api}
          modal={state.contractModal}
          handleModal={() => {
            setState({
              contractModal: !state.contractModal
            })
          }}
          loadData={loadContracts}
          updateId={state.contractUpdateId}
          updateData={state.contractUpdateData}
          employeeId={props.employeeData.id}
          onClosed={() => {
            setState({
              contractUpdateId: null,
              contractUpdateData: null
            })
          }}
          loadingDataEdit={state.loadingDataEdit}
          contractMinDate={state.contractMinDate}
          reload={reload}
        />
      )}
    </Fragment>
  )
}

export default EmployeeContracts
