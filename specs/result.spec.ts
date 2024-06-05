import { describe, it, expect } from "vitest";
import { Ok, Err, Result } from "../src/result";

describe("Result", () => {
  type Person = { name: string; age: number };
  const person: Person = { name: "jason", age: 4 };

  it("should have map", () => {
    Ok(person)
      .map((p) => p && p.name)
      .cata({
        Ok: (name) => expect(name).toBe("jason"),
        Err: () => {
          throw new Error();
        },
      });
  });

  it("should have chain", () => {
    Ok(person)
      .map((p) => p && p.name)
      .chain((name) => (name === "jason" ? Ok(name) : Err("Name not jason")))
      .cata({
        Ok: (name) => expect(name).toBe("jason"),
        Err: () => {
          throw new Error();
        },
      });

    Ok(person)
      .map((p) => p && p.name)
      .chain((name) => (name !== "jason" ? Ok(name) : Err("Name is jason")))
      .cata({
        Ok: () => {
          throw new Error();
        },
        Err: (msg) => expect(msg).toBe("Name is jason"),
      });
  });

  it("should have ap", () => {
    const add = (x: number) => (y: number) => x + y;
    const one = Ok(1);
    const two = Ok(2);

    Ok(add)
      .ap(one)
      .ap(two)
      .cata({
        Ok: (x) => expect(x).toBe(3),
        Err: () => {
          throw new Error();
        },
      });
  });

  it("should be instantiable without arguments", () => {
    Ok()
      .map(() => person)
      .cata({
        Ok: (p) => expect(p).toBe(person),
        Err: () => {
          throw new Error();
        },
      });
  });

  it("when instantiated with a defined value, callbacks don't need to check against undefined", () => {
    Ok(person)
      .map((p: Person): string => p.name)
      .chain(
        (name: string): Result<string, string> =>
          name === "jason" ? Ok(name) : Err("Name not jason")
      )
      .cata({
        Ok: (name) => expect(name).toBe("jason"),
        Err: () => {
          throw new Error();
        },
      });
  });

  it("should ignore mapErr if Ok", () => {
    Ok("hello")
      .mapErr((x) => x + "wedwed")
      .map((x) => x + " world")
      .mapErr((x) => x + "wedwed")
      .cata({
        Ok: (x) => expect(x).toBe("hello world"),
        Err: () => {
          throw new Error();
        },
      });
  });

  it("should ignore chainErr if Ok", () => {
    Ok("hello")
      .chainErr((x) => Err(x + "wedwed"))
      .map((x) => x + " world")
      .chainErr((x) => Err(x + "wedwed"))
      .cata({
        Ok: (x) => expect(x).toBe("hello world"),
        Err: () => {
          throw new Error();
        },
      });
  });

  it("should use mapErr if Err", () => {
    Err("hello")
      .mapErr((x) => x + " some err")
      .map((x) => x + " world")
      .mapErr((x) => x + " some err")
      .cata({
        Ok: () => {
          throw new Error();
        },
        Err: (x) => expect(x).toBe("hello some err some err"),
      });
  });

  it("should use chainErr if Err", () => {
    Err("hello")
      .chainErr((x) => Err(x + " some err"))
      .map((x) => x + " world")
      .chainErr((x) => Err(x + " some err"))
      .cata({
        Ok: () => {
          throw new Error();
        },
        Err: (x) => expect(x).toBe("hello some err some err"),
      });
  });

  it("should flip back to Ok if chainErr returns an Ok", () => {
    Err("hello")
      .chainErr((x) => Err(x + " some err"))
      .map((x) => x + " world")
      .chainErr((x) => Ok(x + " not some err"))
      .cata({
        Ok: (x) => expect(x).toBe("hello some err not some err"),
        Err: () => {
          throw new Error();
        },
      });

    Err("hello")
      .chainErr((x) => Ok(x + " some err"))
      .map((x) => x + " world")
      .cata({
        Ok: (x) => expect(x).toBe("hello some err world"),
        Err: () => {
          throw new Error();
        },
      });
  });

  it("should swap Err for Ok and Ok for Err", () => {
    Ok("hello")
      .swap()
      .cata({
        Ok: () => {
          throw new Error();
        },
        Err: (x) => expect(x).toBe("hello"),
      });

    Err("hello")
      .swap()
      .cata({
        Ok: (x) => expect(x).toBe("hello"),
        Err: () => {
          throw new Error();
        },
      });

    Ok("hello")
      .swap()
      .swap()
      .swap()
      .cata({
        Ok: () => {
          throw new Error();
        },
        Err: (x) => expect(x).toBe("hello"),
      });
  });

  it("should have a bimap to map over both ok and err at once", () => {
    Ok("hello")
      .bimap(
        (x) => x + " world",
        (x) => x + " goodbye"
      )
      .cata({
        Ok: (x) => expect(x).toBe("hello world"),
        Err: () => {
          throw new Error();
        },
      });

    Err("hello")
      .bimap(
        (x) => x + " world",
        (x) => x + " goodbye"
      )
      .cata({
        Ok: () => {
          throw new Error();
        },
        Err: (x) => expect(x).toBe("hello goodbye"),
      });
  });

  it("should convert Result to Maybe", () => {
    Ok(6)
      .toMaybe()
      .cata({
        Just: (x) => expect(x).toBe(6),
        Nothing: () => {
          throw new Error();
        },
      });

    Err()
      .toMaybe()
      .cata({
        Just: () => {
          throw new Error();
        },
        Nothing: () => {},
      });
  });

  it("should return the value or error", () => {
    expect(Ok(6).value()).toBe(6);

    expect(Err("Test Error").value()).toEqual("Test Error");
  });
});
