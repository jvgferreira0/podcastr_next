import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { api } from "../../services/api";
import { parseISO } from "date-fns";
import format from "date-fns/format";
import ptBR from "date-fns/locale/pt-BR";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";
import styles from './episode.module.scss';
import { useContext, useState } from 'react';
import { PlayerContext } from '../../contexts/playerContext';

import arrowLeft from '../../../public/arrow-left.svg';
import playImg from '../../../public/play.svg';

type Episode = {
    id: string;
    title: string;
    thumbnail: string;
    members: string;
    publishedAt: string;
    duration: Number;
    durationAsString: string;
    description: string;
    url: string;
    previousEpisode: string;
    nextEpisode: string;
}

type EpisodeProps = {
    episode: Episode;
}

export default function Episode({ episode }: EpisodeProps) {
    const { play } = useContext(PlayerContext);

    return (
        <div className={styles.episode}>
            <div className={styles.thumbnailContainer}>
                <Image
                    width={700}
                    height={160}
                    src={episode.thumbnail}
                    objectFit='cover'
                >
                </Image>
                <button type='button' onClick={() => play(episode)}>
                    <Image src={playImg} alt=''></Image>
                </button>
            </div>

            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>


            <div className={styles.pageButtonLeft}>
                <Link href={`${episode.previousEpisode}`}>
                    <button type='button'>
                        <Image src={arrowLeft} alt=''></Image>
                    </button>
                </Link>
            </div>
            <div className={styles.pageButtonRight}>
                <Link href={`${episode.nextEpisode}`}>
                    <button type='button'>
                        <Image src={arrowLeft} alt=''></Image>
                    </button>
                </Link>
            </div>

            {/* {episode.previousEpisode ? (
                <div className={styles.pageButtonLeft}>
                    <Link href={`${episode.previousEpisode}`}>
                        <button type='button'>
                            <Image src={arrowLeft} alt=''></Image>
                        </button>
                    </Link>
                </div>
            ) : (
                <div className={styles.pageButtonEmptyLeft}>
                    <button type='button'>
                    </button>
                </div>
            )} */}
            {/* {episode.nextEpisode ? (
                <div className={styles.pageButtonRight}>
                    <Link href={`${episode.nextEpisode}`}>
                        <button type='button'>
                            <Image src={arrowLeft} alt=''></Image>
                        </button>
                    </Link>
                </div>
            ) : (
                <div className={styles.pageButtonEmptyRight}>
                    <button type='button'>
                    </button>
                </div>
            )} */}
            <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: episode.description }}
            />
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug } = ctx.params;

    const { data } = await api.get(`/${slug}`);

    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url,
        previousEpisode: data.previousEpisode,
        nextEpisode: data.nextEpisode
    }

    console.log(data);
    console.log(' OOOOOOOOOOOOOOOOOOOOOOOOOO');
    console.log(episode);

    return {
        props: {
            episode,
        },
        revalidate: 60 * 60 * 24
    }
}