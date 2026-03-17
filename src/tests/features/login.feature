# SB-78: Login Saucedemo

Feature: Login en SauceDemo
  Como cliente de SauceDemo
  Quiero contar con un sistema de acceso seguro que valide mis credenciales
  Para asegurar que solo yo pueda entrar a mi cuenta y realizar compras

  Scenario: SB-78-E1 - Acceso exitoso al catálogo con credenciales válidas
    Given que el cliente se encuentra en la página de inicio de sesión
    When ingresa el usuario "standard_user" y la contraseña "secret_sauce"
    Then el sistema debe permitir el ingreso y mostrar la pantalla principal de productos

  Scenario: SB-78-E2 - Intento de acceso con contraseña incorrecta
    Given que el cliente se encuentra en la página de inicio de sesión
    When ingresa el usuario "standard_user" y la contraseña "wrong_password"
    Then el sistema no debe permitir el ingreso y debe mostrar el mensaje "Epic sadface: Username and password do not match any user in this service"

  Scenario: SB-78-E3 - Intento de acceso con cuenta bloqueada
    Given que el cliente se encuentra en la página de inicio de sesión
    When ingresa el usuario "locked_out_user" y la contraseña "secret_sauce"
    Then el sistema no debe permitir el ingreso y debe mostrar el mensaje "Epic sadface: Sorry, this user has been locked out."
