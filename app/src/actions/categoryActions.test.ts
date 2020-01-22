import { getCategories } from "./categoryActions";

describe("hash", () => {
    it('get Categories', async () => {

        const categories = [
            {
                "id": 1,
                "name": "Maze"
            }
        ]
        
        expect(getCategories(categories)).toEqual({"categories": [{"id": 1, "name": "Maze"}], "type": "GET_CATEGORIES"});
    })
})