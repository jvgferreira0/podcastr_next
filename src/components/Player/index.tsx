import styles from "./styles.module.scss";
import Image from "next/image";
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css'

import pause from '../../../public/pause.svg';
import playing from "../../../public/playing.svg";
import shuffle from "../../../public/shuffle.svg";
import playPreviousImg from "../../../public/play-previous.svg";
import play from "../../../public/play.svg";
import playNextImg from "../../../public/play-next.svg";
import repeat from "../../../public/repeat.svg";
import { useContext, useEffect, useRef, useState } from "react";
import { PlayerContext } from "../../contexts/playerContext";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";
import { time } from "console";

export default function Player() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);

    const setupProgressListener = () => {
        audioRef.current.currentTime = 0;
        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(audioRef.current.currentTime);
        });
    }

    const handleTimebar = (timeset: number) => {
        audioRef.current.currentTime = timeset;
        setProgress(timeset);
    }

    const {
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        isLooping,
        isShuffling,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        setPlayerState,
        playNext,
        playPrevious,
        hasNext,
        hasPrevious,
    } = useContext(PlayerContext);

    useEffect(() => {
        if (!audioRef.current) {
            return;
        }
        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause()
        }
    }, [isPlaying]);

    const episode = episodeList[currentEpisodeIndex];

    return (
        <div className={styles.playerContainer}>
            <header>
                <Image src={playing} alt="Playing Now" objectFit='cover' />
                <strong>Tocando Agora</strong>
            </header>

            {episode ? (
                <div className={styles.currentEpisode}>
                    <Image
                        width={592}
                        height={592}
                        src={episode.thumbnail}
                        objectFit='cover'
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            )}

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                max={+episode.duration}
                                value={progress}
                                onChange={handleTimebar}
                                trackStyle={{ backgroundColor: '#04d361' }}
                                railStyle={{ backgroundColor: '#9f75ff' }}
                                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        )}
                    </div>
                    <span>{convertDurationToTimeString(+episode?.duration ?? 0)}</span>
                </div>

                {episode && (
                    <audio
                        src={episode.url}
                        ref={audioRef}
                        loop={isLooping}
                        autoPlay
                        onEnded={() => playNext()}
                        onLoadedMetadata={() => setupProgressListener()}
                        onPlay={() => setPlayerState(true)}
                        onPause={() => setPlayerState(false)}
                    />
                )}

                <div className={styles.buttons}>
                    <button
                        type='button'
                        disabled={!episode || episodeList.length === 1}
                        onClick={toggleShuffle}
                        className={isShuffling ? styles.isActive : ''}
                    >
                        <Image src={shuffle} alt="Shuffle" />
                    </button>
                    <button
                        type='button'
                        disabled={!episode || !hasPrevious || isShuffling}
                        onClick={() => playPrevious()}
                    >
                        <Image
                            src={playPreviousImg}
                            alt="Play Previous"
                        />
                    </button>
                    <button
                        type='button'
                        className={styles.playButton}
                        disabled={!episode}
                        onClick={() => togglePlay()}
                    >
                        {isPlaying ?
                            <Image src={pause} alt='Pause' />
                            :
                            <Image src={play} alt="Play Next" />
                        }
                    </button>
                    <button type='button' disabled={!episode || !hasNext}>
                        <Image
                            src={playNextImg}
                            alt="Play Next"
                            onClick={() => playNext()}
                        />
                    </button>
                    <button
                        type='button'
                        disabled={!episode}
                        onClick={toggleLoop}
                        className={isLooping ? styles.isActive : ''}
                    >
                        <Image src={repeat} alt="Repeat" />
                    </button>
                </div>
            </footer>
        </div>
    )
}