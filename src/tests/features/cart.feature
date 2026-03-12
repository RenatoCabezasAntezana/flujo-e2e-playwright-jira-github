# SB-76: Gestión del carrito de compras
Feature: Carrito de Compras SauceDemo
  Como cliente autenticado en SauceDemo,
  Quiero poder agregar y eliminar productos desde el catalogo y desde el carrito,
  Para armar mi seleccion de compra antes de proceder al checkout.

  Background:
    Given que el cliente ha iniciado sesion como "standard_user" con contrasena "secret_sauce"

  Scenario: CA-1 Agregar producto desde el catalogo
    Given se encuentra en la pagina de productos
    When agrega el producto "sauce-labs-backpack" al carrito
    Then el boton del producto "sauce-labs-backpack" muestra "Remove"
    And el badge del carrito muestra el contador "1"

  Scenario: CA-2 Eliminar producto desde el catalogo
    Given se encuentra en la pagina de productos
    And el producto "sauce-labs-backpack" fue agregado al carrito
    When elimina el producto "sauce-labs-backpack" desde el catalogo
    Then el boton del producto "sauce-labs-backpack" muestra "Add to cart"
    And el badge del carrito no es visible

  Scenario: CA-3 Ver contenido del carrito
    Given se encuentra en la pagina de productos
    And el producto "sauce-labs-backpack" fue agregado al carrito
    When accede al carrito mediante el icono del header
    Then se encuentra en la pagina del carrito
    And el carrito muestra el producto con nombre descripcion y precio
    And los botones "Continue Shopping" y "Checkout" son visibles

  Scenario: CA-4 Eliminar producto desde el carrito
    Given el cliente esta en el carrito con el producto "sauce-labs-backpack" agregado
    When elimina el producto "sauce-labs-backpack" desde el carrito
    Then el producto desaparece de la lista del carrito
    And el badge del carrito no es visible

  Scenario: CA-5 Carrito vacio
    Given el cliente accede directamente al carrito sin productos
    Then se encuentra en la pagina del carrito
    And la lista del carrito aparece sin items
    And los botones "Continue Shopping" y "Checkout" son visibles
