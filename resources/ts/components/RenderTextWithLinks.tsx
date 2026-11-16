import { Fragment } from 'react';
import { Link } from '@mui/material';

export default function RenderTextWithLinks({ text }: { text: string; }) {
  let offset = 0;
  return <>{text.split(/(https?:\/\/[^\s<>"']+)/g).filter(Boolean).map(part => {
    const key = offset;
    offset += part.length;
    const isLink = /^https?:\/\//.test(part);
    return <Fragment key={key}>{isLink
      ? <Link href={part} target="_blank" rel="noopener noreferrer">{part}</Link>
      : <span>{part}</span>}</Fragment>;
  })}</>;
}
