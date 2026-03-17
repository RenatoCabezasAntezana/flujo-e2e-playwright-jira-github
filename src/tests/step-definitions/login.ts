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

Given("que el cliente se encuentra en la página de inicio de sesión", async function () {
    await loginPage.navigate();
});

When("ingresa el usuario {string} y la contraseña {string}", async function (username: string, password: string) {
    await loginPage.login(username, password);
});

Then("el sistema debe permitir el ingreso y mostrar la pantalla principal de productos", async function () {
    const enInventario = await loginPage.isOnInventoryPage();
    expect(enInventario).toBe(true);
});

Then("el sistema no debe permitir el ingreso y debe mostrar el mensaje {string}", async function (mensajeEsperado: string) {
    const enLogin = await loginPage.isOnLoginPage();
    expect(enLogin).toBe(true);

    const mensajeActual = await loginPage.getErrorMessage();
    expect(mensajeActual).toContain(mensajeEsperado);
});
