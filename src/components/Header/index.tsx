import Link from "next/link";
import styles from "./styles.module.css";
import { signIn, signOut, useSession } from "next-auth/react";
import { SiGmail } from "react-icons/si";


export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className={styles.header}>
      <section className={styles.content}>
        <nav className={styles.nav}>
          <Link href={"/"}>
            <h1 className={styles.logo}>
              Tarefas <span>+</span>
            </h1>
          </Link>
          {session?.user && (
            <Link className={styles.link} href={"/Dashboard"}>
              Meu painel
            </Link>
          )}
        </nav>
        {status === "loading" ? (
          <></>
        ) : session ? (
          <button className={styles.loginButton} onClick={() => signOut()}>
            Olá {session?.user?.name}
          </button>
        ) : (
          <button
            className={styles.loginButton}
            onClick={() => signIn("google")}
          >
            Acessar 
            <SiGmail size={18} color="#e54"/>
          </button>
        )}
      </section>
    </header>
  );
}
