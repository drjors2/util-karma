import pluralize from "pluralize";
import { capitalCase } from "capital-case";

export function toFriendlyLabel(key: string): string {
  return capitalCase(key);
}

export { pluralize };

export const formData01Shape = {
  name: "" as string,
  email: "" as string,
  obligorObligations: [] as { obligor: string; obligation: string }[],
  accontCredits: [] as { accountNumber: string; credit: number }[],
} as const;

type FormData01 = typeof formData01Shape;

type StringFields<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};

type ObjectFields<T> = {
  [K in keyof T as T[K] extends object ? K : never]: T[K];
};

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
  accontCredits: [
    {
      accountNumber: "Account 1",
      credit: 100,
    },
  ],
};

interface Metadata<T> {
  name: string;
  dataType: SomeTypes;
  value: T;
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
      acc.push({ name: toFriendlyLabel(key), dataType: "BLORB", value: input[key] });
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

export function extractObjectFields(input: any): Metadata<object>[] {
  return formData01ObjectKeys.reduce((acc, key) => {
    const val = input[key];
    if (typeof val === "object" && val !== null) {
      if (Array.isArray(val) && val.length > 0) {
        const innerKeys = Object.keys(val[0]) as (keyof (typeof val)[0])[];
        innerKeys.forEach((innerKey) => {
          acc.push(
            toObjectMetadata(
              toFriendlyLabel(pluralize(String(innerKey))),
              val.map((entry: any) => entry[innerKey]),
            ),
          );
        });
      } else {
        acc.push(toObjectMetadata(key, val));
      }
    }
    return acc;
  }, [] as Metadata<object>[]);
}
