const report = require("multiple-cucumber-html-reporter");

report.generate({
    jsonDir: "reports",
    reportPath: "reports/html",
    pageTitle: "SauceDemo E2E – Reporte de Pruebas",
    reportName: "SauceDemo E2E – Cucumber Report",
    displayDuration: true,
    durationInMS: true,
    metadata: {
        browser: { name: "chrome", version: "latest" },
        device: "CI / Local",
        platform: { name: process.platform },
    },
    customData: {
        title: "Info del Run",
        data: [
            { label: "Proyecto", value: "SauceDemo E2E" },
            { label: "Stack", value: "Playwright + Cucumber + TypeScript" },
            { label: "Fecha", value: new Date().toLocaleString("es-PE") },
        ],
    },
});
