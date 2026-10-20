
# 02 — Mejores Prácticas

Reglas destiladas tras 18 iteraciones. **No las rompas sin buena razón.**

## 📝 En archivos `.feature`

### ✅ Obligatorio

1. **Un step = una línea física.**
   ```gherkin
   # ✅ Bien
   * call utils.writeJson(outputPath, fixture)

   # ❌ Mal
   * call utils.writeJson(outputPath,
       fixture)

2. **Objetos JSON en una sola línea o con #(...):**

    ```gherkin
        # ✅ Bien
        * def args = { origin: 'MAD', destination: 'BER', flightType: 'OW' }

        # ❌ Mal
        * def args = {
            origin: 'MAD',
            destination: 'BER'
        }
    ```

3. **Concatenación de strings con #(...):**

    ```gherkin
        # ✅ Bien
        * def authHeader = { Authorization: '#("Bearer " + accessToken)' }

        # ❌ Mal
        * def authHeader = { Authorization: 'Bearer ' + accessToken }
    ```

4. **Sin emojis ni caracteres no-ASCII en .feature:**

    ```gherkin
        # ✅ Bien
        * print '[OK] PNR creado:', pnrCode

        # ❌ Mal
        * print '✅ PNR creado:', pnrCode
    ```
5. **Nombres de archivo sin acentos: create-pnr.feature, no creación-pnr.feature.**

### ❌ Prohibido

* Objetos multilínea inline
* Emojis en Gherkin
* Acentos en comentarios y títulos
* <placeholders> fuera de Scenario Outline con Examples
* call read() con objetos multilínea → usa variable intermedia

## 📜 En archivos .js

### ✅ Obligatorio

1. Un archivo = una expresión IIFE:

    ```javascript
        (function () {
            function miFuncion(x) { return x * 2; }
            return { miFuncion: miFuncion };
        })()
    ```

2. Sin var al inicio, sin x; al final.

3. Funciones internas con function nombre() {}, no var nombre = function() {}.

4. Para escribir archivos, usar JSON.stringify + Java String:

    ```javascript
        function writeJson(path, data) {
            var Files = Java.type('java.nio.file.Files');
            var Paths = Java.type('java.nio.file.Paths');
            var Charsets = Java.type('java.nio.charset.StandardCharsets');
            var content = JSON.stringify(data, null, 2);
            var bytes = new java.lang.String(content).getBytes(Charsets.UTF_8);
            Files.write(Paths.get(path), bytes);
        }
    ```

Nunca uses karate.toJson() — comportamiento inconsistente entre versiones.

### ❌ Prohibido

* Múltiples sentencias al nivel raíz

* karate.toJson() para escribir archivos

* require() (Karate no lo soporta)

### 🎯 call vs invocación directa
| Caso	                         | Sintaxis                            | 
| Otro feature	                 | * call read('x.feature') args       | 
| .js que devuelve función	     | * def fn = call read('x.js')        | 
| .js que devuelve objeto (IIFE) | * def utils = read('x.js')          | 
| Función ya importada	         | * utils.miFuncion(args) — sin call  | 
| Método de Karate	             | * karate.append(list, item)         | 
| Java puro	                     | * Java.type('...')                  | 

## 🎭 En mock-server.feature

### ✅ Regla de oro
El nombre del Scenario ES el matcher.

```gherkin
    # ✅ Correcto
    Scenario: pathMatches('/api/users/{id}') && methodIs('get')
    * def response = read('classpath:mocks/data/user.json')

    # ❌ Incorrecto
    Scenario: Get user
    * match pathMatches('/api/users/{id}') && methodIs('get')
    * def response = read('classpath:mocks/data/user.json')
```

## ✅ Path con segmentos variables

```gherkin
    # ✅ Correcto — usa {var}
    Scenario: pathMatches('/api/pmt-ppm/rs/ppm/{orderId}/payment-methods') && methodIs('get')

    # ❌ Incorrecto — usa .* que no siempre funciona
    Scenario: pathMatches('/api/pmt-ppm/rs/ppm/.*/payment-methods') && methodIs('get')
```

## ❌ Nunca

* @ignore en el Feature del mock server
* '* match ... como step dentro del body
* .* en pathMatches

## 🔧 Maven + Windows
Para ejecutar con system properties que contengan espacios, envuelve toda la propiedad entre comillas dobles:

```powershell
    # ✅ Correcto
    mvn test "-Dkarate.options=--tags @UN" -Dtest=TestRunner

    # ❌ Incorrecto — Maven interpreta mal
    mvn test -Dkarate.options="--tags @UN" -Dtest=TestRunner
```

## 📊 Estructura de un feature típico

```gherkin
    Feature: <descripción>
    # Sin acentos, sin emojis.

    Scenario: <caso de uso>
        * url mockServer.baseUrl
        * def utils = read('classpath:common/utils.js')
        * configure headers = headers

        # Pasos con Given/When/Then/And/But
        # ...

        # Aserciones
        * match response.foo == 'bar'
        * print '[OK] resultado:', variable
```

## 🎯 Nomenclatura

| Elemento                | 	Convención                               | 
| Archivos feature        | 	kebab-case.feature                       | 
| Features de utilidad    | 	En carpeta common/                       | 
| Features de disrupción  | 	En carpeta disruption/{tipo}.feature     | 
| Orquestadores           | 	En carpeta e2e/                          | 
| Variables JS            | 	camelCase                                | 
| Constantes JS           | 	SCREAMING_SNAKE_CASE                     | 
| Archivos .js            | 	kebab-case.js                            | 
| Tags                    | 	@UN, @UNTK, @FLCH, @DELAY (mayúsculas)   | 

