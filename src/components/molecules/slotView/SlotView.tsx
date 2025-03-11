import type React from "react"
import { useEffect, useState, useRef } from "react"
import { ClipGaming } from "assets/png"
import { viewGenerator } from "utils/generators/viewGenerator"
import { ESlotActions } from "utils/types/slotActions"
import styles from "./slotView.module.scss"

interface ISlotView {
  action: ESlotActions
}

const REEL_LENGTH = 20

export const SlotView: React.FC<ISlotView> = ({ action }) => {
  const [slotData, setSlotData] = useState<string[][]>(viewGenerator(4, 5))
  const [reels, setReels] = useState<string[][]>([])
  const [isSpinning, setIsSpinning] = useState<boolean>(false)
  const [spinningColumns, setSpinningColumns] = useState<boolean[]>([false, false, false, false, false])
  const spinTimeoutsRef = useRef<any[]>([])
  const reelsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const initialReels = Array(5)
      .fill(0)
      .map(() => {
        const reel = []
        for (let i = 0; i < REEL_LENGTH; i++) {
          const randomIndex = Math.floor(Math.random() * 12) 
          reel.push(`item-${randomIndex}`) 
        }
        return reel
      })
    setReels(initialReels)
  }, [])

  useEffect(() => {
    return () => {
      spinTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
    }
  }, [])

  useEffect(() => {
    if (action === ESlotActions.PLAY && !isSpinning) {
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
            const randomIndex = Math.floor(Math.random() * 12)
            reel.push(`item-${randomIndex}`)
          }

          for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
            reel.push(generatedData[rowIndex][colIndex])
          }

          return reel
        })

      setReels(newReels)

      const newTimeouts: any[] = []

      for (let i = 0; i < 5; i++) {
        if (reelsRef.current[i]) {
          reelsRef.current[i].style.transition = "none"
          reelsRef.current[i].style.transform = "translateY(0)"

          void reelsRef.current[i].offsetHeight

          reelsRef.current[i].style.transition = `transform ${2 + i * 0.2}s cubic-bezier(0.1, 0.3, 0.3, 1)`
          reelsRef.current[i].style.transform = `translateY(calc(-100% + 4 * 180px + 80px))`
        }

        const timeout = setTimeout(
          () => {
            setSpinningColumns((prev) => {
              const updated = [...prev]
              updated[i] = false
              return updated
            })

            setSlotData((prev) => {
              const updated = [...prev]
              for (let row = 0; row < 4; row++) {
                updated[row] = [...prev[row]]
                updated[row][i] = newReels[i][newReels[i].length - 4 + row]
              }
              return updated
            })

            if (i === 4) {
              setTimeout(() => {
                setIsSpinning(false)
              }, 300)
            }
          },
          500 + i * 300,
        )

        newTimeouts.push(timeout)
      }

      spinTimeoutsRef.current = newTimeouts
    }
  }, [action, isSpinning])

  const setReelRef = (index: number) => (el: HTMLDivElement) => {
    reelsRef.current[index] = el
  }

  return (
    <div className={styles.slotView}>
      <div className={styles.slotView_container}>
        <div className={styles.slotView_container_slot}>
          <img src={ClipGaming || "/placeholder.svg"} alt="clipGaming" />
          <div className={styles.slotView_container_slot_game}>
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
                        {!spinningColumns[colIndex] &&
                          slotData.map((row, rowIndex) => (
                            <div key={`static-${rowIndex}`} className={styles.slotItem}>
                              <img src={row[colIndex] || "/placeholder.svg"} alt="game" />
                            </div>
                          ))}

                        {spinningColumns[colIndex] &&
                          reels[colIndex]?.map((symbol, symbolIndex) => (
                            <div key={`reel-${symbolIndex}`} className={styles.slotItem}>
                              {symbolIndex >= REEL_LENGTH - 4 ? (
                                <img src={symbol || "/placeholder.svg"} alt="game" />
                              ) : (
                                <img
                                  src={
                                    symbol.startsWith("item-")
                                      ? reels[colIndex][REEL_LENGTH - 4 + (symbolIndex % 4)]
                                      : symbol
                                  }
                                  alt="game"
                                />
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

