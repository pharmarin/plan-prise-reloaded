const getDiff = (a: any, b: any) => {
  const diff = Array.isArray(a) ? [] : {};
  recursiveDiff(a, b, diff);
  return diff;
};

function recursiveDiff(a: any, b: any, node: any) {
  for (var prop in a) {
    if (typeof b[prop] == 'undefined') {
      addNode(prop, '[[removed]]', node);
    } else if (JSON.stringify(a[prop]) !== JSON.stringify(b[prop])) {
      // if value
      if (typeof b[prop] != 'object' || b[prop] == null) {
        addNode(prop, b[prop], node);
      } else {
        // if array
        if (Array.isArray(b[prop])) {
          addNode(prop, [], node);
          recursiveDiff(a[prop], b[prop], node[prop]);
        }
        // if object
        else {
          addNode(prop, {}, node);
          recursiveDiff(a[prop], b[prop], node[prop]);
        }
      }
    }
  }
}

function addNode(prop: string, value: any, parent: any) {
  parent[prop] = value;
}

export default getDiff;
