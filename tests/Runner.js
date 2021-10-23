const testCafe = require('testcafe');
const os = require("os");
const { execSync } = require('child_process')
const helper = require('./Library/MiscHelper')
const config = require('./Config/config');
var filename, testname, env, fixturename,
  browser, testmeta, testkey, testvalue,
  fixturemeta, fixkey, fixvalue, catcherror

helper.logging('Arguments coming with command')
helper.logging(helper.GetCommandargs())

if (helper.GetCommandargs()[0].includes('=')) {
  helper.logging('Consider Testcafe configuration from Runner.js Class')
  IgnoringRCJson(config.config.Filepaths.TestcafeRC, config.config.Filepaths.Writefile)
  SetRunnerOptions(helper.GetCommandargs())
  SelectingDefaultBrowser()
  const tcOptions = {
    debugMode: false,
    skipJsErrors: true,
    assertionTimeOut: 3000,
    pageLoadTimeOut: 10000,
    speed: 1,
    browserInitTimeout: 1800000,
    color: true,
    skipUncaughtErrors: true
  };
  runTest(tcOptions);
}
else {
  helper.logging('Pick the configuration from testcaferc.json file')
}


function runTest(tcOptions) {
  testCafe().then(function (tc) {
    helper.logging('Starting TestCafe Runner')
    let runner = tc.createRunner();
    return runner
      .src([filename])
      .browsers([browser])
      .screenshots("./Artifacts/screenshots/", true)
      .video("./Artifacts/videos/", {
        singleFile: true,
        failedOnly: true
      })
      .filter(async (testName, fixtureName, fixturePath, testMeta, fixtureMeta) => {
        if (testname != undefined) {
          return testName.match(testname.split('=')[1])
        }
        else if (fixturename != undefined) {
          return fixtureName.match(fixturename.split('=')[1])
        }
        else if (testmeta != undefined) {
          return testMeta[testkey] === testvalue
        }
        else if (fixturemeta != undefined) {
          return fixtureMeta[fixkey] === fixvalue

        }
      })
      .reporter("cucumber-json")
      .run(tcOptions)
      .catch(function (error) {
        helper.logging('Inside Catch Block');
        catcherror = error
        helper.logging(catcherror);
      });
  }).then(failedCount => {
    if (failedCount > 0) {
      helper.logging('Error Tests failed: ' + failedCount);
    }
    if (catcherror != undefined) {
      helper.logging('No need to generate any Report');
    }
    else {
      helper.logging('Generating HTML Report');
      execSync("node report-generator.js")
      helper.logging('Report Generated');
    }
    IgnoringRCJson(config.config.Filepaths.Writefile, config.config.Filepaths.TestcafeRC)
    process.exit(0);

  })

}

module.exports = { env };

function IgnoringRCJson(readfilepath, writefilepath) {
  helper.logging('Enter IgnoringRCJson function');
  const json = helper.readfile(readfilepath)
  helper.logging('JSON coming before run: ' + json);
  helper.writefile(writefilepath, JSON.stringify(json))
  helper.writefile(readfilepath, JSON.stringify(''))
  helper.logging('Exit IgnoringRCJson function');

}

function SetRunnerOptions(args) {
  helper.logging('Setting the Runner Options')
  for (let i = 0; i < args.length; i++) {
    if (args[i].includes('filename')) {
      helper.logging('Filename to set: ' + args[i])
      filename = args[i].split('=')[1]

    }
    else if (args[i].includes('browser')) {
      helper.logging('Browser to set: ' + args[i])
      browser = helper.SettingBrowser(args[i].split('=')[1])
    } else if (args[i].includes('env')) {
      env = args[i]
      helper.logging('Envirnoment to set: ' + env)

    } else if (args[i].includes('testname')) {
      testname = args[i]
      helper.logging('Testname to set: ' + testname)

    } else if (args[i].includes('fixturename')) {
      fixturename = args[i]
      helper.logging('Fixturename to set: ' + fixturename)
    }
    else if (args[i].includes('testmeta')) {
      testmeta = args[i]
      testkey = args[i].split('=')[1].split(',')[0]
      helper.logging('TestKey: ' + testkey)
      testvalue = args[i].split('=')[1].split(',')[1]
      helper.logging('TestValue: ' + testvalue)
    }
    else if (args[i].includes('fixturemeta')) {
      fixturemeta = args[i]
      fixkey = args[i].split('=')[1].split(',')[0]
      helper.logging('FixtureKey: ' + fixkey)
      fixvalue = args[i].split('=')[1].split(',')[1]
      helper.logging('FixtureValue: ' + fixvalue)
    }
  }
  helper.logging('Runner Options has been set')
}

function SelectingDefaultBrowser() {
  helper.logging('Checking the Browser Preference')
  if (browser == undefined) {
    helper.logging('No Browser selection from User')
    if (os.type().includes('Linux')) {
      helper.logging('Request initiated from Linux Machine');
      browser = config.config.DockerBrowser.browser
    }
    else {
      helper.logging('Browser is not coming as param so stick to default Browser')
      browser = config.config.DefaultBrowser.browser
    }
  }
  else {
    helper.logging('Browser already selected')
  }
  helper.logging('Browser to Open is: ' + browser)
}
