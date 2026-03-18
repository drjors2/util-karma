# util-karma

A TypeScript utility for extracting typed metadata from structured form data. Fields are classified and normalized into `Metadata` objects — string fields map to labelled scalar metadata, and array-of-object fields are unpacked into per-key metadata arrays dynamically.

## Features

- **Type-safe field extraction** using TypeScript mapped types
- **Dynamic inner-key derivation** — no hardcoded field names for array fields
- **Dual test runners** — Jest (Node) and Karma (Chrome)

## Installation

```bash
npm install
```

## Usage

```ts
import { extractStringFields, extractObjectFields, example } from "./main";

// String fields → Metadata<string>[]
extractStringFields(example);
// [
//   { name: "name",  dataType: "BLORB", value: "John Doe" },
//   { name: "email", dataType: "BLORB", value: "drjors2@gmail.com" }
// ]

// Array-of-object fields → Metadata<object>[] (keys derived at runtime)
extractObjectFields(example);
// [
//   { name: "obligor",    dataType: "OTHER", value: ["Obligor 1", "Obligor 2"] },
//   { name: "obligation", dataType: "OTHER", value: ["Obligation 1", "Obligation 2"] },
//   { name: "account",    dataType: "OTHER", value: ["Account 1"] },
//   { name: "credit",     dataType: "OTHER", value: [100] }
// ]
```

## API

### `extractStringFields(input): Metadata<string>[]`

Extracts all `string` fields from `input` that match keys defined in `formData01Shape`. Each result uses the field key as `name`.

### `extractObjectFields(input): Metadata<object>[]`

Extracts all `object` / array fields. For array fields, inner object keys are read from the first element and each key produces its own `Metadata` entry containing an array of values across all items.

### `Metadata<T>`

```ts
interface Metadata<T> {
  name: string;       // field key or inner key name
  dataType: "BLORB" | "OTHER";
  value: T;
}
```

## Scripts

| Command | Description |
|---|---|
| `npm test` | Run tests with Jest (Node) |
| `npm run test:watch` | Jest in watch mode |
| `npm run build` | Compile TypeScript to `dist/` |

## License

MIT
