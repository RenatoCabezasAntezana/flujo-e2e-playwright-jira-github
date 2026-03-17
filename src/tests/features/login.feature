# SB-78: Login Saucedemo
Feature: Login en SauceDemo
  Como cliente de SauceDemo,
  Quiero contar con un sistema de acceso seguro que valide mis credenciales,
  Para asegurar que solo yo pueda entrar a mi cuenta y realizar compras.

  # SB-78 Escenario 1: Acceso exitoso al catálogo
  Scenario: LO-1 Login exitoso con credenciales válidas
    Given que el cliente se encuentra en la pagina de inicio de sesion
    When ingresa el usuario "standard_user" y la contrasena "secret_sauce"
    Then el sistema debe mostrar la pantalla principal de productos

  # SB-78 Escenario 2: Intento de acceso con datos incorrectos
  Scenario: LO-2 Login fallido con contraseña incorrecta
    Given que el cliente se encuentra en la pagina de inicio de sesion
    When ingresa el usuario "standard_user" y la contrasena "wrong_password"
    Then el sistema debe mostrar el mensaje de error "Epic sadface: Username and password do not match any user in this service"

  # SB-78 Escenario 3: Intento de acceso con cuenta restringida
  Scenario: LO-3 Login fallido con usuario bloqueado
    Given que el cliente se encuentra en la pagina de inicio de sesion
    When ingresa el usuario "locked_out_user" y la contrasena "secret_sauce"
    Then el sistema debe mostrar el mensaje de error "Epic sadface: Sorry, this user has been locked out."
