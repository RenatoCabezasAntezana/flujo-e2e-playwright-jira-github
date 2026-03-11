# SB-73: Login Saucedemo
Feature: Login SauceDemo
  Como cliente de SauceDemo,
  Quiero contar con un sistema de acceso seguro que valide mis credenciales,
  Para asegurar que solo yo pueda entrar a mi cuenta y realizar compras.

  Scenario: Acceso exitoso al catalogo
    Given que el cliente se encuentra en la pagina de inicio de sesion
    When ingresa el usuario "standard_user" y la contrasena "secret_sauce"
    Then el sistema debe mostrar la pantalla principal de productos

  Scenario: Intento de acceso con datos incorrectos
    Given que el cliente se encuentra en la pagina de inicio de sesion
    When ingresa el usuario "standard_user" y la contrasena "wrong_password"
    Then el sistema debe mostrar un mensaje de error indicando que los datos no coinciden

  Scenario: Intento de acceso con cuenta restringida
    Given que el cliente se encuentra en la pagina de inicio de sesion
    When ingresa el usuario "locked_out_user" y la contrasena "secret_sauce"
    Then el sistema debe mostrar un mensaje informando que el usuario esta bloqueado
