import { createContext, useState, ReactNode } from "react";

export type Episode = {
    title: string;
    thumbnail: string;
    members: string;
    duration: Number;
    url: string;
}

type PlayerContextData = {
    episodeList: Array<Episode>;
    currentEpisodeIndex: number;
    isPlaying: boolean;
    isLooping: boolean;
    isShuffling: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
    play: (episode: Episode) => void;
    playList: (list: Array<Episode>, index: number) => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    setPlayerState: (state: boolean) => void;
    clearPlayerState: () => void;
    playNext: () => void;
    playPrevious: () => void;
}

type PlayerContextProviderProps = {
    children: ReactNode
}

export const PlayerContext = createContext({} as PlayerContextData);


export const PlayerContextProvider = ({ children }: PlayerContextProviderProps) => {
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);

    const play = (episode: Episode) => {
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }

    const playList = (list: Array<Episode>, index: number) => {
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    }

    const toggleLoop = () => {
        setIsLooping(!isLooping);
    }

    const toggleShuffle = () => {
        setIsShuffling(!isShuffling);
    }

    const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length
    const hasPrevious = currentEpisodeIndex > 0

    const playNext = () => {
        if (isShuffling) {
            const nextRandomEpisodeCalculator = () => Math.floor(Math.random() * episodeList.length);
            const nextRandomEpisode = nextRandomEpisodeCalculator();
            let retry = 0;
            while (currentEpisodeIndex == nextRandomEpisode && retry < 3) {
                nextRandomEpisodeCalculator();
                retry++;
            }
            setCurrentEpisodeIndex(nextRandomEpisode);
        } else if (hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);
        } else if (!hasNext) {
            clearPlayerState()
        }
    }

    const playPrevious = () => {
        if (hasPrevious) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1);
        }
    }

    const setPlayerState = (state: boolean) => {
        setIsPlaying(state);
    }

    const clearPlayerState = () => {
        setEpisodeList([]);
        setCurrentEpisodeIndex(0);
    }

    return (
        <PlayerContext.Provider value={{
            episodeList,
            currentEpisodeIndex,
            isPlaying,
            isLooping,
            isShuffling,
            play,
            playList,
            togglePlay,
            toggleLoop,
            toggleShuffle,
            setPlayerState,
            clearPlayerState,
            playNext,
            playPrevious,
            hasNext,
            hasPrevious,
        }}>
            {children}
        </PlayerContext.Provider>
    )

}