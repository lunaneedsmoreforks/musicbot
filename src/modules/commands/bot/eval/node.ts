


let old: { [key: string]: any } = {};
let new_: { [key: string]: any } = {};

export function runInNodeEnv(jsCodeblock: string, locals: { [key: string]: any }) {
  for (let key in new_) {
    // @ts-ignore
    old[key] = global[key];
    // @ts-ignore
    delete global[key];
    // @ts-ignore
    global[key] = new_[key];
  }
  for (let key in locals) {
    // @ts-ignore
    if (global[key]) {
      // @ts-ignore
      old[key] = global[key];
    }
    // @ts-ignore
    global[key] = locals[key];
  }
  try {
    eval(jsCodeblock);
  } catch (error) {
    console.error(error);
  }
  for (let key in locals) {
    // @ts-ignore
    delete global[key];
  }
  for (let key in old) {
    // @ts-ignore
    delete global[key];
    // @ts-ignore
    global[key] = old[key];
  }
  
}