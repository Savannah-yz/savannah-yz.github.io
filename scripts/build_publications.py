#!/usr/bin/env python3
"""Regenerate static, crawler-readable publication markup. No dependencies."""
import json
from html import escape
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]

def authors(text):
    return escape(text).replace('Zhe Yang', '<strong>Zhe Yang</strong>')

ART = {
    'innerfeel': '<g fill="none" stroke="#9293ca" stroke-width="1.2"><circle cx="100" cy="72" r="42"/><circle cx="151" cy="72" r="42"/><path d="M68 82Q100 111 132 82M119 65Q150 40 181 65"/></g><circle cx="87" cy="65" r="3" fill="#eaa075"/><circle cx="108" cy="65" r="3" fill="#eaa075"/><text x="125" y="140" text-anchor="middle" font-size="9" fill="#8387a6" letter-spacing="2">TWO PERSPECTIVES</text>',
    'compressibility': '<path d="M36 20V126H225" fill="none" stroke="#b2b6d9"/><path d="M50 112L207 29" stroke="#eaa075" stroke-width="1.5"/><g fill="#7374d9"><circle cx="58" cy="105" r="4"/><circle cx="76" cy="95" r="4"/><circle cx="94" cy="93" r="4"/><circle cx="111" cy="78" r="4"/><circle cx="132" cy="75" r="4"/><circle cx="149" cy="61" r="4"/><circle cx="168" cy="55" r="4"/><circle cx="188" cy="40" r="4"/><circle cx="205" cy="35" r="4"/></g><text x="130" y="147" text-anchor="middle" font-size="8" fill="#8387a6" letter-spacing="1.5">ENTROPY ↔ MEMORIZATION</text>',
    'secrets': '<g fill="none" stroke="#a0a4ca"><rect x="26" y="32" width="198" height="84" rx="7"/><path d="M26 55H224"/><circle cx="40" cy="43" r="2"/><circle cx="50" cy="43" r="2"/><circle cx="60" cy="43" r="2"/></g><text x="48" y="83" font-size="16" fill="#7374d9">sk_••••••••</text><path d="M48 98H87M94 98H132M139 98H191" stroke="#eaa075" stroke-width="4"/><text x="125" y="143" text-anchor="middle" font-size="8" fill="#8387a6" letter-spacing="2">SECRETS IN TOKEN SPACE</text>',
    'extract': '<g stroke="#969bca" fill="none"><path d="M55 45L124 82L197 42M124 82L61 124M124 82L194 126"/><rect x="28" y="29" width="54" height="30" rx="5"/><rect x="98" y="67" width="54" height="30" rx="5"/><rect x="170" y="26" width="54" height="30" rx="5"/><rect x="34" y="109" width="54" height="30" rx="5"/><rect x="167" y="111" width="54" height="30" rx="5"/></g><circle cx="125" cy="82" r="5" fill="#eaa075"/><g stroke="#969bca"><path d="M41 43H69M183 41H211M48 124H74M181 126H207"/></g>'
}

def render(p):
    cls = 'pub' + (' featured' if p.get('featured') else '')
    if p.get('image'):
        media = f'<div class="pub-media {escape(p.get("imageStyle", ""))}"><img src="./{escape(p["image"])}" alt="{escape(p["imageAlt"])}" loading="lazy" decoding="async" width="1200" height="700"></div>'
    else:
        media = f'<div class="pub-media"><div class="pub-art {p["art"]}" aria-hidden="true"><svg viewBox="0 0 250 160" xmlns="http://www.w3.org/2000/svg" font-family="monospace">{ART[p["art"]]}</svg></div></div>'
    title = escape(p['title'])
    if p['links']:
        title = f'<a href="{escape(p["links"][0][1])}" target="_blank" rel="noopener">{title}</a>'
    if p.get('shortAuthors'):
        names = f'<details class="pub-authors author-list"><summary>{authors(p["shortAuthors"])} <span class="sr-only">— expand full author list</span></summary><p>{authors(p["authors"])}</p></details>'
    else:
        names = f'<p class="pub-authors">{authors(p["authors"])}</p>'
    links = ''.join(f'<a href="{escape(url)}" target="_blank" rel="noopener" aria-label="{escape(label)} for {escape(p["title"])}">{escape(label)} <span aria-hidden="true">↗</span></a>' for label,url in p['links'])
    actions = f'<div class="pub-links">{links}</div>' if links else f'<p class="pub-unavailable">{escape(p["availability"])}</p>'
    contribution = f'<p class="pub-contribution">{escape(p["contribution"])}</p>' if p.get('contribution') else ''
    return f'<article class="{cls}" id="paper-{p["id"]}" data-category="{p["category"]}">{media}<div class="pub-body"><div class="pub-meta"><span class="pub-type {p["category"]}">{escape(p["venue"])}</span><span class="pub-year">{p["year"]}</span></div><h3>{title}</h3>{names}<p class="pub-description">{escape(p["description"])}</p>{contribution}{actions}</div></article>'

pubs = json.loads((ROOT/'data/publications.json').read_text())
assert len({p['id'] for p in pubs}) == len(pubs), 'Duplicate publication ids'
page = ROOT/'index.html'
text = page.read_text()
start, end = '<!-- PUBLICATIONS:START -->', '<!-- PUBLICATIONS:END -->'
before, remainder = text.split(start,1)
_, after = remainder.split(end,1)
page.write_text(before+start+'\n'+'\n'.join(map(render,pubs))+'\n'+end+after)
print(f'Rendered {len(pubs)} publications into index.html')
