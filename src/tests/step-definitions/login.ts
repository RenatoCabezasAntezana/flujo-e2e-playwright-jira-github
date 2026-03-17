import { Given, When, Then, Before, After } from "@cucumber/cucumber";
import { Browser, BrowserContext, Page, chromium, expect } from "@playwright/test";
import { LoginPage } from "../../page/LoginPage";

let browser: Browser;
let context: BrowserContext;
let page: Page;
let loginPage: LoginPage;

Before(async function () {
    browser = await chromium.launch({ headless: process.env.HEADLESS !== "false" });
    context = await browser.newContext();
    page = await context.newPage();
    loginPage = new LoginPage(page);
});

After(async function (scenario) {
    // Captura screenshot automático al fallar — se embebe en el reporte HTML
    if (scenario.result?.status === "FAILED") {
        const screenshot = await page.screenshot({ fullPage: true });
        this.attach(screenshot, "image/png");
    }
    await browser.close();
});

Given("que el cliente se encuentra en la pagina de inicio de sesion", async function () {
    await loginPage.navigate();
});

When("ingresa el usuario {string} y la contrasena {string}", async function (username: string, password: string) {
    await loginPage.login(username, password);
});

Then("el sistema debe mostrar la pantalla principal de productos", async function () {
    const onProducts = await loginPage.isOnProductsPage();
    expect(onProducts).toBe(true);
});

// Step parametrizado: verifica el mensaje de error exacto devuelto por la app
Then("el sistema debe mostrar el mensaje de error {string}", async function (expectedMessage: string) {
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBe(expectedMessage);
});
