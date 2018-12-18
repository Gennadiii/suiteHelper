import {counterMatcherHelper} from "../lib/helpers/counterMatcher.helper";
import {time} from "../lib/helpers/time.helper";
import {userHelper} from "../lib/helpers/user.helper";
import {suite} from "../lib/helpers/suite.helper";
process.env.deviceName = 'OnePlus 6T'; // In real life this one is set somewhere in config

let user1 = null;
let user2 = null;
let user3 = null;
let counter = 0;
let counterMatcher = null;
let users = null;
let currentUser = null;
const actualNums = [2, 3];

suite({
  name: ['Feature', 'SubFeature', 'SubSubFeature'],
  // users given to "suite" will be automatically created before tests and deleted after
  users: async () => [
    user1 = await userHelper.createUser(),
    user2 = await userHelper.createUser(),
    user3 = await userHelper.createUser(),
  ],
  // If error happens in any precondition block - nothing else will be executed
  // All tests will fail with error from precondition
  beforeAllSpecs: async () => {
    users = [user1, user2, user3];
    counterMatcher = await counterMatcherHelper.initCounterMatcher();
  },
  beforeEachSpec: async () => {
    await time.sleep(100, 'beforeEach');
    counter++;
    currentUser = users.shift();
  },
  afterEachSpec: async () => await time.sleep(200, 'afterEach'),
  afterAllSpecs: async () => await time.sleep(1000, 'afterAll'),
  specs: [
    {
      name: 'test 1',
      test: async () => {
        console.log(`Using user: ${currentUser.name}`);
        expect(await counterMatcher('this will throw an error', counter)).toBe(true);
      },
      // Will get executed even if error occurs in test
      afterTest: async () => console.log(`SOME IMPORTANT STUFF SHOULD HAPPEN HERE`),
    },
    // Can also be used in cycles
    ...actualNums.map(actualNum => {
      return {
        name: `test ${actualNum}`,
        test: async () => {
          console.log(`Using user: ${currentUser.name}`);
          expect(await counterMatcher(actualNum, counter)).toBe(true);
        }
      }
    })
  ]
});
