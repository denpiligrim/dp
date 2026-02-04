import React, { useEffect, useState } from "react";
import axios from "axios";
import * as cheerio from 'cheerio';
import { Button, Card, CardContent, Link, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";


interface propsType {
  text: string;
}

const RenderTextWithLinks = ({ text }: propsType): JSX.Element => {

  const { t, i18n } = useTranslation();

  const urlRegex = /(https?:\/\/[\w._-]+(?:\/[\w._-]*)*)/g;

  const textParts = text.split(urlRegex);

  const [parts, setParts] = useState<string[]>(textParts);
  const [firstTelegramLink, setFirstTelegramLink] = useState<string | null>(null);
  const [tgName, setTgName] = useState<string | null>(null);
  const [tgDescr, setTgDescr] = useState<string | null>(null);

  useEffect(() => {
    let first = null;

    parts.forEach((part, index) => {
      if (urlRegex.test(part)) {
        if (!first && part.startsWith('https://t.me')) {
          first = part;
        }
      }
    });
    if (first) {
      axios.get('/fetch-html?url=' + encodeURIComponent(first))
        .then(res => {
          const data = res.data;

          const $ = cheerio.load(data);

          const channelName = $('meta[property="og:title"]').attr('content') || '';
          const messageText = $('meta[property="og:description"]').attr('content') || '';

          setTgName(channelName);
          setTgDescr(messageText);
          setFirstTelegramLink(first);
        });
    }
  }, []);
  return (
    <>
      {
        parts.map((part, index) => (
          <React.Fragment key={index}>
            {urlRegex.test(part) ? (
              <>
                {firstTelegramLink && part === firstTelegramLink ? (
                  <>
                    <Link href={part} target="_blank" rel="noopener noreferrer">{part}</Link>
                    <Card sx={{ width: '100%', mt: 1 }} variant='outlined'>
                      <CardContent>
                        <Typography variant="body1">
                          {tgName}
                        </Typography>
                        <Typography variant="caption" component="p" color="textSecondary" sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: '5',
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {tgDescr}
                        </Typography>
                        <Button variant="outlined" size="small" href={part} target="_blank" sx={{ mt: 1 }}>{t('openBtn')}</Button>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Link key={index} href={part} target="_blank" rel="noopener noreferrer">{part}</Link>
                )}
              </>
            ) : (
              <span>{part}</span>
            )}
          </React.Fragment>
        ))
      }
    </>
  )
}
export default RenderTextWithLinks
