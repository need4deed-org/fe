import Link from "next/link";

export function useCommentTag() {
  const renderHighlightedText = (value: string) => {
    const parts = value.split(/((?<=^|\s)@\w+)/g);
    return parts.map((value, idx) => {
      if (value.startsWith("@")) {
        // TODO run logic here to find userId for url
        // TODO add condition, if user valid pass return Link, else fail return value
        return (
          // TODO add userId to path
          <Link href={`/volunteers/:userId`} key={`${value}${idx}`} className="tag">
            {value}
          </Link>
        );
      } else {
        return value;
      }
    });
  };

  return { renderHighlightedText };
}
