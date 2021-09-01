/**
 * 一个构造函数，可以生产无数个实例
 * 单例模式就是让一个构造函数，只能生产一个实例
 * 不管我们尝试去创建多少次，它都只给你返回第一次所创建的那唯一的一个实例。
*/

class SingleDog {
  show() {
    console.log('我是一个单例');
  }

  static getInstance() {
    if (!SingleDog.instance) {
      SingleDog.instance = new SingleDog();
    }
    return SingleDog.instance;
  }
}

const s1 = SingleDog.getInstance();
const s2 = SingleDog.getInstance();

s1 === s2 // true

/**
 * 或者使用闭包的方式实现
*/

SingleDog.getInstance = (function(){
  let instance = null;
  return function() {
    if (!instance) {
      instance = new SingleDog();
    }
    return instance;
  }
})()

/* 
Vuex的唯一store就是单例模式的实践
*/

export function install (_Vue) {
  // 判断传入的Vue实例对象是否已经被install过Vuex插件（是否有了唯一的state）
  if (Vue && _Vue === Vue) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      )
    }
    return
  }
  // 若没有，则为这个Vue实例对象install一个唯一的Vuex
  Vue = _Vue
  // 将Vuex的初始化逻辑写进Vue的钩子函数里
  applyMixin(Vue)
}


/* 
  以下为面试题
*/

/* 
  实现Storage，使得该对象为单例，基于 localStorage 进行封装。实现方法 setItem(key,value) 和 getItem(key)。
*/

class Storage {
  setItem(key, value) {
    localStorage.setItem(key, value)
  }

  getItem(key) {
    return localStorage.getItem(key);
  }
}

Storage.getInstance = (function() {
  let instance = null;
  return function() {
    if (!instance) {
      instance = new Storage();
    }
    return instance;
  }
})();


/* 
  实现全局唯一的弹窗

  这里只写JS实现
*/

class Modal {
  static getInstance() {
    if (!Modal.instance) {
      Modal.instance = new Modal();
    }
    return Modal.instance;
  }

  constructor() {
    const div = document.createElement('div');
    div.id = 'modal';
    div.innerHTML = '我是唯一弹窗';
    div.style.display = 'none';
    document.body.appendChild(div);
    this = div;
  }

  show() {
    this.style.display = 'block';
  }

  hide() {
    this.style.display = 'none';
  }
}







