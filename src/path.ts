import { rule } from './patterns'

type Segment = number | string

export class Path {
  public static readonly Default = () => new Path([-1])
  public static readonly From = (segment: Segment) => new Path([segment])
  constructor(
    public readonly segments: Segment[]
  ) {
  }

  public moveTo(segment: Segment) {
    const s = this.segments.slice(0, -1)
    s.push(segment)
    return new Path(s)
  }

  public add(segment: Segment) {
    const s = this.segments.slice(0)
    s.push(segment)
    return new Path(s)
  }

  public compareTo(path: Path): number {
    const l0 = this.segments.length
    const l1 = path.segments.length
    for (let i = 0; i < l0 && i < l1; i++) {
      const s0 = this.segments[i]
      const s1 = path.segments[i]
      if (typeof s0 === 'number' && typeof s1 === 'string')
        return -1
      if (typeof s0 === 'string' && typeof s1 === 'number')
        return 1

      if (s0 < s1)
        return -1
      if (s0 > s1)
        return 1

      // If one of the paths is deeper than the other, but equivalent
      // up to the end of the more shallow path then
      // the shallower path is considered to be less than the deeper one
      if (l0 - i === 1 && l1 - i > 1)
        return -1
      if (l1 - i === 1 && l0 - i > 1)
        return 1
    }

    // All segments are the same and the depth of both paths is the same
    return 0
  }

  public toString() {
    return this.segments.join('.')
  }
}
