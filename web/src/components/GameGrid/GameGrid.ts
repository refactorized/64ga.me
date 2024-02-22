import { LitElement, html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { produce } from 'immer'

type Answer = {
  correct: boolean
  a: number
  b: number
  product: number
  prompt: string
}

const initGrid = () => {
  const answers: Answer[] = Array()
  for (let a = 2; a <= 9; a++) {
    for (let b = 2; b <= 9; b++) {
      const product = a * b
      answers[a * 8 + b] = {
        a,
        b,
        product,
        correct: false,
        prompt: `${a} X ${b}`,
      }
    }
  }
  return answers
}

@customElement('game-grid')
export class GameGrid extends LitElement {
  @state()
  private answers: Answer[] = initGrid()

  buildAnswerHandler(index: number) {
    return () => {
      this.answers = produce(this.answers, (answers) => {
        answers[index].correct = !this.answers[index].correct
      })
    }
  }

  render() {
    return html`
      <div class="frame">
        <div class="grid">
          ${this.answers.map((ans, index) => {
            const prompt = html`${ans.a} <span class="times">x</span> ${ans.b}`
            return html` <div
              style=${`--color-fg-pri: hsl(${(360 / 64) * index}deg 100 75);`}
              class="cell"
              data-correct=${ans.correct}
              @click=${this.buildAnswerHandler(index)}
            >
              ${ans.correct ? ans.product : prompt}
            </div>`
          })}
        </div>
      </div>
    `
  }

  static styles = css`
    :host {
      position: absolute;
      left: 0;
      top: 0;s
      width: 100%;
      height: 100%;

      display: flex;
      align-items: center;
      justify-content: center;

      font-size: 3.2vw;
    }
    .frame {
      width: 96vmin;
      height: 96vmin;
      // max-width: 96vmin;
      // max-height: 96vmin;
      position: relative;
    }

    .grid {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      grid-template-rows: repeat(8, 1fr);
    }
    .cell {
      display: flex;
      align-items: center;
      justify-content: center;

      font-family: 'Anton', sans-serif;
      font-weight: 400;
      font-style: normal;

      font-size: 1em;
      text-align: center;
      white-space: nowrap;
      border: var(--color-fg-pri) 2px solid;
      color: var(--color-fg-pri);
      margin: 5px;
      border-radius: 7px;
    }
    .times {
      font-size: 0.618em;
      margin: 0.5em;
    }
    [data-correct='true'] {
      background-color: var(--color-fg-pri);
      color: var(--color-bg-pri);
      font-size: 1.6em;
    }
  `
}
