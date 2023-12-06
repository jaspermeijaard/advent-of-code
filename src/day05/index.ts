import run from "aocrunner"
import { flow, pipe } from "fp-ts/lib/function.js"
import { Math, String } from "../utils/index.js"
import Array, { chunksOf } from "fp-ts/lib/Array.js"
import { log } from "../utils/debug.js"

type Almanac = {
  seeds: number[]
  maps: Map[]
}

type Map = {
  src: string
  dst: string
  lookup: (n: number) => number
  lookupRange: (start: number, length: number) => void
}

const parseInput = (s: string): Almanac => {
  const [rSeeds, ...rMaps] = String.splitParagraphs(s)
  const seeds = rSeeds.match(/\d+/g)!.map(String.toNumber)
  const maps = pipe(
    rMaps,
    Array.map(String.splitLines),
    Array.map<string[], Map>(([rDescr, ...rRanges]) => {
      const [_, src, dst] = [...rDescr.matchAll(/([^-]+)-to-([^\W]+)/g)][0]

      const ranges = rRanges.map((r) => {
        const [dstStart, srcStart, length] = r
          .match(/\d+/g)!
          .map(String.toNumber)
        const srtStop = srcStart + length - 1
        return { srcStart, srtStop, dstStart }
      })

      const lookup = (n: number) => {
        const range = ranges.filter((r) => n >= r.srcStart && n < r.srtStop)
        if (range.length > 1) throw new Error()
        if (range.length === 0) return n
        return range[0].dstStart + (n - range[0].srcStart)
      }

      const lookupRange = (start: number, stop: number) => {
        const o = ranges.filter(
          (r) =>
            (start >= r.srcStart && start <= r.srtStop) ||
            (stop >= r.srcStart && stop <= r.srtStop),
        )
      }

      return { src, dst, lookup, lookupRange }
    }),
  )
  return { seeds, maps }
}

const mapLookup = (maps: Map[], n: number): number => {
  if (!maps.length) return n
  const [first, ...other] = maps
  return mapLookup(other, first.lookup(n))
}

const mapSeedsToLocationNumber = (seeds: number[], maps: Map[]): number[] =>
  seeds.map((n) => mapLookup(maps, n))

const part1 = flow(
  parseInput,
  (a) => mapSeedsToLocationNumber(a.seeds, a.maps),
  Math.min,
)

const part2 = flow(
  parseInput,
  (a) => {
    chunksOf(2)(a.seeds).map(([start, length]) => a.maps[0].lookupRange(50, 98))
  },
  () => 0,
)

const testInput = `
  seeds: 79 14 55 13

  seed-to-soil map:
  50 98 2
  52 50 48

  soil-to-fertilizer map:
  0 15 37
  37 52 2
  39 0 15

  fertilizer-to-water map:
  49 53 8
  0 11 42
  42 0 7
  57 7 4

  water-to-light map:
  88 18 7
  18 25 70

  light-to-temperature map:
  45 77 23
  81 45 19
  68 64 13

  temperature-to-humidity map:
  0 69 1
  1 0 69

  humidity-to-location map:
  60 56 37
  56 93 4
`

run({
  onlyTests: true,
  part1: {
    solution: part1,
    tests: [
      {
        input: testInput,
        expected: 35,
      },
    ],
  },
  part2: {
    solution: part2,
    tests: [
      {
        input: testInput,
        expected: 46,
      },
    ],
  },
})
