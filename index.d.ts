type Maybe<T> = Just<T>|Nothing

type Just<T> = {
  ap(cb: () => T): Maybe<T>
  map(cb: (arg: T) => T): Just<T>
  chain(cb: () => Maybe<T>): T
  default(cb: () => T): Maybe<T>
  cata: {
    Just(arg: T): any
    Nothing(): any
  }
  inspect(): string
  isNothing(): boolean
  isJust(): boolean
}

type Nothing = {
  ap(cb: () => any): Nothing
  map(cb: () => any): Nothing
  chain(cb: () => any): Nothing
  default(cb: () => any): Maybe<any>
  cata: {
    Just(arg): any
    Nothing(): any
  }
  inspect(): string
  isNothing(): boolean
  isJust(): boolean
}

export function Maybe<T>(arg: T): Just<T> | Nothing
export function Just<T>(arg: T): Just<T>
export function Nothing(): Nothing