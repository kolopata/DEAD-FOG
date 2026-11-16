#!/usr/bin/env python3
"""Собирает игру в один самодостаточный файл dist/dead-fog.html.
Запуск:  python3 build.py
Порядок подключения скриптов берётся из index.html (он важен: общий глобальный scope)."""
import re, os
R = os.path.dirname(os.path.abspath(__file__))
rd = lambda p: open(os.path.join(R, p), encoding='utf-8').read()
html = rd('index.html')
html = re.sub(r'<link rel="stylesheet" href="([^"]+)">', lambda m: '<style>\n' + rd(m.group(1)) + '</style>', html)
def inline(m):
    src = rd(m.group(1))
    assert '</script' not in src, m.group(1)
    return '<script>' + src + '</script>'
html = re.sub(r'<script src="([^"]+)"></script>', inline, html)
os.makedirs(os.path.join(R, 'dist'), exist_ok=True)
out = os.path.join(R, 'dist', 'dead-fog.html')
open(out, 'w', encoding='utf-8').write(html)
print('OK ->', out, round(len(html) / 1024), 'KB')
