module.exports = function override(config, env) {
  // Remove the GenerateSW plugin which is causing the error
  config.plugins = config.plugins.filter(
    plugin => !plugin.constructor || plugin.constructor.name !== 'GenerateSWPlugin'
  );
  
  return config;
}
