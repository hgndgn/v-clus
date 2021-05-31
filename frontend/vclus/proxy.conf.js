// For development

const HOST = 'localhost';
const PORT = 8000;

const PROXY_CONFIG = [
  {
    context: ['/api'],
    target: `http://${HOST}:${PORT}`,
    secure: false,
    logLevel: 'debug',
    pathRewrite: {
      '^/api': '',
    },
  },
];

module.exports = PROXY_CONFIG;
