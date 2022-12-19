import bell from "@src/assets/images/icons/bell.gif"
import doneIcon from "@src/assets/images/icons/done.gif"
import errorIcon from "@src/assets/images/icons/error.gif"
import infoIcon from "@src/assets/images/icons/info.gif"
import warningIcon from "@src/assets/images/icons/warning.gif"
import classNames from "classnames"
import { Fragment } from "react"
import { X } from "react-feather"
import toast from "react-hot-toast"
import { useFormatMessage } from "./common"
import { Link } from "react-router-dom"
const ToastContent = ({ type, title, icon, text, meta, closeToast, link }) => {
  const Wrap = _.isUndefined(link) ? "div" : Link
  const wrapProps = _.isUndefined(link) ? {} : { to: link }
  return (
    <Fragment>
      <div
        className={classNames(
          "w-100 d-flex align-items-center justify-content-between body",
          {
            "has-title": title,
            "has-text": text
          }
        )}>
        <X size="14" onClick={closeToast} className="noti-remove" />
        {icon}
        <Wrap {...wrapProps} className="noti-link flex-fill">
          {title && <p className="noti-title mb-0">{title}</p>}
          {text && <p className="noti-text mb-0">{text}</p>}
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
        </Wrap>
      </div>
    </Fragment>
  )
}

const notification = {
  show: (props = {}) => {
    const properties = {
      type: "primary",
      title: useFormatMessage("notification.alert"),
      icon: <img src={bell} className="image me-1" />,
      meta: "",
      link: "#",
      ...props
    }
    let toastId = 0
    const closeToast = () => {
      toast.dismiss(toastId)
    }
    toastId = toast(
      <ToastContent {...properties} closeToast={closeToast} />,
      properties.config
    )
  },
  showSuccess: (props = {}) => {
    const properties = {
      type: "success",
      title: useFormatMessage("notification.success"),
      icon: <img src={doneIcon} className="image me-1" />,
      meta: "",
      ...props
    }
    let toastId = 0
    const closeToast = () => {
      toast.dismiss(toastId)
    }
    toastId = toast(
      <ToastContent {...properties} closeToast={closeToast} />,
      properties.config
    )
  },
  showError: (props = {}) => {
    const properties = {
      type: "danger",
      title: "Oops...",
      icon: <img src={errorIcon} className="image me-1" />,
      meta: "",
      ...props
    }
    let toastId = 0
    const closeToast = () => {
      toast.dismiss(toastId)
    }
    toastId = toast(
      <ToastContent {...properties} closeToast={closeToast} />,
      properties.config
    )
  },
  showWarning: (props = {}) => {
    const properties = {
      type: "warning",
      title: useFormatMessage("notification.warning"),
      icon: <img src={warningIcon} className="image me-1" />,
      meta: "",
      ...props
    }
    let toastId = 0
    const closeToast = () => {
      toast.dismiss(toastId)
    }
    toastId = toast(
      <ToastContent {...properties} closeToast={closeToast} />,
      properties.config
    )
  },
  showInfo: (props = {}) => {
    const properties = {
      type: "info",
      title: useFormatMessage("notification.info"),
      icon: <img src={infoIcon} className="image me-1" />,
      meta: "",
      ...props
    }
    let toastId = 0
    const closeToast = () => {
      toast.dismiss(toastId)
    }
    toastId = toast(
      <ToastContent {...properties} closeToast={closeToast} />,
      properties.config
    )
  }
}
export default notification
