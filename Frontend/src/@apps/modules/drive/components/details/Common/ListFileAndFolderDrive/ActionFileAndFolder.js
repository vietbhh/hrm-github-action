// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
import { driveApi } from "@apps/modules/drive/common/api"
// ** redux
import { useDispatch } from "react-redux"
import {
  toggleModalShare,
  setModalDataShare
} from "@apps/modules/drive/common/reducer/drive"
// ** Styles
import { Button } from "reactstrap"
import { Dropdown, Menu } from "antd"
import notification from "@apps/utility/notification"
// ** Components
import SwAlert from "@apps/utility/SwAlert"

const ActionFile = (props) => {
  const {
    // ** props
    index,
    item,
    // ** methods
    handleAfterUpdateFavorite
  } = props

  console.log(item)

  const dispatch = useDispatch()

  const isEditable = item.permission === "editable"

  const handleClickShare = () => {
    dispatch(toggleModalShare())
    dispatch(setModalDataShare(item))
  }

  const handleClickFavorite = (e) => {
    e.stopPropagation()
    driveApi
      .updateFavorite({
        data: {
          id: item.id,
          type: item.type,
          is_favorite: !item.is_favorite
        }
      })
      .then((res) => {
        notification.showSuccess()

        if (typeof handleAfterUpdateFavorite === "function") {
          handleAfterUpdateFavorite(item)
        }
      })
      .catch((err) => {})
  }

  const handleClickDelete = (e) => {
    e.stopPropagation()
    SwAlert.showWarning({
      title: useFormatMessage("modules.drive.text.confirm_delete.title", {
        name: item.name
      }),
      text: useFormatMessage("modules.drive.text.confirm_delete.content")
    }).then((res) => {
      if (res.isConfirmed) {
        driveApi
          .removeDriveContent({
            type: item.type,
            id: item.id
          })
          .then((res) => {})
          .catch()
      }
    })
  }

  const renderFavoriteIcon = () => {
    if (item.is_favorite) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          version="1.1"
          id="Layer_1"
          x="0px"
          y="0px"
          width="22px"
          height="22px"
          viewBox="0 0 24 23"
          enableBackground="new 0 0 24 23"
          xmlSpace="preserve"
          className="me-50">
          {" "}
          <image
            id="image0"
            width="22"
            height="22"
            x="0"
            y="0"
            href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAXCAMAAAAm/38fAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAUVBMVEUAAAD/0Sz/0Sr/0Sv/ 0i3/0Cv/0Cz/0iz/zyD/1Cv/0S7/0Cv/0Cz/0Sz/0Cz/0Sz/0C3/0S3/0Sv/zzD/zyr/0i3/0S3/ zzD/1jH/0Sz///8wGrBdAAAAGXRSTlMAf39fP9+/vxAvX5/P769vn4/fEDBP7yAf7aT2zAAAAAFi S0dEGnVn5DIAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfmDBoMEBSvnzeNAAAAj0lEQVQo z3WQURKCMAxEs1IBodagCOT+F9W2Q00l7FezbzZJQ/QTLmSqEXEmuIq0lu9E7EgXQXsSsCJdBirS 3waM/i67fMDg+rSkpQfBBiBiy+c4ZDrx6dhtKtc79N/FRp+koEFQwGvwVKCe8Sr+XIO5gHeqFyBf rCG97oJvh5Wrb8RtecvPiMYCVmz0X3wAVmcZj7rCkGAAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjIt MTItMjZUMTE6MTY6MjArMDE6MDDCIpyKAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIyLTEyLTI2VDEx OjE2OjIwKzAxOjAws38kNgAAAABJRU5ErkJggg=="
          />
        </svg>
      )
    }

    return (
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
        xmlSpace="preserve"
        className="me-50">
        {" "}
        <image
          id="image0"
          width="20"
          height="20"
          x="0"
          y="0"
          href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAgVBMVEUAAAAoKzApLTEoLTEn LTAoKDApLDMpLDEpLTIgMDAoKzIpMTEoMDAoLDIoLTIpKzIgIDApLDAoLDEnLDInLDEpLjIpLTMn LTIoLDQoLjMpLTMqLTIwMDApKTEqLDMpLTIpLTIpLDMqLTAlKjArKzEnKzIoKzMpLTApLjMpLTL/ ///aIJ23AAAAKXRSTlMAX+/fTyDPz+8Qnx8gf5+PEG+/r8/fr49AX7/vEB/P349vTzAvj1+Pz/R+ dC4AAAABYktHRCpTvtSeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5gwBBwI1EE9ofwAA AKlJREFUGNN9kN0SgiAQhVeoREU0+yE1UzOq8/4vGOVAyUV7wex+czhndon+VcT4KmRrtolFEsAU mUQeCKGIVCC1QiKJws3lNo3Z/DMHq3bRu9vjcNSnWVDrpkVFdIZe2it0RBfeLSJ5b1/Z/1LLMgqo Y5YKbzsgc61QPkV816ldO8I5XTER3Yyx84S7MxJUPtC2KDry9iMMg06kAjf+UrJH89lTNnj69LBe ztgL9Oa8u9YAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjItMTItMDFUMDc6MDI6NTMrMDA6MDCd+cHI AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIyLTEyLTAxVDA3OjAyOjUzKzAwOjAw7KR5dAAAAABJRU5E rkJggg=="
        />
      </svg>
    )
  }

  let items = []

  if (isEditable) {
    items = [
      {
        key: "1",
        label: (
          <div
            className="d-flex align-items-center"
            onClick={() => handleClickShare()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="me-50">
              <path
                d="M20.62 13.07C20.24 13.07 19.92 12.78 19.87 12.4C19.63 10.14 18.41 8.08998 16.53 6.78998C16.19 6.54998 16.11 6.08998 16.34 5.74998C16.58 5.40998 17.05 5.32998 17.38 5.55998C19.62 7.10998 21.06 9.54998 21.35 12.24C21.39 12.65 21.1 13.02 20.68 13.07C20.67 13.07 20.64 13.07 20.62 13.07Z"
                fill="#292D32"
              />
              <path
                d="M3.49003 13.12C3.46003 13.12 3.44003 13.12 3.41003 13.12C3.00003 13.07 2.70003 12.7 2.74003 12.29C3.01003 9.60001 4.44003 7.17001 6.65003 5.60001C6.99003 5.36001 7.46003 5.44001 7.70003 5.78001C7.94003 6.12001 7.86003 6.59001 7.52003 6.83001C5.66003 8.14001 4.46003 10.19 4.23003 12.45C4.20003 12.83 3.87003 13.12 3.49003 13.12Z"
                fill="#292D32"
              />
              <path
                d="M12.06 22.61C10.58 22.61 9.17003 22.27 7.85003 21.61C7.48003 21.42 7.33003 20.97 7.52003 20.6C7.71003 20.23 8.16003 20.08 8.53003 20.27C10.69 21.36 13.29 21.38 15.47 20.33C15.84 20.15 16.29 20.31 16.47 20.68C16.65 21.05 16.49 21.5 16.12 21.68C14.84 22.3 13.48 22.61 12.06 22.61Z"
                fill="#292D32"
              />
              <path
                d="M12.06 8.44C10.11 8.44 8.53003 6.86 8.53003 4.91C8.53003 2.96 10.11 1.38 12.06 1.38C14.01 1.38 15.59 2.96 15.59 4.91C15.59 6.86 14 8.44 12.06 8.44ZM12.06 2.89C10.94 2.89 10.03 3.8 10.03 4.92C10.03 6.04 10.94 6.95 12.06 6.95C13.18 6.95 14.09 6.04 14.09 4.92C14.09 3.8 13.17 2.89 12.06 2.89Z"
                fill="#292D32"
              />
              <path
                d="M4.82999 20.67C2.87999 20.67 1.29999 19.09 1.29999 17.14C1.29999 15.2 2.87999 13.61 4.82999 13.61C6.77999 13.61 8.35999 15.19 8.35999 17.14C8.35999 19.08 6.77999 20.67 4.82999 20.67ZM4.82999 15.11C3.70999 15.11 2.79999 16.02 2.79999 17.14C2.79999 18.26 3.70999 19.17 4.82999 19.17C5.94999 19.17 6.85999 18.26 6.85999 17.14C6.85999 16.02 5.94999 15.11 4.82999 15.11Z"
                fill="#292D32"
              />
              <path
                d="M19.17 20.67C17.22 20.67 15.64 19.09 15.64 17.14C15.64 15.2 17.22 13.61 19.17 13.61C21.12 13.61 22.7 15.19 22.7 17.14C22.69 19.08 21.11 20.67 19.17 20.67ZM19.17 15.11C18.05 15.11 17.14 16.02 17.14 17.14C17.14 18.26 18.05 19.17 19.17 19.17C20.29 19.17 21.2 18.26 21.2 17.14C21.19 16.02 20.29 15.11 19.17 15.11Z"
                fill="#292D32"
              />
            </svg>
            {useFormatMessage("modules.drive.buttons.share")}
          </div>
        )
      },
      {
        key: "2",
        label: (
          <div className="d-flex align-items-center">
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
              xmlSpace="preserve"
              className="me-50">
              {" "}
              <image
                id="image0"
                width="20"
                height="20"
                x="0"
                y="0"
                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAilBMVEUAAAAgIDApKTEoKzAo LDEnLDIoLDApLTMpLjMoLTInLTIpLTIoLDIoMDApLDEmKzEoLTEoLTIwMDApLTIoLTEoLDQpLTIn LDApLDAnLTAgMDAoKDApLTMpLDEpLDMoKzIpMTEoLjMqLjMpLTIrKzEnLDEoLjAnKzIpLTEoKzMq LTIrMTEpLTL///8VnYV0AAAALHRSTlMAEB9fv69/v29gj99/IM8v358Q7z9Aj29vTxAgr7/Pnx9f z68vz1+P71/vLyZ1my4AAAABYktHRC3N2kE9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH 5gwBBjcnQAWxtgAAAKdJREFUGNOFkOkSgjAMhAtFkPsonqgFb3Hf//lsClJRZ8ifJF872U0YmwjL /kHcATAbcxfe3A9C8BGLKMUJUgOzvMuFcAZWYtFXSzFAH/ZXxVeqLNl6Q02ELaUKO1Yonb0gjeyg P8qwVqOQag0XjYaChItjozVOQTe6c6jHGYuif2TSuFECWo9V7wUozkjImnVB/bH3FZmMbnc8RheK 8xat95y69594AV0CCuxtCyZJAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIyLTEyLTAxVDA2OjU1OjM5 KzAwOjAwsfv5vwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMi0xMi0wMVQwNjo1NTozOSswMDowMMCm QQMAAAAASUVORK5CYII="
              />
            </svg>
            {useFormatMessage("modules.drive.buttons.get_link")}
          </div>
        )
      },
      {
        key: "3",
        label: (
          <div className="d-flex align-items-center">
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
              xmlSpace="preserve"
              className="me-50">
              {" "}
              <image
                id="image0"
                width="20"
                height="20"
                x="0"
                y="0"
                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAYFBMVEUAAAAWFisUFCkVFSoU FCoTEyoQECkUFCoUFCsUFCoUFCgQECAYGCgUFCsQECgTEykQEDAUFCoTEyoVFSoVFSkTEysWFiYU FCkZGSkTEygUFCgTEykUFCsUFCwUFCr///8EFbi3AAAAHnRSTlMAL4/fz58ff++vfxAgjyDfEO9P n29fL78fXz+/v0A1/6VtAAAAAWJLR0QfBQ0QvQAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1F B+YMAQY4OEqVoIwAAACTSURBVBjTjZDbEoMgDEQplyKCVBTa2sv+/2c2KjMl9qX7AMuZZDNECNJJ KqXNWbSy6JxxHXrGpKcrDA2NkNUNwKWGGOUrHK11SNNq09zmB52oNiCzqWFNDij761qpMnTA1orS QHVjMG5xOTM4uns7oIgf/QnjssHHxPfUE1zAPke7mPGE9jzAAnj54yB76N31/toPxg8ISyDyf6YA AAAldEVYdGRhdGU6Y3JlYXRlADIwMjItMTItMDFUMDY6NTY6NTYrMDA6MDBq6zvSAAAAJXRFWHRk YXRlOm1vZGlmeQAyMDIyLTEyLTAxVDA2OjU2OjU2KzAwOjAwG7aDbgAAAABJRU5ErkJggg=="
              />
            </svg>
            {useFormatMessage("modules.drive.buttons.download")}
          </div>
        )
      },
      {
        key: "4",
        label: (
          <div className="d-flex align-items-center">
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
              xmlSpace="preserve"
              className="me-50">
              {" "}
              <image
                id="image0"
                width="20"
                height="20"
                x="0"
                y="0"
                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAe1BMVEUAAAAoKzApLDEpLTEo KzIpKTEoLDApLTMoLTIpLTIoLTEmKzEoLDIoMDAgMDAoLTEoKzMlKjAqLTQpLDMpLTIpLDIpMTEr KzEpLDAoLTAnLDMoKDAnLTIoLDQqLTApLTIoLTIwMDAqLTIpLTMoKDgoLjAnLTApLTL////Q2oiB AAAAJ3RSTlMAX8/vnx9/v5/f3y9/IBA/XzBPz++vHy9vn28gj0BPr2AQ71AgX08bVd5EAAAAAWJL R0QovbC1sgAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+YMAQY6DrcZV5cAAACbSURBVBjT hZDtEoIgEEVJTYUEMinpUyvrvv8bBkgFTDOdPztzmLl7WUL+sMjyYpm4ElVN2SpxDSGcMhE5aofE OsgDhc1rsQlcx1Vm7Ba7t+vRCdIrpvc4fFxO7TuvYJfNHGfnC3jYD8d9TonTt43E2Q6NOqh9QetK DeH/RkipC1sq4KoA3JrImU3jfUrP+Ih5EneCBNdFTBEm+wWCXRAi92yQ1gAAACV0RVh0ZGF0ZTpj cmVhdGUAMjAyMi0xMi0wMVQwNjo1ODoxNCswMDowMGf3FLIAAAAldEVYdGRhdGU6bW9kaWZ5ADIw MjItMTItMDFUMDY6NTg6MTQrMDA6MDAWqqwOAAAAAElFTkSuQmCC"
              />
            </svg>
            {useFormatMessage("modules.drive.buttons.rename")}
          </div>
        )
      },
      {
        key: "5",
        label: (
          <div className="d-flex align-items-center">
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
              xmlSpace="preserve"
              className="me-50">
              {" "}
              <image
                id="image0"
                width="20"
                height="20"
                x="0"
                y="0"
                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAhFBMVEUAAAApKTEgIDApLDAp LTEpLTImKzEoKzAoLTIoLTIpLDEoLTMqLTIpLTInLDMoLDApLTIoLDAoLDEpLTEoLTEnLDAoLTEq LjMoLTMpLDEgMDAoKzIoLDQnLTIoLDIoMDAoKzMnLDIpLTIpLjInLTIwMDAnKjAoLjMoLjAoKDgp LTL///+Ev98AAAAAKnRSTlMAHxBv7+8vX59gz7/vr29A33+/3z9v38+fvxCfQK9/IF+vj9+PEE9f XyCi1lisAAAAAWJLR0QrJLnkCAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+YMAQY7LpVs Rh4AAAC0SURBVBjTXdDbEoIgEIDhVSMxzZDMc1jScd//AWORkvxvZL7B3RkAXAEVgl+0QYptPYuR Jyb+p7vUfhLMPN3nDg/CaVjIo6kAKPFUMqthhXXTNAyNtnZbB9DjQPdFRjrQtgCgOtshgitSGmwQ 1YwSZiUc8WJR4bW3c32EqdY6EyukuKDFsMZY4g3gjrmPStu9jC/Ypu4wseBrD3y60yiwj14mJVH8 /hl5Zl8Yter8h+/epkU+RtoRzVKCRkQAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjItMTItMDFUMDY6 NTk6NDYrMDA6MDBXSmDBAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIyLTEyLTAxVDA2OjU5OjQ2KzAw OjAwJhfYfQAAAABJRU5ErkJggg=="
              />
            </svg>
            {useFormatMessage("modules.drive.buttons.copy")}
          </div>
        )
      },
      {
        key: "6",
        label: (
          <div
            className="d-flex align-items-center"
            onClick={(e) => handleClickDelete(e)}>
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
              xmlSpace="preserve"
              className="me-50">
              {" "}
              <image
                id="image0"
                width="20"
                height="20"
                x="0"
                y="0"
                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAgVBMVEUAAAAgIDApKTEoLDEp LDEgMDAoKzAoLDIoLTIoLjIoKzMoKzIpLTInLTIoKDApLTEpLTEwMDApLTMoLTMpLjMpLTMpMTEn LDMoMDArKzEoLjAlKjAqLTQoLTEoLDQpLDEpLDMoKDgoLTEpLDMpLTIpLTIoLTIpLDIoLDApLTL/ //+pk07PAAAAKXRSTlMAEB+/zxBff2B/X5/vjyDf7xC/n2+vH28gL18wTz9Av88g32+P35+vf0+K m1AAAAABYktHRCpTvtSeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5gwBCQET4/GTSwAA AKlJREFUGNNVkFkWgjAMAEOxpmqRsoiIKyJi7n9BW+jGfOVN2mwAloSxBNYkKWk2fCW3hELsaL96 eJBMIzMnjmmuyKPy1NQoyiqrxUKNWXVq7O+okO8ig1RnGwhizrV+ACMvnYbBlW5W3ukBT9P6NYcL Js17DY9kKBSVN7LQC7w5DOTXJwQYEGsAJD9c2PkT5Ph10TR6OUnsZn7Kp6Et3ZHKJr5o3y+DzvwB nJEQFLQCmz8AAAAldEVYdGRhdGU6Y3JlYXRlADIwMjItMTItMDFUMDg6MDE6MTkrMDE6MDDJOJkv AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIyLTEyLTAxVDA4OjAxOjE5KzAxOjAwuGUhkwAAAABJRU5E rkJggg=="
              />
            </svg>
            {useFormatMessage("modules.drive.buttons.delete")}
          </div>
        )
      },
      {
        key: "7",
        label: (
          <div
            className="d-flex align-items-center"
            onClick={(e) => handleClickFavorite(e)}>
            <Fragment>{renderFavoriteIcon()}</Fragment>
            {useFormatMessage("modules.drive.buttons.favorite")}
          </div>
        )
      },
      {
        key: "8",
        label: (
          <div className="d-flex align-items-center">
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
              xmlSpace="preserve"
              className="me-50">
              {" "}
              <image
                id="image0"
                width="20"
                height="20"
                x="0"
                y="0"
                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAh1BMVEUAAAAoLTEnKzIoKzIo LDInKjAoLTEpLjIoKzAoLTApLTMoLDQgMDAoLjMpLTIpKzIoLDAnLDMpLDAnLDIoLDEqLjMpLTIp LDInLjMwMDApLTInLTIpLDEpLDMpLDEoLTIoLTMpLDMnLDAlKjUpLTMpLjMgIDAnLTIpLTEnLTQo LTMpLTL///8fSBFHAAAAK3RSTlMAP4+ff0/f31+fv0AQX9+Pf29vr7/Pj69vEO+vv8/Pn79vbzCv bxCP30+ft4UAIgAAAAFiS0dELLrdcasAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfmDAEJ BA79gAvXAAAAsklEQVQY05VQyxKCMBBrpQLyqKgFFJT6RCT//3/uFhiGIz1kspl0kl0h1j658Twl F9LWB4IA8MNZ2yGKEyGSVGM/a2qiCt5AMhwIjycTOtV5pfMZ5DkMkQIcV2qCkN1nhktV06wZrjf+ 1DC1bNKW7YN4n36WFbV54ElZSGn2axfEeVc0DSLX5SVcXkaYRu+P08bO1qljZzvRgpZuhWilwXde npZG1wH6t7hTrPpexasv/gcTIA1LJ8FJDwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMi0xMi0wMVQw ODowNDoxNCswMTowME7GM6sAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMTItMDFUMDg6MDQ6MTQr MDE6MDA/m4sXAAAAAElFTkSuQmCC"
              />
            </svg>
            {useFormatMessage("modules.drive.buttons.view_detail")}
          </div>
        )
      }
    ]
  } else {
    items = [
      {
        key: "1",
        label: (
          <div className="d-flex align-items-center">
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
              xmlSpace="preserve"
              className="me-50">
              {" "}
              <image
                id="image0"
                width="20"
                height="20"
                x="0"
                y="0"
                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAilBMVEUAAAAgIDApKTEoKzAo LDEnLDIoLDApLTMpLjMoLTInLTIpLTIoLDIoMDApLDEmKzEoLTEoLTIwMDApLTIoLTEoLDQpLTIn LDApLDAnLTAgMDAoKDApLTMpLDEpLDMoKzIpMTEoLjMqLjMpLTIrKzEnLDEoLjAnKzIpLTEoKzMq LTIrMTEpLTL///8VnYV0AAAALHRSTlMAEB9fv69/v29gj99/IM8v358Q7z9Aj29vTxAgr7/Pnx9f z68vz1+P71/vLyZ1my4AAAABYktHRC3N2kE9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH 5gwBBjcnQAWxtgAAAKdJREFUGNOFkOkSgjAMhAtFkPsonqgFb3Hf//lsClJRZ8ifJF872U0YmwjL /kHcATAbcxfe3A9C8BGLKMUJUgOzvMuFcAZWYtFXSzFAH/ZXxVeqLNl6Q02ELaUKO1Yonb0gjeyg P8qwVqOQag0XjYaChItjozVOQTe6c6jHGYuif2TSuFECWo9V7wUozkjImnVB/bH3FZmMbnc8RheK 8xat95y69594AV0CCuxtCyZJAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIyLTEyLTAxVDA2OjU1OjM5 KzAwOjAwsfv5vwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMi0xMi0wMVQwNjo1NTozOSswMDowMMCm QQMAAAAASUVORK5CYII="
              />
            </svg>
            {useFormatMessage("modules.drive.buttons.get_link")}
          </div>
        )
      },
      {
        key: "2",
        label: (
          <div className="d-flex align-items-center">
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
              xmlSpace="preserve"
              className="me-50">
              {" "}
              <image
                id="image0"
                width="20"
                height="20"
                x="0"
                y="0"
                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAYFBMVEUAAAAWFisUFCkVFSoU FCoTEyoQECkUFCoUFCsUFCoUFCgQECAYGCgUFCsQECgTEykQEDAUFCoTEyoVFSoVFSkTEysWFiYU FCkZGSkTEygUFCgTEykUFCsUFCwUFCr///8EFbi3AAAAHnRSTlMAL4/fz58ff++vfxAgjyDfEO9P n29fL78fXz+/v0A1/6VtAAAAAWJLR0QfBQ0QvQAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1F B+YMAQY4OEqVoIwAAACTSURBVBjTjZDbEoMgDEQplyKCVBTa2sv+/2c2KjMl9qX7AMuZZDNECNJJ KqXNWbSy6JxxHXrGpKcrDA2NkNUNwKWGGOUrHK11SNNq09zmB52oNiCzqWFNDij761qpMnTA1orS QHVjMG5xOTM4uns7oIgf/QnjssHHxPfUE1zAPke7mPGE9jzAAnj54yB76N31/toPxg8ISyDyf6YA AAAldEVYdGRhdGU6Y3JlYXRlADIwMjItMTItMDFUMDY6NTY6NTYrMDA6MDBq6zvSAAAAJXRFWHRk YXRlOm1vZGlmeQAyMDIyLTEyLTAxVDA2OjU2OjU2KzAwOjAwG7aDbgAAAABJRU5ErkJggg=="
              />
            </svg>
            {useFormatMessage("modules.drive.buttons.download")}
          </div>
        )
      },
      {
        key: "3",
        label: (
          <div
            className="d-flex align-items-center"
            onClick={(e) => handleClickFavorite(e)}>
            <Fragment>{renderFavoriteIcon()}</Fragment>
            {useFormatMessage("modules.drive.buttons.favorite")}
          </div>
        )
      },
      {
        key: "4",
        label: (
          <div className="d-flex align-items-center">
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
              xmlSpace="preserve"
              className="me-50">
              {" "}
              <image
                id="image0"
                width="20"
                height="20"
                x="0"
                y="0"
                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAh1BMVEUAAAAoLTEnKzIoKzIo LDInKjAoLTEpLjIoKzAoLTApLTMoLDQgMDAoLjMpLTIpKzIoLDAnLDMpLDAnLDIoLDEqLjMpLTIp LDInLjMwMDApLTInLTIpLDEpLDMpLDEoLTIoLTMpLDMnLDAlKjUpLTMpLjMgIDAnLTIpLTEnLTQo LTMpLTL///8fSBFHAAAAK3RSTlMAP4+ff0/f31+fv0AQX9+Pf29vr7/Pj69vEO+vv8/Pn79vbzCv bxCP30+ft4UAIgAAAAFiS0dELLrdcasAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfmDAEJ BA79gAvXAAAAsklEQVQY05VQyxKCMBBrpQLyqKgFFJT6RCT//3/uFhiGIz1kspl0kl0h1j658Twl F9LWB4IA8MNZ2yGKEyGSVGM/a2qiCt5AMhwIjycTOtV5pfMZ5DkMkQIcV2qCkN1nhktV06wZrjf+ 1DC1bNKW7YN4n36WFbV54ElZSGn2axfEeVc0DSLX5SVcXkaYRu+P08bO1qljZzvRgpZuhWilwXde npZG1wH6t7hTrPpexasv/gcTIA1LJ8FJDwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMi0xMi0wMVQw ODowNDoxNCswMTowME7GM6sAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMTItMDFUMDg6MDQ6MTQr MDE6MDA/m4sXAAAAAElFTkSuQmCC"
              />
            </svg>
            {useFormatMessage("modules.drive.buttons.view_detail")}
          </div>
        )
      }
    ]
  }

  // ** render
  return (
    <Fragment>
      <Dropdown
        menu={{
          items
        }}
        placement="bottom"
        trigger="click"
        overlayClassName="dropdown-action-file-and-folder">
        <Button.Ripple color="flat-info" className="btn-icon">
          <i className="fas fa-ellipsis-h" />
        </Button.Ripple>
      </Dropdown>
    </Fragment>
  )
}

export default ActionFile
