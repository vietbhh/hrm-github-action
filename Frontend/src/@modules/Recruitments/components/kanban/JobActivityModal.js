import {
  stringInject,
  timeDifference,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common";
import { recruitmentsApi } from "@modules/Recruitments/common/api";
import "@styles/react/libs/editor/editor.scss";
import { forEach } from "lodash";
import { Fragment, useEffect } from "react";
import ReactHtmlParser from "react-html-parser";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
const JobActivityModal = (props) => {
  const { modal, toggleModal, onClosed, modalProps, recruitmentId } = props;

  const [state, setState] = useMergedState({
    data: [],
    page: 1,
    hasMore: false
  });

  const loadData = () => {
    recruitmentsApi.getActivity(recruitmentId, state.page).then((res) => {
      setState({
        data: [...state.data, ...res.data.data],
        hasMore: res.data.hasMore
      });
    });
  };

  useEffect(() => {
    if (modal) loadData();
  }, [modal, state.page]);

  return (
    <Fragment>
      <Modal
        scrollable
        isOpen={modal}
        onClosed={() => {
          setState({
            data: [],
            page: 1,
            hasMore: false
          });
          onClosed();
        }}
        toggle={toggleModal}
        className="sidebar-lg jobActivity"
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}
        modalClassName="modal-slide-in"
        {...modalProps}
      >
        <ModalHeader toggle={() => toggleModal()}>
          {useFormatMessage("modules.recruitments.activity.title")}
        </ModalHeader>
        <ModalBody>
          <PerfectScrollbar>
            {state.data.map((item, index) => {
              const objectReplace = {};
              forEach(item.activity.match(/({([^}]+)})/g), (item) => {
                const itemName = item.replace(/^{|}$/g, "");
                objectReplace[itemName] = useFormatMessage(itemName);
              });
              const activityLog = stringInject(item.activity, objectReplace);
              return (
                <Fragment key={index}>
                  <div className="activityItem">
                    {ReactHtmlParser(activityLog)}
                    <p className="text-right text-muted">
                      {timeDifference(item.created_at)}
                    </p>
                  </div>
                </Fragment>
              );
            })}
            {state.hasMore && (
              <p className="text-center">
                <Button.Ripple
                  color="flat-primary"
                  onClick={() => {
                    setState({
                      page: state.page + 1
                    });
                  }}
                >
                  Load more
                </Button.Ripple>
              </p>
            )}
          </PerfectScrollbar>
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

JobActivityModal.defaultProps = {
  modal: false,
  toggleModal: () => {},
  onClosed: () => {},
  modalProps: {}
};

export default JobActivityModal;
