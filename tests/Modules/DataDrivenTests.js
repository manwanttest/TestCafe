import { AppHelper } from '../Library/AppHelper';
import { TestCafeHelper } from '../Library/TestCafeHelper';
import { test, t } from 'testcafe';
import ObjectRepo from '../PageObjectRepository/UIMAP'
const path = require("path");
const helper = require('../Library/MiscHelper')
const config = require('../Config/config');

var repo = new ObjectRepo();
var Message

fixture('Fixture.DD')
    .meta('Test', 'Smoke')
AppHelper.Excel(path.join(__dirname, "..", config.config.Filepaths.Excelfile), config.config.Filepaths.ExcelSheetname).then((response) => 
{
    response.forEach(data => {
        test
            .meta('Env', 'QA')
            .page(config.config.URLs.HerokuAppURL)
            (`Test.DD.Login with username ${data.username} using excel file`, async t => {
                helper.logging('Starting Test')
                await AppHelper.Domstate()
                await TestCafeHelper.Wait(1500)
                helper.logging('Starting')
                await TestCafeHelper.MaximizeWindow()
                await TestCafeHelper.TypeText(repo.DataDrivenPage.UserName, data.username)
                await TestCafeHelper.TypeText(repo.DataDrivenPage.Password, data.password)
                await TestCafeHelper.Click(repo.DataDrivenPage.Button)
                await TestCafeHelper.GetInnerText(repo.DataDrivenPage.Label).then((output) => {
                    Message = output
                })
                helper.logging('Message from Excel File:' + Message)
                await TestCafeHelper.ContainsAssertion(Message, data.expectedMessage)
                helper.logging('Done')
            })
    })
})
const jsondata = require(path.join(__dirname, "..", config.config.Filepaths.JSONfile));
jsondata.forEach(data => {
    test
        .meta('Env', 'Staging')
        .page(config.config.URLs.HerokuAppURL)
        (`Test.Login with username ${data.username} using JSON file`, async t => {
            await AppHelper.Domstate()
            await TestCafeHelper.Wait(1500)
            helper.logging('Starting')
            await TestCafeHelper.MaximizeWindow()
            await TestCafeHelper.TypeText(repo.DataDrivenPage.UserName, data.username)
            await TestCafeHelper.TypeText(repo.DataDrivenPage.Password, data.password)
            await TestCafeHelper.Click(repo.DataDrivenPage.Button)
            helper.logging('Taking.... Screenshot')
            await t
                .takeScreenshot({
                    path: `Test_Screenshots/${data.expectedMessage}.png`,
                    fullPage: true
                });
            helper.logging('Screenshot Taken')
            await TestCafeHelper.GetInnerText(repo.DataDrivenPage.Label).then((output) => {
                Message = output
            })
            helper.logging('Message from JSON File:' + Message)
            await TestCafeHelper.ContainsAssertion(Message, data.expectedMessage)
            helper.logging('Done')
        });

});