// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Card, CardBody } from "reactstrap"
// ** Components

const ContactInfo = (props) => {
  const {
    // ** props
    employeeData
    // ** methods
  } = props
  
  // ** render
  return (
    <Card className="mb-1 contact-info-section">
      <CardBody>
        <div className="contact-item">
          <h6 className="mb-50 common-label">
            {useFormatMessage("modules.employees.text.location")}
          </h6>
          <p className="common-content">{employeeData.pob}</p>
        </div>
        <div className="contact-item">
          <h6 className="mb-50 common-label">
            {useFormatMessage("modules.employees.fields.email")}
          </h6>
          <p className="common-content blue-text">{employeeData.email}</p>
        </div>
        <div className="contact-item">
          <h6 className="mb-50 common-label">
            {useFormatMessage("modules.employees.fields.phone")}
          </h6>
          <p className="common-content blue-text">{employeeData.phone}</p>
        </div>
        <div className="contact-item social">
          <h6 className="mb-50 common-label">
            {useFormatMessage("modules.employees.text.social")}
          </h6>

          <div className="d-flex align-items-center justify-content-start w-75 pt-75">
            <a
              href={
                employeeData.social_facebook ? employeeData.social_facebook : ""
              }
              target="_blank">
              <div className="me-75 social-contact-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  version="1.1"
                  id="Layer_1"
                  x="0px"
                  y="0px"
                  width="25px"
                  height="25px"
                  viewBox="0 0 25 25"
                  enableBackground="new 0 0 25 25"
                  xmlSpace="preserve">
                  {" "}
                  <image
                    id="image0"
                    width="25"
                    height="25"
                    x="0"
                    y="0"
                    href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAYFBMVEUAAAAUc9cYd9MZdtIY eM8ZdNIaddIXdNEZdtIXddMZddIZdtIZdtEYdtIYdtMkbdsYdtEZgOUZds8YddIYddMacs8ZddIa dtIQcM8ZdtEYdc8YdtEadtEWddMZdtL///++ZSbKAAAAHnRSTlMAM7LiIGXvIeli/uHgk3MHoApQ YL86Zu8QoGCAzyMXw+FSAAAAAWJLR0QfBQ0QvQAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1F B+cHEwsUKVdQBSMAAABeSURBVCjP5c63EoBACEVRzDmyRpT//0yl2tlZKRxLb8kpHgC2IIyYOQav JGV+lCxnRQo5l1XtSyPSdv4K9CIDaAIvZEQ0Ing3OWLYNmuyrJps7s5OdMiZiM7vX/9aLucMEdUn 68MvAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIzLTA3LTE5VDA5OjIwOjQxKzAyOjAwcsr7iAAAACV0 RVh0ZGF0ZTptb2RpZnkAMjAyMy0wNy0xOVQwOToyMDo0MSswMjowMAOXQzQAAAAASUVORK5CYII="
                  />
                </svg>
              </div>
            </a>
            <a
              href={
                employeeData.social_instagram
                  ? employeeData.social_instagram
                  : ""
              }
              target="_blank">
              <div className="me-1 social-contact-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  version="1.1"
                  id="Layer_1"
                  x="0px"
                  y="0px"
                  width="32px"
                  height="32px"
                  viewBox="0 0 32 32"
                  enableBackground="new 0 0 32 32"
                  xmlSpace="preserve">
                  {" "}
                  <image
                    id="image0"
                    width="32"
                    height="32"
                    x="0"
                    y="0"
                    href="data:image/png;base64,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 AAAASUVORK5CYII="
                  />
                </svg>
              </div>
            </a>
            <a
              href={
                employeeData.social_telegram ? employeeData.social_telegram : ""
              }
              target="_blank">
              <div className="me-1 social-contact-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  version="1.1"
                  id="Layer_1"
                  x="0px"
                  y="0px"
                  width="26px"
                  height="26px"
                  viewBox="0 0 26 26"
                  enableBackground="new 0 0 26 26"
                  xmlSpace="preserve">
                  {" "}
                  <image
                    id="image0"
                    width="26"
                    height="26"
                    x="0"
                    y="0"
                    href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABIFBMVEUAAAAAn98CmuMDm+UC m+YAl+MDmuUCm+UAm+0Cm+UCm+UEm+UAsv8AmuYDm+QDmuQCmuMCm+UDm+YEmuYDm+YCmeUCnOUC muUDm+UEnOYHnegCm+UFmOIAn98AmOEDm+UDmuQGmuEAn+cCm+YDm+UAAP8Am+gCm+QDm+UFm+YA m+ACnOYDnOUCmeIDm+UMnucAmeMCm+QDmuUEm+MDm+cDmeIEm+UEm+QQn98CmuUFnekGm+YCmuID m+YFnuUCmuUIn+cDmuUDmuUFm+QDm+QDnOcCmeMDmuUCnOUAlvADmuUEnOYEmuQEm+MDm+UAl9wE m+UDm+UCm+MAmOQEm+UDnOYEneQAv/8EneYDm+UA//8DmuQCm+UEm+QDm+X///8WGQ4VAAAAXnRS TlMAEHfCj0Cu8hx/7NQKW7+nkO/eR8JsdtD+jSLPNAhDuMArIN70ASGE73Ah38RpqRU3cN9AXlDZ ghB+LylywDKBIGK4cLyygLTfEfvVkJGoFoBhbi9/30EEhfYBTMx7v6mUxQAAAAFiS0dEX3PRUS0A AAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnBxMLFg7AbNLKAAAA8klEQVQoz2NgoCJgZGJm wSrBysYeFxeHKc7ByRUHAtxo4jy8fHFQwI9qkIAgSFBIWARIiiLZLCYOVi0hKSUNomWg4rJy8uwQ cxQUlZRBtIoqWEJNXRBqgYYmg5Y2mKUDMkgXbnOcnj6DAVSVAAODoSBcwsiYgcEExjVlYDCDy5hb MDBYwnlWQAOtbZhBTFs7INseLqMBdZ+Do5MziGaBy8S5oHhY1hUhE+eGIuWOJBNnjCLlgSzliSLl hSTjjRrqQBEfX6iUH4qMf1xcAANDoAZYKghFKjguBOyRUExXKIVB6PCIuLjIKBxpJjomlszUBgQA l8BauA/EGdsAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjMtMDctMTlUMDk6MjI6MTQrMDI6MDBs5wp2 AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIzLTA3LTE5VDA5OjIyOjE0KzAyOjAwHbqyygAAAABJRU5E rkJggg=="
                  />
                </svg>
              </div>
            </a>

            <a
              href={
                employeeData.social_twitter ? employeeData.social_twitter : ""
              }
              target="_blank">
              <div className="me-1 social-contact-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  version="1.1"
                  id="Layer_1"
                  x="0px"
                  y="0px"
                  width="26px"
                  height="26px"
                  viewBox="0 0 26 26"
                  enableBackground="new 0 0 26 26"
                  xmlSpace="preserve">
                  {" "}
                  <image
                    id="image0"
                    width="26"
                    height="26"
                    x="0"
                    y="0"
                    href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABgFBMVEUAAAAAqv8DqfYEqfQE qfIDq/YAqtQAquMAAP8AovMAqvEAqfYCqfQDqfQDqfQAqfQAqvYDqPIDqPMAtv8CqPQEqfQAquwA qPUCqvUDqfUDp/YAougDqvQDqPQAqvMDqfQDqfQBqvUCqfUCp/MAuf8CqfQCqfQCqPAAsv8ApfAD qvUAn98DqPMDqPQDqfMApf8EqfQDqfUAgP8EqvQDqvQCqfUCp/MCqvUEqfADqvYAme4DqfQAp/UA meUDqfQDqvUDqvUDqfUAr/8DqfUDqfQAn+8Eq/YDqfUEqvUDqfUCqvYAn/8DqfIEqPMDqfUMovMD qPQDqfUDqfQCq/QCqPQEqfQApvQA//8DqvUDqfQEq/QEqfQDqfQDqvUDqPQEqfQArvYCqPMDqPQE qfcAqv8ApvIAqvQDqfQDqfQDqvMAq/MDqfQCqvMCqvUDqvQDqfMHqPAAovMCqPUDqfMDqfMDqfUC qfIErvQJqv8CqfICqPQDqPEEqPAGqvMDqfT///9FVISYAAAAfnRSTlMACVOOjlIGCQEpEjvW/v1H HmGTB5/MGzLq9lELyMoqyfytkmgLzORnCiKcCKXCUxFElQRF/tuXaURXD6c0CrWr7/wgnd8QOrKB 92wIYtfiFqTJ9nNv2RcBlvVDR6Db/Xc80Pp9BhRFtPnzQKPb6fKbIxZ7xvPejkgbdnVeRiravnRO AAAAAWJLR0R/SL9x5QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+cHEwsXFsobe90AAAEK SURBVCjPY2CgBmBkYmZhZQMy2DkYGDi5kGS4eXjr6vh4+AUEhYQZGERExeAy4hJ1YMDHKyklzSAt UycrB5OSr4MCBUUlZQYV1bo6NXUNsIwmL0yqjldLm4FBB8TQ1dMHShnAZeoMjYB8Yz4Q08TUzNzC EiHFD5QxsrKGG8OHkLIBStna2TvUYQBHJ5DdznVYgIsrSMoNm5Q7xDMenphSXhApbx9fdBk/f4iU dEBgEJpUMCx4QtA1hYbBpMIjeFFkIqMQUaEdHROLkI2LD0eKJraERLhMUnIKQiI1LT0DLpPpA9eT lZ2TqwCXyMsvQDKssKi4BBpwpWXlaElFuMLCp7KquqZWgwrpDgBjiZ2hvK6P3gAAACV0RVh0ZGF0 ZTpjcmVhdGUAMjAyMy0wNy0xOVQwOToyMzoyMiswMjowMG56U5EAAAAldEVYdGRhdGU6bW9kaWZ5 ADIwMjMtMDctMTlUMDk6MjM6MjIrMDI6MDAfJ+stAAAAAElFTkSuQmCC"
                  />
                </svg>
              </div>
            </a>

            <a
              href={
                employeeData.social_youtube ? employeeData.social_youtube : "/"
              }
              target="_blank">
              <div className="me-1 social-contact-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  version="1.1"
                  id="Layer_1"
                  x="0px"
                  y="0px"
                  width="30px"
                  height="30px"
                  viewBox="0 0 30 30"
                  enableBackground="new 0 0 30 30"
                  xmlSpace="preserve">
                  {" "}
                  <image
                    id="image0"
                    width="30"
                    height="30"
                    x="0"
                    y="0"
                    href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAMAAAAM7l6QAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAA+VBMVEUAAADjORz3QDj0QTbz QDT0QzfyQzb1RDfzQTfzQzj0QzXyQzb0Qjf0QjbzQTXzQTXyQTT1QTfzQjb2QTP4QjP/gIDoLi71 RDb0Qzb0QzX0QjXvQDDzQTX1QzXvQDD1RDT0QjTzQjb0Qzb1Qjb0QzX0Qzb0Qzb0Qzb0Qzb1QzX0 QjbzQzbyQzbzQzbxQjT1QTT0QDX3SDj0QzX0QzX0RDbzQzX/SST////4QDnyQzbzRDjwQjP/QED0 Qzb2fHL5zMn54+H2f3b6+vr4t7H0Wk758/L2npj2eG74xMD1Vkv54t/2cWf57+73mZL0RDf5y8j5 3Nn2fHP///+YUx+UAAAAPXRSTlMACSAvQEVMT1NXW19dWVZSTkpCNyMCC5f2/Z8QlJUgYnCqoMXS 5OH7/OHRxqGrcGIYIJCR9ZQHASQ5QDIInZzDjwAAAAFiS0dENzC4uEcAAAAJcEhZcwAACxMAAAsT AQCanBgAAAAHdElNRQfnBxMLGA3H5q7+AAAAz0lEQVQoz8XTyVbCMBiG4Y8aQEEmB6CWyQpWVOZJ gWCNA1akyP3fDD3dNKFttn13f55zkkUSINpiygkh8UTy9CyVPs9kc/nCBSGXV9cuFktlGph6ozlc oaFVgRqVpKEu4wZuvWHlYx133vBmvh9xEy2OGfv4FPgeqsDs65tnA1Rkxsw1t+Rn4YQg/rEk/Lvh NzdE/tvanD6gLfDOonwtPHL8v6FiT3j2hr19pLSDruxKeujLeAAMw3XkvBZNN4JxPJm6r2328jr3 tVCWEf+QAzSJkT/kGB4IAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIzLTA3LTE5VDA5OjI0OjEzKzAy OjAwpF5EvwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMy0wNy0xOVQwOToyNDoxMyswMjowMNUD/AMA AAAASUVORK5CYII="
                  />
                </svg>
              </div>
            </a>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default ContactInfo
