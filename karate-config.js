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
/**
 * karate-config.js — Configuración global de Karate
 */
function fn() {
  var env = karate.env || 'int';
  karate.log('🔧 karate-config.js → entorno:', env);

  // ------------------------------------------------------------------
  // Configuración base
  // ------------------------------------------------------------------
  var config = {
    env: env,
    mockServer: {
      enabled: true,
      port: 8080,
      baseUrl: 'http://localhost:8080'
    },
    timeouts: {
      default: 10000,
      disruption: 30000
    },
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    vpn: {
      required: false
    },
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
    config.vpn.required = true;
  } else if (env === 'pre') {
    config.mockServer.port = 8081;
    config.vpn.required = true;
    config.timeouts.disruption = 45000;
  } else if (env === 'dev') {
    config.mockServer.port = 8082;
    config.vpn.required = false;
  }

  // ------------------------------------------------------------------
  // Secrets
  // ------------------------------------------------------------------
  config.secrets = {
    authUser:     karate.properties['AUTH_USER'] || 'test-user',
    authPassword: karate.properties['AUTH_PASSWORD'] || 'test-pass',
    vaultApiKey:  karate.properties['VAULT_API_KEY'] || 'mock-key'
  };

  // ──────────────────────────────────────────────────────────────────
  // NUEVO: Fuente de datos para creación de PNRs
  //   - "mock" (default): llama al mock local (7 pasos)
  //   - "real":            llama al Sistema Inyector (1 paso)
  // ──────────────────────────────────────────────────────────────────
  config.dataSource = karate.properties['dataSource'] || 'mock';

  // ──────────────────────────────────────────────────────────────────
  // NUEVO: Backend real (Sistema Inyector Node.js)
  // ──────────────────────────────────────────────────────────────────
  config.realBackend = {
    enabled: config.dataSource === 'real',
    baseUrl: karate.properties['realBackend.baseUrl'] || 'http://localhost:3000',
    // El flujo real hace 7 pasos con delays internos de 1-5s cada uno.
    // Puede tardar 30-90s por PNR. Damos 2 minutos de margen.
    connectTimeout: 5000,
    readTimeout: 120000
  };

  // ------------------------------------------------------------------
  // Log de la configuración efectiva
  // ------------------------------------------------------------------
  karate.log('📊 dataSource:', config.dataSource);
  if (config.dataSource === 'real') {
    karate.log('🚀 realBackend.baseUrl:', config.realBackend.baseUrl);
    karate.log('⏱️  realBackend.readTimeout:', config.realBackend.readTimeout, 'ms');
    karate.log('⏱️  realBackend.connectTimeout:', config.realBackend.connectTimeout, 'ms');
  }

  return config;
}
