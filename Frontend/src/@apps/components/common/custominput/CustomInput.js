import classNames from "classnames"
import PropTypes from "prop-types"
import { Whisper } from "rsuite"
import CustomFileInput from "./CustomFileInput"
import { mapToCssModules } from "./utils"

const propTypes = {
  className: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  type: PropTypes.string.isRequired,
  label: PropTypes.node,
  labelNote: PropTypes.node,
  inline: PropTypes.bool,
  required: PropTypes.bool,
  valid: PropTypes.bool,
  invalid: PropTypes.bool,
  bsSize: PropTypes.string,
  htmlFor: PropTypes.string,
  cssModule: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.array,
    PropTypes.func
  ]),
  innerRef: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.func
  ])
}

function CustomInput(props) {
  const {
    className,
    label,
    inline,
    valid,
    invalid,
    cssModule,
    children,
    bsSize,
    innerRef,
    htmlFor,
    required,
    labelNote,
    ...attributes
  } = props

  const type = attributes.type

  const customClass = mapToCssModules(
    classNames(
      className,
      `custom-${type}`,
      bsSize ? `custom-${type}-${bsSize}` : false
    ),
    cssModule
  )

  const validationClassNames = mapToCssModules(
    classNames(invalid && "is-invalid", valid && "is-valid"),
    cssModule
  )

  const labelHtmlFor = htmlFor || attributes.id

  if (type === "select") {
    const { type, ...rest } = attributes
    return (
      <select
        {...rest}
        ref={innerRef}
        className={classNames(validationClassNames, customClass)}
        aria-invalid={invalid}>
        {children}
      </select>
    )
  }

  if (type === "file") {
    return <CustomFileInput {...props} />
  }

  if (type !== "checkbox" && type !== "radio" && type !== "switch") {
    return (
      <input
        {...attributes}
        ref={innerRef}
        aria-invalid={invalid}
        className={classNames(validationClassNames, customClass)}
      />
    )
  }

  const wrapperClasses = classNames(
    customClass,
    mapToCssModules(
      classNames("custom-control", { "custom-control-inline": inline }),
      cssModule
    )
  )

  const { hidden, ...rest } = attributes
  return (
    <div className={wrapperClasses} hidden={hidden || false}>
      <input
        {...rest}
        type={type === "switch" ? "checkbox" : type}
        ref={innerRef}
        aria-invalid={invalid}
        required={required}
        className={classNames(
          validationClassNames,
          mapToCssModules("form-check-input", cssModule)
        )}
      />
      <label
        className={mapToCssModules("custom-control-label", cssModule)}
        htmlFor={labelHtmlFor}>
        {label} {required && "*"}
      </label>{" "}
      {labelNote && (
        <Whisper
          trigger="click"
          followCursor
          placement="auto"
          speaker={<Tooltip>{labelNote}</Tooltip>}>
          <i className="fa-regular fa-circle-info ms-25 icon-input-information text-muted"></i>
        </Whisper>
      )}
      {children}
    </div>
  )
}

CustomInput.propTypes = propTypes

export default CustomInput
