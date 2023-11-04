import React, { useState } from 'react';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import closeButton from "../../../assets/images/close-circle.svg"
import birthdayImage from "../../../assets/images/birthday.png"
import Avatar from "@apps/modules/download/pages/Avatar"
import messenger from "../../../assets/images/messenger.svg"

function ModalListBirthday(props) {

    const {modal,handleModalBirthday,member} = props;

    const handleClickMessenge = (member) => {
      window.open(`/chat/${member.username}`, "_blank", "noopener,noreferrer")
    }

    const handleClickInfoUser = (member) => {
      window.open(`/u/${member.username}`, "_blank", "noopener,noreferrer")
    }

    const renderMember = (members) => {
        return members.map((member, index) => (
          <div className='list-member' key={index}>
            <div className='info' onClick={() => handleClickInfoUser(member)}>
              <Avatar
                src={member.avatar}
                className="me-75"
                imgHeight="40"
                imgWidth="40"
              />
              <span className='title'>
                {member.full_name}
              </span>
            </div>
            <div className='send-message' onClick={() => handleClickMessenge(member)}>
              <div className='icon-messenger'>
                <img src={messenger} alt="messenger" />
              </div>
              <div className='title'>
                Happy Birthday
              </div>
            </div>
          </div>
        ));
      };
      
    return (
        <div>
            
            <Modal
                isOpen={modal}
                toggle={handleModalBirthday}
                className="modal-lg modal-events"
                modalTransition={{ timeout: 100 }}
                backdropTransition={{ timeout: 100 }}
                centered 
            >
                <ModalHeader>
                    <div className='image-birthday'>
                        <img src={birthdayImage} alt="" />
                    </div>
                    <div className='header-modal-events'>
                        <div className='title'>
                            
                            <span>
                                Member’s Birthday
                            </span>
                        </div>

                        <div className='close-modal-events' onClick={handleModalBirthday}>
                            <img src={closeButton} alt="" />
                        </div>
                    </div>
                </ModalHeader>
                <ModalBody>
                    {renderMember(member)}
                </ModalBody>
            </Modal>
        </div>
    );
}

export default ModalListBirthday;