// 拿单例模式那个全局弹窗举个例子

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

document.getElementById('open').addEventListener('click', () => {
  const modal = new Modal();
  modal.show();
})

// 现在需要在打开弹窗的时候，修改按钮的文案

class Decorator {
  constructor(modal) {
    this.newModal = modal;
  }

  click() {
    this.newModal.show();
    this.changeText();
  }

  changeText() {
    this.newModal.innerHTML = 'new text';
  }
}

document.getElementById('open').addEventListener('click', () => {
  const modal = new Modal();
  const decorator = new Decorator(modal);

  decorator.click();
})

// ES7，新增了装饰器语法

function classDeractor(target) {
  target.hasDeractor = true;
  return target;
}

@classDeractor
class Button {
  // Button类相关逻辑
}