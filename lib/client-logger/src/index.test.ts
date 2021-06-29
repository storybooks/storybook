import { logger } from '.';

jest.mock('@storybook/global-root', () => ({ ...global, LOGLEVEL: 'debug' }));

describe('client-logger default LOGLEVEL', () => {
  const initialConsole = { ...global.console };
  beforeEach(() => {
    global.console.trace = jest.fn();
    global.console.debug = jest.fn();
    global.console.log = jest.fn();
    global.console.info = jest.fn();
    global.console.warn = jest.fn();
    global.console.error = jest.fn();
  });
  afterAll(() => {
    global.console = initialConsole;
  });
  it('should have an debug method that displays the message in red, with a trace', () => {
    const message = 'debug message';
    logger.debug(message);
    expect(global.console.debug).toHaveBeenCalledWith(message);
  });
  it('should have an log method that displays the message in red, with a trace', () => {
    const message = 'log message';
    logger.log(message);
    expect(global.console.log).toHaveBeenCalledWith(message);
  });
  it('should have an info method that displays the message', () => {
    const message = 'information';
    logger.info(message);
    expect(global.console.info).toHaveBeenCalledWith(message);
  });
  it('should have a warning method that displays the message in yellow, with a trace', () => {
    const message = 'warning message';
    logger.warn(message);
    expect(global.console.warn).toHaveBeenCalledWith(message);
  });
  it('should have an error method that displays the message in red, with a trace', () => {
    const message = 'error message';
    logger.error(message);
    expect(global.console.error).toHaveBeenCalledWith(message);
  });
});
