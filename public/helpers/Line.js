export class Line {
  constructor(height) {
    this.height = height;
    this.colour = this.colourCalc();
  }

  colourCalc = () => {
    let H = null;
    let S = null;
    let L = null;

    H = this.height / 4;
    S = 75;
    L = 50;

    return [H, S, L];
  };
}
