import React from "react"
import { useEffect, useState, useRef } from "react"
import video from "../../../assets/mp4/poker_chips.webm"
import { EBonuses } from "utils/types/slotActions";
import styles from "./totalWin.module.scss"

interface ITotalWin {
  totalWin: number;
  setSelectedBonus: React.Dispatch<React.SetStateAction<EBonuses | null>>
}

export const TotalWin: React.FC<ITotalWin> = ({ totalWin, setSelectedBonus }) => {
  const [displayValue, setDisplayValue] = useState(0)
  const [fontSize, setFontSize] = useState(48)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Custom hook for the counting animation
  const useFadeIn = (targetValue: number, animationDuration: number) => {
    useEffect(() => {
      let startTime: number
      let animationFrameId: number

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const elapsed = timestamp - startTime
        const progress = Math.min(elapsed / animationDuration, 1)

        // Calculate current value based on progress
        const currentValue = Math.floor(progress * targetValue)
        setDisplayValue(currentValue)

        const currentFontSize = 48 + 48 * progress
        setFontSize(currentFontSize)

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate)
        } else {
          setTimeout(() => {
            setSelectedBonus(null) // Reset selected bonus after animation
          }, 1500)
        }
      }

      animationFrameId = requestAnimationFrame(animate)

      return () => {
        cancelAnimationFrame(animationFrameId)
      }
    }, [targetValue, animationDuration])
  }

  // Function to stop all videos and play only this one
  const stopAllVideosAndPlayThis = () => {
    // First, pause all videos on the page
    const allVideos = document.querySelectorAll("video")
    allVideos.forEach((videoElement) => {
      if (videoElement !== videoRef.current) {
        videoElement.pause()
      }
    })

    // Then play our video
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Autoplay was prevented:", error)
        
        // Video might still need user interaction to play if it has sound
      })
    }
  }

  // Use our custom animation hook
  useFadeIn(totalWin, totalWin > 100 ? 5000 : 2000)

  // Effect to handle video playback when component mounts
  useEffect(() => {
    stopAllVideosAndPlayThis()

    // Clean up when component unmounts
    return () => {
      if (videoRef.current) {
        videoRef.current.pause()
      }
    }
  }, []) // Empty dependency array means this runs once on mount

  useEffect(() => {
    const totalWinElement:HTMLDivElement = document.querySelector(`.${styles.totalWin_amount}`)!;
    if (totalWinElement) {
      totalWinElement.style.fontSize = `${fontSize}px`;
    }
  }, [fontSize]);

  return (
    <div className={styles.totalWin}>
      <video
        ref={videoRef}
        className={styles.totalWin_video}
        loop
        muted
        onPlay={stopAllVideosAndPlayThis} 
      >
        <source src={video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className={styles.totalWin_amount} style={{ fontSize: `${fontSize}px` }}>
        ${displayValue.toLocaleString()}
      </div>
    </div>
  )
}

