import { exec } from 'child_process';
import path from 'path';
import program from 'commander';
import detectFreePort from 'detect-port';
import dedent from 'ts-dedent';
import fs from 'fs';
import yaml from 'js-yaml';
import nodeCleanup from 'node-cleanup';

import startVerdaccioServer from 'verdaccio';
// @ts-ignore
import { maxConcurrentTasks } from './utils/concurrency';

program
  .option('-O, --open', 'keep process open')
  .option('-P, --publish', 'should publish packages')
  .option('-p, --port <port>', 'port to run https server on');

program.parse(process.argv);

const logger = console;

const freePort = (port?: number) => port || detectFreePort(port);

const startVerdaccio = (port: number) => {
  let resolved = false;
  return Promise.race([
    new Promise((resolve) => {
      const cache = path.join(__dirname, '..', '.verdaccio-cache');
      if (program.publish) {
        fs.rmdirSync(cache, { recursive: true });
      }
      const config = {
        ...(yaml.safeLoad(
          fs.readFileSync(path.join(__dirname, 'verdaccio.yaml'), 'utf8')
        ) as Record<string, any>),
        self_path: cache,
      };

      const onReady = (webServer: any) => {
        webServer.listen(port, () => {
          resolved = true;
          resolve(webServer);
        });
      };

      startVerdaccioServer(config, 6000, cache, '1.0.0', 'verdaccio', onReady);
    }),
    new Promise((_, rej) => {
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          rej(new Error(`TIMEOUT - verdaccio didn't start within 10s`));
        }
      }, 10000);
    }),
  ]);
};
const registryUrl = (command: string, url?: string) =>
  new Promise<string>((res, rej) => {
    const args = url ? ['config', 'set', 'registry', url] : ['config', 'get', 'registry'];
    exec(`${command} ${args.join(' ')}`, { cwd: path.join(process.cwd(), '..') }, (e, stdout) => {
      if (e) {
        rej(e);
      } else {
        res(url || stdout.toString().trim());
      }
    });
  });

const registriesUrl = (yarnUrl?: string, npmUrl?: string) =>
  Promise.all([registryUrl('/usr/local/bin/yarn', yarnUrl), registryUrl('npm', npmUrl || yarnUrl)]);

const applyRegistriesUrl = (
  yarnUrl: string,
  npmUrl: string,
  originalYarnUrl: string,
  originalNpmUrl: string
) => {
  logger.log(`↪️  changing system config`);
  nodeCleanup((_exitCode, signal) => {
    registriesUrl(originalYarnUrl, originalNpmUrl)
      .then(() => {
        logger.log(dedent`
            Your registry config has been restored from:
            npm: ${npmUrl} to ${originalNpmUrl} 
            yarn: ${yarnUrl} to ${originalYarnUrl} 
          `);
      })
      .then(() => process.kill(process.pid, signal));

    nodeCleanup.uninstall();
    return false;
  });

  return registriesUrl(yarnUrl, npmUrl);
};

const publish = (verdaccioUrl: string) => {
  logger.log(`🛫 Publishing packages with a concurrency of ${maxConcurrentTasks}`);

  return new Promise((res) => {
    const publishCommand = `YARN_NPM_AUTH_IDENT="user:password" YARN_NPM_REGISTRY_SERVER="${verdaccioUrl}" yarn workspaces foreach --parallel --jobs ${maxConcurrentTasks} --no-private npm publish --access restricted`;

    exec(publishCommand, (e) => {
      if (e) {
        res(e);
      } else {
        logger.log(`🛬 All packages have been published`);

        res(undefined);
      }
    });
  });
};

const addUser = (url: string) =>
  new Promise((res, rej) => {
    logger.log(`👤 Add temp user to verdaccio: user/password`);

    exec(`npx npm-cli-adduser -r "${url}" -a -u user -p password -e user@example.com`, (e) => {
      if (e) {
        rej(e);
      } else {
        res();
      }
    });
  });

const run = async () => {
  const port = await freePort(program.port);
  logger.log(`🌏 found a open port: ${port}`);

  const verdaccioUrl = `http://localhost:${port}`;

  logger.log(`🔖 reading current registry settings`);
  let [originalYarnRegistryUrl, originalNpmRegistryUrl] = await registriesUrl();
  if (
    originalYarnRegistryUrl.includes('localhost') ||
    originalNpmRegistryUrl.includes('localhost')
  ) {
    originalYarnRegistryUrl = 'https://registry.npmjs.org/';
    originalNpmRegistryUrl = 'https://registry.npmjs.org/';
  }

  logger.log(`📐 reading version of storybook`);
  logger.log(`🚛 listing storybook packages`);
  logger.log(`🎬 starting verdaccio (this takes ±5 seconds, so be patient)`);

  const verdaccioServer: any = await startVerdaccio(port);

  logger.log(`🌿 verdaccio running on ${verdaccioUrl}`);

  await applyRegistriesUrl(
    verdaccioUrl,
    verdaccioUrl,
    originalYarnRegistryUrl,
    originalNpmRegistryUrl
  );

  await addUser(verdaccioUrl);

  if (program.publish) {
    await publish(verdaccioUrl);
  }

  if (!program.open) {
    verdaccioServer.close();
  }
};

run().catch((e) => {
  logger.error(e);
  process.exit(1);
});
