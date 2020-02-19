import { Line } from "./helpers/Line";
import { getRandomNumber } from "./helpers/helpers";

// colours in HSL format
const COMPARE_COLOUR = [196, 100, 50];
const SWAP_COLOUR = [246, 100, 50];

export class AnimateLines {
  constructor(canvas) {
    this.canvas = canvas;
    this.lineArray = [];
    this.lineArrayCopy = [];
    this.linesToAnimate = [];
    this.actionQueue = [];
    this.swaps = 0;
    this.comparisons = 0;
    this.speed = 50;
    this.numberOfLines = 50;
    this.playing = false;
  }

  createLines = numberOfLines => {
    this.lineArray = [];
    for (let i = 0; i < numberOfLines; i++) {
      const line = new Line(Math.floor(getRandomNumber(5, 512)));
      this.lineArray.push(line);
      this.lineArrayCopy.push(line);
      this.linesToAnimate.push(line);
    }
  };

  drawLines = array => {
    const ctx = this.canvas.getContext("2d");

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const lineWidth = this.canvas.width / array.length;
    let x = 0;

    for (let i = 0; i < array.length; i++) {
      const H = array[i].colour[0];
      const S = array[i].colour[1];
      const L = array[i].colour[2];
      ctx.fillStyle = `hsl(${H}, ${S}%, ${L}%)`;
      ctx.fillRect(x, 0, lineWidth, array[i].height);
      x += lineWidth;
    }
  };

  changeSpeed = speed => {
    this.speed = speed;
  };

  setNumberOfLines = numberOfLines => {
    this.numberOfLines = numberOfLines;
  };

  startAnimation = () => {
    this.playing = true;
    this.time = window.setInterval(() => this.step(), this.speed);
  };

  cancelAnimation = () => {
    this.playing = false;
    window.clearInterval(this.time);
  };

  nextStep = () => {
    this.playing = false;
    this.step();
  };

  step = () => {
    if (this.actionQueue.length === 0) {
      this.drawLines(this.linesToAnimate);
      return;
    }

    const comparisonsNumber = document.getElementById("comparisons-number");
    const swapsNumber = document.getElementById("swaps-number");

    // Breaking down the actionQueue
    // structure = [string, int, int] e.g: ['compare', 0, 1]
    const action = this.actionQueue.shift();
    const i = action[1];
    const j = action[2];
    const comparisons = action[3];
    const swaps = action[4];

    const iCurrentColour = this.linesToAnimate[i].colour;
    const jCurrentColour = this.linesToAnimate[j].colour;

    if (action[0] === "compare") {
      // Visualise compare colour
      this.linesToAnimate[i].colour = COMPARE_COLOUR;
      this.linesToAnimate[j].colour = COMPARE_COLOUR;
      comparisonsNumber.innerText = comparisons;
    } else if (action[0] === "swap") {
      // Visualise swap colour
      this.linesToAnimate[i].colour = SWAP_COLOUR;
      this.linesToAnimate[j].colour = SWAP_COLOUR;

      // Visualise the swap
      let temp = this.linesToAnimate[i];
      this.linesToAnimate[i] = this.linesToAnimate[j];
      this.linesToAnimate[j] = temp;
      swapsNumber.innerText = swaps;
    }
    this.drawLines(this.linesToAnimate);

    // Need to reset the colours so the lines hold their original colours
    if (action[0] === "compare") {
      this.linesToAnimate[i].colour = iCurrentColour;
      this.linesToAnimate[j].colour = jCurrentColour;
    }

    if (action[0] === "swap") {
      this.linesToAnimate[i].colour = jCurrentColour;
      this.linesToAnimate[j].colour = iCurrentColour;
    }
  };

  swap = (array, a, b) => {
    this.swaps++;
    this.actionQueue.push(["swap", a, b, this.comparisons, this.swaps]);
    let temp = array[a];
    array[a] = array[b];
    array[b] = temp;
  };

  compare = (i, j) => {
    this.actionQueue.push(["compare", i, j, this.comparisons, this.swaps]);
    this.comparisons++;
    return this.lineArray[i].height - this.lineArray[j].height;
  };

  // Bubble Sort
  bubbleSort = array => {
    this.playing = true;
    this.swaps = 0;
    this.comparisons = 0;
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array.length - i - 1; j++) {
        // If j > j + 1 compare will return a positive number
        // which will make the below if statement true
        if (this.compare(j, j + 1) > 0) {
          this.swap(array, j, j + 1);
        }
      }
    }
  };

  // Selection Sort
  selectionSort = array => {
    this.playing = true;
    this.swaps = 0;
    this.comparisons = 0;
    let n = array.length;
    for (let i = 0; i < n - 1; i++) {
      let min = i;
      for (let j = i; j < n; j++) {
        if (this.compare(j, min) < 0) {
          min = j;
        }
      }
      this.swap(array, i, min);
    }
  };

  // Insertion Sort
  insertionSort = array => {
    this.playing = true;
    this.swaps = 0;
    this.comparisons = 0;
    for (let i = 1; i < array.length + 1; i++) {
      let j;
      for (j = i - 1; j > 0 && this.compare(j, j - 1) < 0; j--) {
        this.swap(array, j - 1, j);
      }
    }
  };

  // Quicksort
  quickSortHelper = (array, start, end) => {
    this.playing = true;
    this.swaps = 0;
    this.comparisons = 0;
    this.quickSort(array, start, end);
  };

  quickSort = (array, start, end) => {
    if (start >= end) {
      return array;
    }
    let index = this.partition(array, start, end);
    this.quickSort(array, start, index - 1);
    this.quickSort(array, index + 1, end);
    return array;
  };

  partition = (array, start, end) => {
    let index = start;
    for (let i = start; i < end; i++) {
      if (this.compare(i, end) < 0) {
        this.swap(array, i, index);
        index++;
      }
    }
    this.swap(array, index, end);
    return index;
  };

  // Merge Sort - think this could be more efficient, but couldn't get it to animate
  mergeSortHelper = (array, left, right) => {
    this.playing = true;
    this.comparisons = 0;
    this.swaps = 0;
    this.mergeSort(array, left, right);
  };

  mergeSort = (array, left, right) => {
    if (left >= right) {
      return array;
    }

    const middle = Math.floor((left + right) / 2);

    this.mergeSort(array, left, middle);
    this.mergeSort(array, middle + 1, right);

    let nextLeft = left;
    let nextRight = middle + 1;
    let perm = [];

    for (let i = left; i <= right; i++) {
      let choice;
      if (nextLeft <= middle && nextRight <= right) {
        if (this.compare(nextLeft, nextRight) < 0) {
          choice = "left";
        } else {
          choice = "right";
        }
      } else if (nextLeft > middle) {
        choice = "right";
      } else if (nextRight > right) {
        choice = "left";
      }
      if (choice === "left") {
        perm.push(nextLeft - left);
        nextLeft++;
      } else if (choice === "right") {
        perm.push(nextRight - left);
        nextRight++;
      }
    }

    let swaps = this.permToSwaps(perm);

    for (let i = 0; i < swaps.length; i++) {
      let firstSwap = swaps[i][0] + left;
      let secondSwap = swaps[i][1] + left;
      this.swap(array, firstSwap, secondSwap);
    }
  };

  permToSwaps = perm => {
    let used = [];
    for (let i = 0; i < perm.length; i++) used.push(false);
    let transpositions = [];

    for (let i = 0; i < perm.length; i++) {
      if (used[i]) continue;
      let cur = i;
      if (perm[i] == i) used[i] = true;
      while (!used[perm[cur]]) {
        transpositions.push([cur, perm[cur]]);
        used[cur] = true;
        cur = perm[cur];
      }
    }
    return transpositions;
  };

  // Heap Sort
  heapSort = (array, left, right) => {
    this.playing = true;
    this.swaps = 0;
    this.comparisons = 0;
    let n = right - left + 1;
    let start = Math.floor(n / 2) - 1 + left;

    while (start >= left) {
      this.siftDown(array, start, right, left);
      start--;
    }

    // Pop off the elements and rebuild the heap after each
    let end = right;
    while (end > left) {
      this.swap(array, end, left);
      end--;
      this.siftDown(array, left, end, left);
    }
  };

  siftDown = (array, start, end, left) => {
    let root = start;
    while (true) {
      let leftChild = 2 * (root - left) + 1 + left;
      let rightChild = 2 * (root - left) + 2 + left;
      if (leftChild > end) break;

      let swap = root;
      if (this.compare(swap, leftChild) < 0) {
        swap = leftChild;
      }
      if (rightChild <= end && this.compare(swap, rightChild) < 0) {
        swap = rightChild;
      }
      if (swap === root) {
        return;
      }
      this.swap(array, root, swap);
      root = swap;
    }
  };

  reset = () => {
    this.cancelAnimation();
    this.lineArray = [...this.lineArrayCopy];
    this.linesToAnimate = [...this.lineArrayCopy];
    this.actionQueue = [];
    this.playing = false;
    this.drawLines(this.lineArray);
  };

  initialise = () => {
    this.lineArray = [];
    this.lineArrayCopy = [];
    this.linesToAnimate = [];
    this.actionQueue = [];
    this.createLines(this.numberOfLines);
    this.drawLines(this.lineArray);
  };
}
