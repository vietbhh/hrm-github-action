/**
 * Copyright (c) Ladifire, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export function mergeRefs(arg) {
  const a = arg.length
  const c = new Array(a)
  for (let d = 0; d < a; d++) c[d] = arg[d]
  return function (a) {
    c.forEach(function (c) {
      if (c === null) return
      if (typeof c === "function") {
        c(a)
        return
      }
      if (typeof c === "object") {
        c.current = a
        return
      }
      console.warn(
        "mergeRefs cannot handle Refs of type boolean, number or string, received ref " +
          c,
        "comet_ui"
      )
    })
  }
}
