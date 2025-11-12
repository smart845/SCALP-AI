import React, { useEffect, useRef, useState } from 'react'
import { createChart, ColorType, UTCTimestamp } from 'lightweight-charts'
import { fetchKlines } from '../utils/binance'
import { emaSeries, rsi, ema } from '../utils/indicators'
import { loadWL, saveWL, loadActive, saveActive, loadTF, saveTF, loadSettings, saveSettings } from '../utils/storage'
import SignalPopup from './SignalPopup'
import SettingsModal, { Settings } from './SettingsModal'
import Logo from './Logo'

type Bar = { t:number,o:number,h:number,l:number,c:number,v:number }
const TFs = ['1m','3m','5m','15m','1h'] as const
type TF = typeof TFs[number]

export default function App(){
  const [symbols, setSymbols] = useState<string[]>(()=>loadWL())
  const [active, setActive] = useState<string>(()=> loadActive() || (loadWL()[0] ?? 'BTCUSDT'))
  const [tf, setTf] = useState<TF>(()=> (loadTF() as TF) || '1m')
  const [data, setData] = useState<Record<string, Bar[]>>({})
  const chartContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartContainerRef.current) return
    const chart = createChart(chartContainerRef.current, {
      layout: { background: { color: '#0f0f0f' }, textColor: '#d1d4dc' },
      width: chartContainerRef.current.clientWidth,
      height: 500
    })
    const candleSeries = chart.addCandlestickSeries()

    const bars = data[active]
    if (Array.isArray(bars) && bars.length > 0) {
      try {
        const formatted = bars
          .filter(b => b && b.c != null)
          .map(b => ({
            time: Math.floor(b.t / 1000) as UTCTimestamp,
            open: b.o, high: b.h, low: b.l, close: b.c
          }))
        candleSeries.setData(formatted)
      } catch (e) {
        console.error('Chart setData error:', e)
      }
    } else {
      console.warn('Chart skipped update: no valid data', bars)
    }

    return () => chart.remove()
  }, [active, data])

  useEffect(() => {
    const socket = new WebSocket('wss://data-stream.binance.vision/ws')
    socket.onerror = e => console.error('Binance socket error:', e)
    socket.onclose = () => console.warn('Binance socket closed')
    return () => socket.close()
  }, [])

  return <div ref={chartContainerRef} style={{width:'100%',height:'500px'}} />
}
