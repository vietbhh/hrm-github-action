import { useFormatMessage } from "@apps/utility/common";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

const SwAlert = {
  show: (
    props = {
      title,
      icon,
      showCancelButton,
      confirmButtonText,
      cancelButtonText,
      customClass,
      buttonsStyling
    }
  ) => {
    return MySwal.fire(props);
  },
  showSuccess: (
    props = {
      title,
      icon,
      showCancelButton,
      confirmButtonText,
      cancelButtonText,
      customClass,
      buttonsStyling
    }
  ) => {
    const properties = {
      title: useFormatMessage("notification.success"),
      text: useFormatMessage("notification.default.success"),
      icon: "success",
      showConfirmButton: false,
      timer: 2000,
      ...props
    };
    return MySwal.fire(properties);
  },
  showError: (
    props = {
      title,
      icon,
      showCancelButton,
      confirmButtonText,
      cancelButtonText,
      customClass,
      buttonsStyling
    }
  ) => {
    const properties = {
      title: "Oops...",
      text: useFormatMessage("notification.default.error"),
      icon: "error",
      customClass: {
        confirmButton: "btn btn-primary"
      },
      buttonsStyling: false,
      ...props
    };
    return MySwal.fire(properties);
  },
  showWarning: (
    props = {
      title,
      icon,
      showCancelButton,
      confirmButtonText,
      cancelButtonText,
      customClass,
      buttonsStyling
    }
  ) => {
    const { customClass, ...rest } = props;
    const properties = {
      title: useFormatMessage("notification.confirm.title"),
      text: useFormatMessage("notification.confirm.text"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: useFormatMessage("button.confirm"),
      cancelButtonText: useFormatMessage("button.cancel"),
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-outline-danger ms-1",
        ...customClass
      },
      buttonsStyling: false,
      ...rest
    };
    return MySwal.fire(properties);
  },
  showInfo: (
    props = {
      title,
      icon,
      showCancelButton,
      confirmButtonText,
      cancelButtonText,
      customClass,
      buttonsStyling
    }
  ) => {
    const { customClass, ...rest } = props;
    const properties = {
      icon: "info",
      customClass: {
        confirmButton: "btn btn-primary",
        ...customClass
      },
      buttonsStyling: false,
      ...rest
    };
    return MySwal.fire(properties);
  }
};
export default SwAlert;
