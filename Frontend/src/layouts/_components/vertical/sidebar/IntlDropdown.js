// ** Third Party Components
import ReactCountryFlag from "react-country-flag"
import { useTranslation } from "react-i18next"

// ** Reactstrap Imports
import { useDispatch } from "react-redux"
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from "reactstrap"
import { handleLanguage } from "@store/layout"
const IntlDropdown = () => {
  // ** Hooks
  const { i18n } = useTranslation()

  // ** Vars
  const langObj = {
    en: "English",
    vn: "Tiếng Việt"
  }

  const dispatch = useDispatch()

  // ** Function to switch Language
  const handleLangUpdate = (e, lang) => {
    e.preventDefault()
    i18n.changeLanguage(lang)
    dispatch(handleLanguage(lang))
  }
  //handleLanguage
  return (
    <UncontrolledDropdown
      href="/"
      tag="div"
      className="dropdown-language nav-item">
      <DropdownToggle
        href="/"
        tag="a"
        className="nav-link"
        onClick={(e) => e.preventDefault()}>
        <ReactCountryFlag
          svg
          className="country-flag flag-icon"
          countryCode={i18n.language === "en" ? "us" : i18n.language}
        />{" "}
        <span className="selected-language">{langObj[i18n.language]}</span>
      </DropdownToggle>
      <DropdownMenu className="mt-0" end>
        <DropdownItem
          href="/"
          tag="a"
          onClick={(e) => handleLangUpdate(e, "en")}>
          <ReactCountryFlag className="country-flag" countryCode="us" svg />
          <span className="ms-1">English</span>
        </DropdownItem>
        <DropdownItem
          href="/"
          tag="a"
          onClick={(e) => handleLangUpdate(e, "vn")}>
          <ReactCountryFlag className="country-flag" countryCode="vn" svg />
          <span className="ms-1">Tiếng Việt</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default IntlDropdown
