# SB-80: Gestión del carrito de compras
Feature: Gestión del carrito de compras
  Como cliente autenticado en SauceDemo,
  Quiero poder agregar y eliminar productos desde el catálogo y desde el carrito,
  Para armar mi selección de compra antes de proceder al checkout.

  Scenario: CA-1 Agregar un producto desde el catálogo incrementa el badge del carrito
    Given que el cliente está autenticado y se encuentra en la página de productos
    When hace clic en "Add to cart" del producto "sauce-labs-backpack"
    Then el botón del producto cambia a "Remove"
    And el badge del carrito muestra el valor "1"

  Scenario: CA-2 Eliminar un producto desde el catálogo decrementa el badge del carrito
    Given que el cliente tiene el producto "sauce-labs-backpack" agregado al carrito
    When hace clic en "Remove" del producto "sauce-labs-backpack" desde la página de productos
    Then el botón del producto vuelve a mostrar "Add to cart"
    And el badge del carrito desaparece

  Scenario: CA-3 Ver el contenido del carrito con producto agregado
    Given que el cliente tiene el producto "sauce-labs-backpack" agregado al carrito
    When accede al carrito mediante el ícono del header
    Then ve la página "Your Cart" con las columnas "QTY" y "Description"
    And el producto aparece con cantidad "1", nombre y precio visibles
    And están visibles los botones "Continue Shopping" y "Checkout"

  Scenario: CA-4 Eliminar un producto desde la página del carrito
    Given que el cliente está en la página del carrito con el producto "sauce-labs-backpack"
    When hace clic en "Remove" del producto en la página del carrito
    Then el producto desaparece de la lista del carrito
    And el badge del carrito desaparece

  Scenario: CA-5 El carrito vacío sigue mostrando los botones de navegación
    Given que el cliente está en la página del carrito con el producto "sauce-labs-backpack"
    When hace clic en "Remove" del producto en la página del carrito
    Then la lista del carrito aparece vacía sin ningún item
    And los botones "Continue Shopping" y "Checkout" siguen visibles
