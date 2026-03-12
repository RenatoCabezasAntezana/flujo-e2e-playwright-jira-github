import { Given, When, Then, Before, After } from "@cucumber/cucumber";
import { Browser, BrowserContext, Page, chromium, expect } from "@playwright/test";
import { LoginPage } from "../../page/LoginPage";
import { InventoryPage } from "../../page/InventoryPage";
import { CartDetailPage } from "../../page/CartDetailPage";

let browser: Browser;
let context: BrowserContext;
let page: Page;
let loginPage: LoginPage;
let inventoryPage: InventoryPage;
let cartDetailPage: CartDetailPage;

Before(async function () {
    browser = await chromium.launch({ headless: process.env.HEADLESS !== "false" });
    context = await browser.newContext();
    page = await context.newPage();
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartDetailPage = new CartDetailPage(page);
});

After(async function (scenario) {
    // Captura screenshot automatico al fallar — se embebe en el reporte HTML
    if (scenario.result?.status === "FAILED") {
        const screenshot = await page.screenshot({ fullPage: true });
        this.attach(screenshot, "image/png");
    }
    await browser.close();
});

// --- Given ---

Given("que el usuario ha iniciado sesion como {string} con password {string}", async function (username: string, password: string) {
    await loginPage.navigate();
    await loginPage.login(username, password);
});

Given("que el usuario esta en la pagina de inventario", async function () {
    await inventoryPage.navigate();
});

Given("el producto {string} ha sido agregado al carrito", async function (slug: string) {
    await inventoryPage.addProduct(slug);
});

Given("que el usuario tiene el producto {string} en el carrito", async function (slug: string) {
    await inventoryPage.navigate();
    await inventoryPage.addProduct(slug);
    await cartDetailPage.navigate();
});

Given("que el usuario accede al carrito sin haber agregado productos", async function () {
    await cartDetailPage.navigate();
});

// --- When ---

When("el usuario agrega el producto {string} al carrito desde el catalogo", async function (slug: string) {
    await inventoryPage.addProduct(slug);
});

When("el usuario elimina el producto {string} desde el catalogo", async function (slug: string) {
    await inventoryPage.removeProduct(slug);
});

When("el usuario navega al carrito usando el icono del header", async function () {
    await inventoryPage.goToCart();
});

When("el usuario elimina el producto {string} desde la pagina del carrito", async function (slug: string) {
    await cartDetailPage.removeProduct(slug);
});

// --- Then ---

Then("el boton del producto {string} cambia a {string}", async function (slug: string, expectedText: string) {
    const actualText = await inventoryPage.getProductActionButtonText(slug);
    expect(actualText).toBe(expectedText);
});

Then("el badge del header muestra el valor {string}", async function (expectedCount: string) {
    const badgeText = await inventoryPage.getCartBadgeText();
    expect(badgeText).toBe(expectedCount);
});

Then("el badge del header no esta visible", async function () {
    // Verifica desde el inventario o desde el carrito segun la pagina actual
    const badgeVisible = await cartDetailPage.isCartBadgeVisible();
    expect(badgeVisible).toBe(false);
});

Then("el usuario se encuentra en la pagina del carrito", async function () {
    const onCart = await cartDetailPage.isOnCartPage();
    expect(onCart).toBe(true);
});

Then("el carrito contiene el producto {string}", async function (productName: string) {
    const found = await cartDetailPage.isProductInCartByName(productName);
    expect(found).toBe(true);
});

Then("el item del carrito muestra la descripcion del producto", async function () {
    const description = await cartDetailPage.getFirstItemDescription();
    // La descripcion debe ser texto no vacio
    expect(description.trim().length).toBeGreaterThan(0);
});

Then("el item del carrito muestra la cantidad {string}", async function (expectedQty: string) {
    const actualQty = await cartDetailPage.getFirstItemQuantity();
    expect(actualQty.trim()).toBe(expectedQty);
});

Then("el item del carrito muestra el precio del producto", async function () {
    const priceVisible = await cartDetailPage.isFirstItemPriceVisible();
    expect(priceVisible).toBe(true);
});

Then("la lista del carrito no contiene items", async function () {
    const empty = await cartDetailPage.isCartEmpty();
    expect(empty).toBe(true);
});

Then("el boton {string} esta visible en el carrito", async function (buttonName: string) {
    if (buttonName === "Continue Shopping") {
        expect(await cartDetailPage.isContinueShoppingVisible()).toBe(true);
    } else if (buttonName === "Checkout") {
        expect(await cartDetailPage.isCheckoutVisible()).toBe(true);
    } else {
        throw new Error(`Boton no reconocido: "${buttonName}". Use "Continue Shopping" o "Checkout".`);
    }
});
