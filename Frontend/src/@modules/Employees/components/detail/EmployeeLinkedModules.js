import { EmptyContent } from "@apps/components/common/EmptyContent";
import LockedCard from "@apps/components/common/LockedCard";
import { ActionCellComp } from "@apps/modules/default/components/ListDefaultModule";
import FormModalDefaultModule from "@apps/modules/default/components/modals/FormModalDefaultModule";
import TableDefaultModule from "@apps/modules/default/components/table/TableDefaultModule";
import { useFormatMessage, useMergedState } from "@apps/utility/common";
import notification from "@apps/utility/notification";
import SwAlert from "@apps/utility/SwAlert";
import { employeesApi } from "@modules/Employees/common/api";
import { isEmpty, isFunction, isUndefined } from "lodash-es";
import { Fragment, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button, Card, CardBody, CardHeader } from "reactstrap";
const EmployeeLinkedModules = (props) => {
  const {
    module,
    loadDataApi,
    title,
    icon,
    parentId,
    overrideTableProps,
    overrideFormProps,
    permits
  } = props;
  const [state, setState] = useMergedState({
    formModal: false,
    loading: true,
    actionId: null
  });

  const [table, setTable] = useMergedState({
    loading: true,
    data: [],
    recordsTotal: 0,
    currentPage: props?.match?.params?.id || 1,
    tableFilters: [],
    searchValue: "",
    perPage: useSelector((state) => state.auth.settings.perPage) || 10,
    selectedRows: [],
    orderCol: "id",
    orderType: "desc"
  });

  const canView = permits.view || false;
  const canUpdate = permits.update || false;

  const loadData = () => {
    if (!isUndefined(parentId)) {
      loadDataApi().then((res) => {
        setTable({
          loading: false,
          data: res.data.results
        });
      });
    }
  };

  useEffect(() => {
    loadData();
  }, [parentId, loadDataApi]);
  return (
    <Fragment>
      <LockedCard blocking={!canView}>
        <Card className="card-inside with-border-radius life-card">
          <CardHeader>
            <div className="d-flex flex-wrap w-100">
              <h1 className="card-title">
                <span className="title-icon">
                  <i className={icon} />
                </span>
                <span>{title}</span>
              </h1>
              <div className="d-flex ms-auto">
                {canUpdate && (
                  <Button
                    color="flat-primary"
                    tag="div"
                    className="text-primary btn-table-more btn-icon"
                    onClick={() => {
                      setState({
                        formModal: !state.formModal
                      });
                    }}
                  >
                    <i className="iconly-Plus icli" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardBody>
            {isEmpty(table.data) && canView && <EmptyContent />}
            {!isEmpty(table.data) && canView && (
              <TableDefaultModule
                metas={module.metas}
                data={table.data}
                recordsTotal={table.recordsTotal}
                currentPage={table.currentPage}
                perPage={table.perPage}
                module={module.config}
                loading={table.loading}
                onSortColumn={false}
                onSelectedRow={false}
                onResize={false}
                onDragColumn={false}
                customColumnAfter={[
                  {
                    props: {
                      width: 120,
                      align: "center",
                      verticalAlign: "middle",
                      fixed: "right"
                    },
                    header: "",
                    cellComponent: (cellProps) => {
                      return (
                        <ActionCellComp
                          handleDeleteClick={(idDelete = "") => {
                            if (idDelete !== "") {
                              SwAlert.showWarning({
                                confirmButtonText:
                                  useFormatMessage("button.delete")
                              }).then((res) => {
                                if (res.value) {
                                  employeesApi
                                    .deleteRelated(
                                      module.config.name,
                                      parentId,
                                      idDelete
                                    )
                                    .then((result) => {
                                      loadData();
                                      notification.showSuccess({
                                        text: useFormatMessage(
                                          "notification.delete.success"
                                        )
                                      });
                                    })
                                    .catch((err) => {
                                      notification.showError({
                                        text: err.message
                                      });
                                    });
                                }
                              });
                            }
                          }}
                          handleUpdateClick={(id = false) => {
                            setState({
                              formModal: !state.formModal,
                              actionId: id
                            });
                          }}
                          canUpdateAll={canUpdate}
                          canDeleteAll={canUpdate}
                          module={module}
                          {...cellProps}
                        />
                      );
                    }
                  }
                ]}
                {...overrideTableProps}
              />
            )}
          </CardBody>
        </Card>
      </LockedCard>
      {canUpdate && (
        <FormModalDefaultModule
          loadData={loadData}
          modal={state.formModal}
          metas={module.metas}
          module={module.config}
          handleModal={(id = false) => {
            setState({
              formModal: !state.formModal,
              actionId: id
            });
          }}
          options={module.options}
          updateDataId={state.actionId}
          uploadFiles={false}
          permissionsSelect={false}
          advButton={false}
          {...overrideFormProps}
        />
      )}
    </Fragment>
  );
};

export default EmployeeLinkedModules;
