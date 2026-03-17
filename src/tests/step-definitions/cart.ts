import { Given, When, Then, Before, After } from "@cucumber/cucumber";
import { Browser, BrowserContext, Page, chromium, expect } from "@playwright/test";
import { CartPage } from "../../page/CartPage";
import { LoginPage } from "../../page/LoginPage";

let browser: Browser;
let context: BrowserContext;
let page: Page;
let cartPage: CartPage;
let loginPage: LoginPage;

// Credenciales estándar de SauceDemo para todos los escenarios del carrito
const STANDARD_USER = "standard_user";
const STANDARD_PASS = "secret_sauce";

Before(async function () {
    browser = await chromium.launch({ headless: true });
    context = await browser.newContext();
    page = await context.newPage();
    loginPage = new LoginPage(page);
    cartPage = new CartPage(page);
});

After(async function (scenario) {
    if (scenario.result?.status === "FAILED") {
        // Captura screenshot al fallar para facilitar el diagnóstico
        await page.screenshot({ path: `reports/${scenario.pickle.name}.png` });
    }
    await browser.close();
});

// Background: autenticar y navegar al inventario antes de cada escenario
Given("que el cliente está autenticado y en la página de productos", async function () {
    await loginPage.navigate();
    await loginPage.login(STANDARD_USER, STANDARD_PASS);
    await loginPage.isOnInventoryPage();
});

// CA-1: Agregar producto desde el catálogo
When("hace clic en {string} del producto {string}", async function (action: string, productSlug: string) {
    if (action === "Add to cart") {
        await cartPage.clickAddToCart(productSlug);
    }
});

Then("el botón del producto cambia a {string}", async function (expectedLabel: string) {
    // Tras agregar, el botón debe cambiar a "Remove"
    if (expectedLabel === "Remove") {
        const addBtnVisible = await cartPage.isAddToCartButtonVisible("sauce-labs-backpack");
        expect(addBtnVisible).toBe(false);
        const removeBtnVisible = await cartPage.isRemoveButtonVisible("sauce-labs-backpack");
        expect(removeBtnVisible).toBe(true);
    }
});

Then("el badge del carrito muestra el contador {string}", async function (expectedCount: string) {
    const badgeText = await cartPage.getCartBadgeText();
    expect(badgeText).toBe(expectedCount);
});

// CA-2: Eliminar producto desde el catálogo
Given("tiene el producto {string} agregado al carrito", async function (productSlug: string) {
    await cartPage.clickAddToCart(productSlug);
});

When("hace clic en {string} del producto {string} desde el catálogo", async function (action: string, productSlug: string) {
    if (action === "Remove") {
        await cartPage.clickRemoveFromInventory(productSlug);
    }
});

Then("el botón del producto vuelve a mostrar {string}", async function (expectedLabel: string) {
    // Tras eliminar, el botón debe volver a "Add to cart"
    if (expectedLabel === "Add to cart") {
        const addBtnVisible = await cartPage.isAddToCartButtonVisible("sauce-labs-backpack");
        expect(addBtnVisible).toBe(true);
        const removeBtnVisible = await cartPage.isRemoveButtonVisible("sauce-labs-backpack");
        expect(removeBtnVisible).toBe(false);
    }
});

Then("el badge del carrito desaparece", async function () {
    // El badge no debe estar visible cuando el carrito está vacío
    const badgeVisible = await cartPage.isCartBadgeVisible();
    expect(badgeVisible).toBe(false);
});

// CA-3: Ver contenido del carrito
When("accede al carrito mediante el ícono del header", async function () {
    await cartPage.clickCartIcon();
});

Then("ve la página {string} con las columnas QTY y Description", async function (expectedTitle: string) {
    const title = await cartPage.getCartTitle();
    expect(title.trim()).toBe(expectedTitle);
    const qtyVisible = await cartPage.isQtyLabelVisible();
    expect(qtyVisible).toBe(true);
    const descVisible = await cartPage.isDescLabelVisible();
    expect(descVisible).toBe(true);
});

Then("el producto aparece con cantidad 1, nombre, descripción y precio", async function () {
    // Verifica que el primer item del carrito tiene los datos requeridos no vacíos
    const qty = await cartPage.getFirstItemQuantity();
    expect(qty.trim()).toBe("1");
    const name = await cartPage.getFirstItemName();
    expect(name.trim().length).toBeGreaterThan(0);
    const desc = await cartPage.getFirstItemDescription();
    expect(desc.trim().length).toBeGreaterThan(0);
    const price = await cartPage.getFirstItemPrice();
    expect(price.trim()).toMatch(/^\$\d+\.\d{2}$/);
});

Then("están visibles los botones {string} y {string}", async function (btn1: string, btn2: string) {
    // Valida que ambos botones de navegación estén visibles en la página del carrito
    if (btn1 === "Continue Shopping" && btn2 === "Checkout") {
        const continueVisible = await cartPage.isContinueShoppingButtonVisible();
        expect(continueVisible).toBe(true);
        const checkoutVisible = await cartPage.isCheckoutButtonVisible();
        expect(checkoutVisible).toBe(true);
    }
});

// CA-4: Eliminar producto desde el carrito
Given("está en la página del carrito", async function () {
    await cartPage.clickCartIcon();
});

When("hace clic en {string} del producto desde el carrito", async function (action: string) {
    if (action === "Remove") {
        await cartPage.clickRemoveFromCart("sauce-labs-backpack");
    }
});

Then("el producto desaparece de la lista del carrito", async function () {
    const itemsCount = await cartPage.getCartItemsCount();
    expect(itemsCount).toBe(0);
});

// CA-5: Carrito vacío
Given("está en la página del carrito sin productos", async function () {
    // Navega directamente al carrito sin agregar productos — el carrito está vacío
    await cartPage.navigateToCart();
});

Then("la lista del carrito aparece vacía sin ningún item", async function () {
    const itemsCount = await cartPage.getCartItemsCount();
    expect(itemsCount).toBe(0);
});
