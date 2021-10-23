import {Selector} from 'testcafe';

export default class MultipleWindowPage {

    constructor() {
        
        this.Label = Selector('.footer-section path').nth(3)
        this.Accept = Selector('a')
        this.Banner=Selector('div[role=banner]')
        //this.Banner= Selector('manwant')

    }


}