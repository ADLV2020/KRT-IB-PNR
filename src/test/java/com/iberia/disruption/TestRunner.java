
package com.iberia.disruption;

import com.intuit.karate.core.MockServer;
import com.intuit.karate.junit5.Karate;
import org.junit.jupiter.api.BeforeAll;

class TestRunner {

    private static MockServer mockServer;

    @BeforeAll
    static void startMockServer() {
        if (mockServer == null) {
            mockServer = MockServer
                .feature("classpath:mocks/mock-server.feature")
                .http(8080)
                .build();
            System.out.println("[INFO] Mock Server iniciado en http://localhost:" + mockServer.getPort());
        }
    }

    @Karate.Test
    Karate testAll() {
        return Karate.run("classpath:e2e/generate-batch.feature").relativeTo(getClass());
    }

    @Karate.Test
    Karate testUN() {
        return Karate.run("classpath:e2e/generate-batch.feature").tags("@UN").relativeTo(getClass());
    }

    @Karate.Test
    Karate testFLCH() {
        return Karate.run("classpath:e2e/generate-batch.feature").tags("@FLCH").relativeTo(getClass());
    }

    @Karate.Test
    Karate testDelay() {
        return Karate.run("classpath:e2e/generate-batch.feature").tags("@DELAY").relativeTo(getClass());
    }

    @Karate.Test
    Karate testUNTK() {
        return Karate.run("classpath:e2e/generate-batch.feature").tags("@UNTK").relativeTo(getClass());
    }
}
