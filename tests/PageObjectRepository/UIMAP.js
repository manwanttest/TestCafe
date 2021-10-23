
import GhPage from './GitHubLoginPagePOM.js'
import MwPage from './MultiplewindowPOM.js'
import DqPage from './TestCafeFeaturesPOM.js'
import DdPage from './DataDrivenPOM.js'
import TvPage from './TestCafeVisualPOM.js'

export default class UIMAP {

    constructor() {

        this.GitHubPage = new GhPage();
        this.WindowPage = new MwPage();
        this.DemoQAPage = new DqPage();
        this.DataDrivenPage = new DdPage();
        this.VisualPage = new TvPage();
    }
}