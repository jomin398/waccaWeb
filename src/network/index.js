const networkModule = (() => {
  function network() {
    this.status = 0
  };
  network.prototype.init = async (callback) => {
    if (callback) callback(true);
  };
  network.prototype.request = (obj) => {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open(obj.method || "GET", obj.url);
      if (obj.headers) {
        Object.keys(obj.headers).forEach(key => {
          xhr.setRequestHeader(key, obj.headers[key]);
        });
      }
      if (obj.resTyp) {
        xhr.responseType = obj.resTyp;
      }
      xhr.onload = () => {
        if (xhr.response) {
          resolve(xhr.response);
        } else {
          reject(xhr.statusText);
        }
      };
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send(obj.body);
    });
  };
  return network;
})();