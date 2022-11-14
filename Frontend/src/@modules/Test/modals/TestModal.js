import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { useEffect } from "react"
import {
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  NavLink,
  Row
} from "reactstrap"
import { testApi } from "../common/api"
const TestModal = (props) => {
  const { modal, handleModal, idTest, userType } = props
  const [state, setState] = useMergedState({
    loading: false,
    data: []
  })

  const loadData = () => {
    testApi.getTest({ active: 1 }).then((res) => {
      setState({ data: res.data.results })
    })
  }

  const renderTest = (arr) => {
    return arr.map((item, index) => {
      return (
        <Col key={`zzzz${index}`} sm={6} className="mt-1 ">
          <NavLink href={`/test/${userType}/${item.id}/${idTest}`}>
            <div className="title-disc w-auto">{item.title}</div>
          </NavLink>
        </Col>
      )
    })
  }
  useEffect(() => {
    loadData()
  }, [])
  return (
    <Modal
      isOpen={modal}
      toggle={() => handleModal("")}
      className="detail-candidate"
      backdrop={"static"}
      size="md"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => handleModal("")}>
        <span>{useFormatMessage("modules.test.text.choose_test")}</span>
      </ModalHeader>
      <ModalBody>
        <Row className="disc p-0">{renderTest(state.data)}</Row>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  )
}
export default TestModal
