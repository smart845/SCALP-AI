"""
Vercel Serverless Function - Stats API
"""

from http.server import BaseHTTPRequestHandler
import json
import random
from datetime import datetime


class handler(BaseHTTPRequestHandler):
    """Vercel serverless handler для статистики"""
    
    def do_GET(self):
        """Обработка GET запроса"""
        try:
            # Генерируем статистику
            total_signals = random.randint(10, 20)
            buy_signals = random.randint(4, 10)
            sell_signals = random.randint(4, 10)
            avg_confidence = round(random.uniform(60, 85), 2)
            
            # Формируем ответ
            response = {
                'total_signals': total_signals,
                'buy_signals': buy_signals,
                'sell_signals': sell_signals,
                'avg_confidence': avg_confidence,
                'last_update': datetime.now().isoformat()
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
                'total_signals': 0,
                'buy_signals': 0,
                'sell_signals': 0,
                'avg_confidence': 0
            }
            
            self.wfile.write(json.dumps(error_response).encode())
    
    def do_OPTIONS(self):
        """Обработка OPTIONS запроса для CORS"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
