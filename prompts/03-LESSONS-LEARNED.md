
# 03 — Lecciones Aprendidas

Destiladas de **18 iteraciones** resolviendo bugs reales. Cada una costó tiempo.
No las repitas.

## 🎭 Mock Server de Karate

### ❌ L1: El `@ignore` rompe el mock server

Aunque tengas un Feature marcado para excluir de runners, si está en el
`mock-server.feature` **no se ejecuta ningún Scenario** y todos los requests
devuelven 404.

**Regla:** nunca pongas `@ignore` en el Feature del mock server.

### ❌ L2: El `match` dentro del body no filtra Scenarios

```gherkin
# ❌ Mal
Scenario: POST /api/auth
  * match pathMatches('/api/auth') && methodIs('post')
  * def response = ...
```

El nombre del Scenario POST /api/auth no es evaluable como JS, así que
ningún request lo matchea → 404.

Regla: el Scenario: <expr> debe ser una expresión JS evaluable.

### ❌ L3: .* no siempre matchea en pathMatches
Dependiendo de la versión, .* puede no funcionar bien.

Regla: usa {var} para segmentos variables.

```gherkin
    Scenario: pathMatches('/api/users/{id}') && methodIs('get')
```

## 📜 Archivos .js

### ❌ L4: Múltiples sentencias → error de sintaxis

Karate envuelve el archivo en ( ... ). Dentro de un paréntesis solo hay
una expresión, no múltiples sentencias.

```javascript

    // ❌ Mal
    function f() { return 1 }
    function g() { return 2 }
    var x = { f: f, g: g };
    x;

    // ✅ Bien
    (function () {
    function f() { return 1 }
    function g() { return 2 }
    return { f: f, g: g };
    })()

```

### ❌ L5: function() {} sin nombre rompe el IDE

El IDE marca error porque JS no acepta declaraciones de función anónimas sin
contexto. La solución es el IIFE, que sí es una expresión válida.

### ❌ L6: karate.toJson() no serializa consistentemente

En versiones recientes, karate.toJson(data) devuelve el objeto, no un string.
Al llamar .getBytes() falla con Unknown identifier: getBytes.

Regla: usa JSON.stringify() (nativo) + new java.lang.String(s).getBytes(UTF_8).

### ❌ L7: call no invoca funciones ya importadas

´´´gherkin
    # ❌ Mal
    * call utils.writeJson(path, data)
´´´

Karate intenta call undefined porque writeJson es void.

Regla: sin call. Solo utils.writeJson(path, data).

## 📝 Gherkin

### ❌ L8: Objetos multilínea rompen el parser

```gherkin
    # ❌ Mal
    * def pnrData = {
        pnrCode: '#(pnrCode)',
        ...
    }
```

El parser cierra el step en el { y luego no sabe interpretar lo siguiente.

Regla: un objeto multilínea o va en .js, o se aplana en una línea.

### ❌ L9: call read() { multilinea } falla

Mismo problema. Regla: define el objeto como variable primero.

```gherkin
    * def args = { origin: 'MAD', destination: 'BER', flightType: 'OW' }
    * def result = call read('pnr/create-pnr.feature') args
```

### ❌ L10: $schema rompe el parser

La clave $schema en un objeto inline no es JSON válido sin quotes.

Regla: mueve la construcción del fixture a .js o usa '$schema' con comillas.

### ❌ L11: <placeholder> fuera de Scenario Outline no se resuelve

Si usas <var> en un Scenario normal, Karate no lo reemplaza.

Regla: <var> solo funciona en Scenario Outline con Examples.

### ❌ L12: Scenario Outline + call read() devuelve solo el último ejemplo

Karate ejecuta todos los Examples pero solo expone las variables del último.

Regla: un Scenario Outline con call read es inviable para generar lotes.
Usa Scenario normal con argumentos.

🔢 JSON en Karate

### ❌ L13: Objetos con + fallan como JSON

```gherkin
    # ❌ Mal
    * def authHeader = { Authorization: 'Bearer ' + accessToken }
```

Karate interpreta {...} como JSON estricto y 'Bearer ' + token no es JSON válido.

Regla: envuelve en #(...):

```gherkin
    * def authHeader = { Authorization: '#("Bearer " + accessToken)' }
```

## 📊 Tabla resumen

| Quiero…               | 	Sintaxis                                          | 
| Objeto JSON puro      | 	{ key: 'value', num: 42 }                         | 
| Objeto con expresión  | 	{ key: '#(jsExpr)' }                              | 
| Lógica compleja       | 	({ key: jsExpr, other: fn() }) (paréntesis doble) | 
| Concatenación simple  | 	'#("prefijo" + variable)'                         | 

## 🖥️ Entorno y tooling

### ❌ L14: Encoding UTF-8 en Windows

Los emojis y acentos se corrompen en Windows (Ã¡ en lugar de á).

Regla: sin emojis ni acentos en .feature. Añade UTF-8 explícito en pom.xml:

```xml
    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>
```

### ❌ L15: Surefire no encuentra TestRunner    

Por defecto, Surefire busca *Test, Test*, *Tests, *TestCase.
TestRunner no coincide.

Regla: inclúyelo explícitamente en pom.xml:

```xml
    <includes>
        <include>**/*Test.java</include>
        <include>**/TestRunner.java</include>
    </includes>
```

O renómbralo a TestRunnerTest.java.

### ❌ L16: Mock server en clase separada no se arranca

Si MockServerRunner es una clase independiente, solo se ejecuta con
-Dtest=MockServerRunner. Con TestRunner, no arranca → Connection refused.

Regla: arranca el mock en el @BeforeAll del TestRunner principal.

### ❌ L17: Maven en Windows con -D...="valor con espacios"

```powershell
    # ❌ Mal — Maven interpreta mal
    mvn test -Dkarate.options="--tags @UN" -Dtest=TestRunner

    # ✅ Bien — toda la propiedad entre comillas
    mvn test "-Dkarate.options=--tags @UN" -Dtest=TestRunner
```

## 🎯 Otras

### ❌ L18: MockServer.port() no existe en Karate v2

El método correcto es .http(8080).

```java
    MockServer server = MockServer
        .feature("classpath:mocks/mock-server.feature")
        .http(8080)
        .build();
```

### ❌ L19: MockServerBuilder.start() no existe

En Karate v2, el servidor se inicia con .build(). No hay .start().

### ❌ L20: PNR mock siempre devuelve el mismo valor

issue-response.json tiene "pnr": "NNGND" fijo. Para que cada llamada
devuelva un valor único, usa el mock con un generator:

```gherkin
    Scenario: pathMatches('/api/sse-orm/rs/v3/issue') && methodIs('post')
    * def utils = read('classpath:common/utils.js')
    * def baseResponse = read(mockBasePath + '/issue-response.json')
    * def response = karate.merge(baseResponse, {
        pnr: '#(utils.randomPnrCode())',
        ticketNumber: '#(utils.randomTicketNumber())'
        })
```

## 💎 Resumen

| Capa         | 	Regla                                                       | 
| Mock server  | 	Nombre del Scenario = matcher. Sin @ignore. {var} no .*.    | 
| .js          | 	IIFE de una expresión. JSON.stringify para serializar.      | 
| Gherkin      | 	Un step = una línea. Sin emojis ni acentos.                 | 
| JSON         | 	{...} = JSON estricto. Usa #() para expresiones.            | 
| call         | 	Solo para features y .js con función.                       | 
| Entorno      | 	UTF-8. Surefire con include explícito. Mock en @BeforeAll.  | 

### ❌ L22: Los `.feature` se cargan desde `target/test-classes/`, no desde `src/`

**Síntoma:** editas un `.feature`, ejecutas, y el error apunta al contenido viejo. O el log muestra un número de línea que no coincide con tu archivo actual.

**Causa:** Karate lee del **classpath**. Maven copia `src/test/java/**/*.feature` a `target/test-classes/**/*.feature`. Si no recompilas (o recompilas sin `clean`), Karate ejecuta la versión vieja.

**Diagnóstico:**
```powershell
# Compara ambos archivos
Get-Content src\test\java\disruption\un.feature
Get-Content target\test-classes\disruption\un.feature
```

## FIX

```powershell
    mvn clean
    mvn install -DskipTests
```

### ❌ L24: `#()` no se resuelve dentro de funciones JS como `karate.merge`

**Síntoma:** el mock devuelve strings literales como `'#(variable)'` en lugar del valor resuelto. El feature que consume esos datos falla en `match`.

**Causa:** Karate procesa `#(...)` como *embedded expression* solo cuando el objeto se define en el **contexto directo** de un `def`, `request`, `response`, etc. Cuando el objeto se pasa como **argumento a una función JS** (como `karate.merge(...)`), se pasa "crudo" y `#()` **no se resuelve**.

**Ejemplo del problema:**

```gherkin
# ❌ Mal — el objeto se pasa crudo a karate.merge
* def disruptionType = request.type
* def response = karate.merge(baseResponse, { type: '#(disruptionType)' })
# → devuelve: { type: '#(disruptionType)', ... }   (literal!)
```

## Solución:

```gherkin
    # ✅ Bien — variable directa sin #() ni comillas
    * def disruptionType = request.type
    * def response = karate.merge(baseResponse, { type: disruptionType })
    # → devuelve: { type: 'UN', ... }
```

Regla de oro para objetos JSON en Karate:

| Dentro de un objeto { }	Sintaxis
| String literal                        | 	{ key: 'texto' }
| Variable JS definida                  | 	{ key: variable } ✅
| Expresión embebida (contexto directo) | 	{ key: '#(expr)' }       | 
| Llamada a función JS                  | 	{ key: miFuncion() } ✅ | 
