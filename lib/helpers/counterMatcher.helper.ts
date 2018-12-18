import {time} from "./time.helper";


export const counterMatcherHelper = {
  async initCounterMatcher() {
    await time.sleep(500, `Initializing counter matcher`);
    return async function(actual, expected) {
      if (typeof actual !== "number" || typeof expected !== "number") {
        throw new Error(`Matcher args should be numbers`);
      }
      return actual === expected;
    }
  }
};
