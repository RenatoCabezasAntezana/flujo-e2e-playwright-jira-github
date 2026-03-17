# SB-81: Gestión del carrito de compras

Feature: Gestión del carrito de compras
  Como cliente autenticado en SauceDemo
  Quiero poder agregar y eliminar productos desde el catálogo y desde el carrito
  Para armar mi selección de compra antes de proceder al checkout

  Background:
    Given que el cliente está autenticado y en la página de productos

  # CA-1: Agregar producto desde el catálogo
  Scenario: Agregar un producto desde el catálogo incrementa el badge del carrito
    When hace clic en "Add to cart" del producto "sauce-labs-backpack"
    Then el botón del producto cambia a "Remove"
    And el badge del carrito muestra el contador "1"

  # CA-2: Eliminar producto desde el catálogo
  Scenario: Eliminar un producto desde el catálogo reduce el badge del carrito
    Given tiene el producto "sauce-labs-backpack" agregado al carrito
    When hace clic en "Remove" del producto "sauce-labs-backpack" desde el catálogo
    Then el botón del producto vuelve a mostrar "Add to cart"
    And el badge del carrito desaparece

  # CA-3: Ver contenido del carrito
  Scenario: Ver el contenido del carrito con un producto agregado
    Given tiene el producto "sauce-labs-backpack" agregado al carrito
    When accede al carrito mediante el ícono del header
    Then ve la página "Your Cart" con las columnas QTY y Description
    And el producto aparece con cantidad 1, nombre, descripción y precio
    And están visibles los botones "Continue Shopping" y "Checkout"

  # CA-4: Eliminar producto desde el carrito
  Scenario: Eliminar un producto desde la página del carrito
    Given tiene el producto "sauce-labs-backpack" agregado al carrito
    And está en la página del carrito
    When hace clic en "Remove" del producto desde el carrito
    Then el producto desaparece de la lista del carrito
    And el badge del carrito desaparece

  # CA-5: Carrito vacío muestra la lista sin items
  Scenario: El carrito vacío no muestra ningún item pero mantiene los botones de navegación
    Given está en la página del carrito sin productos
    Then la lista del carrito aparece vacía sin ningún item
    And están visibles los botones "Continue Shopping" y "Checkout"
