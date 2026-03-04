import { SeizeApi } from './services/seize/seize.api';
import { Http } from './services/http';
import { ConsoleLogListener, LoggerFactory } from './logging/logging-emitter';

new SeizeApi(
  new Http(new LoggerFactory(new ConsoleLogListener())),
  'https://api.6529.io/api',
).getDataForBlock({ path: '/consolidated_uploads', blockId: 24580372 });
