import { generateUniqueNumber } from "../src/utils/unique-number-generator.util";

describe("UniqueNumberGenerate", () => {
    it("should generate unique number", () => {
        const prv = generateUniqueNumber(1111111111111, "PRV");
        const pub = generateUniqueNumber(1111111111111, "PUB");
        console.log({prv, pub});
        expect(prv).not.toEqual(pub);
    });
})