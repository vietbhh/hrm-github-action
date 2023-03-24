import { useFormatMessage } from "@apps/utility/common"
import arrayMove from "array-move"
import classNames from "classnames"
import SortableList, { SortableItem } from "react-easy-sort"
import { Label, Modal, ModalBody, ModalHeader, Spinner } from "reactstrap"

const ModalEditAttachment = (props) => {
  const {
    modal,
    toggleModal,
    file,
    setFile,
    handleAddAttachment,
    loadingUploadAttachment,
    renderIconVideo
  } = props

  // ** function
  const onSortEnd = (oldIndex, newIndex) => {
    setFile((array) => arrayMove(array, oldIndex, newIndex))
  }

  return (
    <Modal
      isOpen={modal}
      toggle={() => toggleModal()}
      className="modal-lg modal-dialog-centered feed modal-edit-attachment"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader>
        <button className="btn-icon" onClick={() => toggleModal()}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        {useFormatMessage("modules.feed.create_post.text.photo_video")}
        <div className="header-right">
          <Label className={`mb-0 cursor-pointer`} for="attach-doc-2">
            <div
              className={classNames("div-add-photo", {
                "cursor-not-allowed": loadingUploadAttachment,
                "cursor-pointer": !loadingUploadAttachment
              })}>
              <svg
                width="24"
                height="24"
                fill="#3ab67b"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                viewBox="0 0 24 24"
                className="me-50">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6 1a5 5 0 0 0-5 5v12a5 5 0 0 0 5 5h12a5 5 0 0 0 5-5V6a5 5 0 0 0-5-5H6Zm1 4V3H5v2h2Zm2 4.444c0-.725.784-1.173 1.4-.8l4.211 2.551a.937.937 0 0 1 0 1.6l-4.211 2.55c-.616.374-1.4-.074-1.4-.8v-5.1ZM5 21v-2h2v2H5Zm6-18H9v2h2V3ZM9 19h2v2H9v-2Zm6-16h-2v2h2V3Zm-2 16h2v2h-2v-2Zm6-14V3h-2v2h2Zm-2 16v-2h2v2h-2Z"
                  fill="#3ab67b"></path>
              </svg>
              {useFormatMessage(
                "modules.feed.create_post.text.add_photo_video"
              )}
            </div>

            <input
              type="file"
              id="attach-doc-2"
              accept="image/*, video/*"
              disabled={loadingUploadAttachment}
              multiple
              hidden
              onChange={(e) => {
                handleAddAttachment(e.target.files)
              }}
            />
          </Label>
        </div>
      </ModalHeader>
      <ModalBody>
        <div className="list-item-photo">
          <SortableList
            onSortEnd={onSortEnd}
            className="list"
            draggedItemClassName="dragged">
            {_.map(file, (value, index) => {
              return (
                <SortableItem key={index}>
                  <div className="item-photo-feed">
                    <div className="photo-view">
                      <button
                        className="btn btn-delete-attachment"
                        onClick={() => {
                          const _file = [...file]
                          _file.splice(index, 1)
                          setFile(_file)
                        }}>
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z"
                            fill="white"></path>
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M30.6673 16.0002C30.6673 24.1003 24.1008 30.6668 16.0007 30.6668C7.90047 30.6668 1.33398 24.1003 1.33398 16.0002C1.33398 7.89999 7.90047 1.3335 16.0007 1.3335C24.1008 1.3335 30.6673 7.89999 30.6673 16.0002ZM22.2768 11.6096C22.7975 11.0889 22.7975 10.2447 22.2768 9.72402C21.7561 9.20332 20.9119 9.20332 20.3912 9.72402L16.0007 14.1145L11.6101 9.72402C11.0894 9.20332 10.2452 9.20332 9.72451 9.72402C9.20381 10.2447 9.20381 11.0889 9.72451 11.6096L14.115 16.0002L9.72451 20.3907C9.20381 20.9114 9.20381 21.7556 9.72451 22.2763C10.2452 22.797 11.0894 22.797 11.6101 22.2763L16.0007 17.8858L20.3912 22.2763C20.9119 22.797 21.7561 22.797 22.2768 22.2763C22.7975 21.7556 22.7975 20.9114 22.2768 20.3907L17.8863 16.0002L22.2768 11.6096Z"
                            fill="#26282C"></path>
                        </svg>
                      </button>
                      <div
                        className="photo-view-bg"
                        style={{
                          backgroundImage: `url("${value.url_thumb}")`
                        }}></div>
                      <div
                        className="photo-view-img"
                        style={{
                          backgroundImage: `url("${value.url_thumb}")`
                        }}></div>
                      {value.type.includes("video/") && renderIconVideo()}
                    </div>
                    <div className="photo-description">
                      <textarea
                        onChange={(e) => {
                          const _file = [...file]
                          _file[index].description = e.target.value
                          setFile(_file)
                        }}
                        value={value.description}
                        placeholder={useFormatMessage(
                          "modules.feed.create_post.text.add_description"
                        )}></textarea>
                    </div>
                  </div>
                </SortableItem>
              )
            })}

            {loadingUploadAttachment && (
              <div className="item-photo-feed">
                <div className="photo-view d-flex align-items-center justify-content-center">
                  <Spinner size="sm" />
                </div>
                <div className="photo-description">
                  <textarea disabled={true}></textarea>
                </div>
              </div>
            )}
          </SortableList>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default ModalEditAttachment
