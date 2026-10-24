import { Avatar } from "@/components/holdfast/avatar";

export type MessageLink = { label: string; url: string };

type Props = {
  who: "bot" | "you";
  at: Date;
  tone?: "error" | "success";
  links?: MessageLink[];
  children: React.ReactNode;
  /** A follow-up from the same sender: no avatar or name, like a chat groups them. */
  grouped?: boolean;
};

const time = (d: Date) => d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

/** One message in the channel: who, when, what, and any links (transactions, addresses) under it. */
export function ChatMessage({ who, at, tone, links, children, grouped }: Props) {
  return (
    <li className={`hf-message group flex gap-3 px-4 ${grouped ? "pt-1" : "pt-4"} ${tone ? `hf-${tone}` : ""}`}>
      {grouped ? <span className="w-9 shrink-0" /> : <Avatar who={who} />}
      <div className="min-w-0 flex-1">
        {!grouped && (
          <p className="flex items-baseline gap-2">
            <span className={`text-[14.5px] font-semibold ${who === "bot" ? "hf-name" : ""}`}>
              {who === "bot" ? "Holdfast" : "You"}
            </span>
            {who === "bot" && <span className="hf-bot-tag">BOT</span>}
            <time className="text-[11.5px] text-faint" dateTime={at.toISOString()}>
              {time(at)}
            </time>
          </p>
        )}
        <div className={`hf-text mt-0.5 text-[14.5px] leading-relaxed ${tone === "error" ? "hf-error-text" : ""}`}>
          {children}
        </div>
        {links && links.length > 0 && (
          <p className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[13px]">
            {links.map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="hf-link">
                {l.label}
              </a>
            ))}
          </p>
        )}
      </div>
    </li>
  );
}
