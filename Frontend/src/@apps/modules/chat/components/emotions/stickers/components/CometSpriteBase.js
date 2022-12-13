/**
 * Copyright (c) Ladifire, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import classNames from "classnames"
import * as React from "react"
import { useMergeRefs } from "../hooks/useMergeRefs"
const styles = {
  innerSprite: {
    animationDelay: "0s",
    animationFillMode: "forwards",
    animationIterationCount: "infinite",
    animationPlayState: "running",
    animationTimingFunction: "steps(1)",
    position: "absolute",
    start: 0,
    top: 0
  },
  spriteButton: {
    overflow: "hidden",
    position: "relative",
    ":active": {
      transform: "none"
    }
  }
}
// Some of props are not available for SHARE version
// Only use in Ladifire internal version
export function CometSpriteBase(props) {
  const {
    accessibilityCaption,
    animationStyle,
    containerRef,
    cursorEnabled = false,
    imgHeight,
    imgWidth,
    imgRef,
    linkProps,
    onHoverIn,
    onPress,
    overlayEnabled = false,
    pressableRef,
    showFocusOverlay = false,
    src,
    style,
    xstyle
  } = props
  const _mergeRefs = useMergeRefs(pressableRef, containerRef)
  return React.createElement(
    "div",
    {
      ref: _mergeRefs,
      className: classNames(styles.spriteButton, xstyle),
      onMouseOver: onHoverIn,
      style: style
    },
    React.createElement("img", {
      src: src,
      alt: accessibilityCaption,
      draggable: false,
      ref: imgRef,
      style: Object.assign(
        {
          height: imgHeight,
          width: imgWidth
        },
        animationStyle === null ? undefined : animationStyle()
      ),
      className: classNames(styles.innerSprite)
    })
  )
}
