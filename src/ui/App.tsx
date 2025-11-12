import React, { useEffect, useRef, useState } from 'react'
import {
  createChart,
  ColorType,
  ISeriesApi,
  UTCTimestamp,
  CandlestickData,
} from 'lightweight-charts'
import { fetchKlines } from '../utils/binance'
import { emaSeries, rsi } from '../utils/indicators'
import {
  loadWL,
  saveWL,
  loadActive,
  saveActive,
  loadTF,
  saveTF,
  loadSettings,
  saveSettings,
} from '../utils/storage'
import SignalPopup from './SignalPopup'
import SettingsModal, { Settings } from './SettingsModal'
import Logo from './Logo'

type Bar = { t: number; o: number; h: number; l: number; c: number; v: number }
const TFs = ['1m', '3m', '5m', '15m', '1h'] as const
type TF = typeof TFs[number]

export default function App() {
  const [symbols, setSymbols] = useState<string[]>(() => loadWL())
  const [active, setActive] = useState<string>(
    () => loadActive() || loadWL()[0] || 'BTCUSDT'
  )
  const [tf, setTf] = useState<TF>(() => (loadTF() as TF) || '1m')
  const [data, setData] = useState<Record<string, Bar[]>>({})
  const [settings, setSettings] = useState<Settings>(() => loadSettings())
  const [showSettings, setShowSettings] = useState(false)
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null)
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)

  // Загружаем исторические данные
  useEffect(() => {
    async function load() {
      try {
        const bars = await fetchKlines(active, tf)
        if (Array.isArray(bars) && bars.length > 0) {
          setData((prev) => ({ ...prev, [active]: bars }))
        } else {
          console.warn('No bars fetched for', active)
        }
      } catch (err) {
        console.error('Fetch klines error:', err)
      }
    }
    load()
  }, [active, tf])

  // Отрисовка графика
  useEffect(() => {
    if (!chartContainerRef.current) return

    if (chartRef.current) {
      chartRef.current.remove()
      chartRef.current = null
    }

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0f0f0f' },
        textColor: '#d1d4dc',
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
      grid: { vertLines: { color: '#1a1a1a' }, horzLines: { color: '#1a1a1a' } },
      crosshair: { mode: 1 },
    })

    chartRef.current = chart
    const candleSeries = chart.addCandlestickSeries()
    candleSeriesRef.current = candleSeries

    const bars = data[active]
    if (Array.isArray(bars) && bars.length > 0) {
      const formatted: CandlestickData[] = bars
        .filter((b) => b && b.c != null)
        .map((b) => ({
          time: Math.floor(b.t / 1000) as UTCTimestamp,
          open: b.o,
          high: b.h,
          low: b.l,
          close: b.c,
        }))
      candleSeries.setData(formatted)
    } else {
      console.warn('Chart skipped update: no valid data', bars)
    }

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current!.clientWidth })
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [active, data])

  // Подписка на WebSocket Binance
  useEffect(() => {
    const socket = new WebSocket('wss://data-stream.binance.vision/ws')
    socket.onerror = (e) => console.error('Binance socket error:', e)
    socket.onclose = () => console.warn('Binance socket closed')
    return () => socket.close()
  }, [])

  // UI
  return (
    <div
      style={{
        backgroundColor: '#0f0f0f',
        color: '#d1d4dc',
        fontFamily: 'Inter, sans-serif',
        minHeight: '100vh',
        padding: '10px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        <Logo />
        <h2 style={{ marginLeft: 10, flex: 1 }}>SCALP AI</h2>
        <button
          style={{
            background: '#222',
            color: '#d1d4dc',
            border: '1px solid #333',
            padding: '4px 10px',
            cursor: 'pointer',
            borderRadius: 4,
          }}
          onClick={() => setShowSettings(true)}
        >
          ⚙️ Settings
        </button>
      </div>

      <div style={{ marginBottom: 10 }}>
        {TFs.map((t) => (
          <button
            key={t}
            onClick={() => setTf(t)}
            style={{
              background: tf === t ? '#444' : '#222',
              color: '#d1d4dc',
              border: '1px solid #333',
              marginRight: 4,
              padding: '3px 8px',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div
        ref={chartContainerRef}
        style={{ width: '100%', height: 500, border: '1px solid #333' }}
      />

      {showSettings && (
        <SettingsModal
          settings={settings}
          onClose={() => setShowSettings(false)}
          onSave={(newSettings) => {
            setSettings(newSettings)
            saveSettings(newSettings)
          }}
        />
      )}

      <SignalPopup />
    </div>
  )
}
