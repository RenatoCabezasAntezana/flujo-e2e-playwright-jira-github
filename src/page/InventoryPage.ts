import { Page } from "@playwright/test";

export class InventoryPage {
    private readonly url = "https://www.saucedemo.com/inventory.html";

    constructor(private page: Page) {}

    async navigate() {
        await this.page.goto(this.url);
        await this.page.waitForURL("**/inventory.html");
    }

    // Agrega un producto al carrito usando su slug (ej: "sauce-labs-backpack")
    async addProduct(slug: string) {
        await this.page.click(`[data-test="add-to-cart-${slug}"]`);
    }

    // Elimina un producto desde el inventario usando su slug
    async removeProduct(slug: string) {
        await this.page.click(`[data-test="remove-${slug}"]`);
    }

    // Retorna el texto del boton de accion del producto: "Remove" o "Add to cart"
    async getProductActionButtonText(slug: string): Promise<string> {
        const removeBtn = this.page.locator(`[data-test="remove-${slug}"]`);
        if (await removeBtn.isVisible()) return "Remove";
        return "Add to cart";
    }

    // Retorna el texto del badge del carrito en el header, o null si no esta visible
    async getCartBadgeText(): Promise<string | null> {
        const badge = this.page.locator('[data-test="shopping-cart-badge"]');
        if (!(await badge.isVisible())) return null;
        return badge.innerText();
    }

    // Indica si el badge del carrito en el header esta visible
    async isCartBadgeVisible(): Promise<boolean> {
        return this.page.locator('[data-test="shopping-cart-badge"]').isVisible();
    }

    // Navega al carrito haciendo clic en el icono del header
    async goToCart() {
        await this.page.click('[data-test="shopping-cart-link"]');
        await this.page.waitForURL("**/cart.html");
    }
}
