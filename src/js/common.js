const comjs = {}

comjs.cloneObj = function cloneObj(obj) {
  if (typeof obj != 'object') {
    return obj;
  }
  var newobj = {};
  for (var attr in obj) {
    newobj[attr] = cloneObj(obj[attr]);
  }
  return newobj;
}

comjs.formatDate = function (date) {
  return moment(date).format('YYYY-MM-DD HH-mm-ss')
}

// Generate four random hex digits.
function S4() {
  return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

// Generate a pseudo-GUID by concatenating random hexadecimal.
comjs.uuid = function guid() {
  return (S4()+S4()+S4()+S4()+S4()+S4()+S4()+S4());
}
export default comjs;
