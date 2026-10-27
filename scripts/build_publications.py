#!/usr/bin/env python3
"""Generate consistent publication rows. Content and links work without JavaScript."""
import json
from html import escape
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]

def authors(text):
    return escape(text).replace('Zhe Yang', '<strong>Zhe Yang</strong>')

COVERS = {
 'secrets': ('privacy', 'LLM PRIVACY', 'Behind<br>the tokens.', '<div class="token-pieces"><i>sk_</i><i>••••</i><i>••••</i></div>'),
 'compressibility': ('memory', 'LLM MEMORIZATION', 'Memory<br>has a pattern.', '<div class="bit-grid">'+''.join('<i></i>' for _ in range(24))+'</div>'),
 'rauie': ('relations', 'INFORMATION EXTRACTION', 'Connecting<br>the events.', '<div class="relation-pieces"><i>event</i><b>↗</b><i>relation</i></div>')
}

def render(p):
    if p.get('image'):
        caption=p.get('figureCaption',p['imageAlt'])
        media=f'<a class="pub-media {escape(p.get("imageStyle","contain"))}" href="./{escape(p["image"])}" target="_blank" rel="noopener" data-figure data-caption="{escape(caption)}" aria-label="Enlarge {escape(p["title"])} figure"><img src="./{escape(p["image"])}" alt="{escape(p["imageAlt"])}" loading="lazy" decoding="async"><span class="zoom-hint" aria-hidden="true">View figure ↗</span></a>'
    else:
        theme,topic,words,pattern=COVERS[p['id']]
        media=f'<a class="pub-media paper-cover cover-{theme}" href="{escape(p["links"][0][1])}" target="_blank" rel="noopener" aria-label="Read {escape(p["title"])}"><span class="cover-topic">{topic}</span><span class="cover-title">{words}</span>{pattern}<span class="cover-bottom">{escape(p["venue"])} <b>↗</b></span></a>'
    title=escape(p['title'])
    if p['links']:title=f'<a href="{escape(p["links"][0][1])}" target="_blank" rel="noopener">{title}</a>'
    if p.get('shortAuthors'):
        names=f'<details class="pub-authors author-list"><summary>{authors(p["shortAuthors"])} <span class="sr-only">— expand full author list</span></summary><p>{authors(p["authors"])}</p></details>'
    else:names=f'<p class="pub-authors">{authors(p["authors"])}</p>'
    links=''.join(f'<a href="{escape(url)}" target="_blank" rel="noopener" aria-label="{escape(label)} for {escape(p["title"])}">{escape(label)} <span aria-hidden="true">↗</span></a>' for label,url in p['links'])
    actions=f'<div class="pub-links">{links}</div>' if links else f'<p class="pub-unavailable">{escape(p["availability"])}</p>'
    contribution=f'<p class="pub-contribution">{escape(p["contribution"])}</p>' if p.get('contribution') else ''
    return f'<article class="pub" id="paper-{p["id"]}" data-category="{p["category"]}">{media}<div class="pub-body"><div class="pub-meta"><span class="pub-type {p["category"]}">{escape(p["venue"])}</span><span class="pub-year">{p["year"]}</span></div><h3>{title}</h3>{names}<p class="pub-description">{escape(p["description"])}</p>{contribution}{actions}</div></article>'

pubs=json.loads((ROOT/'data/publications.json').read_text())
assert len({p['id'] for p in pubs})==len(pubs)
page=ROOT/'index.html'; text=page.read_text(); start,end='<!-- PUBLICATIONS:START -->','<!-- PUBLICATIONS:END -->'
before,remainder=text.split(start,1); _,after=remainder.split(end,1)
page.write_text(before+start+'\n'+'\n'.join(map(render,pubs))+'\n'+end+after)
print(f'Rendered {len(pubs)} consistent publication rows')
