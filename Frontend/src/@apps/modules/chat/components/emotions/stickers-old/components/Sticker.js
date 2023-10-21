/**
 * Copyright (c) Ladifire, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as React from "react"
import { CometAspectRatioContainer } from "./CometAspectRatioContainer"
import { CometAnimatedSticker } from "./CometAnimatedSticker"
import classNames from "classnames"
const styles = {
  root: {
    width: 58,
    height: 58
  },
  sticker: {
    width: "100%",
    height: "100%"
  }
}
export const Sticker = (props) => {
  const { frameCount, frameRate, framesPerCol, framesPerRow, spriteImg } = props
  return React.createElement(
    "div",
    { className: classNames(styles.root) },
    React.createElement(
      CometAspectRatioContainer,
      { aspectRatio: 1 },
      React.createElement(CometAnimatedSticker, {
        animationTriggers: {
          hover: true,
          load: false
        },
        cursorEnabled: true,
        frameCount: frameCount,
        frameRate: frameRate,
        framesPerCol: framesPerCol,
        framesPerRow: framesPerRow,
        overlayEnabled: true,
        showFocusOverlay: true,
        showHoverOverlay: true,
        uri: spriteImg,
        xstyle: styles.sticker
      })
    )
  )
}
