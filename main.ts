export function add(a: number, b: number): number {
  return a + b;
}

export const formData01Shape = {
  name: "" as string,
  email: "" as string,
  obligorObligations: [] as { obligor: string; obligation: string }[],
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
};

interface Metadata<T> {
  name: string;
  dataType: SomeTypes;
  value: T;
}

export function toStringMetadata(value: string): Metadata<string> {
  return { name: value, dataType: "BLORB", value };
}

type StringFieldsMetadata<T> = {
  -readonly [K in keyof StringFields<T>]: Metadata<string>;
};

const formData01StringKeys = (
  Object.keys(formData01Shape) as (keyof FormData01)[]
).filter(
  (key): key is keyof StringFields<FormData01> =>
    typeof formData01Shape[key] === "string",
);

export function extractStringFields(
  input: any,
): StringFieldsMetadata<FormData01> {
  return formData01StringKeys.reduce((acc, key) => {
    if (typeof input[key] === "string") {
      acc[key] = toStringMetadata(input[key]);
    }
    return acc;
  }, {} as StringFieldsMetadata<FormData01>);
}
