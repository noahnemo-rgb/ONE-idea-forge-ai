import { serializeError } from 'serialize-error';

export const getHTMLForErrorPage = (err: unknown): string => {
  const error = serializeError(err);
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Idea Forge error</title>
  </head>
  <body>
    <h1>An error occurred</h1>
    <pre>${JSON.stringify(error, null, 2)}</pre>
  </body>
</html>`;
};
