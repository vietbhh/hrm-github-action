// ** React Imports
import { useFormatMessage, formatDate } from "@apps/utility/common";
// ** Styles
// ** Components
import { Table } from "rsuite";
import HolidayAction from "./HolidayAction";

const { Column, HeaderCell, Cell } = Table;

const HolidayList = (props) => {
  const {
    // ** props
    data,
    // methods
    loadData,
    setHolidayData,
    toggleModal,
    setIsEditModal
  } = props;

  // ** render

  const DateCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props} className="">
        {rowData.from_date === rowData.to_date ? formatDate(rowData.from_date) : `${formatDate(rowData.from_date)} - ${formatDate(rowData.to_date)}`}
      </Cell>
    );
  };

  const ActionCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props} className="">
        <HolidayAction
          holiday={rowData}
          loadData={loadData}
          setHolidayData={setHolidayData}
          toggleModal={toggleModal}
          setIsEditModal={setIsEditModal}
        />
      </Cell>
    );
  };

  return (
    <Table data={data} id="table" autoHeight={true} className="holiday-table">
      <Column width={300} align="left" verticalAlign="middle">
        <HeaderCell>
          {useFormatMessage("modules.time_off_holidays.fields.name")}
        </HeaderCell>
        <Cell dataKey="name" />
      </Column>
      <Column width={250} align="left" verticalAlign="middle">
        <HeaderCell>
          {useFormatMessage("modules.time_off_holidays.title.date")}
        </HeaderCell>
        <DateCell />
      </Column>
      <Column width={100} align="left" verticalAlign="middle">
        <HeaderCell></HeaderCell>
        <ActionCell />
      </Column>
    </Table>
  );
};

export default HolidayList;
