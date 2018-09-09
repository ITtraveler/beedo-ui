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

export default comjs;
