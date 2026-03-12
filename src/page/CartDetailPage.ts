import { Page } from "@playwright/test";

export class CartDetailPage {
    private readonly cartUrl = "https://www.saucedemo.com/cart.html";

    constructor(private page: Page) {}

    async navigate() {
        await this.page.goto(this.cartUrl);
        await this.page.waitForURL("**/cart.html");
    }

    // Elimina un producto desde la pagina del carrito usando su slug
    async removeProduct(slug: string) {
        await this.page.click(`[data-test="remove-${slug}"]`);
    }

    // Retorna true si la URL actual es la del carrito y la lista esta visible
    async isOnCartPage(): Promise<boolean> {
        await this.page.waitForURL("**/cart.html");
        return this.page.locator(".cart_list").isVisible();
    }

    // Retorna la cantidad de items en el carrito
    async getCartItemCount(): Promise<number> {
        return this.page.locator(".cart_item").count();
    }

    // Indica si el carrito esta vacio (sin items)
    async isCartEmpty(): Promise<boolean> {
        return (await this.page.locator(".cart_item").count()) === 0;
    }

    // Indica si el badge del carrito en el header esta visible
    async isCartBadgeVisible(): Promise<boolean> {
        return this.page.locator('[data-test="shopping-cart-badge"]').isVisible();
    }

    // Indica si un producto con el nombre exacto aparece en la lista del carrito
    async isProductInCartByName(productName: string): Promise<boolean> {
        const item = this.page.locator(".inventory_item_name", { hasText: productName });
        return item.isVisible();
    }

    // Retorna el texto de la descripcion del primer item del carrito
    async getFirstItemDescription(): Promise<string> {
        const desc = this.page.locator(".inventory_item_desc").first();
        await desc.waitFor({ state: "visible" });
        return desc.innerText();
    }

    // Retorna el texto de la cantidad del primer item del carrito
    async getFirstItemQuantity(): Promise<string> {
        const qty = this.page.locator(".cart_quantity").first();
        await qty.waitFor({ state: "visible" });
        return qty.innerText();
    }

    // Indica si el precio del primer item del carrito esta visible
    async isFirstItemPriceVisible(): Promise<boolean> {
        return this.page.locator(".inventory_item_price").first().isVisible();
    }

    // Indica si el boton "Continue Shopping" esta visible
    async isContinueShoppingVisible(): Promise<boolean> {
        return this.page.locator('[data-test="continue-shopping"]').isVisible();
    }

    // Indica si el boton "Checkout" esta visible
    async isCheckoutVisible(): Promise<boolean> {
        return this.page.locator('[data-test="checkout"]').isVisible();
    }
}
