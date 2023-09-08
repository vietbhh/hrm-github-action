import { Dropdown, Space } from "antd"
import { useFormatMessage } from "@apps/utility/common"
import { Button, Card, CardBody } from "reactstrap"
const menuSettingLayout = [
  {
    label: (
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          version="1.1"
          id="Layer_1"
          x="0px"
          y="0px"
          width="20px"
          height="20px"
          viewBox="0 0 20 20"
          enableBackground="new 0 0 20 20"
          xmlSpace="preserve">
          {" "}
          <image
            id="image0"
            width="20"
            height="20"
            x="0"
            y="0"
            href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAQAAAAngNWGAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZ cwAACxMAAAsTAQCanBgAAAAHdElNRQfnBwwHKS07tTcpAAAAmElEQVQoz9WQ0RGCMBBEXxwKSAdS QqxA7IAS6ERLsAOhAzrAEuwgsYLYwfrBOEPAgXzqfu3MvbvbO/gj6Swvm4NJ7RphANRwA8KsFuhM m4KOAcud5wSzWI4ETmY6QE5xmVGVooZ5Sqf+S/ZGUpXzCyvpArBbB83r4zZA1cBje3EpLz/6Iul2 CbenBg7L/l6poq4qMy7+Gb0Bie1J02KQrBoAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjMtMDctMTJU MDU6NDE6NDUrMDI6MDBBk+ygAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIzLTA3LTEyVDA1OjQxOjQ1 KzAyOjAwMM5UHAAAAABJRU5ErkJggg=="
          />
        </svg>
        <span className="text-bold">
          {useFormatMessage(
            `modules.workspace.display.nav_menu_setting_layout.feed`
          )}
        </span>
      </div>
    ),
    key: "feed"
  },
  {
    label: (
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          version="1.1"
          id="Layer_1"
          x="0px"
          y="0px"
          width="20px"
          height="20px"
          viewBox="0 0 20 20"
          enableBackground="new 0 0 20 20"
          xmlSpace="preserve">
          {" "}
          <image
            id="image0"
            width="20"
            height="20"
            x="0"
            y="0"
            href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAQAAAAngNWGAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZ cwAACxMAAAsTAQCanBgAAAAHdElNRQfnBwwHKyvg4PCeAAABB0lEQVQoz42SbXXCQBRE7/YgYCWs g+KgkYCDUgXFAUEBcdCgABwQJwQFiYPbHwlJgNDT+fXennlfsxOYwEgcs1DzDDPPNj6i8WjWlwG4 JaflQE07qU4kPkjkYXfrpoWRWVho39WTF17CaOO5Cxt/hueNy5meDSyAyBWMZLyT82XNque0VKGl JhoxqWtwrWo+RB1WfZ4Wg2qlS+pQQCitnrVcjLuEzV9Sv/FP3BGNHl3PE4fRJjK+WXIwMZLLYQ2j ugFX2t+/erg615vgRS/27FhLmy4427z6aQAvnrogU/cvf3rfmaKzWc6WmoorUwUjiU8iu5CPlZmn WeNWd8adjEqTpA3tmPwCbE/TPcQ9608AAAAldEVYdGRhdGU6Y3JlYXRlADIwMjMtMDctMTJUMDU6 NDM6NDMrMDI6MDAmtgmnAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIzLTA3LTEyVDA1OjQzOjQzKzAy OjAwV+uxGwAAAABJRU5ErkJggg=="
          />
        </svg>

        <span className="text-bold">
          {useFormatMessage(
            `modules.workspace.display.nav_menu_setting_layout.approvals`
          )}
        </span>
      </div>
    ),
    key: "approvals"
  },
  {
    label: (
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          version="1.1"
          id="Layer_1"
          x="0px"
          y="0px"
          width="20px"
          height="20px"
          viewBox="0 0 20 20"
          enableBackground="new 0 0 20 20"
          xmlSpace="preserve">
          {" "}
          <image
            id="image0"
            width="20"
            height="20"
            x="0"
            y="0"
            href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAQAAAAngNWGAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZ cwAACxMAAAsTAQCanBgAAAAHdElNRQfnBwwHLQFtAZ7OAAAA4klEQVQoz52SW5XCMBRFDyz+iYQ4 mEiohEhAQhyAA4oC6gAcpA5aB6mD4mDPx0xL+ppZi/N3k31yX5EWwmD0n/BEABpOf2EBaAgEEhC2 MAs8xijSb5SAB9wYFZCn32ekldSNUSfJrIOtJDexteupDYmE/a03kba7diQg0tDT/1gG7eadK8hJ qlXuXvnNfoIZeR2F0Jf89MUcOwPQUVOTADivYVegfL+CpeK5xArgsjaJ+cEJljVhSYP9kO3BvffC VdJNUVI1d8f8vxAAhvHP01RAT+SOl7jQbA+ooKKlo9Tn+gaZ1qgZU7vhVAAAACV0RVh0ZGF0ZTpj cmVhdGUAMjAyMy0wNy0xMlQwNTo0NTowMSswMjowMDh9ZjMAAAAldEVYdGRhdGU6bW9kaWZ5ADIw MjMtMDctMTJUMDU6NDU6MDErMDI6MDBJIN6PAAAAAElFTkSuQmCC"
          />
        </svg>
        <span className="text-bold">
          {useFormatMessage(
            `modules.workspace.display.nav_menu_setting_layout.request`
          )}
        </span>
      </div>
    ),
    key: "request"
  },
  {
    label: (
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          version="1.1"
          id="Layer_1"
          x="0px"
          y="0px"
          width="20px"
          height="20px"
          viewBox="0 0 20 20"
          enableBackground="new 0 0 20 20"
          xmlSpace="preserve">
          {" "}
          <image
            id="image0"
            width="20"
            height="20"
            x="0"
            y="0"
            href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAQAAAAngNWGAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZ cwAACxMAAAsTAQCanBgAAAAHdElNRQfnBwwHLi109KHuAAAA7ElEQVQoz52SfXHDMAzFn3cDYAge g0DIGGwMWgZlkDJYGSQMMgYpg5WBw0Bm8Nsfcxs7be62vTvdSZb89Cn9DwRGDKMnbAd5OgzjxABA 9zhsR4QrE4EBiOzWCSfgTFu9NkRgLIogYhw28hgR/2O0UHLRVNYb0EhPd11HfWki3hImSf4uUJOk d+2zVuC54msVtHefEkkjjbssvpoxZZF8lseM7sKsD7ySOs3uXPrWNb5K6jVmbcWYljRu1gutUlnd 0oInYqtlXX0HjFhObwQiTT2DvNhQ//3NUdyCjwD0nDCMI15bIDBgWHUzf8M3vza0kBNM6tcAAAAl dEVYdGRhdGU6Y3JlYXRlADIwMjMtMDctMTJUMDU6NDY6NDUrMDI6MDCjT/fZAAAAJXRFWHRkYXRl Om1vZGlmeQAyMDIzLTA3LTEyVDA1OjQ2OjQ1KzAyOjAw0hJPZQAAAABJRU5ErkJggg=="
          />
        </svg>
        <span className="text-bold">
          {useFormatMessage(
            `modules.workspace.display.nav_menu_setting_layout.setting`
          )}
        </span>
      </div>
    ),
    key: "setting"
  }
]

const MenuSettingWorkspace = (props) => {
  const { menu } = props
  return (
    <Card>
      <CardBody className="p-50 d-flex align-items-center justify-content-center w-100 p-1">
        <Dropdown
          menu={{
            items: menuSettingLayout
          }}
          trigger="click"
          placement="bottom"
          overlayClassName="action-feed-dropdown">
          <div className="d-flex align-items-center justify-content-center w-100">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                version="1.1"
                id="Layer_1"
                x="0px"
                y="0px"
                width="20px"
                height="20px"
                viewBox="0 0 20 20"
                enableBackground="new 0 0 20 20"
                xmlSpace="preserve">
                <image
                  id="image0"
                  width="20"
                  height="20"
                  x="0"
                  y="0"
                  href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAQAAAAngNWGAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZ cwAACxMAAAsTAQCanBgAAAAHdElNRQfnBwwHLi109KHuAAAA7ElEQVQoz52SfXHDMAzFn3cDYAge g0DIGGwMWgZlkDJYGSQMMgYpg5WBw0Bm8Nsfcxs7be62vTvdSZb89Cn9DwRGDKMnbAd5OgzjxABA 9zhsR4QrE4EBiOzWCSfgTFu9NkRgLIogYhw28hgR/2O0UHLRVNYb0EhPd11HfWki3hImSf4uUJOk d+2zVuC54msVtHefEkkjjbssvpoxZZF8lseM7sKsD7ySOs3uXPrWNb5K6jVmbcWYljRu1gutUlnd 0oInYqtlXX0HjFhObwQiTT2DvNhQ//3NUdyCjwD0nDCMI15bIDBgWHUzf8M3vza0kBNM6tcAAAAl dEVYdGRhdGU6Y3JlYXRlADIwMjMtMDctMTJUMDU6NDY6NDUrMDI6MDCjT/fZAAAAJXRFWHRkYXRl Om1vZGlmeQAyMDIzLTA3LTEyVDA1OjQ2OjQ1KzAyOjAw0hJPZQAAAABJRU5ErkJggg=="
                />
              </svg>
            </div>
            {useFormatMessage(
              `modules.workspace.display.nav_menu_setting_layout.${menu}`
            )}{" "}
            <i className="fa-regular fa-chevron-down ms-auto"></i>
          </div>
        </Dropdown>
      </CardBody>
    </Card>
  )
}

export default MenuSettingWorkspace
