const config = {

    "URLs": {
        "GitHubURL": 'https://github.com/',
        "GoogleURL": 'https://www.google.com/',
        "HerokuAppURL": 'http://the-internet.herokuapp.com/login',
        "NagarroURL": 'https://www.nagarro.com/en',
        "YouTubeURL": 'https://www.youtube.com/user/nagarrovideos',
        "DemoQAURL": 'https://demoqa.com/text-box',

    },
    "StagingEnv": {
        "UserName": 'appium87@gmail.com:test',
        "Password": 'Cool@1423',
        "Env": "Staging",
        "DBDetails": {
            "user": 'sa',
            "password": 'Password123',
            "server": 'ADMIN\\SQLEXPRESS',
            "database": 'master'

        }
    },
    "QAEnv": {
        "UserName": 'appium87@gmail.com:test',
        "Password": 'Cool@1423',
        "Env": "QA"
    },
    "Filepaths": {
        "Excelfile": "DataDriven/TestData/excel.xlsx",
        "ExcelSheetname": "data",
        "JSONfile": "DataDriven/TestData/jsondata.json",
        "ConcurrentTemp": "./Library/ConcurrentHelper/Template.json",
        "Writefile": "./Library/ConcurrentHelper/SampleWriteFile.json",
        "TestcafeRC": "./.testcaferc.json"
    },
    "Visuals": {
        "VisualTest": "TestCafe",
    },
    "Concurrent": {
        "time": [1000, 4000]

    },
    "DockerBrowser": {
        "browser": "chromium:headless"

    },
    "DefaultBrowser": {
        "browser": "chrome"

    },


};
module.exports = { config };