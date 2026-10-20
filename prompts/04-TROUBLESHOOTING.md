
# 04 — Troubleshooting

Guía rápida de errores frecuentes y su solución.

## 🎭 Mock Server

### `Connection refused` al llamar a localhost:8080

**Causa:** el mock server no está corriendo.
**Fix:** verifica que `MockServerRunner` está integrado en `TestRunner.@BeforeAll`.

### Status `404` en cualquier endpoint

**Causa A:** el Feature del mock tiene `@ignore`.
**Fix:** quita el `@ignore`.

**Causa B:** el Scenario no matchea.
**Fix:** verifica que `Scenario: <expr>` sea una expresión JS válida.

**Causa C:** `pathMatches` con `.*`.
**Fix:** usa `{var}`.

### `port(int)` no existe

**Fix:** usa `.http(int)`.

### `start()` no existe

**Fix:** el servidor se inicia con `.build()`.

## 📜 Archivos `.js`

### `Expected ) but found function`

**Causa:** múltiples sentencias al nivel raíz del archivo.
**Fix:** envuelve todo en IIFE.

### `Expected an operand but found eof`

**Causa A:** step multilínea en `.feature`.
**Fix:** una línea física.

**Causa B:** `call` con función void.
**Fix:** quita `call`.

### `Identifier expected.ts(1003)`

**Causa:** `function () {}` sin nombre → error de TS.
**Fix:** envuelve en IIFE.

### `Unknown identifier: getBytes`

**Causa:** `karate.toJson()` devuelve objeto, no string.
**Fix:** usa `JSON.stringify` + `new java.lang.String(s).getBytes(UTF_8)`.

### `not a callable feature or js function`

**Causa:** usaste `call read` en un `.js` que devuelve objeto (IIFE).
**Fix:** usa `read` sin `call`.

## 📝 Gherkin

### `mismatched input 'X' expecting <EOF>`

**Causa A:** objeto multilínea inline.
**Fix:** aplanar en una línea o mover a `.js`.

**Causa B:** `$schema` sin quotes.
**Fix:** `'$schema'` o mover a `.js`.

**Causa C:** emoji o carácter no-ASCII mal codificado.
**Fix:** reemplaza por `[OK]`, `[INFO]`, etc.

### `Unexpected token + at position N`

**Causa:** objeto JSON con concatenación sin `#()`.
**Fix:** `{ Authorization: '#("Bearer " + token)' }`.

### `<placeholder>` no se resuelve

**Causa:** estás fuera de un `Scenario Outline`.
**Fix:** usa argumentos vía `call read() args`.

## 🖥️ Maven / Windows

### `Unknown lifecycle phase ".options=--tags @UN"`

**Causa:** comillas mal puestas.
**Fix:** `mvn test "-Dkarate.options=--tags @UN" -Dtest=TestRunner`.

### `No tests matching pattern "TestRunner"`

**Causa:** Surefire no lo detecta.
**Fix:** añade `<include>**/TestRunner.java</include>` en `pom.xml`.

### Acentos corruptos (`Ã¡`)

**Causa:** encoding incorrecto.
**Fix:** guarda archivos en UTF-8 sin BOM. Añade encoding en `pom.xml`.

## 🔍 Comandos de diagnóstico

```powershell
    # ¿Existen todos los features?
    Get-ChildItem -Path src\test\java -Recurse -Filter *.feature | Select-Object FullName

    # ¿Se copiaron a target?
    Get-ChildItem -Path target\test-classes -Recurse -Filter *.feature | Select-Object FullName

    # ¿Hay encoding raro?
    Get-ChildItem -Path src\test\java -Recurse -Filter *.feature | ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        if ($content -match '[^\x00-\x7F]') { Write-Host "⚠️  $($_.FullName)" }
    }

    # ¿Qué hay en el classpath?
    Get-ChildItem -Path target\test-classes\mocks -Recurse
```

## 🧪 Verificación rápida de un feature

Para aislar un problema:

1. Comenta el cuerpo del feature.

2. Deja solo:

```gherkin
    Feature: Test mínimo
        @UN
        Scenario: Verificar que parsea
            * print 'ok'
```

3. Ejecuta. Si pasa, el problema está en el contenido.

4. Si falla, es de configuración global.
