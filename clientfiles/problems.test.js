
const difficulty = require('./problemtest');

describe("difficulty",()=>{
    test("calculates difficulty for rating between 500 and 1000 as Easy", () => {
        const problemRating = 750;
        
        const result = difficulty(problemRating);
        
        expect(result).toBe('Easy');
      });
})

