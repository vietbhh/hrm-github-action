import { Col, Row } from "antd"
import PhotoPublic from "@apps/modules/download/pages/PhotoPublic"

export default function StickerCollection({ data, handleSend, stickerName }) {
  return (
    <section className="sticker-chat-collection">
      <div className="header">
        <p>{stickerName !== "sticker_default" ? data.name : data.label}</p>
      </div>
      <div className="content">
        <Row>
          {data.list.map((item, index) => (
            <Col
              span={6}
              key={index}
              className="image"
              onClick={() => handleSend(item.url, stickerName)}>
              {stickerName !== "sticker_default" ? (
                <PhotoPublic src={item.url} preview={false} defaultPhoto="/" />
              ) : (
                <img src={item.url} />
              )}
            </Col>
          ))}
        </Row>
      </div>
    </section>
  )
}
