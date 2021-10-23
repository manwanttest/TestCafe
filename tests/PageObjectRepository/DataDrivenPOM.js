import { Selector} from 'testcafe';

export default class DataDrivenPage {

    constructor() {
 
        this.UserName = Selector('input#username')
        this.Password = Selector('input#password')
        this.Button = 'button'
        this.Label = Selector('div#flash')
    }


}