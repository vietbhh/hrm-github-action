/**
 * Copyright (c) Ladifire, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const __rest =
  (this && this.__rest) ||
  function (s, e) {
    const t = {}
    for (const p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p]
    if (s !== null && typeof Object.getOwnPropertySymbols === "function")
      for (
        const i = 0, p = Object.getOwnPropertySymbols(s);
        i < p.length;
        i++
      ) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]]
      }
    return t
  }
import * as React from "react"
import { CometAnimatedSprite } from "./CometAnimatedSprite"
export function CometAnimatedSticker(props) {
  const { alt, frameCount, frameRate, framesPerCol, framesPerRow, uri } = props,
    otherProps = __rest(props, [
      "alt",
      "frameCount",
      "frameRate",
      "framesPerCol",
      "framesPerRow",
      "uri"
    ])
  return React.createElement(
    CometAnimatedSprite,
    Object.assign({}, otherProps, {
      accessibilityCaption: alt,
      frameCount: frameCount,
      frameRate: frameRate,
      framesPerCol: framesPerCol,
      framesPerRow: framesPerRow,
      spriteUri: uri
    })
  )
}
