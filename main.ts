import pluralize from "pluralize";
import { capitalCase } from "capital-case";

export function toFriendlyLabel(key: string): string {
  return capitalCase(key);
}

export { pluralize };

const PIPE_SEPARATOR = " | ";

export const formData01Shape = {
  name: "" as string,
  email: "" as string,
  obligorObligations: [] as readonly {
    readonly obligor: string;
    readonly obligation: string;
  }[],
  accountCredits: [] as readonly {
    readonly accountNumber: string;
    readonly credit: number;
  }[],
} as const;

type FormData01 = typeof formData01Shape;

type StringFields<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};

type ObjectFields<T> = {
  [K in keyof T as T[K] extends object ? K : never]: T[K];
};

type FormData01ObjectFields = ObjectFields<FormData01>;

type SomeTypes = "BLORB" | "OTHER";

export const example: Partial<FormData01> = {
  name: "John Doe",
  email: "drjors2@gmail.com",
  obligorObligations: [
    {
      obligor: "Obligor 1",
      obligation: "Obligation 1",
    },
    {
      obligor: "Obligor 2",
      obligation: "Obligation 2",
    },
  ],
  accountCredits: [
    {
      accountNumber: "Account 1",
      credit: 100,
    },
    { accountNumber: "Account 2", credit: 200 },
  ],
};

interface Metadata<T> {
  name: string;
  dataType: SomeTypes;
  value: T;
}

export function toStringMetadata(value: string): Metadata<string> {
  return { name: value, dataType: "BLORB", value };
}

const formData01StringKeys = (
  Object.keys(formData01Shape) as (keyof FormData01)[]
).filter(
  (key): key is keyof StringFields<FormData01> =>
    typeof formData01Shape[key] === "string",
);

export function extractStringFields(input: any): Metadata<string>[] {
  return formData01StringKeys.reduce((acc, key) => {
    if (typeof input[key] === "string") {
      acc.push({
        name: toFriendlyLabel(key),
        dataType: "BLORB",
        value: input[key],
      });
    }
    return acc;
  }, [] as Metadata<string>[]);
}

export function toObjectMetadata<T extends object>(
  name: string,
  value: T,
): Metadata<T> {
  return { name, dataType: "OTHER", value };
}

const formData01ObjectKeys = (
  Object.keys(formData01Shape) as (keyof FormData01)[]
).filter(
  (key): key is keyof ObjectFields<FormData01> =>
    typeof formData01Shape[key] === "object" && formData01Shape[key] !== null,
);

function objectFieldReducer(
  acc: Metadata<string>[],
  key: string,
  val: any,
  dataType: SomeTypes = "OTHER",
): Metadata<string>[] {
  if (typeof val !== "object" || val === null) return acc;
  if (Array.isArray(val) && val.length > 0) {
    const innerKeys = Object.keys(val[0]) as (keyof (typeof val)[0])[];
    innerKeys.forEach((innerKey) => {
      acc.push({
        name: toFriendlyLabel(pluralize(String(innerKey))),
        dataType,
        value: val.map((entry: any) => entry[innerKey]).join(PIPE_SEPARATOR),
      });
    });
  } else {
    acc.push({
      name: toFriendlyLabel(key),
      dataType,
      value: String(val),
    });
  }
  return acc;
}

export function extractObjectFields(input: any): Metadata<string>[] {
  return formData01ObjectKeys.reduce(
    (acc, key) => objectFieldReducer(acc, key, input[key]),
    [] as Metadata<string>[],
  );
}
