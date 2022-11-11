import Avatar from "@components/avatar"
import { Fragment } from "react"
import { AlertTriangle, Bell, Check, Info, X } from "react-feather"
import toast from "react-hot-toast"
import { Toast, ToastBody, ToastHeader } from "reactstrap"
import { useFormatMessage } from "./common"
const ToastContent = ({ type, title, icon, text, meta, closeToast }) => {
  return (
    <Fragment>
      <Toast className={`fri-toast fri-toast-${type}`}>
        <ToastHeader
          close={
            <button
              type="button"
              className="ms-1 btn-close"
              onClick={closeToast}></button>
          }>
          {icon && <Avatar color={type} className="me-50" icon={icon} />}
          {title}
        </ToastHeader>
        <ToastBody>
          {text}
          {meta && (
            <p className="m-0 text-end">
              <small
                className="text-muted"
                style={{
                  fontSize: "80%"
                }}>
                {meta}
              </small>
            </p>
          )}
        </ToastBody>
      </Toast>
    </Fragment>
  )
}

const notification = {
  show: (props = {}) => {
    const properties = {
      type: "primary",
      title: useFormatMessage("notification.alert"),
      icon: <Bell size={12} />,
      meta: "",
      ...props
    }
    let toastId = 0
    const closeToast = () => {
      toast.dismiss(toastId)
    }
    toastId = toast.custom(
      <ToastContent {...properties} closeToast={closeToast} />,
      properties.config
    )
  },
  showSuccess: (props = {}) => {
    const properties = {
      type: "success",
      title: useFormatMessage("notification.success"),
      icon: <Check size={14} />,
      meta: "",
      ...props
    }
    let toastId = 0
    const closeToast = () => {
      toast.dismiss(toastId)
    }
    toastId = toast.custom(
      <ToastContent {...properties} closeToast={closeToast} />,
      properties.config
    )
  },
  showError: (props = {}) => {
    const properties = {
      type: "danger",
      title: "Oops...",
      icon: <X size={14} />,
      meta: "",
      ...props
    }
    let toastId = 0
    const closeToast = () => {
      toast.dismiss(toastId)
    }
    toastId = toast.custom(
      <ToastContent {...properties} closeToast={closeToast} />,
      properties.config
    )
  },
  showWarning: (props = {}) => {
    const properties = {
      type: "warning",
      title: useFormatMessage("notification.warning"),
      icon: <AlertTriangle size={12} />,
      meta: "",
      ...props
    }
    let toastId = 0
    const closeToast = () => {
      toast.dismiss(toastId)
    }
    toastId = toast.custom(
      <ToastContent {...properties} closeToast={closeToast} />,
      properties.config
    )
  },
  showInfo: (props = {}) => {
    const properties = {
      type: "info",
      title: useFormatMessage("notification.info"),
      icon: <Info size={12} />,
      meta: "",
      ...props
    }
    let toastId = 0
    const closeToast = () => {
      toast.dismiss(toastId)
    }
    toastId = toast.custom(
      <ToastContent {...properties} closeToast={closeToast} />,
      properties.config
    )
  }
}
export default notification
