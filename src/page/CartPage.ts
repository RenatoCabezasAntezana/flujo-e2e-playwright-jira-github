import { Page, expect } from "@playwright/test";

export class CartPage {
    private readonly inventoryUrl = "https://www.saucedemo.com/inventory.html";
    private readonly cartUrl = "https://www.saucedemo.com/cart.html";

    // Selectores validados en tiempo real contra saucedemo.com (exploración SB-81)
    private readonly cartIcon = '[data-test="shopping-cart-link"]';
    private readonly cartBadge = ".shopping_cart_badge";
    private readonly cartTitle = '[data-test="title"]';
    private readonly cartList = ".cart_list";
    private readonly cartItem = ".cart_item";
    private readonly qtyLabel = ".cart_quantity_label";
    private readonly descLabel = ".cart_desc_label";
    private readonly continueShoppingButton = '[data-test="continue-shopping"]';
    private readonly checkoutButton = '[data-test="checkout"]';
    private readonly itemName = ".inventory_item_name";
    private readonly itemDesc = ".inventory_item_desc";
    private readonly itemPrice = ".inventory_item_price";
    private readonly itemQty = ".cart_quantity";

    constructor(private page: Page) {}

    async navigateToInventory() {
        await this.page.goto(this.inventoryUrl);
    }

    async navigateToCart() {
        await this.page.goto(this.cartUrl);
    }

    // Selector dinámico para botón "Add to cart" de un producto específico por slug
    addToCartSelector(productSlug: string): string {
        return `[data-test="add-to-cart-${productSlug}"]`;
    }

    // Selector dinámico para botón "Remove" de un producto específico por slug
    removeSelector(productSlug: string): string {
        return `[data-test="remove-${productSlug}"]`;
    }

    async clickAddToCart(productSlug: string) {
        await this.page.click(this.addToCartSelector(productSlug));
    }

    async clickRemoveFromInventory(productSlug: string) {
        await this.page.click(this.removeSelector(productSlug));
    }

    async clickCartIcon() {
        await this.page.click(this.cartIcon);
        await this.page.waitForURL("**/cart.html");
    }

    async clickRemoveFromCart(productSlug: string) {
        await this.page.click(this.removeSelector(productSlug));
    }

    async getCartBadgeText(): Promise<string | null> {
        const badge = this.page.locator(this.cartBadge);
        const visible = await badge.isVisible().catch(() => false);
        if (!visible) return null;
        return await badge.textContent();
    }

    async isCartBadgeVisible(): Promise<boolean> {
        return this.page.locator(this.cartBadge).isVisible().catch(() => false);
    }

    async isAddToCartButtonVisible(productSlug: string): Promise<boolean> {
        return this.page.locator(this.addToCartSelector(productSlug)).isVisible().catch(() => false);
    }

    async isRemoveButtonVisible(productSlug: string): Promise<boolean> {
        return this.page.locator(this.removeSelector(productSlug)).isVisible().catch(() => false);
    }

    async getCartTitle(): Promise<string> {
        await this.page.waitForSelector(this.cartTitle, { state: "visible" });
        return await this.page.textContent(this.cartTitle) ?? "";
    }

    async isQtyLabelVisible(): Promise<boolean> {
        return this.page.locator(this.qtyLabel).isVisible().catch(() => false);
    }

    async isDescLabelVisible(): Promise<boolean> {
        return this.page.locator(this.descLabel).isVisible().catch(() => false);
    }

    async getCartItemsCount(): Promise<number> {
        return await this.page.locator(this.cartItem).count();
    }

    async getFirstItemQuantity(): Promise<string> {
        return await this.page.locator(this.itemQty).first().textContent() ?? "";
    }

    async getFirstItemName(): Promise<string> {
        return await this.page.locator(this.itemName).first().textContent() ?? "";
    }

    async getFirstItemDescription(): Promise<string> {
        return await this.page.locator(this.itemDesc).first().textContent() ?? "";
    }

    async getFirstItemPrice(): Promise<string> {
        return await this.page.locator(this.itemPrice).first().textContent() ?? "";
    }

    async isContinueShoppingButtonVisible(): Promise<boolean> {
        return this.page.locator(this.continueShoppingButton).isVisible().catch(() => false);
    }

    async isCheckoutButtonVisible(): Promise<boolean> {
        return this.page.locator(this.checkoutButton).isVisible().catch(() => false);
    }

    async isOnCartPage(): Promise<boolean> {
        await this.page.waitForURL("**/cart.html");
        return this.page.url().includes("/cart.html");
    }
}
