import React from "react"
import { Upload } from "react-feather"

const dataSearchConfig = [
  {
    title: "search.employees_import",
    action: "add",
    resource: "employees",
    icon: <Upload size={15} />,
    navLink: "/employees/import"
  }
]

export default dataSearchConfig
