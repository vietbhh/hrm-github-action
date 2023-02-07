import AvatarList from "@apps/components/common/AvatarList"

const Typing = (props) => {
  const { typing } = props

  const renderAvatar = () => {
    if (!_.isEmpty(typing)) {
      const arrAva = []
      _.forEach(typing, (value) => {
        arrAva.push({
          id: value.id,
          src: value.avatar,
          title: value.name
        })
      })
      return <AvatarList data={arrAva} showNumberMore={true} />
    }

    return ""
  }

  return (
    <div id="div-typing">
      {renderAvatar()}{" "}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        style={{ marginLeft: "-7px" }}
        width="50px"
        height="50px"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid">
        <circle cx="34" cy="53.5" r="5" fill="#f3b72e">
          <animate
            attributeName="cy"
            calcMode="spline"
            keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5"
            repeatCount="indefinite"
            values="53.5;46.5;53.5;53.5"
            keyTimes="0;0.24000000000000002;0.48000000000000004;1"
            dur="1s"
            begin="-0.48000000000000004s"></animate>
        </circle>
        <circle cx="50" cy="53.5" r="5" fill="#3869c5">
          <animate
            attributeName="cy"
            calcMode="spline"
            keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5"
            repeatCount="indefinite"
            values="53.5;46.5;53.5;53.5"
            keyTimes="0;0.24000000000000002;0.48000000000000004;1"
            dur="1s"
            begin="-0.32s"></animate>
        </circle>
        <circle cx="66" cy="53.5" r="5" fill="#4686f4">
          <animate
            attributeName="cy"
            calcMode="spline"
            keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5"
            repeatCount="indefinite"
            values="53.5;46.5;53.5;53.5"
            keyTimes="0;0.24000000000000002;0.48000000000000004;1"
            dur="1s"
            begin="-0.16s"></animate>
        </circle>
      </svg>
    </div>
  )
}

export default Typing
