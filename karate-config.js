/**
 * karate-config.js — Configuración global de Karate
 *
 * Variables disponibles:
 *   karate.env         → entorno (dev | int | pre) desde -Dkarate.env
 *   karate.properties  → system properties de la JVM
 *   karate.get/set     → variables globales entre escenarios
 *
 * Convención: NO hardcodear URLs ni credenciales.
 * Usar variables de entorno o archivos .env.
 */
function fn() {
  var env = karate.env || 'int';
  karate.log('🔧 karate-config.js → entorno:', env);

  // ------------------------------------------------------------------
  // Configuración base (común a todos los entornos)
  // ------------------------------------------------------------------
  var config = {
    env: env,
    mockServer: {
      enabled: true,          // true: usar mocks; false: llamar servicios reales
      port: 8080,
      baseUrl: 'http://localhost:8080'
    },
    timeouts: {
      default: 10000,         // 10s para peticiones normales
      disruption: 30000       // 30s para disrupción (pasa por VPN en real)
    },
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    vpn: {
      required: false         // Solo true en INT/PRE con servicios reales
    },
    // URLs de los servicios reales (solo si mockServer.enabled = false)
    services: {
      authUrl:      'https://int-ibisservices.iberia.com',
      availability: 'https://int-ibisservices.iberia.com',
      fare:         'https://int-ibisservices.iberia.com',
      order:        'https://int-ibisservices.iberia.com',
      payment:      'https://int-ibisservices.iberia.com',
      vault:        'https://www.test.indra-netplus.com',
      issue:        'https://int-ibisservices.iberia.com',
      checkin:      'https://int.iberia.com',
      disruption:   'https://reacomapppre.w-sdlc-pre-cc-pss.aws.iberia.es:1992'
    }
  };

  // ------------------------------------------------------------------
  // Overrides por entorno
  // ------------------------------------------------------------------
  if (env === 'int') {
    config.mockServer.port = 8080;
    config.vpn.required = true;   // Disrupción en INT requiere VPN
  } else if (env === 'pre') {
    config.mockServer.port = 8081;
    config.vpn.required = true;
    config.timeouts.disruption = 45000;
  } else if (env === 'dev') {
    config.mockServer.port = 8082;
    config.vpn.required = false;
  }

  // ------------------------------------------------------------------
  // Secrets desde variables de entorno (NUNCA hardcodear)
  // ------------------------------------------------------------------
  config.secrets = {
    authUser:     karate.properties['AUTH_USER'] || 'test-user',
    authPassword: karate.properties['AUTH_PASSWORD'] || 'test-pass',
    vaultApiKey:  karate.properties['VAULT_API_KEY'] || 'mock-key'
  };

  karate.log('✅ Configuración cargada:', JSON.stringify(config, null, 2));
  return config;
}
