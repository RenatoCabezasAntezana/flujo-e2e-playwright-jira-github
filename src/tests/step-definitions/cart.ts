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
    // Captura screenshot automático al fallar — se embebe en el reporte HTML
    if (scenario.result?.status === "FAILED") {
        const screenshot = await page.screenshot({ fullPage: true });
        this.attach(screenshot, "image/png");
    }
    await browser.close();
});

// ─── Pasos de contexto (Given) ────────────────────────────────────────────────

Given("que el cliente está autenticado y se encuentra en la página de productos", async function () {
    await loginPage.navigate();
    await loginPage.login("standard_user", "secret_sauce");
    await cartPage.navigateToInventory();
});

Given("que el cliente está autenticado y tiene {string} en el carrito", async function (productName: string) {
    await loginPage.navigate();
    await loginPage.login("standard_user", "secret_sauce");
    await cartPage.navigateToInventory();
    await cartPage.addProductByName(productName);
});

Given("que el cliente está autenticado y se encuentra en el carrito con {string}", async function (productName: string) {
    await loginPage.navigate();
    await loginPage.login("standard_user", "secret_sauce");
    await cartPage.navigateToInventory();
    await cartPage.addProductByName(productName);
    await cartPage.navigateToCart();
});

Given("que el cliente está autenticado y se encuentra en el carrito sin productos", async function () {
    await loginPage.navigate();
    await loginPage.login("standard_user", "secret_sauce");
    await cartPage.navigateToCart();
});

// ─── Pasos de acción (When) ────────────────────────────────────────────────────

When("hace clic en \"Add to cart\" del producto {string}", async function (productName: string) {
    await cartPage.addProductByName(productName);
});

When("hace clic en \"Remove\" del producto {string} en la página de productos", async function (productName: string) {
    await cartPage.removeProductFromInventoryByName(productName);
});

When("accede al carrito mediante el ícono del header", async function () {
    await cartPage.goToCartViaHeader();
});

When("hace clic en \"Remove\" del producto {string} en la página del carrito", async function (productName: string) {
    await cartPage.removeProductFromCartByName(productName);
});

When("está en la página {string}", async function (_expectedTitle: string) {
    // El cliente ya está en el carrito — verificamos que la URL sea la correcta
    const onCart = await cartPage.isOnCartPage();
    expect(onCart).toBe(true);
});

// ─── Pasos de verificación (Then) ─────────────────────────────────────────────

Then("el botón del producto {string} cambia a \"Remove\"", async function (productName: string) {
    const buttonText = await cartPage.getProductButtonText(productName);
    expect(buttonText).toBe("Remove");
});

Then("el badge del carrito muestra el contador {string}", async function (expectedCount: string) {
    const badgeText = await cartPage.getCartBadgeText();
    expect(badgeText).toBe(expectedCount);
});

Then("el botón del producto {string} vuelve a mostrar \"Add to cart\"", async function (productName: string) {
    const buttonText = await cartPage.getProductButtonText(productName);
    expect(buttonText).toBe("Add to cart");
});

Then("el badge del carrito desaparece", async function () {
    const isVisible = await cartPage.isCartBadgeVisible();
    expect(isVisible).toBe(false);
});

Then("ve la página {string} con columnas {string} y {string}", async function (expectedTitle: string, _col1: string, _col2: string) {
    const title = await cartPage.getCartPageTitle();
    expect(title).toBe(expectedTitle);
    expect(await cartPage.isQtyColumnVisible()).toBe(true);
    expect(await cartPage.isDescriptionColumnVisible()).toBe(true);
});

Then("el producto {string} aparece en el carrito con cantidad 1", async function (productName: string) {
    const inCart = await cartPage.isProductInCartByName(productName);
    expect(inCart).toBe(true);
    const qty = await cartPage.getProductQtyInCart(productName);
    expect(qty).toBe(1);
});

Then("están visibles los botones {string} y {string}", async function (_btn1: string, _btn2: string) {
    expect(await cartPage.isContinueShoppingVisible()).toBe(true);
    expect(await cartPage.isCheckoutVisible()).toBe(true);
});

Then("el producto {string} desaparece de la lista del carrito", async function (productName: string) {
    const inCart = await cartPage.isProductInCartByName(productName);
    expect(inCart).toBe(false);
});

Then("la lista del carrito aparece vacía sin ningún item", async function () {
    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBe(true);
});
