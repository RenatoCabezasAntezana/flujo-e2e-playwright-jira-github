import { Page } from "@playwright/test";

export class LoginPage {
    private readonly url = "https://www.saucedemo.com/";

    constructor(private page: Page) {}

    async navigate() {
        await this.page.goto(this.url);
    }

    async login(username: string, password: string) {
        await this.page.fill('[data-test="username"]', username);
        await this.page.fill('[data-test="password"]', password);
        await this.page.click('[data-test="login-button"]');
    }

    async getErrorMessage(): Promise<string> {
        const error = this.page.locator('[data-test="error"]');
        await error.waitFor({ state: "visible" });
        return error.innerText();
    }

    async isOnProductsPage(): Promise<boolean> {
        await this.page.waitForURL("**/inventory.html");
        return this.page.locator(".inventory_list").isVisible();
    }
}
