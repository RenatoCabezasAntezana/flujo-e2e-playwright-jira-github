import { Given, When, Then, Before, After } from "@cucumber/cucumber";
import { Browser, BrowserContext, Page, chromium, expect } from "@playwright/test";
import { LoginPage } from "../../page/LoginPage";

let browser: Browser;
let context: BrowserContext;
let page: Page;
let loginPage: LoginPage;

Before(async function () {
    browser = await chromium.launch({ headless: true });
    context = await browser.newContext();
    page = await context.newPage();
    loginPage = new LoginPage(page);
});

After(async function () {
    await browser.close();
});

Given("que el cliente se encuentra en la página de inicio de sesión", async function () {
    await loginPage.navigate();
});

When("ingresa el usuario {string} y la contraseña {string}", async function (username: string, password: string) {
    await loginPage.login(username, password);
});

Then("el sistema debe permitirle el ingreso y mostrar la pantalla principal de productos", async function () {
    // Verifica que la URL cambia a /inventory.html tras el login exitoso
    const onInventory = await loginPage.isOnInventoryPage();
    expect(onInventory).toBe(true);
});

Then("el sistema no debe permitir el ingreso y debe mostrar el mensaje {string}", async function (expectedMessage: string) {
    // Verifica que se muestra el mensaje de error exacto de la UI
    const actualMessage = await loginPage.getErrorMessage();
    expect(actualMessage).toContain(expectedMessage);
});
