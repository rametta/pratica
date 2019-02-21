declare module pratica {

  export type Maybe = <T>(arg: T) => Just<T>|Nothing

  export type Just = <T>(arg: T) => ({
    ap(cb: () => any): Maybe<T>;
    map(cb: () => any): Just<T>;
    chain(cb: () => any): T;
    default(cb: () => any): Maybe<T>;
    cata: {
      Just(arg: T): any,
      Nothing(): any
    };
    inspect(): string;
    isNothing(): boolean;
    isJust(): boolean;
  })

  export type Nothing = () => ({
    ap(cb: () => any): Nothing;
    map(cb: () => any): Nothing;
    chain(cb: () => any): Nothing;
    default(cb: () => any): Maybe;
    cata: {
      Just(arg): any,
      Nothing(): any
    };
    inspect(): string;
    isNothing(): boolean;
    isJust(): boolean;
  })
  
}