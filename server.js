import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const port = Number(process.env.PORT) || 3000;
const rootDirectory = path.dirname(fileURLToPath(import.meta.url));
const distributionDirectory = path.join(rootDirectory, 'dist');

app.disable('x-powered-by');
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'connect-src': ["'self'", 'https:', 'wss:'],
      'frame-src': ['https://app.powerbi.com'],
      'font-src': ["'self'", 'data:'],
      'img-src': ["'self'", 'data:'],
      'script-src': ["'self'"],
      'style-src': ["'self'", "'unsafe-inline'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));
app.use(compression());

app.get('/health', (_request, response) => response.json({ status: 'ok' }));
app.use(express.static(distributionDirectory, {
  dotfiles: 'deny',
  index: false,
  maxAge: '1h',
  setHeaders(response, filePath) {
    if (filePath.endsWith('.html')) response.setHeader('Cache-Control', 'no-cache');
  },
}));
app.get('*path', (_request, response) => {
  response.sendFile(path.join(distributionDirectory, 'index.html'), (error) => {
    if (error && !response.headersSent) response.status(404).send('Aplicação não encontrada.');
  });
});

app.listen(port, '0.0.0.0', () => {
  console.info(`Portal disponível na porta ${port}.`);
});
