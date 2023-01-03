import { ErpUserSelect } from "@apps/components/common/ErpField";
import { useMergedState } from "@apps/utility/common";
import { Button, ListGroup, ListGroupItem } from "reactstrap";
const { Fragment } = require("react");
import PerfectScrollbar from "react-perfect-scrollbar";
import { isEmpty, map, reverse, some } from "lodash";
import { useEffect } from "react";
import Avatar from "@apps/modules/download/pages/Avatar";
import { Trash } from "react-feather";
const PermitFormTabMembers = (props) => {
  const { selectUsers, updateUsers } = props;
  const [state, setState] = useMergedState({
    data: updateUsers || [],
    selected: {}
  });

  useEffect(() => {
    const userIds = map(state.data, (item) => item.value);
    selectUsers(userIds);
  }, [state.data]);

  const handleDeleteClick = (index) => {
    const currentData = [...state.data];
    currentData.splice(index, 1);
    setState({
      data: currentData
    });
  };

  return (
    <Fragment>
      <div className="row">
        <div className="col-sm-6">
          <ErpUserSelect
            name="member"
            id="member"
            url="/settings/users/load?"
            nolabel
            value={state.selected}
            onChange={(e) => {
              if (!some(state.data, e)) {
                setState({
                  data: [e, ...state.data]
                });
              }
            }}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <PerfectScrollbar
            style={{
              maxHeight: "400px",
              minHeight: "50px"
            }}
          >
            <ListGroup flush>
              {!isEmpty(state.data) &&
                map(state.data, (item, index) => (
                  <ListGroupItem key={index}>
                    <div className="d-flex flex-wrap align-items-center">
                      <Avatar
                        className="my-0 me-50"
                        size="sm"
                        src={item.icon}
                        userId={item.value}
                      />
                      <span className="fw-bold">{item.full_name}</span>{" "}
                      &nbsp;
                      <small className="text-truncate text-muted mb-0">
                        @{item.label}
                      </small>
                      <Button.Ripple
                        color="flat-danger"
                        size="sm"
                        className="ms-auto"
                        onClick={() => {
                          handleDeleteClick(index);
                        }}
                      >
                        <Trash size="14" />
                      </Button.Ripple>
                    </div>
                  </ListGroupItem>
                ))}
            </ListGroup>
          </PerfectScrollbar>
        </div>
      </div>
    </Fragment>
  );
};
export default PermitFormTabMembers;
