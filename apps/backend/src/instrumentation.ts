import { NodeSDK } from '@opentelemetry/sdk-node';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino';

// Must be imported before anything that loads http, express, Nest or pino, so
// the instrumentations can patch them. Pino records are exported as OTLP logs
// carrying the trace and span id of the request that emitted them. The SDK is
// configured entirely from the OTEL_* environment variables that the Aspire
// AppHost injects (endpoint, protocol, headers, service name, resource
// attributes). Without an OTLP endpoint — e.g. a plain `nest:start:dev` —
// telemetry stays off and logs only go to stdout.
if (process.env.OTEL_EXPORTER_OTLP_ENDPOINT) {
  const sdk = new NodeSDK({
    instrumentations: [
      new HttpInstrumentation(),
      new ExpressInstrumentation(),
      new NestInstrumentation(),
      new PinoInstrumentation(),
    ],
  });
  sdk.start();

  // Flush buffered spans and log records before the process exits.
  for (const signal of ['SIGINT', 'SIGTERM'] as const) {
    process.once(signal, () => {
      void sdk.shutdown().finally(() => process.exit(0));
    });
  }
}
