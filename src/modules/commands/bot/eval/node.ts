import vm from 'vm';

let intervals: NodeJS.Timeout[] = [];
let timeouts: NodeJS.Timeout[] = [];

let patchedSetInterval = (callback: (...args: any[]) => void, ms: number, ...args: any[]) => {
  const interval = setInterval(callback, ms, ...args);
  intervals.push(interval);
  return interval;
};
let patchedSetTimeout = (callback: (...args: any[]) => void, ms: number, ...args: any[]) => {
  const timeout = setTimeout(callback, ms, ...args);
  timeouts.push(timeout);
  return timeout;
};


export async function runInNodeEnv(jsCodeblock: string, locals: { [key: string]: any }, outputCallback?: (add: string) => void) {
  const sandbox = { 
    ...locals, 
    console: new Proxy(console, {
      get: (target, prop: string, receiver) => {
        if (["log", "error", "info"].includes(prop)) {
          return function () { Array.from(arguments).forEach(arg => outputCallback?.(arg.toString())); }
        }
        return Reflect.get(target, prop, receiver);
      },
      set: (target, prop: string, value, receiver) => { return true; }
    }),
    setTimeout: patchedSetTimeout,
    setInterval: patchedSetInterval,
    clearTimeout: clearTimeout,
    clearInterval: clearInterval,
    clearAll: () => {
      intervals.forEach(clearInterval);
      timeouts.forEach(clearTimeout);
      eval("console").log("Cleared all intervals and timeouts")
    },
    outerRequire: require,

   };
  const script = new vm.Script(`(async () => { ${jsCodeblock} })()`);
  const context = vm.createContext(sandbox);
  try {
    return await script.runInContext(context);
  } catch (error) {
    return error;
  }
}

 