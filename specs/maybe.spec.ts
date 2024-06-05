import { describe, it, expect } from "vitest";
import { nullable } from "../src/maybe";

describe("Maybe", () => {
  it("should be a functor and implement map", () => {
    nullable("hello")
      .map((x) => `${x} world`)
      .map((x) => expect(x).toEqual("hello world"));
  });

  it("should handle nullable data", () => {
    expect(nullable(null).isNothing()).toEqual(true);
    expect(nullable(null).isJust()).toEqual(false);
    expect(nullable("some data").isNothing()).toEqual(false);
    expect(nullable("some data").isJust()).toEqual(true);
  });

  it("should implement chain", () => {
    nullable("hello")
      .chain((x) => nullable(x))
      .map((x) => x + " world")
      .cata({
        Just: (x) => expect(x).toBe("hello world"),
        Nothing: () => {
          throw new Error();
        },
      });

    nullable(null)
      .chain((x) => nullable(x))
      .map((x) => x + " world")
      .cata({
        Just: () => {
          throw new Error();
        },
        Nothing: () => {},
      });

    const x = nullable("hello")
      .chain((x) => nullable(null))
      .map((x) => x + " world")
      .map((x) => expect(x).toEqual("hello world "));

    expect(x.isNothing()).toBe(true);
    expect(x.isJust()).toBe(false);
  });

  it("should implement cata", () => {
    nullable("hello")
      .map((x) => x + " world")
      .cata({
        Just: (x) => expect(x).toBe("hello world"),
        Nothing: () => {
          throw new Error();
        },
      });

    nullable(null)
      .map(() => {
        throw new Error();
      })
      .chain(() => {
        throw new Error();
      })
      .cata({
        Just: () => {
          throw new Error();
        },
        Nothing: () => {},
      });
  });

  it("should return a default value if nothing", () => {
    nullable(null)
      .alt("some default")
      .cata({
        Just: (x) => expect(x).toBe("some default"),
        Nothing: () => {
          throw new Error();
        },
      });

    nullable("some data")
      .chain((data) => nullable(null))
      .alt("some default")
      .cata({
        Just: (x) => expect(x).toBe("some default"),
        Nothing: () => {
          throw new Error();
        },
      });
  });

  it(`should ignore the default if it's not nothing`, () => {
    nullable({ name: "jason" })
      .map((person) => person.name)
      .alt("some default")
      .cata({
        Just: (x) => expect(x).toBe("jason"),
        Nothing: () => {
          throw new Error();
        },
      });
  });

  it("should inspect properly", () => {
    expect(nullable("hello").inspect()).toBe("Just(hello)");
    expect(nullable(null).inspect()).toBe("Nothing");
  });

  it("should apply 2 monads with ap", () => {
    const add = (x: number) => (y: number) => x + y;
    const one = nullable(1);
    const two = nullable(2);

    nullable(add)
      .ap(one)
      .ap(two)
      .cata({
        Just: (x) => expect(x).toBe(3),
        Nothing: () => {
          throw new Error();
        },
      });

    nullable(null)
      .ap(one)
      .ap(two)
      .cata({
        Just: () => {
          throw new Error();
        },
        Nothing: () => {},
      });
  });

  it("should convert Maybe to Result", (ctx) => {
    nullable(6)
      .toResult()
      .cata({
        Ok: (x) => expect(x).toBe(6),
        Err: () => {
          throw new Error();
        },
      });

    nullable()
      .toResult()
      .cata({
        Ok: () => {
          throw new Error();
        },
        Err: () => {},
      });
  });

  it("should get inner value", () => {
    expect(nullable(6).value()).toBe(6);
    expect(nullable(null).value()).toBe(undefined);
    expect(
      nullable({ foo: "bar" })
        .map((v) => v.foo)
        .value()
    ).toBe("bar");
  });
});
