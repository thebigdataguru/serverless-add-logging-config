'use strict';

class ServerlessAddLoggingConfig {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.hooks = {
      'before:package:finalize': async () => { 
        await this.addLoggingConfig();
      },
    };
  }

  async addLoggingConfig() {
    const template = this.serverless.service.provider.compiledCloudFormationTemplate;

    Object.keys(template.Resources).forEach((key) => {
      const resource = template.Resources[key];
      if (resource.Type === 'AWS::Lambda::Function') {
        resource.Properties.LoggingConfig = {
          LogFormat: "JSON",
          ApplicationLogLevel: "ERROR",
          SystemLogLevel: "WARN"
        };
      }
    });
  }
}

module.exports = ServerlessAddLoggingConfig;
