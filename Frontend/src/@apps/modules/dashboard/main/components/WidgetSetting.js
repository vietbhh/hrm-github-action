import React, { useContext, useState } from 'react';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import closeButton from "../../assets/images/close-circle.svg"
import { Col, Row } from 'antd';
import { AbilityContext } from "utility/context/Can"

function WidgetSetting(props) {
    const {widget, modal, handleModalWidget} = props;

    const [state,setState] = useState();
    const ability = useContext(AbilityContext)
    console.log(widget)

    return (
        <div>
            <Modal
                isOpen={modal}
                toggle={handleModalWidget}
                className="modal-lg modal-setting-widget"
                modalTransition={{ timeout: 100 }}
                backdropTransition={{ timeout: 100 }}
            >
                <ModalHeader>
                    <div className='header-modal-widget'>
                        <div className='title'>
                            <span>
                                Setting Widgets
                            </span>
                        </div>

                        <div className='close-modal-widget' onClick={handleModalWidget}>
                            <img src={closeButton} alt="" />
                        </div>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <Row gutter={16} >
                    {_.map(
            _.filter(widget, (item) => {
              return (
                item.show === false && ability.can(item.action, item.resource)
              )
            }),
            (value, index) => {
              return (
                <div
                  key={index}
                  draggable={true}
                  onDragStart={(e) => {
                    e.target.classList.add("isDragging")
                    setState({
                      data_drop: { ...state.data_drop, ...value.data_grid },
                      loading_drop: true
                    })
                  }}
                  onDragEnd={(e) => {
                    e.target.classList.remove("isDragging")
                    setState({
                      data_drop: { i: "", w: 4, h: 2 },
                      loading_drop: false
                    })
                  }}>
                  <div className="droppable-element">
                    <span className="span">{value.title}</span>
                    {value.background}
                  </div>
                </div>
              )
            }
          )}
                        {/* <Col span={8} align="center" justify="center">
                            H2
                        </Col> */}
                    </Row>
                    {/* {renderMember(member)} */}
                </ModalBody>
            </Modal>
        </div>
    );
}

export default WidgetSetting;