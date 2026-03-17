import { Page } from "@playwright/test";

// Mapa de nombre de producto a slug usado en los data-test de SauceDemo
const PRODUCT_SLUG_MAP: Record<string, string> = {
    "Sauce Labs Backpack": "sauce-labs-backpack",
    "Sauce Labs Bike Light": "sauce-labs-bike-light",
    "Sauce Labs Bolt T-Shirt": "sauce-labs-bolt-t-shirt",
    "Sauce Labs Fleece Jacket": "sauce-labs-fleece-jacket",
    "Sauce Labs Onesie": "sauce-labs-onesie",
    "Test.allTheThings() T-Shirt (Red)": "test.allthethings()-t-shirt-(red)",
};

export class CartPage {
    private readonly inventoryUrl = "https://www.saucedemo.com/inventory.html";
    private readonly cartUrl = "https://www.saucedemo.com/cart.html";

    constructor(private page: Page) {}

    // Convierte nombre de producto a slug para los selectores data-test
    private slugFor(productName: string): string {
        const slug = PRODUCT_SLUG_MAP[productName];
        if (!slug) throw new Error(`Slug no encontrado para el producto: "${productName}"`);
        return slug;
    }

    async navigateToInventory() {
        await this.page.goto(this.inventoryUrl);
    }

    async navigateToCart() {
        await this.page.goto(this.cartUrl);
    }

    async addProductByName(productName: string) {
        const slug = this.slugFor(productName);
        await this.page.locator(`[data-test="add-to-cart-${slug}"]`).click();
    }

    async removeProductFromInventoryByName(productName: string) {
        const slug = this.slugFor(productName);
        await this.page.locator(`[data-test="remove-${slug}"]`).click();
    }

    async removeProductFromCartByName(productName: string) {
        const slug = this.slugFor(productName);
        await this.page.locator(`[data-test="remove-${slug}"]`).click();
    }

    // Devuelve el texto del botón del producto: "Remove" o "Add to cart"
    async getProductButtonText(productName: string): Promise<string> {
        const slug = this.slugFor(productName);
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

    async goToCartViaHeader() {
        await this.page.locator('[data-test="shopping-cart-link"]').click();
        await this.page.waitForURL("**/cart.html");
    }

    async isOnCartPage(): Promise<boolean> {
        return this.page.url().includes("/cart.html");
    }

    // Verifica que el título de la página del carrito sea "Your Cart"
    async getCartPageTitle(): Promise<string> {
        const title = this.page.locator('[data-test="title"]');
        await title.waitFor({ state: "visible" });
        return (await title.textContent()) ?? "";
    }

    // Verifica que las columnas QTY y Description sean visibles
    async isQtyColumnVisible(): Promise<boolean> {
        return this.page.locator('[data-test="cart-quantity-label"]').isVisible();
    }

    async isDescriptionColumnVisible(): Promise<boolean> {
        return this.page.locator('[data-test="cart-desc-label"]').isVisible();
    }

    // Verifica que un producto específico esté en el carrito por nombre
    async isProductInCartByName(productName: string): Promise<boolean> {
        const items = this.page.locator(".cart_item .inventory_item_name");
        const count = await items.count();
        for (let i = 0; i < count; i++) {
            const text = await items.nth(i).textContent();
            if (text?.trim() === productName) return true;
        }
        return false;
    }

    // Verifica la cantidad del producto en el carrito (columna QTY)
    async getProductQtyInCart(productName: string): Promise<number> {
        const items = this.page.locator(".cart_item");
        const count = await items.count();
        for (let i = 0; i < count; i++) {
            const nameEl = items.nth(i).locator(".inventory_item_name");
            const name = await nameEl.textContent();
            if (name?.trim() === productName) {
                const qtyEl = items.nth(i).locator(".cart_quantity");
                const qty = await qtyEl.textContent();
                return parseInt(qty ?? "0", 10);
            }
        }
        return 0;
    }

    async isContinueShoppingVisible(): Promise<boolean> {
        return this.page.locator('[data-test="continue-shopping"]').isVisible();
    }

    async isCheckoutVisible(): Promise<boolean> {
        return this.page.locator('[data-test="checkout"]').isVisible();
    }

    async isCartEmpty(): Promise<boolean> {
        return (await this.page.locator(".cart_item").count()) === 0;
    }
}
