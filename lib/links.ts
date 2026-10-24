/** Spread onto an <a> that leaves the site (GitHub, LinkedIn, Etherscan, the resume PDF): it opens in a new
 * tab, and the page it opens gets no handle back to this one. */
export const NEW_TAB = { target: "_blank", rel: "noopener noreferrer" } as const;

/** NEW_TAB for web links; nothing for mailto: and other links that open an app instead of a page. */
export const newTabIfWeb = (href: string) => (/^https?:\/\//.test(href) ? NEW_TAB : {});
