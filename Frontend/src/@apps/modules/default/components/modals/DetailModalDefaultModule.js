const { useMergedState, useFormatMessage } = require("@apps/utility/common")
const { defaultModuleApi } = require("@apps/utility/moduleApi")
import AppSpinner from "@apps/components/spinner/AppSpinner"
import { Fragment, useEffect } from "react"
import { NavLink } from "react-router-dom"
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
import DetailTableDefaultModule from "../detail/DetailTableDefaultModule"

const DetailModalDefaultModule = (props) => {
  const { id, module, modal, handleModal, metas } = props
  const [state, setState] = useMergedState({
    loading: false,
    data: []
  })

  useEffect(() => {
    if (id && modal) {
      setState({
        loading: true
      })
      defaultModuleApi.getDetail(module.name, id).then((res) => {
        setState({
          data: res.data.data,
          loading: false
        })
      })
    }
  }, [id, module])

  if (state.loading) {
    return <AppSpinner type="grow" />
  }

  return (
    <Fragment>
      <Modal isOpen={modal} toggle={() => handleModal()} className="modal-lg">
        <ModalHeader toggle={() => handleModal()}>
          {useFormatMessage("app.detail")}
        </ModalHeader>
        <ModalBody>
          <DetailTableDefaultModule
            data={state.data}
            fields={metas}
            module={module}
          />
        </ModalBody>
        <ModalFooter>
          <Button.Ripple
            to={`/${module.name}/detail/${id}`}
            tag={NavLink}
            color="primary"
            outline>
            <span className="align-middle ms-50">
              {useFormatMessage("button.viewMore")}
            </span>
          </Button.Ripple>
          <Button color="flat-danger" onClick={() => handleModal()}>
            {useFormatMessage("button.close")}
          </Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  )
}

export default DetailModalDefaultModule
