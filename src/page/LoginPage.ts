import { Page } from "@playwright/test";

export class LoginPage {
    private readonly url = "https://www.saucedemo.com/";

    // Selectores verificados con data-test en la app real
    private readonly usernameInput = '[data-test="username"]';
    private readonly passwordInput = '[data-test="password"]';
    private readonly loginButton = '[data-test="login-button"]';
    private readonly errorMessage = '[data-test="error"]';

    constructor(private page: Page) {}

    async navigate() {
        await this.page.goto(this.url);
    }

    async fillUsername(username: string) {
        await this.page.locator(this.usernameInput).fill(username);
    }

    async fillPassword(password: string) {
        await this.page.locator(this.passwordInput).fill(password);
    }

    async clickLogin() {
        await this.page.locator(this.loginButton).click();
    }

    async login(username: string, password: string) {
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.clickLogin();
    }

    async getErrorMessage(): Promise<string> {
        const errorLocator = this.page.locator(this.errorMessage);
        await errorLocator.waitFor({ state: "visible" });
        return (await errorLocator.textContent()) ?? "";
    }

    async isOnInventoryPage(): Promise<boolean> {
        await this.page.waitForURL("**/inventory.html", { timeout: 5000 }).catch(() => {});
        return this.page.url().includes("/inventory.html");
    }

    async isOnLoginPage(): Promise<boolean> {
        return this.page.url() === this.url || this.page.url() === this.url.replace(/\/$/, "");
    }
}
