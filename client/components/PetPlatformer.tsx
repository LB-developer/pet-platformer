import { createRef, useEffect, useRef, useState } from 'react'
import getRandomNumber from '../utils/getRandomNumber'
import YouWinPage from './YouWinPage'

interface Platform {
  x: number
  y: number
  width: number
  height: number
  color: string
}

interface BackgroundImage {
  x: number
  y: number
  width: number
  height: number
  image: HTMLImageElement
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
    height: 99,
    width: 60,
  }
  const [player, setPlayer] = useState<Player>(initialPlayerState)
  const [keys, setKeys] = useState({ left: false, right: false, jump: false })
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [isWon, setIsWon] = useState(false)
  const [isReset, setIsReset] = useState(false)

  const [backgroundImage, setBackgroundImage] =
    useState<HTMLImageElement | null>(null)
  const [midgroundImage, setMidgroundImage] = useState<HTMLImageElement | null>(
    null,
  )
  const [foregroundImage, setForegroundImage] =
    useState<HTMLImageElement | null>(null)
  const [uiImage, setUiImage] = useState<HTMLImageElement | null>(null)

  const [images, setImages] = useState<BackgroundImage[]>([])

  const gravity = 0.3
  const friction = 0.7
  const jumpStrength = -10

  // generates platforms
  // defines platforms
  function createPlatforms(count: number): Platform[] {
    return Array.from({ length: count }, (_, index) => ({
      x: index * 380, // original x
      y: getRandomNumber(350, 450),
      width: 190,
      height: 47,
      color: 'blue',
    }))
  }
  // canvas
  // height={700}
  // width={1240}
  function createBackground(images: HTMLImageElement[]): BackgroundImage[] {
    const backgroundArray: BackgroundImage[] = []
    let arrLen = 0
    do {
      for (let i = 0; i < 5; i++) {
        backgroundArray.push({
          x: i * 700,
          y: 0,
          width: 700,
          height: 700,
          image: images[i],
        })
      }

      arrLen++
    } while (arrLen < 5)
    const sortedBackgroundArray = backgroundArray.sort((a, b) => a.x - b.x)
    return sortedBackgroundArray
  }

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const generatedPlatforms = createPlatforms(50) // adding number adds platform offset by it's index
    setPlatforms(generatedPlatforms)

    if (generatedPlatforms.length > 0) {
      setPlayer((prevPlayer) => ({
        ...prevPlayer,
        x: generatedPlatforms[0].x,
        y: generatedPlatforms[0].y - prevPlayer.height,
      }))
    }

    const bg = new Image()
    const mg = new Image()
    const fg = new Image()
    const ui = new Image()

    bg.src = '/sprites/Background/bg_layer1.png'
    mg.src = '/sprites/Background/bg_layer2.png'
    fg.src = '/sprites/Background/bg_layer3.png'
    ui.src = '/sprites/Background/bg_layer4.png'

    bg.onload = () => setBackgroundImage(bg)
    mg.onload = () => setMidgroundImage(mg)
    fg.onload = () => setForegroundImage(fg)
    ui.onload = () => setUiImage(ui)

    // TODO
    // set images state to be an array of all images
    // setImages(Array(5).fill([bg, mg, fg, ui])) -- WORKING STATIC IMAGES
    // setImages(createBackground([bg, mg, fg, ui]))

    // create x number of images
    // effect their offset like platforms

    // setImages(Array(5).from({ length: count }, (_, index) => ({
    //   x: index * 450, // original x
    //   y: getRandomNumber(350, 450),
    //   width: 300,
    //   height: 40,
    //   color: 'blue',
    // })))
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
  }, [player, keys])

  function renderBackground(ctx: CanvasRenderingContext2D) {
    if (backgroundImage) {
      ctx.drawImage(backgroundImage, 0, 0, ctx.canvas.width, ctx.canvas.height) // Draw the background image to cover the whole canvas
    }
  }

  function renderMidground(ctx: CanvasRenderingContext2D, xOffset: number) {
    if (midgroundImage) {
      ctx.drawImage(
        midgroundImage,
        xOffset * 0.5,
        0,
        ctx.canvas.width,
        ctx.canvas.height,
      )
    }
  }

  function renderForeground(ctx: CanvasRenderingContext2D, player: Player) {
    if (foregroundImage) {
      ctx.drawImage(foregroundImage, 0, 0, ctx.canvas.width, ctx.canvas.height) // Static foreground layer
    }
    renderPlayer(ctx, player)
  }

  function renderUI(ctx: CanvasRenderingContext2D) {
    if (uiImage) {
      ctx.drawImage(uiImage, 0, 0, 100, 100) // Example: UI element like a score panel
    }
  }

  function renderCanvas(ctx: CanvasRenderingContext2D, xOffset: number) {
    // Canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    // ctx.fillStyle = '#000'
    // ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // Render each layer in the correct order
    renderBackground(ctx) // Layer 1: Background image
    renderMidground(ctx, xOffset) // Layer 2: Midground image
    renderForeground(ctx, player) // Layer 3: Foreground (including player)
    renderUI(ctx) // Layer 4: UI image

    // ctx.drawImage(foregroundImage, 0, 0, ctx.canvas.width, ctx.canvas.height)
    // [[BackgroundImage, BackgroundImage],[BackgroundImage, BackgroundImage]]
    // (value, index, array)

    // Background Images
    // images.forEach((imageObj: BackgroundImage) => {
    //     ctx.drawImage(
    //       imageObj.image,
    //       imageObj.x - xOffset,
    //       imageObj.y,
    //       imageObj.width,
    //       imageObj.height,
    //     )
    //     imageObj.x -= xOffset
    // })

    // Platforms
    const platformImage = new Image()
    platformImage.src = '/sprites/Environment/ground_grass_broken.png'

    platforms.forEach((platform) => {
      // ctx.fillStyle = platform.color
      // ctx.fillRect(
      //   platform.x - xOffset,
      //   platform.y,
      //   platform.width,
      //   platform.height,
      // )
      ctx.drawImage(
        platformImage,
        platform.x - xOffset,
        platform.y,
        platform.width,
        platform.height,
      )
      platform.x -= xOffset
    })

    setImages(images)
    setPlatforms(platforms)
  }

  const playerImage = new Image()
  playerImage.src = '/sprites/Players/bunny2_walk1.png'

  function renderPlayer(ctx: CanvasRenderingContext2D, player: Player) {
    // ctx.fillStyle = '#F08080'
    // ctx.fillRect(player.x, player.y, player.width, player.height)
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height)
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
        newX_v = -0.3
      }
      if (keys.right) {
        newX_v = 0.1
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
  }, [isReset])

  return (
    <section className="flex items-center overflow-none justify-center p-20 mx-auto canvas-section">
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
