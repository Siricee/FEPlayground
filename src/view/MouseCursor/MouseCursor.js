export class CMouse {
  id;
  el;
  style = `
    pointer-events: none;
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: #fff;
    mix-blend-mode: exclusion;
    transition: background-color .2s ease;
  `;
  trail;
  constructor(
    DOM = () => {
      throw new Error(
        "argument DOM is container of the pointer,it cannot be a null value."
      );
    },
    id = "g-pointer"
  ) {
    // 创建mouse元素
    this.el = document.createElement("div");
    // 设置元素id
    this.setId(id);
    // 设置样式
    this.setStyle(this.style);
    // 添加到父容器DOM
    this.appendDOM(DOM);
    // 拖尾的操作
    this.trail = this.addTrail();
    DOM.appendChild(this.trail);
    // 本体、拖尾的运动
    this.run(DOM);
    return this.el;
  }
  setStyle(style) {
    this.el.setAttribute("style", style);
  }
  setId(id) {
    this.id = id;
    this.el.setAttribute("id", id);
  }
  setPosition(el, x, y) {
    el.style.transform = `translate(${x - el.offsetWidth / 2}px, ${y -
      el.offsetWidth / 2}px)`;
  }
  addTrail() {
    const elChild = document.createElement("div");
    elChild.setAttribute("id", this.id + "-2");
    elChild.setAttribute(
      "style",
      `
        width: 20px;
        height: 20px;
        border-radius: 50%;
        position:absoulte;
        background-color: rgba(200,200,200,.3);
        transition: .2s ease-out;
        pointer-events: none;
      `
    );
    this.el.appendChild(elChild);
    return elChild;
  }
  appendDOM(DOM) {
    if (!DOM) return;
    DOM.appendChild(this.el);
  }
  run(DOM) {
    if (!DOM) return;
    DOM.addEventListener("mousemove", (e) => {
      window.requestAnimationFrame(() => {
        this.setPosition(this.el, e.clientX, e.clientY);
        if (this.trail) this.setPosition(this.trail, e.clientX, e.clientY);
      });
    });
  }
}
