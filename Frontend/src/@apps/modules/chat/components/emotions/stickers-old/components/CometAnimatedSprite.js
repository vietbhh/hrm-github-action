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
import { useInvalidNumberThrowsViolation } from "../hooks/useInvalidNumberThrowsViolation"
// NOTE: this is not available for SHARE version
// import {useVisibilityObserver} from '@ladifire-internal-ui/observer-intersection';
import { useCometAnimationTrigger } from "../hooks/useCometAnimationTrigger"
import { useSpriteAnimation } from "../hooks/useSpriteAnimation"
import { CometSpriteBase } from "./CometSpriteBase"
export function CometAnimatedSprite(props) {
  const {
      animationTriggers,
      frameCount,
      frameRate,
      framesPerCol,
      framesPerRow,
      repeatNumber = 3,
      spriteUri
    } = props,
    otherProps = __rest(props, [
      "animationTriggers",
      "frameCount",
      "frameRate",
      "framesPerCol",
      "framesPerRow",
      "repeatNumber",
      "spriteUri"
    ])
  let k = React.useState(null)
  const l = k[0]
  k = k[1]
  let c = useCometAnimationTrigger({
    animationTriggers: animationTriggers,
    frameCount: frameCount,
    frameRate: frameRate,
    iterationLimit: repeatNumber
  })
  const m = c.duration
  const n = c.getShouldAnimate
  const e = c.onHoverIn
  const i = c.onLoad
  const o = c.onNextAnimationIteration
  const p = useSpriteAnimation(frameCount, framesPerCol, framesPerRow)
  c = useInvalidNumberThrowsViolation(framesPerCol * 100)
  const d = useInvalidNumberThrowsViolation(framesPerRow * 100)
  // NOTE: This is not available for SHARE version
  // f = useVisibilityObserver({
  //     onVisible: i
  // });
  React.useEffect(() => {
    const a = l
    if (a !== null) {
      a.addEventListener("animationiteration", o)
      return function () {
        a.removeEventListener("animationiteration", o)
      }
    }
  }, [l, o])
  return React.createElement(
    CometSpriteBase,
    Object.assign({}, otherProps, {
      animationStyle: function (a) {
        return n(a)
          ? {
              animationDuration: m + "ms",
              animationName: p
            }
          : {
              animation: "none"
            }
      },
      // containerRef: f, // NOTE: not available for SHARE version
      imgHeight: c + "%",
      imgRef: k,
      imgWidth: d + "%",
      onHoverIn: e,
      src: spriteUri
    })
  )
}
