// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import "@styles/react/libs/react-select/_react-select.scss"
import classnames from "classnames"
import { X } from "react-feather"
import PerfectScrollbar from "react-perfect-scrollbar"
// ** Reactstrap Imports
import { Button, Input, Label } from "reactstrap"
import IntlDropdown from "../IntlDropdown"
const Customizer = (props) => {
  // ** Props
  const {
    skin,
    layout,
    setSkin,
    isHidden,
    setLayout,
    navbarType,
    footerType,
    navbarColor,
    setIsHidden,
    menuCollapsed,
    setLastLayout,
    setNavbarType,
    setFooterType,
    setNavbarColor,
    setMenuCollapsed,
    toogleCustomizer,
    customizer
  } = props

  // ** Render Layout Skin Options
  const renderSkinsRadio = () => {
    const skinsArr = [
      {
        name: "light",
        label: "light",
        checked: skin === "light"
      },
      {
        name: "bordered",
        label: "bordered",
        checked: skin === "bordered"
      },
      {
        name: "dark",
        label: "dark",
        checked: skin === "dark"
      },
      {
        name: "semi-dark",
        label: "semidark",
        checked: skin === "semi-dark"
      }
    ]

    return skinsArr.map((radio, index) => {
      const marginCondition = index !== skinsArr.length - 1

      if (layout === "horizontal" && radio.name === "semi-dark") {
        return null
      }

      return (
        <div
          key={index}
          className={classnames("form-check", {
            "mb-2 me-1": marginCondition
          })}>
          <Input
            type="radio"
            id={radio.name}
            checked={radio.checked}
            onChange={() => setSkin(radio.name)}
          />
          <Label className="form-check-label" for={radio.name}>
            {useFormatMessage(`themeCustomizer.themeMode.${radio.label}`)}
          </Label>
        </div>
      )
    })
  }

  // ** Render Navbar Colors Options
  const renderNavbarColors = () => {
    const colorsArr = [
      "white",
      "primary",
      "secondary",
      "success",
      "danger",
      "info",
      "warning",
      "dark"
    ]

    return colorsArr.map((color) => (
      <li
        key={color}
        className={classnames(`color-box bg-${color}`, {
          selected: navbarColor === color,
          border: color === "white"
        })}
        onClick={() => setNavbarColor(color)}></li>
    ))
  }

  // ** Render Navbar Type Options
  const renderNavbarTypeRadio = () => {
    const navbarTypeArr = [
      {
        name: "floating",
        label: "Floating",
        checked: navbarType === "floating"
      },
      {
        name: "sticky",
        label: "Sticky",
        checked: navbarType === "sticky"
      },
      {
        name: "static",
        label: "Static",
        checked: navbarType === "static"
      },
      {
        name: "hidden",
        label: "Hidden",
        checked: navbarType === "hidden"
      }
    ]

    return navbarTypeArr.map((radio, index) => {
      const marginCondition = index !== navbarTypeArr.length - 1

      if (layout === "horizontal" && radio.name === "hidden") {
        return null
      }

      return (
        <div
          key={index}
          className={classnames("form-check", {
            "mb-2 me-1": marginCondition
          })}>
          <Input
            type="radio"
            id={radio.name}
            checked={radio.checked}
            onChange={() => setNavbarType(radio.name)}
          />
          <Label className="form-check-label" for={radio.name}>
            {useFormatMessage(`common.${radio.name}`)}
          </Label>
        </div>
      )
    })
  }

  // ** Render Footer Type Options
  const renderFooterTypeRadio = () => {
    const footerTypeArr = [
      {
        name: "sticky",
        label: "Sticky",
        checked: footerType === "sticky"
      },
      {
        name: "static",
        label: "Static",
        checked: footerType === "static"
      },
      {
        name: "hidden",
        label: "Hidden",
        checked: footerType === "hidden"
      }
    ]

    return footerTypeArr.map((radio, index) => {
      const marginCondition = index !== footerTypeArr.length - 1

      return (
        <div
          key={index}
          className={classnames("form-check", {
            "mb-2 me-1": marginCondition
          })}>
          <Input
            type="radio"
            checked={radio.checked}
            id={`footer-${radio.name}`}
            onChange={() => setFooterType(radio.name)}
          />
          <Label className="form-check-label" for={`footer-${radio.name}`}>
            {useFormatMessage(`common.${radio.name}`)}
          </Label>
        </div>
      )
    })
  }

  return (
    <div
      className={classnames("customizer", {
        open: customizer
      })}>
      <PerfectScrollbar
        className="customizer-content"
        options={{ wheelPropagation: false }}>
        <div className="customizer-header px-2 pt-1 pb-0 position-relative">
          <h4 className="mb-0">{useFormatMessage("themeCustomizer.title")}</h4>
          <p className="m-0">{useFormatMessage("themeCustomizer.subtitle")}</p>
          <Button
            className="customizer-close btn-icon"
            onClick={toogleCustomizer}
            color="flat-secondary"
            outline>
            <X />
          </Button>
        </div>
        <hr />
        <div className="px-2">
          <div className="d-flex align-items-baseline justify-content-between">
            <p className="fw-bold">
              {useFormatMessage("themeCustomizer.language")}
            </p>
            <IntlDropdown />
          </div>
        </div>

        <hr />

        <div className="px-2">
          <div>
            <p className="fw-bold">
              {useFormatMessage("themeCustomizer.themeMode.title")}
            </p>
            <div className="d-flex">{renderSkinsRadio()}</div>
          </div>
        </div>

        {/* <hr />

        <div className="px-2">
          <div className="mb-2">
            <p className="fw-bold">
              {layout === "horizontal" ? "Menu" : "Navbar"} Type
            </p>
            <div className="d-flex">{renderNavbarTypeRadio()}</div>
          </div>
        </div>

        <hr />

        <div className="px-2">
          <div className="mb-2">
            <p className="fw-bold">
              {useFormatMessage("themeCustomizer.footer")}
            </p>
            <div className="d-flex">{renderFooterTypeRadio()}</div>
          </div>
        </div> */}
      </PerfectScrollbar>
    </div>
  )
}

export default Customizer
