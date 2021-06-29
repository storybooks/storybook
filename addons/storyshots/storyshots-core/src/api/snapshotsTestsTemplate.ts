/* eslint-disable jest/valid-title */
/* eslint-disable jest/no-export */
/* eslint-disable jest/expect-expect */
import root from '@storybook/global-root';
import { addSerializer } from 'jest-specific-snapshot';

const { describe, it } = root;

function snapshotTest({ item, asyncJest, framework, testMethod, testMethodParams }: any) {
  const { name } = item;
  const context = { ...item, framework };

  if (asyncJest === true) {
    it(
      name,
      () =>
        new Promise<void>((resolve, reject) =>
          testMethod({
            done: (error: any) => (error ? reject(error) : resolve()),
            story: item,
            context,
            ...testMethodParams,
          })
        ),
      testMethod.timeout
    );
  } else {
    it(
      name,
      () =>
        testMethod({
          story: item,
          context,
          ...testMethodParams,
        }),
      testMethod.timeout
    );
  }
}

function snapshotTestSuite({ item, suite, ...restParams }: any) {
  const { kind, children } = item;
  describe(suite, () => {
    describe(kind, () => {
      children.forEach((c: any) => {
        snapshotTest({ item: c, ...restParams });
      });
    });
  });
}

function snapshotsTests({ data, snapshotSerializers, ...restParams }: any) {
  if (snapshotSerializers) {
    snapshotSerializers.forEach((serializer: any) => {
      addSerializer(serializer);
      expect.addSnapshotSerializer(serializer);
    });
  }

  data.forEach((item: any) => {
    snapshotTestSuite({ item, ...restParams });
  });
}

export default snapshotsTests;
