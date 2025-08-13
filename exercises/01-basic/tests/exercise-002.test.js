import printCurrentWindow from '../exercise-002.js';

describe('Exercise 2: Print Current Window', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test('should be a function', () => {
    expect(typeof printCurrentWindow).toBe('function');
  });

  test('should log Node.js message when window is not available', () => {
    // In Node.js environment, window is undefined
    printCurrentWindow();

    expect(consoleSpy).toHaveBeenCalledWith(
      'Print function called (browser print() not available in Node.js)'
    );
  });

  test('should call window.print when window is available', () => {
    // Mock browser environment
    const mockPrint = jest.fn();
    global.window = {
      print: mockPrint
    };

    printCurrentWindow();

    expect(mockPrint).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Print dialog opened');

    // Clean up
    delete global.window;
  });

  test('should handle window without print method', () => {
    // Mock window without print method
    global.window = {};

    printCurrentWindow();

    expect(consoleSpy).toHaveBeenCalledWith(
      'Print function called (browser print() not available in Node.js)'
    );

    // Clean up
    delete global.window;
  });
});