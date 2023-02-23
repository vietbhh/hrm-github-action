// ** React Imports
import { Fragment } from "react"
import { workspaceApi } from "@modules/Workspace/common/api"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { FormProvider, useForm } from "react-hook-form"
// ** Styles
import { Button, Col, Row } from "reactstrap"
import { Dropdown, Space } from "antd"
import { Edit, Trash } from "react-feather"
// ** Components
import FormEditGroupRule from "../../modals/EditGroupRuleModal/FormEditGroupRule"
import notification from "@apps/utility/notification"

const GroupRuleItem = (props) => {
  const {
    // ** props
    id,
    item,
    index,
    isEditable,
    arrayLength,
    // ** methods
    setGroupRule
  } = props

  const [state, setState] = useMergedState({
    loading: false,
    isEditing: false,
    isDeleting: false
  })

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit } = methods

  const onSubmit = (values) => {
    setState({
      loading: true
    })

    const updateValues = {
      group_rule_id: item._id,
      type: "update",
      data: {
        ...values,
        _id: item._id
      }
    }

    workspaceApi
      .update(id, updateValues)
      .then((res) => {
        setGroupRule(res.data, true)
        setState({
          isEditing: false,
          loading: false
        })
      })
      .catch((err) => {
        notification.showError()
        setState({
          loading: false
        })
      })
  }

  const handleSort = (type) => {
    setState({
      isEditing: false,
      isDeleting: false
    })
    const data = {
      index: index,
      sort_type: type
    }
    workspaceApi
      .sortGroupRule(id, data)
      .then((res) => {
        setGroupRule(res.data, true)
      })
      .catch((err) => {})
  }

  const handleClickEdit = () => {
    setState({
      isEditing: true
    })
  }

  const handleCancelEdit = () => {
    setState({
      isEditing: false
    })
  }

  const handleClickDelete = () => {
    setState({
      isDeleting: true
    })
  }

  const handleCancelDelete = () => {
    setState({
      isDeleting: false
    })
  }

  const handleRemoveGroupRule = () => {
    setState({
      loading: true
    })

    const updateValues = {
      group_rule_id: item._id,
      type: "remove"
    }

    workspaceApi
      .update(id, updateValues)
      .then((res) => {
        setGroupRule(res.data, true)
        setState({
          isDeleting: false,
          loading: false
        })
      })
      .catch((err) => {
        notification.showError()
        setState({
          loading: false
        })
      })
  }

  const items = [
    {
      key: "1",
      label: (
        <Button.Ripple
          color="flat-primary"
          size="sm"
          onClick={() => handleClickEdit()}
          className="w-100">
          <Edit className="me-50" size={15} />{" "}
          <span className="align-middle">
            {useFormatMessage("modules.workspace.buttons.edit_rule")}
          </span>
        </Button.Ripple>
      )
    },
    {
      key: "2",
      label: (
        <Button.Ripple
          color="flat-danger"
          size="sm"
          onClick={() => handleClickDelete()}
          className="w-100">
          <Trash className="me-50" size={15} />{" "}
          <span className="align-middle">
            {useFormatMessage("modules.workspace.buttons.remove_rule")}
          </span>
        </Button.Ripple>
      )
    }
  ]

  // ** render
  const renderSort = () => {
    if (!isEditable) {
      return ""
    }

    return (
      <div className="me-75 d-flex flex-column sort">
        {index > 0 ? (
          <i className="fas fa-caret-up" onClick={() => handleSort("up")} />
        ) : (
          ""
        )}
        {index < arrayLength - 1 ? (
          <i className="fas fa-caret-down" onClick={() => handleSort("down")} />
        ) : (
          ""
        )}
      </div>
    )
  }

  const renderAction = () => {
    if (!isEditable) {
      return ""
    }

    return (
      <Dropdown
        placement="bottomRight"
        menu={{ items }}
        trigger="click"
        overlayClassName="dropdown-workspace-group-rule">
        <Button.Ripple color="flat-primary" className="btn-icon">
          <i className="fas fa-ellipsis-h" />
        </Button.Ripple>
      </Dropdown>
    )
  }

  const renderRemove = () => {
    if (!state.isDeleting) {
      return ""
    }

    return (
      <Space className="mt-1">
        <Button.Ripple
          size="sm"
          color="danger"
          disabled={state.loading}
          onClick={() => handleRemoveGroupRule()}>
          {useFormatMessage("modules.workspace.buttons.remove")}
        </Button.Ripple>
        <Button.Ripple
          size="sm"
          color="success"
          disabled={state.loading}
          onClick={() => handleCancelDelete()}>
          {useFormatMessage("modules.workspace.buttons.cancel")}
        </Button.Ripple>
      </Space>
    )
  }

  const renderComponent = () => {
    if (state.isEditing) {
      return (
        <div className="d-flex align-items-start justify-content-start p-0 pt-1 group-rule-item">
          <div className="me-75">
            <span className="index">{index + 1}</span>
          </div>
          <div className="w-100">
            <FormEditGroupRule
              methods={methods}
              showInputLabel={false}
              formEditData={item}
            />
            <Row className="m-0 mb-50">
              <Col sm={12} xs={12} className="p-0">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Space>
                    <Button.Ripple
                      size="sm"
                      type="submit"
                      color="primary"
                      disabled={state.loading}>
                      {useFormatMessage("modules.workspace.buttons.save")}
                    </Button.Ripple>
                    <Button.Ripple
                      size="sm"
                      type="button"
                      color="danger"
                      disabled={state.loading}
                      onClick={() => handleCancelEdit()}>
                      {useFormatMessage("modules.workspace.buttons.cancel")}
                    </Button.Ripple>
                  </Space>
                </form>
              </Col>
            </Row>
          </div>
        </div>
      )
    }

    return (
      <div className="d-flex align-items-start justify-content-start p-1 group-rule-item">
        <Fragment>{renderSort()}</Fragment>
        <div className="me-75">
          <span className="index">{index + 1}</span>
        </div>
        <div className="w-100">
          <div className="w-100 d-flex align-items-start justify-content-between">
            <div>
              <h6>{item.title}</h6>
              <p className="mb-0">{item.description}</p>
            </div>
            <Fragment>{renderAction()}</Fragment>
          </div>
          <Fragment>{renderRemove()}</Fragment>
        </div>
      </div>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default GroupRuleItem
