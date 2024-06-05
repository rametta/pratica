import { describe, it, expect } from "vitest";
import { Just, Maybe, Nothing } from "../src/maybe";
import { Ok, Err, Result } from "../src/result";
import { parseDate } from "../src/parseDate";
import { justs } from "../src/justs";
import { oks } from "../src/oks";
import { encase, encaseRes } from "../src/encase";
import { get } from "../src/get";
import { head } from "../src/head";
import { last } from "../src/last";
import { tail } from "../src/tail";
import { tryFind } from "../src/tryFind";
import { collectResult, collectMaybe } from "../src/collect";

describe("utililties", () => {
  it("parseDate: should properly parse date strings and return a Maybe", () => {
    const goodDate = "2019-02-13T21:04:10.984Z";
    const badDate = "2019-02-13T21:04:1";

    parseDate(goodDate).cata({
      Just: (date) => expect(date.toISOString()).toBe(goodDate),
      Nothing: () => {
        throw new Error();
      },
    });

    parseDate(badDate).cata({
      Just: () => {
        throw new Error();
      },
      Nothing: () => {},
    });

    parseDate(null).cata({
      Just: () => {
        throw new Error();
      },
      Nothing: () => {},
    });
  });

  it("justs: should filter out any non-just types in an array", () => {
    const data = [Just(19), Just("abc"), Nothing, Just(-78)];
    const jsts = justs(data);
    const allJusts = jsts.map((j) => j.isJust()).every((j) => !!j);

    expect(jsts).toHaveLength(3);
    expect(allJusts).toBe(true);
  });

  it("oks: should filter out any non-ok types in an array", () => {
    const data = [Ok(19), Err("no bueno")];
    const ok = oks(data);
    const allOks = ok.map((o) => o.isOk()).every((o) => !!o);

    expect(ok).toHaveLength(1);
    expect(allOks).toBe(true);
  });

  it("encase & encaseRes: should be able to handle throwable functions properly", () => {
    const throwableFunc = () => {
      throw new Error("i threw");
    };
    const throwableFunc2 = () => JSON.parse("<>");

    encase(() => "hello").cata({
      Just: (x) => expect(x).toBe("hello"),
      Nothing: () => {
        throw new Error();
      },
    });

    encase(throwableFunc).cata({
      Just: () => {
        throw new Error();
      },
      Nothing: () => {},
    });

    encaseRes(() => "hello").cata({
      Ok: (x) => expect(x).toBe("hello"),
      Err: () => {
        throw new Error();
      },
    });

    encaseRes<string, Error>(throwableFunc).cata({
      Ok: () => {
        throw new Error();
      },
      Err: (x) => expect(x && x.toString()).toBe("Error: i threw"),
    });

    encaseRes<string, Error>(throwableFunc2).cata({
      Ok: () => {
        throw new Error();
      },
      Err: (x) =>
        expect(x && x.toString()).toBe(
          `SyntaxError: Unexpected token '<', \"<>\" is not valid JSON`
        ),
    });

    encaseRes(() => JSON.parse(`{"name": "jason"}`)).cata({
      Ok: (x) => expect(x).toEqual({ name: "jason" }),
      Err: () => {
        throw new Error();
      },
    });
  });

  it("get: should safely get nested data and return a Maybe", () => {
    const data = {
      name: "jason",
      children: [
        {
          name: "bob",
          hasChild: false,
        },
        {
          name: "blanche",
          children: [
            {
              name: "lera",
            },
          ],
        },
      ],
    };

    get(["children", 1, "children", 0, "name"])(data).cata({
      Just: (name) => expect(name).toBe("lera"),
      Nothing: () => {
        throw new Error();
      },
    });

    get(["children", 7, "children", 0, "name"])(data).cata({
      Just: () => {
        throw new Error();
      },
      Nothing: () => {},
    });

    get(["children", 0, "hasChild"])(data).cata({
      Just: (hasChild) => expect(hasChild).toBe(false),
      Nothing: () => {
        throw new Error();
      },
    });
  });

  it("head: should get the first element on an array and return a Maybe", () => {
    const data = [5, 2, 3];

    head(data).cata({
      Just: (x) => expect(x).toBe(5),
      Nothing: () => {
        throw new Error();
      },
    });

    head([]).cata({
      Just: () => {
        throw new Error();
      },
      Nothing: () => {},
    });
  });

  it("last: should get the last element on an array and return a Maybe", () => {
    const data = [5, 2, 3];

    last(data).cata({
      Just: (x) => expect(x).toBe(3),
      Nothing: () => {
        throw new Error();
      },
    });

    last([]).cata({
      Just: () => {
        throw new Error();
      },
      Nothing: () => {},
    });
  });

  it("tail: should remove the first element on an array and return a Maybe", () => {
    const data = [5, 2, 3];

    tail(data).cata({
      Just: (x) => expect(x).toEqual([2, 3]),
      Nothing: () => {
        throw new Error();
      },
    });

    tail([]).cata({
      Just: () => {
        throw new Error();
      },
      Nothing: () => {},
    });
  });

  it("tryFind: should try to find an element in an array and return a maybe", () => {
    type Item = {
      name: string;
      age: number;
      id: string;
    };
    const data: Item[] = [
      { name: "jason", age: 6, id: "123abc" },
      { name: "bob", age: 68, id: "456def" },
    ];

    tryFind<Item>((x) => x.id === "123abc")(data).cata({
      Just: (person) => expect(person).toEqual(data[0]),
      Nothing: () => {
        throw new Error();
      },
    });

    tryFind<Item>((x) => x.id === "abcdef")(data).cata({
      Just: () => {
        throw new Error();
      },
      Nothing: () => {},
    });
  });

  it("collectResult: should collect an array of Oks into an Ok with an array of values", () => {
    const data = [Ok(5), Ok(2), Ok(3)];

    collectResult(data).cata({
      Ok: (x) => expect(x).toEqual([5, 2, 3]),
      Err: () => {
        throw new Error();
      },
    });
  });

  it("collectResult: should collect an array of Oks and Errs into an Err with an array of errors", () => {
    const data = [Ok(5), Err("nope"), Ok(3)];

    collectResult(data).cata({
      Ok: () => {
        throw new Error();
      },
      Err: (x) => expect(x).toEqual(["nope"]),
    });
  });

  it("collectResult: should collect an empty array into Ok([])", () => {
    const data: Array<Result<any, any>> = [];

    collectResult(data).cata({
      Ok: (x) => expect(x).toEqual([]),
      Err: () => {
        throw new Error();
      },
    });
  });

  it("collectMaybe: should collect an array of Justs into a Just with an array of values", () => {
    const data = [Just(5), Just(2), Just(3)];

    collectMaybe(data).cata({
      Just: (x) => expect(x).toEqual([5, 2, 3]),
      Nothing: () => {
        throw new Error();
      },
    });
  });

  it("collectMaybe: should return a Nothing if any Maybe is a Nothing", () => {
    const data = [Just(5), Nothing, Just(3)];

    collectMaybe(data).cata({
      Just: () => {
        throw new Error();
      },
      Nothing: () => {},
    });
  });
});

it("collectMaybe: should collect an empty array into Just([])", () => {
  const data: Array<Maybe<any>> = [];

  collectMaybe(data).cata({
    Just: (x) => expect(x).toEqual([]),
    Nothing: () => {
      throw new Error();
    },
  });
});
