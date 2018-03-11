// 导演类，控制游戏的逻辑
// 单例模式，如果类已被实例化，再实例化时直接返回实例，
// 如果类没有实例化，则实例化一次
import {DataStore} from "./base/DataStore.js";
import {UpPencil} from "./runtime/UpPencil.js";
import {DownPencil} from "./runtime/DownPencil.js";


export class Director {
  constructor() {
    this.dataStore = DataStore.getInstance();
    this.moveSpeed = 2;
  }

  static getInstance() {
    if (!Director.instance) {
      Director.instance = new Director();
    }
    return Director.instance;
  }

  createPencils() {
    const minTop = DataStore.getInstance().canvas.height / 8;
    const maxTop = DataStore.getInstance().canvas.height / 2;
    const top = minTop + Math.random() * (maxTop - minTop);
    this.dataStore.get('pencils').push(new UpPencil(top));
    this.dataStore.get('pencils').push(new DownPencil(top));
  }

  // 小鸟向上飞
  birdsEvent() {
    for (let i = 0; i <= 2; i++) {
      this.dataStore.get('birds').y[i] =
        this.dataStore.get('birds').birdsY[i];
    }
    // 时间清零，位移就会从 0 开始再计算
    this.dataStore.get('birds').time = 0;
  }

  // 判断小鸟是否撞击铅笔
  static isStrike(bird, pencil) {
    // strike为true表示没撞,false表示撞了
    let strike = false;
    if (bird.top > pencil.bottom ||
      bird.bottom < pencil.top ||
      bird.left > pencil.right ||
      bird.right < pencil.left) {
      strike = true;// 没撞
    }
    // 返回的和实际判断出来的结果相反，因为没撞要返回false，撞了返回true·
    return !strike;
  }

  // 检测小鸟是否撞击地板和铅笔
  check() {
    const birds = this.dataStore.get('birds');
    const land = this.dataStore.get('land');
    const pencils = this.dataStore.get('pencils');
    const score = this.dataStore.get('score');

    // 地板撞击判断
    if (birds.birdsY[0] + birds.birdsHeight[0] >= land.y) {
      console.log('撞击地板了');
      wx.vibrateLong({
        success: function(){
          console.log('长振动完成');
        }
      });
      this.isGameOver = true;
      return;
    }

    // 小鸟的边框模型
    const birdsBorder = {
      top: birds.y[0],
      bottom: birds.birdsY[0] + birds.birdsHeight[0],
      left: birds.birdsX[0],
      right: birds.birdsX[0] + birds.birdsWidth[0]
    };

    // 铅笔的边框模型
    const length = pencils.length;
    for (let i = 0; i < length; i++) {
      const pencil = pencils[i];
      const pencilBorder = {
        top: pencil.y,
        bottom: pencil.y + pencil.height,
        left: pencil.x,
        right: pencil.x + pencil.width
      };

      // 判断每个铅笔是否和小鸟撞击
      if (Director.isStrike(birdsBorder, pencilBorder)) {
        console.log('撞击铅笔了');
        wx.vibrateLong({
          success: function(){
            console.log('长振动完成');
          }
        });
        this.isGameOver = true;
        return;
      }
    }

    // 加分逻辑
    if (birds.birdsX[0] > pencils[0].x + pencils[0].width &&
      score.isScore) {
      wx.vibrateShort({
        success: function(){
          console.log('振动完成');
        }
      });
      score.isScore = false;
      score.scoreNumber++;
    }
  }


  run() {
    // 因为 requestAnimationFrame默认是每秒钟渲染60次，所以每次渲染都要检测是否撞击
    this.check();
    if (!this.isGameOver) {
      this.dataStore.get('background').draw();

      const pencils = this.dataStore.get('pencils');
      if (pencils[0].x + pencils[0].width <= 0 &&
        pencils.length === 4) {
        pencils.shift();
        pencils.shift();
        this.dataStore.get('score').isScore = true;
      }

      if (pencils[0].x <= (DataStore.getInstance().canvas.width - pencils[0].width) / 2 &&
        pencils.length === 2) {
        this.createPencils();
      }

      this.dataStore.get('pencils').forEach(function (value) {
        value.draw();
      });
      // 地板在铅笔之后创建，会在上层遮住地板以下的铅笔
      this.dataStore.get('land').draw();
      this.dataStore.get('score').draw();
      this.dataStore.get('birds').draw();
      let timer = requestAnimationFrame(() => this.run());
      this.dataStore.put('timer', timer);
    } else {
      console.log('游戏结束');
      // this.destroyBackgroundMusic();
      this.dataStore.get('startButton').draw();
      cancelAnimationFrame(this.dataStore.get('timer'));
      this.dataStore.destroy();
      // 加快出发微信垃圾回收
      wx.triggerGC();
    }
  }
}