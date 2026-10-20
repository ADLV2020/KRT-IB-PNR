# Prompts para Agentes IA — Airline Disruption Framework

Esta carpeta contiene **instrucciones, convenciones y lecciones aprendidas** para
que cualquier agente IA (o desarrollador nuevo) pueda implementar, mantener o
refactorizar el framework de automatización de disrupciones de la aerolínea.

## 📚 Índice

| # | Archivo | Cuándo leerlo |
|---|---|---|
| 00 | `00-AGENT-ONBOARDING.md` | **PRIMERO.** Cómo abordar el proyecto |
| 01 | `01-ARCHITECTURE.md` | Para entender la estructura del proyecto |
| 02 | `02-BEST-PRACTICES.md` | Antes de escribir features o JS |
| 03 | `03-LESSONS-LEARNED.md` | Antes de improvisar. 18 iteraciones de dolor |
| 04 | `04-TROUBLESHOOTING.md` | Cuando algo falla |
| 05 | `05-ADD-NEW-DISRUPTION.md` | Para agregar UNTK, FLCH, FLXX, etc. |
| 06 | `06-CONTRACT-REFERENCE.md` | Antes de tocar el fixture JSON |

## 🎯 Regla de oro

> **Lee `00-AGENT-ONBOARDING.md` antes de tocar nada.**
> El framework tiene decisiones no obvias tomadas durante meses de iteración.
> Ignorarlas te hará repetir errores ya resueltos.

## 🚦 Cómo usar esta carpeta

1. Lee el índice.
2. Lee 00, 01, 02 en orden.
3. Consulta 03 y 04 cuando algo falle.
4. Consulta 05 para agregar disrupciones.
5. **Nunca modifiques nada sin consultar `06-CONTRACT-REFERENCE.md`.**
