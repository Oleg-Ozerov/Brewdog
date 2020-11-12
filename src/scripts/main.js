import { Header } from "./Header.js";
import {BeerList} from "./BeerList.js";

window.addEventListener('load', () => {
    createHeader();
    createBearList();
})

function createHeader() {
    const newHeader = new Header();

    newHeader.initialRender();
}

function createBearList() {
    const newBearList = new BeerList();

    newBearList.initialRender();
}