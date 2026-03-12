# SB-77: Gestión del carrito de compras
Feature: Carrito de Compras SauceDemo v2
  Como cliente autenticado en SauceDemo,
  Quiero poder agregar y eliminar productos desde el catalogo y desde el carrito,
  Para armar mi seleccion de compra antes de proceder al checkout.

  Background:
    Given que el usuario ha iniciado sesion como "standard_user" con password "secret_sauce"

  Scenario: CA-1 Agregar producto desde el catalogo actualiza boton y badge
    Given que el usuario esta en la pagina de inventario
    When el usuario agrega el producto "sauce-labs-backpack" al carrito desde el catalogo
    Then el boton del producto "sauce-labs-backpack" cambia a "Remove"
    And el badge del header muestra el valor "1"

  Scenario: CA-1b Agregar multiples productos incrementa el badge correctamente
    Given que el usuario esta en la pagina de inventario
    When el usuario agrega el producto "sauce-labs-backpack" al carrito desde el catalogo
    And el usuario agrega el producto "sauce-labs-bike-light" al carrito desde el catalogo
    Then el badge del header muestra el valor "2"
    And el boton del producto "sauce-labs-backpack" cambia a "Remove"
    And el boton del producto "sauce-labs-bike-light" cambia a "Remove"

  Scenario: CA-2 Eliminar producto desde el catalogo revierte boton y badge
    Given que el usuario esta en la pagina de inventario
    And el producto "sauce-labs-backpack" ha sido agregado al carrito
    When el usuario elimina el producto "sauce-labs-backpack" desde el catalogo
    Then el boton del producto "sauce-labs-backpack" cambia a "Add to cart"
    And el badge del header no esta visible

  Scenario: CA-3 Ver contenido completo del carrito con nombre descripcion y precio
    Given que el usuario esta en la pagina de inventario
    And el producto "sauce-labs-backpack" ha sido agregado al carrito
    When el usuario navega al carrito usando el icono del header
    Then el usuario se encuentra en la pagina del carrito
    And el carrito contiene el producto "Sauce Labs Backpack"
    And el item del carrito muestra la descripcion del producto
    And el item del carrito muestra la cantidad "1"
    And el item del carrito muestra el precio del producto
    And el boton "Continue Shopping" esta visible en el carrito
    And el boton "Checkout" esta visible en el carrito

  Scenario: CA-4 Eliminar producto desde el carrito lo remueve de la lista
    Given que el usuario tiene el producto "sauce-labs-backpack" en el carrito
    When el usuario elimina el producto "sauce-labs-backpack" desde la pagina del carrito
    Then la lista del carrito no contiene items
    And el badge del header no esta visible

  Scenario: CA-5 Carrito vacio muestra la lista sin items y con botones de accion
    Given que el usuario accede al carrito sin haber agregado productos
    Then el usuario se encuentra en la pagina del carrito
    And la lista del carrito no contiene items
    And el boton "Continue Shopping" esta visible en el carrito
    And el boton "Checkout" esta visible en el carrito
