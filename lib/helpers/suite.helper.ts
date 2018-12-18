import {userInterface} from "./user.helper";

export function suite(params: suiteInterface) {
  const {
    name,
    tests = voidFunc,
    users,
    beforeAllSpecs,
    beforeEachSpec,
    afterEachSpec,
    afterAllSpecs,
    specs = [],
  } = params;
  const inner = name.pop();
  const exception = {error: null};

  if (name.length === 0) {
    throw new Error(`Please specify suite name`);
  }

  describe(process.env.deviceName, () => {
    name.reduceRight((prev, cur) => {
      return () => describe(cur, () => {
        prev();
      });
    }, () => describe(inner, () => {

      usersHandler(users, exception);

      tests();

      beforeAllSpecs && beforeAll(async () => exception.error || await preConditionHandler(beforeAllSpecs, exception));
      beforeEachSpec && beforeEach(async () => exception.error || await preConditionHandler(beforeEachSpec, exception));
      afterEachSpec && afterEach(async () => await afterEachSpec());
      afterAllSpecs && afterAll(async () => await afterAllSpecs());

      specs.forEach(spec => {
        const {name: specName, test, afterTest = voidFunc} = spec;
        it(specName, async () => {
          try {
            failOnError(exception.error);
            await test();
          } catch (err) {
            try {
              await afterTest();
            } catch (err) {
              console.log(`AfterTest failed: ${err}`);
            }
            throw err;
          }
        });
      });
    }))();
  });
}


function failOnError(error) {
  if (error) {
    throw new Error(`Precondition failed: ${error}`);
  }
}

async function preConditionHandler(conditionFunc, exception) {
  try {
    await conditionFunc();
  } catch (err) {
    exception.error = err;
  }
}

function usersHandler(getUsers, exception) {
  if (getUsers) {
    let users = null;
    beforeAll(async () =>
      await preConditionHandler(
        async () => {
          users = await getUsers();
          return await Promise.all(users);
        },
        exception));
    afterAll(async () =>
      await Promise.all(users.map(user => user.erase())));
  }
}

function voidFunc() {
  return;
}



interface testInterface {
  name: string;
  test: () => Promise<void>;
  afterTest?: () => Promise<void>;
}


interface suiteInterface {
  name: string[];
  tests?: () => void;
  users?: () => Promise<userInterface[]>;
  beforeAllSpecs?: () => Promise<void>;
  beforeEachSpec?: () => Promise<void>;
  afterEachSpec?: () => Promise<void>;
  afterAllSpecs?: () => Promise<void>;
  specs?: testInterface[];
}
