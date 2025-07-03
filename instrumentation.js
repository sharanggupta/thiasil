/**
 * Next.js 15 Instrumentation API
 * Server lifecycle observability and performance monitoring
 */

export async function register() {
  // Enable server-side instrumentation
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { NodeSDK } = await import('@opentelemetry/sdk-node');
    const { Resource } = await import('@opentelemetry/resources');
    const { SemanticResourceAttributes } = await import('@opentelemetry/semantic-conventions');
    
    // Initialize OpenTelemetry SDK
    const sdk = new NodeSDK({
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'thiasil-app',
        [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
      }),
    });
    
    // Start the SDK
    try {
      sdk.start();
      console.log('OpenTelemetry instrumentation initialized');
    } catch (error) {
      console.error('Error initializing OpenTelemetry:', error);
    }
  }
  
  // Custom performance monitoring
  if (typeof performance !== 'undefined') {
    // Server startup monitoring
    const startTime = performance.now();
    
    process.on('beforeExit', () => {
      const endTime = performance.now();
      const serverLifetime = endTime - startTime;
      
      // Log server performance metrics
      console.log(`Server lifetime: ${serverLifetime}ms`);
      
      // Custom analytics or monitoring can be added here
      if (process.env.NODE_ENV === 'production') {
        // Send metrics to monitoring service
        sendMetrics({
          serverLifetime,
          timestamp: Date.now(),
          environment: process.env.NODE_ENV,
        });
      }
    });
  }
}

function sendMetrics(metrics) {
  // Placeholder for metrics collection
  // In production, integrate with your monitoring service
  console.log('Metrics:', metrics);
}