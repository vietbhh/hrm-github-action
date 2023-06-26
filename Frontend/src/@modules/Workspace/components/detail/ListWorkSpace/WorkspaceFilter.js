// ** React Imports
// ** Styles
import { useFormatMessage } from "@apps/utility/common"
import { Button } from "reactstrap"
// ** Components

const WorkspaceFilter = (props) => {
  const {
    // ** props
    // ** methods
  } = props

  // ** render
  return (
    <div>
      <span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          version="1.1"
          id="Layer_1"
          x="0px"
          y="0px"
          width="21px"
          height="22px"
          viewBox="0 0 21 22"
          enableBackground="new 0 0 21 22"
          xmlSpace="preserve">
          {" "}
          <image
            id="image0"
            width="21"
            height="22"
            x="0"
            y="0"
            href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAWCAMAAAAYXScKAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAflBMVEUAAAAwQFAwQk0yQk8y Q08wQFAwQk4xQ08xQk8yQk4yQlAzQ1AyQk0xQ04yQ08wRVAwSFAyQ08wQk0xQ08zQ0wwQFAyQk0w Q0wxQ04wRFAzRE8yQk4yQk40QEwwRFAyQk4wQlAwQEowQEwyQlAzQ04yRFAwQlAwQ1AyQ0/////J pM/cAAAAKHRSTlMAEHCfryB/79/AcFBgoN8wIO9gv1AwcFCwQM+QgEB/j3AwQGCwgGBQV9iPlwAA AAFiS0dEKcq3hSQAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnBhoLJCcvxnjtAAAAnklE QVQY05WQ2xKCIBRFQdAwFTla2d0uVvv/vzBHhGCmF/fLgcVi9sxhbHF4IqRI0phlK0wRAU8VkK+L stJQtacK2l6MBDm7gTZOkGi9uvk1EKy8hQ6KK+ym2WEf0BIimjE94BjQE85xwVx9cc+th1dfPcr9 fLwBhRNqgmrujD/acRWZ/2e0XQ6oCjF7DgTKX5y9I+zzIXR/cD0YtiRfWXgM4kQkNZcAAAAldEVY dGRhdGU6Y3JlYXRlADIwMjMtMDYtMjZUMDk6MzY6MzkrMDI6MDCN4q+XAAAAJXRFWHRkYXRlOm1v ZGlmeQAyMDIzLTA2LTI2VDA5OjM2OjM5KzAyOjAw/L8XKwAAAABJRU5ErkJggg=="
          />
        </svg>
        <Button.Ripple color="primary" className="ms-3 common-border">
          <i className="fas fa-plus me-50" />
          {useFormatMessage("modules.workspace.buttons.create")}
        </Button.Ripple>
      </span>
    </div>
  )
}

export default WorkspaceFilter
