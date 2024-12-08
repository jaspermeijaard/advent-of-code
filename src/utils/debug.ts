import { inspect } from "util"

export const log = <I>(i: I): I => {
  console.log(inspect(i, { showHidden: false, depth: null, colors: true }))
  return i
}
