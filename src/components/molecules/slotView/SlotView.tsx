import type React from 'react';
import { useEffect, useState, useRef } from 'react';
import { ClipGaming } from 'assets/png';
import { viewGenerator } from 'utils/generators/viewGenerator';
import { EBonuses, ESlotActions } from 'utils/types/slotActions';
import styles from './slotView.module.scss';

interface ISlotView {
    action?: ESlotActions;
    selectedBonus?: EBonuses;
    freeSpins?: number; 
    setFreeSpins?: React.Dispatch<React.SetStateAction<number>>;
    setTotalWin?: React.Dispatch<React.SetStateAction<number>>;
}

const REEL_LENGTH = 20;

export const SlotView: React.FC<ISlotView> = ({ action, selectedBonus, freeSpins, setFreeSpins, setTotalWin }) => {
    const [isSpinning, setIsSpinning] = useState<boolean>(false);
    const [spinningColumns, setSpinningColumns] = useState<boolean[]>([false, false, false, false, false]);
    const spinTimeoutsRef = useRef<any[]>([]);
    const reelsRef = useRef<HTMLDivElement[]>([]);
    const [reels, setReels] = useState<string[][]>([]);

    // Add state for tracking free spins
    const freeSpinTimeoutRef = useRef<any>(null);

    // Initialize reels with the initial data
    useEffect(() => {
      const initialData = viewGenerator(4, 5);

      const initialReels = Array(5)
        .fill(0)
        .map((_, colIndex) => {
          const reel = [];
          for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
            reel.push(initialData[rowIndex][colIndex]);
          }

          return reel;
        });

      setReels(initialReels);
    }, []);

    // Clean up timeouts on unmount
    useEffect(() => {
      return () => {
        spinTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
        if (freeSpinTimeoutRef.current) {
          clearTimeout(freeSpinTimeoutRef.current);
        }
      };
    }, []);

    // Trigger next free spin when current spin completes
    useEffect(() => {
      if (freeSpins && freeSpins > 0 && !isSpinning) {
        freeSpinTimeoutRef.current = setTimeout(() => {
          handleSpin();
          setFreeSpins!((prev) => prev - 1);
        }, 1000); // 1 second delay between spins
      }
    }, [freeSpins, isSpinning]);

    // Function to handle spin logic
    const handleSpin = () => {
      if (isSpinning) return;

      spinTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
      spinTimeoutsRef.current = [];

      const generatedData = viewGenerator(4, 5);

      setIsSpinning(true);
      setSpinningColumns([true, true, true, true, true]);

      const newReels = Array(5)
        .fill(0)
        .map((_, colIndex) => {
          const reel = [];
          for (let i = 0; i < REEL_LENGTH - 4; i++) {
            const randomResultIndex = Math.floor(Math.random() * 4);
            reel.push(generatedData[randomResultIndex][colIndex]);
          }
          for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
            reel.push(generatedData[rowIndex][colIndex]);
          }

          return reel;
        });

      setReels(newReels);

      for (let i = 0; i < 5; i++) {
        if (reelsRef.current[i]) {
          reelsRef.current[i].style.transition = "none";
          reelsRef.current[i].style.transform = `translateY(-${(REEL_LENGTH - 4) * 200}px)`;

          void reelsRef.current[i].offsetHeight;

          reelsRef.current[i].style.transition = `transform ${2 + i * 0.2}s cubic-bezier(0.1, 0.3, 0.3, 1)`;
          reelsRef.current[i].style.transform = "translateY(0)";
        }
      }

      const newTimeouts: any[] = [];

      for (let i = 0; i < 5; i++) {
        const reelStopTime = (2 + i * 0.2 + 0.1) * 1000;

        const columnTimeout = setTimeout(() => {
          setSpinningColumns((prev) => {
            const updated = [...prev];
            updated[i] = false;
            
            return updated;
          });

          if (i === 4) {
            setTimeout(() => {
              setIsSpinning(false);
              updateTotalWin();
            }, 100);
          }
        }, reelStopTime);

        newTimeouts.push(columnTimeout);
      }

      spinTimeoutsRef.current = newTimeouts;
    };

    // Function to update total win after spin finishes
    const updateTotalWin = () => {
      if (setTotalWin) {
        setTotalWin((prevTotalWin) => {
          if (!prevTotalWin) return 24;
          const newTotalWin = prevTotalWin + prevTotalWin * 1.1;

          return Math.floor(newTotalWin);
        });
      }
    };

    useEffect(() => {
      if (action === ESlotActions.PLAY && !isSpinning) {
        handleSpin();
      }
    }, [action, isSpinning]);

    const setReelRef = (index: number) => (el: HTMLDivElement) => {
      reelsRef.current[index] = el;
    };

    return (
        <div className={styles.slotView} style={selectedBonus ? { justifyContent: 'center', height:"auto" } : {}}>
            <div className={styles.slotView_container}>
                <div className={styles.slotView_container_slot}>
                    <img src={ClipGaming || '/placeholder.svg'} alt='clipGaming' />
                    <div className={styles.slotView_container_slot_game}>
                        <div className={styles.game}>
                            <div className={styles.reelsContainer}>
                                {Array(5)
                                    .fill(0)
                                    .map((_, colIndex) => (
                                        <div
                                            key={colIndex}
                                            className={`${styles.reelColumn} ${spinningColumns[colIndex] ? styles.spinning : ''}`}
                                        >
                                            <div className={styles.reel} ref={setReelRef(colIndex)}>
                                                {reels[colIndex]?.map((symbol, symbolIndex) => (
                                                    <div
                                                        key={`reel-${symbolIndex}`}
                                                        className={styles.slotItem}
                                                    >
                                                        <img
                                                            src={symbol || '/placeholder.svg'}
                                                            alt=''
                                                            loading='eager'
                                                            onError={(e) => {
                                                                const target =
                                                                    e.target as HTMLImageElement;
                                                                target.style.display = 'none';
                                                                target.parentElement!.style.backgroundColor =
                                                                    '#333';
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
    );
};
