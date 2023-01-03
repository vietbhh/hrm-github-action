import Photo from "@apps/modules/download/pages/Photo"
import { useFormatMessage } from "@apps/utility/common"
import { Table } from "antd"
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap"

const RecentInventories = (props) => {
  const { data, toggleModalDetail, showMoreHistory } = props

  const dataSource = [
    ..._.map(data, (value, index) => {
      return {
        key: index,
        asset_code: value.asset_code,
        asset_name: value.asset_name,
        recent_image: value.recent_image,
        current_status: value?.current_status?.label,
        notes: value.notes
      }
    })
  ]

  const columns = [
    {
      title: useFormatMessage(
        "modules.asset_inventories_detail.fields.asset_code"
      ),
      dataIndex: "asset_code",
      key: "asset_code",
      render: (item, record) => {
        return (
          <div className="d-flex justify-content-left align-items-center text-dark">
            <Photo
              src={!_.isEmpty(record.recent_image) && record.recent_image?.url}
              width="60px"
              height="60px"
              className="rounded"
            />

            <div className="d-flex flex-column ms-1">
              <p className=" text-truncate mb-0">
                <span className="font-weight-bold name-channel-table">
                  {record?.asset_code?.label}
                </span>
                <br />
                <span
                  style={{
                    color: "rgba(162, 160, 158, 0.7)",
                    fontSize: "12px"
                  }}>
                  {record.asset_name}
                </span>
              </p>
            </div>
          </div>
        )
      }
    },
    {
      title: useFormatMessage(
        "modules.asset_inventories_detail.fields.current_status"
      ),
      dataIndex: "current_status",
      key: "current_status"
    },
    {
      title: useFormatMessage("modules.asset_inventories_detail.fields.notes"),
      dataIndex: "notes",
      key: "notes"
    }
  ]

  return (
    <Card className="inventories">
      <CardHeader>
        <span className="title">
          {useFormatMessage("modules.asset.inventory.text.recent_inventory")}
        </span>
      </CardHeader>
      <CardBody>
        <Row>
          <Col sm="12">
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={false}
            />
          </Col>
          {showMoreHistory && (
            <Col sm="12" className="text-center mt-1">
              <Button
                type="button"
                color="primary"
                className="btn-tool"
                onClick={() => toggleModalDetail()}>
                {useFormatMessage("modules.asset.inventory.button.view_all")}
              </Button>
            </Col>
          )}
        </Row>
      </CardBody>
    </Card>
  )
}

export default RecentInventories
