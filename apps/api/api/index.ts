import app from '../src/index';

export default function handler(req: any, res: any) {
  if (req.headers && req.headers['x-matched-path']) {
    req.url = req.headers['x-matched-path'];
  }
  return app(req, res);
}
