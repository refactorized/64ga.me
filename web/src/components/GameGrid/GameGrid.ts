import { LitElement, html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { produce } from 'immer'
import { styleMap } from 'lit/directives/style-map.js'

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

  @state()
  private rotatePaletteDeg: number = 0
  private interval?: number

  buildAnswerHandler(index: number) {
    return () => {
      this.answers = produce(this.answers, (answers) => {
        answers[index].correct = !this.answers[index].correct
      })
    }
  }

  connectedCallback() {
    super.connectedCallback()
    this.interval = setInterval(() => {
      // modulus by a high interval of 360 to prevent overflow but allow cool math
      this.rotatePaletteDeg = (this.rotatePaletteDeg + 5) % 360 ** 2
    }, 100)
  }

  disconnectedCallback(): void {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  render() {
    return html`
      <div
        class="frame"
        style=${styleMap({ '--rot-pal-deg': `${this.rotatePaletteDeg}` })}
      >
        <div class="grid">
          ${this.answers.map((ans, index) => {
            const prompt = html`${ans.a} <span class="times">x</span> ${ans.b}`
            return html` <div
              class="cell"
              style=${`--pal-offset-deg: ${(index * 360) / 64}`}
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
      top: 0;
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
      perspective: 300px;
    }
    .cell {
      /* hsl wraps hue, no need to use modulo */
      --cell-hue: calc(var(--rot-pal-deg) + var(--pal-offset-deg));
      --color-fg-pri: hsl(calc(1deg * var(--cell-hue)) 100 80);
      display: flex;
      align-items: center;
      justify-content: center;

      font-family: 'Anton', sans-serif;
      font-weight: 400;
      font-style: normal;

      font-size: 1em;
      text-align: center;
      white-space: nowrap;
      border: var(--color-fg-pri) solid 0px;
      color: var(--color-fg-pri);

      margin: 5px;
      border-radius: 100%;

      transition: background-color 100ms linear, color 100ms linear,
        border-color 100ms linear;
      rotate: 100ms linear;

      position: relative;

      ::before,
      ::after {
        content: ' ';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        border: var(--color-fg-pri) dashed 2px;
        border-radius: 100%;
        opacity: 50%;
      }
      ::before {
        /* prettier-ignore */
        transform:
        rotateX(calc(1deg * var(--cell-hue) * 1))
        rotateY(calc(1deg * var(--cell-hue) * 1.1))
        rotateZ(calc(1deg * var(--cell-hue) * 1.2))
      }

      ::after {
        /* prettier-ignore */
        transform:
        scale(calc(120% + 10% * cos(180deg - 1deg * var(--cell-hue) * 2)))
        rotateX(calc(1deg * var(--cell-hue) * 1.3))
        rotateY(calc(1deg * var(--cell-hue) * 1.4))
        rotateZ(calc(1deg * var(--cell-hue) * 1.5))
      }
    }

    .times {
      font-size: 0.618em;
      margin: 0.5em;
    }

    [data-correct='true'] {
      background-color: var(--color-fg-pri);
      color: var(--color-bg-pri);
      font-size: 1.6em;

      ::before,
      ::after {
        border: none;
      }
    }
  `
}
