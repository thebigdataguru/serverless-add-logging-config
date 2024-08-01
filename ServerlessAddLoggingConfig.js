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

    const logFormat = service.custom && service.custom.loggingConfig && service.custom.loggingConfig.logFormat ? service.custom.loggingConfig.logFormat : 'JSON'
    const applicationLogLevel = service.custom && service.custom.loggingConfig && service.custom.loggingConfig.applicationLogLevel ? service.custom.loggingConfig.applicationLogLevel : 'ERROR'
    const systemLogLevel = service.custom && service.custom.loggingConfig && service.custom.loggingConfig.systemLogLevel ? service.custom.loggingConfig.systemLogLevel : 'WARN'

    Object.keys(template.Resources).forEach((key) => {
      const resource = template.Resources[key];
      if (resource.Type === 'AWS::Lambda::Function') {
        resource.Properties.LoggingConfig = {
          LogFormat: logFormat,
          ApplicationLogLevel: applicationLogLevel,
          SystemLogLevel: systemLogLevel
        };
      }
    });
  }
}

module.exports = ServerlessAddLoggingConfig;
