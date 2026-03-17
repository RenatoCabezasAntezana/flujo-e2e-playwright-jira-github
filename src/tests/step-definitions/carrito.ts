import { Given, When, Then, Before, After } from "@cucumber/cucumber";
import { Browser, BrowserContext, Page, chromium, expect } from "@playwright/test";
import { LoginPage } from "../../page/LoginPage";
import { CarritoPage } from "../../page/CarritoPage";

let browser: Browser;
let context: BrowserContext;
let page: Page;
let loginPage: LoginPage;
let carritoPage: CarritoPage;

Before(async function () {
    browser = await chromium.launch({ headless: true });
    context = await browser.newContext();
    page = await context.newPage();
    loginPage = new LoginPage(page);
    carritoPage = new CarritoPage(page);
});

After(async function (scenario) {
    // Captura screenshot al fallar para diagnóstico en el reporte
    if (scenario.result?.status === "FAILED") {
        await page.screenshot({ path: `reports/${scenario.pickle.name}.png` });
    }
    await browser.close();
});

// ─── Given ──────────────────────────────────────────────────────────────────

Given("que el cliente está autenticado y se encuentra en la página de productos", async function () {
    // Autenticación previa necesaria para acceder al inventario
    await loginPage.navigate();
    await loginPage.login("standard_user", "secret_sauce");
    await carritoPage.navigateToInventory();
});

Given("que el cliente tiene el producto {string} agregado al carrito", async function (productSlug: string) {
    // Autentica y agrega el producto indicado para precondicionar el escenario
    await loginPage.navigate();
    await loginPage.login("standard_user", "secret_sauce");
    await carritoPage.navigateToInventory();
    await carritoPage.clickAddToCart(productSlug);
});

Given("que el cliente está en la página del carrito con el producto {string}", async function (productSlug: string) {
    // Autentica, agrega el producto y navega al carrito para precondicionar el escenario
    await loginPage.navigate();
    await loginPage.login("standard_user", "secret_sauce");
    await carritoPage.navigateToInventory();
    await carritoPage.clickAddToCart(productSlug);
    await carritoPage.clickCartIcon();
});

// ─── When ───────────────────────────────────────────────────────────────────

When("hace clic en \"Add to cart\" del producto {string}", async function (productSlug: string) {
    await carritoPage.clickAddToCart(productSlug);
});

When("hace clic en \"Remove\" del producto {string} desde la página de productos", async function (productSlug: string) {
    await carritoPage.clickRemoveFromInventory(productSlug);
});

When("accede al carrito mediante el ícono del header", async function () {
    await carritoPage.clickCartIcon();
});

When("hace clic en \"Remove\" del producto en la página del carrito", async function () {
    // El escenario siempre usa sauce-labs-backpack como producto precondicionado
    await carritoPage.clickRemoveFromCart("sauce-labs-backpack");
});

// ─── Then ───────────────────────────────────────────────────────────────────

Then("el botón del producto cambia a \"Remove\"", async function () {
    // CA-1: el botón de agregar al carrito debe cambiar a Remove tras el clic
    const isRemoveVisible = await carritoPage.isRemoveButtonVisible("sauce-labs-backpack");
    expect(isRemoveVisible).toBe(true);
});

Then("el badge del carrito muestra el valor {string}", async function (expectedBadge: string) {
    // CA-1: el badge del header debe reflejar la cantidad de productos en el carrito
    const badgeText = await carritoPage.getCartBadgeText();
    expect(badgeText.trim()).toBe(expectedBadge);
});

Then("el botón del producto vuelve a mostrar \"Add to cart\"", async function () {
    // CA-2: tras eliminar, el botón debe volver al estado inicial
    const isAddToCartVisible = await carritoPage.isAddToCartButtonVisible("sauce-labs-backpack");
    expect(isAddToCartVisible).toBe(true);
});

Then("el badge del carrito desaparece", async function () {
    // CA-2 y CA-4: sin productos en el carrito el badge no debe estar visible
    const isBadgeVisible = await carritoPage.isCartBadgeVisible();
    expect(isBadgeVisible).toBe(false);
});

Then("ve la página \"Your Cart\" con las columnas \"QTY\" y \"Description\"", async function () {
    // CA-3: el título y las columnas de la página del carrito deben ser visibles
    const title = await carritoPage.getCartPageTitle();
    expect(title.trim()).toBe("Your Cart");
    const isQtyVisible = await carritoPage.isQtyLabelVisible();
    expect(isQtyVisible).toBe(true);
    const isDescVisible = await carritoPage.isDescLabelVisible();
    expect(isDescVisible).toBe(true);
});

Then("el producto aparece con cantidad {string}, nombre y precio visibles", async function (expectedQty: string) {
    // CA-3: cada item del carrito debe mostrar qty, nombre y precio
    const qty = await carritoPage.getFirstItemQuantity();
    expect(qty.trim()).toBe(expectedQty);
    const isNameVisible = await carritoPage.isItemNameVisible();
    expect(isNameVisible).toBe(true);
    const isPriceVisible = await carritoPage.isItemPriceVisible();
    expect(isPriceVisible).toBe(true);
});

Then("están visibles los botones \"Continue Shopping\" y \"Checkout\"", async function () {
    // CA-3 y CA-5: los botones de navegación deben estar siempre presentes en el carrito
    const isContinueVisible = await carritoPage.isContinueShoppingVisible();
    expect(isContinueVisible).toBe(true);
    const isCheckoutVisible = await carritoPage.isCheckoutVisible();
    expect(isCheckoutVisible).toBe(true);
});

Then("el producto desaparece de la lista del carrito", async function () {
    // CA-4: el carrito debe quedar sin items tras eliminar el único producto
    const itemCount = await carritoPage.getCartItemCount();
    expect(itemCount).toBe(0);
});

Then("la lista del carrito aparece vacía sin ningún item", async function () {
    // CA-5: sin productos la lista debe estar vacía
    const itemCount = await carritoPage.getCartItemCount();
    expect(itemCount).toBe(0);
});

Then("los botones \"Continue Shopping\" y \"Checkout\" siguen visibles", async function () {
    // CA-5: los botones de navegación se mantienen incluso con el carrito vacío
    const isContinueVisible = await carritoPage.isContinueShoppingVisible();
    expect(isContinueVisible).toBe(true);
    const isCheckoutVisible = await carritoPage.isCheckoutVisible();
    expect(isCheckoutVisible).toBe(true);
});
