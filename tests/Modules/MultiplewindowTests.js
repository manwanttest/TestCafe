import { AppHelper} from '../Library/AppHelper';
import { TestCafeHelper } from '../Library/TestCafeHelper';
import ObjectRepo from '../PageObjectRepository/UIMAP'
const helper = require('../Library/MiscHelper')
const config = require('../Config/config');
var repo = new ObjectRepo();
var initialWindow, window2, window3, element;


fixture('Window Management Feature')
  .page(config.config.URLs.NagarroURL)

test
.skip('New Window Opened Automatically After Click ', async t => {
  await TestCafeHelper.MaximizeWindow()
  await AppHelper.Validatewindow(config.config.URLs.NagarroURL)
  await TestCafeHelper.ElementVisiblity(repo.WindowPage.Banner).then((output) => {
    element = output
  })
  if (element) {
    helper.logging('Perform Action on Visible Element')
    await TestCafeHelper.WithExactText(repo.WindowPage.Accept, 'Accept All').then((output) => {
    element = output
    })
    await TestCafeHelper.Click(element)
  }
  else {
    helper.logging('No Need to Perform Action on Element')
  }
  await TestCafeHelper.Wait(1000)
  await TestCafeHelper.Scroll(repo.WindowPage.Label, 'bottomRight')
  await TestCafeHelper.Click(repo.WindowPage.Label)
  await AppHelper.Validatewindow(config.config.URLs.YouTubeURL)
})


test('Multiple Window Management', async t => {
  await AppHelper.Validatewindow(config.config.URLs.NagarroURL).then((output) => {
    initialWindow = output
    helper.logging('Promise resolved for Initial Window')
  })
  helper.logging('Initial Window')
  helper.logging(initialWindow)

  await TestCafeHelper.OpenWindow(config.config.URLs.YouTubeURL).then((output) => {
    window2 = output
  })
  helper.logging('window2')
  helper.logging(window2)
 
  await AppHelper.Validatewindow(config.config.URLs.YouTubeURL).then(() => {
    helper.logging('Promise resolved for Window 2')
  })

  await TestCafeHelper.OpenWindow(config.config.URLs.GitHubURL).then((output) => {
    window3 = output
  })
  helper.logging('window3')
  helper.logging(window3)

  await AppHelper.Validatewindow(config.config.URLs.GitHubURL).then(() => {
    helper.logging('Promise resolved for Window 3')
  })
  helper.logging('Switching to Inital Window')

  await t.switchToWindow(initialWindow);
  helper.logging('Closing the Child Windows')
  await TestCafeHelper.CloseWindow(window3)
  await TestCafeHelper.CloseWindow(window2)
  helper.logging('All Windows Closed')
});