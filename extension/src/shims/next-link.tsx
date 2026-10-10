import React from 'react';

type LinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
};

// '/utils/base64' → '#/utils/base64'; '/' e '/#categoria' voltam para a lista
export const toHashHref = (href: string) => {
  if (!href.startsWith('/')) return href;
  const [path] = href.split('#');
  return `#${path || '/'}`;
};

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(({ href, ...props }, ref) => (
  <a ref={ref} href={toHashHref(href)} {...props} />
));

Link.displayName = 'Link';

export default Link;
