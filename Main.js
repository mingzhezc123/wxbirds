// 初始化整个游戏的精灵，作为游戏开始的入口
import {ResourceLoader} from "./js/base/ResourceLoader.js";
import {Director} from "./js/Director.js";
import {BackGround} from "./js/runtime/BackGround.js";
import {DataStore} from "./js/base/DataStore.js";
import {Land} from "./js/runtime/Land.js";
import {Birds} from "./js/player/Birds.js";
import {StartButton} from "./js/player/StartButton.js";
import {Score} from "./js/player/Score.js";

export class Main {
  constructor() {
    this.canvas = wx.createCanvas();
    this.ctx = this.canvas.getContext('2d');
    this.dataStore = DataStore.getInstance();
    this.director = Director.getInstance();
    // 创建加载器
    const loader = ResourceLoader.created();
    // 资源加载完成后执行回调
    loader.onLoaded(map => this.onResourceFirstLoaded(map));

  }

  onResourceFirstLoaded(map) {
    this.dataStore.canvas = this.canvas;
    this.dataStore.ctx = this.ctx;
    this.dataStore.res = map;
    this.dataStore.bgm = wx.createInnerAudioContext();
    this.dataStore.bgm.autoplay = true;
    this.dataStore.bgm.loop = true;
    this.dataStore.bgm.src = 'audio/bgm.mp3';
    this.init();
  }

  init(){
    this.director.isGameOver = false;
    this.dataStore
      .put('pencils', [])
      .put('background', BackGround)
      .put('land', Land)
      .put('birds', Birds)
      .put('score',Score)
      .put('startButton',StartButton);
    this.registerEvent();
    // 创建铅笔要在游戏逻辑运行之前
    this.director.createPencils();
    this.director.run();
  }
  registerEvent(){
    // 用箭头函数，this指向Main类
    // this.canvas.addEventListener('touchstart',(e)=>{
    //   // 停止事件传播
    //   e.stopPropagation();
    //   // 判断游戏是否结束
    //   if(this.director.isGameOver){
    //     this.init();// 结束则初始化
    //   }else{
    //     this.director.birdsEvent();// 没结束则执行 birdsEvent让小鸟向上
    //   }
    // });
    wx.onTouchStart(() => {
      // 判断游戏是否结束
      if(this.director.isGameOver){
        this.init();// 结束则初始化
      }else{
        this.director.birdsEvent();// 没结束则执行 birdsEvent让小鸟向上
      }
    });
  }
}