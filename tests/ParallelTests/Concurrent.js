const concurrently = require('concurrently');
const os = require("os");
const helper = require('../Library/MiscHelper')
const config = require('../Config/config');
const { execSync } = require('child_process')
var time = config.config.Concurrent.time[0]
var json = null

if (os.type().includes('Linux')) {
    helper.logging('Request initiated from Linux Machine');
    const json = helper.readfile(config.config.Filepaths.TestcafeRC)
    helper.logging('JSON coming before setting the browser');
    helper.logging(json.browsers);
    json.browsers = config.config.DockerBrowser.browser
    helper.logging('JSON coming after setting the browser');
    helper.logging(json.browsers);
    helper.writefile(config.config.Filepaths.TestcafeRC, JSON.stringify(json))
}
else {
    helper.logging('Request initiated from Windows Machine');
}


concurrently(getjsondata()).then(
    function onSuccess(exitInfo) {
        helper.logging('onSuccess');
        helper.logging(exitInfo);
        ResetRCfile()
        execSync("node report-generator.js")
        process.exit()
    },
    function onFailure(exitInfo) {
        helper.logging('onFailure');
        console.log(exitInfo);
        ResetRCfile()
        execSync("node report-generator.js")
        process.exit()
    },
    
);



function filtersearch(splitarray, command) {
    helper.logging('Enter filtersearch Function')
    for (let j = 0; j < splitarray.length; j++) {
        const filtername = splitarray[j].split('=')[0]
        helper.logging('filtername')
        helper.logging(filtername)
        if (j == 0) {
            helper.logging('Setting Main file name')
            command = command + splitarray[j]
        }
        else {
            helper.logging('Checking command before setting File Filters ')
            helper.logging(command)
            if (filtername == 'fixture') {
                command = command + ' -f ' + splitarray[j].split('=')[1]
            } else if (filtername == 'test') {
                command = command + ' -T ' + splitarray[j].split('=')[1]
            }
            else if (filtername == 'fixturemeta') {
                command = command + ' --fixture-meta ' + splitarray[j].split('=')[1].replace(':', '=')
            }
            else if (filtername == 'testmeta') {
                command = command + ' --test-meta ' + splitarray[j].split('=')[1].replace(':', '=')
            }
            else if (filtername == 'env') {
                command = command + ' --env ' + splitarray[j].split('=')[1]
            }
            else if (filtername == 'browser') {
                helper.logging('Final Browser')
                browserslice=helper.SettingBrowser(splitarray[j].split('=')[1],command)
                helper.logging(browserslice)
                for (let i = 3; i < command.split(' ').length; i++) {
                    helper.logging(command.split(' ')[i])
                    browserslice = browserslice + ' ' + command.split(' ')[i]
                }
                command = browserslice
                helper.logging('Final values after setting the Browser')
                helper.logging(command)

            }

        }
    }
    helper.logging('Exit filtersearch Function')
    return command

}

function writingfile(i, filecontent, finaljson, name) {
    helper.logging('Enter writingfile Function')
    filecontent[0].command = finaljson
    filecontent[0].name = name
    json = JSON.stringify(filecontent)
    if (i == 0) {
        helper.logging('Index is ZERO so need to first write the file')
        helper.writefile(config.config.Filepaths.Writefile, json)
        filecontent = helper.readfile(config.config.Filepaths.Writefile)
    }
    else {
        helper.logging('Index is other then ZERO so need to splice the record')
        const splicing = helper.readfile(config.config.Filepaths.Writefile)
        var splicinglength = helper.readfile(config.config.Filepaths.Writefile);
        splicing.splice(splicinglength.length, 0, JSON.parse(json)[0])
        helper.writefile(config.config.Filepaths.Writefile, JSON.stringify(splicing))
    }
    helper.logging('Exit writingfile Function')

}

function getjsondata() {
    helper.logging('Enter getjsondata Function')
    for (let i = 0; i < helper.GetCommandargs().length; i++) {
        var command = ' && testcafe '
        helper.logging(command)
        var splitarray = helper.GetCommandargs()[i].split(',')
        if (splitarray.length > 1) {
            helper.logging('There are filters for running this test')
            command = filtersearch(splitarray, command)
        }
        else {
            helper.logging('There are no filters for running this test')
            command = command + splitarray
        }
        if (i == 0) {
            helper.logging('Value in time first Attempt: ' + time)
        }
        else {
            time = time + config.config.Concurrent.time[1]
            helper.logging('Value in time at other Attempts: ' + time)
        }
        const finaljson = 'sleepms ' + time + command
        const name = helper.GetCommandargs()[i].split('/')[1].split('.')[0]
        writingfile(i, helper.readfile(config.config.Filepaths.ConcurrentTemp), finaljson, name)
    }
    helper.logging('Reading the Final file content before running concurrent command')
    return helper.readfile(config.config.Filepaths.Writefile)

}

function ResetRCfile() {
    helper.logging('Reset testcaferc.json to DEFAULT');
    const json = helper.readfile(config.config.Filepaths.TestcafeRC)
    helper.logging('JSON coming before Reset');
    helper.logging(json);
    json.browsers = config.config.DefaultBrowser.browser
    helper.writefile(config.config.Filepaths.TestcafeRC, JSON.stringify(json))
    helper.logging('JSON coming after Reset');
    helper.logging(json);
}