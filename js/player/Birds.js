// 小鸟类
// 循环渲染三只小鸟
// 其实是循环渲染图片的三部分
import {Sprite} from "../base/Sprite.js";
import {DataStore} from "../base/DataStore.js";

export class Birds extends Sprite {
  constructor() {
    const image = Sprite.getImage('birds');
    super(image, 0, 0, image.width, image.height,
      0, 0, image.width, image.height);

    // 小鸟的三种状态用数组去存
    // 小鸟的宽度34， 高度是24，上下边距是10， 左右边距是9
    // 把不需要外界访问的变量声明成const
    this.clippingX = [9,
      9 + 34 + 18,
      9 + 34 + 18 + 34 + 18];
    this.clippingY = [10, 10, 10];
    this.clippingWidth = [34, 34, 34];
    this.clippingHeight = [24, 24, 24];
    // 小鸟出现在屏幕中水平方向位置
    const birdX = DataStore.getInstance().canvas.width / 4;
    this.birdsX = [birdX, birdX, birdX];
    // 小鸟出现在屏幕中竖直方向位置
    const birdY = DataStore.getInstance().canvas.height / 2;
    this.birdsY = [birdY, birdY, birdY];
    const birdWidth = 34;
    this.birdsWidth = [birdWidth, birdWidth, birdWidth];
    const birdHeight = 24;
    this.birdsHeight = [birdHeight, birdHeight, birdHeight];

    this.y = [birdY, birdY, birdY];
    this.index = 0;
    this.count = 0;
    this.time = 0;
  }

  draw() {
    // 切换小鸟的速度
    const speed = 0.2;
    this.count += speed;
    // 0，1，2
    if (this.index >= 2) {
      this.count = 0;
    }
    // 减速器的作用
    this.index = Math.floor(this.count);

    // 模拟重力加速度,0.98太大了缩小2.5倍
    const g = 0.98 / 2.5;
    // 每次下落前有向上的一点位移,单位是像素
    const offsetUp = 30;
    // 小鸟的位移，物理公式1/2gt方，time减是想在下落前有一个向上挣扎的效果
    const offsetY = (g * this.time * (this.time - offsetUp)) / 2;
    // 让每一个状态的小鸟都有Y方向位移，实现下落
    for (let i = 0; i <= 2; i++) {
      this.birdsY[i] = this.y[i] + offsetY;
    }
    this.time++;

    super.draw(this.img,
      this.clippingX[this.index], this.clippingY[this.index],
      this.clippingWidth[this.index], this.clippingHeight[this.index],
      this.birdsX[this.index], this.birdsY[this.index],
      this.birdsWidth[this.index], this.birdsHeight[this.index]
    );
  }
}