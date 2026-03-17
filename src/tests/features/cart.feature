# SB-79: Gestión del carrito de compras

Feature: Gestión del carrito de compras en SauceDemo
  Como cliente autenticado en SauceDemo
  Quiero poder agregar y eliminar productos desde el catálogo y desde el carrito
  Para armar mi selección de compra antes de proceder al checkout

  Scenario: SB-79-CA1 - Agregar producto desde el catálogo actualiza el botón y el badge
    Given que el cliente está autenticado y se encuentra en la página de productos
    When hace clic en "Add to cart" del producto "Sauce Labs Bike Light"
    Then el botón del producto "Sauce Labs Bike Light" cambia a "Remove"
    And el badge del carrito muestra el contador "1"

  Scenario: SB-79-CA2 - Eliminar producto desde el catálogo restaura el botón y reduce el badge
    Given que el cliente está autenticado y tiene "Sauce Labs Bike Light" en el carrito
    When hace clic en "Remove" del producto "Sauce Labs Bike Light" en la página de productos
    Then el botón del producto "Sauce Labs Bike Light" vuelve a mostrar "Add to cart"
    And el badge del carrito desaparece

  Scenario: SB-79-CA3 - Ver contenido del carrito con producto agregado
    Given que el cliente está autenticado y tiene "Sauce Labs Bolt T-Shirt" en el carrito
    When accede al carrito mediante el ícono del header
    Then ve la página "Your Cart" con columnas "QTY" y "Description"
    And el producto "Sauce Labs Bolt T-Shirt" aparece en el carrito con cantidad 1
    And están visibles los botones "Continue Shopping" y "Checkout"

  Scenario: SB-79-CA4 - Eliminar producto desde el carrito actualiza la lista y el badge
    Given que el cliente está autenticado y se encuentra en el carrito con "Sauce Labs Onesie"
    When hace clic en "Remove" del producto "Sauce Labs Onesie" en la página del carrito
    Then el producto "Sauce Labs Onesie" desaparece de la lista del carrito
    And el badge del carrito desaparece

  Scenario: SB-79-CA5 - Carrito vacío muestra lista vacía y botones de navegación
    Given que el cliente está autenticado y se encuentra en el carrito sin productos
    When está en la página "Your Cart"
    Then la lista del carrito aparece vacía sin ningún item
    And están visibles los botones "Continue Shopping" y "Checkout"
