# SB-73: Login Saucedemo
Feature: Login Saucedemo
  Como cliente de SauceDemo,
  Quiero contar con un sistema de acceso seguro que valide mis credenciales,
  Para asegurar que solo yo pueda entrar a mi cuenta y realizar compras.

  Scenario: Acceso exitoso al catálogo
    Given que el cliente se encuentra en la página de inicio de sesión
    When ingresa el usuario "standard_user" y la contraseña "secret_sauce"
    Then el sistema debe permitirle el ingreso y mostrar la pantalla principal de productos

  Scenario: Intento de acceso con datos incorrectos
    Given que el cliente se encuentra en la página de inicio de sesión
    When ingresa el usuario "standard_user" y la contraseña "wrong_password"
    Then el sistema no debe permitir el ingreso y debe mostrar el mensaje "Epic sadface: Username and password do not match any user in this service"

  Scenario: Intento de acceso con cuenta restringida
    Given que el cliente se encuentra en la página de inicio de sesión
    When ingresa el usuario "locked_out_user" y la contraseña "secret_sauce"
    Then el sistema no debe permitir el ingreso y debe mostrar el mensaje "Epic sadface: Sorry, this user has been locked out."
