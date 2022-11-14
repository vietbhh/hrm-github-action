import { forEach } from "lodash"
import { getOptionValue } from "@apps/utility/common"

const compareArrayOfObjects = (x, y) => {
  if (x === undefined || y === undefined) return true
  if (x.length === 0 && y.length > 0) return false
  let objectsAreSame = true
  for (const propertyName in x) {
    if (x[propertyName] !== y[propertyName]) {
      objectsAreSame = false
      break
    }
  }
  return objectsAreSame
}

const getDocumentShareContent = (document, options) => {
  let currentSharedWith = ""
  switch (parseInt(document?.share_type?.value)) {
    case getOptionValue(options, "share_type", "everyone"):
      currentSharedWith = "Everyone"
      break
    case getOptionValue(options, "share_type", "department"):
      document.department.map((item) => {
        currentSharedWith += item.label + ", "
      })
      currentSharedWith = currentSharedWith.slice(0, -2)
      break
    case getOptionValue(options, "share_type", "offices"):
      document.office.map((item) => {
        currentSharedWith += item.label + ", "
      })
      currentSharedWith = currentSharedWith.slice(0, -2)
      break
    case getOptionValue(options, "share_type", "employeegroups"):
      document.employee_groups.map((item) => {
        currentSharedWith += useFormatMessage(item.label) + ", "
      })
      currentSharedWith = currentSharedWith.slice(0, -2)
      break
    default:
      currentSharedWith = ""
      break
  }
  return currentSharedWith
}

const getDocumentMemoType = () => {
  return {
    "application/msword": (
      <i className="far fa-file-word ms-25" style={{ fontSize: "14px" }} />
    ),
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": (
      <i className="far fa-file-word ms-25" style={{ fontSize: "14px" }} />
    ),
    "application/vnd.openxmlformats-officedocument.wordprocessingml.documentapplication/vnd.openxmlformats-officedocument.wordprocessingml.document":
      <i className="far fa-file-word" style={{ fontSize: "14px" }} />,
    "application/vnd.ms-excel": (
      <i className="far fa-file-excel ms-25" style={{ fontSize: "14px" }} />
    ),
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetapplication/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      <i className="far fa-file-excel ms-25" style={{ fontSize: "14px" }} />,
    "application/vnd.ms-powerpoint": (
      <i className="far fa-file-powerpoint ms-25" style={{ fontSize: "14px" }} />
    ),
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": (
      <i className="far fa-file-excel ms-25" style={{ fontSize: "14px" }} />
    ),
    "application/pdf": (
      <i className="far fa-file-pdf ms-25" style={{ fontSize: "14px" }} />
    ),
    "text/plain": <i className="far fa-file-alt ms-25" style={{ fontSize: "14px" }} />,
    "image/jpeg": <i className="far fa-image ms-25" style={{ fontSize: "14px" }} />,
    "image/jpg": <i className="far fa-image ms-25" style={{ fontSize: "14px" }} />,
    "image/png": <i className="far fa-image ms-25" style={{ fontSize: "14px" }} />
  }
}

export {
  getOptionValue,
  compareArrayOfObjects,
  getDocumentShareContent,
  getDocumentMemoType
}
