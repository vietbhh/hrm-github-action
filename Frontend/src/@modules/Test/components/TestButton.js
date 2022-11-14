import { useFormatMessage, useMergedState } from "@apps/utility/common"
import TestModal from "../modals/TestModal"
const TestButton = (props) => {
  const { number, questions, idTest } = props
  const [state, setState] = useMergedState({
    readOnly: true,
    saving: false,
    loading: false,
    modal: false,
    dataReviews: []
  })

  const handleModal = () => {
    setState({ modal: !state.modal })
  }
  return (
    <>
      <button
        type="button"
        className="btn btn-primary btn-sm"
        onClick={() => handleModal()}
        href="##">
        {useFormatMessage("modules.test.buttons.make_test")}
      </button>
      <TestModal
        modal={state.modal}
        handleModal={handleModal}
        idTest={idTest}
        userType={"candidates"}
      />
    </>
  )
}

export default TestButton
