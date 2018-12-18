const Jasmine = require('jasmine');
const Jasmine2Reporter = require('jasmine2-reporter').Jasmine2Reporter;


const jasmine = new Jasmine();


const jasmine2Reporter = new Jasmine2Reporter({failuresSummary: false});

jasmine.loadConfig({
  spec_dir: 'dist/spec',
  random: false,
  seed: null,
  stopSpecOnExpectationFailure: false,
});

jasmine.addReporter(jasmine2Reporter);


export {jasmine};
