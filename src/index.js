import('./pgdb/pgdb.config.js');
import('./session/session.config.js');
import('./aws-sdk/aws.config.js');
import('./gpt/gpt.config.js');
import('./action/action.config.js');

import http from 'node:http';
import env  from '../config/env-initiator.js';
import app  from './http/index.js';
import ws   from './ws/ws.server.js';

const server = http.createServer(app);

ws.startServer(server);
server.listen(env.portfolio_port, () => console.log(`    -    Portfolio http server listening on port ${env.portfolio_port} on ${env.mode} mode`));
// server.listen(5173, () => console.log(`Portfolio server listening on port ${5173} on ${env.mode} mode.`));