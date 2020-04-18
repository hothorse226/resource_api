import cluster from 'cluster';
import { cpus } from 'os';

const cpuCount = cpus().length;

export default async function clusterServer(fn) {
    if (cluster.isMaster) {
    // Count the machine's CPUs
    // Create a worker for each CPU
        for (let i = 0; i < cpuCount; i += 1) {
            cluster.fork();
        }
    // Code to run if we're in a worker process
    } else {
        fn();
    }

    return true;
}
