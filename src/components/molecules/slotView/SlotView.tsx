import type React from "react"
import { useEffect, useState, useRef } from "react"
import { ClipGaming } from "assets/png"
import { viewGenerator } from "utils/generators/viewGenerator"
import { type EBonuses, ESlotActions } from "utils/types/slotActions"
import styles from "./slotView.module.scss"

interface ISlotView {
  action?: ESlotActions
  selectedBonus?: EBonuses
  freeSpins?: number
  setFreeSpins?: React.Dispatch<React.SetStateAction<number>>
  setTotalWin?: React.Dispatch<React.SetStateAction<number>>
}

interface WildPosition {
  column: number
  row: number
  x: number
  y: number
}

const REEL_LENGTH = 20

export const SlotView: React.FC<ISlotView> = ({ action, selectedBonus, freeSpins, setFreeSpins, setTotalWin }) => {
  const [isSpinning, setIsSpinning] = useState<boolean>(false)
  const [spinningColumns, setSpinningColumns] = useState<boolean[]>([false, false, false, false, false])
  const [reels, setReels] = useState<string[][]>([])
  const [finalResult, setFinalResult] = useState<string[][]>([])
  const reelsRef = useRef<HTMLDivElement[]>([])
  const spinTimeoutsRef = useRef<any[]>([])
  const [wilds, setWilds] = useState<{ [key: string]: boolean }>({})
  const [wildPositions, setWildPositions] = useState<WildPosition[]>([])
  const gameContainerRef = useRef<HTMLDivElement>(null)

  // Add state for tracking free spins
  const freeSpinTimeoutRef = useRef<any>(null)

  // Initialize reels with the initial data
  useEffect(() => {
    const initialData = viewGenerator(4, 5)

    const initialReels = Array(5)
      .fill(0)
      .map((_, colIndex) => {
        const reel:any  = []
        for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
          reel.push(initialData[rowIndex][colIndex])
        }

        return reel
      })

    setReels(initialReels)
  }, [])

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      spinTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
      if (freeSpinTimeoutRef.current) {
        clearTimeout(freeSpinTimeoutRef.current)
      }
    }
  }, [])

  // Trigger next free spin when current spin completes
  useEffect(() => {
    if (freeSpins && freeSpins > 0 && !isSpinning) {
      freeSpinTimeoutRef.current = setTimeout(() => {
        handleSpin()
        setFreeSpins!((prev) => prev - 1)
      }, 1000) // 1 second delay between spins
    }
  }, [freeSpins, isSpinning])

  // Function to handle spin logic
  const handleSpin = () => {
    if (isSpinning) return

    spinTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
    spinTimeoutsRef.current = []

    const generatedData = viewGenerator(4, 5)

    setIsSpinning(true)
    setSpinningColumns([true, true, true, true, true])

    const newReels = Array(5)
      .fill(0)
      .map((_, colIndex) => {
        const reel = []
        for (let i = 0; i < REEL_LENGTH - 4; i++) {
          const randomResultIndex = Math.floor(Math.random() * 4)
          reel.push(generatedData[randomResultIndex][colIndex])
        }
        for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
          reel.push(generatedData[rowIndex][colIndex])
        }

        return reel
      })

    setFinalResult(newReels.map((column) => column.slice(0, 4)))
    setReels(newReels)

    for (let i = 0; i < 5; i++) {
      if (reelsRef.current[i]) {
        // Reset the element
        reelsRef.current[i].style.transition = "none"
        reelsRef.current[i].style.transform = `translateY(-${(REEL_LENGTH - 4) * 200}px)`
    
        void reelsRef.current[i].offsetHeight
    
        // Create a unique animation name with timestamp to ensure it's always fresh
        const timestamp = Date.now()
        const animationName = `spinReel${i}_${timestamp}`
        const duration = 2 + i * 0.2
        
        // Create a new style element each time (removing old ones if they exist)
        const oldStyle = document.getElementById(`reel-style-${i}`)
        if (oldStyle) {
          oldStyle.remove()
        }
        
        const styleEl = document.createElement('style')
        styleEl.id = `reel-style-${i}`
        document.head.appendChild(styleEl)
        
        // Define keyframes with overshoot
        styleEl.innerHTML = `
          @keyframes ${animationName} {
            0% {
              transform: translateY(-${(REEL_LENGTH - 4) * 200}px);
            }
            90% {
              transform: translateY(20px); /* Overshoot by 10px */
            }
            100% {
              transform: translateY(0); /* Return to final position */
            }
          }
        `
        
        // Apply the animation
        reelsRef.current[i].style.animation = `${animationName} ${duration}s cubic-bezier(0.1, 0.3, 0.3, 1)`
        reelsRef.current[i].style.animationFillMode = 'forwards'
      }
    }

    const newTimeouts: any[] = []

    for (let i = 0; i < 5; i++) {
      const reelStopTime = (2 + i * 0.2 + 0.1) * 1000

      const columnTimeout = setTimeout(() => {
        setSpinningColumns((prev) => {
          const updated = [...prev]
          updated[i] = false

          return updated
        })

        if (i === 4) {
          setTimeout(() => {
            setIsSpinning(false)
            updateTotalWin()
            if(selectedBonus){
              captureWildPositions()
            }
          }, 100)
        }
      }, reelStopTime)

      newTimeouts.push(columnTimeout)
    }

    spinTimeoutsRef.current = newTimeouts
  }

  // Function to update total win after spin finishes
  const updateTotalWin = () => {
    if (setTotalWin) {
      setTotalWin((prevTotalWin) => {
        if (!prevTotalWin) return 24
        const newTotalWin = prevTotalWin + prevTotalWin * 1.1

        return Math.floor(newTotalWin)
      })
    }
  }

  useEffect(() => {
    if (action === ESlotActions.PLAY && !isSpinning) {
      handleSpin()
    }
  }, [action, isSpinning])

  const setReelRef = (index: number) => (el: HTMLDivElement) => {
    reelsRef.current[index] = el
  }

  // Capture the positions of wild symbols
  const captureWildPositions = () => {
    if (!finalResult.length || !gameContainerRef.current) return

    const gameRect = gameContainerRef.current.getBoundingClientRect()
    const newWildPositions: WildPosition[] = [...wildPositions] // Keep existing wilds
    const newWilds = { ...wilds } // Keep existing wilds

    // Position correction offsets (adjust these values as needed)
    const offsetX = -15 // Correct the rightward shift
    const offsetY = -20 // Correct the downward shift

    for (let column = 0; column < finalResult.length; column++) {
      for (let row = 0; row < 4; row++) {
        // Always check first 4 rows
        if (finalResult[column]?.[row] === "/static/media/wild.4d06ca8c9b6b5c911465.png") {
          const key = `${column}-${row}`

          // Only add if this wild is not already tracked
          if (!newWilds[key]) {
            newWilds[key] = true

            // Find the element position
            const slotItemElement = document.querySelector(
              `.${styles.reelColumn}:nth-child(${column + 1}) .${styles.slotItem}:nth-child(${row + 1})`,
            )

            if (slotItemElement) {
              const rect = slotItemElement.getBoundingClientRect()

              // Store the exact position with offset corrections
              newWildPositions.push({
                column,
                row,
                x: rect.left - gameRect.left + offsetX,
                y: rect.top - gameRect.top + offsetY,
              })

              console.log(`Added wild at column ${column}, row ${row}, position: `, {
                x: rect.left - gameRect.left + offsetX,
                y: rect.top - gameRect.top + offsetY,
              })
            }
          }
        }
      }
    }

    setWilds(newWilds)
    setWildPositions(newWildPositions)
  }

  // Add this function to help with debugging
  // const resetAllWilds = () => {
  //   setWildPositions([])
  //   setWilds({})
  //   console.log("All wilds have been reset")
  // }

  useEffect(() => {
    if (finalResult.length && !isSpinning && selectedBonus) {
      setTimeout(captureWildPositions, 500)
    }
  }, [finalResult, isSpinning])

  useEffect(() => {
    console.log("Current wild positions:", wildPositions)
    console.log("Current wilds state:", wilds)
  }, [wildPositions, wilds])

  return (
    <div className={styles.slotView} style={selectedBonus ? { justifyContent: "center", height: "auto" } : {}}>
      <div className={styles.slotView_container}>
        <div className={styles.slotView_container_slot}>
          <img src={ClipGaming || "/placeholder.svg"} alt="clipGaming" />
          <div className={styles.slotView_container_slot_game} ref={gameContainerRef}>
            <div className={styles.game}>
              <div className={styles.reelsContainer}>
                {Array(5)
                  .fill(0)
                  .map((_, colIndex) => (
                    <div
                      key={colIndex}
                      className={`${styles.reelColumn} ${spinningColumns[colIndex] ? styles.spinning : ""}`}
                    >
                      <div className={styles.reel} ref={setReelRef(colIndex)}>
                        {reels[colIndex]?.map((symbol, symbolIndex) => (
                          <div key={`reel-${symbolIndex}`} className={styles.slotItem}>
                            <img
                              src={symbol || "/placeholder.svg"}
                              alt=""
                              loading="eager"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = "none"
                                target.parentElement!.style.backgroundColor = "#333"
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Static wild symbols that stay in place */}
              {wildPositions.map((wild, index) => (
                <div
                  key={`static-wild-${index}`}
                  className={styles.staticWild}
                  style={{
                    position: "absolute",
                    left: `${wild.x}px`,
                    top: `${wild.y}px`,
                    width: "180px",
                    height: "180px",
                    zIndex: 100, 
                    pointerEvents: "none",
                  }}
                >
                  <img
                    src="/static/media/wild.4d06ca8c9b6b5c911465.png"
                    alt="Wild"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

