import { Given, When, Then, Before, After } from "@cucumber/cucumber";
import { Browser, BrowserContext, Page, chromium, expect } from "@playwright/test";
import { LoginPage } from "../../page/LoginPage";
import { CartPage } from "../../page/CartPage";

let browser: Browser;
let context: BrowserContext;
let page: Page;
let loginPage: LoginPage;
let cartPage: CartPage;

Before(async function () {
    browser = await chromium.launch({ headless: process.env.HEADLESS !== "false" });
    context = await browser.newContext();
    page = await context.newPage();
    loginPage = new LoginPage(page);
    cartPage = new CartPage(page);
});

After(async function (scenario) {
    if (scenario.result?.status === "FAILED") {
        const screenshot = await page.screenshot({ fullPage: true });
        this.attach(screenshot, "image/png");
    }
    await browser.close();
});

Given("que el cliente ha iniciado sesion como {string} con contrasena {string}", async function (username: string, password: string) {
    await loginPage.navigate();
    await loginPage.login(username, password);
});

Given("se encuentra en la pagina de productos", async function () {
    await cartPage.navigateToInventory();
});

Given("el producto {string} fue agregado al carrito", async function (slug: string) {
    await cartPage.addProduct(slug);
});

Given("el cliente esta en el carrito con el producto {string} agregado", async function (slug: string) {
    await cartPage.navigateToInventory();
    await cartPage.addProduct(slug);
    await cartPage.navigateToCart();
});

Given("el cliente accede directamente al carrito sin productos", async function () {
    await cartPage.navigateToCart();
});

When("agrega el producto {string} al carrito", async function (slug: string) {
    await cartPage.addProduct(slug);
});

When("elimina el producto {string} desde el catalogo", async function (slug: string) {
    await cartPage.removeProductFromInventory(slug);
});

When("accede al carrito mediante el icono del header", async function () {
    await cartPage.goToCart();
});

When("elimina el producto {string} desde el carrito", async function (slug: string) {
    await cartPage.removeProductFromCart(slug);
});

Then("el boton del producto {string} muestra {string}", async function (slug: string, expectedText: string) {
    const buttonText = await cartPage.getProductButtonText(slug);
    expect(buttonText).toBe(expectedText);
});

Then("el badge del carrito muestra el contador {string}", async function (expectedCount: string) {
    const badgeText = await cartPage.getCartBadgeText();
    expect(badgeText).toBe(expectedCount);
});

Then("el badge del carrito no es visible", async function () {
    expect(await cartPage.isCartBadgeVisible()).toBe(false);
});

Then("se encuentra en la pagina del carrito", async function () {
    expect(await cartPage.isOnCartPage()).toBe(true);
});

Then("el carrito muestra el producto con nombre descripcion y precio", async function () {
    const itemName = await cartPage.getFirstCartItemName();
    expect(itemName.length).toBeGreaterThan(0);
    expect(await cartPage.isCartItemQtyVisible()).toBe(true);
    expect(await cartPage.isCartItemPriceVisible()).toBe(true);
});

Then("los botones {string} y {string} son visibles", async function (_btn1: string, _btn2: string) {
    expect(await cartPage.isContinueShoppingVisible()).toBe(true);
    expect(await cartPage.isCheckoutVisible()).toBe(true);
});

Then("el producto desaparece de la lista del carrito", async function () {
    expect(await cartPage.isCartEmpty()).toBe(true);
});

Then("la lista del carrito aparece sin items", async function () {
    expect(await cartPage.isCartEmpty()).toBe(true);
});
