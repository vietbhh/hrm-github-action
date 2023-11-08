import { ErpSelect } from "@apps/components/common/ErpField"
import "@scss/friday/authentication.scss"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { useSkin } from "utility/hooks/useSkin"
import Logo from "../download/pages/Logo"
import { useTranslation } from "react-i18next"
import { components } from "react-select"

const Header = () => {
  const { i18n } = useTranslation()
  const language = i18n.language
  const { skin } = useSkin()
  const logo = useSelector((state) => state.layout.logo_default)

  const options = [
    { value: "en", label: "English (US)" },
    { value: "vn", label: "Việt Nam" }
  ]

  const index = options.findIndex((item) => language === item.value)
  const defaultValue = !_.isUndefined(options[index])
    ? options[index]
    : options[0]

  const handleLanguage = (value) => {
    i18n.changeLanguage(value)
  }

  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none">
          <path
            d="M19.92 8.94922L13.4 15.4692C12.63 16.2392 11.37 16.2392 10.6 15.4692L4.08002 8.94922"
            stroke="#696760"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </components.DropdownIndicator>
    )
  }

  return (
    <div className="auth-header">
      <Link className="brand-logo" to="/" onClick={(e) => e.preventDefault()}>
        <Logo src={logo} className="logo" />
      </Link>
      <div className="div-select">
        <ErpSelect
          className="select"
          options={options}
          components={{ DropdownIndicator }}
          defaultValue={defaultValue}
          isClearable={false}
          nolabel
          onChange={(e) => handleLanguage(e.value)}
        />
      </div>
    </div>
  )
}

export default Header
