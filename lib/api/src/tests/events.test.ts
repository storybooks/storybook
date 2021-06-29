import { getEventMetadata } from '../lib/events';
import { API } from '../index';

jest.mock('@storybook/global-root', () => ({
  location: { origin: 'http://localhost:6006', pathname: '/' },
}));

describe('getEventMetadata', () => {
  const fullAPIMock = { findRef: jest.fn(), getRefs: jest.fn() };
  const fullAPI = (fullAPIMock as unknown) as API;

  it('returns local if the event source is the same current location', () => {
    expect(
      getEventMetadata({ type: 'event', source: 'http://localhost:6006' }, fullAPI)
    ).toMatchObject({
      sourceType: 'local',
    });
  });

  it('returns external if the refId is set', () => {
    fullAPIMock.getRefs.mockReset().mockReturnValue({
      ref: { id: 'ref' },
    });

    expect(
      getEventMetadata(
        { type: 'event', source: 'http://localhost:6006/foo/bar', refId: 'ref' },
        fullAPI
      )
    ).toMatchObject({
      sourceType: 'external',
      ref: { id: 'ref' },
    });
  });

  it('returns external if the source is set to something other and ref is unset (SB5)', () => {
    fullAPIMock.findRef.mockReset().mockReturnValue({ id: 'ref' });

    expect(
      getEventMetadata({ type: 'event', source: 'http://storybook.host' }, fullAPI)
    ).toMatchObject({
      sourceType: 'external',
      ref: { id: 'ref' },
    });
  });
});
