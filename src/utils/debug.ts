import { inspect } from "util"

export const log = (...vars: any[]) =>
  console.log(inspect(vars, { showHidden: false, depth: null, colors: true }))
