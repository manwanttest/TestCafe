import { takeSnapshot } from 'testcafe-blink-diff';
import { AppHelper } from '../Library/AppHelper';
const config = require('../Config/config');
const helper = require('../Library/MiscHelper')

fixture('Visual Features')
  .page(config.config.URLs.GoogleURL);


test.skip
  ('Google Page', async t => {
    takeSnapshot(t);
  });

test
  ('Attempt 1 Search Content in Google', async t => {
    await AppHelper.Visuals(t, process.argv.slice(2)[1].split('--')[1].trim())
    const name=t.testRun.test.name
    helper.logging('Name of Test: ' + name)
    helper.logging('Taking.... Screenshot')
    takeSnapshot(t,name, {
        fullPage: true, 
        timeout:5000
    });
  });
