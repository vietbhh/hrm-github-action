import SwAlert from "@apps/utility/SwAlert"
import { useFormatMessage } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { canDeleteData } from "@apps/utility/permissions"
import { employeesApi } from "@modules/Employees/common/api"
import { showOffboardingModal } from "@modules/Employees/common/offboardingReducer"
import { showOnboardingModal } from "@modules/Employees/common/onboardingReducer"
import { showRehireModal } from "@modules/Employees/common/rehireReducer"
import { Dropdown } from "antd"
import { filter, isEmpty, isFunction, isUndefined, map } from "lodash-es"
import { Fragment, useContext } from "react"
import { MoreVertical } from "react-feather"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "reactstrap"
import { AbilityContext } from "utility/context/Can"

const EmployeeAction = (props) => {
  const {
    employeeData,
    customAction,
    render,
    setAssignType,
    toggleAssignChecklistModal
  } = props
  const ability = useContext(AbilityContext)
  const userId = useSelector((state) => state.auth.userData.id) || 0
  const canDelete = canDeleteData(ability, "employees", userId, employeeData)
  const canHiring = ability.can("hiring", "employees")
  const canTermination = ability.can("termination", "employees")
  const dispatch = useDispatch()

  const {
    invite,
    reinvite,
    onboarding,
    offboarding,
    cancel_offboarding,
    rehire,
    del,
    test,
    ...rest
  } = customAction || {}

  const handleDeleteClick = () => {
    if (!isEmpty(employeeData.id)) {
      SwAlert.showWarning({
        confirmButtonText: useFormatMessage("button.delete"),
        html: useFormatMessage("modules.employees.notifications.deleteWarning")
      }).then((res) => {
        if (res.value) {
          _handleDeleteClick(employeeData.id)
        }
      })
    }
  }

  const _handleDeleteClick = (id) => {
    employeesApi
      .deleteEmployee(id)
      .then((result) => {
        notification.showSuccess({
          text: useFormatMessage("notification.delete.success")
        })
        if (!isUndefined(del.afterAction) && isFunction(del.afterAction)) {
          del.afterAction()
        }
      })
      .catch((err) => {
        notification.showError({ text: err.message })
      })
  }

  const _cancelOffboarding = () => {
    SwAlert.showWarning({
      title: useFormatMessage(
        "modules.employees.offboarding.cancel_offboarding_title"
      ),
      text: useFormatMessage(
        "modules.employees.offboarding.cancel_offboarding_text"
      ),
      cancelButtonText: useFormatMessage(
        "modules.employees.offboarding.keep_offboarding_title"
      )
    }).then((res) => {
      if (res.isConfirmed) {
        employeesApi
          .cancelOffboard(employeeData.id)
          .then((res) => {
            notification.showSuccess({
              text: useFormatMessage(
                "modules.employees.offboarding.cancel_offboarding_success"
              )
            })
            if (
              !isUndefined(cancel_offboarding.afterAction) &&
              isFunction(cancel_offboarding.afterAction)
            ) {
              cancel_offboarding.afterAction()
            }
          })
          .catch((err) => {
            notification.showError({
              text: useFormatMessage("notification.something_went_wrong")
            })
          })
      }
    })
  }

  const _sendInvite = () => {
    employeesApi
      .sendInvite(employeeData.id)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage(
            "modules.employees.notifications.sendInviteSuccess"
          )
        })
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage("notification.something_went_wrong")
        })
      })
  }

  const actions = {
    invite: {
      title: useFormatMessage("modules.employees.buttons.invite"),
      icon: <i className="iconly-Send me-25"></i>,
      onClick: () => {
        _sendInvite()
      },
      condition: () =>
        parseInt(employeeData?.account_status?.value) === 1 && canHiring,
      ...invite
    },
    reinvite: {
      title: useFormatMessage("modules.employees.buttons.reinvite"),
      icon: <i className="iconly-Send me-25"></i>,
      onClick: () => {
        _sendInvite()
      },
      condition: () =>
        parseInt(employeeData?.account_status?.value) === 2 && canHiring,
      ...reinvite
    },
    onboarding: {
      title: useFormatMessage("modules.employees.buttons.onboarding"),
      icon: <i className="iconly-Login me-25"></i>,
      onClick: () => {
        setAssignType("onboarding")
        toggleAssignChecklistModal()
        dispatch(showOnboardingModal(employeeData))
      },
      condition: () =>
        parseInt(employeeData?.status?.value) === 11 && canHiring,
      ...onboarding
    },
    offboarding: {
      title: useFormatMessage("modules.employees.buttons.offboarding"),
      icon: <i className="iconly-Logout me-25"></i>,
      onClick: () => {
        dispatch(showOffboardingModal(employeeData))
      },
      condition: () =>
        [11, 12, 13, 14].includes(parseInt(employeeData?.status?.value)) &&
        canTermination,
      ...offboarding
    },
    cancel_offboarding: {
      title: useFormatMessage("modules.employees.buttons.cancel_offboarding"),
      icon: <i className="iconly-Close-Square me-25"></i>,
      onClick: () => {
        _cancelOffboarding()
      },
      condition: () =>
        parseInt(employeeData?.status?.value) === 15 && canTermination,
      ...cancel_offboarding
    },
    rehire: {
      title: useFormatMessage("modules.employees.buttons.rehire"),
      icon: <i className="iconly-User2 me-25"></i>,
      onClick: () => {
        dispatch(showRehireModal(employeeData))
      },
      condition: () =>
        parseInt(employeeData?.status?.value) === 16 && canHiring,
      ...rehire
    },
    del: {
      title: useFormatMessage("modules.employees.buttons.delete"),
      icon: <i className="iconly-Delete me-25"></i>,
      onClick: () => {
        handleDeleteClick()
      },
      condition: () => canDelete,
      ...del
    },
    ...rest
  }

  const items = [
    ...map(
      filter(actions, (item) => item !== false && item.condition()),
      (item, index) => {
        return {
          key: index,
          className: "employeeStatusDropdown",
          label: (
            <div onClick={item.onClick}>
              {item.icon}
              {item.title}
            </div>
          )
        }
      }
    )
  ]

  return (
    <Fragment>
      <Dropdown menu={{ items }} trigger={["click"]}>
        {isUndefined(render) ? (
          <Button.Ripple
            size="sm"
            color="gradient-primary"
            className="ms-1 btn-icon">
            <MoreVertical size="15" />
          </Button.Ripple>
        ) : (
          render
        )}
      </Dropdown>
    </Fragment>
  )
}

export default EmployeeAction
