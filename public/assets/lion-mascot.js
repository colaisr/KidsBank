/* LionMascot — packed RGB/alpha/brand-mask player. No framework or network dependencies. */
(() => {
  'use strict';
  const BASE = '#00C059';
  const W = 512;
  const validHex = value => /^#[0-9a-f]{6}$/i.test(value || '');
  const clamp = (v, a=0, b=1) => Math.min(b, Math.max(a,v));
  function toHSL(hex) {
    const n = parseInt(hex.replace('#',''),16);
    const r=(n>>16)/255, g=((n>>8)&255)/255, b=(n&255)/255;
    const max=Math.max(r,g,b), min=Math.min(r,g,b), d=max-min, l=(max+min)/2;
    let h=0;
    if(d) h=(max===r ? (g-b)/d+(g<b?6:0) : max===g ? (b-r)/d+2 : (r-g)/d+4)/6;
    return [h, d===0?0:d/(1-Math.abs(2*l-1)),l];
  }
  function fromHSL(h,s,l) {
    const c=(1-Math.abs(2*l-1))*s;
    return [0,2/3,1/3].map(k=>(clamp(Math.abs((((h+k)%1+1)%1)*6-3)-1)-.5)*c+l);
  }
  const baseHSL = toHSL(BASE);
  const urls = new Map();
  function mediaURL(src) {
    if (!src.startsWith('data:')) return src;
    if (!urls.has(src)) {
      const comma=src.indexOf(','), raw=atob(src.slice(comma+1));
      const bytes=Uint8Array.from(raw,c=>c.charCodeAt(0));
      urls.set(src,URL.createObjectURL(new Blob([bytes],{type:src.slice(5,src.indexOf(';'))})));
    }
    return urls.get(src);
  }
  const vertex = `
    attribute vec2 aPosition;
    attribute vec2 aUV;
    varying vec2 vUV;
    void main(){vUV=aUV;gl_Position=vec4(aPosition,0.,1.);}
  `;
  const fragment = `
    precision highp float;
    varying vec2 vUV;
    uniform sampler2D uTexture;
    uniform vec3 uTarget;
    uniform vec3 uBase;
    uniform float uOriginal;
    vec3 rgb2hsl(vec3 c){
      float hi=max(c.r,max(c.g,c.b)),lo=min(c.r,min(c.g,c.b));
      float d=hi-lo,l=(hi+lo)*.5,h=0.,s=0.;
      if(d>0.000001){
        s=d/max(1.-abs(2.*l-1.),0.000001);
        if(hi==c.r) h=(c.g-c.b)/d+(c.g<c.b?6.:0.);
        else if(hi==c.g) h=(c.b-c.r)/d+2.;
        else h=(c.r-c.g)/d+4.;
        h/=6.;
      }
      return vec3(h,s,l);
    }
    vec3 hsl2rgb(vec3 c){
      vec3 p=clamp(abs(fract(c.x+vec3(0.,2./3.,1./3.))*6.-3.)-1.,0.,1.);
      return (p-.5)*(1.-abs(2.*c.z-1.))*c.y+c.z;
    }
    void main(){
      // Half-texel addressing keeps the three panes separate at their boundaries.
      vec2 uv=clamp(vUV,vec2(.5/512.),vec2(1.-.5/512.));
      uv.x/=3.;
      vec3 rgb=texture2D(uTexture,uv).rgb;
      float alpha=texture2D(uTexture,uv+vec2(1./3.,0.)).r;
      float mask=texture2D(uTexture,uv+vec2(2./3.,0.)).r;
      // Remove the very small black-level noise introduced by video compression.
      alpha=clamp((alpha-.006)/.988,0.,1.);
      mask=clamp((mask-.025)/.95,0.,1.);
      if(uOriginal<.5 && mask>0.){
        vec3 hsl=rgb2hsl(rgb);
        hsl.x=fract(hsl.x+uTarget.x-uBase.x+1.);
        hsl.y=clamp(hsl.y*uTarget.y,0.,1.);
        hsl.z=hsl.z<=uBase.z
          ? hsl.z*uTarget.z/uBase.z
          : uTarget.z+(hsl.z-uBase.z)*(1.-uTarget.z)/(1.-uBase.z);
        rgb=mix(rgb,hsl2rgb(hsl),mask);
      }
      gl_FragColor=vec4(rgb*alpha,alpha);
    }
  `;
  class GLRenderer {
    constructor(canvas){
      const gl=canvas.getContext('webgl',{alpha:true,premultipliedAlpha:true,antialias:false,preserveDrawingBuffer:true});
      if(!gl) throw new Error('WebGL unavailable');
      this.gl=gl;
      const compile=(type,source)=>{
        const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);
        if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));
        return s;
      };
      const program=gl.createProgram();
      gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));
      gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));
      gl.linkProgram(program);
      if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));
      gl.useProgram(program);this.program=program;
      const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
      gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,0,1, 1,-1,1,1, -1,1,0,0, 1,1,1,0]),gl.STATIC_DRAW);
      const pos=gl.getAttribLocation(program,'aPosition'), uv=gl.getAttribLocation(program,'aUV');
      gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,16,0);
      gl.enableVertexAttribArray(uv);gl.vertexAttribPointer(uv,2,gl.FLOAT,false,16,8);
      gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,gl.createTexture());
      for(const p of [gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T])gl.texParameteri(gl.TEXTURE_2D,p,gl.CLAMP_TO_EDGE);
      for(const p of [gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER])gl.texParameteri(gl.TEXTURE_2D,p,gl.LINEAR);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);
      gl.uniform1i(gl.getUniformLocation(program,'uTexture'),0);
      gl.uniform3fv(gl.getUniformLocation(program,'uBase'),baseHSL);
      this.target=gl.getUniformLocation(program,'uTarget');this.original=gl.getUniformLocation(program,'uOriginal');
      gl.viewport(0,0,W,W);gl.disable(gl.BLEND);
    }
    draw(source,hex){
      const gl=this.gl;if(gl.isContextLost())return;
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,source);
      gl.uniform3fv(this.target,toHSL(hex));gl.uniform1f(this.original,hex.toUpperCase()===BASE?1:0);
      gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
    }
  }
  class CPURenderer {
    constructor(canvas){
      this.ctx=canvas.getContext('2d');this.scratch=document.createElement('canvas');
      this.scratch.width=W*3;this.scratch.height=W;
      this.sctx=this.scratch.getContext('2d',{willReadFrequently:true});
      this.out=this.ctx.createImageData(W,W);
    }
    draw(source,hex){
      this.sctx.drawImage(source,0,0,W*3,W);
      const src=this.sctx.getImageData(0,0,W*3,W).data,out=this.out.data;
      const target=toHSL(hex),original=hex.toUpperCase()===BASE;
      for(let y=0;y<W;y++)for(let x=0;x<W;x++){
        const i=(y*W*3+x)*4,j=(y*W+x)*4;
        const a=clamp((src[i+W*4]/255-.006)/.988);
        const m=clamp((src[i+W*8]/255-.025)/.95);
        out[j+3]=Math.round(a*255);
        let r=src[i]/255,g=src[i+1]/255,b=src[i+2]/255;
        if(!original&&m>0&&a>0){
          const max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min,l=(max+min)/2;
          let h=0,s=0;
          if(d){h=(max===r?(g-b)/d+(g<b?6:0):max===g?(b-r)/d+2:(r-g)/d+4)/6;s=d/(1-Math.abs(2*l-1));}
          const nl=l<=baseHSL[2]?l*target[2]/baseHSL[2]:target[2]+(l-baseHSL[2])*(1-target[2])/(1-baseHSL[2]);
          const c=fromHSL(h+target[0]-baseHSL[0],s*target[1],nl);
          r+=(c[0]-r)*m;g+=(c[1]-g)*m;b+=(c[2]-b)*m;
        }
        out[j]=Math.round(r*255);out[j+1]=Math.round(g*255);out[j+2]=Math.round(b*255);
      }
      this.ctx.putImageData(this.out,0,0);
    }
  }
  class LionMascot extends HTMLElement {
    static get observedAttributes(){return ['color','emotion','size','paused'];}
    constructor(){
      super();this.attachShadow({mode:'open'});
      this.shadowRoot.innerHTML=`<style>:host{display:inline-block;width:var(--mascot-size,176px);aspect-ratio:1;vertical-align:middle;contain:layout style;position:relative}canvas{display:block;width:100%;height:100%;background:transparent}</style><canvas width="512" height="512" aria-hidden="true"></canvas>`;
      this.canvas=this.shadowRoot.querySelector('canvas');
      this.video=document.createElement('video');this.video.muted=true;this.video.defaultMuted=true;
      this.video.playsInline=true;this.video.loop=true;this.video.preload='auto';
      this.video.setAttribute('playsinline','');this.video.setAttribute('webkit-playsinline','');this.video.setAttribute('muted','');
      this.video.setAttribute('aria-hidden','true');this.video.tabIndex=-1;
      this.video.style.cssText='position:absolute;width:1px;height:1px;opacity:0;pointer-events:none';
      this.shadowRoot.append(this.video);
      this._transitionCanvas=null;this._fadingCanvas=null;this._transitionTimer=0;this.poster=null;this.loaded=false;this._wantedPlaying=false;this._token=0;this._connected=false;
      this.ready=Promise.resolve();this._request=0;this._vfc=false;
      this.video.addEventListener('loadeddata',()=>{this.loaded=true;this.render();if(this._wantedPlaying)this.play();});
      this.video.addEventListener('seeked',()=>this.render());
      this.video.addEventListener('ended',()=>this.dispatchEvent(new Event('cycleend')));
      this.video.addEventListener('error',()=>{this.clearTransition();this.loaded=false;this.render();this.dispatchEvent(new Event('mediaerror'));});
      this._visibility=()=>{if(document.hidden){this.video.pause();this.cancelFrame();}else if(this._wantedPlaying)this.play();};
      this.canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();this.cancelFrame();});
      this.canvas.addEventListener('webglcontextrestored',()=>{this.renderer=new GLRenderer(this.canvas);this.render();if(this._wantedPlaying)this.scheduleFrame();});
    }
    connectedCallback(){
      if(this._connected)return;this._connected=true;
      if(!this.renderer){
        try{this.renderer=new GLRenderer(this.canvas);this.backend='webgl';}
        catch(error){
          this.backendReason=error.message;
          // A failed GL initialization may reserve the context; use a fresh canvas for the fallback.
          const next=this.canvas.cloneNode();this.canvas.replaceWith(next);this.canvas=next;
          this.renderer=new CPURenderer(this.canvas);this.backend='canvas2d';
        }
      }
      document.addEventListener('visibilitychange',this._visibility);
      this._wantedPlaying=this.hasAttribute('autoplay')&&!this.hasAttribute('paused');
      this.applySize();this.loadEmotion();
    }
    disconnectedCallback(){this.clearTransition();this.video.pause();this.cancelFrame();this._connected=false;document.removeEventListener('visibilitychange',this._visibility);}
    attributeChangedCallback(name,oldValue,value){
      if(oldValue===value||!this._connected)return;
      if(name==='emotion')this.loadEmotion();
      else if(name==='color')this.render();
      else if(name==='size')this.applySize();
      else if(name==='paused')value===null?this.play():this.pause();
    }
    get color(){const c=this.getAttribute('color');return validHex(c)?c.toUpperCase():BASE;}
    set color(value){if(!validHex(value))throw new TypeError('Color must be #RRGGBB');this.setAttribute('color',value.toUpperCase());}
    get emotion(){const value=this.getAttribute('emotion')||'wink';return window.LION_ASSETS?.[value]?value:'wink';}
    set emotion(value){if(!window.LION_ASSETS?.[value])throw new TypeError('Unknown emotion');this.setAttribute('emotion',value);}
    get isPlaying(){return this._wantedPlaying;}
    get currentTime(){return this.video.currentTime;}
    get duration(){return this.video.duration||3;}
    setColor(value){this.color=value;}
    setEmotion(value){this.emotion=value;}
    applySize(){const size=Number(this.getAttribute('size'));if(size>0)this.style.setProperty('--mascot-size',Math.min(1024,Math.max(24,size))+'px');}
    clearTransition(){clearTimeout(this._transitionTimer);this._transitionCanvas?.remove();this._fadingCanvas?.remove();this._transitionCanvas=null;this._fadingCanvas=null;}
    async loadEmotion(){
      const asset=window.LION_ASSETS?.[this.emotion];if(!asset)return;
      this.clearTransition();
      if(this._painted&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
        // Keep the final rendered pose visible while the next clip loads.
        const hold=document.createElement('canvas');hold.width=this.canvas.width;hold.height=this.canvas.height;
        hold.getContext('2d').drawImage(this.canvas,0,0);
        hold.style.cssText='position:absolute;inset:0;pointer-events:none;opacity:1;transition:opacity 180ms ease-out';
        this.shadowRoot.append(hold);this._transitionCanvas=hold;
      }
      const token=++this._token;this.cancelFrame();this.video.pause();this.loaded=false;
      const image=new Image();image.crossOrigin='anonymous';image.src=mediaURL(asset.poster);
      this.ready=new Promise(resolve=>{
        const ready=()=>{if(token!==this._token){resolve();return;}this.poster=image;this.render();resolve();};
        if(image.complete&&image.naturalWidth)ready();else{image.onload=ready;image.onerror=()=>resolve();}
      });
      if(!asset.video.startsWith('data:')&&!asset.video.startsWith('blob:'))this.video.crossOrigin='anonymous';
      this.video.src=mediaURL(asset.video);this.video.load();
      await this.ready;
    }
    render(){
      if(!this.renderer)return;
      const source=this.loaded&&this.video.readyState>=2?this.video:this.poster;
      if(source){try{this.renderer.draw(source,this.color);
        if(this.loaded&&this._transitionCanvas){
          const hold=this._transitionCanvas;this._transitionCanvas=null;this._fadingCanvas=hold;
          requestAnimationFrame(()=>{hold.style.opacity='0';});
          this._transitionTimer=setTimeout(()=>{hold.remove();if(this._fadingCanvas===hold)this._fadingCanvas=null;},220);
        }
        if(!this._painted){this._painted=true;this.dispatchEvent(new Event('renderready'));}}catch(error){this._painted=false;this.dispatchEvent(new CustomEvent('rendererror',{detail:error.message}));}}
    }
    async play(){
      this._wantedPlaying=true;if(document.hidden||!this.loaded)return;
      try{await this.video.play();this.scheduleFrame();}
      catch(error){this.render();this.dispatchEvent(new CustomEvent('playblocked',{detail:error.name}));}
    }
    pause(){this._wantedPlaying=false;this.video.pause();this.cancelFrame();this.render();}
    cancelFrame(){
      if(!this._request)return;
      if(this._vfc&&this.video.cancelVideoFrameCallback)this.video.cancelVideoFrameCallback(this._request);else cancelAnimationFrame(this._request);
      this._request=0;
    }
    scheduleFrame(){
      this.cancelFrame();if(!this._wantedPlaying||document.hidden)return;
      this._vfc=typeof this.video.requestVideoFrameCallback==='function';
      const cb=()=>{this._request=0;this.render();this.scheduleFrame();};
      this._request=this._vfc?this.video.requestVideoFrameCallback(cb):requestAnimationFrame(cb);
    }
    async seek(seconds){
      if(!Number.isFinite(seconds))throw new TypeError('Invalid time');
      if(this.video.readyState<1)await new Promise(resolve=>this.video.addEventListener('loadedmetadata',resolve,{once:true}));
      const time=clamp(seconds,0,Math.max(0,this.duration-.001));
      if(Math.abs(this.video.currentTime-time)<.001){this.render();return;}
      await new Promise(resolve=>{this.video.addEventListener('seeked',()=>{this.render();resolve();},{once:true});this.video.currentTime=time;});
    }
    async snapshot(){this.render();return new Promise((resolve,reject)=>this.canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('PNG export failed')),'image/png'));}
  }
  window.LionColor={toHSL,fromHSL,base:BASE,validHex};
  window.LionMascot=LionMascot;
  if(!customElements.get('lion-mascot'))customElements.define('lion-mascot',LionMascot);
})();
