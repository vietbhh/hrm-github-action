export const getFileAndFolderIcon = (type, extension) => {
  if (type === "folder") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        version="1.1"
        id="Layer_1"
        x="0px"
        y="0px"
        width="25px"
        height="20px"
        viewBox="0 0 25 20"
        enableBackground="new 0 0 25 20"
        xmlSpace="preserve">
        {" "}
        <image
          id="image0"
          width="25"
          height="20"
          x="0"
          y="0"
          href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAUCAMAAABPqWaPAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAP1BMVEUAAADvnxD0mQz1mA31 mQz3nAj1mAz0mAv3lxD1mQz0mAz2mAv/nAj2mAz1mA31mA31mA72mQz/nxD1mA3///+ZlIY0AAAA E3RSTlMAEI/fzx+vnyB/v28fv6+f348QswCPPwAAAAFiS0dEFJLfyTUAAAAJcEhZcwAACxMAAAsT AQCanBgAAAAHdElNRQfmCx4GFQT/ih09AAAASklEQVQoz2NgYGRiBgMWVgY0wCYMBSyMqBKMwnDA jirDgZAR5sQpI8wFA9zoMigm45ARZsQpwzMqAwwdBl6sEnygwOYXwASCQgwAlmUd1ikAxnkAAAAl dEVYdGRhdGU6Y3JlYXRlADIwMjItMTEtMzBUMDU6MjE6MDQrMDE6MDAloW1yAAAAJXRFWHRkYXRl Om1vZGlmeQAyMDIyLTExLTMwVDA1OjIxOjA0KzAxOjAwVPzVzgAAAABJRU5ErkJggg=="
        />
      </svg>
    )
  }

  if (extension === "mp3") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        version="1.1"
        id="Layer_1"
        x="0px"
        y="0px"
        width="19px"
        height="22px"
        viewBox="0 0 19 22"
        enableBackground="new 0 0 19 22"
        xmlSpace="preserve">
        {" "}
        <image
          id="image0"
          width="19"
          height="22"
          x="0"
          y="0"
          href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAWCAMAAAAVQ1dNAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAYFBMVEUAAAD/zyD/0i3/0Sz/ 1in/1Cv/0Sz/0Cv/0S3/0Sv/0Cz/0Sz/zzD/0S3/0iz/0S3/zy3/0C3/zzD/0S7/zyr/0C3/0Cv/ 0i3/zyj/0Cz/0Cz/0S7/1jH/zyz/0Sz///9y+/yMAAAAHnRSTlMAEE9/Hy9vn9+Pv+8Q77+PUK8g bzCf3z8gr89fH0AZ+JtnAAAAAWJLR0QfBQ0QvQAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1F B+YLHgYWLg8chygAAACFSURBVBjTxdHdFoMgCABgNktsmVb2t9V4/8dMwyz3AuNG+DwqHAHyeDxF ca9LiYqIMG1Xr5o4ommuG2Pb7rSeSKEbQjre7Lz5HyYVTXVu4ppjRhTBlmu2N2cFyGTxQGafZHPM VqBkvo0QCsBE0/4161ezATgmy00t+liOR7qfb+md+2awA8N4FC2h/92YAAAAJXRFWHRkYXRlOmNy ZWF0ZQAyMDIyLTExLTMwVDA1OjIyOjQ2KzAxOjAw3UPJogAAACV0RVh0ZGF0ZTptb2RpZnkAMjAy Mi0xMS0zMFQwNToyMjo0NiswMTowMKwecR4AAAAASUVORK5CYII="
        />
      </svg>
    )
  }

  if (
    extension === "png" ||
    extension === "jpg" ||
    extension === "jpeg" ||
    extension === "image"
  ) {
    return (
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
          href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAWCAMAAAAYXScKAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAASFBMVEUAAAD/UFD6UVH5UFD8 UVH3UFD5UFD4UFD/UlL5UFD4UFD5UFD5UFD3UFD0UFD7UVH4UFD6UFD6UFD3UFD6UFD5UFD5UFD/ //8hhG1IAAAAFnRSTlMAEF9/TyDf3x+fv+/PQDA/b2+/YI9QEW+jaAAAAAFiS0dEFwvWmI8AAAAJ cEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfmCx4EGBUjEJfsAAAAe0lEQVQY033RyxKDIBBE0cuQ CIrmoYb//9RMMJXCgUovz4IuesCJP+cCXIdsEyJjbjOROprIvRSdF0mt3sC3eseUFg0P33m33/ZX Q3y2OkcQq6vTVb7805EjUquHirFYvnmoVMimqrOkpUZ2XXJSHU75NPcvBC9zzc3xBlMKG+vZcgc0 AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIyLTExLTMwVDA0OjI0OjIxKzAwOjAwtr8wDAAAACV0RVh0 ZGF0ZTptb2RpZnkAMjAyMi0xMS0zMFQwNDoyNDoyMSswMDowMMfiiLAAAAAASUVORK5CYII="
        />
      </svg>
    )
  }

  if (extension === "mp4") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        version="1.1"
        id="Layer_1"
        x="0px"
        y="0px"
        width="25px"
        height="18px"
        viewBox="0 0 25 18"
        enableBackground="new 0 0 25 18"
        xmlSpace="preserve">
        {" "}
        <image
          id="image0"
          width="25"
          height="18"
          x="0"
          y="0"
          href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAASCAMAAACZ8IWSAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAASFBMVEUAAABAz2A6zmM7yWI6 yGM7yGI7yGM1xWA4x2A7yWM6y2E7yWM7yWI6yWI7yWM8x2Q7yGM7ymM5yGM6yGM7ymM4x2g7yWP/ //+VyqizAAAAFnRSTlMAEB+Pr5+/MCDPT1/ff99An89v378g0PxzhQAAAAFiS0dEFwvWmI8AAAAJ cEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfmCx4EGhKPQmDNAAAAZElEQVQY083RuRKAMAhF0Qdu aDTGjf//VKPOSNx6b5HmDEUAAIgtgkWZpuV8SqHXynNE71WQsm4AeYiTNr70It0Gyi9y9E/p/Jc4 8ftPn9vpIWEY4+KyG0x2hXCBmdMLLZZdbgX2gh1CG7jl2gAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAy Mi0xMS0zMFQwNDoyNjoxOCswMDowMKldogEAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMTEtMzBU MDQ6MjY6MTgrMDA6MDDYABq9AAAAAElFTkSuQmCC"
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
      width="19px"
      height="24px"
      viewBox="0 0 19 24"
      enableBackground="new 0 0 19 24"
      xmlSpace="preserve">
      {" "}
      <image
        id="image0"
        width="19"
        height="24"
        x="0"
        y="0"
        href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAYCAMAAAAvSTY9AAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAASFBMVEUAAAAbkvQbkvEdkvEZ lPcdkfAdkvAdkvEek/EckfAQj+8ck/EbkvEckfEckvAdkvEck/IckvMhkvQgj+8dkvEdlPIdkvH/ //8GFUI/AAAAFnRSTlMAL4+fH9+/32/PEH+fb6/vvz8vII+fHlLVOgAAAAFiS0dEFwvWmI8AAAAJ cEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfmCx4EGxUIPcQvAAAAUklEQVQY0+XOSRKAIBBD0YAK zihi7n9UQau0qzmCf/myCWBs89bizlDUPehYo//A9+QwKsNEztoKWm0FF2lc852QJ0/d/8xVtmGv LAJHOmUp4gLljyCH5bzl5QAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMi0xMS0zMFQwNDoyNzoyMSsw MDowMF2Iiw8AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMTEtMzBUMDQ6Mjc6MjErMDA6MDAs1TOz AAAAAElFTkSuQmCC"
      />
    </svg>
  )
}

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024,
    dm = decimals,
    sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

export const _getUploadProcess = (listUploadingFile) => {
  let isUploadComplete = true

  _.map(listUploadingFile, (item) => {
    if (item.progress < 100 && item.canceled === undefined) {
      isUploadComplete = false
      return false
    }
  })

  return isUploadComplete
}
