export const getNavMenu = (url) => {
  return [
    {
      id: "general",
      title: "general",
      icon: "fas fa-user",
      navLink: `/${url}/general`
    },
    {
      id: "address",
      title: "address",
      icon: "icpega Filled-Home",
      navLink: `/${url}/address`
    },
    {
      id: "bank",
      title: "bank",
      icon: "icpega Card",
      navLink: `/${url}/bank`
    },
    {
      id: "social",
      title: "social",
      icon: "fas fa-share-alt",
      navLink: `/${url}/social`
    },
    {
      id: "job",
      title: "job",
      icon: "icpega Briefcase-Portfolio",
      navLink: `/${url}/job`
    },
    {
      id: "offboarding",
      title: "offboarding",
      icon: "iconly-Document icli",
      navLink: `/${url}/offboarding`
    },
    {
      id: "payroll",
      title: "payroll",
      icon: "fal fa-usd-circle",
      navLink: `/${url}/payroll`
    },
    {
      id: "other",
      title: "other",
      icon: "icpega More",
      navLink: `/${url}/other`
    }
  ]
}

export const getNavMenuContract = (url) => {
  return [
    {
      id: "contract",
      title: "contract",
      tab: "contract",
      icon: "icpega Briefcase-Portfolio",
      navLink: `/${url}/contract`
    }
  ]
}

export const getNavMenuEmployeeType = (url) => {
  return [
    {
      id: "employee_type",
      title: "employee_type",
      tab: "employee-type",
      icon: "icpega Briefcase-Portfolio",
      navLink: `/${url}/employee-type`
    }
  ]
}

export const getNavMenuAutoGenerateCode = (url) => {
  return [
    {
      id: "employee_code",
      title: "employee_code",
      tab: "employee-code",
      icon: "far fa-server",
      navLink: `/${url}/employee-code`
    },
    {
      id: "contract_code",
      title: "contract_code",
      tab: "contract-code",
      icon: "far fa-server",
      navLink: `/${url}/contract-code`
    }
  ]
}

export const getTypeOption = () => {
  return [
    {
      value: "single_line_text",
      label: "single_line_text",
      icon: "fas fa-text-size"
    },
    {
      value: "multi_line_text",
      label: "multi_line_text",
      icon: "fas fa-align-left"
    },
    {
      value: "dropdown",
      label: "dropdown",
      icon: "far fa-clipboard"
    },
    {
      value: "multiple_selection",
      label: "multiple_selection",
      icon: "far fa-clipboard-list-check"
    },
    {
      value: "number",
      label: "number",
      icon: "fas fa-calculator-alt"
    },
    {
      value: "yes_no",
      label: "yes_no",
      icon: "fas fa-repeat-1"
    },
    {
      value: "date",
      label: "date",
      icon: "far fa-calendar-edit"
    }
  ]
}

export const addLeadingZeros = (num, totalLength) => {
  if (num < 0) {
    const withoutMinus = String(num).slice(1)
    return "-" + withoutMinus.padStart(totalLength, "0")
  }

  return String(num).padStart(totalLength, "0")
}
