import React from 'react'
import { SlotButtons } from 'components/molecules/slotButtons/SlotButtons'
import { SlotView } from 'components/molecules/slotView/SlotView'
import styles from './slot.module.scss'

export const Slot:React.FC = () => {
  return (
    <div className={styles.slot}>
      <SlotView />
      <SlotButtons />
    </div>
  )
}
