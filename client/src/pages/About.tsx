export default function About() {
  return (
    <article className="p-4 mt-12 text-zinc-200">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold">About Nakama</h1>
        <hr className="border-zinc-500" />
        <p>
          This is a small web application based on whatsapp or any messaging app
          built using MERN stack
        </p>
        <p>
          The intention of this web application is not to make any production
          grade or anything like that, the aim of this application is just a
          byproduct of my curiosity and interest in make such a type of
          application
        </p>
      </div>
      <div className="mt-4 flex flex-col gap-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold">About Me</h1>
        <hr className="border-zinc-500" />
        <p>
          I currently (at the time of development aka around 2024) am a second
          year at my btech college in India
        </p>
        <p>
          my socila links are{" "}
          <span>
            <a
              href="https://x.com/alla_abhiram"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              twitter
            </a>
          </span>
          ,{" "}
          <span>
            <a
              href="https://github.com/abhiram86"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              github
            </a>
          </span>
          ,{" "}
          <span>
            <a
              href="https://www.linkedin.com/in/abhiram-alla-0684512ab/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              linked in
            </a>
          </span>
        </p>
      </div>
    </article>
  );
}
