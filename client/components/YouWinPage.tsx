import { useEffect } from 'react'
import Button from './Button'
import getRandomNumber from '../utils/getRandomNumber'
import Confetti from 'react-confetti'

interface Props {
  isReset: boolean
  setIsReset: React.Dispatch<React.SetStateAction<boolean>>
  canvasRef: React.RefObject<HTMLCanvasElement>
}

export default function YouWinPage({ isReset, setIsReset, canvasRef }: Props) {
  function resetGame() {
    setIsReset(true)
  }

  const randomNum = getRandomNumber(0, 22)

  const spamImages = [
    '1-bacon-2',
    '1-bacon',
    '2-cheese',
    '3-hickory-2',
    '3-hickory',
    '4-cheese-2',
    '4-lite-2',
    '4-lite',
    '5-black-pepper',
    '6-hot-n-spicy-2',
    '6-hot-n-spicy',
    '7-turkey-2',
    '7-turkey',
    '8-jalapeno-2',
    '8-jalapeno',
    '9-chorizo',
    '10-teriyaki',
    '11-sodium',
    '12-garlic',
    '13-port-sausage',
    '14-classic2',
    '15-tocino',
    '16-maple',
  ]

  function drawSpam(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    color: string,
  ) {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    ctx.lineTo(x + width, y + height - radius)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    ctx.lineTo(x + radius, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
    ctx.fill()
  }

  const colors = ['#facc15', '#1e3a8a', '#f87171']

  return (
    <>
      <section className="flex flex-col items-center justify-center">
        <Confetti
          className="flex flex-col items-center justify-center"
          drawShape={(ctx) => {
            const x = -10 // Adjust these values to center the shape
            const y = -10 // Adjust these values to center the shape
            const width = 20
            const height = 20
            const radius = 5
            const color = colors[Math.floor(Math.random() * colors.length)]
            drawSpam(ctx, x, y, width, height, radius, color)
          }}
        />
        <h1 className="pb-2 font-heading text-heading-lg font-heading-bold text-spamBlue">
          Congratulations!
        </h1>
        <p className="pb-5 font-body">
          You've won a lifetime supply* of this spam:
        </p>
        <img src={`./images/${spamImages[randomNum]}.png`} />
        <Button>
          <button onClick={resetGame}>Play again</button>
        </Button>
        <p className="font-body text-body-xsm">
          Disclaimer: supply varies depending on stock levels. Currently we have
          zero stocks.
        </p>
      </section>
    </>
  )
}

