import { isDocumentVisible, isOnline } from "./windowStatus";

const listeners: any[] = [];

function subscribe(listener: () => void) {
  listeners.push(listener);

  return function unsubscribe() {
    const index = listeners.indexOf(listener);
    listeners.splice(index, 1);
  };
}
// 防止多次绑定事件
let eventsBinded = false;

if (typeof window !== "undefined" && window.addEventListener && !eventsBinded) {
  const revalidate = () => {
    if (!isDocumentVisible() || !isOnline()) return;

    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }
  };

  window.addEventListener("visibilitychange", revalidate, false);
  window.addEventListener("focus", revalidate, false);

  eventsBinded = true;
}

export default subscribe;
