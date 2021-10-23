import { AppHelper,selector, error, setcreds } from '../Library/AppHelper';
import { TestCafeHelper } from '../Library/TestCafeHelper';
var environment, array, Message;
const helper = require('../Library/MiscHelper')
const config = require('../Config/config')
const enir = require('../Runner')



fixture
    ('Fixture.POM')
    .meta('Test', 'Regression')
    .before(async t => {
        helper.logging('Inside before Hooks');
        try {
            helper.logging('Checking the Environment');
            environment = enir.env.split('=')[1];
        } catch (err) {
            helper.logging('Need to execute tests on default Environment');
            environment = undefined
        }

        helper.logging('Value in environment: ' + environment)
        if (environment === undefined) {
            environment = config.config.QAEnv.Env;
            helper.logging('Selected ' + environment + ' to execute Tests');
        }
        else {
            helper.logging('Selected ' + environment + ' to execute Tests');
        }


    })
    .beforeEach(async t => {
        helper.logging('Inside before Each Hooks');
        if (environment == config.config.StagingEnv.Env) {
            helper.logging('Execute Tests on Staging Env.');
            array = setcreds(t, config.config.URLs.GitHubURL, config.config.StagingEnv.UserName, config.config.StagingEnv.Password)
        }
        else {
            helper.logging('Default Env. ' + environment + ' has been selected');
            array = setcreds(t, config.config.URLs.GitHubURL, config.config.QAEnv.UserName, config.config.QAEnv.Password)
        }
        helper.logging('URL ' + array[0]);
        helper.logging('Username: ' + array[1]);
        await TestCafeHelper.Navigate(array[0])
        await TestCafeHelper.MaximizeWindow()
    })

test
    .meta('Env', 'Production')
    ('Test.POM.Checking App URL', async t => {
        helper.logging('Validating the App Page URL')
        await AppHelper.Domstate()
        Message = await t.eval(() => window.location.href);
        helper.logging('URL coming at run time: ' + Message)
        await TestCafeHelper.ContainsAssertion(Message, array[0])
        helper.logging('App Page URL Validated')
    });

test
    .meta('Env', 'Staging')
    ('Test.Login and Logout with valid credentials', async t => {
        helper.logging('Login and Logout with Valid Credentials')
        await AppHelper.Login(array[1].split(':')[0], array[2]);
        await TestCafeHelper.GetInnerText(selector).then((output) => {
            Message = output
        })
        helper.logging('Dashboard Title: ' + Message)
        await AppHelper.Logout()
        helper.logging('Login and Logout Successfully Done')
    });

test
    .meta('Env', 'QA')
    ('Test.POM.Login with Invalid Username', async t => {
        helper.logging('Login InValid Username')
        helper.logging(array[1])
        helper.logging(array[1].split(':')[0])
        helper.logging(array[1].split(':')[1])
        await AppHelper.Login(array[1].split(':')[0] + array[1].split(':')[1], array[2]);
        await TestCafeHelper.EqualAssertion(selector, 'Marketplace')
        helper.logging('Exit Login InValid Username')

    });

test
    .meta('Env', 'Staging')
    ('Test.Login with invalid Password', async t => {
        helper.logging('Login InValid Password')
        helper.logging(array[1].split(':')[0])
        helper.logging(array[2] + array[1].split(':')[1])
        await AppHelper.Login(array[1].split(':')[0], array[2] + array[1].split(':')[1]);
        await TestCafeHelper.GetInnerText(error).then((output) => {
            Message = output
        })
        helper.logging('Error Message: ' + Message)
        await TestCafeHelper.ContainsAssertion(Message, 'Incorrect')
        helper.logging('Exit Login InValid Password')

    });

fixture('Fixture.HO').skip
    .meta('Test', 'Smoke')
    .page(config.config.URLs.DemoQAURL)

test.skip
    ('Using Selector Directly for innerText Method', async t => {
        await TestCafeHelper.MaximizeWindow()
        await TestCafeHelper.Click(repo.DemoQAPage.WebTable1)
        await TestCafeHelper.GetInnerText(repo.DemoQAPage.Header).then((output) => {
            helper.logging('Get Title using selector function:' + output)
        })

    });