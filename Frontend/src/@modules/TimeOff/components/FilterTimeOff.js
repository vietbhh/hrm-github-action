import { useFormatMessage } from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import { isEmpty } from "lodash"
import moment from "moment"

const FilterTimeOff = (props) => {
  const {
    metas,
    moduleName,
    options,
    setFilter,
    type,
    datefrom_default,
    dateto_default,
    requestType
  } = props

  const formatOptionLabel = (params) => {
    const { label, name_option } = params
    return (
      <>
        <div className={`select-status select-status-${name_option}`}></div>
        <span>{useFormatMessage(`${label}`)}</span>
      </>
    )
  }

  const dateTimeToYMD = (date) => {
    if (!isEmpty(date)) return new Date(date).toLocaleDateString("en-CA")
    return ""
  }

  return (
    <div className="d-flex flex-wrap w-100">
      <div className="filter-dropdown department-filter">
        <FieldHandle
          onChange={(e) => {
            setFilter({
              filter_type: e?.value || ""
            })
          }}
          module={moduleName}
          fieldData={{
            ...metas.type,
            field_form_require: false
          }}
          options={options}
          defaultValue={null}
          nolabel
        />
      </div>

      {type !== "balance" && (
        <div className="filter-dropdown department-filter">
          <FieldHandle
            onChange={(e) => {
              setFilter({
                filter_status: e?.value || ""
              })
            }}
            module={moduleName}
            fieldData={{
              ...metas.status,
              field_form_require: false
            }}
            options={options}
            defaultValue={
              requestType === "approval"
                ? options["status"].filter(
                    (item) => item.name_option === "pending"
                  )[0]
                : null
            }
            nolabel
            formatOptionLabel={formatOptionLabel}
          />
        </div>
      )}

      <div className="filter-dropdown department-filter">
        <FieldHandle
          onChange={(e) => {
            setFilter({
              filter_datefrom: dateTimeToYMD(e)
            })
          }}
          module={moduleName}
          fieldData={{
            ...metas.date_from,
            field_form_require: false
          }}
          defaultValue={moment(datefrom_default).format("YYYY-MM-DD")}
          nolabel
        />
      </div>

      <div className="filter-dropdown department-filter">
        <FieldHandle
          onChange={(e) => {
            setFilter({
              filter_dateto: dateTimeToYMD(e)
            })
          }}
          module={moduleName}
          fieldData={{
            ...metas.date_to,
            field_form_require: false
          }}
          defaultValue={moment(dateto_default).format("YYYY-MM-DD")}
          nolabel
        />
      </div>
    </div>
  )
}

export default FilterTimeOff
