import { Page } from "@playwright/test";

export class CartPage {
    private readonly inventoryUrl = "https://www.saucedemo.com/inventory.html";
    private readonly cartUrl = "https://www.saucedemo.com/cart.html";

    constructor(private page: Page) {}

    async navigateToInventory() {
        await this.page.goto(this.inventoryUrl);
    }

    async navigateToCart() {
        await this.page.goto(this.cartUrl);
    }

    async addProduct(slug: string) {
        await this.page.click(`[data-test="add-to-cart-${slug}"]`);
    }

    async removeProductFromInventory(slug: string) {
        await this.page.click(`[data-test="remove-${slug}"]`);
    }

    async removeProductFromCart(slug: string) {
        await this.page.click(`[data-test="remove-${slug}"]`);
    }

    async getProductButtonText(slug: string): Promise<string> {
        const removeBtn = this.page.locator(`[data-test="remove-${slug}"]`);
        if (await removeBtn.isVisible()) return "Remove";
        return "Add to cart";
    }

    async getCartBadgeText(): Promise<string | null> {
        const badge = this.page.locator('[data-test="shopping-cart-badge"]');
        if (!(await badge.isVisible())) return null;
        return badge.innerText();
    }

    async isCartBadgeVisible(): Promise<boolean> {
        return this.page.locator('[data-test="shopping-cart-badge"]').isVisible();
    }

    async goToCart() {
        await this.page.click('[data-test="shopping-cart-link"]');
        await this.page.waitForURL("**/cart.html");
    }

    async isOnCartPage(): Promise<boolean> {
        await this.page.waitForURL("**/cart.html");
        return this.page.locator(".cart_list").isVisible();
    }

    async isProductInCart(): Promise<boolean> {
        return this.page.locator(".cart_item").isVisible();
    }

    async isCartEmpty(): Promise<boolean> {
        return (await this.page.locator(".cart_item").count()) === 0;
    }

    async getFirstCartItemName(): Promise<string> {
        const name = this.page.locator(".inventory_item_name").first();
        await name.waitFor({ state: "visible" });
        return name.innerText();
    }

    async isCartItemQtyVisible(): Promise<boolean> {
        return this.page.locator(".cart_quantity").first().isVisible();
    }

    async isCartItemPriceVisible(): Promise<boolean> {
        return this.page.locator(".inventory_item_price").first().isVisible();
    }

    async isContinueShoppingVisible(): Promise<boolean> {
        return this.page.locator('[data-test="continue-shopping"]').isVisible();
    }

    async isCheckoutVisible(): Promise<boolean> {
        return this.page.locator('[data-test="checkout"]').isVisible();
    }
}
