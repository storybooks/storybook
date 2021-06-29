import { snapshotWithOptions } from '../test-bodies';
import { Stories2SnapsConverter } from '../Stories2SnapsConverter';
import { StoryshotsOptions } from './StoryshotsOptions';

const ignore = ['**/node_modules/**'];
const defaultStories2SnapsConverter = new Stories2SnapsConverter();

function getIntegrityOptions({ integrityOptions }: StoryshotsOptions) {
  if (integrityOptions === false) {
    return false;
  }

  if (typeof integrityOptions !== 'object') {
    return false;
  }

  const ignoreOption: string[] = Array.isArray(integrityOptions.ignore)
    ? integrityOptions.ignore
    : [];

  return {
    ...integrityOptions,
    ignore: [...ignore, ...ignoreOption],
    absolute: true,
  };
}

function ensureOptionsDefaults(options: StoryshotsOptions) {
  const {
    suite = 'Storyshots',
    asyncJest,
    storyNameRegex,
    storyKindRegex,
    renderer,
    serializer,
    snapshotSerializers,
    stories2snapsConverter = defaultStories2SnapsConverter,
    test: testMethod = snapshotWithOptions({ renderer, serializer }),
  } = options;

  const integrityOptions = getIntegrityOptions(options);

  return {
    asyncJest,
    suite,
    storyNameRegex,
    storyKindRegex,
    stories2snapsConverter,
    testMethod,
    snapshotSerializers,
    integrityOptions,
  };
}

export default ensureOptionsDefaults;
