// ** React Imports
import { useFormatMessage } from "@apps/utility/common";
import { Table } from "rsuite";
import { Link } from "react-router-dom";
// ** Styles
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "reactstrap";
import { Collapse } from "antd";
// ** Components
import Avatar from "@apps/modules/download/pages/Avatar";
import { EmptyContent } from "@apps/components/common/EmptyContent";

const { Panel } = Collapse;
const { Column, HeaderCell, Cell } = Table;
const ListEmployeeModal = (props) => {
  const {
    // ** props
    modal,
    listEmployeeAdd,
    listEmployeeRemove,
    // ** methods
    handleModal
  } = props;

  const totalEmployeeAdd = listEmployeeAdd.length;
  const totalEmployeeRemove = listEmployeeRemove.length;

  // ** render
  const EmployeeNameCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props} className="">
        <Link
          className="d-flex justify-content-left align-items-center text-dark"
          tag="div"
          to={`/employees/u/${rowData.username}`}
        >
          <Avatar className="my-0 me-50" size="sm" src={rowData.avatar} />
          <div className="d-flex flex-column">
            <p className="user-name text-truncate mb-0">
              <span className="font-weight-bold">{rowData.full_name}</span>{" "}<small>{rowData.email}</small>
            </p>
          </div>
        </Link>
      </Cell>
    );
  };

  const renderListEmployeeAdd = () => {
    return (
      <Collapse defaultActiveKey={["1"]}>
        <Panel
          header={`${totalEmployeeAdd} ${useFormatMessage("modules.time_off_policies.title.header_employee_add")}`}
          key="1"
        >
          <Table data={listEmployeeAdd} id="table">
            <Column flexGrow={1} align="center">
              <HeaderCell>
                {useFormatMessage(
                  "modules.time_off_policies.text.employee_name"
                )}
              </HeaderCell>
              <EmployeeNameCell />
            </Column>
          </Table>
        </Panel>
      </Collapse>
    );
  };

  const renderListEmployeeRemove = () => {
    return (
      <Collapse defaultActiveKey={["1"]}>
        <Panel
          header={`${totalEmployeeRemove} ${useFormatMessage("modules.time_off_policies.title.header_employee_remove")}`}
          key="1"
        >
          <Table data={listEmployeeRemove} id="table">
            <Column flexGrow={1} align="center">
              <HeaderCell>
                {useFormatMessage(
                  "modules.time_off_policies.text.employee_name"
                )}
              </HeaderCell>
              <EmployeeNameCell />
            </Column>
          </Table>
        </Panel>
      </Collapse>
    );
  }

  return (
    <Modal
      isOpen={modal}
      toggle={() => handleModal()}
      className="new-profile-modal"
      backdrop={"static"}
      modalTransition={{ timeout: 100 }}
      d={{ timeout: 100 }}
    >
      <ModalHeader toggle={() => handleModal()}>
        {useFormatMessage(
          "modules.time_off_policies.title.review_changes_modal"
        )}
      </ModalHeader>
      <ModalBody>
        {totalEmployeeAdd > 0 && renderListEmployeeAdd()}
        {totalEmployeeRemove > 0 && renderListEmployeeRemove()}
        {(totalEmployeeAdd === 0 && totalEmployeeRemove === 0) && (<EmptyContent className="mt-2"/>)}
      </ModalBody>
      <ModalFooter>
        <Button color="flat-danger" onClick={() => handleModal()}>
          {useFormatMessage("modules.time_off_policies.buttons.close")}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ListEmployeeModal;
