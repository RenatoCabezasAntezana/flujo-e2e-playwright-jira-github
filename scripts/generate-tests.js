// scripts/generate-tests.js
// Llamado por GitHub Actions cuando un ticket Jira pasa a "En curso".
// Lee el ticket, llama a Claude API (claude-opus-4-6) con el contexto del qa-senior,
// y escribe los 3 archivos generados: .feature, PageObject.ts, step-definitions.ts

const Anthropic = require("@anthropic-ai/sdk");
const fs = require("fs");
const path = require("path");

// ──────────────────────────────────────────────
// 1. JIRA: obtener ticket
// ──────────────────────────────────────────────
async function getJiraTicket(ticketKey) {
    const { ATLASSIAN_BASE_URL, ATLASSIAN_EMAIL, ATLASSIAN_API_TOKEN } = process.env;
    if (!ATLASSIAN_BASE_URL || !ATLASSIAN_EMAIL || !ATLASSIAN_API_TOKEN) {
        throw new Error("Faltan variables de entorno ATLASSIAN_*");
    }

    const auth = Buffer.from(`${ATLASSIAN_EMAIL}:${ATLASSIAN_API_TOKEN}`).toString("base64");
    const response = await fetch(`${ATLASSIAN_BASE_URL}/rest/api/3/issue/${ticketKey}`, {
        headers: { "Authorization": `Basic ${auth}`, "Accept": "application/json" }
    });

    if (!response.ok) throw new Error(`Jira API ${response.status}: ${response.statusText}`);
    return response.json();
}

// Convierte Atlassian Document Format (ADF) a texto plano
function adfToText(node) {
    if (!node) return "";
    if (node.type === "text") return node.text || "";
    if (!node.content) return "";

    const separator = ["paragraph", "bulletList", "orderedList", "listItem"].includes(node.type) ? "\n" : "";
    return node.content.map(adfToText).join("") + separator;
}

// ──────────────────────────────────────────────
// 2. CLAUDE API: generar archivos
// ──────────────────────────────────────────────
async function generateTests(ticketKey, summary, description) {
    const readFile = (p) => fs.existsSync(p) ? fs.readFileSync(p, "utf-8") : "(archivo no encontrado)";

    const loginFeature  = readFile("src/tests/features/login.feature");
    const loginSteps    = readFile("src/tests/step-definitions/login.ts");
    const loginPage     = readFile("src/page/LoginPage.ts");
    const cartPage      = readFile("src/page/CartPage.ts");
    const cartFeature   = readFile("src/tests/features/cart.feature");

    const systemPrompt = `Eres un QA Senior experto en automatización E2E con TypeScript + Playwright + Cucumber.js (BDD).
Tu misión: generar los 3 archivos de automatización para un ticket Jira dado, siguiendo EXACTAMENTE los patrones del proyecto.

## Stack
- TypeScript + @playwright/test + @cucumber/cucumber
- Node.js commonjs (require/module.exports)
- URL base: https://www.saucedemo.com/

## Convenciones de nomenclatura
- Feature files: src/tests/features/{modulo}.feature — primera línea: # {TICKET}: Nombre del ticket
- Page Objects: src/page/{Modulo}Page.ts — clase: {Modulo}Page
- Step definitions: src/tests/step-definitions/{modulo}.ts
- Gherkin: en español (Given/When/Then en inglés, texto en español)
- Código: en inglés

## Selectores (en orden de preferencia)
1. [data-test="..."]  ← siempre primero si existe en SauceDemo
2. [data-testid="..."]
3. CSS semántico estable
4. XPath — último recurso

## Patrón obligatorio: Page Object
\`\`\`typescript
import { Page } from "@playwright/test";
export class XxxPage {
    private readonly url = "https://www.saucedemo.com/xxx.html";
    constructor(private page: Page) {}
    async navigate() { await this.page.goto(this.url); }
    // Métodos: navigate(), accionVerbo(), getXxx(), isOnXxxPage(), isXxxVisible()
}
\`\`\`

## Patrón obligatorio: Step definitions
\`\`\`typescript
import { Given, When, Then, Before, After } from "@cucumber/cucumber";
import { Browser, BrowserContext, Page, chromium, expect } from "@playwright/test";
import { LoginPage } from "../../page/LoginPage";
import { XxxPage } from "../../page/XxxPage";

let browser: Browser;
let context: BrowserContext;
let page: Page;
let loginPage: LoginPage;
let xxxPage: XxxPage;

Before(async function () {
    browser = await chromium.launch({ headless: process.env.HEADLESS !== "false" });
    context = await browser.newContext();
    page = await context.newPage();
    loginPage = new LoginPage(page);
    xxxPage = new XxxPage(page);
});

After(async function (scenario) {
    if (scenario.result?.status === "FAILED") {
        const screenshot = await page.screenshot({ fullPage: true });
        this.attach(screenshot, "image/png");
    }
    await browser.close();
});
\`\`\`

## Archivos de referencia del proyecto

=== src/tests/features/login.feature ===
${loginFeature}

=== src/tests/features/cart.feature ===
${cartFeature}

=== src/tests/step-definitions/login.ts ===
${loginSteps}

=== src/page/LoginPage.ts ===
${loginPage}

=== src/page/CartPage.ts ===
${cartPage}`;

    const userPrompt = `Genera los 3 archivos de automatización E2E para este ticket Jira.

TICKET: ${ticketKey}
TÍTULO: ${summary}
DESCRIPCIÓN:
${description}

Extrae los criterios de aceptación de la descripción y conviértelos en escenarios BDD.
Si hay login como prerequisito, usa un Background con el step de login existente.

Responde ÚNICAMENTE con JSON válido (sin markdown, sin explicaciones, sin bloques de código), con esta estructura exacta:
{
  "feature": {
    "path": "src/tests/features/{modulo}.feature",
    "content": "..."
  },
  "pageObject": {
    "path": "src/page/{Modulo}Page.ts",
    "content": "..."
  },
  "stepDefinitions": {
    "path": "src/tests/step-definitions/{modulo}.ts",
    "content": "..."
  }
}

El nombre del módulo debe derivarse del título del ticket (en inglés, camelCase para clases, kebab-case para archivos).`;

    const client = new Anthropic();
    console.log("🤖 Llamando a Claude API (claude-opus-4-6 con adaptive thinking)...");

    const stream = client.messages.stream({
        model: "claude-opus-4-6",
        max_tokens: 8192,
        thinking: { type: "adaptive" },
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }]
    });

    const message = await stream.finalMessage();

    // Extraer el bloque de texto (ignorar thinking blocks)
    let responseText = "";
    for (const block of message.content) {
        if (block.type === "text") {
            responseText = block.text;
            break;
        }
    }

    // Parsear JSON (por si Claude agrega markdown)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        console.error("Respuesta de Claude:\n", responseText);
        throw new Error("No se encontró JSON válido en la respuesta de Claude");
    }

    return JSON.parse(jsonMatch[0]);
}

// ──────────────────────────────────────────────
// 3. MAIN
// ──────────────────────────────────────────────
async function main() {
    const ticketKey = process.env.TICKET;
    if (!ticketKey) throw new Error("Variable de entorno TICKET es requerida (ej: SB-77)");

    console.log(`\n🎫 Procesando ticket: ${ticketKey}`);

    // Obtener ticket de Jira
    const ticket = await getJiraTicket(ticketKey);
    const summary     = ticket.fields.summary || ticketKey;
    const description = adfToText(ticket.fields.description);

    console.log(`📋 Título: ${summary}`);
    console.log(`📝 Descripción (${description.length} chars)`);

    // Generar archivos con Claude
    const files = await generateTests(ticketKey, summary, description);

    // Escribir archivos al repositorio
    console.log("\n📁 Escribiendo archivos generados:");
    for (const [, file] of Object.entries(files)) {
        fs.mkdirSync(path.dirname(file.path), { recursive: true });
        fs.writeFileSync(file.path, file.content, "utf-8");
        console.log(`  ✓ ${file.path}`);
    }

    console.log(`\n✅ Tests generados exitosamente para ${ticketKey}\n`);

    // Exportar outputs para el paso siguiente del workflow
    if (process.env.GITHUB_OUTPUT) {
        const filePaths = Object.values(files).map(f => f.path).join(",");
        fs.appendFileSync(process.env.GITHUB_OUTPUT, `ticket=${ticketKey}\n`);
        fs.appendFileSync(process.env.GITHUB_OUTPUT, `summary=${summary}\n`);
        fs.appendFileSync(process.env.GITHUB_OUTPUT, `files=${filePaths}\n`);
    }
}

main().catch(err => {
    console.error("\n❌ Error:", err.message);
    process.exit(1);
});
