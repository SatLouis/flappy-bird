function createEle(ele, classArr, styleObj) {
  let newEle = document.createElement(ele);

  classArr.forEach(item => {
    newEle.classList.add(item);
  });
  for (let prop in styleObj) {
    newEle.style[prop] = styleObj[prop];
  }
  return newEle;
};


function setLocal(key, value) {
  if (typeof value === 'object' && value !== null) {
    value = JSON.stringify(value);
  }
  localStorage.setItem(key, value);
};

function getLocal(key) {
  let value = localStorage.getItem(key);
  if (value === null) { return null };
  if (value[0] === '[' || value[0] === ']') {
    return JSON.parse(value);
  }
  return value
};