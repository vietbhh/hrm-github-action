import { ErpSelect } from "@apps/components/common/ErpField"
import "@scss/friday/authentication.scss"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { useSkin } from "utility/hooks/useSkin"
import Logo from "../download/pages/Logo"
import { useTranslation } from "react-i18next"

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

  return (
    <div className="auth-header">
      <Link className="brand-logo" to="/" onClick={(e) => e.preventDefault()}>
        <Logo src={logo} className="logo" />
      </Link>
      <div className="div-select">
        <ErpSelect
          className="select"
          options={options}
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
