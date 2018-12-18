import {counterMatcherHelper} from "../lib/helpers/counterMatcher.helper";
import {time} from "../lib/helpers/time.helper";
import {userHelper} from "../lib/helpers/user.helper";
process.env.deviceName = 'OnePlus 6T'; // In real life this one is set somewhere in config

let user1 = null;
let user2 = null;
let user3 = null;
let counter = 0;
let counterMatcher = null;
let users = null;
let currentUser = null;
const actualNums = [2, 3];


describe(process.env.deviceName, () => {
  describe('Feature', () => {
    describe('SubFeature', () => {
      describe('SubSubFeature', () => {

        // If error is thrown in "beforeAll" block - "beforeEach" and all "it" blocks will get executed
        // They will waste time and throw their own errors since precondition wasn't done
        beforeAll(async () => {
          user1 = await userHelper.createUser();
          user2 = await userHelper.createUser();
          user3 = await userHelper.createUser();
          users = [user1, user2, user3];
          counterMatcher = await counterMatcherHelper.initCounterMatcher();
        });

        beforeEach(async () => {
          await time.sleep(100, 'beforeEach');
          counter++;
          currentUser = users.shift();
        });

        afterEach(async () => {
          await time.sleep(200, 'afterEach');
        });

        afterAll(async () => {
          await time.sleep(1000, 'afterAll');
          await user1.erase();
          await user2.erase();
          await user3.erase();
        });

        it('test 1', async () => {
          console.log(`Using user: ${currentUser.name}`);
          expect(await counterMatcher('this will throw an error', counter)).toBe(true);
          console.log(`SOME IMPORTANT STUFF SHOULD HAPPEN HERE`); // Won't be logged since counterMatcher threw an error
        });

        actualNums.forEach(actualNum => {
          it(`test ${actualNum}`, async () => {
            console.log(`Using user: ${currentUser.name}`);
            expect(await counterMatcher(actualNum, counter)).toBe(true);
          });
        });

      });
    });
  });
});
