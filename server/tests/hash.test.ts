import { checkPassword, hashPassword } from "../hash";

describe("hash", () => {
    it('check hashed Password', async () => {
        const password = "testing";
        const hashed = await hashPassword(password);
        expect(await checkPassword(password, hashed)).toBe(true);
    })
})