// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _instance: any = null;

export function getMemberstack() {
  if (typeof window === "undefined") return null;
  if (!_instance) {
    // Lazy require keeps @memberstack/dom out of SSR bundles entirely
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const memberstackDOM = require("@memberstack/dom").default;
    _instance = memberstackDOM.init({
      publicKey: process.env.NEXT_PUBLIC_MEMBERSTACK_KEY!,
    });
  }
  return _instance;
}
