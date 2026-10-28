"""Original SVG companions for publication thumbnails and the career timeline."""

def buddy_svg(kind):
    prefix = f'buddy-{kind}'
    viewport = '112 18 136 207' if kind == 'journey' else '0 0 360 240'
    accents = {'secrets': '#edbc9d', 'compressibility': '#b6b3e7', 'rauie': '#a9c9ba', 'journey': '#b6b3e7'}
    accent = accents[kind]
    scenery = '' if kind == 'journey' else f'''
      <ellipse cx="180" cy="130" rx="112" ry="83" fill="{accent}" opacity=".12"/>
      <ellipse class="buddy-shadow" cx="180" cy="215" rx="69" ry="9" fill="#7e7eab" opacity=".13"/>
      <path d="M76 90v10m-5-5h10 M280 169v8m-4-4h8" stroke="{accent}" stroke-width="2" stroke-linecap="round"/>
    '''
    prop = {
      'secrets': '''<g class="buddy-prop lock-prop"><path d="M164 166v-12a16 16 0 0 1 32 0v12" fill="none" stroke="#c59e84" stroke-width="6"/><rect x="158" y="160" width="44" height="34" rx="10" fill="#f1c4a7"/><circle cx="180" cy="173" r="4" fill="#987767"/><path d="M180 176v6" stroke="#987767" stroke-width="3" stroke-linecap="round"/></g>''',
      'compressibility': '''<g class="buddy-prop book-prop"><path d="M139 158q21-8 41 5q20-13 41-5v33q-20-8-41 3q-20-11-41-3z" fill="#8f87c4"/><path d="M144 155q19-5 36 7q17-12 36-7v30q-18-5-36 5q-18-10-36-5z" fill="#fff9ef"/><path d="M180 162v27" stroke="#d2c5bc"/><g class="book-lines" stroke="#d7cdc1" stroke-width="2" stroke-linecap="round"><path d="m150 164 21 6m-21 1 21 6m18-7 21-6m-21 13 21-6"/></g><path class="book-page" d="M180 163q8-11 23-13v31q-12 1-23 9" fill="#fffdf7" stroke="#e8dfd6" stroke-linejoin="round"/></g>''',
      'rauie': '''<g class="buddy-prop nodes-prop"><path class="node-trail" d="M230 147q36 0 36-39l-28-39m28 39 34-35" fill="none" stroke="#a5c2b4" stroke-width="2" stroke-dasharray="4 5"/><circle class="node-one" cx="238" cy="69" r="11" fill="#c2d9ce"/><circle class="node-two" cx="266" cy="108" r="14" fill="#a4c4b6"/><circle class="node-three" cx="300" cy="73" r="9" fill="#e5c1a8"/><circle cx="266" cy="108" r="5" fill="#f7faf7"/></g>''',
      'journey': ''
    }[kind]
    return f'''<svg class="buddy-art buddy-art-{kind}" viewBox="{viewport}" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="{prefix}-shell" x1="130" y1="45" x2="230" y2="130" gradientUnits="userSpaceOnUse"><stop stop-color="#fffefc"/><stop offset="1" stop-color="#dedfec"/></linearGradient>
        <linearGradient id="{prefix}-body" x1="147" y1="133" x2="216" y2="191" gradientUnits="userSpaceOnUse"><stop stop-color="#b3afe8"/><stop offset="1" stop-color="#7e78c1"/></linearGradient>
      </defs>
      {scenery}
      <g class="buddy-figure">
        <g class="buddy-leg leg-a"><rect x="153" y="179" width="18" height="24" rx="7" fill="#b9b7d8"/><rect x="145" y="199" width="30" height="13" rx="6.5" fill="url(#{prefix}-shell)"/></g>
        <g class="buddy-leg leg-b"><rect x="187" y="179" width="18" height="24" rx="7" fill="#b9b7d8"/><rect x="185" y="199" width="30" height="13" rx="6.5" fill="url(#{prefix}-shell)"/></g>
        <rect x="146" y="131" width="68" height="59" rx="19" fill="url(#{prefix}-body)"/>
        <rect x="161" y="144" width="38" height="25" rx="7" fill="#dbd8ee"/>
        <circle cx="187" cy="151" r="3" fill="#f0bd98"/>
        <g class="buddy-arm buddy-arm-left"><circle cx="143" cy="143" r="10" fill="#aaa6d7"/><rect x="126" y="143" width="18" height="33" rx="9" transform="rotate(17 135 153)" fill="url(#{prefix}-shell)"/><circle cx="129" cy="174" r="10" fill="#f2f1f8"/></g>
        <g class="buddy-arm buddy-arm-right"><circle cx="217" cy="143" r="10" fill="#aaa6d7"/><rect x="216" y="143" width="18" height="33" rx="9" transform="rotate(-17 225 153)" fill="url(#{prefix}-shell)"/><circle cx="231" cy="174" r="10" fill="#f2f1f8"/></g>
        <g class="buddy-head">
          <path d="M180 48V32" stroke="#aaa5d6" stroke-width="5" stroke-linecap="round"/>
          <rect x="167" y="28" width="10" height="20" rx="3" transform="rotate(-14 172 38)" fill="#aaa1d9"/>
          <rect x="182" y="21" width="11" height="26" rx="3" transform="rotate(12 188 34)" fill="#f3bf9d"/>
          <rect x="126" y="48" width="108" height="80" rx="25" fill="url(#{prefix}-shell)"/>
          <rect x="133" y="61" width="93" height="59" rx="15" fill="#33374e"/>
          <path d="M145 65h66" stroke="#555a77" stroke-width="2" opacity=".5"/>
          <g class="buddy-eyes"><rect x="155" y="78" width="8" height="17" rx="3" fill="#f2efff"/><rect x="196" y="78" width="8" height="17" rx="3" fill="#f2efff"/></g>
          <path d="M172 103q8 8 16 0" stroke="#e9e5fc" stroke-width="3" stroke-linecap="round"/>
          <ellipse cx="149" cy="101" rx="5" ry="2.5" fill="#e2a7a5"/><ellipse cx="211" cy="101" rx="5" ry="2.5" fill="#e2a7a5"/>
        </g>
        {prop}
      </g>
    </svg>'''
