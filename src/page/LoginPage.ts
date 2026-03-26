import { Page } from "@playwright/test";

export class LoginPage {
    private readonly url = "https://www.saucedemo.com/";

    // Selectores validados en exploración real de la UI (data-test attributes)
    private readonly usernameInput = '[data-test="username"]';
    private readonly passwordInput = '[data-test="password"]';
    private readonly loginButton = '[data-test="login-button"]';
    private readonly errorMessage = '[data-test="error"]';
    private readonly inventoryTitle = '.title';

    constructor(private page: Page) {}

    async navigate() {
        await this.page.goto(this.url);
    }

    async fillUsername(username: string) {
        await this.page.fill(this.usernameInput, username);
    }

    async fillPassword(password: string) {
        await this.page.fill(this.passwordInput, password);
    }

    async clickLogin() {
        await this.page.click(this.loginButton);
    }

    async login(username: string, password: string) {
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.clickLogin();
    }

    async getErrorMessage(): Promise<string> {
        await this.page.waitForSelector(this.errorMessage);
        return await this.page.innerText(this.errorMessage);
    }

    async isOnInventoryPage(): Promise<boolean> {
        await this.page.waitForURL("**/inventory.html");
        return this.page.url().includes("/inventory.html");
    }

    async getInventoryTitle(): Promise<string> {
        await this.page.waitForSelector(this.inventoryTitle);
        return await this.page.innerText(this.inventoryTitle);
    }
}
