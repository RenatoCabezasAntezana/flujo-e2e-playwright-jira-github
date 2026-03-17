# SB-73: Login Saucedemo
Feature: Login en SauceDemo
  Como cliente de SauceDemo
  Quiero contar con un sistema de acceso seguro que valide mis credenciales
  Para asegurar que solo yo pueda entrar a mi cuenta y realizar compras

  Scenario: Acceso exitoso al catalogo de productos
    Given que el cliente se encuentra en la pagina de inicio de sesion
    When ingresa el usuario "standard_user" y la contrasena "secret_sauce"
    Then el sistema debe permitir el ingreso y mostrar la pantalla de productos

  Scenario: Intento de acceso con contrasena incorrecta
    Given que el cliente se encuentra en la pagina de inicio de sesion
    When ingresa el usuario "standard_user" y la contrasena "wrong_password"
    Then el sistema debe mostrar el mensaje "Epic sadface: Username and password do not match any user in this service"

  Scenario: Intento de acceso con cuenta bloqueada
    Given que el cliente se encuentra en la pagina de inicio de sesion
    When ingresa el usuario "locked_out_user" y la contrasena "secret_sauce"
    Then el sistema debe mostrar el mensaje "Epic sadface: Sorry, this user has been locked out."

  Scenario: Intento de acceso con campos vacios
    Given que el cliente se encuentra en la pagina de inicio de sesion
    When intenta iniciar sesion sin ingresar credenciales
    Then el sistema debe mostrar el mensaje "Epic sadface: Username is required"
