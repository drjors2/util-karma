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


const formData01StringKeys = (
  Object.keys(formData01Shape) as (keyof FormData01)[]
).filter(
  (key): key is keyof StringFields<FormData01> =>
    typeof formData01Shape[key] === "string",
);

export function extractStringFields(input: any): Metadata<string>[] {
  return formData01StringKeys.reduce((acc, key) => {
    if (typeof input[key] === "string") {
      acc.push(toStringMetadata(input[key]));
    }
    return acc;
  }, [] as Metadata<string>[]);
}

export function toObjectMetadata<T extends object>(name: string, value: T): Metadata<T> {
  return { name, dataType: "OTHER", value };
}

type ObligorEntry = { obligor: string; obligation: string };

type ObjectFieldsMetadata<T> = {
  -readonly [K in keyof ObjectFields<T>]: ObjectFields<T>[K] extends ObligorEntry[]
    ? Metadata<string[]>
    : Metadata<ObjectFields<T>[K]>;
};

const formData01ObjectKeys = (
  Object.keys(formData01Shape) as (keyof FormData01)[]
).filter(
  (key): key is keyof ObjectFields<FormData01> =>
    typeof formData01Shape[key] === "object" && formData01Shape[key] !== null,
);

function extractObligors(arr: ObligorEntry[]): string[] {
  return arr.map((entry) => entry.obligor);
}

export function extractObjectFields(
  input: any,
): ObjectFieldsMetadata<FormData01> {
  return formData01ObjectKeys.reduce((acc, key) => {
    const val = input[key];
    if (typeof val === "object" && val !== null) {
      const extracted = Array.isArray(val) ? extractObligors(val) : val;
      const metaName = Array.isArray(val) ? "obligor" : key;
      acc[key] = toObjectMetadata(metaName, extracted);
    }
    return acc;
  }, {} as ObjectFieldsMetadata<FormData01>);
}
