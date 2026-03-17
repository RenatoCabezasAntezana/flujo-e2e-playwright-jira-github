import { Page } from "@playwright/test";

export class LoginPage {
    private readonly url = "https://www.saucedemo.com/";

    // Selectores validados en tiempo real contra saucedemo.com
    private readonly usernameInput = '[data-test="username"]';
    private readonly passwordInput = '[data-test="password"]';
    private readonly loginButton = '[data-test="login-button"]';
    private readonly errorMessage = '[data-test="error"]';

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
        // El mensaje de error aparece como heading h3 con data-test="error"
        await this.page.waitForSelector(this.errorMessage, { state: "visible" });
        return await this.page.textContent(this.errorMessage) ?? "";
    }

    async isOnInventoryPage(): Promise<boolean> {
        await this.page.waitForURL("**/inventory.html");
        return this.page.url().includes("/inventory.html");
    }
}
