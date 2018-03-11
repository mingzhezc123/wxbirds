// 计分器类
import {DataStore} from "../base/DataStore.js";


export class Score {
  constructor() {
    this.ctx = DataStore.getInstance().ctx;
    this.scoreNumber = 0;
    this.isScore = true;
  }

  draw() {
    this.ctx.font = '36px Arial';
    this.ctx.fillStyle = '#fff';
    this.ctx.fillText(
      this.scoreNumber+'',
      DataStore.getInstance().canvas.width / 2 - 12,// -12是为了让字更居中点
      DataStore.getInstance().canvas.height / 18,
      1000
    )
  }
}