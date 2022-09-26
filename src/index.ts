import { writeFileSync } from "fs";
import chalk from "chalk";

interface Result {
  prisonerNumber: number;
  success: boolean;
  trial: number[];
  trialCount: number;
}

class HundredPrisonersProblem {
  size: number;
  readonly room: number[];
  waiting: number[];
  success: number[];

  constructor(size: number = 100) {
    if (size < 1) {
      throw new Error("인원이 너무 적습니다.");
    }

    this.size = size;
    this.room = [];
    this.waiting = [];
    this.success = [];

    for (let i = 0; i < size; i++) {
      this.room.push(i);
      this.waiting.push(i);
    }
    this.room.sort(() => Math.random() - 0.5);
  }

  enter(prisoner: number): Result {
    if (!this.waiting.includes(prisoner)) {
      throw new Error("선택한 죄수가 이미 진행했거나 없습니다.");
    }

    const trial = [];
    let last = prisoner;
    while (trial.length < this.size / 2) {
      const number = this.room[last];
      last = number;
      trial.push(number);
      if (prisoner === number) {
        this.success.push(prisoner);
        break;
      }
    }
    return {
      prisonerNumber: prisoner,
      success: trial.length < this.size / 2,
      trial,
      trialCount: trial.length,
    };
  }
  solve() {
    const trials: Result[] = [];
    while (this.waiting.length > 0) {
      trials.push(this.enter(this.waiting[0]));
      this.waiting.shift();
    }
    return trials;
  }
}

const count = 10000;
let successCount = 0;

for (let i = 0; i < count; i++) {
  console.log(`${i + 1}번째 시도`);
  const hundredPrisonersProblem = new HundredPrisonersProblem();
  const trials = hundredPrisonersProblem.solve();
  const success = trials.filter((trial) => trial.success === false).length === 0;
  writeFileSync("result.json", JSON.stringify(trials, null, 2));
  const result = `결과: ${chalk.bold(success ? chalk.green("성공") : chalk.red("실패"))}
  성공한 죄수: ${trials.filter((trial) => trial.success === true).length}명
  `;
  console.log(result);
  if (success) successCount++;
}
console.log(`성공률:`, chalk.yellow(`${(successCount / count) * 100}%`));
