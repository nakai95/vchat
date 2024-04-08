import { Link } from "@nextui-org/link";
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/src/config/site";
import { title, subtitle } from "@/src/components/primitives";

export default function Home() {
  return (
    <section className="h-2/3 flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title()}>Have a&nbsp;</h1>
        <h1 className={title({ color: "violet" })}>1 on 1&nbsp;</h1>
        <br />
        <h1 className={title()}>video chat.</h1>
        <h2 className={subtitle({ class: "mt-4" })}>
          Click the button to start.
        </h2>
      </div>

      <div className="flex gap-3">
        <Link
          href={siteConfig.pages.host}
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
        >
          Start Video Chat
        </Link>
      </div>
    </section>
  );
}
