// By Jurriaan Schreuder @ Kexxu

class KexCanvas {

  drawables = [];

  parentId = false;
  _resizeObserver = false;

  width = 0;
  height = 0;
  

  constructor(parentId){
    this.parentId = parentId;
  }

  addDrawable(drawable){
    if(!drawable.isKexSvgDrawable){
      throw new Error("Drawable has to be a KexSvgDrawable");  
    }
    this.drawables.push(drawable);
  }

  removeAllDrawables(){
    this.drawables = [];
  }

  render(){
    this.addResizeObserver(); 
    this.calcParentSize();

    for(let i = 0; i < this.drawables.length; i++){
      this.drawables[i].render(this.width, this.height);
    }
  }

  addResizeObserver(){
    // watch for resize
    if (!this._resizeObserver) {
      this._resizeObserver = new ResizeObserver(() => {
        this.render();
      });
      this._resizeObserver.observe(this.parentElem);
    }
  }

  clear(){
    for(let i = 0; i < this.drawables.length; i++){
      this.drawables[i].clear();
    }
  }

  destroy() {
    if(this._resizeObserver){
      this._resizeObserver.disconnect();
      this._resizeObserver = false;
    }
    this.clear();
  }

  get parentElem(){
    return document.getElementById(this.parentId);
  }

  calcParentSize() {
    let parent = this.parentElem;
    let compStyle = getComputedStyle(parent);
    this.width = parent.clientWidth;
    this.height = parent.clientHeight;
    this.width -=
      parseFloat(compStyle.paddingLeft) + parseFloat(compStyle.paddingRight);
    this.height -=
      parseFloat(compStyle.paddingTop) + parseFloat(compStyle.paddingBottom);
  };
}

export { KexCanvas }
