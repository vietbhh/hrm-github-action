import { Popover } from "antd"
import { Fragment, useState } from "react"
import { Label } from "reactstrap"
import ReactGiphySearchBox from "./react-giphy"
const GifBoxButton = (props) => {
  const { onSelect, closeOnSelect } = props
  const [open, setOpen] = useState(false)
  const hide = () => {
    setOpen(false)
  }
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen)
  }
  return (
    <Fragment>
      <Label className={`mb-0 cursor-pointer`} for={`attach-gif`}>
        <Popover
          content={
            <ReactGiphySearchBox
              apiKey="rvUhAQyj80vEsaA4laeRiB6Fx5WDM4Bk"
              onSelect={(item) => {
                if (_.isFunction(onSelect)) {
                  onSelect(item)
                }
                if (closeOnSelect || _.isUndefined(closeOnSelect)) hide()
              }}
              masonryConfig={[
                { columns: 2, imageWidth: 110, gutter: 5 },
                { mq: "700px", columns: 3, imageWidth: 120, gutter: 5 }
              ]}
            />
          }
          trigger="click"
          overlayInnerStyle={{
            borderRadius: "12px"
          }}
          open={open}
          onOpenChange={handleOpenChange}>
          <i className="fa-thin fa-gif attach-gif-icon"></i>
        </Popover>
      </Label>
    </Fragment>
  )
}

export default GifBoxButton
