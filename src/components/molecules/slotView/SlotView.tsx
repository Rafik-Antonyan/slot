"use client"

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
  const [isSpinning, setIsSpinning] = useState<boolean>(false)
  const [spinningColumns, setSpinningColumns] = useState<boolean[]>([false, false, false, false, false])
  const spinTimeoutsRef = useRef<any[]>([])
  const reelsRef = useRef<HTMLDivElement[]>([])
  const [reels, setReels] = useState<string[][]>([])

  // Initialize reels with the initial data
  useEffect(() => {
    // Generate initial data
    const initialData = viewGenerator(4, 5)

    // Create reels with just the visible symbols
    const initialReels = Array(5)
      .fill(0)
      .map((_, colIndex) => {
        const reel = []
        for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
          reel.push(initialData[rowIndex][colIndex])
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

      // Generate the final result data
      const generatedData = viewGenerator(4, 5)

      setIsSpinning(true)
      setSpinningColumns([true, true, true, true, true])

      // Create new reels with random symbols first, then the final result at the end
      const newReels = Array(5)
        .fill(0)
        .map((_, colIndex) => {
          const reel = []

          // Add random symbols first
          for (let i = 0; i < REEL_LENGTH - 4; i++) {
            // Use actual image paths from your result data
            const randomResultIndex = Math.floor(Math.random() * 4)
            reel.push(generatedData[randomResultIndex][colIndex])
          }

          // Add the final result symbols at the end
          for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
            reel.push(generatedData[rowIndex][colIndex])
          }

          return reel
        })

      // Update the reels state with the full animation reels
      setReels(newReels)

      // Start the animations for all reels
      for (let i = 0; i < 5; i++) {
        if (reelsRef.current[i]) {
          // Position the reel at the top initially (showing the random symbols)
          reelsRef.current[i].style.transition = "none"
          reelsRef.current[i].style.transform = `translateY(-${(REEL_LENGTH - 4) * 200}px)`

          void reelsRef.current[i].offsetHeight

          // Animate to the bottom position (showing the final result)
          reelsRef.current[i].style.transition = `transform ${2 + i * 0.2}s cubic-bezier(0.1, 0.3, 0.3, 1)`
          reelsRef.current[i].style.transform = "translateY(0)"
        }
      }

      const newTimeouts: any[] = []

      // Set staggered timeouts for each column to stop spinning
      for (let i = 0; i < 5; i++) {
        // Calculate when this reel should stop (animation duration + a small buffer)
        const reelStopTime = (2 + i * 0.2 + 0.1) * 1000

        const columnTimeout = setTimeout(() => {
          // Just update the spinning state for this column
          // Don't update any values
          setSpinningColumns((prev) => {
            const updated = [...prev]
            updated[i] = false

            return updated
          })

          // If this is the last column, set isSpinning to false
          if (i === 4) {
            setTimeout(() => {
              setIsSpinning(false)
            }, 100)
          }
        }, reelStopTime)

        newTimeouts.push(columnTimeout)
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
                        {reels[colIndex]?.map((symbol, symbolIndex) => (
                          <div key={`reel-${symbolIndex}`} className={styles.slotItem}>
                            <img
                              src={symbol || "/placeholder.svg"}
                              alt=""
                              loading="eager"
                              onError={(e) => {
                                // If image fails to load, replace with a colored div
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

