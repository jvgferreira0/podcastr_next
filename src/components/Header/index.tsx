import format from 'date-fns/format'
import ptBR from 'date-fns/locale/pt-BR'
import Image from 'next/image'
import Link from "next/link";

import styles from "./styles.module.scss"

import logo from "../../../public/logo.svg"

export default function Header(props) {
    const currentDate = format(new Date(), 'EEEEEE, d MMM', {
        locale: ptBR,
    })

    return (
        <header className={styles.headerContainer}>
            <Link href='/'>
                <button type='button'>
                    <Image src={logo} alt="Podcastr" />
                </button>
            </Link>
            <p>O melhor para você ouvir sempre</p>
            <span>{currentDate}</span>
        </header>
    )
}