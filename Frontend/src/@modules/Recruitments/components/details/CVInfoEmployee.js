// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { useEffect, useState } from "react"
import { defaultModuleApi } from "@apps/utility/moduleApi"
// ** Styles
import { Tag } from "antd"
// ** Components
import AvatarBox from "@modules/Employees/components/detail/AvatarBox"
import PopoverSelectSource from "./PopoverSelectSource"
import noAvatar from "@src/assets/images/erp/noavt.png"

const CVInfoEmployee = (props) => {
  const {
    // ** props
    listCVUpload,
    currentCVContent,
    currentCVIndex,
    // ** methods
    setCurrentCVContent,
    setState
  } = props

  const [loading, setLoading] = useState(false)
  const [sourceOption, setSourceOption] = useState([])

  const loadSourceOption = () => {
    setLoading(true)
    defaultModuleApi.getList("sources").then((res) => {
      const newOptions = res.data.results.map((item) => {
        return { value: item.id, label: item.name }
      })
      setSourceOption(newOptions)
      setLoading(false)
    })
  }

  const handleChangeAvatar = (img) => {
    setCurrentCVContent({
      ...currentCVContent,
      img: img
    })

    const newListCVUpload = { ...listCVUpload }
    newListCVUpload[currentCVIndex] = {
      ...newListCVUpload[currentCVIndex],
      img: img
    }
    setState({
      listCVUpload: newListCVUpload
    })
  }

  // ** effect
  useEffect(() => {
    loadSourceOption()
  }, [])

  // ** render
  const renderPopoverSelectSource = () => {
    return (
      <PopoverSelectSource
        sourceOption={sourceOption}
        listCVUpload={listCVUpload}
        currentCVContent={currentCVContent}
        currentCVIndex={currentCVIndex}
        setCurrentCVContent={setCurrentCVContent}
        setState={setState}
      />
    )
  }

  const renderSource = () => {
    return (
      <div className="d-flex align-items-center">
        <p className="mb-0">
          {useFormatMessage("modules.recruitments.text.source")}
        </p>
        <div>{renderPopoverSelectSource()}</div>
      </div>
    )
  }

  const renderChosenSource = () => {
    return (
      <div>
        {currentCVContent.source.map((item) => {
          return (
            <Tag color="warning" key={`chosen-source-${item.value}`}>
              {item.label}
            </Tag>
          )
        })}
      </div>
    )
  }

  const renderComponent = () => {
    return (
      <div className="d-flex mb-4">
        <div className="me-2">
          <AvatarBox
            currentAvatar={
              currentCVContent.img === "" ? noAvatar : currentCVContent.img
            }
            isDirect={true}
            handleSave={(img) => handleChangeAvatar(img)}
          />
        </div>
        <div>
          <h5>{currentCVContent.name}</h5>
          <p>
            <Tag color="success">
              {useFormatMessage("modules.recruitments.text.applied")}
            </Tag>
          </p>
          <div className="mb-1">{renderSource()}</div>
          <div>{renderChosenSource()}</div>
        </div>
      </div>
    )
  }

  return !loading && renderComponent()
}

export default CVInfoEmployee
