import { useEffect, useRef, useState } from 'react'
import getRandomNumber from '../utils/getRandomNumber'
import YouWinPage from './YouWinPage'

interface Platform {
  x: number
  y: number
  width: number
  height: number
  color: string
}

interface Player {
  x: number
  y: number
  x_v: number
  y_v: number
  jump: boolean
  height: number
  width: number
}

function SpamJump() {
  const initialPlayerState: Player = {
    x: 0,
    y: 0,
    x_v: 0,
    y_v: 0,
    jump: false,
    height: 60,
    width: 60,
  }
  const [player, setPlayer] = useState<Player>(initialPlayerState)
  const [keys, setKeys] = useState({ left: false, right: false, jump: false })
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [isWon, setIsWon] = useState(false)
  const [isReset, setIsReset] = useState(false)
  


  const gravity = 0.3
  const friction = 1.0
  const jumpStrength = -10

  // generates platforms
  // defines platforms
  function createPlatforms(count: number): Platform[] {
    return Array.from({ length: count }, (_, index) => ({
      x: index * 450, // original x
      y: getRandomNumber(350, 450),
      width: 300,
      height: 40,
      color: 'blue',
    }))
  }

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const generatedPlatforms = createPlatforms(10) // adding number adds platform offset by it's index
    setPlatforms(generatedPlatforms)

    if (generatedPlatforms.length > 0) {
      setPlayer((prevPlayer) => ({
        ...prevPlayer,
        x: generatedPlatforms[0].x,
        y: generatedPlatforms[0].y - prevPlayer.height,
      }))
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const context = canvas.getContext('2d')
      if (context) {
        const interval = setInterval(() => {
          updatePlayer()
          renderCanvas(context, player.x) // render canvas and platforms
          renderPlayer(context, player)
        }, 1000 / 60)

        return () => clearInterval(interval)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player, keys])

  function renderCanvas(ctx: CanvasRenderingContext2D, xOffset: number) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.fillStyle = '#F0F8FF'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    platforms.forEach((platform) => {
      ctx.fillStyle = platform.color
      ctx.fillRect(
        platform.x - xOffset,
        platform.y,
        platform.width,
        platform.height,
      )
      platform.x -= xOffset
    })

    setPlatforms(platforms)
  }

  function renderPlayer(ctx: CanvasRenderingContext2D, player: Player) {
    ctx.fillStyle = '#F08080'
    ctx.fillRect(player.x, player.y, player.width, player.height)
  }

  function updatePlayer() {
    setPlayer((prevPlayer) => {
      let newX = prevPlayer.x
      let newY = prevPlayer.y
      let newX_v = prevPlayer.x_v
      let newY_v = prevPlayer.y_v
      let newJump = prevPlayer.jump

      if (!newJump) {
        newX_v *= friction
      } else {
        newY_v += gravity
      }

      if (keys.left) {
        newX_v = -0.1
      }
      if (keys.right) {
        newX_v = 0.075
      }
      if (keys.jump && !newJump) {
        newY_v = jumpStrength
        newJump = true
      }

      newX += newX_v
      newY += newY_v

      if (newY > 700) {
        // when they go out of bounds (lose)
        return { ...initialPlayerState }
      } else if (newX + prevPlayer.width > 1240) {
        // win point
        setIsWon(true)
      }

      let onPlatform = false
      platforms.forEach((platform) => {
        if (
          platform.x < newX + prevPlayer.width &&
          newX < platform.x + platform.width &&
          prevPlayer.y + prevPlayer.height <= platform.y &&
          newY + prevPlayer.height >= platform.y
        ) {
          onPlatform = true
          newY = platform.y - prevPlayer.height
          newY_v = 0
        }
      })

      newJump = !onPlatform

      return {
        ...prevPlayer,
        x: newX,
        y: newY,
        x_v: newX_v,
        y_v: newY_v,
        jump: newJump,
      }
    })
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLCanvasElement>) {
    if (e.key === 'ArrowLeft') {
      setKeys((prev) => ({ ...prev, left: true }))
    }
    if (e.key === 'ArrowRight') {
      setKeys((prev) => ({ ...prev, right: true }))
    }
    if (e.key === 'ArrowUp') {
      setKeys((prev) => ({ ...prev, jump: true }))
    }
  }

  function handleKeyUp(e: React.KeyboardEvent<HTMLCanvasElement>) {
    if (e.key === 'ArrowLeft') {
      setKeys((prev) => ({ ...prev, left: false }))
    }
    if (e.key === 'ArrowRight') {
      setKeys((prev) => ({ ...prev, right: false }))
    }
    if (e.key === 'ArrowUp') {
      setKeys((prev) => ({ ...prev, jump: false }))
    }
  }

  useEffect(() => {
    if (isReset) {
      setIsReset(false) // Reset the flag after starting a new game
      setIsWon(false) // Reset the win state
      setPlayer(initialPlayerState) // Reset player state
      setPlatforms(createPlatforms(5)) // Reset platforms
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReset])

  return (
    <section className="flex items-center overflow-none justify-center p-20">
      {isWon ? (
        <YouWinPage
          isReset={isReset}
          setIsReset={setIsReset}
          canvasRef={canvasRef}
        />
      ) : (
        <canvas
          ref={canvasRef}
          height={700}
          width={1240} // 1200
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
        ></canvas>
      )}
    </section>
  )
}

export default SpamJump
