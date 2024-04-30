import Head from "next/head";
import styles from "./style.module.css";
import { GetServerSideProps } from "next";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/src/services/firebaseConnection";
import Textarea from "@/src/components/TextArea";
import { useSession } from "next-auth/react";
import { ChangeEvent, FormEvent, useState } from "react";
import { FaTrash } from "react-icons/fa";

interface TaskProps {
  item: {
    tarefa: string;
    created: string;
    public: string;
    user: string;
    taskId: string;
  };
  allComments: CommentsProps[];
}

interface CommentsProps {
  user: string;
  id: string;
  comment: string;
  taskId: string;
  name: string;
}

export default function TaskDetail({ item, allComments }: TaskProps) {
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [comments, setComments] = useState<CommentsProps[]>(allComments || []);

  async function handleComment(event: FormEvent) {
    event.preventDefault();

    if (!input) return;

    if (!session?.user?.email || !session?.user?.name) return;

    try {
      const docRef = await addDoc(collection(db, "comentarios"), {
        comentario: input,
        created: new Date(),
        user: session?.user?.email,
        name: session?.user?.name,
        taskId: item?.taskId,
      });

      const data = {
        id: docRef.id,
        comment: input,
        user: session.user.email,
        name: session.user.name,
        taskId: item?.taskId,
      };

      setComments((oldItems) => [...oldItems, data]);

      setInput("");
    } catch (error) {
      console.log(`Erro ao comentar: ${error}`);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Detalhes da tarefa</title>
      </Head>

      <main className={styles.main}>
        <h1>Tarefa</h1>
        <article className={styles.task}>
          <p>{item.tarefa}</p>
        </article>
      </main>

      <section className={styles.commentsContainer}>
        <h2>Deixar comentário</h2>
        <form onSubmit={handleComment}>
          <Textarea
            value={input}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
              setInput(event.target.value)
            }
            placeholder="Digite seu comentário..."
          />
          <button disabled={!session?.user} className={styles.button}>
            Enviar comentário
          </button>
        </form>
      </section>

      <section className={styles.commentsContainer}>
        <h2>Todos os comentários</h2>
        {comments.length === 0 && <span>Nenhum comentario foi encontrado</span>}

        {comments.map((item) => (
          <article key={item.id} className={styles.comment}>
            <div className={styles.headerComment}>
              <label className={styles.commentsLabel}>{item.name}</label>
              {item.user === session?.user?.email && (
                <button className={styles.buttonTrash}>
                  <FaTrash size={18} color="#ea3140" />
                </button>
              )}
            </div>
            <p>{item.comment}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;
  const docRef = doc(db, "tarefas", id);
  const snapShot = await getDoc(docRef);
  const queryComments = query(
    collection(db, "comentarios"),
    where("taskId", "==", id)
  );
  const snapShotComments = await getDocs(queryComments);

  let allComments: CommentsProps[] = [];
  snapShotComments.forEach((item) => {
    allComments.push({
      id: item.id,
      comment: item.data().comentario,
      name: item.data().name,
      taskId: item.data().taskId,
      user: item.data().user,
    });
  });

  if (snapShot.data() === undefined) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (!snapShot.data()?.public) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const miliseconds = snapShot.data()?.created?.seconds * 1000;

  const task = {
    tarefa: snapShot.data()?.tarefa,
    public: snapShot.data()?.public,
    created: new Date(miliseconds).toLocaleDateString(),
    user: snapShot.data()?.user,
    taskId: id,
  };

  return {
    props: {
      item: task,
      allComments,
    },
  };
};
