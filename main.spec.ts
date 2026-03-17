import { example, extractObjectFields, extractStringFields } from "./main";

describe("formData01Shape", () => {
  it("has the correct shape", () => {
    console.log(extractStringFields(example));
    console.log(extractObjectFields(example));
  });
});
