import { Page, expect } from "@playwright/test";

export class CarritoPage {
    private readonly inventoryUrl = "https://www.saucedemo.com/inventory.html";
    private readonly cartUrl = "https://www.saucedemo.com/cart.html";

    // Selectores validados en tiempo real contra saucedemo.com — SB-80
    private readonly cartLink = '[data-test="shopping-cart-link"]';
    private readonly cartBadge = '[data-test="shopping-cart-badge"]';
    private readonly cartList = '[data-test="cart-list"]';
    private readonly cartTitle = '[data-test="title"]';
    private readonly continueShopping = '[data-test="continue-shopping"]';
    private readonly checkout = '[data-test="checkout"]';
    private readonly inventoryItem = '[data-test="inventory-item"]';
    private readonly itemQuantity = '[data-test="item-quantity"]';

    constructor(private page: Page) {}

    // Selector dinámico para el botón "Add to cart" de un producto dado su slug
    private addToCartSelector(productSlug: string): string {
        return `[data-test="add-to-cart-${productSlug}"]`;
    }

    // Selector dinámico para el botón "Remove" de un producto dado su slug
    private removeSelector(productSlug: string): string {
        return `[data-test="remove-${productSlug}"]`;
    }

    async navigateToInventory() {
        await this.page.goto(this.inventoryUrl);
        await this.page.waitForURL("**/inventory.html");
    }

    async navigateToCart() {
        await this.page.goto(this.cartUrl);
        await this.page.waitForURL("**/cart.html");
    }

    async clickAddToCart(productSlug: string) {
        await this.page.click(this.addToCartSelector(productSlug));
    }

    async clickRemoveFromInventory(productSlug: string) {
        await this.page.click(this.removeSelector(productSlug));
    }

    async clickRemoveFromCart(productSlug: string) {
        await this.page.click(this.removeSelector(productSlug));
    }

    async clickCartIcon() {
        await this.page.click(this.cartLink);
        await this.page.waitForURL("**/cart.html");
    }

    // Retorna el texto del badge del carrito; lanza si no existe
    async getCartBadgeText(): Promise<string> {
        await this.page.waitForSelector(this.cartBadge, { state: "visible" });
        return (await this.page.textContent(this.cartBadge)) ?? "";
    }

    // Retorna true si el badge del carrito está visible
    async isCartBadgeVisible(): Promise<boolean> {
        return this.page.locator(this.cartBadge).isVisible();
    }

    // Retorna true si el botón "Remove" del producto está visible en el inventario
    async isRemoveButtonVisible(productSlug: string): Promise<boolean> {
        return this.page.locator(this.removeSelector(productSlug)).isVisible();
    }

    // Retorna true si el botón "Add to cart" del producto está visible en el inventario
    async isAddToCartButtonVisible(productSlug: string): Promise<boolean> {
        return this.page.locator(this.addToCartSelector(productSlug)).isVisible();
    }

    // Retorna el texto del título de la página del carrito
    async getCartPageTitle(): Promise<string> {
        await this.page.waitForSelector(this.cartTitle, { state: "visible" });
        return (await this.page.textContent(this.cartTitle)) ?? "";
    }

    // Retorna true si la columna QTY es visible
    async isQtyLabelVisible(): Promise<boolean> {
        return this.page.locator('[data-test="cart-quantity-label"]').isVisible();
    }

    // Retorna true si la columna Description es visible
    async isDescLabelVisible(): Promise<boolean> {
        return this.page.locator('[data-test="cart-desc-label"]').isVisible();
    }

    // Retorna la cantidad del primer item en el carrito
    async getFirstItemQuantity(): Promise<string> {
        await this.page.waitForSelector(this.itemQuantity, { state: "visible" });
        return (await this.page.textContent(this.itemQuantity)) ?? "";
    }

    // Retorna true si el primer item del carrito muestra nombre visible
    async isItemNameVisible(): Promise<boolean> {
        return this.page.locator('[data-test="inventory-item-name"]').isVisible();
    }

    // Retorna true si el primer item del carrito muestra precio visible
    async isItemPriceVisible(): Promise<boolean> {
        return this.page.locator('[data-test="inventory-item-price"]').isVisible();
    }

    // Retorna true si el botón "Continue Shopping" es visible
    async isContinueShoppingVisible(): Promise<boolean> {
        return this.page.locator(this.continueShopping).isVisible();
    }

    // Retorna true si el botón "Checkout" es visible
    async isCheckoutVisible(): Promise<boolean> {
        return this.page.locator(this.checkout).isVisible();
    }

    // Retorna la cantidad de items visibles en la lista del carrito
    async getCartItemCount(): Promise<number> {
        return this.page.locator(this.inventoryItem).count();
    }

    async isOnCartPage(): Promise<boolean> {
        await this.page.waitForURL("**/cart.html");
        return this.page.url().includes("/cart.html");
    }
}
