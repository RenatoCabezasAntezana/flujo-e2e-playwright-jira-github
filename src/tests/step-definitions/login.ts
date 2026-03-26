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

Given("que el cliente se encuentra en la pagina de inicio de sesion", async function () {
    await loginPage.navigate();
});

When("ingresa el usuario {string} y la contrasena {string}", async function (usuario: string, contrasena: string) {
    await loginPage.login(usuario, contrasena);
});

When("intenta iniciar sesion sin ingresar credenciales", async function () {
    await loginPage.clickLogin();
});

Then("el sistema debe permitir el ingreso y mostrar la pantalla de productos", async function () {
    const enInventario = await loginPage.isOnInventoryPage();
    expect(enInventario).toBe(true);
    const titulo = await loginPage.getInventoryTitle();
    expect(titulo).toBe("Products");
});

Then("el sistema debe mostrar el mensaje {string}", async function (mensajeEsperado: string) {
    const mensajeObtenido = await loginPage.getErrorMessage();
    expect(mensajeObtenido).toContain(mensajeEsperado);
});
