import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import cuid from "cuid";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import { FailResponse, SuccessResponse } from "./api/sendMessage";
import { useSession, signIn, signOut } from "next-auth/react";

dayjs.extend(calendar);

type Message = {
  id: string;
  sentAt: number;
  author: "system" | "bot" | "user";
  username?: string;
  userId?: string;
  message: string;
  temperature?: number;
  failedToSend: boolean;
};

type Messages = Message[];

const Home: NextPage = () => {
  const [messages, setMessages] = useState<Messages>([]);
  const [msg, setMsg] = useState("");
  const divEndRef = useRef(null);
  const { data: session } = useSession();

  useEffect(() => {
    setMessages([
      {
        id: cuid(),
        sentAt: Date.now(),
        author: "system",
        message:
          "Welcome to Ada but better! Send a message to initiate a conversation.",
        failedToSend: false,
      },
      {
        id: cuid(),
        sentAt: Date.now(),
        author: "system",
        message:
          "Ada but better is unstable and no warranties are given unless by applicable law.",
        failedToSend: false,
      },
    ]);
  }, []);

  return (
    <>
      <Head>
        <title>Ada but better</title>
        <meta
          name="description"
          content={
            "Ada is a chatbot with hundreds of hardcoded responses. Ada but better is better than that - absolutely nothing is hardcoded!\n\nAda but better is a chatbot using OpenAI's GPT-3 engine. It's not the brightest, but it's definitely smarter than Ada. Never refer to Ada but better as Ada!"
          }
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="/images/logo.png" />
        <meta property="og:title" content="Ada but better" />
        <meta
          property="og:description"
          content={
            "Ada is a chatbot with hundreds of hardcoded responses. Ada but better is better than that - absolutely nothing is hardcoded!\n\nAda but better is a chatbot using OpenAI's GPT-3 engine. It's not the brightest, but it's definitely smarter than Ada. Never refer to Ada but better as Ada!"
          }
        />
      </Head>
      <main className="bg-base-100">
        <div className="hero pt-2 sm:pt-3 md:pt-4 lg:pt-8">
          <div className="hero-content">
            <div className="px-2 sm:px-4 md:px-8 lg:px-16 transition-all">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                Ada but better
              </h1>
              <p className="pt-2 md:pt-3 lg:pt-6">
                Ada is a chatbot with hundreds of hardcoded responses. Ada
                but better is better than that - absolutely nothing is
                hardcoded!
              </p>
              <p className="pt-2 md:pt-3:lg:pt-6">
                Ada but better is a chatbot using OpenAI&apos;s GPT-3 engine.
                It&apos;s not the brightest, but it&apos;s definitely smarter
                than Ada. Never refer to Ada but better as Ada!{" "}
                <a
                  href="https://github.com/zaidmukaddam/ada-but-better"
                  className="link"
                  target="_blank"
                  rel="noreferrer"
                >
                  (GitHub)
                </a>
              </p>
              <div className="pt-2 md:pt-3 lg:pt-6 pb-2 sm:pb-3 md:pb-4 lg:pb-6">
                <h2 className="font-bold text-lg md:text-xl">
                  Still not convinced?
                </h2>
                <p className="py-2 sm:py-3">
                  Here&apos;s a definitely real chart on how Ada and Ada
                  but better performs. It is gauged off whether I think how
                  awesome it is.
                </p>
                <small className="block">Ada&apos;s performance</small>
                <progress
                  className="progress max-w-sm"
                  value="15"
                  max="100"
                ></progress>
                <small className="block">
                  Ada but better&apos;s performance
                </small>
                <progress
                  className="progress max-w-sm"
                  value="100"
                  max="100"
                ></progress>
                <small className="block opacity-60">
                  Measurements based off awesomeness.
                </small>
                {session ? (
                  <>
                    <button
                      className="btn btn-accent normal-case mt-4"
                      onClick={() => signOut()}
                    >
                      Sign out (will refresh page)
                    </button>
                    <p className="opacity-60 text-sm mt-1 md:mt-2">
                      Logged in as {session.user?.name} ({session.user?.email})
                      <br />
                      Your username (not e-mail address) is sent with every
                      request.
                    </p>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-accent normal-case mt-2 md:mt-3 lg:mt-6"
                      onClick={() => signIn("github")}
                    >
                      Sign in (will refresh page)
                    </button>
                    <p className="opacity-60 text-sm mt-1 md:mt-2">
                      Log in using GitHub to benefit from less and
                      personal-based instead of IP-based rate limits.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <div className="flex">
        <div className="h-screen w-full pt-8 border-base-300 border-y-2 relative overflow-auto bg-base-200 bg-opacity-25">
          <div className="flex flex-col gap-3 px-2 sm:px-4 md:px-8 lg:px-16">
            {messages.map((msg) => (
              <div className="flex items-center h-fit" key={msg.id}>
                <span className="text-xs opacity-60 mr-2.5 min-w-max">
                  {dayjs(msg.sentAt).calendar()}
                </span>
                <span
                  className={`badge ${msg.author === "bot"
                    ? "badge-primary"
                    : msg.author === "user"
                      ? "badge-secondary"
                      : ""
                    } badge-lg text-sm font-semibold mr-4 min-w-max`}
                >
                  {msg.author === "bot"
                    ? "Ada but better"
                    : msg.author === "user"
                      ? "You"
                      : "System"}
                </span>
                <span
                  className={`[overflow-wrap:anywhere] ${msg.failedToSend ? "text-error" : ""
                    }`}
                >
                  {msg.message}
                </span>
              </div>
            ))}
            <div className="h-36" />
            <div ref={divEndRef} className="h-px" />
          </div>
          <div className="flex items-center justify-center">
            <div className="w-full fixed bottom-8">
              <form
                className="form-control mx-2 sm:mx-4 md:mx-8 lg:mx-16"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!msg) return;
                  setMsg("");

                  if (divEndRef.current) {
                    // @ts-expect-error
                    divEndRef.current.scrollIntoView({ behavior: "smooth" });
                  }

                  const initialId = cuid();

                  const userMsg: Message = {
                    id: initialId,
                    sentAt: Date.now(),
                    author: "user",
                    username: session?.user?.name ?? undefined,
                    userId: undefined, // TODO maybe?
                    message: msg,
                    temperature: 0.7,
                    failedToSend: false,
                  };

                  setMessages((s) => {
                    return [...s, userMsg];
                  });

                  const filteredMsgs = JSON.stringify(
                    [...messages, userMsg].filter(
                      (m) => m.author !== "system" && m.failedToSend === false
                    )
                  );
                  console.log(filteredMsgs);

                  const fetched = await fetch("/api/sendMessage", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: filteredMsgs,
                  });
                  const response: SuccessResponse | FailResponse =
                    await fetched.json();

                  if (response.error) {
                    const errorSystemMsg: Message = {
                      id: cuid(),
                      sentAt: Date.now(),
                      author: "system",
                      message: `An error occured when sending message ${initialId}.\nResponse ID: ${response.id}\nReason: ${response.errorResponse}`,
                      failedToSend: false,
                    };

                    return setMessages((s) => {
                      const target = s.findIndex((m) => m.id === initialId);
                      const newUserMsg = userMsg;
                      newUserMsg.failedToSend = true;
                      const newS = [...s];
                      newS.splice(target, 1, newUserMsg);
                      return [...newS, errorSystemMsg];
                    });
                  }

                  const botMsg: Message = {
                    id: response.id,
                    sentAt: Date.now(),
                    author: "bot",
                    message: response.response,
                    temperature: userMsg.temperature,
                    failedToSend: false,
                  };

                  setMessages((s) => {
                    return [...s, botMsg];
                  });
                }}
              >
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Chat with Ada but better..."
                    className="input input-bordered w-full"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                  />
                  <button className="btn" type="submit">
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
