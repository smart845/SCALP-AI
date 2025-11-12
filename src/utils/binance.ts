export type Bar = { t: number; o: number; h: number; l: number; c: number; v: number };

function mapKlines(arr: any[]): Bar[] {
  return arr.map((k: any) => ({
    t: k[0],
    o: +k[1],
    h: +k[2],
    l: +k[3],
    c: +k[4],
    v: +k[5],
  }));
}

export async function fetchKlines(symbol: string, tf: string, limit = 500): Promise<Bar[]> {
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${tf}&limit=${limit}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error('REST ' + r.status);
  const a = await r.json();
  return mapKlines(a);
}

type StreamEvt =
  | { type: 'status'; payload: string }
  | { type: 'kline'; symbol: string; bar: Bar };

export function streamSubscribe(symbols: string[], tf: string, cb: (e: StreamEvt) => void) {
  let ws: WebSocket | null = null;

  try {
    ws = new WebSocket('wss://stream.binance.com:9443/ws');
  } catch (err) {
    console.error('WebSocket init error', err);
    cb({ type: 'status', payload: 'WS: failed to initialize' });
    return;
  }

  const params = symbols.flatMap(s => [
    `${s.toLowerCase()}@kline_${tf}`,
    `${s.toLowerCase()}@trade`,
  ]);

  ws.onopen = () => {
    cb({ type: 'status', payload: 'WS: connected' });
    try {
      ws?.send(JSON.stringify({ method: 'SUBSCRIBE', params, id: Date.now() }));
    } catch (err) {
      console.error('WebSocket send error', err);
    }
  };

  ws.onerror = err => {
    console.error('WebSocket error:', err);
    cb({ type: 'status', payload: 'WS: error' });
  };

  ws.onclose = () => {
    console.warn('WebSocket closed');
    cb({ type: 'status', payload: 'WS: closed' });
  };

  ws.onmessage = msg => {
    try {
      const data = JSON.parse(msg.data);
      if (data?.k) {
        cb({
          type: 'kline',
          symbol: data.s,
          bar: {
            t: data.k.t,
            o: +data.k.o,
            h: +data.k.h,
            l: +data.k.l,
            c: +data.k.c,
            v: +data.k.v,
          },
        });
      }
    } catch (err) {
      console.error('WebSocket parse error', err);
    }
  };

  return () => {
    ws?.close();
  };
}
