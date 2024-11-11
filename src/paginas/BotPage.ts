import {type Page } from "@playwright/test";
import BasePage from "./BasePage";
import step from "../utilitarios/decorators";


export default class BotPage extends BasePage {

    constructor(page: Page) {
        super(page);
    }    

    @step('Ir para página')
    async irParaPagina(tipoDePagina: ItensMenu): Promise<any> {
        
    }

}