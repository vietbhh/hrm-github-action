// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { Fragment, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
// ** Styles
// ** Components
import { Col, Row } from "reactstrap"
import { ErpInput } from "@apps/components/common/ErpField"
import { FieldHandle } from "@apps/utility/FieldHandler"

const CVInfoForm = (props) => {
  const {
    // ** props
    listCVUpload,
    listCVInvalid,
    currentCVContent,
    currentCVIndex,
    listEmployeeEmail,
    metas,
    moduleName,
    // ** methods
    setCurrentCVContent,
    setState,
    changeJob,
    jobUpdate
  } = props

  const methods = useForm()
  const { setError, clearErrors, reset, watch } = methods

  const handleChangeCommonField = (value, index, listCVCurrent) => {
    const newListCVUpload = { ...listCVCurrent }
    let newCurrentCVIndex = { ...newListCVUpload[index] }
    const newCurrentCVContent = {
      ...newCurrentCVIndex,
      recruitment_proposal: value.recruitment_proposal,
      name: value.name,
      phone: value.phone,
      email: value.email
    }
    setCurrentCVContent(newCurrentCVContent)

    newCurrentCVIndex = {
      ...newCurrentCVIndex,
      recruitment_proposal: value.recruitment_proposal,
      name: value.name,
      phone: value.phone,
      email: value.email
    }
    newListCVUpload[index] = newCurrentCVIndex

    setState({
      listCVUpload: newListCVUpload
    })
  }
  const handleChangeJob = (value, index, listCVCurrent) => {
    const newListCVUpload = { ...listCVCurrent }
    let newCurrentCVIndex = { ...newListCVUpload[index] }
    const newCurrentCVContent = {
      ...newCurrentCVIndex,
      recruitment_proposal: value.recruitment_proposal,
      name: value.name,
      phone: value.phone,
      email: value.email
    }
    setCurrentCVContent(newCurrentCVContent)

    newCurrentCVIndex = {
      ...newCurrentCVIndex,
      recruitment_proposal: value.recruitment_proposal,
      name: value.name,
      phone: value.phone,
      email: value.email
    }
    newListCVUpload[index] = newCurrentCVIndex

    const arrIdJob = []
    _.map(newListCVUpload, (item, index) => {
      if (!arrIdJob.includes(item.recruitment_proposal?.value)) {
        arrIdJob.push(item.recruitment_proposal?.value)
      }
    })
    changeJob(arrIdJob)
    setState({
      listCVUpload: newListCVUpload
    })
  }
  // ** effect
  useEffect(() => {
    reset(currentCVContent)
  }, [currentCVContent])
  useEffect(() => {
    if (
      _.some(
        listCVInvalid,
        (itemInvalid) =>
          parseInt(itemInvalid.key) === parseInt(currentCVContent.key)
      )
    ) {
      const [currentInvalid] = _.filter(listCVInvalid, (itemInvalid) => {
        return parseInt(itemInvalid.key) === parseInt(currentCVContent.key)
      })

      if (currentInvalid["name"] !== undefined) {
        setError("name", {
          type: "custom",
          message: useFormatMessage(
            `modules.candidates.text.${currentInvalid["name"]}`
          )
        })
      } else {
        clearErrors("name")
      }

      if (currentInvalid["phone"] !== undefined) {
        setError("phone", {
          type: "custom",
          message: useFormatMessage(
            `modules.candidates.text.${currentInvalid["phone"]}`
          )
        })
      } else {
        clearErrors("phone")
      }

      if (currentInvalid["email"] !== undefined) {
        setError("email", {
          type: "custom",
          message: useFormatMessage(
            `modules.candidates.text.${currentInvalid["email"]}`
          )
        })
      } else {
        clearErrors("email")
      }
    } else {
      clearErrors("name")
      clearErrors("email")
      clearErrors("phone")
    }
  }, [currentCVContent, listCVInvalid])

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === "recruitment_proposal") {
        handleChangeJob(value, currentCVIndex, listCVUpload)
      }
      if (type === "change" && name !== "recruitment_proposal") {
        handleChangeCommonField(value, currentCVIndex, listCVUpload)
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, currentCVIndex, listCVUpload])

  // ** render
  return (
    <Fragment>
      <div className="mb-3">
        <h4 className="mb-2">
          <span className="title-icon">
            <i className="far fa-book"></i>
          </span>
          {useFormatMessage("modules.recruitments.title.basic_information")}
        </h4>
        <div>
          <Row>
            <Col sm={12}>
              <FieldHandle
                module={moduleName}
                fieldData={{
                  ...metas.recruitment_proposal
                }}
                isClearable={false}
                useForm={methods}
                readOnly={jobUpdate && true}
                required
              />
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <ErpInput
                type="text"
                name="name"
                label={useFormatMessage(
                  "modules.recruitments.text.cv_info_form.name"
                )}
                useForm={methods}
                required
              />
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <ErpInput
                type="text"
                name="phone"
                label={useFormatMessage(
                  "modules.recruitments.text.cv_info_form.phone_number"
                )}
                useForm={methods}
                required
              />
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <ErpInput
                type="text"
                name="email"
                label={useFormatMessage(
                  "modules.recruitments.text.cv_info_form.email"
                )}
                useForm={methods}
                required
              />
            </Col>
          </Row>
        </div>
      </div>
      <div>
        <h4 className="mb-2">
          <span className="title-icon">
            <i className="fal fa-envelope-open-text"></i>
          </span>
          {useFormatMessage("modules.recruitments.title.cover_letter")}
        </h4>
        <Row>
          <Col sm={12}>
            <ErpInput
              type="textarea"
              name="cover_letter"
              nolabel={true}
              rows="8"
              onChange={(e) =>
                handleChangeCVInfo("cover_letter", e.target.value)
              }
              useForm={methods}
            />
          </Col>
        </Row>
      </div>
    </Fragment>
  )
}

export default CVInfoForm
