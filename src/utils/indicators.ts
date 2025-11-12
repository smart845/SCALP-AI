import type { UTCTimestamp } from 'lightweight-charts'
import type { Bar } from './binance'

export function ema(values:number[], p:number){
  const out:number[] = []; const k = 2/(p+1); let v = values[0]; out.push(v);
  for(let i=1;i<values.length;i++){ v = values[i]*k + v*(1-k); out.push(v); }
  return out
}
export function emaSeries(values:number[], p:number, bars:Bar[]){
  const e = ema(values, p)
  return e.map((v,i)=> ({
    time: Math.floor(bars[i].t/1000) as UTCTimestamp,
    value: v ?? 0 // защита от null
  }))
}
export function rsi(values:number[], period=14){
  const out = new Array(values.length).fill(null) as (number|null)[]
  let gains=0, losses=0
  for(let i=1;i<=period;i++){ const d=values[i]-values[i-1]; if(d>=0) gains+=d; else losses+=-d }
  let avgGain=gains/period, avgLoss=losses/period
  out[period] = 100 - (100/(1+(avgGain/(avgLoss||1e-9))))
  for(let i=period+1;i<values.length;i++){
    const d=values[i]-values[i-1]; const g=Math.max(d,0), l=Math.max(-d,0)
    avgGain=(avgGain*(period-1)+g)/period
    avgLoss=(avgLoss*(period-1)+l)/period
    out[i] = 100 - (100/(1+(avgGain/(avgLoss||1e-9))))
  }
  return out.map(v => v ?? 0) // null -> 0
}
