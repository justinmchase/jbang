import { Path } from "./path.ts";

export class MetaStream {
  public static readonly Default = () =>
    new MetaStream(
      Path.Default(),
      [][Symbol.iterator](),
    );

  public static readonly From = (s: MetaStream | Iterable<unknown>) =>
    s instanceof MetaStream ? s : new MetaStream(
      Path.Default(),
      s[Symbol.iterator](),
    );

  private _next: MetaStream | undefined = undefined;
  private _done: boolean | undefined = undefined;

  constructor(
    public readonly path: Path,
    public readonly items: Iterator<unknown>,
    public readonly index = 0,
    public readonly value?: unknown,
  ) {
  }

  public get done(): boolean {
    if (this._done === undefined) {
      this.next();
    }
    return this._done!;
  }

  public next(): MetaStream {
    if (!this._next) {
      const { value, done } = this.items.next();
      this._done = done;
      if (done) return this;

      const i = this.index + 1;
      this._next = new MetaStream(
        this.path.moveTo(i),
        this.items,
        i,
        value,
      );
    }
    return this._next;
  }
}
