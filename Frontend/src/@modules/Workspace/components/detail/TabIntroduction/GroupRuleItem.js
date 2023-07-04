// ** React Imports
import { Fragment, memo } from "react"
import { workspaceApi } from "@modules/Workspace/common/api"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { FormProvider, useForm } from "react-hook-form"
import { useDrag, useDrop } from "react-dnd"
// ** Styles
import { Button, Col, Row } from "reactstrap"
import { Dropdown, Space } from "antd"
import { Edit, Trash } from "react-feather"
// ** Components
import FormEditGroupRule from "../../modals/EditGroupRuleModal/FormEditGroupRule"
import notification from "@apps/utility/notification"

const GroupRuleItem = memo((props) => {
  const {
    // ** props
    id,
    itemGroupRule,
    index,
    groupRule,
    isEditable,
    arrayLength,
    // ** methods
    setGroupRule,
    handleFindCard,
    handleMoveCard
  } = props

  const [state, setState] = useMergedState({
    loading: false,
    isEditing: false,
    isDeleting: false
  })

  const originalIndex = handleFindCard(itemGroupRule._id).index

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "card_group_rule",
      item: { id: itemGroupRule._id, name: itemGroupRule.title, originalIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      }),
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult()
        console.log(item, dropResult, item.id !== dropResult?.id)
        if (item && dropResult && item.id !== dropResult?.id) {
          const dropResultInfo = handleFindCard(dropResult.id)
          handleMoveCard(item.id, dropResultInfo.index)
        }
      }
    }),
    [groupRule, handleFindCard, handleMoveCard]
  )

  const [, drop] = useDrop(() => ({
    accept: "card_group_rule",
    drop: () => ({ id: itemGroupRule._id }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  }))
  const opacity = isDragging ? 0 : 1

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
      group_rule_id: itemGroupRule._id,
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

  return (
    <div
      style={{ opacity }}
      ref={(node) => drag(drop(node))}
      className="d-flex align-items-center p-1 group-rule-item">
      <div className="w-10">
        <div className="me-75 sort">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            version="1.1"
            id="Layer_1"
            x="0px"
            y="0px"
            width="9px"
            height="16px"
            viewBox="0 0 9 16"
            enableBackground="new 0 0 9 16"
            xmlSpace="preserve">
            {" "}
            <image
              id="image0"
              width="9"
              height="16"
              x="0"
              y="0"
              href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAQCAMAAADzlqVxAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAV1BMVEUAAACvtsKwuMKwt8Kv tcWvt7+wuMOvtcKwt8OwtsOwt8Swt8SvtsKvt8evtsKvt8KvusWvt8OwtsOvtsKvt8KvtsKvur+w tsOwt8KvtsGvtsSwt8P///823RHSAAAAG3RSTlMAcO/fMCDvsL/v35+gIMCwMEDPUNDgMK+foHB6 4D8vAAAAAWJLR0QcnARBBwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+cHBAwBB3Syl1sA AABhSURBVAjXbc05AsMgEANAwZo1rIH4PqL//zOQ2qrUjATnZUAQ76DKEZGaYOSETBpKzQUlf2a8 ZZEYEOK6QbodyQTlv3nDttdm67G82vO6m53agPS3hxRoYu02wakVzKbfH3LtBOtIUSznAAAAJXRF WHRkYXRlOmNyZWF0ZQAyMDIzLTA3LTA0VDEwOjAxOjA3KzAyOjAwtohwMwAAACV0RVh0ZGF0ZTpt b2RpZnkAMjAyMy0wNy0wNFQxMDowMTowNyswMjowMMfVyI8AAAAASUVORK5CYII="
            />
          </svg>
        </div>
      </div>
      <div className="d-flex align-items-start justify-content-start">
        <div className="me-75">
          <h6 className="index">{index + 1}</h6>
        </div>
        <div className="w-100">
          <div className="w-100 d-flex align-items-start justify-content-between">
            <div>
              <h6 className="title">{itemGroupRule.title}</h6>
              <p className="mb-0 description">{itemGroupRule.description}</p>
            </div>
            <Fragment>{renderAction()}</Fragment>
          </div>
          <Fragment>{renderRemove()}</Fragment>
        </div>
      </div>
    </div>
  )
})

export default GroupRuleItem
