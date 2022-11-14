import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import { ErpSwitch } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import notification from "@apps/utility/notification"
import SwAlert from "@apps/utility/SwAlert"
import { isArray } from "lodash"
import { Fragment, useEffect } from "react"
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
  UncontrolledTooltip
} from "reactstrap"
import { testApi } from "../common/api"
import ImportModal from "../modals/ImportModal"
import { Table } from "antd"
import TestBoardLayout from "./TestBoardLayout"
import { FormLoader } from "@apps/components/spinner/FormLoader"
const Import = (props) => {
  const [state, setState] = useMergedState({
    format: false,
    loading: false,
    value: "",
    name: "",
    dataTest: [],
    importModal: false,
    infoTest: {}
  })

  const handleDeleteClick = (idDelete = "") => {
    if (idDelete !== "") {
      const ids = isArray(idDelete) ? idDelete : [idDelete]
      SwAlert.showWarning({
        confirmButtonText: useFormatMessage("button.delete")
      }).then((res) => {
        if (res.value) {
          _handleDeleteClick(ids)
        }
      })
    }
  }

  const _handleDeleteClick = (ids) => {
    defaultModuleApi
      .delete("test", ids)
      .then((result) => {
        loadData()
        notification.showSuccess({
          text: useFormatMessage("notification.delete.success")
        })
      })
      .catch((err) => {
        notification.showError(err.message)
      })
  }

  const loadData = () => {
    setState({ loading: true })
    testApi.getTest().then((res) => {
      setState({ dataTest: res.data.results, loading: false })
    })
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleActive = (id, active) => {
    defaultModuleApi
      .postSave("test", { id: id, active: active })
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
      })
      .catch((err) => {
        notification.showError(err.message)
      })
  }

  const handleImportModal = (info = "") => {
    setState({ importModal: !state.importModal, infoTest: info })
  }

  const addBtn = (
    <Button.Ripple
      size="md"
      color="primary"
      onClick={() => handleImportModal({})}
      className="waves-effect btn btn-primary">
      <i className="icpega Actions-Plus"></i>{" "}
      {useFormatMessage("modules.test.buttons.new")}
    </Button.Ripple>
  )

  const columns = [
    {
      title: "Name Test",
      dataIndex: "title",
      key: "title",
      render: (text) => <a>{text}</a>
    },
    {
      title: "Active",
      dataIndex: "active",
      key: "active",
      render: (_, obj) => {
        return (
          <ErpSwitch
            defaultChecked={obj.active}
            onChange={(e) => handleActive(obj.id, e.target.checked)}
          />
        )
      }
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, obj) => {
        return (
          <div className="d-flex">
            <button
              className="waves-effect btn-icon btn btn-flat-secondary btn-sm me-50"
              id="downloadimport"
              onClick={() => handleImportModal(obj)}>
              <i className="fa-regular fa-file-import fs-5"></i>
            </button>
            <button
              className="waves-effect btn-icon btn btn-flat-secondary btn-sm me-50"
              onClick={() => handleDeleteClick(obj.id)}>
              <i className="fa-regular fa-trash"></i>
            </button>
            <UncontrolledTooltip placement="top" target="downloadimport">
              {useFormatMessage("modules.test.text.edit_test")}
            </UncontrolledTooltip>
          </div>
        )
      }
    }
  ]

  return (
    <Fragment>
      <TestBoardLayout
        breadcrumbs={
          <Breadcrumbs
            list={[
              {
                title: useFormatMessage("modules.test.title.test_board")
              },
              {
                title: useFormatMessage("modules.test.text.import")
              }
            ]}
            custom={addBtn}
          />
        }>
        <Row>
          <Col sm={12}>
            {!state.loading && (
              <Table columns={columns} dataSource={state.dataTest} />
            )}
            {state.loading && <FormLoader className="mt-3" />}
          </Col>
        </Row>
      </TestBoardLayout>
      <ImportModal
        modal={state.importModal}
        infoTest={state.infoTest}
        handleImportModal={handleImportModal}
        loadData={loadData}
      />
    </Fragment>
  )
}

export default Import
