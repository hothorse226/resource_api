/**
 * Created by TiepND2 on 6/24/2017.
 */

import expressServer from './expressServer';
import clusterServer from './cluster';

clusterServer(() => { expressServer(); });

