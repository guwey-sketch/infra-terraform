const fs = require('fs');
const path = require('path');

class TerraformParser {
  constructor(configPath) {
    this.configPath = configPath;
  }

  parse() {
    try {
      const data = fs.readFileSync(this.configPath, 'utf8');
      const config = JSON.parse(data);
      return config;
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error(`File not found: ${this.configPath}`);
      } else if (error instanceof SyntaxError) {
        throw new Error(`Invalid JSON: ${error.message}`);
      } else {
        throw error;
      }
    }
  }

  validateConfig(config) {
    if (!config || typeof config !== 'object') {
      throw new Error('Invalid config: expected an object');
    }
    if (!config.resources || !Array.isArray(config.resources)) {
      throw new Error('Invalid config: resources must be an array');
    }
    config.resources.forEach((resource, index) => {
      if (!resource || typeof resource !== 'object') {
        throw new Error(`Invalid resource at index ${index}: expected an object`);
      }
      if (!resource.type || typeof resource.type !== 'string') {
        throw new Error(`Invalid resource at index ${index}: type must be a string`);
      }
      if (!resource.name || typeof resource.name !== 'string') {
        throw new Error(`Invalid resource at index ${index}: name must be a string`);
      }
    });
  }

  parseResources(config) {
    const resources = config.resources;
    return resources.map((resource) => {
      return {
        type: resource.type,
        name: resource.name,
        properties: resource.properties || {},
      };
    });
  }
}

module.exports = TerraformParser;