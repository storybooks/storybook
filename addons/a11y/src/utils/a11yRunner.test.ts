import addons from '@storybook/addons';
import { EVENTS } from '../constants';

jest.mock('@storybook/addons');
const mockedAddons = addons as jest.Mocked<typeof addons>;

describe('a11yRunner', () => {
  let mockChannel: { on: jest.Mock; emit?: jest.Mock };

  beforeEach(() => {
    mockedAddons.getChannel.mockReset();

    mockChannel = { on: jest.fn(), emit: jest.fn() };
    mockedAddons.getChannel.mockReturnValue(mockChannel as any);
  });

  it('should listen to events', () => {
    // eslint-disable-next-line global-require
    require('./a11yRunner');

    expect(mockedAddons.getChannel).toHaveBeenCalled();
    expect(mockChannel.on).toHaveBeenCalledWith(EVENTS.REQUEST, expect.any(Function));
    expect(mockChannel.on).toHaveBeenCalledWith(EVENTS.MANUAL, expect.any(Function));
  });
});
