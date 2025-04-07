import type React from 'react';
import { useEffect, useState, useRef } from 'react';
import { ClipGaming, ExpanedWild, ExtraGold, Gold, Miltiple, Wild } from 'assets/png';
import { generateInitialBonusview, viewGenerator } from 'utils/generators/viewGenerator';
import { EBonuses, ESlotActions } from 'utils/types/slotActions';
import HANDS_VIDEO from '../../../assets/mp4/hands.mp4';
import STAR from '../../../assets/png/star.png';
import styles from './slotView.module.scss';

interface ISlotView {
    action?: ESlotActions;
    selectedBonus: EBonuses | null;
    freeSpins?: number;
    extraSpins?: number;
    isDoneInitialSpin?: boolean;
    setFreeSpins?: React.Dispatch<React.SetStateAction<number>>;
    setTotalWin?: React.Dispatch<React.SetStateAction<number>>;
    setExtraSpins?: React.Dispatch<React.SetStateAction<number>>;
    setSelectedBonus?: React.Dispatch<React.SetStateAction<EBonuses | null>>;
}

interface WildPosition {
    column: number;
    row: number;
    x: number;
    y: number;
}

const REEL_LENGTH = 20;

export const SlotView: React.FC<ISlotView> = ({
    action,
    selectedBonus,
    freeSpins,
    extraSpins,
    isDoneInitialSpin,
    setSelectedBonus,
    setFreeSpins,
    setTotalWin,
    setExtraSpins,
}) => {
    const [isSpinning, setIsSpinning] = useState<boolean>(false);
    const [boxSize, setBoxSize] = useState<number>(200);
    const [spinningColumns, setSpinningColumns] = useState<boolean[]>([
        false,
        false,
        false,
        false,
        false,
    ]);
    const [reels, setReels] = useState<string[][]>([]);
    const [finalResult, setFinalResult] = useState<string[][]>([]);
    const [wilds, setWilds] = useState<{ [key: string]: boolean }>({});
    const [wildPositions, setWildPositions] = useState<WildPosition[]>([]);
    const [raidPositions, setRaidPositions] = useState<WildPosition[]>([]);
    const [expandingElements, setExpandingElements] = useState<
        {
            column: number;
            startRow: number;
            startY: number;
            height: number;
            isAnimating: boolean;
        }[]
    >([]);
    const [wildCount, setWildCount] = useState<number>(0);
    const [muiltiplerCount, setMuiltiplerCount] = useState<number>(0);
    const [lives, setLives] = useState<number>(3);
    const [isExtraRound, setIsExtraRound] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const reelsRef = useRef<HTMLDivElement[]>([]);
    const spinTimeoutsRef = useRef<any[]>([]);
    const gameContainerRef = useRef<HTMLDivElement>(null);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    // Add state for tracking free spins
    const freeSpinTimeoutRef = useRef<any>(null);
    const extraFreeSpinTimeoutRef = useRef<any>(null);

    // Initialize reels with the initial data
    useEffect(() => {
        const initialData = viewGenerator(4, 5);

        const initialReels = Array(5)
            .fill(0)
            .map((_, colIndex) => {
                const reel: any = [];
                for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
                    reel.push(initialData[rowIndex][colIndex]);
                }

                return reel;
            });

        setReels(initialReels);
    }, []);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
    }, [window.innerWidth]);

    // Clean up timeouts on unmount
    useEffect(() => {
        return () => {
            spinTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
            if (freeSpinTimeoutRef.current) {
                clearTimeout(freeSpinTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (window.innerWidth > 1919) {
            setBoxSize(200);
        } else if (window.innerWidth > 1440) {
            setBoxSize(175);
        } else if (window.innerWidth > 1024) {
            setBoxSize(150);
        } else {
            setBoxSize(92);
        }
    }, [window.innerWidth]);

    useEffect(() => {
        if (
            freeSpins &&
            freeSpins > 0 &&
            !isSpinning &&
            !(
                selectedBonus === EBonuses.INTERROGATION &&
                finalResult.flat(Number.POSITIVE_INFINITY).includes(ExpanedWild)
            ) &&
            !(selectedBonus === EBonuses.RAID && freeSpins === 1)
        ) {
            freeSpinTimeoutRef.current = setTimeout(() => {
                if (freeSpins === 0) return;
                handleSpin();
                if (selectedBonus !== EBonuses.RAID) {
                    setFreeSpins!((prev) => prev - 1);
                }
            }, 1000); // 1 second delay between spins
        }
    }, [freeSpins, extraSpins, isSpinning, lives]);

    useEffect(() => {
        if (isExtraRound && extraSpins && selectedBonus === EBonuses.RAID && !isSpinning) {
            extraFreeSpinTimeoutRef.current = setTimeout(() => {
                if (extraSpins === 0) return;
                handleSpin();
                setExtraSpins!((prev) => prev - 1);
            }, 1000); // 1 second delay between spins
        }
    }, [isExtraRound, extraSpins, isSpinning]);

    // Function to handle spin logic
    const handleSpin = () => {
        if (isSpinning) return;

        spinTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
        spinTimeoutsRef.current = [];

        const generatedData = viewGenerator(
            4,
            5,
            selectedBonus,
            !isExtraRound && selectedBonus === EBonuses.RAID,
        );

        setIsSpinning(true);
        setSpinningColumns([true, true, true, true, true]);

        let newReels = Array(5)
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

        if (selectedBonus && isDoneInitialSpin === false) {
            newReels = generateInitialBonusview(newReels, selectedBonus);
            setSelectedBonus!(null);
        }

        setFinalResult(newReels.map((column) => column.slice(0, 4)));
        setReels(newReels);

        for (let i = 0; i < 5; i++) {
            if (reelsRef.current[i]) {
                // Reset the element
                reelsRef.current[i].style.transition = 'none';
                reelsRef.current[i].style.transform =
                    `translateY(-${(REEL_LENGTH - 4) * boxSize}px)`;

                void reelsRef.current[i].offsetHeight;

                // Create a unique animation name with timestamp to ensure it's always fresh
                const timestamp = Date.now();
                const animationName = `spinReel${i}_${timestamp}`;
                const duration = 2 + i * 0.2;

                // Create a new style element each time (removing old ones if they exist)
                const oldStyle = document.getElementById(`reel-style-${i}`);
                if (oldStyle) {
                    oldStyle.remove();
                }

                const styleEl = document.createElement('style');
                styleEl.id = `reel-style-${i}`;
                document.head.appendChild(styleEl);

                // Define keyframes with overshoot
                styleEl.innerHTML = `
          @keyframes ${animationName} {
            0% {
              transform: translateY(-${(REEL_LENGTH - 4) * boxSize}px);
            }
            90% {
              transform: translateY(20px); /* Overshoot by 10px */
            }
            100% {
              transform: translateY(0); /* Return to final position */
            }
          }
        `;

                // Apply the animation
                reelsRef.current[i].style.animation =
                    `${animationName} ${duration}s cubic-bezier(0.1, 0.3, 0.3, 1)`;
                reelsRef.current[i].style.animationFillMode = 'forwards';
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
                        if (
                            selectedBonus !== EBonuses.INTERROGATION ||
                            (selectedBonus === EBonuses.INTERROGATION &&
                                expandingElements.length === 0)
                        ) {
                            setIsSpinning(false);
                            if (selectedBonus !== EBonuses.RAID) {
                                updateTotalWin();
                            }
                            if (selectedBonus === EBonuses.GOLDEN) {
                                capturePositions();
                            }
                        }
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
        if (action === ESlotActions.PLAY && !isSpinning && isDoneInitialSpin === false) {
            handleSpin();
        }
    }, [action, isSpinning]);

    const setReelRef = (index: number) => (el: HTMLDivElement) => {
        reelsRef.current[index] = el;
    };

    // Capture the positions of wild symbols
    const capturePositions = () => {
        if (!finalResult.length || !gameContainerRef.current) return;

        const gameRect = gameContainerRef.current.getBoundingClientRect();
        const newWilds = { ...wilds }; // Keep existing wilds
        const newWildPositions: WildPosition[] = [...wildPositions]; // Keep existing wilds
        const newRaidPositions: WildPosition[] = [...raidPositions]; // Keep existing wilds

        // Position correction offsets (adjust these values as needed)
        const offsetX = -15; // Correct the rightward shift
        const offsetY = -20; // Correct the downward shift

        for (let column = 0; column < finalResult.length; column++) {
            for (let row = 0; row < 4; row++) {
                // Always check first 4 rows
                if (finalResult[column]?.[row] === Wild) {
                    const key = `${column}-${row}`;

                    // Only add if this wild is not already tracked
                    if (!newWilds[key]) {
                        newWilds[key] = true;

                        // Find the element position
                        const slotItemElement = document.querySelector(
                            `.${styles.reelColumn}:nth-child(${column + 1}) .${styles.slotItem}:nth-child(${row + 1})`,
                        );

                        if (slotItemElement) {
                            const rect = slotItemElement.getBoundingClientRect();

                            // Store the exact position with offset corrections
                            newWildPositions.push({
                                column,
                                row,
                                x:
                                    rect.left -
                                    gameRect.left +
                                    offsetX +
                                    (isMobile
                                        ? selectedBonus === EBonuses.RAID
                                            ? -(boxSize / 1.5)
                                            : 10
                                        : 0),
                                y:
                                    rect.top -
                                    gameRect.top +
                                    offsetY +
                                    (isMobile
                                        ? selectedBonus === EBonuses.RAID
                                            ? -(boxSize / 1.5)
                                            : 15
                                        : 0),
                            });
                        }
                    }
                } else if (finalResult[column]?.[row] === Miltiple) {
                    const key = `${column}-${row}`;

                    // Only add if this wild is not already tracked
                    if (!newWilds[key]) {
                        newWilds[key] = true;

                        // Find the element position
                        const slotItemElement = document.querySelector(
                            `.${styles.reelColumn}:nth-child(${column + 1}) .${styles.slotItem}:nth-child(${row + 1})`,
                        );

                        if (slotItemElement) {
                            const rect = slotItemElement.getBoundingClientRect();

                            // Store the exact position with offset corrections
                            newRaidPositions.push({
                                column,
                                row,
                                x:
                                    rect.left -
                                    gameRect.left +
                                    offsetX -
                                    (isMobile ? boxSize / 1.5 : 0),
                                y:
                                    rect.top -
                                    gameRect.top +
                                    offsetY -
                                    (isMobile ? boxSize / 1.5 : 0),
                            });
                        }
                    }
                }
            }
        }

        if (selectedBonus !== EBonuses.RAID) {
            setWilds(newWilds);
        }
        setWildPositions(newWildPositions);
        setRaidPositions(newRaidPositions);
    };

    const expandView = () => {
        if (!finalResult.length || !gameContainerRef.current) return;

        // Clear any previous expanding elements
        setExpandingElements([]);

        const slotItemHeight = 180; // Height of a single slot item
        const gameRect = gameContainerRef.current.getBoundingClientRect();

        for (let column = 0; column < finalResult.length; column++) {
            for (let row = 0; row < 4; row++) {
                // Check for wild symbols
                if (finalResult[column]?.[row] === ExpanedWild) {
                    // Find the element position
                    const slotItemElement = document.querySelector(
                        `.${styles.reelColumn}:nth-child(${column + 1}) .${styles.slotItem}:nth-child(${row + 1})`,
                    );

                    if (slotItemElement) {
                        const rect = slotItemElement.getBoundingClientRect();

                        // Calculate the starting position relative to the game container
                        const startY = rect.top - gameRect.top;

                        // Add the expanding element with initial height
                        setExpandingElements((prev) => [
                            ...prev,
                            {
                                column,
                                startRow: row,
                                startY,
                                height: slotItemHeight, // Start with the height of one slot
                                isAnimating: true,
                            },
                        ]);

                        // Start the animation
                        setTimeout(() => {
                            animateExpansion(column, row, startY);
                        }, 50);
                    }
                }
            }
        }
        if (finalResult.flat(Number.POSITIVE_INFINITY).includes(ExpanedWild) && freeSpins! > 0) {
            setTimeout(() => {
                setExpandingElements([]);
                handleSpin();
                setFreeSpins!((prev) => prev - 1);
            }, 3000);
        }
    };

    const handleRaidBonus = () => {
        if (freeSpins === 0) {
            setLives((prev) => prev - 1);
        }
        if (!finalResult.length || !freeSpins) return;

        capturePositions();
        const wildsInResult = finalResult.flat().filter((symbol) => symbol === Wild).length;

        if (wildsInResult > 0) {
            setTimeout(() => {
                setWildCount((prev) => prev + wildsInResult);
            }, 500);
        }
        const raidsInResult = finalResult.flat().filter((symbol) => symbol === Miltiple).length;

        if (raidsInResult > 0) {
            setTimeout(() => {
                setMuiltiplerCount((prev) => prev + raidsInResult);
            }, 500);
        }

        if (!raidsInResult && !wildsInResult && freeSpins! > 0) {
            setLives((prev) => prev - 1);
            setFreeSpins!((prev) => prev - 1);
        } else {
            setLives(3);
            setFreeSpins!(3);
        }

        setTimeout(() => {
            setWildPositions([]);
            setRaidPositions([]);
        }, 1000);
    };

    // Add this function to handle the progressive animation
    const animateExpansion = (column: number, startRow: number, startY: number) => {
        const slotItemHeight = isMobile ? 93 : 195;
        const totalHeight = slotItemHeight * 4 - 60; // Total height of the slot view

        // Calculate how much to expand upward and downward
        const expandUpward = startRow * (slotItemHeight - (isMobile ? 20 : 0));

        // Calculate the final position and height
        const finalY = startY - expandUpward - startRow * 5 + (isMobile ? 13 : 0);

        // Update the element to its final expanded state
        setExpandingElements((prev) =>
            prev.map((item) =>
                item.column === column && item.startRow === startRow
                    ? {
                          ...item,
                          startY: finalY, // Move up to accommodate upward expansion
                          height: totalHeight, // Expand to full height
                          isAnimating: false,
                      }
                    : item,
            ),
        );
    };

    useEffect(() => {
        if (finalResult.length && !isSpinning && !isDoneInitialSpin) {
            if (selectedBonus === EBonuses.GOLDEN) {
                setTimeout(capturePositions, 500);
            } else if (selectedBonus === EBonuses.INTERROGATION) {
                setTimeout(expandView, 200);
            } else if (selectedBonus === EBonuses.RAID) {
                setTimeout(handleRaidBonus, 200);
            }
        }
    }, [finalResult, isSpinning, selectedBonus]);

    useEffect(() => {
        if (freeSpins === 0) {
            setIsExtraRound(true);
            setLives(3);
        }
    }, [freeSpins]);

    return (
        <div
            className={styles.slotView}
            style={
                selectedBonus && isDoneInitialSpin !== false
                    ? { justifyContent: 'center', height: 'auto' }
                    : {}
            }
        >
            <div className={styles.slotView_container}>
                <div className={styles.slotView_container_slot}>
                    <img src={ClipGaming || '/placeholder.svg'} alt='clipGaming' />
                    {selectedBonus === EBonuses.RAID && isDoneInitialSpin !== false && (
                        <div className={styles.slotView_container_slot_header}>
                            <div className={styles.wildCounter}>
                                <p>WILDS</p>
                                <span>{wildCount}</span>
                            </div>
                            <div>
                                <p>MULTIPLIER</p>
                                <span>{muiltiplerCount} X</span>
                            </div>
                        </div>
                    )}
                    {selectedBonus === EBonuses.RAID && isDoneInitialSpin !== false && (
                        <div className={styles.slotView_container_slot_right}>
                            {Array.from({ length: 3 }, (_, index) =>
                                index < lives ? (
                                    <img
                                        key={index}
                                        src={
                                            freeSpins === 0 && selectedBonus === EBonuses.RAID
                                                ? ExtraGold
                                                : Gold || '/placeholder.svg'
                                        }
                                        alt='gold'
                                    />
                                ) : (
                                    <div key={index} />
                                ),
                            )}
                        </div>
                    )}
                    <div className={styles.slotView_container_slot_game} ref={gameContainerRef}>
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

                            {/* Static wild symbols that stay in place */}
                            {selectedBonus !== EBonuses.RAID &&
                                isDoneInitialSpin !== false &&
                                wildPositions.map((wild, index) => (
                                    <div
                                        key={`static-wild-${index}`}
                                        className={styles.staticWild}
                                        style={{
                                            position: 'absolute',
                                            left: `${wild.x}px`,
                                            top: `${wild.y}px`,
                                            width: `${boxSize - 20}px`,
                                            height: `${boxSize - 20}px`,
                                            zIndex: 100,
                                            pointerEvents: 'none',
                                        }}
                                    >
                                        <img
                                            src='/static/media/wild.236c3e29b77d5579c87e.png'
                                            alt='Wild'
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'contain',
                                            }}
                                        />
                                    </div>
                                ))}

                            {expandingElements.map((item, index) => {
                                if (videoRefs.current.length <= index) {
                                    videoRefs.current.push(null);
                                }

                                return (
                                    <div
                                        key={`expanding-element-${index}`}
                                        className={styles.expandingElement}
                                        style={{
                                            position: 'absolute',
                                            overflow: 'hidden',
                                            left: `${item.column * (boxSize + (boxSize !== 200 ? (isMobile ? -18 : 5) : 0)) + (isMobile ? 0 : 10)}px`,
                                            top: `${item.startY - 20}px`,
                                            width: `${boxSize - (isMobile ? 20 : 15)}px`,
                                            height: `${item.height}px`,
                                            backgroundColor: '#1e1e1e',
                                            zIndex: 90,
                                            transition: 'all 0.5s ease-out',
                                        }}
                                    >
                                        <video
                                            ref={(el) => {
                                                videoRefs.current[index] = el;
                                            }}
                                            muted
                                            className={styles.expandingVideo}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                opacity: item.isAnimating ? 0 : 1,
                                                transition: 'opacity 0.3s ease-in',
                                            }}
                                            onLoadedData={() => {
                                                if (item.isAnimating && videoRefs.current[index]) {
                                                    setTimeout(() => {
                                                        videoRefs.current[index]?.play();
                                                    }, 1000);
                                                }
                                            }}
                                        >
                                            <source src={HANDS_VIDEO} type='video/mp4' />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            {selectedBonus === EBonuses.RAID &&
                isDoneInitialSpin !== false &&
                wildPositions.map((wild, index) => {
                    return (
                        <img
                            src={STAR}
                            alt='star'
                            className={styles.star}
                            key={index}
                            style={{
                                position: 'absolute',
                                left: `${wild.x + 90}px`,
                                top: `${wild.y + 90}px`,
                                zIndex: 99,
                            }}
                        />
                    );
                })}
            {selectedBonus === EBonuses.RAID &&
                isDoneInitialSpin !== false &&
                raidPositions.map((raid, index) => {
                    return (
                        <img
                            src={STAR}
                            alt='star'
                            className={styles.raid}
                            key={index}
                            style={{
                                position: 'absolute',
                                left: `${raid.x + 90}px`,
                                top: `${raid.y + 90}px`,
                                zIndex: 99,
                            }}
                        />
                    );
                })}
        </div>
    );
};
