import React from "react"
import styles from './loadingBar.module.scss'

interface LoadingBarProps {
  progress?: number
  width?: string
  height?: string
}

export const LoadingBar = ({
  progress = 0,
  width = "100%",
  height = "40px",
}: LoadingBarProps) => {
  return (
    <div className={styles.loading} style={{ width, height }}>
      <div className={styles.loading_fill} style={{ width: `${progress}%` }} />
    </div>
  )
}
