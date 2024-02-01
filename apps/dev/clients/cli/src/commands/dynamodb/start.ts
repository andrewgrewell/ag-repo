import { startDynamodbLocal, stopDynamodbLocal } from '@ag-oss/dynamodb';
import { Spinner } from '@ag-oss/console-ui';
import { verboseLogger as log } from '@ag-oss/logging';
import { handleProcessExit } from '@ag-oss/child-process';
import Signale from 'signale';

export const command = 'start';
export const desc = 'Start Dynamodb in Docker';
export const builder = {
  detached: {
    alias: 'd',
  },
  port: {
    alias: 'p',
    default: 8000,
  },
};

export interface Args {
  detached?: boolean;
  port?: number;
}

export const handler = async (args: Args) => {
  const { detached, port } = args;
  const spinner = new Spinner();
  try {
    const running = startDynamodbLocal({ detached, port, silent: true });
    !detached
      ? spinner.start(`DynamoDB Local started on port ${port}. Press Ctrl+C to stop`)
      : Signale.start('Starting DynamoDB Local');
    handleProcessExit(() => {
      spinner.stop();
      void stopDynamodbLocal();
    });
    await running;
  } catch (e) {
    log.verbose(e);
  }
};
