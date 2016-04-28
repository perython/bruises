export default {
  rootUrl: process.env.NODE_ENV === 'production' ? '/bruises/' : '/',
  /*jshint maxcomplexity: 6 */
  sortedObject: (obj) => {
    obj = obj || {};
    let keys = [];
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        keys.push(key);
      }
    }
    keys.sort();
    let newObj = {};
    for (let index in keys) {
      if (keys.hasOwnProperty(index)) {
        let key = keys[index];
        newObj[key] = obj[key];
      }
    }
    return newObj;
  },
  /*jshint maxcomplexity: 5 */

  getQueryParams: (qs) => {
    qs = qs.split('+').join(' ');

    let params = {}, tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    tokens = re.exec(qs);
    while (tokens) {
      params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
      tokens = re.exec(qs);
    }

    return params;
  }
};
