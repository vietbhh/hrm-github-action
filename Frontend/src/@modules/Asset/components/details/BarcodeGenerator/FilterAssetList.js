// ** React Imports
import { Fragment, useRef } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Row, Col } from "reactstrap"
// ** Components
import { ErpInput, ErpUserSelect } from "@apps/components/common/ErpField"
import { FieldHandle } from "@apps/utility/FieldHandler"

const FilterAssetList = (props) => {
  const {
    // ** props
    moduleNameAssetList,
    metasAssetList,
    moduleNameAssetType,
    metasAssetType,
    optionModules,
    // ** methods
    setFilter
  } = props

  const handleChangeFilter = (key, value) => {
    const newValue = value === undefined ? 0 : value
    setFilter(key, newValue)
  }

  const debounceSearch = useRef(
    _.debounce((nextValue) => {
      handleChangeFilter("text", nextValue)
    }, import.meta.env.VITE_APP_DEBOUNCE_INPUT_DELAY)
  ).current

  const handleSearchVal = (e) => {
    const value = e.target.value
    debounceSearch(value.toLowerCase())
  }

  // ** render
  return (
    <Fragment>
      <Row>
        <Col sm={12}>
          <h5 className="ms-25 mb-2">
            {useFormatMessage(
              "modules.asset.asset_code_generator.title.filter"
            )}
          </h5>
        </Col>
      </Row>
      <Row>
        <Col sm={4}>
          <ErpInput
            prepend={<i className="far fa-search" />}
            placeholder={useFormatMessage(
              "modules.asset.asset_code_generator.text.search_asset_name_or_code"
            )}
            nolabel={true}
            onChange={(e) => handleSearchVal(e)}
          />
        </Col>
        <Col sm={2}>
          <FieldHandle
            module={moduleNameAssetType}
            fieldData={metasAssetType.asset_type_group}
            optionModules={optionModules}
            nolabel={true}
            onChange={(value) =>
              handleChangeFilter("asset_type_group", value?.value)
            }
          />
        </Col>
        <Col sm={2}>
          <FieldHandle
            module={moduleNameAssetList}
            fieldData={metasAssetList.asset_type}
            optionModules={optionModules}
            nolabel={true}
            onChange={(value) => handleChangeFilter("asset_type", value?.value)}
          />
        </Col>
        <Col sm={2}>
          <FieldHandle
            module={moduleNameAssetList}
            fieldData={metasAssetList.asset_status}
            optionModules={optionModules}
            nolabel={true}
            onChange={(value) =>
              handleChangeFilter("asset_status", value?.value)
            }
          />
        </Col>
        <Col sm={2}>
          <ErpUserSelect
            name="owner"
            id="owner"
            nolabel={true}
            isClearable={true}
            onChange={(e) => handleChangeFilter("owner", e?.value)}
          />
        </Col>
      </Row>
    </Fragment>
  )
}

export default FilterAssetList
