"""
Vercel Serverless Function - Signals API
"""

from http.server import BaseHTTPRequestHandler
import json
import random
from datetime import datetime


class MarketDataGenerator:
    """Генератор реалистичных рыночных данных"""
    
    PAIRS = {
        'BTCUSDT': {'base_price': 95000, 'volatility': 0.08},
        'ETHUSDT': {'base_price': 3500, 'volatility': 0.10},
        'BNBUSDT': {'base_price': 620, 'volatility': 0.09},
        'SOLUSDT': {'base_price': 220, 'volatility': 0.12},
        'XRPUSDT': {'base_price': 2.35, 'volatility': 0.11},
        'ADAUSDT': {'base_price': 1.05, 'volatility': 0.08},
        'DOGEUSDT': {'base_price': 0.38, 'volatility': 0.10},
        'AVAXUSDT': {'base_price': 42, 'volatility': 0.09},
        'DOTUSDT': {'base_price': 7.2, 'volatility': 0.08},
        'MATICUSDT': {'base_price': 0.52, 'volatility': 0.10},
    }
    
    @staticmethod
    def generate_signals(count=12):
        """Генерация торговых сигналов"""
        signals = []
        pairs = list(MarketDataGenerator.PAIRS.keys())
        random.shuffle(pairs)
        
        for symbol in pairs[:count]:
            data = MarketDataGenerator.PAIRS[symbol]
            base_price = data['base_price']
            volatility = data['volatility']
            
            # Генерируем цену с волатильностью
            price_change = random.uniform(-volatility, volatility)
            current_price = base_price * (1 + price_change)
            
            # Определяем действие
            if price_change > 0.03:
                action = 'buy'
            elif price_change < -0.03:
                action = 'sell'
            else:
                action = 'hold'
            
            # Рассчитываем confidence
            confidence = min(90, max(40, 50 + abs(price_change * 500)))
            
            # Генерируем объём
            volume = random.uniform(500000, 50000000)
            
            # Формируем сигнал
            signal = {
                'pair': symbol.replace('USDT', '/USDT'),
                'exchange': random.choice(['Binance', 'Bybit']),
                'action': action,
                'entry': round(current_price, 4 if current_price < 100 else 2),
                'tp': round(current_price * (1.02 if action == 'buy' else 0.98), 4 if current_price < 100 else 2),
                'sl': round(current_price * (0.99 if action == 'buy' else 1.01), 4 if current_price < 100 else 2),
                'confidence': round(confidence),
                'time': datetime.now().strftime('%H:%M:%S'),
                'volume': round(volume),
                'volatility': round(abs(price_change) * 100, 2),
                'trades': random.randint(5000, 150000)
            }
            
            signals.append(signal)
        
        # Сортируем по confidence
        signals.sort(key=lambda x: x['confidence'], reverse=True)
        
        return signals


class handler(BaseHTTPRequestHandler):
    """Vercel serverless handler"""
    
    def do_GET(self):
        """Обработка GET запроса"""
        try:
            # Генерируем сигналы
            signals = MarketDataGenerator.generate_signals(12)
            
            # Формируем ответ
            response = {
                'signals': signals,
                'last_update': datetime.now().isoformat(),
                'count': len(signals)
            }
            
            # Отправляем ответ
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            self.wfile.write(json.dumps(response).encode())
            
        except Exception as e:
            # Обработка ошибок
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            error_response = {
                'error': str(e),
                'signals': [],
                'count': 0
            }
            
            self.wfile.write(json.dumps(error_response).encode())
    
    def do_OPTIONS(self):
        """Обработка OPTIONS запроса для CORS"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
