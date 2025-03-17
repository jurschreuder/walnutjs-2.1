// By Jurriaan Schreuder @ Kexxu

class KexCanvas {

  drawables = new Map(); // key is uuid

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
    this.drawables.set(drawable.uuid, drawable);
  }

  removeAllDrawables(){
    this.drawables.clear();
  }

  getDrawableById(uuid){
    if(!this.drawables.has(uuid)){ return false; };
    return this.drawables.get(uuid);
  }

  hasDrawableWithId(uuid){
    return this.drawables.has(uuid);
  }

  get drawableUuids(){
    return Array.from(this.drawables.keys());
  }

  removeDrawableById(uuid){
    if(!this.drawables.has(uuid)){ return false; };
    const d = this.drawables.get(uuid);
    d.clear();
    this.drawables.delete(uuid);
  }

  render(){
    console.log("kexCanvas render", this);
    this.addResizeObserver(); 
    this.calcParentSize();

    for(const d of this.drawables.values()) {
      console.log("kexCanvas drawing drawable:", d);
      d.render(this.width, this.height);
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
    for(const d of this.drawables.values()) {
      d.clear();
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
