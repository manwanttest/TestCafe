const fsExtra = require('fs-extra');
const fs = require('fs');
const config = require('./Config/config');
const helper = require('./Library/MiscHelper')

function Emptydir() {
  
  helper.logging('Cleaning up the folders')
  fsExtra.emptyDirSync('./Reports/CucumberReporter')
  fsExtra.emptyDirSync('./Reports/TestCafeReporter')
  fsExtra.emptyDirSync('./Reports/VisualReporter')
  fsExtra.emptyDirSync('./Artifacts/screenshots')
  fsExtra.emptyDirSync('./Artifacts/videos')
  fsExtra.emptyDirSync('./VisualSnapshots')
  fsExtra.emptyDirSync('./cucumber-json-reports')
  fsExtra.emptyDirSync('./Docker')
  helper.logging('Folders has been cleaned')
  fs.truncate(config.config.Filepaths.Writefile, 0, function () { helper.logging('File Content has been erased') })
}

Emptydir()