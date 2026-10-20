
# 06 — Referencia del Contrato v1.0.0

Fuente de verdad: `src/test/java/types/pnr-fixture.types.ts`.

## 📄 Estructura raíz

```json
    {
        "$schema": "./pnr-fixture.schema.json",
        "version": "1.0.0",
        "generatedAt": "<ISO-8601-UTC>",
        "generator": { ... },
        "filters": [ ... ],
        "stats": { ... },
        "pnrs": [ ... ]
    }
```

## 📄 PNR

```json
    {
        "pnrCode": "NNGND",            // 5 alfanuméricos
        "createdAt": "<ISO>",
        "createdAtEnv": "INT",
        "flightType": "OW",            // "OW" | "RT"
        "tripShape": "DIRECT",         // "DIRECT" | "SCALE"
        "passengerCount": 1,           // 1..9
        "segmentCount": 1,             // 1..6
        "passengers": [ ... ],
        "trips": [ ... ],
        "payment": { ... },
        "addOns": [ ... ],
        "isCheckedIn": false,
        "hasDisruption": true,
        "disruptionTypes": ["UN"],
        "mockedIn": [],
        "isFullyFlown": false,
        "_flatSegments": [ ... ]
    }
```

## 📄 Segment

```json
    {
        "segmentId": "SEG-1",
        "tripId": "TRIP-1",
        "segmentOrder": 1,
        "flightNumber": "IB0787",
        "marketingCarrier": "IB",
        "operatingCarrier": "IB",
        "carrierGroup": "IB_GROUP",    // "IB_GROUP" | "PARTNER" | "OTHER"
        "departure": { ... },
        "arrival": { ... },
        "status": "SCHEDULED",
        "lifecycleState": "FREE",
        "windowType": "VC",            // "VC" (>48h) | "VO" (<=48h)
        "hoursToDeparture": 137.62,
        "isFlown": false,
        "isCheckedIn": false,
        "checkIn": { ... },
        "mock": {
            "int": { "applied": false },
            "pre": { "applied": false }
        },
        "disruption": { ... } | null   // 0 o 1 por segmento
    }
```

## 📄 Disruption

```json
    {
        "disruptionId": "DIS-MOCK-001",
        "type": "UN",                  // UN | UNTK | FLCH | FLXX | DELAY | MISCONNECTION | CANCELLATION
        "segmentId": "SEG-1",
        "status": "APPLIED",           // APPLIED | PENDING | FAILED | ROLLED_BACK
        "appliedAt": "<ISO>",
        "detail": { ... }
    }
```

## 🔢 Enums clave

| Tipo              | 	Valores                                                    | 
| FlightType        | 	OW, RT                                                     | 
| TripShape         | 	DIRECT, SCALE                                              | 
| WindowType        | 	VC, VO                                                     | 
| SegmentLifecycle  | 	FREE, RESERVED, IN_USE, USED, FLOWN, OUT_OF_DATE, BLOCKED  | 
| DisruptionType    | 	UN, UNTK, FLCH, FLXX, DELAY, MISCONNECTION, CANCELLATION   | 
| MockEnvironment   | 	INT, PRE                                                   | 
| CarrierGroup      | 	IB_GROUP, PARTNER, OTHER                                   | 
| Locale            | 	es, ca, en, fr, de, it, nl, ru, ja, zh, pt                 | 

## 📁 Convención de archivos

```text
    {ENV}_{SHAPE}_{DISRUPTION}.json
```

* ENV: INT, PRE, DEV

* SHAPE: OW_DIRECTO, OW_ESCALA, RT_DIRECTO, RT_ESCALA

* DISRUPTION: UN, UNTK, FLCH, FLXX, DELAY, NO_DISRUPTION

Ejemplos:

* INT_OW_DIRECTO_UN.json

* PRE_RT_ESCALA_FLCH.json

## ⚠️ Cambios al contrato

Cualquier cambio requiere:

1. Actualizar shared/types/pnr-fixture.types.ts

2. Regenerar el JSON Schema: npm run generate:schema

3. Actualizar este documento

4. Versionar:

* v1.1.0 para cambios compatibles (nuevos campos opcionales)

* v2.0.0 para cambios incompatibles (renombrar, eliminar, cambiar tipos)

## 📊 Reglas de negocio embebidas

| Regla                   | 	Descripción                                   | 
| VC/VO                   | 	Se calcula por segmento. VC > 48h, VO <= 48h. | 
| Check-in doméstico      | 	Ventana de 24h antes de la salida             | 
| Check-in internacional  | 	Ventana de 48h antes de la salida             | 
| Disrupción              | 	Máximo 1 por segmento                         | 
| Mock                    | 	Por segmento, independiente en INT y PRE      | 
