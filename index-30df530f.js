var Oa = Object.defineProperty
var Ea = (i, t, e) =>
  t in i ? Oa(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : (i[t] = e)
var C = (i, t, e) => (Ea(i, typeof t != 'symbol' ? t + '' : t, e), e)
;(function () {
  const t = document.createElement('link').relList
  if (t && t.supports && t.supports('modulepreload')) return
  for (const n of document.querySelectorAll('link[rel="modulepreload"]')) s(n)
  new MutationObserver(n => {
    for (const o of n)
      if (o.type === 'childList')
        for (const a of o.addedNodes) a.tagName === 'LINK' && a.rel === 'modulepreload' && s(a)
  }).observe(document, { childList: !0, subtree: !0 })
  function e(n) {
    const o = {}
    return (
      n.integrity && (o.integrity = n.integrity),
      n.referrerPolicy && (o.referrerPolicy = n.referrerPolicy),
      n.crossOrigin === 'use-credentials'
        ? (o.credentials = 'include')
        : n.crossOrigin === 'anonymous'
        ? (o.credentials = 'omit')
        : (o.credentials = 'same-origin'),
      o
    )
  }
  function s(n) {
    if (n.ep) return
    n.ep = !0
    const o = e(n)
    fetch(n.href, o)
  }
})()
class ws extends Error {
  constructor(t, e, s) {
    const n = t.status || t.status === 0 ? t.status : '',
      o = t.statusText || '',
      a = `${n} ${o}`.trim(),
      r = a ? `status code ${a}` : 'an unknown error'
    super(`Request failed with ${r}`),
      Object.defineProperty(this, 'response', {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      Object.defineProperty(this, 'request', {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      Object.defineProperty(this, 'options', {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      (this.name = 'HTTPError'),
      (this.response = t),
      (this.request = e),
      (this.options = s)
  }
}
class Gn extends Error {
  constructor(t) {
    super('Request timed out'),
      Object.defineProperty(this, 'request', {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      (this.name = 'TimeoutError'),
      (this.request = t)
  }
}
const qe = i => i !== null && typeof i == 'object',
  Ee = (...i) => {
    for (const t of i)
      if ((!qe(t) || Array.isArray(t)) && typeof t < 'u')
        throw new TypeError('The `options` argument must be an object')
    return ns({}, ...i)
  },
  Jn = (i = {}, t = {}) => {
    const e = new globalThis.Headers(i),
      s = t instanceof globalThis.Headers,
      n = new globalThis.Headers(t)
    for (const [o, a] of n.entries()) (s && a === 'undefined') || a === void 0 ? e.delete(o) : e.set(o, a)
    return e
  },
  ns = (...i) => {
    let t = {},
      e = {}
    for (const s of i)
      if (Array.isArray(s)) Array.isArray(t) || (t = []), (t = [...t, ...s])
      else if (qe(s)) {
        for (let [n, o] of Object.entries(s)) qe(o) && n in t && (o = ns(t[n], o)), (t = { ...t, [n]: o })
        qe(s.headers) && ((e = Jn(e, s.headers)), (t.headers = e))
      }
    return t
  },
  Ra = (() => {
    let i = !1,
      t = !1
    return (
      typeof globalThis.ReadableStream == 'function' &&
        (t = new globalThis.Request('https://a.com', {
          body: new globalThis.ReadableStream(),
          method: 'POST',
          get duplex() {
            return (i = !0), 'half'
          },
        }).headers.has('Content-Type')),
      i && !t
    )
  })(),
  Ia = typeof globalThis.AbortController == 'function',
  Fa = typeof globalThis.ReadableStream == 'function',
  za = typeof globalThis.FormData == 'function',
  Zn = ['get', 'post', 'put', 'patch', 'head', 'delete'],
  Ba = {
    json: 'application/json',
    text: 'text/*',
    formData: 'multipart/form-data',
    arrayBuffer: '*/*',
    blob: '*/*',
  },
  wi = 2147483647,
  Qn = Symbol('stop'),
  Ha = i => (Zn.includes(i) ? i.toUpperCase() : i),
  Na = ['get', 'put', 'head', 'delete', 'options', 'trace'],
  Wa = [408, 413, 429, 500, 502, 503, 504],
  to = [413, 429, 503],
  Ms = {
    limit: 2,
    methods: Na,
    statusCodes: Wa,
    afterStatusCodes: to,
    maxRetryAfter: Number.POSITIVE_INFINITY,
    backoffLimit: Number.POSITIVE_INFINITY,
  },
  Va = (i = {}) => {
    if (typeof i == 'number') return { ...Ms, limit: i }
    if (i.methods && !Array.isArray(i.methods)) throw new Error('retry.methods must be an array')
    if (i.statusCodes && !Array.isArray(i.statusCodes)) throw new Error('retry.statusCodes must be an array')
    return { ...Ms, ...i, afterStatusCodes: to }
  }
async function $a(i, t, e) {
  return new Promise((s, n) => {
    const o = setTimeout(() => {
      t && t.abort(), n(new Gn(i))
    }, e.timeout)
    e.fetch(i)
      .then(s)
      .catch(n)
      .then(() => {
        clearTimeout(o)
      })
  })
}
const ja = Boolean(globalThis.DOMException)
function ks(i) {
  if (ja)
    return new DOMException((i == null ? void 0 : i.reason) ?? 'The operation was aborted.', 'AbortError')
  const t = new Error((i == null ? void 0 : i.reason) ?? 'The operation was aborted.')
  return (t.name = 'AbortError'), t
}
async function Ua(i, { signal: t }) {
  return new Promise((e, s) => {
    if (t) {
      if (t.aborted) {
        s(ks(t))
        return
      }
      t.addEventListener('abort', n, { once: !0 })
    }
    function n() {
      s(ks(t)), clearTimeout(o)
    }
    const o = setTimeout(() => {
      t == null || t.removeEventListener('abort', n), e()
    }, i)
  })
}
class ni {
  static create(t, e) {
    const s = new ni(t, e),
      n = async () => {
        if (s._options.timeout > wi)
          throw new RangeError(`The \`timeout\` option cannot be greater than ${wi}`)
        await Promise.resolve()
        let r = await s._fetch()
        for (const l of s._options.hooks.afterResponse) {
          const c = await l(s.request, s._options, s._decorateResponse(r.clone()))
          c instanceof globalThis.Response && (r = c)
        }
        if ((s._decorateResponse(r), !r.ok && s._options.throwHttpErrors)) {
          let l = new ws(r, s.request, s._options)
          for (const c of s._options.hooks.beforeError) l = await c(l)
          throw l
        }
        if (s._options.onDownloadProgress) {
          if (typeof s._options.onDownloadProgress != 'function')
            throw new TypeError('The `onDownloadProgress` option must be a function')
          if (!Fa)
            throw new Error('Streams are not supported in your environment. `ReadableStream` is missing.')
          return s._stream(r.clone(), s._options.onDownloadProgress)
        }
        return r
      },
      a = s._options.retry.methods.includes(s.request.method.toLowerCase()) ? s._retry(n) : n()
    for (const [r, l] of Object.entries(Ba))
      a[r] = async () => {
        s.request.headers.set('accept', s.request.headers.get('accept') || l)
        const h = (await a).clone()
        if (r === 'json') {
          if (h.status === 204 || (await h.clone().arrayBuffer()).byteLength === 0) return ''
          if (e.parseJson) return e.parseJson(await h.text())
        }
        return h[r]()
      }
    return a
  }
  constructor(t, e = {}) {
    if (
      (Object.defineProperty(this, 'request', {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      Object.defineProperty(this, 'abortController', {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      Object.defineProperty(this, '_retryCount', {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: 0,
      }),
      Object.defineProperty(this, '_input', {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      Object.defineProperty(this, '_options', {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      (this._input = t),
      (this._options = {
        credentials: this._input.credentials || 'same-origin',
        ...e,
        headers: Jn(this._input.headers, e.headers),
        hooks: ns({ beforeRequest: [], beforeRetry: [], beforeError: [], afterResponse: [] }, e.hooks),
        method: Ha(e.method ?? this._input.method),
        prefixUrl: String(e.prefixUrl || ''),
        retry: Va(e.retry),
        throwHttpErrors: e.throwHttpErrors !== !1,
        timeout: typeof e.timeout > 'u' ? 1e4 : e.timeout,
        fetch: e.fetch ?? globalThis.fetch.bind(globalThis),
      }),
      typeof this._input != 'string' &&
        !(this._input instanceof URL || this._input instanceof globalThis.Request))
    )
      throw new TypeError('`input` must be a string, URL, or Request')
    if (this._options.prefixUrl && typeof this._input == 'string') {
      if (this._input.startsWith('/'))
        throw new Error('`input` must not begin with a slash when using `prefixUrl`')
      this._options.prefixUrl.endsWith('/') || (this._options.prefixUrl += '/'),
        (this._input = this._options.prefixUrl + this._input)
    }
    if (Ia) {
      if (((this.abortController = new globalThis.AbortController()), this._options.signal)) {
        const s = this._options.signal
        this._options.signal.addEventListener('abort', () => {
          this.abortController.abort(s.reason)
        })
      }
      this._options.signal = this.abortController.signal
    }
    if (
      (Ra && (this._options.duplex = 'half'),
      (this.request = new globalThis.Request(this._input, this._options)),
      this._options.searchParams)
    ) {
      const n =
          '?' +
          (typeof this._options.searchParams == 'string'
            ? this._options.searchParams.replace(/^\?/, '')
            : new URLSearchParams(this._options.searchParams).toString()),
        o = this.request.url.replace(/(?:\?.*?)?(?=#|$)/, n)
      ;((za && this._options.body instanceof globalThis.FormData) ||
        this._options.body instanceof URLSearchParams) &&
        !(this._options.headers && this._options.headers['content-type']) &&
        this.request.headers.delete('content-type'),
        (this.request = new globalThis.Request(new globalThis.Request(o, { ...this.request }), this._options))
    }
    this._options.json !== void 0 &&
      ((this._options.body = JSON.stringify(this._options.json)),
      this.request.headers.set(
        'content-type',
        this._options.headers.get('content-type') ?? 'application/json'
      ),
      (this.request = new globalThis.Request(this.request, { body: this._options.body })))
  }
  _calculateRetryDelay(t) {
    if ((this._retryCount++, this._retryCount < this._options.retry.limit && !(t instanceof Gn))) {
      if (t instanceof ws) {
        if (!this._options.retry.statusCodes.includes(t.response.status)) return 0
        const s = t.response.headers.get('Retry-After')
        if (s && this._options.retry.afterStatusCodes.includes(t.response.status)) {
          let n = Number(s)
          return (
            Number.isNaN(n) ? (n = Date.parse(s) - Date.now()) : (n *= 1e3),
            typeof this._options.retry.maxRetryAfter < 'u' && n > this._options.retry.maxRetryAfter ? 0 : n
          )
        }
        if (t.response.status === 413) return 0
      }
      const e = 0.3
      return Math.min(this._options.retry.backoffLimit, e * 2 ** (this._retryCount - 1) * 1e3)
    }
    return 0
  }
  _decorateResponse(t) {
    return this._options.parseJson && (t.json = async () => this._options.parseJson(await t.text())), t
  }
  async _retry(t) {
    try {
      return await t()
    } catch (e) {
      const s = Math.min(this._calculateRetryDelay(e), wi)
      if (s !== 0 && this._retryCount > 0) {
        await Ua(s, { signal: this._options.signal })
        for (const n of this._options.hooks.beforeRetry)
          if (
            (await n({
              request: this.request,
              options: this._options,
              error: e,
              retryCount: this._retryCount,
            })) === Qn
          )
            return
        return this._retry(t)
      }
      throw e
    }
  }
  async _fetch() {
    for (const t of this._options.hooks.beforeRequest) {
      const e = await t(this.request, this._options)
      if (e instanceof Request) {
        this.request = e
        break
      }
      if (e instanceof Response) return e
    }
    return this._options.timeout === !1
      ? this._options.fetch(this.request.clone())
      : $a(this.request.clone(), this.abortController, this._options)
  }
  _stream(t, e) {
    const s = Number(t.headers.get('content-length')) || 0
    let n = 0
    return t.status === 204
      ? (e && e({ percent: 1, totalBytes: s, transferredBytes: n }, new Uint8Array()),
        new globalThis.Response(null, { status: t.status, statusText: t.statusText, headers: t.headers }))
      : new globalThis.Response(
          new globalThis.ReadableStream({
            async start(o) {
              const a = t.body.getReader()
              e && e({ percent: 0, transferredBytes: 0, totalBytes: s }, new Uint8Array())
              async function r() {
                const { done: l, value: c } = await a.read()
                if (l) {
                  o.close()
                  return
                }
                if (e) {
                  n += c.byteLength
                  const h = s === 0 ? 0 : n / s
                  e({ percent: h, transferredBytes: n, totalBytes: s }, c)
                }
                o.enqueue(c), await r()
              }
              await r()
            },
          }),
          { status: t.status, statusText: t.statusText, headers: t.headers }
        )
  }
}
/*! MIT License © Sindre Sorhus */ const Hi = i => {
    const t = (e, s) => ni.create(e, Ee(i, s))
    for (const e of Zn) t[e] = (s, n) => ni.create(s, Ee(i, n, { method: e }))
    return (t.create = e => Hi(Ee(e))), (t.extend = e => Hi(Ee(i, e))), (t.stop = Qn), t
  },
  Ya = Hi(),
  Ni = Ya,
  qa = 'https://ajax.test-danit.com/api/v2/cards/',
  Wi = [
    { department: 'Cardiology', doctor: ['Dr. Jacob Jones', 'Dr. Theresa Webb', 'Dr. Arlene McCoy'] },
    { department: 'Dentistry', doctor: ['Dr. Robert Fox', 'Dr. Esther Howard', 'Dr. Marshall Cook'] },
    { department: 'Therapy', doctor: ['Dr. Stephanie Cook', 'Dr. Marion James', 'Dr. Teresa Holland'] },
  ],
  Jt = async ({ url: i, method: t, body: e }) => {
    const s = qa,
      o = { Authorization: `Bearer ${localStorage.getItem('token')}` },
      a = { method: 'POST', prefixUrl: s, json: e },
      r = { method: t, prefixUrl: s, json: e, headers: o }
    try {
      return await (t === 'LOGIN' ? Ni(i, a).text() : Ni(i, r).json())
    } catch (l) {
      console.log(l.message)
    }
  },
  D = document.querySelector.bind(document),
  Wt = document.querySelectorAll.bind(document),
  Tt = (i, t, e) => {
    const s = document.createElement(i)
    return t && s.classList.add(t), e && (s.textContent = e), s
  },
  k = i => {
    const { el: t, css: e, text: s, src: n, alt: o, title: a, href: r } = i,
      l = t || 'div',
      c = document.createElement(l)
    return (
      e && c.classList.add(e),
      s && (c.textContent = s),
      n && (c.src = n) && (c.alt = o),
      r && (c.href = r),
      a && (c.title = a),
      c
    )
  },
  Mi = i => {
    const { css: t, type: e, name: s, placeholder: n, value: o, title: a } = i,
      r = document.createElement('input')
    return (
      t && r.classList.add(t),
      e && (r.type = e),
      s && (r.name = s),
      o && (r.value = o),
      a && (r.title = a),
      n && (r.placeholder = n),
      r
    )
  },
  Bt = (i, t) => {
    const e = document.createElement('button')
    return (e.type = 'submit'), (e.className = 'button'), i && e.classList.add(i), t && (e.textContent = t), e
  },
  Xa = (i, t) => (Math.round(Math.random()) === 0 ? i : t),
  Ka = './images/modalImg-42ffe832.svg',
  Ga = async i => {
    i.preventDefault()
    const t = new FormData(i.target),
      e = !!t.get('checkbox'),
      s = { email: t.get('text'), password: t.get('password') },
      n = await Jt({ url: 'login', method: 'LOGIN', body: s }),
      o = D('.login-error'),
      a = D('.email'),
      r = D('.password')
    if (!n) {
      ;(o.style.display = 'block'),
        (a.value = ''),
        (r.value = ''),
        setTimeout(() => (o.style.display = 'none'), 4500)
      return
    }
    n &&
      e &&
      (window.localStorage.setItem('token', n),
      window.localStorage.setItem('userData', JSON.stringify(s)),
      await Xn()),
      n && !e && (window.localStorage.setItem('token', n), await Xn())
  },
  Ja = './images/google-fba501cd.svg',
  Za = './images/facebook-7c5a5133.svg',
  qt = JSON.parse(localStorage.getItem('userData')),
  Qa = {
    googleIcon: Ja,
    facebookIcon: Za,
    toggleCheckbox: Mi({ type: 'checkbox', name: 'checkbox' }),
    loginButton: Bt('log-in', 'Log In'),
    emailInput: Mi({
      css: 'email',
      type: 'text',
      name: 'text',
      placeholder: 'Email',
      value: (qt == null ? void 0 : qt.email) || '',
    }),
    passwordInput: Mi({
      css: 'password',
      type: 'password',
      name: 'password',
      placeholder: 'Password',
      value: (qt == null ? void 0 : qt.password) || '',
    }),
  },
  eo = k({ css: 'login-form' }),
  {
    googleIcon: tr,
    facebookIcon: er,
    toggleCheckbox: ir,
    passwordInput: sr,
    emailInput: nr,
    loginButton: or,
  } = Qa,
  io = k({ css: 'form-head' }),
  os = k({ el: 'form', css: 'form' }),
  ar = k({ css: 'form-head__decor', text: 'Or' }),
  so = k({ css: 'form-head__actions' }),
  rr = [k({ css: 'form-head__title', text: 'Welcome' }), k({ css: 'form-head__slogan', text: 'Log in with' })]
so.innerHTML = `
        <div><img src="${tr}" alt='Google'>Google</div>
        <div><img src="${er}" alt='Facebook'>Facebook</div>`
io.append(...rr, so, ar)
const no = k({ el: 'label', css: 'switch' }),
  lr = k({ el: 'i', css: 'slider' }),
  cr = k({ el: 'span', text: 'Remember me' }),
  hr = k({ el: 'span', css: 'login-error', text: 'The email or password is incorrect.' })
no.append(ir, lr, cr)
os.addEventListener('submit', Ga)
os.append(nr, sr, no, hr, or)
eo.append(io, os)
const dr = './images/hero-23bbff8a.svg',
  oo = k({ css: 'registration' }),
  ao = k({ el: 'div', css: 'login-image' }),
  ur = k({ el: 'img', src: dr, alt: 'Registration Image' })
ao.append(ur)
oo.append(eo, ao)
const fr = () => {
    const i = D('.header-login'),
      t = D('.login-form')
    i.addEventListener('click', () => t.classList.add('fade-in'))
  },
  pr = './images/kit-aab28d6c.svg',
  gr = './images/patient-7ab89289.svg',
  mr = './images/closeAppoint-24bc3cb7.svg',
  br = './images/doctors-c02e3e26.svg',
  _r = Wi.reduce((i, t) => i.concat(t.doctor), []),
  xr = () => {
    const i = pi(),
      t = D('.appointments'),
      e = D('.patients'),
      s = D('.close-appointments'),
      n = i.map(l => l.status),
      o = i.map(l => l.status),
      [a] = [n.filter(l => l === 'Opened')],
      [r] = [o.filter(l => l === 'Closed')]
    ;(t.innerHTML = i.length), (e.innerHTML = a.length), (s.innerHTML = r.length)
  }
let vt = []
const ro = i => {
    vt.unshift(i), gi()
  },
  yr = i => {
    ;(vt = vt.filter(t => t.id !== i)), gi()
  },
  vr = i => {
    ;(vt.find(t => t.id === i).status = 'Closed'), gi()
  },
  wr = i => {
    const t = vt.filter(e => e.id !== i.id)
    t.unshift(i), (vt = t), gi()
  },
  pi = () => vt,
  gi = () => {
    xr()
    const i = D('.table-list')
    ;(i.innerHTML = ''),
      vt.length
        ? vt.forEach(t => {
            new vs(t).addNewAppointment()
          })
        : va('.table-list')
  },
  Mr = pi(),
  ki = Mr.length,
  kr = _r.length,
  Sr = [
    { text: 'All Appointments', className: 'appointments', path: pr, value: ki || '0' },
    { text: 'Closed Appointments', className: 'close-appointments', path: mr, value: ki || '0' },
    { text: 'Patients', className: 'patients', path: gr, value: ki || '0' },
    { text: 'Our Doctors', className: 'doctors', path: br, value: kr },
  ],
  Cr = ['Name', 'Department', 'Doctor', 'Tel', 'Priority', 'Status', 'Actions'],
  Pr = ['High', 'Normal', 'Low'],
  Dr = ['Cardiology', 'Dentistry', 'Therapy'],
  Tr = ['Opened', 'Closed'],
  lo = Tt('div', 'dashboard-table'),
  Ar = Tt('div', 'table-title', 'Appointment Activity'),
  co = Tt('div', 'table-head'),
  Lr = Tt('div', 'table-list'),
  Or = Cr.map(i => Tt('div', `${i.toLowerCase()}`, `${i}`))
co.append(...Or)
lo.append(Ar, co, Lr)
const ho = k({ css: 'dashboard-header' }),
  Er = Sr.map(({ text: i, path: t, value: e, className: s }) => {
    const n = k({ css: 'header-card' }),
      o = k({ css: 'card-image-wrap' }),
      a = k({ el: 'img', css: 'card-image', src: t, alt: `${i} icon` }),
      r = k({ css: 'card-content' }),
      l = k({ css: 'card-title', text: i }),
      c = k({ el: 'span', css: s, text: e })
    return o.append(a), r.append(l, c), n.append(o, r), n
  })
ho.append(...Er)
const uo = k({ css: 'dashboard-actions' }),
  Rr = () => {
    const i = k({ css: 'dashboard-table-wrapp' }),
      t = k({ css: 'dashboard-table-wrapp' }),
      e = k({ el: 'canvas', css: 'donut' }),
      s = k({ el: 'canvas', css: 'donut' })
    e.setAttribute('id', 'myChart-1'),
      s.setAttribute('id', 'myChart-2'),
      i.append(e),
      t.append(s),
      uo.append(i, t)
  },
  fo = k({ css: 'dashboard' }),
  po = k({ css: 'dashboard-content' })
po.append(lo, uo)
fo.append(ho, po)
/*!
 * @kurkle/color v0.3.2
 * https://github.com/kurkle/color#readme
 * (c) 2023 Jukka Kurkela
 * Released under the MIT License
 */ function Te(i) {
  return (i + 0.5) | 0
}
const wt = (i, t, e) => Math.max(Math.min(i, e), t)
function de(i) {
  return wt(Te(i * 2.55), 0, 255)
}
function Ct(i) {
  return wt(Te(i * 255), 0, 255)
}
function bt(i) {
  return wt(Te(i / 2.55) / 100, 0, 1)
}
function Ss(i) {
  return wt(Te(i * 100), 0, 100)
}
const nt = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    A: 10,
    B: 11,
    C: 12,
    D: 13,
    E: 14,
    F: 15,
    a: 10,
    b: 11,
    c: 12,
    d: 13,
    e: 14,
    f: 15,
  },
  Vi = [...'0123456789ABCDEF'],
  Ir = i => Vi[i & 15],
  Fr = i => Vi[(i & 240) >> 4] + Vi[i & 15],
  Re = i => (i & 240) >> 4 === (i & 15),
  zr = i => Re(i.r) && Re(i.g) && Re(i.b) && Re(i.a)
function Br(i) {
  var t = i.length,
    e
  return (
    i[0] === '#' &&
      (t === 4 || t === 5
        ? (e = {
            r: 255 & (nt[i[1]] * 17),
            g: 255 & (nt[i[2]] * 17),
            b: 255 & (nt[i[3]] * 17),
            a: t === 5 ? nt[i[4]] * 17 : 255,
          })
        : (t === 7 || t === 9) &&
          (e = {
            r: (nt[i[1]] << 4) | nt[i[2]],
            g: (nt[i[3]] << 4) | nt[i[4]],
            b: (nt[i[5]] << 4) | nt[i[6]],
            a: t === 9 ? (nt[i[7]] << 4) | nt[i[8]] : 255,
          })),
    e
  )
}
const Hr = (i, t) => (i < 255 ? t(i) : '')
function Nr(i) {
  var t = zr(i) ? Ir : Fr
  return i ? '#' + t(i.r) + t(i.g) + t(i.b) + Hr(i.a, t) : void 0
}
const Wr =
  /^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/
function go(i, t, e) {
  const s = t * Math.min(e, 1 - e),
    n = (o, a = (o + i / 30) % 12) => e - s * Math.max(Math.min(a - 3, 9 - a, 1), -1)
  return [n(0), n(8), n(4)]
}
function Vr(i, t, e) {
  const s = (n, o = (n + i / 60) % 6) => e - e * t * Math.max(Math.min(o, 4 - o, 1), 0)
  return [s(5), s(3), s(1)]
}
function $r(i, t, e) {
  const s = go(i, 1, 0.5)
  let n
  for (t + e > 1 && ((n = 1 / (t + e)), (t *= n), (e *= n)), n = 0; n < 3; n++)
    (s[n] *= 1 - t - e), (s[n] += t)
  return s
}
function jr(i, t, e, s, n) {
  return i === n ? (t - e) / s + (t < e ? 6 : 0) : t === n ? (e - i) / s + 2 : (i - t) / s + 4
}
function as(i) {
  const e = i.r / 255,
    s = i.g / 255,
    n = i.b / 255,
    o = Math.max(e, s, n),
    a = Math.min(e, s, n),
    r = (o + a) / 2
  let l, c, h
  return (
    o !== a &&
      ((h = o - a),
      (c = r > 0.5 ? h / (2 - o - a) : h / (o + a)),
      (l = jr(e, s, n, h, o)),
      (l = l * 60 + 0.5)),
    [l | 0, c || 0, r]
  )
}
function rs(i, t, e, s) {
  return (Array.isArray(t) ? i(t[0], t[1], t[2]) : i(t, e, s)).map(Ct)
}
function ls(i, t, e) {
  return rs(go, i, t, e)
}
function Ur(i, t, e) {
  return rs($r, i, t, e)
}
function Yr(i, t, e) {
  return rs(Vr, i, t, e)
}
function mo(i) {
  return ((i % 360) + 360) % 360
}
function qr(i) {
  const t = Wr.exec(i)
  let e = 255,
    s
  if (!t) return
  t[5] !== s && (e = t[6] ? de(+t[5]) : Ct(+t[5]))
  const n = mo(+t[2]),
    o = +t[3] / 100,
    a = +t[4] / 100
  return (
    t[1] === 'hwb' ? (s = Ur(n, o, a)) : t[1] === 'hsv' ? (s = Yr(n, o, a)) : (s = ls(n, o, a)),
    { r: s[0], g: s[1], b: s[2], a: e }
  )
}
function Xr(i, t) {
  var e = as(i)
  ;(e[0] = mo(e[0] + t)), (e = ls(e)), (i.r = e[0]), (i.g = e[1]), (i.b = e[2])
}
function Kr(i) {
  if (!i) return
  const t = as(i),
    e = t[0],
    s = Ss(t[1]),
    n = Ss(t[2])
  return i.a < 255 ? `hsla(${e}, ${s}%, ${n}%, ${bt(i.a)})` : `hsl(${e}, ${s}%, ${n}%)`
}
const Cs = {
    x: 'dark',
    Z: 'light',
    Y: 're',
    X: 'blu',
    W: 'gr',
    V: 'medium',
    U: 'slate',
    A: 'ee',
    T: 'ol',
    S: 'or',
    B: 'ra',
    C: 'lateg',
    D: 'ights',
    R: 'in',
    Q: 'turquois',
    E: 'hi',
    P: 'ro',
    O: 'al',
    N: 'le',
    M: 'de',
    L: 'yello',
    F: 'en',
    K: 'ch',
    G: 'arks',
    H: 'ea',
    I: 'ightg',
    J: 'wh',
  },
  Ps = {
    OiceXe: 'f0f8ff',
    antiquewEte: 'faebd7',
    aqua: 'ffff',
    aquamarRe: '7fffd4',
    azuY: 'f0ffff',
    beige: 'f5f5dc',
    bisque: 'ffe4c4',
    black: '0',
    blanKedOmond: 'ffebcd',
    Xe: 'ff',
    XeviTet: '8a2be2',
    bPwn: 'a52a2a',
    burlywood: 'deb887',
    caMtXe: '5f9ea0',
    KartYuse: '7fff00',
    KocTate: 'd2691e',
    cSO: 'ff7f50',
    cSnflowerXe: '6495ed',
    cSnsilk: 'fff8dc',
    crimson: 'dc143c',
    cyan: 'ffff',
    xXe: '8b',
    xcyan: '8b8b',
    xgTMnPd: 'b8860b',
    xWay: 'a9a9a9',
    xgYF: '6400',
    xgYy: 'a9a9a9',
    xkhaki: 'bdb76b',
    xmagFta: '8b008b',
    xTivegYF: '556b2f',
    xSange: 'ff8c00',
    xScEd: '9932cc',
    xYd: '8b0000',
    xsOmon: 'e9967a',
    xsHgYF: '8fbc8f',
    xUXe: '483d8b',
    xUWay: '2f4f4f',
    xUgYy: '2f4f4f',
    xQe: 'ced1',
    xviTet: '9400d3',
    dAppRk: 'ff1493',
    dApskyXe: 'bfff',
    dimWay: '696969',
    dimgYy: '696969',
    dodgerXe: '1e90ff',
    fiYbrick: 'b22222',
    flSOwEte: 'fffaf0',
    foYstWAn: '228b22',
    fuKsia: 'ff00ff',
    gaRsbSo: 'dcdcdc',
    ghostwEte: 'f8f8ff',
    gTd: 'ffd700',
    gTMnPd: 'daa520',
    Way: '808080',
    gYF: '8000',
    gYFLw: 'adff2f',
    gYy: '808080',
    honeyMw: 'f0fff0',
    hotpRk: 'ff69b4',
    RdianYd: 'cd5c5c',
    Rdigo: '4b0082',
    ivSy: 'fffff0',
    khaki: 'f0e68c',
    lavFMr: 'e6e6fa',
    lavFMrXsh: 'fff0f5',
    lawngYF: '7cfc00',
    NmoncEffon: 'fffacd',
    ZXe: 'add8e6',
    ZcSO: 'f08080',
    Zcyan: 'e0ffff',
    ZgTMnPdLw: 'fafad2',
    ZWay: 'd3d3d3',
    ZgYF: '90ee90',
    ZgYy: 'd3d3d3',
    ZpRk: 'ffb6c1',
    ZsOmon: 'ffa07a',
    ZsHgYF: '20b2aa',
    ZskyXe: '87cefa',
    ZUWay: '778899',
    ZUgYy: '778899',
    ZstAlXe: 'b0c4de',
    ZLw: 'ffffe0',
    lime: 'ff00',
    limegYF: '32cd32',
    lRF: 'faf0e6',
    magFta: 'ff00ff',
    maPon: '800000',
    VaquamarRe: '66cdaa',
    VXe: 'cd',
    VScEd: 'ba55d3',
    VpurpN: '9370db',
    VsHgYF: '3cb371',
    VUXe: '7b68ee',
    VsprRggYF: 'fa9a',
    VQe: '48d1cc',
    VviTetYd: 'c71585',
    midnightXe: '191970',
    mRtcYam: 'f5fffa',
    mistyPse: 'ffe4e1',
    moccasR: 'ffe4b5',
    navajowEte: 'ffdead',
    navy: '80',
    Tdlace: 'fdf5e6',
    Tive: '808000',
    TivedBb: '6b8e23',
    Sange: 'ffa500',
    SangeYd: 'ff4500',
    ScEd: 'da70d6',
    pOegTMnPd: 'eee8aa',
    pOegYF: '98fb98',
    pOeQe: 'afeeee',
    pOeviTetYd: 'db7093',
    papayawEp: 'ffefd5',
    pHKpuff: 'ffdab9',
    peru: 'cd853f',
    pRk: 'ffc0cb',
    plum: 'dda0dd',
    powMrXe: 'b0e0e6',
    purpN: '800080',
    YbeccapurpN: '663399',
    Yd: 'ff0000',
    Psybrown: 'bc8f8f',
    PyOXe: '4169e1',
    saddNbPwn: '8b4513',
    sOmon: 'fa8072',
    sandybPwn: 'f4a460',
    sHgYF: '2e8b57',
    sHshell: 'fff5ee',
    siFna: 'a0522d',
    silver: 'c0c0c0',
    skyXe: '87ceeb',
    UXe: '6a5acd',
    UWay: '708090',
    UgYy: '708090',
    snow: 'fffafa',
    sprRggYF: 'ff7f',
    stAlXe: '4682b4',
    tan: 'd2b48c',
    teO: '8080',
    tEstN: 'd8bfd8',
    tomato: 'ff6347',
    Qe: '40e0d0',
    viTet: 'ee82ee',
    JHt: 'f5deb3',
    wEte: 'ffffff',
    wEtesmoke: 'f5f5f5',
    Lw: 'ffff00',
    LwgYF: '9acd32',
  }
function Gr() {
  const i = {},
    t = Object.keys(Ps),
    e = Object.keys(Cs)
  let s, n, o, a, r
  for (s = 0; s < t.length; s++) {
    for (a = r = t[s], n = 0; n < e.length; n++) (o = e[n]), (r = r.replace(o, Cs[o]))
    ;(o = parseInt(Ps[a], 16)), (i[r] = [(o >> 16) & 255, (o >> 8) & 255, o & 255])
  }
  return i
}
let Ie
function Jr(i) {
  Ie || ((Ie = Gr()), (Ie.transparent = [0, 0, 0, 0]))
  const t = Ie[i.toLowerCase()]
  return t && { r: t[0], g: t[1], b: t[2], a: t.length === 4 ? t[3] : 255 }
}
const Zr =
  /^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/
function Qr(i) {
  const t = Zr.exec(i)
  let e = 255,
    s,
    n,
    o
  if (t) {
    if (t[7] !== s) {
      const a = +t[7]
      e = t[8] ? de(a) : wt(a * 255, 0, 255)
    }
    return (
      (s = +t[1]),
      (n = +t[3]),
      (o = +t[5]),
      (s = 255 & (t[2] ? de(s) : wt(s, 0, 255))),
      (n = 255 & (t[4] ? de(n) : wt(n, 0, 255))),
      (o = 255 & (t[6] ? de(o) : wt(o, 0, 255))),
      { r: s, g: n, b: o, a: e }
    )
  }
}
function tl(i) {
  return i && (i.a < 255 ? `rgba(${i.r}, ${i.g}, ${i.b}, ${bt(i.a)})` : `rgb(${i.r}, ${i.g}, ${i.b})`)
}
const Si = i => (i <= 0.0031308 ? i * 12.92 : Math.pow(i, 1 / 2.4) * 1.055 - 0.055),
  Xt = i => (i <= 0.04045 ? i / 12.92 : Math.pow((i + 0.055) / 1.055, 2.4))
function el(i, t, e) {
  const s = Xt(bt(i.r)),
    n = Xt(bt(i.g)),
    o = Xt(bt(i.b))
  return {
    r: Ct(Si(s + e * (Xt(bt(t.r)) - s))),
    g: Ct(Si(n + e * (Xt(bt(t.g)) - n))),
    b: Ct(Si(o + e * (Xt(bt(t.b)) - o))),
    a: i.a + e * (t.a - i.a),
  }
}
function Fe(i, t, e) {
  if (i) {
    let s = as(i)
    ;(s[t] = Math.max(0, Math.min(s[t] + s[t] * e, t === 0 ? 360 : 1))),
      (s = ls(s)),
      (i.r = s[0]),
      (i.g = s[1]),
      (i.b = s[2])
  }
}
function bo(i, t) {
  return i && Object.assign(t || {}, i)
}
function Ds(i) {
  var t = { r: 0, g: 0, b: 0, a: 255 }
  return (
    Array.isArray(i)
      ? i.length >= 3 && ((t = { r: i[0], g: i[1], b: i[2], a: 255 }), i.length > 3 && (t.a = Ct(i[3])))
      : ((t = bo(i, { r: 0, g: 0, b: 0, a: 1 })), (t.a = Ct(t.a))),
    t
  )
}
function il(i) {
  return i.charAt(0) === 'r' ? Qr(i) : qr(i)
}
class ve {
  constructor(t) {
    if (t instanceof ve) return t
    const e = typeof t
    let s
    e === 'object' ? (s = Ds(t)) : e === 'string' && (s = Br(t) || Jr(t) || il(t)),
      (this._rgb = s),
      (this._valid = !!s)
  }
  get valid() {
    return this._valid
  }
  get rgb() {
    var t = bo(this._rgb)
    return t && (t.a = bt(t.a)), t
  }
  set rgb(t) {
    this._rgb = Ds(t)
  }
  rgbString() {
    return this._valid ? tl(this._rgb) : void 0
  }
  hexString() {
    return this._valid ? Nr(this._rgb) : void 0
  }
  hslString() {
    return this._valid ? Kr(this._rgb) : void 0
  }
  mix(t, e) {
    if (t) {
      const s = this.rgb,
        n = t.rgb
      let o
      const a = e === o ? 0.5 : e,
        r = 2 * a - 1,
        l = s.a - n.a,
        c = ((r * l === -1 ? r : (r + l) / (1 + r * l)) + 1) / 2
      ;(o = 1 - c),
        (s.r = 255 & (c * s.r + o * n.r + 0.5)),
        (s.g = 255 & (c * s.g + o * n.g + 0.5)),
        (s.b = 255 & (c * s.b + o * n.b + 0.5)),
        (s.a = a * s.a + (1 - a) * n.a),
        (this.rgb = s)
    }
    return this
  }
  interpolate(t, e) {
    return t && (this._rgb = el(this._rgb, t._rgb, e)), this
  }
  clone() {
    return new ve(this.rgb)
  }
  alpha(t) {
    return (this._rgb.a = Ct(t)), this
  }
  clearer(t) {
    const e = this._rgb
    return (e.a *= 1 - t), this
  }
  greyscale() {
    const t = this._rgb,
      e = Te(t.r * 0.3 + t.g * 0.59 + t.b * 0.11)
    return (t.r = t.g = t.b = e), this
  }
  opaquer(t) {
    const e = this._rgb
    return (e.a *= 1 + t), this
  }
  negate() {
    const t = this._rgb
    return (t.r = 255 - t.r), (t.g = 255 - t.g), (t.b = 255 - t.b), this
  }
  lighten(t) {
    return Fe(this._rgb, 2, t), this
  }
  darken(t) {
    return Fe(this._rgb, 2, -t), this
  }
  saturate(t) {
    return Fe(this._rgb, 1, t), this
  }
  desaturate(t) {
    return Fe(this._rgb, 1, -t), this
  }
  rotate(t) {
    return Xr(this._rgb, t), this
  }
}
/*!
 * Chart.js v4.2.1
 * https://www.chartjs.org
 * (c) 2023 Chart.js Contributors
 * Released under the MIT License
 */ function pt() {}
const sl = (() => {
  let i = 0
  return () => i++
})()
function E(i) {
  return i === null || typeof i > 'u'
}
function B(i) {
  if (Array.isArray && Array.isArray(i)) return !0
  const t = Object.prototype.toString.call(i)
  return t.slice(0, 7) === '[object' && t.slice(-6) === 'Array]'
}
function O(i) {
  return i !== null && Object.prototype.toString.call(i) === '[object Object]'
}
function V(i) {
  return (typeof i == 'number' || i instanceof Number) && isFinite(+i)
}
function it(i, t) {
  return V(i) ? i : t
}
function T(i, t) {
  return typeof i > 'u' ? t : i
}
const nl = (i, t) => (typeof i == 'string' && i.endsWith('%') ? parseFloat(i) / 100 : +i / t),
  _o = (i, t) => (typeof i == 'string' && i.endsWith('%') ? (parseFloat(i) / 100) * t : +i)
function z(i, t, e) {
  if (i && typeof i.call == 'function') return i.apply(e, t)
}
function I(i, t, e, s) {
  let n, o, a
  if (B(i))
    if (((o = i.length), s)) for (n = o - 1; n >= 0; n--) t.call(e, i[n], n)
    else for (n = 0; n < o; n++) t.call(e, i[n], n)
  else if (O(i)) for (a = Object.keys(i), o = a.length, n = 0; n < o; n++) t.call(e, i[a[n]], a[n])
}
function oi(i, t) {
  let e, s, n, o
  if (!i || !t || i.length !== t.length) return !1
  for (e = 0, s = i.length; e < s; ++e)
    if (((n = i[e]), (o = t[e]), n.datasetIndex !== o.datasetIndex || n.index !== o.index)) return !1
  return !0
}
function ai(i) {
  if (B(i)) return i.map(ai)
  if (O(i)) {
    const t = Object.create(null),
      e = Object.keys(i),
      s = e.length
    let n = 0
    for (; n < s; ++n) t[e[n]] = ai(i[e[n]])
    return t
  }
  return i
}
function xo(i) {
  return ['__proto__', 'prototype', 'constructor'].indexOf(i) === -1
}
function ol(i, t, e, s) {
  if (!xo(i)) return
  const n = t[i],
    o = e[i]
  O(n) && O(o) ? we(n, o, s) : (t[i] = ai(o))
}
function we(i, t, e) {
  const s = B(t) ? t : [t],
    n = s.length
  if (!O(i)) return i
  e = e || {}
  const o = e.merger || ol
  let a
  for (let r = 0; r < n; ++r) {
    if (((a = s[r]), !O(a))) continue
    const l = Object.keys(a)
    for (let c = 0, h = l.length; c < h; ++c) o(l[c], i, a, e)
  }
  return i
}
function me(i, t) {
  return we(i, t, { merger: al })
}
function al(i, t, e) {
  if (!xo(i)) return
  const s = t[i],
    n = e[i]
  O(s) && O(n) ? me(s, n) : Object.prototype.hasOwnProperty.call(t, i) || (t[i] = ai(n))
}
const Ts = { '': i => i, x: i => i.x, y: i => i.y }
function rl(i) {
  const t = i.split('.'),
    e = []
  let s = ''
  for (const n of t) (s += n), s.endsWith('\\') ? (s = s.slice(0, -1) + '.') : (e.push(s), (s = ''))
  return e
}
function ll(i) {
  const t = rl(i)
  return e => {
    for (const s of t) {
      if (s === '') break
      e = e && e[s]
    }
    return e
  }
}
function Pt(i, t) {
  return (Ts[t] || (Ts[t] = ll(t)))(i)
}
function cs(i) {
  return i.charAt(0).toUpperCase() + i.slice(1)
}
const ot = i => typeof i < 'u',
  Dt = i => typeof i == 'function',
  As = (i, t) => {
    if (i.size !== t.size) return !1
    for (const e of i) if (!t.has(e)) return !1
    return !0
  }
function cl(i) {
  return i.type === 'mouseup' || i.type === 'click' || i.type === 'contextmenu'
}
const W = Math.PI,
  H = 2 * W,
  hl = H + W,
  ri = Number.POSITIVE_INFINITY,
  dl = W / 180,
  $ = W / 2,
  Lt = W / 4,
  Ls = (W * 2) / 3,
  Mt = Math.log10,
  ft = Math.sign
function be(i, t, e) {
  return Math.abs(i - t) < e
}
function Os(i) {
  const t = Math.round(i)
  i = be(i, t, i / 1e3) ? t : i
  const e = Math.pow(10, Math.floor(Mt(i))),
    s = i / e
  return (s <= 1 ? 1 : s <= 2 ? 2 : s <= 5 ? 5 : 10) * e
}
function ul(i) {
  const t = [],
    e = Math.sqrt(i)
  let s
  for (s = 1; s < e; s++) i % s === 0 && (t.push(s), t.push(i / s))
  return e === (e | 0) && t.push(e), t.sort((n, o) => n - o).pop(), t
}
function Zt(i) {
  return !isNaN(parseFloat(i)) && isFinite(i)
}
function fl(i, t) {
  const e = Math.round(i)
  return e - t <= i && e + t >= i
}
function yo(i, t, e) {
  let s, n, o
  for (s = 0, n = i.length; s < n; s++)
    (o = i[s][e]), isNaN(o) || ((t.min = Math.min(t.min, o)), (t.max = Math.max(t.max, o)))
}
function rt(i) {
  return i * (W / 180)
}
function hs(i) {
  return i * (180 / W)
}
function Es(i) {
  if (!V(i)) return
  let t = 1,
    e = 0
  for (; Math.round(i * t) / t !== i; ) (t *= 10), e++
  return e
}
function vo(i, t) {
  const e = t.x - i.x,
    s = t.y - i.y,
    n = Math.sqrt(e * e + s * s)
  let o = Math.atan2(s, e)
  return o < -0.5 * W && (o += H), { angle: o, distance: n }
}
function $i(i, t) {
  return Math.sqrt(Math.pow(t.x - i.x, 2) + Math.pow(t.y - i.y, 2))
}
function pl(i, t) {
  return ((i - t + hl) % H) - W
}
function st(i) {
  return ((i % H) + H) % H
}
function Me(i, t, e, s) {
  const n = st(i),
    o = st(t),
    a = st(e),
    r = st(o - n),
    l = st(a - n),
    c = st(n - o),
    h = st(n - a)
  return n === o || n === a || (s && o === a) || (r > l && c < h)
}
function q(i, t, e) {
  return Math.max(t, Math.min(e, i))
}
function gl(i) {
  return q(i, -32768, 32767)
}
function xt(i, t, e, s = 1e-6) {
  return i >= Math.min(t, e) - s && i <= Math.max(t, e) + s
}
function ds(i, t, e) {
  e = e || (a => i[a] < t)
  let s = i.length - 1,
    n = 0,
    o
  for (; s - n > 1; ) (o = (n + s) >> 1), e(o) ? (n = o) : (s = o)
  return { lo: n, hi: s }
}
const yt = (i, t, e, s) =>
    ds(
      i,
      e,
      s
        ? n => {
            const o = i[n][t]
            return o < e || (o === e && i[n + 1][t] === e)
          }
        : n => i[n][t] < e
    ),
  ml = (i, t, e) => ds(i, e, s => i[s][t] >= e)
function bl(i, t, e) {
  let s = 0,
    n = i.length
  for (; s < n && i[s] < t; ) s++
  for (; n > s && i[n - 1] > e; ) n--
  return s > 0 || n < i.length ? i.slice(s, n) : i
}
const wo = ['push', 'pop', 'shift', 'splice', 'unshift']
function _l(i, t) {
  if (i._chartjs) {
    i._chartjs.listeners.push(t)
    return
  }
  Object.defineProperty(i, '_chartjs', { configurable: !0, enumerable: !1, value: { listeners: [t] } }),
    wo.forEach(e => {
      const s = '_onData' + cs(e),
        n = i[e]
      Object.defineProperty(i, e, {
        configurable: !0,
        enumerable: !1,
        value(...o) {
          const a = n.apply(this, o)
          return (
            i._chartjs.listeners.forEach(r => {
              typeof r[s] == 'function' && r[s](...o)
            }),
            a
          )
        },
      })
    })
}
function Rs(i, t) {
  const e = i._chartjs
  if (!e) return
  const s = e.listeners,
    n = s.indexOf(t)
  n !== -1 && s.splice(n, 1),
    !(s.length > 0) &&
      (wo.forEach(o => {
        delete i[o]
      }),
      delete i._chartjs)
}
function Mo(i) {
  const t = new Set()
  let e, s
  for (e = 0, s = i.length; e < s; ++e) t.add(i[e])
  return t.size === s ? i : Array.from(t)
}
const ko = (function () {
  return typeof window > 'u'
    ? function (i) {
        return i()
      }
    : window.requestAnimationFrame
})()
function So(i, t) {
  let e = [],
    s = !1
  return function (...n) {
    ;(e = n),
      s ||
        ((s = !0),
        ko.call(window, () => {
          ;(s = !1), i.apply(t, e)
        }))
  }
}
function xl(i, t) {
  let e
  return function (...s) {
    return t ? (clearTimeout(e), (e = setTimeout(i, t, s))) : i.apply(this, s), t
  }
}
const us = i => (i === 'start' ? 'left' : i === 'end' ? 'right' : 'center'),
  G = (i, t, e) => (i === 'start' ? t : i === 'end' ? e : (t + e) / 2),
  yl = (i, t, e, s) => (i === (s ? 'left' : 'right') ? e : i === 'center' ? (t + e) / 2 : t)
function Co(i, t, e) {
  const s = t.length
  let n = 0,
    o = s
  if (i._sorted) {
    const { iScale: a, _parsed: r } = i,
      l = a.axis,
      { min: c, max: h, minDefined: d, maxDefined: u } = a.getUserBounds()
    d && (n = q(Math.min(yt(r, a.axis, c).lo, e ? s : yt(t, l, a.getPixelForValue(c)).lo), 0, s - 1)),
      u
        ? (o =
            q(
              Math.max(yt(r, a.axis, h, !0).hi + 1, e ? 0 : yt(t, l, a.getPixelForValue(h), !0).hi + 1),
              n,
              s
            ) - n)
        : (o = s - n)
  }
  return { start: n, count: o }
}
function Po(i) {
  const { xScale: t, yScale: e, _scaleRanges: s } = i,
    n = { xmin: t.min, xmax: t.max, ymin: e.min, ymax: e.max }
  if (!s) return (i._scaleRanges = n), !0
  const o = s.xmin !== t.min || s.xmax !== t.max || s.ymin !== e.min || s.ymax !== e.max
  return Object.assign(s, n), o
}
const ze = i => i === 0 || i === 1,
  Is = (i, t, e) => -(Math.pow(2, 10 * (i -= 1)) * Math.sin(((i - t) * H) / e)),
  Fs = (i, t, e) => Math.pow(2, -10 * i) * Math.sin(((i - t) * H) / e) + 1,
  _e = {
    linear: i => i,
    easeInQuad: i => i * i,
    easeOutQuad: i => -i * (i - 2),
    easeInOutQuad: i => ((i /= 0.5) < 1 ? 0.5 * i * i : -0.5 * (--i * (i - 2) - 1)),
    easeInCubic: i => i * i * i,
    easeOutCubic: i => (i -= 1) * i * i + 1,
    easeInOutCubic: i => ((i /= 0.5) < 1 ? 0.5 * i * i * i : 0.5 * ((i -= 2) * i * i + 2)),
    easeInQuart: i => i * i * i * i,
    easeOutQuart: i => -((i -= 1) * i * i * i - 1),
    easeInOutQuart: i => ((i /= 0.5) < 1 ? 0.5 * i * i * i * i : -0.5 * ((i -= 2) * i * i * i - 2)),
    easeInQuint: i => i * i * i * i * i,
    easeOutQuint: i => (i -= 1) * i * i * i * i + 1,
    easeInOutQuint: i => ((i /= 0.5) < 1 ? 0.5 * i * i * i * i * i : 0.5 * ((i -= 2) * i * i * i * i + 2)),
    easeInSine: i => -Math.cos(i * $) + 1,
    easeOutSine: i => Math.sin(i * $),
    easeInOutSine: i => -0.5 * (Math.cos(W * i) - 1),
    easeInExpo: i => (i === 0 ? 0 : Math.pow(2, 10 * (i - 1))),
    easeOutExpo: i => (i === 1 ? 1 : -Math.pow(2, -10 * i) + 1),
    easeInOutExpo: i =>
      ze(i) ? i : i < 0.5 ? 0.5 * Math.pow(2, 10 * (i * 2 - 1)) : 0.5 * (-Math.pow(2, -10 * (i * 2 - 1)) + 2),
    easeInCirc: i => (i >= 1 ? i : -(Math.sqrt(1 - i * i) - 1)),
    easeOutCirc: i => Math.sqrt(1 - (i -= 1) * i),
    easeInOutCirc: i =>
      (i /= 0.5) < 1 ? -0.5 * (Math.sqrt(1 - i * i) - 1) : 0.5 * (Math.sqrt(1 - (i -= 2) * i) + 1),
    easeInElastic: i => (ze(i) ? i : Is(i, 0.075, 0.3)),
    easeOutElastic: i => (ze(i) ? i : Fs(i, 0.075, 0.3)),
    easeInOutElastic(i) {
      return ze(i) ? i : i < 0.5 ? 0.5 * Is(i * 2, 0.1125, 0.45) : 0.5 + 0.5 * Fs(i * 2 - 1, 0.1125, 0.45)
    },
    easeInBack(i) {
      return i * i * ((1.70158 + 1) * i - 1.70158)
    },
    easeOutBack(i) {
      return (i -= 1) * i * ((1.70158 + 1) * i + 1.70158) + 1
    },
    easeInOutBack(i) {
      let t = 1.70158
      return (i /= 0.5) < 1
        ? 0.5 * (i * i * (((t *= 1.525) + 1) * i - t))
        : 0.5 * ((i -= 2) * i * (((t *= 1.525) + 1) * i + t) + 2)
    },
    easeInBounce: i => 1 - _e.easeOutBounce(1 - i),
    easeOutBounce(i) {
      return i < 1 / 2.75
        ? 7.5625 * i * i
        : i < 2 / 2.75
        ? 7.5625 * (i -= 1.5 / 2.75) * i + 0.75
        : i < 2.5 / 2.75
        ? 7.5625 * (i -= 2.25 / 2.75) * i + 0.9375
        : 7.5625 * (i -= 2.625 / 2.75) * i + 0.984375
    },
    easeInOutBounce: i => (i < 0.5 ? _e.easeInBounce(i * 2) * 0.5 : _e.easeOutBounce(i * 2 - 1) * 0.5 + 0.5),
  }
function Do(i) {
  if (i && typeof i == 'object') {
    const t = i.toString()
    return t === '[object CanvasPattern]' || t === '[object CanvasGradient]'
  }
  return !1
}
function zs(i) {
  return Do(i) ? i : new ve(i)
}
function Ci(i) {
  return Do(i) ? i : new ve(i).saturate(0.5).darken(0.1).hexString()
}
const vl = ['x', 'y', 'borderWidth', 'radius', 'tension'],
  wl = ['color', 'borderColor', 'backgroundColor']
function Ml(i) {
  i.set('animation', {
    delay: void 0,
    duration: 1e3,
    easing: 'easeOutQuart',
    fn: void 0,
    from: void 0,
    loop: void 0,
    to: void 0,
    type: void 0,
  }),
    i.describe('animation', {
      _fallback: !1,
      _indexable: !1,
      _scriptable: t => t !== 'onProgress' && t !== 'onComplete' && t !== 'fn',
    }),
    i.set('animations', {
      colors: { type: 'color', properties: wl },
      numbers: { type: 'number', properties: vl },
    }),
    i.describe('animations', { _fallback: 'animation' }),
    i.set('transitions', {
      active: { animation: { duration: 400 } },
      resize: { animation: { duration: 0 } },
      show: { animations: { colors: { from: 'transparent' }, visible: { type: 'boolean', duration: 0 } } },
      hide: {
        animations: {
          colors: { to: 'transparent' },
          visible: { type: 'boolean', easing: 'linear', fn: t => t | 0 },
        },
      },
    })
}
function kl(i) {
  i.set('layout', { autoPadding: !0, padding: { top: 0, right: 0, bottom: 0, left: 0 } })
}
const Bs = new Map()
function Sl(i, t) {
  t = t || {}
  const e = i + JSON.stringify(t)
  let s = Bs.get(e)
  return s || ((s = new Intl.NumberFormat(i, t)), Bs.set(e, s)), s
}
function Ae(i, t, e) {
  return Sl(t, e).format(i)
}
const To = {
  values(i) {
    return B(i) ? i : '' + i
  },
  numeric(i, t, e) {
    if (i === 0) return '0'
    const s = this.chart.options.locale
    let n,
      o = i
    if (e.length > 1) {
      const c = Math.max(Math.abs(e[0].value), Math.abs(e[e.length - 1].value))
      ;(c < 1e-4 || c > 1e15) && (n = 'scientific'), (o = Cl(i, e))
    }
    const a = Mt(Math.abs(o)),
      r = Math.max(Math.min(-1 * Math.floor(a), 20), 0),
      l = { notation: n, minimumFractionDigits: r, maximumFractionDigits: r }
    return Object.assign(l, this.options.ticks.format), Ae(i, s, l)
  },
  logarithmic(i, t, e) {
    if (i === 0) return '0'
    const s = e[t].significand || i / Math.pow(10, Math.floor(Mt(i)))
    return [1, 2, 3, 5, 10, 15].includes(s) || t > 0.8 * e.length ? To.numeric.call(this, i, t, e) : ''
  },
}
function Cl(i, t) {
  let e = t.length > 3 ? t[2].value - t[1].value : t[1].value - t[0].value
  return Math.abs(e) >= 1 && i !== Math.floor(i) && (e = i - Math.floor(i)), e
}
var mi = { formatters: To }
function Pl(i) {
  i.set('scale', {
    display: !0,
    offset: !1,
    reverse: !1,
    beginAtZero: !1,
    bounds: 'ticks',
    grace: 0,
    grid: {
      display: !0,
      lineWidth: 1,
      drawOnChartArea: !0,
      drawTicks: !0,
      tickLength: 8,
      tickWidth: (t, e) => e.lineWidth,
      tickColor: (t, e) => e.color,
      offset: !1,
    },
    border: { display: !0, dash: [], dashOffset: 0, width: 1 },
    title: { display: !1, text: '', padding: { top: 4, bottom: 4 } },
    ticks: {
      minRotation: 0,
      maxRotation: 50,
      mirror: !1,
      textStrokeWidth: 0,
      textStrokeColor: '',
      padding: 3,
      display: !0,
      autoSkip: !0,
      autoSkipPadding: 3,
      labelOffset: 0,
      callback: mi.formatters.values,
      minor: {},
      major: {},
      align: 'center',
      crossAlign: 'near',
      showLabelBackdrop: !1,
      backdropColor: 'rgba(255, 255, 255, 0.75)',
      backdropPadding: 2,
    },
  }),
    i.route('scale.ticks', 'color', '', 'color'),
    i.route('scale.grid', 'color', '', 'borderColor'),
    i.route('scale.border', 'color', '', 'borderColor'),
    i.route('scale.title', 'color', '', 'color'),
    i.describe('scale', {
      _fallback: !1,
      _scriptable: t =>
        !t.startsWith('before') && !t.startsWith('after') && t !== 'callback' && t !== 'parser',
      _indexable: t => t !== 'borderDash' && t !== 'tickBorderDash' && t !== 'dash',
    }),
    i.describe('scales', { _fallback: 'scale' }),
    i.describe('scale.ticks', {
      _scriptable: t => t !== 'backdropPadding' && t !== 'callback',
      _indexable: t => t !== 'backdropPadding',
    })
}
const Vt = Object.create(null),
  ji = Object.create(null)
function xe(i, t) {
  if (!t) return i
  const e = t.split('.')
  for (let s = 0, n = e.length; s < n; ++s) {
    const o = e[s]
    i = i[o] || (i[o] = Object.create(null))
  }
  return i
}
function Pi(i, t, e) {
  return typeof t == 'string' ? we(xe(i, t), e) : we(xe(i, ''), t)
}
class Dl {
  constructor(t, e) {
    ;(this.animation = void 0),
      (this.backgroundColor = 'rgba(0,0,0,0.1)'),
      (this.borderColor = 'rgba(0,0,0,0.1)'),
      (this.color = '#666'),
      (this.datasets = {}),
      (this.devicePixelRatio = s => s.chart.platform.getDevicePixelRatio()),
      (this.elements = {}),
      (this.events = ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove']),
      (this.font = {
        family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
        size: 12,
        style: 'normal',
        lineHeight: 1.2,
        weight: null,
      }),
      (this.hover = {}),
      (this.hoverBackgroundColor = (s, n) => Ci(n.backgroundColor)),
      (this.hoverBorderColor = (s, n) => Ci(n.borderColor)),
      (this.hoverColor = (s, n) => Ci(n.color)),
      (this.indexAxis = 'x'),
      (this.interaction = { mode: 'nearest', intersect: !0, includeInvisible: !1 }),
      (this.maintainAspectRatio = !0),
      (this.onHover = null),
      (this.onClick = null),
      (this.parsing = !0),
      (this.plugins = {}),
      (this.responsive = !0),
      (this.scale = void 0),
      (this.scales = {}),
      (this.showLine = !0),
      (this.drawActiveElementsOnTop = !0),
      this.describe(t),
      this.apply(e)
  }
  set(t, e) {
    return Pi(this, t, e)
  }
  get(t) {
    return xe(this, t)
  }
  describe(t, e) {
    return Pi(ji, t, e)
  }
  override(t, e) {
    return Pi(Vt, t, e)
  }
  route(t, e, s, n) {
    const o = xe(this, t),
      a = xe(this, s),
      r = '_' + e
    Object.defineProperties(o, {
      [r]: { value: o[e], writable: !0 },
      [e]: {
        enumerable: !0,
        get() {
          const l = this[r],
            c = a[n]
          return O(l) ? Object.assign({}, c, l) : T(l, c)
        },
        set(l) {
          this[r] = l
        },
      },
    })
  }
  apply(t) {
    t.forEach(e => e(this))
  }
}
var U = new Dl(
  {
    _scriptable: i => !i.startsWith('on'),
    _indexable: i => i !== 'events',
    hover: { _fallback: 'interaction' },
    interaction: { _scriptable: !1, _indexable: !1 },
  },
  [Ml, kl, Pl]
)
function Tl(i) {
  return !i || E(i.size) || E(i.family)
    ? null
    : (i.style ? i.style + ' ' : '') + (i.weight ? i.weight + ' ' : '') + i.size + 'px ' + i.family
}
function li(i, t, e, s, n) {
  let o = t[n]
  return o || ((o = t[n] = i.measureText(n).width), e.push(n)), o > s && (s = o), s
}
function Al(i, t, e, s) {
  s = s || {}
  let n = (s.data = s.data || {}),
    o = (s.garbageCollect = s.garbageCollect || [])
  s.font !== t && ((n = s.data = {}), (o = s.garbageCollect = []), (s.font = t)), i.save(), (i.font = t)
  let a = 0
  const r = e.length
  let l, c, h, d, u
  for (l = 0; l < r; l++)
    if (((d = e[l]), d != null && B(d) !== !0)) a = li(i, n, o, a, d)
    else if (B(d))
      for (c = 0, h = d.length; c < h; c++) (u = d[c]), u != null && !B(u) && (a = li(i, n, o, a, u))
  i.restore()
  const f = o.length / 2
  if (f > e.length) {
    for (l = 0; l < f; l++) delete n[o[l]]
    o.splice(0, f)
  }
  return a
}
function Ot(i, t, e) {
  const s = i.currentDevicePixelRatio,
    n = e !== 0 ? Math.max(e / 2, 0.5) : 0
  return Math.round((t - n) * s) / s + n
}
function Hs(i, t) {
  ;(t = t || i.getContext('2d')),
    t.save(),
    t.resetTransform(),
    t.clearRect(0, 0, i.width, i.height),
    t.restore()
}
function Ui(i, t, e, s) {
  Ao(i, t, e, s, null)
}
function Ao(i, t, e, s, n) {
  let o, a, r, l, c, h, d, u
  const f = t.pointStyle,
    p = t.rotation,
    g = t.radius
  let m = (p || 0) * dl
  if (
    f &&
    typeof f == 'object' &&
    ((o = f.toString()), o === '[object HTMLImageElement]' || o === '[object HTMLCanvasElement]')
  ) {
    i.save(),
      i.translate(e, s),
      i.rotate(m),
      i.drawImage(f, -f.width / 2, -f.height / 2, f.width, f.height),
      i.restore()
    return
  }
  if (!(isNaN(g) || g <= 0)) {
    switch ((i.beginPath(), f)) {
      default:
        n ? i.ellipse(e, s, n / 2, g, 0, 0, H) : i.arc(e, s, g, 0, H), i.closePath()
        break
      case 'triangle':
        ;(h = n ? n / 2 : g),
          i.moveTo(e + Math.sin(m) * h, s - Math.cos(m) * g),
          (m += Ls),
          i.lineTo(e + Math.sin(m) * h, s - Math.cos(m) * g),
          (m += Ls),
          i.lineTo(e + Math.sin(m) * h, s - Math.cos(m) * g),
          i.closePath()
        break
      case 'rectRounded':
        ;(c = g * 0.516),
          (l = g - c),
          (a = Math.cos(m + Lt) * l),
          (d = Math.cos(m + Lt) * (n ? n / 2 - c : l)),
          (r = Math.sin(m + Lt) * l),
          (u = Math.sin(m + Lt) * (n ? n / 2 - c : l)),
          i.arc(e - d, s - r, c, m - W, m - $),
          i.arc(e + u, s - a, c, m - $, m),
          i.arc(e + d, s + r, c, m, m + $),
          i.arc(e - u, s + a, c, m + $, m + W),
          i.closePath()
        break
      case 'rect':
        if (!p) {
          ;(l = Math.SQRT1_2 * g), (h = n ? n / 2 : l), i.rect(e - h, s - l, 2 * h, 2 * l)
          break
        }
        m += Lt
      case 'rectRot':
        ;(d = Math.cos(m) * (n ? n / 2 : g)),
          (a = Math.cos(m) * g),
          (r = Math.sin(m) * g),
          (u = Math.sin(m) * (n ? n / 2 : g)),
          i.moveTo(e - d, s - r),
          i.lineTo(e + u, s - a),
          i.lineTo(e + d, s + r),
          i.lineTo(e - u, s + a),
          i.closePath()
        break
      case 'crossRot':
        m += Lt
      case 'cross':
        ;(d = Math.cos(m) * (n ? n / 2 : g)),
          (a = Math.cos(m) * g),
          (r = Math.sin(m) * g),
          (u = Math.sin(m) * (n ? n / 2 : g)),
          i.moveTo(e - d, s - r),
          i.lineTo(e + d, s + r),
          i.moveTo(e + u, s - a),
          i.lineTo(e - u, s + a)
        break
      case 'star':
        ;(d = Math.cos(m) * (n ? n / 2 : g)),
          (a = Math.cos(m) * g),
          (r = Math.sin(m) * g),
          (u = Math.sin(m) * (n ? n / 2 : g)),
          i.moveTo(e - d, s - r),
          i.lineTo(e + d, s + r),
          i.moveTo(e + u, s - a),
          i.lineTo(e - u, s + a),
          (m += Lt),
          (d = Math.cos(m) * (n ? n / 2 : g)),
          (a = Math.cos(m) * g),
          (r = Math.sin(m) * g),
          (u = Math.sin(m) * (n ? n / 2 : g)),
          i.moveTo(e - d, s - r),
          i.lineTo(e + d, s + r),
          i.moveTo(e + u, s - a),
          i.lineTo(e - u, s + a)
        break
      case 'line':
        ;(a = n ? n / 2 : Math.cos(m) * g),
          (r = Math.sin(m) * g),
          i.moveTo(e - a, s - r),
          i.lineTo(e + a, s + r)
        break
      case 'dash':
        i.moveTo(e, s), i.lineTo(e + Math.cos(m) * (n ? n / 2 : g), s + Math.sin(m) * g)
        break
      case !1:
        i.closePath()
        break
    }
    i.fill(), t.borderWidth > 0 && i.stroke()
  }
}
function ke(i, t, e) {
  return (
    (e = e || 0.5),
    !t || (i && i.x > t.left - e && i.x < t.right + e && i.y > t.top - e && i.y < t.bottom + e)
  )
}
function bi(i, t) {
  i.save(), i.beginPath(), i.rect(t.left, t.top, t.right - t.left, t.bottom - t.top), i.clip()
}
function _i(i) {
  i.restore()
}
function Ll(i, t, e, s, n) {
  if (!t) return i.lineTo(e.x, e.y)
  if (n === 'middle') {
    const o = (t.x + e.x) / 2
    i.lineTo(o, t.y), i.lineTo(o, e.y)
  } else (n === 'after') != !!s ? i.lineTo(t.x, e.y) : i.lineTo(e.x, t.y)
  i.lineTo(e.x, e.y)
}
function Ol(i, t, e, s) {
  if (!t) return i.lineTo(e.x, e.y)
  i.bezierCurveTo(
    s ? t.cp1x : t.cp2x,
    s ? t.cp1y : t.cp2y,
    s ? e.cp2x : e.cp1x,
    s ? e.cp2y : e.cp1y,
    e.x,
    e.y
  )
}
function $t(i, t, e, s, n, o = {}) {
  const a = B(t) ? t : [t],
    r = o.strokeWidth > 0 && o.strokeColor !== ''
  let l, c
  for (i.save(), i.font = n.string, El(i, o), l = 0; l < a.length; ++l)
    (c = a[l]),
      o.backdrop && Il(i, o.backdrop),
      r &&
        (o.strokeColor && (i.strokeStyle = o.strokeColor),
        E(o.strokeWidth) || (i.lineWidth = o.strokeWidth),
        i.strokeText(c, e, s, o.maxWidth)),
      i.fillText(c, e, s, o.maxWidth),
      Rl(i, e, s, c, o),
      (s += n.lineHeight)
  i.restore()
}
function El(i, t) {
  t.translation && i.translate(t.translation[0], t.translation[1]),
    E(t.rotation) || i.rotate(t.rotation),
    t.color && (i.fillStyle = t.color),
    t.textAlign && (i.textAlign = t.textAlign),
    t.textBaseline && (i.textBaseline = t.textBaseline)
}
function Rl(i, t, e, s, n) {
  if (n.strikethrough || n.underline) {
    const o = i.measureText(s),
      a = t - o.actualBoundingBoxLeft,
      r = t + o.actualBoundingBoxRight,
      l = e - o.actualBoundingBoxAscent,
      c = e + o.actualBoundingBoxDescent,
      h = n.strikethrough ? (l + c) / 2 : c
    ;(i.strokeStyle = i.fillStyle),
      i.beginPath(),
      (i.lineWidth = n.decorationWidth || 2),
      i.moveTo(a, h),
      i.lineTo(r, h),
      i.stroke()
  }
}
function Il(i, t) {
  const e = i.fillStyle
  ;(i.fillStyle = t.color), i.fillRect(t.left, t.top, t.width, t.height), (i.fillStyle = e)
}
function Se(i, t) {
  const { x: e, y: s, w: n, h: o, radius: a } = t
  i.arc(e + a.topLeft, s + a.topLeft, a.topLeft, -$, W, !0),
    i.lineTo(e, s + o - a.bottomLeft),
    i.arc(e + a.bottomLeft, s + o - a.bottomLeft, a.bottomLeft, W, $, !0),
    i.lineTo(e + n - a.bottomRight, s + o),
    i.arc(e + n - a.bottomRight, s + o - a.bottomRight, a.bottomRight, $, 0, !0),
    i.lineTo(e + n, s + a.topRight),
    i.arc(e + n - a.topRight, s + a.topRight, a.topRight, 0, -$, !0),
    i.lineTo(e + a.topLeft, s)
}
const Fl = /^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/,
  zl = /^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/
function Bl(i, t) {
  const e = ('' + i).match(Fl)
  if (!e || e[1] === 'normal') return t * 1.2
  switch (((i = +e[2]), e[3])) {
    case 'px':
      return i
    case '%':
      i /= 100
      break
  }
  return t * i
}
const Hl = i => +i || 0
function fs(i, t) {
  const e = {},
    s = O(t),
    n = s ? Object.keys(t) : t,
    o = O(i) ? (s ? a => T(i[a], i[t[a]]) : a => i[a]) : () => i
  for (const a of n) e[a] = Hl(o(a))
  return e
}
function Lo(i) {
  return fs(i, { top: 'y', right: 'x', bottom: 'y', left: 'x' })
}
function Ht(i) {
  return fs(i, ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'])
}
function Z(i) {
  const t = Lo(i)
  return (t.width = t.left + t.right), (t.height = t.top + t.bottom), t
}
function Y(i, t) {
  ;(i = i || {}), (t = t || U.font)
  let e = T(i.size, t.size)
  typeof e == 'string' && (e = parseInt(e, 10))
  let s = T(i.style, t.style)
  s && !('' + s).match(zl) && (console.warn('Invalid font style specified: "' + s + '"'), (s = void 0))
  const n = {
    family: T(i.family, t.family),
    lineHeight: Bl(T(i.lineHeight, t.lineHeight), e),
    size: e,
    style: s,
    weight: T(i.weight, t.weight),
    string: '',
  }
  return (n.string = Tl(n)), n
}
function ue(i, t, e, s) {
  let n = !0,
    o,
    a,
    r
  for (o = 0, a = i.length; o < a; ++o)
    if (
      ((r = i[o]),
      r !== void 0 &&
        (t !== void 0 && typeof r == 'function' && ((r = r(t)), (n = !1)),
        e !== void 0 && B(r) && ((r = r[e % r.length]), (n = !1)),
        r !== void 0))
    )
      return s && !n && (s.cacheable = !1), r
}
function Nl(i, t, e) {
  const { min: s, max: n } = i,
    o = _o(t, (n - s) / 2),
    a = (r, l) => (e && r === 0 ? 0 : r + l)
  return { min: a(s, -Math.abs(o)), max: a(n, o) }
}
function At(i, t) {
  return Object.assign(Object.create(i), t)
}
function ps(i, t = [''], e = i, s, n = () => i[0]) {
  ot(s) || (s = Io('_fallback', i))
  const o = {
    [Symbol.toStringTag]: 'Object',
    _cacheable: !0,
    _scopes: i,
    _rootScopes: e,
    _fallback: s,
    _getTarget: n,
    override: a => ps([a, ...i], t, e, s),
  }
  return new Proxy(o, {
    deleteProperty(a, r) {
      return delete a[r], delete a._keys, delete i[0][r], !0
    },
    get(a, r) {
      return Eo(a, r, () => Xl(r, t, i, a))
    },
    getOwnPropertyDescriptor(a, r) {
      return Reflect.getOwnPropertyDescriptor(a._scopes[0], r)
    },
    getPrototypeOf() {
      return Reflect.getPrototypeOf(i[0])
    },
    has(a, r) {
      return Ws(a).includes(r)
    },
    ownKeys(a) {
      return Ws(a)
    },
    set(a, r, l) {
      const c = a._storage || (a._storage = n())
      return (a[r] = c[r] = l), delete a._keys, !0
    },
  })
}
function Qt(i, t, e, s) {
  const n = {
    _cacheable: !1,
    _proxy: i,
    _context: t,
    _subProxy: e,
    _stack: new Set(),
    _descriptors: Oo(i, s),
    setContext: o => Qt(i, o, e, s),
    override: o => Qt(i.override(o), t, e, s),
  }
  return new Proxy(n, {
    deleteProperty(o, a) {
      return delete o[a], delete i[a], !0
    },
    get(o, a, r) {
      return Eo(o, a, () => Vl(o, a, r))
    },
    getOwnPropertyDescriptor(o, a) {
      return o._descriptors.allKeys
        ? Reflect.has(i, a)
          ? { enumerable: !0, configurable: !0 }
          : void 0
        : Reflect.getOwnPropertyDescriptor(i, a)
    },
    getPrototypeOf() {
      return Reflect.getPrototypeOf(i)
    },
    has(o, a) {
      return Reflect.has(i, a)
    },
    ownKeys() {
      return Reflect.ownKeys(i)
    },
    set(o, a, r) {
      return (i[a] = r), delete o[a], !0
    },
  })
}
function Oo(i, t = { scriptable: !0, indexable: !0 }) {
  const { _scriptable: e = t.scriptable, _indexable: s = t.indexable, _allKeys: n = t.allKeys } = i
  return {
    allKeys: n,
    scriptable: e,
    indexable: s,
    isScriptable: Dt(e) ? e : () => e,
    isIndexable: Dt(s) ? s : () => s,
  }
}
const Wl = (i, t) => (i ? i + cs(t) : t),
  gs = (i, t) => O(t) && i !== 'adapters' && (Object.getPrototypeOf(t) === null || t.constructor === Object)
function Eo(i, t, e) {
  if (Object.prototype.hasOwnProperty.call(i, t)) return i[t]
  const s = e()
  return (i[t] = s), s
}
function Vl(i, t, e) {
  const { _proxy: s, _context: n, _subProxy: o, _descriptors: a } = i
  let r = s[t]
  return (
    Dt(r) && a.isScriptable(t) && (r = $l(t, r, i, e)),
    B(r) && r.length && (r = jl(t, r, i, a.isIndexable)),
    gs(t, r) && (r = Qt(r, n, o && o[t], a)),
    r
  )
}
function $l(i, t, e, s) {
  const { _proxy: n, _context: o, _subProxy: a, _stack: r } = e
  if (r.has(i)) throw new Error('Recursion detected: ' + Array.from(r).join('->') + '->' + i)
  return r.add(i), (t = t(o, a || s)), r.delete(i), gs(i, t) && (t = ms(n._scopes, n, i, t)), t
}
function jl(i, t, e, s) {
  const { _proxy: n, _context: o, _subProxy: a, _descriptors: r } = e
  if (ot(o.index) && s(i)) t = t[o.index % t.length]
  else if (O(t[0])) {
    const l = t,
      c = n._scopes.filter(h => h !== l)
    t = []
    for (const h of l) {
      const d = ms(c, n, i, h)
      t.push(Qt(d, o, a && a[i], r))
    }
  }
  return t
}
function Ro(i, t, e) {
  return Dt(i) ? i(t, e) : i
}
const Ul = (i, t) => (i === !0 ? t : typeof i == 'string' ? Pt(t, i) : void 0)
function Yl(i, t, e, s, n) {
  for (const o of t) {
    const a = Ul(e, o)
    if (a) {
      i.add(a)
      const r = Ro(a._fallback, e, n)
      if (ot(r) && r !== e && r !== s) return r
    } else if (a === !1 && ot(s) && e !== s) return null
  }
  return !1
}
function ms(i, t, e, s) {
  const n = t._rootScopes,
    o = Ro(t._fallback, e, s),
    a = [...i, ...n],
    r = new Set()
  r.add(s)
  let l = Ns(r, a, e, o || e, s)
  return l === null || (ot(o) && o !== e && ((l = Ns(r, a, o, l, s)), l === null))
    ? !1
    : ps(Array.from(r), [''], n, o, () => ql(t, e, s))
}
function Ns(i, t, e, s, n) {
  for (; e; ) e = Yl(i, t, e, s, n)
  return e
}
function ql(i, t, e) {
  const s = i._getTarget()
  t in s || (s[t] = {})
  const n = s[t]
  return B(n) && O(e) ? e : n || {}
}
function Xl(i, t, e, s) {
  let n
  for (const o of t) if (((n = Io(Wl(o, i), e)), ot(n))) return gs(i, n) ? ms(e, s, i, n) : n
}
function Io(i, t) {
  for (const e of t) {
    if (!e) continue
    const s = e[i]
    if (ot(s)) return s
  }
}
function Ws(i) {
  let t = i._keys
  return t || (t = i._keys = Kl(i._scopes)), t
}
function Kl(i) {
  const t = new Set()
  for (const e of i) for (const s of Object.keys(e).filter(n => !n.startsWith('_'))) t.add(s)
  return Array.from(t)
}
function Fo(i, t, e, s) {
  const { iScale: n } = i,
    { key: o = 'r' } = this._parsing,
    a = new Array(s)
  let r, l, c, h
  for (r = 0, l = s; r < l; ++r) (c = r + e), (h = t[c]), (a[r] = { r: n.parse(Pt(h, o), c) })
  return a
}
const Gl = Number.EPSILON || 1e-14,
  te = (i, t) => t < i.length && !i[t].skip && i[t],
  zo = i => (i === 'x' ? 'y' : 'x')
function Jl(i, t, e, s) {
  const n = i.skip ? t : i,
    o = t,
    a = e.skip ? t : e,
    r = $i(o, n),
    l = $i(a, o)
  let c = r / (r + l),
    h = l / (r + l)
  ;(c = isNaN(c) ? 0 : c), (h = isNaN(h) ? 0 : h)
  const d = s * c,
    u = s * h
  return {
    previous: { x: o.x - d * (a.x - n.x), y: o.y - d * (a.y - n.y) },
    next: { x: o.x + u * (a.x - n.x), y: o.y + u * (a.y - n.y) },
  }
}
function Zl(i, t, e) {
  const s = i.length
  let n,
    o,
    a,
    r,
    l,
    c = te(i, 0)
  for (let h = 0; h < s - 1; ++h)
    if (((l = c), (c = te(i, h + 1)), !(!l || !c))) {
      if (be(t[h], 0, Gl)) {
        e[h] = e[h + 1] = 0
        continue
      }
      ;(n = e[h] / t[h]),
        (o = e[h + 1] / t[h]),
        (r = Math.pow(n, 2) + Math.pow(o, 2)),
        !(r <= 9) && ((a = 3 / Math.sqrt(r)), (e[h] = n * a * t[h]), (e[h + 1] = o * a * t[h]))
    }
}
function Ql(i, t, e = 'x') {
  const s = zo(e),
    n = i.length
  let o,
    a,
    r,
    l = te(i, 0)
  for (let c = 0; c < n; ++c) {
    if (((a = r), (r = l), (l = te(i, c + 1)), !r)) continue
    const h = r[e],
      d = r[s]
    a && ((o = (h - a[e]) / 3), (r[`cp1${e}`] = h - o), (r[`cp1${s}`] = d - o * t[c])),
      l && ((o = (l[e] - h) / 3), (r[`cp2${e}`] = h + o), (r[`cp2${s}`] = d + o * t[c]))
  }
}
function tc(i, t = 'x') {
  const e = zo(t),
    s = i.length,
    n = Array(s).fill(0),
    o = Array(s)
  let a,
    r,
    l,
    c = te(i, 0)
  for (a = 0; a < s; ++a)
    if (((r = l), (l = c), (c = te(i, a + 1)), !!l)) {
      if (c) {
        const h = c[t] - l[t]
        n[a] = h !== 0 ? (c[e] - l[e]) / h : 0
      }
      o[a] = r ? (c ? (ft(n[a - 1]) !== ft(n[a]) ? 0 : (n[a - 1] + n[a]) / 2) : n[a - 1]) : n[a]
    }
  Zl(i, n, o), Ql(i, o, t)
}
function Be(i, t, e) {
  return Math.max(Math.min(i, e), t)
}
function ec(i, t) {
  let e,
    s,
    n,
    o,
    a,
    r = ke(i[0], t)
  for (e = 0, s = i.length; e < s; ++e)
    (a = o),
      (o = r),
      (r = e < s - 1 && ke(i[e + 1], t)),
      o &&
        ((n = i[e]),
        a && ((n.cp1x = Be(n.cp1x, t.left, t.right)), (n.cp1y = Be(n.cp1y, t.top, t.bottom))),
        r && ((n.cp2x = Be(n.cp2x, t.left, t.right)), (n.cp2y = Be(n.cp2y, t.top, t.bottom))))
}
function ic(i, t, e, s, n) {
  let o, a, r, l
  if ((t.spanGaps && (i = i.filter(c => !c.skip)), t.cubicInterpolationMode === 'monotone')) tc(i, n)
  else {
    let c = s ? i[i.length - 1] : i[0]
    for (o = 0, a = i.length; o < a; ++o)
      (r = i[o]),
        (l = Jl(c, r, i[Math.min(o + 1, a - (s ? 0 : 1)) % a], t.tension)),
        (r.cp1x = l.previous.x),
        (r.cp1y = l.previous.y),
        (r.cp2x = l.next.x),
        (r.cp2y = l.next.y),
        (c = r)
  }
  t.capBezierPoints && ec(i, e)
}
function Bo() {
  return typeof window < 'u' && typeof document < 'u'
}
function bs(i) {
  let t = i.parentNode
  return t && t.toString() === '[object ShadowRoot]' && (t = t.host), t
}
function ci(i, t, e) {
  let s
  return (
    typeof i == 'string'
      ? ((s = parseInt(i, 10)), i.indexOf('%') !== -1 && (s = (s / 100) * t.parentNode[e]))
      : (s = i),
    s
  )
}
const xi = i => i.ownerDocument.defaultView.getComputedStyle(i, null)
function sc(i, t) {
  return xi(i).getPropertyValue(t)
}
const nc = ['top', 'right', 'bottom', 'left']
function Nt(i, t, e) {
  const s = {}
  e = e ? '-' + e : ''
  for (let n = 0; n < 4; n++) {
    const o = nc[n]
    s[o] = parseFloat(i[t + '-' + o + e]) || 0
  }
  return (s.width = s.left + s.right), (s.height = s.top + s.bottom), s
}
const oc = (i, t, e) => (i > 0 || t > 0) && (!e || !e.shadowRoot)
function ac(i, t) {
  const e = i.touches,
    s = e && e.length ? e[0] : i,
    { offsetX: n, offsetY: o } = s
  let a = !1,
    r,
    l
  if (oc(n, o, i.target)) (r = n), (l = o)
  else {
    const c = t.getBoundingClientRect()
    ;(r = s.clientX - c.left), (l = s.clientY - c.top), (a = !0)
  }
  return { x: r, y: l, box: a }
}
function It(i, t) {
  if ('native' in i) return i
  const { canvas: e, currentDevicePixelRatio: s } = t,
    n = xi(e),
    o = n.boxSizing === 'border-box',
    a = Nt(n, 'padding'),
    r = Nt(n, 'border', 'width'),
    { x: l, y: c, box: h } = ac(i, e),
    d = a.left + (h && r.left),
    u = a.top + (h && r.top)
  let { width: f, height: p } = t
  return (
    o && ((f -= a.width + r.width), (p -= a.height + r.height)),
    { x: Math.round((((l - d) / f) * e.width) / s), y: Math.round((((c - u) / p) * e.height) / s) }
  )
}
function rc(i, t, e) {
  let s, n
  if (t === void 0 || e === void 0) {
    const o = bs(i)
    if (!o) (t = i.clientWidth), (e = i.clientHeight)
    else {
      const a = o.getBoundingClientRect(),
        r = xi(o),
        l = Nt(r, 'border', 'width'),
        c = Nt(r, 'padding')
      ;(t = a.width - c.width - l.width),
        (e = a.height - c.height - l.height),
        (s = ci(r.maxWidth, o, 'clientWidth')),
        (n = ci(r.maxHeight, o, 'clientHeight'))
    }
  }
  return { width: t, height: e, maxWidth: s || ri, maxHeight: n || ri }
}
const He = i => Math.round(i * 10) / 10
function lc(i, t, e, s) {
  const n = xi(i),
    o = Nt(n, 'margin'),
    a = ci(n.maxWidth, i, 'clientWidth') || ri,
    r = ci(n.maxHeight, i, 'clientHeight') || ri,
    l = rc(i, t, e)
  let { width: c, height: h } = l
  if (n.boxSizing === 'content-box') {
    const u = Nt(n, 'border', 'width'),
      f = Nt(n, 'padding')
    ;(c -= f.width + u.width), (h -= f.height + u.height)
  }
  return (
    (c = Math.max(0, c - o.width)),
    (h = Math.max(0, s ? c / s : h - o.height)),
    (c = He(Math.min(c, a, l.maxWidth))),
    (h = He(Math.min(h, r, l.maxHeight))),
    c && !h && (h = He(c / 2)),
    (t !== void 0 || e !== void 0) &&
      s &&
      l.height &&
      h > l.height &&
      ((h = l.height), (c = He(Math.floor(h * s)))),
    { width: c, height: h }
  )
}
function Vs(i, t, e) {
  const s = t || 1,
    n = Math.floor(i.height * s),
    o = Math.floor(i.width * s)
  ;(i.height = Math.floor(i.height)), (i.width = Math.floor(i.width))
  const a = i.canvas
  return (
    a.style &&
      (e || (!a.style.height && !a.style.width)) &&
      ((a.style.height = `${i.height}px`), (a.style.width = `${i.width}px`)),
    i.currentDevicePixelRatio !== s || a.height !== n || a.width !== o
      ? ((i.currentDevicePixelRatio = s),
        (a.height = n),
        (a.width = o),
        i.ctx.setTransform(s, 0, 0, s, 0, 0),
        !0)
      : !1
  )
}
const cc = (function () {
  let i = !1
  try {
    const t = {
      get passive() {
        return (i = !0), !1
      },
    }
    window.addEventListener('test', null, t), window.removeEventListener('test', null, t)
  } catch {}
  return i
})()
function $s(i, t) {
  const e = sc(i, t),
    s = e && e.match(/^(\d+)(\.\d+)?px$/)
  return s ? +s[1] : void 0
}
function Ft(i, t, e, s) {
  return { x: i.x + e * (t.x - i.x), y: i.y + e * (t.y - i.y) }
}
function hc(i, t, e, s) {
  return {
    x: i.x + e * (t.x - i.x),
    y: s === 'middle' ? (e < 0.5 ? i.y : t.y) : s === 'after' ? (e < 1 ? i.y : t.y) : e > 0 ? t.y : i.y,
  }
}
function dc(i, t, e, s) {
  const n = { x: i.cp2x, y: i.cp2y },
    o = { x: t.cp1x, y: t.cp1y },
    a = Ft(i, n, e),
    r = Ft(n, o, e),
    l = Ft(o, t, e),
    c = Ft(a, r, e),
    h = Ft(r, l, e)
  return Ft(c, h, e)
}
const uc = function (i, t) {
    return {
      x(e) {
        return i + i + t - e
      },
      setWidth(e) {
        t = e
      },
      textAlign(e) {
        return e === 'center' ? e : e === 'right' ? 'left' : 'right'
      },
      xPlus(e, s) {
        return e - s
      },
      leftForLtr(e, s) {
        return e - s
      },
    }
  },
  fc = function () {
    return {
      x(i) {
        return i
      },
      setWidth(i) {},
      textAlign(i) {
        return i
      },
      xPlus(i, t) {
        return i + t
      },
      leftForLtr(i, t) {
        return i
      },
    }
  }
function Gt(i, t, e) {
  return i ? uc(t, e) : fc()
}
function Ho(i, t) {
  let e, s
  ;(t === 'ltr' || t === 'rtl') &&
    ((e = i.canvas.style),
    (s = [e.getPropertyValue('direction'), e.getPropertyPriority('direction')]),
    e.setProperty('direction', t, 'important'),
    (i.prevTextDirection = s))
}
function No(i, t) {
  t !== void 0 && (delete i.prevTextDirection, i.canvas.style.setProperty('direction', t[0], t[1]))
}
function Wo(i) {
  return i === 'angle'
    ? { between: Me, compare: pl, normalize: st }
    : { between: xt, compare: (t, e) => t - e, normalize: t => t }
}
function js({ start: i, end: t, count: e, loop: s, style: n }) {
  return { start: i % e, end: t % e, loop: s && (t - i + 1) % e === 0, style: n }
}
function pc(i, t, e) {
  const { property: s, start: n, end: o } = e,
    { between: a, normalize: r } = Wo(s),
    l = t.length
  let { start: c, end: h, loop: d } = i,
    u,
    f
  if (d) {
    for (c += l, h += l, u = 0, f = l; u < f && a(r(t[c % l][s]), n, o); ++u) c--, h--
    ;(c %= l), (h %= l)
  }
  return h < c && (h += l), { start: c, end: h, loop: d, style: i.style }
}
function Vo(i, t, e) {
  if (!e) return [i]
  const { property: s, start: n, end: o } = e,
    a = t.length,
    { compare: r, between: l, normalize: c } = Wo(s),
    { start: h, end: d, loop: u, style: f } = pc(i, t, e),
    p = []
  let g = !1,
    m = null,
    b,
    _,
    y
  const v = () => l(n, y, b) && r(n, y) !== 0,
    x = () => r(o, b) === 0 || l(o, y, b),
    w = () => g || v(),
    M = () => !g || x()
  for (let S = h, P = h; S <= d; ++S)
    (_ = t[S % a]),
      !_.skip &&
        ((b = c(_[s])),
        b !== y &&
          ((g = l(b, n, o)),
          m === null && w() && (m = r(b, n) === 0 ? S : P),
          m !== null && M() && (p.push(js({ start: m, end: S, loop: u, count: a, style: f })), (m = null)),
          (P = S),
          (y = b)))
  return m !== null && p.push(js({ start: m, end: d, loop: u, count: a, style: f })), p
}
function $o(i, t) {
  const e = [],
    s = i.segments
  for (let n = 0; n < s.length; n++) {
    const o = Vo(s[n], i.points, t)
    o.length && e.push(...o)
  }
  return e
}
function gc(i, t, e, s) {
  let n = 0,
    o = t - 1
  if (e && !s) for (; n < t && !i[n].skip; ) n++
  for (; n < t && i[n].skip; ) n++
  for (n %= t, e && (o += n); o > n && i[o % t].skip; ) o--
  return (o %= t), { start: n, end: o }
}
function mc(i, t, e, s) {
  const n = i.length,
    o = []
  let a = t,
    r = i[t],
    l
  for (l = t + 1; l <= e; ++l) {
    const c = i[l % n]
    c.skip || c.stop
      ? r.skip || ((s = !1), o.push({ start: t % n, end: (l - 1) % n, loop: s }), (t = a = c.stop ? l : null))
      : ((a = l), r.skip && (t = l)),
      (r = c)
  }
  return a !== null && o.push({ start: t % n, end: a % n, loop: s }), o
}
function bc(i, t) {
  const e = i.points,
    s = i.options.spanGaps,
    n = e.length
  if (!n) return []
  const o = !!i._loop,
    { start: a, end: r } = gc(e, n, o, s)
  if (s === !0) return Us(i, [{ start: a, end: r, loop: o }], e, t)
  const l = r < a ? r + n : r,
    c = !!i._fullLoop && a === 0 && r === n - 1
  return Us(i, mc(e, a, l, c), e, t)
}
function Us(i, t, e, s) {
  return !s || !s.setContext || !e ? t : _c(i, t, e, s)
}
function _c(i, t, e, s) {
  const n = i._chart.getContext(),
    o = Ys(i.options),
    {
      _datasetIndex: a,
      options: { spanGaps: r },
    } = i,
    l = e.length,
    c = []
  let h = o,
    d = t[0].start,
    u = d
  function f(p, g, m, b) {
    const _ = r ? -1 : 1
    if (p !== g) {
      for (p += l; e[p % l].skip; ) p -= _
      for (; e[g % l].skip; ) g += _
      p % l !== g % l && (c.push({ start: p % l, end: g % l, loop: m, style: b }), (h = b), (d = g % l))
    }
  }
  for (const p of t) {
    d = r ? d : p.start
    let g = e[d % l],
      m
    for (u = d + 1; u <= p.end; u++) {
      const b = e[u % l]
      ;(m = Ys(
        s.setContext(
          At(n, {
            type: 'segment',
            p0: g,
            p1: b,
            p0DataIndex: (u - 1) % l,
            p1DataIndex: u % l,
            datasetIndex: a,
          })
        )
      )),
        xc(m, h) && f(d, u - 1, p.loop, h),
        (g = b),
        (h = m)
    }
    d < u - 1 && f(d, u - 1, p.loop, h)
  }
  return c
}
function Ys(i) {
  return {
    backgroundColor: i.backgroundColor,
    borderCapStyle: i.borderCapStyle,
    borderDash: i.borderDash,
    borderDashOffset: i.borderDashOffset,
    borderJoinStyle: i.borderJoinStyle,
    borderWidth: i.borderWidth,
    borderColor: i.borderColor,
  }
}
function xc(i, t) {
  return t && JSON.stringify(i) !== JSON.stringify(t)
}
/*!
 * Chart.js v4.2.1
 * https://www.chartjs.org
 * (c) 2023 Chart.js Contributors
 * Released under the MIT License
 */ class yc {
  constructor() {
    ;(this._request = null), (this._charts = new Map()), (this._running = !1), (this._lastDate = void 0)
  }
  _notify(t, e, s, n) {
    const o = e.listeners[n],
      a = e.duration
    o.forEach(r => r({ chart: t, initial: e.initial, numSteps: a, currentStep: Math.min(s - e.start, a) }))
  }
  _refresh() {
    this._request ||
      ((this._running = !0),
      (this._request = ko.call(window, () => {
        this._update(), (this._request = null), this._running && this._refresh()
      })))
  }
  _update(t = Date.now()) {
    let e = 0
    this._charts.forEach((s, n) => {
      if (!s.running || !s.items.length) return
      const o = s.items
      let a = o.length - 1,
        r = !1,
        l
      for (; a >= 0; --a)
        (l = o[a]),
          l._active
            ? (l._total > s.duration && (s.duration = l._total), l.tick(t), (r = !0))
            : ((o[a] = o[o.length - 1]), o.pop())
      r && (n.draw(), this._notify(n, s, t, 'progress')),
        o.length || ((s.running = !1), this._notify(n, s, t, 'complete'), (s.initial = !1)),
        (e += o.length)
    }),
      (this._lastDate = t),
      e === 0 && (this._running = !1)
  }
  _getAnims(t) {
    const e = this._charts
    let s = e.get(t)
    return (
      s ||
        ((s = { running: !1, initial: !0, items: [], listeners: { complete: [], progress: [] } }),
        e.set(t, s)),
      s
    )
  }
  listen(t, e, s) {
    this._getAnims(t).listeners[e].push(s)
  }
  add(t, e) {
    !e || !e.length || this._getAnims(t).items.push(...e)
  }
  has(t) {
    return this._getAnims(t).items.length > 0
  }
  start(t) {
    const e = this._charts.get(t)
    e &&
      ((e.running = !0),
      (e.start = Date.now()),
      (e.duration = e.items.reduce((s, n) => Math.max(s, n._duration), 0)),
      this._refresh())
  }
  running(t) {
    if (!this._running) return !1
    const e = this._charts.get(t)
    return !(!e || !e.running || !e.items.length)
  }
  stop(t) {
    const e = this._charts.get(t)
    if (!e || !e.items.length) return
    const s = e.items
    let n = s.length - 1
    for (; n >= 0; --n) s[n].cancel()
    ;(e.items = []), this._notify(t, e, Date.now(), 'complete')
  }
  remove(t) {
    return this._charts.delete(t)
  }
}
var gt = new yc()
const qs = 'transparent',
  vc = {
    boolean(i, t, e) {
      return e > 0.5 ? t : i
    },
    color(i, t, e) {
      const s = zs(i || qs),
        n = s.valid && zs(t || qs)
      return n && n.valid ? n.mix(s, e).hexString() : t
    },
    number(i, t, e) {
      return i + (t - i) * e
    },
  }
class wc {
  constructor(t, e, s, n) {
    const o = e[s]
    n = ue([t.to, n, o, t.from])
    const a = ue([t.from, o, n])
    ;(this._active = !0),
      (this._fn = t.fn || vc[t.type || typeof a]),
      (this._easing = _e[t.easing] || _e.linear),
      (this._start = Math.floor(Date.now() + (t.delay || 0))),
      (this._duration = this._total = Math.floor(t.duration)),
      (this._loop = !!t.loop),
      (this._target = e),
      (this._prop = s),
      (this._from = a),
      (this._to = n),
      (this._promises = void 0)
  }
  active() {
    return this._active
  }
  update(t, e, s) {
    if (this._active) {
      this._notify(!1)
      const n = this._target[this._prop],
        o = s - this._start,
        a = this._duration - o
      ;(this._start = s),
        (this._duration = Math.floor(Math.max(a, t.duration))),
        (this._total += o),
        (this._loop = !!t.loop),
        (this._to = ue([t.to, e, n, t.from])),
        (this._from = ue([t.from, n, e]))
    }
  }
  cancel() {
    this._active && (this.tick(Date.now()), (this._active = !1), this._notify(!1))
  }
  tick(t) {
    const e = t - this._start,
      s = this._duration,
      n = this._prop,
      o = this._from,
      a = this._loop,
      r = this._to
    let l
    if (((this._active = o !== r && (a || e < s)), !this._active)) {
      ;(this._target[n] = r), this._notify(!0)
      return
    }
    if (e < 0) {
      this._target[n] = o
      return
    }
    ;(l = (e / s) % 2),
      (l = a && l > 1 ? 2 - l : l),
      (l = this._easing(Math.min(1, Math.max(0, l)))),
      (this._target[n] = this._fn(o, r, l))
  }
  wait() {
    const t = this._promises || (this._promises = [])
    return new Promise((e, s) => {
      t.push({ res: e, rej: s })
    })
  }
  _notify(t) {
    const e = t ? 'res' : 'rej',
      s = this._promises || []
    for (let n = 0; n < s.length; n++) s[n][e]()
  }
}
class jo {
  constructor(t, e) {
    ;(this._chart = t), (this._properties = new Map()), this.configure(e)
  }
  configure(t) {
    if (!O(t)) return
    const e = Object.keys(U.animation),
      s = this._properties
    Object.getOwnPropertyNames(t).forEach(n => {
      const o = t[n]
      if (!O(o)) return
      const a = {}
      for (const r of e) a[r] = o[r]
      ;((B(o.properties) && o.properties) || [n]).forEach(r => {
        ;(r === n || !s.has(r)) && s.set(r, a)
      })
    })
  }
  _animateOptions(t, e) {
    const s = e.options,
      n = kc(t, s)
    if (!n) return []
    const o = this._createAnimations(n, s)
    return (
      s.$shared &&
        Mc(t.options.$animations, s).then(
          () => {
            t.options = s
          },
          () => {}
        ),
      o
    )
  }
  _createAnimations(t, e) {
    const s = this._properties,
      n = [],
      o = t.$animations || (t.$animations = {}),
      a = Object.keys(e),
      r = Date.now()
    let l
    for (l = a.length - 1; l >= 0; --l) {
      const c = a[l]
      if (c.charAt(0) === '$') continue
      if (c === 'options') {
        n.push(...this._animateOptions(t, e))
        continue
      }
      const h = e[c]
      let d = o[c]
      const u = s.get(c)
      if (d)
        if (u && d.active()) {
          d.update(u, h, r)
          continue
        } else d.cancel()
      if (!u || !u.duration) {
        t[c] = h
        continue
      }
      ;(o[c] = d = new wc(u, t, c, h)), n.push(d)
    }
    return n
  }
  update(t, e) {
    if (this._properties.size === 0) {
      Object.assign(t, e)
      return
    }
    const s = this._createAnimations(t, e)
    if (s.length) return gt.add(this._chart, s), !0
  }
}
function Mc(i, t) {
  const e = [],
    s = Object.keys(t)
  for (let n = 0; n < s.length; n++) {
    const o = i[s[n]]
    o && o.active() && e.push(o.wait())
  }
  return Promise.all(e)
}
function kc(i, t) {
  if (!t) return
  let e = i.options
  if (!e) {
    i.options = t
    return
  }
  return e.$shared && (i.options = e = Object.assign({}, e, { $shared: !1, $animations: {} })), e
}
function Xs(i, t) {
  const e = (i && i.options) || {},
    s = e.reverse,
    n = e.min === void 0 ? t : 0,
    o = e.max === void 0 ? t : 0
  return { start: s ? o : n, end: s ? n : o }
}
function Sc(i, t, e) {
  if (e === !1) return !1
  const s = Xs(i, e),
    n = Xs(t, e)
  return { top: n.end, right: s.end, bottom: n.start, left: s.start }
}
function Cc(i) {
  let t, e, s, n
  return (
    O(i) ? ((t = i.top), (e = i.right), (s = i.bottom), (n = i.left)) : (t = e = s = n = i),
    { top: t, right: e, bottom: s, left: n, disabled: i === !1 }
  )
}
function Uo(i, t) {
  const e = [],
    s = i._getSortedDatasetMetas(t)
  let n, o
  for (n = 0, o = s.length; n < o; ++n) e.push(s[n].index)
  return e
}
function Ks(i, t, e, s = {}) {
  const n = i.keys,
    o = s.mode === 'single'
  let a, r, l, c
  if (t !== null) {
    for (a = 0, r = n.length; a < r; ++a) {
      if (((l = +n[a]), l === e)) {
        if (s.all) continue
        break
      }
      ;(c = i.values[l]), V(c) && (o || t === 0 || ft(t) === ft(c)) && (t += c)
    }
    return t
  }
}
function Pc(i) {
  const t = Object.keys(i),
    e = new Array(t.length)
  let s, n, o
  for (s = 0, n = t.length; s < n; ++s) (o = t[s]), (e[s] = { x: o, y: i[o] })
  return e
}
function Gs(i, t) {
  const e = i && i.options.stacked
  return e || (e === void 0 && t.stack !== void 0)
}
function Dc(i, t, e) {
  return `${i.id}.${t.id}.${e.stack || e.type}`
}
function Tc(i) {
  const { min: t, max: e, minDefined: s, maxDefined: n } = i.getUserBounds()
  return { min: s ? t : Number.NEGATIVE_INFINITY, max: n ? e : Number.POSITIVE_INFINITY }
}
function Ac(i, t, e) {
  const s = i[t] || (i[t] = {})
  return s[e] || (s[e] = {})
}
function Js(i, t, e, s) {
  for (const n of t.getMatchingVisibleMetas(s).reverse()) {
    const o = i[n.index]
    if ((e && o > 0) || (!e && o < 0)) return n.index
  }
  return null
}
function Zs(i, t) {
  const { chart: e, _cachedMeta: s } = i,
    n = e._stacks || (e._stacks = {}),
    { iScale: o, vScale: a, index: r } = s,
    l = o.axis,
    c = a.axis,
    h = Dc(o, a, s),
    d = t.length
  let u
  for (let f = 0; f < d; ++f) {
    const p = t[f],
      { [l]: g, [c]: m } = p,
      b = p._stacks || (p._stacks = {})
    ;(u = b[c] = Ac(n, h, g)), (u[r] = m), (u._top = Js(u, a, !0, s.type)), (u._bottom = Js(u, a, !1, s.type))
    const _ = u._visualValues || (u._visualValues = {})
    _[r] = m
  }
}
function Di(i, t) {
  const e = i.scales
  return Object.keys(e)
    .filter(s => e[s].axis === t)
    .shift()
}
function Lc(i, t) {
  return At(i, { active: !1, dataset: void 0, datasetIndex: t, index: t, mode: 'default', type: 'dataset' })
}
function Oc(i, t, e) {
  return At(i, {
    active: !1,
    dataIndex: t,
    parsed: void 0,
    raw: void 0,
    element: e,
    index: t,
    mode: 'default',
    type: 'data',
  })
}
function oe(i, t) {
  const e = i.controller.index,
    s = i.vScale && i.vScale.axis
  if (s) {
    t = t || i._parsed
    for (const n of t) {
      const o = n._stacks
      if (!o || o[s] === void 0 || o[s][e] === void 0) return
      delete o[s][e],
        o[s]._visualValues !== void 0 && o[s]._visualValues[e] !== void 0 && delete o[s]._visualValues[e]
    }
  }
}
const Ti = i => i === 'reset' || i === 'none',
  Qs = (i, t) => (t ? i : Object.assign({}, i)),
  Ec = (i, t, e) => i && !t.hidden && t._stacked && { keys: Uo(e, !0), values: null }
class lt {
  constructor(t, e) {
    ;(this.chart = t),
      (this._ctx = t.ctx),
      (this.index = e),
      (this._cachedDataOpts = {}),
      (this._cachedMeta = this.getMeta()),
      (this._type = this._cachedMeta.type),
      (this.options = void 0),
      (this._parsing = !1),
      (this._data = void 0),
      (this._objectData = void 0),
      (this._sharedOptions = void 0),
      (this._drawStart = void 0),
      (this._drawCount = void 0),
      (this.enableOptionSharing = !1),
      (this.supportsDecimation = !1),
      (this.$context = void 0),
      (this._syncList = []),
      (this.datasetElementType = new.target.datasetElementType),
      (this.dataElementType = new.target.dataElementType),
      this.initialize()
  }
  initialize() {
    const t = this._cachedMeta
    this.configure(),
      this.linkScales(),
      (t._stacked = Gs(t.vScale, t)),
      this.addElements(),
      this.options.fill &&
        !this.chart.isPluginEnabled('filler') &&
        console.warn(
          "Tried to use the 'fill' option without the 'Filler' plugin enabled. Please import and register the 'Filler' plugin and make sure it is not disabled in the options"
        )
  }
  updateIndex(t) {
    this.index !== t && oe(this._cachedMeta), (this.index = t)
  }
  linkScales() {
    const t = this.chart,
      e = this._cachedMeta,
      s = this.getDataset(),
      n = (d, u, f, p) => (d === 'x' ? u : d === 'r' ? p : f),
      o = (e.xAxisID = T(s.xAxisID, Di(t, 'x'))),
      a = (e.yAxisID = T(s.yAxisID, Di(t, 'y'))),
      r = (e.rAxisID = T(s.rAxisID, Di(t, 'r'))),
      l = e.indexAxis,
      c = (e.iAxisID = n(l, o, a, r)),
      h = (e.vAxisID = n(l, a, o, r))
    ;(e.xScale = this.getScaleForId(o)),
      (e.yScale = this.getScaleForId(a)),
      (e.rScale = this.getScaleForId(r)),
      (e.iScale = this.getScaleForId(c)),
      (e.vScale = this.getScaleForId(h))
  }
  getDataset() {
    return this.chart.data.datasets[this.index]
  }
  getMeta() {
    return this.chart.getDatasetMeta(this.index)
  }
  getScaleForId(t) {
    return this.chart.scales[t]
  }
  _getOtherScale(t) {
    const e = this._cachedMeta
    return t === e.iScale ? e.vScale : e.iScale
  }
  reset() {
    this._update('reset')
  }
  _destroy() {
    const t = this._cachedMeta
    this._data && Rs(this._data, this), t._stacked && oe(t)
  }
  _dataCheck() {
    const t = this.getDataset(),
      e = t.data || (t.data = []),
      s = this._data
    if (O(e)) this._data = Pc(e)
    else if (s !== e) {
      if (s) {
        Rs(s, this)
        const n = this._cachedMeta
        oe(n), (n._parsed = [])
      }
      e && Object.isExtensible(e) && _l(e, this), (this._syncList = []), (this._data = e)
    }
  }
  addElements() {
    const t = this._cachedMeta
    this._dataCheck(), this.datasetElementType && (t.dataset = new this.datasetElementType())
  }
  buildOrUpdateElements(t) {
    const e = this._cachedMeta,
      s = this.getDataset()
    let n = !1
    this._dataCheck()
    const o = e._stacked
    ;(e._stacked = Gs(e.vScale, e)),
      e.stack !== s.stack && ((n = !0), oe(e), (e.stack = s.stack)),
      this._resyncElements(t),
      (n || o !== e._stacked) && Zs(this, e._parsed)
  }
  configure() {
    const t = this.chart.config,
      e = t.datasetScopeKeys(this._type),
      s = t.getOptionScopes(this.getDataset(), e, !0)
    ;(this.options = t.createResolver(s, this.getContext())),
      (this._parsing = this.options.parsing),
      (this._cachedDataOpts = {})
  }
  parse(t, e) {
    const { _cachedMeta: s, _data: n } = this,
      { iScale: o, _stacked: a } = s,
      r = o.axis
    let l = t === 0 && e === n.length ? !0 : s._sorted,
      c = t > 0 && s._parsed[t - 1],
      h,
      d,
      u
    if (this._parsing === !1) (s._parsed = n), (s._sorted = !0), (u = n)
    else {
      B(n[t])
        ? (u = this.parseArrayData(s, n, t, e))
        : O(n[t])
        ? (u = this.parseObjectData(s, n, t, e))
        : (u = this.parsePrimitiveData(s, n, t, e))
      const f = () => d[r] === null || (c && d[r] < c[r])
      for (h = 0; h < e; ++h) (s._parsed[h + t] = d = u[h]), l && (f() && (l = !1), (c = d))
      s._sorted = l
    }
    a && Zs(this, u)
  }
  parsePrimitiveData(t, e, s, n) {
    const { iScale: o, vScale: a } = t,
      r = o.axis,
      l = a.axis,
      c = o.getLabels(),
      h = o === a,
      d = new Array(n)
    let u, f, p
    for (u = 0, f = n; u < f; ++u) (p = u + s), (d[u] = { [r]: h || o.parse(c[p], p), [l]: a.parse(e[p], p) })
    return d
  }
  parseArrayData(t, e, s, n) {
    const { xScale: o, yScale: a } = t,
      r = new Array(n)
    let l, c, h, d
    for (l = 0, c = n; l < c; ++l)
      (h = l + s), (d = e[h]), (r[l] = { x: o.parse(d[0], h), y: a.parse(d[1], h) })
    return r
  }
  parseObjectData(t, e, s, n) {
    const { xScale: o, yScale: a } = t,
      { xAxisKey: r = 'x', yAxisKey: l = 'y' } = this._parsing,
      c = new Array(n)
    let h, d, u, f
    for (h = 0, d = n; h < d; ++h)
      (u = h + s), (f = e[u]), (c[h] = { x: o.parse(Pt(f, r), u), y: a.parse(Pt(f, l), u) })
    return c
  }
  getParsed(t) {
    return this._cachedMeta._parsed[t]
  }
  getDataElement(t) {
    return this._cachedMeta.data[t]
  }
  applyStack(t, e, s) {
    const n = this.chart,
      o = this._cachedMeta,
      a = e[t.axis],
      r = { keys: Uo(n, !0), values: e._stacks[t.axis]._visualValues }
    return Ks(r, a, o.index, { mode: s })
  }
  updateRangeFromParsed(t, e, s, n) {
    const o = s[e.axis]
    let a = o === null ? NaN : o
    const r = n && s._stacks[e.axis]
    n && r && ((n.values = r), (a = Ks(n, o, this._cachedMeta.index))),
      (t.min = Math.min(t.min, a)),
      (t.max = Math.max(t.max, a))
  }
  getMinMax(t, e) {
    const s = this._cachedMeta,
      n = s._parsed,
      o = s._sorted && t === s.iScale,
      a = n.length,
      r = this._getOtherScale(t),
      l = Ec(e, s, this.chart),
      c = { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
      { min: h, max: d } = Tc(r)
    let u, f
    function p() {
      f = n[u]
      const g = f[r.axis]
      return !V(f[t.axis]) || h > g || d < g
    }
    for (u = 0; u < a && !(!p() && (this.updateRangeFromParsed(c, t, f, l), o)); ++u);
    if (o) {
      for (u = a - 1; u >= 0; --u)
        if (!p()) {
          this.updateRangeFromParsed(c, t, f, l)
          break
        }
    }
    return c
  }
  getAllParsedValues(t) {
    const e = this._cachedMeta._parsed,
      s = []
    let n, o, a
    for (n = 0, o = e.length; n < o; ++n) (a = e[n][t.axis]), V(a) && s.push(a)
    return s
  }
  getMaxOverflow() {
    return !1
  }
  getLabelAndValue(t) {
    const e = this._cachedMeta,
      s = e.iScale,
      n = e.vScale,
      o = this.getParsed(t)
    return {
      label: s ? '' + s.getLabelForValue(o[s.axis]) : '',
      value: n ? '' + n.getLabelForValue(o[n.axis]) : '',
    }
  }
  _update(t) {
    const e = this._cachedMeta
    this.update(t || 'default'),
      (e._clip = Cc(T(this.options.clip, Sc(e.xScale, e.yScale, this.getMaxOverflow()))))
  }
  update(t) {}
  draw() {
    const t = this._ctx,
      e = this.chart,
      s = this._cachedMeta,
      n = s.data || [],
      o = e.chartArea,
      a = [],
      r = this._drawStart || 0,
      l = this._drawCount || n.length - r,
      c = this.options.drawActiveElementsOnTop
    let h
    for (s.dataset && s.dataset.draw(t, o, r, l), h = r; h < r + l; ++h) {
      const d = n[h]
      d.hidden || (d.active && c ? a.push(d) : d.draw(t, o))
    }
    for (h = 0; h < a.length; ++h) a[h].draw(t, o)
  }
  getStyle(t, e) {
    const s = e ? 'active' : 'default'
    return t === void 0 && this._cachedMeta.dataset
      ? this.resolveDatasetElementOptions(s)
      : this.resolveDataElementOptions(t || 0, s)
  }
  getContext(t, e, s) {
    const n = this.getDataset()
    let o
    if (t >= 0 && t < this._cachedMeta.data.length) {
      const a = this._cachedMeta.data[t]
      ;(o = a.$context || (a.$context = Oc(this.getContext(), t, a))),
        (o.parsed = this.getParsed(t)),
        (o.raw = n.data[t]),
        (o.index = o.dataIndex = t)
    } else
      (o = this.$context || (this.$context = Lc(this.chart.getContext(), this.index))),
        (o.dataset = n),
        (o.index = o.datasetIndex = this.index)
    return (o.active = !!e), (o.mode = s), o
  }
  resolveDatasetElementOptions(t) {
    return this._resolveElementOptions(this.datasetElementType.id, t)
  }
  resolveDataElementOptions(t, e) {
    return this._resolveElementOptions(this.dataElementType.id, e, t)
  }
  _resolveElementOptions(t, e = 'default', s) {
    const n = e === 'active',
      o = this._cachedDataOpts,
      a = t + '-' + e,
      r = o[a],
      l = this.enableOptionSharing && ot(s)
    if (r) return Qs(r, l)
    const c = this.chart.config,
      h = c.datasetElementScopeKeys(this._type, t),
      d = n ? [`${t}Hover`, 'hover', t, ''] : [t, ''],
      u = c.getOptionScopes(this.getDataset(), h),
      f = Object.keys(U.elements[t]),
      p = () => this.getContext(s, n, e),
      g = c.resolveNamedOptions(u, f, p, d)
    return g.$shared && ((g.$shared = l), (o[a] = Object.freeze(Qs(g, l)))), g
  }
  _resolveAnimations(t, e, s) {
    const n = this.chart,
      o = this._cachedDataOpts,
      a = `animation-${e}`,
      r = o[a]
    if (r) return r
    let l
    if (n.options.animation !== !1) {
      const h = this.chart.config,
        d = h.datasetAnimationScopeKeys(this._type, e),
        u = h.getOptionScopes(this.getDataset(), d)
      l = h.createResolver(u, this.getContext(t, s, e))
    }
    const c = new jo(n, l && l.animations)
    return l && l._cacheable && (o[a] = Object.freeze(c)), c
  }
  getSharedOptions(t) {
    if (t.$shared) return this._sharedOptions || (this._sharedOptions = Object.assign({}, t))
  }
  includeOptions(t, e) {
    return !e || Ti(t) || this.chart._animationsDisabled
  }
  _getSharedOptions(t, e) {
    const s = this.resolveDataElementOptions(t, e),
      n = this._sharedOptions,
      o = this.getSharedOptions(s),
      a = this.includeOptions(e, o) || o !== n
    return this.updateSharedOptions(o, e, s), { sharedOptions: o, includeOptions: a }
  }
  updateElement(t, e, s, n) {
    Ti(n) ? Object.assign(t, s) : this._resolveAnimations(e, n).update(t, s)
  }
  updateSharedOptions(t, e, s) {
    t && !Ti(e) && this._resolveAnimations(void 0, e).update(t, s)
  }
  _setStyle(t, e, s, n) {
    t.active = n
    const o = this.getStyle(e, n)
    this._resolveAnimations(e, s, n).update(t, { options: (!n && this.getSharedOptions(o)) || o })
  }
  removeHoverStyle(t, e, s) {
    this._setStyle(t, s, 'active', !1)
  }
  setHoverStyle(t, e, s) {
    this._setStyle(t, s, 'active', !0)
  }
  _removeDatasetHoverStyle() {
    const t = this._cachedMeta.dataset
    t && this._setStyle(t, void 0, 'active', !1)
  }
  _setDatasetHoverStyle() {
    const t = this._cachedMeta.dataset
    t && this._setStyle(t, void 0, 'active', !0)
  }
  _resyncElements(t) {
    const e = this._data,
      s = this._cachedMeta.data
    for (const [r, l, c] of this._syncList) this[r](l, c)
    this._syncList = []
    const n = s.length,
      o = e.length,
      a = Math.min(o, n)
    a && this.parse(0, a), o > n ? this._insertElements(n, o - n, t) : o < n && this._removeElements(o, n - o)
  }
  _insertElements(t, e, s = !0) {
    const n = this._cachedMeta,
      o = n.data,
      a = t + e
    let r
    const l = c => {
      for (c.length += e, r = c.length - 1; r >= a; r--) c[r] = c[r - e]
    }
    for (l(o), r = t; r < a; ++r) o[r] = new this.dataElementType()
    this._parsing && l(n._parsed), this.parse(t, e), s && this.updateElements(o, t, e, 'reset')
  }
  updateElements(t, e, s, n) {}
  _removeElements(t, e) {
    const s = this._cachedMeta
    if (this._parsing) {
      const n = s._parsed.splice(t, e)
      s._stacked && oe(s, n)
    }
    s.data.splice(t, e)
  }
  _sync(t) {
    if (this._parsing) this._syncList.push(t)
    else {
      const [e, s, n] = t
      this[e](s, n)
    }
    this.chart._dataChanges.push([this.index, ...t])
  }
  _onDataPush() {
    const t = arguments.length
    this._sync(['_insertElements', this.getDataset().data.length - t, t])
  }
  _onDataPop() {
    this._sync(['_removeElements', this._cachedMeta.data.length - 1, 1])
  }
  _onDataShift() {
    this._sync(['_removeElements', 0, 1])
  }
  _onDataSplice(t, e) {
    e && this._sync(['_removeElements', t, e])
    const s = arguments.length - 2
    s && this._sync(['_insertElements', t, s])
  }
  _onDataUnshift() {
    this._sync(['_insertElements', 0, arguments.length])
  }
}
C(lt, 'defaults', {}), C(lt, 'datasetElementType', null), C(lt, 'dataElementType', null)
function Rc(i, t) {
  if (!i._cache.$bar) {
    const e = i.getMatchingVisibleMetas(t)
    let s = []
    for (let n = 0, o = e.length; n < o; n++) s = s.concat(e[n].controller.getAllParsedValues(i))
    i._cache.$bar = Mo(s.sort((n, o) => n - o))
  }
  return i._cache.$bar
}
function Ic(i) {
  const t = i.iScale,
    e = Rc(t, i.type)
  let s = t._length,
    n,
    o,
    a,
    r
  const l = () => {
    a === 32767 || a === -32768 || (ot(r) && (s = Math.min(s, Math.abs(a - r) || s)), (r = a))
  }
  for (n = 0, o = e.length; n < o; ++n) (a = t.getPixelForValue(e[n])), l()
  for (r = void 0, n = 0, o = t.ticks.length; n < o; ++n) (a = t.getPixelForTick(n)), l()
  return s
}
function Fc(i, t, e, s) {
  const n = e.barThickness
  let o, a
  return (
    E(n) ? ((o = t.min * e.categoryPercentage), (a = e.barPercentage)) : ((o = n * s), (a = 1)),
    { chunk: o / s, ratio: a, start: t.pixels[i] - o / 2 }
  )
}
function zc(i, t, e, s) {
  const n = t.pixels,
    o = n[i]
  let a = i > 0 ? n[i - 1] : null,
    r = i < n.length - 1 ? n[i + 1] : null
  const l = e.categoryPercentage
  a === null && (a = o - (r === null ? t.end - t.start : r - o)), r === null && (r = o + o - a)
  const c = o - ((o - Math.min(a, r)) / 2) * l
  return { chunk: ((Math.abs(r - a) / 2) * l) / s, ratio: e.barPercentage, start: c }
}
function Bc(i, t, e, s) {
  const n = e.parse(i[0], s),
    o = e.parse(i[1], s),
    a = Math.min(n, o),
    r = Math.max(n, o)
  let l = a,
    c = r
  Math.abs(a) > Math.abs(r) && ((l = r), (c = a)),
    (t[e.axis] = c),
    (t._custom = { barStart: l, barEnd: c, start: n, end: o, min: a, max: r })
}
function Yo(i, t, e, s) {
  return B(i) ? Bc(i, t, e, s) : (t[e.axis] = e.parse(i, s)), t
}
function tn(i, t, e, s) {
  const n = i.iScale,
    o = i.vScale,
    a = n.getLabels(),
    r = n === o,
    l = []
  let c, h, d, u
  for (c = e, h = e + s; c < h; ++c)
    (u = t[c]), (d = {}), (d[n.axis] = r || n.parse(a[c], c)), l.push(Yo(u, d, o, c))
  return l
}
function Ai(i) {
  return i && i.barStart !== void 0 && i.barEnd !== void 0
}
function Hc(i, t, e) {
  return i !== 0 ? ft(i) : (t.isHorizontal() ? 1 : -1) * (t.min >= e ? 1 : -1)
}
function Nc(i) {
  let t, e, s, n, o
  return (
    i.horizontal
      ? ((t = i.base > i.x), (e = 'left'), (s = 'right'))
      : ((t = i.base < i.y), (e = 'bottom'), (s = 'top')),
    t ? ((n = 'end'), (o = 'start')) : ((n = 'start'), (o = 'end')),
    { start: e, end: s, reverse: t, top: n, bottom: o }
  )
}
function Wc(i, t, e, s) {
  let n = t.borderSkipped
  const o = {}
  if (!n) {
    i.borderSkipped = o
    return
  }
  if (n === !0) {
    i.borderSkipped = { top: !0, right: !0, bottom: !0, left: !0 }
    return
  }
  const { start: a, end: r, reverse: l, top: c, bottom: h } = Nc(i)
  n === 'middle' &&
    e &&
    ((i.enableBorderRadius = !0),
    (e._top || 0) === s ? (n = c) : (e._bottom || 0) === s ? (n = h) : ((o[en(h, a, r, l)] = !0), (n = c))),
    (o[en(n, a, r, l)] = !0),
    (i.borderSkipped = o)
}
function en(i, t, e, s) {
  return s ? ((i = Vc(i, t, e)), (i = sn(i, e, t))) : (i = sn(i, t, e)), i
}
function Vc(i, t, e) {
  return i === t ? e : i === e ? t : i
}
function sn(i, t, e) {
  return i === 'start' ? t : i === 'end' ? e : i
}
function $c(i, { inflateAmount: t }, e) {
  i.inflateAmount = t === 'auto' ? (e === 1 ? 0.33 : 0) : t
}
class Xe extends lt {
  parsePrimitiveData(t, e, s, n) {
    return tn(t, e, s, n)
  }
  parseArrayData(t, e, s, n) {
    return tn(t, e, s, n)
  }
  parseObjectData(t, e, s, n) {
    const { iScale: o, vScale: a } = t,
      { xAxisKey: r = 'x', yAxisKey: l = 'y' } = this._parsing,
      c = o.axis === 'x' ? r : l,
      h = a.axis === 'x' ? r : l,
      d = []
    let u, f, p, g
    for (u = s, f = s + n; u < f; ++u)
      (g = e[u]), (p = {}), (p[o.axis] = o.parse(Pt(g, c), u)), d.push(Yo(Pt(g, h), p, a, u))
    return d
  }
  updateRangeFromParsed(t, e, s, n) {
    super.updateRangeFromParsed(t, e, s, n)
    const o = s._custom
    o && e === this._cachedMeta.vScale && ((t.min = Math.min(t.min, o.min)), (t.max = Math.max(t.max, o.max)))
  }
  getMaxOverflow() {
    return 0
  }
  getLabelAndValue(t) {
    const e = this._cachedMeta,
      { iScale: s, vScale: n } = e,
      o = this.getParsed(t),
      a = o._custom,
      r = Ai(a) ? '[' + a.start + ', ' + a.end + ']' : '' + n.getLabelForValue(o[n.axis])
    return { label: '' + s.getLabelForValue(o[s.axis]), value: r }
  }
  initialize() {
    ;(this.enableOptionSharing = !0), super.initialize()
    const t = this._cachedMeta
    t.stack = this.getDataset().stack
  }
  update(t) {
    const e = this._cachedMeta
    this.updateElements(e.data, 0, e.data.length, t)
  }
  updateElements(t, e, s, n) {
    const o = n === 'reset',
      {
        index: a,
        _cachedMeta: { vScale: r },
      } = this,
      l = r.getBasePixel(),
      c = r.isHorizontal(),
      h = this._getRuler(),
      { sharedOptions: d, includeOptions: u } = this._getSharedOptions(e, n)
    for (let f = e; f < e + s; f++) {
      const p = this.getParsed(f),
        g = o || E(p[r.axis]) ? { base: l, head: l } : this._calculateBarValuePixels(f),
        m = this._calculateBarIndexPixels(f, h),
        b = (p._stacks || {})[r.axis],
        _ = {
          horizontal: c,
          base: g.base,
          enableBorderRadius: !b || Ai(p._custom) || a === b._top || a === b._bottom,
          x: c ? g.head : m.center,
          y: c ? m.center : g.head,
          height: c ? m.size : Math.abs(g.size),
          width: c ? Math.abs(g.size) : m.size,
        }
      u && (_.options = d || this.resolveDataElementOptions(f, t[f].active ? 'active' : n))
      const y = _.options || t[f].options
      Wc(_, y, b, a), $c(_, y, h.ratio), this.updateElement(t[f], f, _, n)
    }
  }
  _getStacks(t, e) {
    const { iScale: s } = this._cachedMeta,
      n = s.getMatchingVisibleMetas(this._type).filter(l => l.controller.options.grouped),
      o = s.options.stacked,
      a = [],
      r = l => {
        const c = l.controller.getParsed(e),
          h = c && c[l.vScale.axis]
        if (E(h) || isNaN(h)) return !0
      }
    for (const l of n)
      if (
        !(e !== void 0 && r(l)) &&
        ((o === !1 || a.indexOf(l.stack) === -1 || (o === void 0 && l.stack === void 0)) && a.push(l.stack),
        l.index === t)
      )
        break
    return a.length || a.push(void 0), a
  }
  _getStackCount(t) {
    return this._getStacks(void 0, t).length
  }
  _getStackIndex(t, e, s) {
    const n = this._getStacks(t, s),
      o = e !== void 0 ? n.indexOf(e) : -1
    return o === -1 ? n.length - 1 : o
  }
  _getRuler() {
    const t = this.options,
      e = this._cachedMeta,
      s = e.iScale,
      n = []
    let o, a
    for (o = 0, a = e.data.length; o < a; ++o) n.push(s.getPixelForValue(this.getParsed(o)[s.axis], o))
    const r = t.barThickness
    return {
      min: r || Ic(e),
      pixels: n,
      start: s._startPixel,
      end: s._endPixel,
      stackCount: this._getStackCount(),
      scale: s,
      grouped: t.grouped,
      ratio: r ? 1 : t.categoryPercentage * t.barPercentage,
    }
  }
  _calculateBarValuePixels(t) {
    const {
        _cachedMeta: { vScale: e, _stacked: s, index: n },
        options: { base: o, minBarLength: a },
      } = this,
      r = o || 0,
      l = this.getParsed(t),
      c = l._custom,
      h = Ai(c)
    let d = l[e.axis],
      u = 0,
      f = s ? this.applyStack(e, l, s) : d,
      p,
      g
    f !== d && ((u = f - d), (f = d)),
      h &&
        ((d = c.barStart),
        (f = c.barEnd - c.barStart),
        d !== 0 && ft(d) !== ft(c.barEnd) && (u = 0),
        (u += d))
    const m = !E(o) && !h ? o : u
    let b = e.getPixelForValue(m)
    if (
      (this.chart.getDataVisibility(t) ? (p = e.getPixelForValue(u + f)) : (p = b),
      (g = p - b),
      Math.abs(g) < a)
    ) {
      ;(g = Hc(g, e, r) * a), d === r && (b -= g / 2)
      const _ = e.getPixelForDecimal(0),
        y = e.getPixelForDecimal(1),
        v = Math.min(_, y),
        x = Math.max(_, y)
      ;(b = Math.max(Math.min(b, x), v)),
        (p = b + g),
        s && !h && (l._stacks[e.axis]._visualValues[n] = e.getValueForPixel(p) - e.getValueForPixel(b))
    }
    if (b === e.getPixelForValue(r)) {
      const _ = (ft(g) * e.getLineWidthForValue(r)) / 2
      ;(b += _), (g -= _)
    }
    return { size: g, base: b, head: p, center: p + g / 2 }
  }
  _calculateBarIndexPixels(t, e) {
    const s = e.scale,
      n = this.options,
      o = n.skipNull,
      a = T(n.maxBarThickness, 1 / 0)
    let r, l
    if (e.grouped) {
      const c = o ? this._getStackCount(t) : e.stackCount,
        h = n.barThickness === 'flex' ? zc(t, e, n, c) : Fc(t, e, n, c),
        d = this._getStackIndex(this.index, this._cachedMeta.stack, o ? t : void 0)
      ;(r = h.start + h.chunk * d + h.chunk / 2), (l = Math.min(a, h.chunk * h.ratio))
    } else (r = s.getPixelForValue(this.getParsed(t)[s.axis], t)), (l = Math.min(a, e.min * e.ratio))
    return { base: r - l / 2, head: r + l / 2, center: r, size: l }
  }
  draw() {
    const t = this._cachedMeta,
      e = t.vScale,
      s = t.data,
      n = s.length
    let o = 0
    for (; o < n; ++o) this.getParsed(o)[e.axis] !== null && s[o].draw(this._ctx)
  }
}
C(Xe, 'id', 'bar'),
  C(Xe, 'defaults', {
    datasetElementType: !1,
    dataElementType: 'bar',
    categoryPercentage: 0.8,
    barPercentage: 0.9,
    grouped: !0,
    animations: { numbers: { type: 'number', properties: ['x', 'y', 'base', 'width', 'height'] } },
  }),
  C(Xe, 'overrides', {
    scales: {
      _index_: { type: 'category', offset: !0, grid: { offset: !0 } },
      _value_: { type: 'linear', beginAtZero: !0 },
    },
  })
class Ke extends lt {
  initialize() {
    ;(this.enableOptionSharing = !0), super.initialize()
  }
  parsePrimitiveData(t, e, s, n) {
    const o = super.parsePrimitiveData(t, e, s, n)
    for (let a = 0; a < o.length; a++) o[a]._custom = this.resolveDataElementOptions(a + s).radius
    return o
  }
  parseArrayData(t, e, s, n) {
    const o = super.parseArrayData(t, e, s, n)
    for (let a = 0; a < o.length; a++) {
      const r = e[s + a]
      o[a]._custom = T(r[2], this.resolveDataElementOptions(a + s).radius)
    }
    return o
  }
  parseObjectData(t, e, s, n) {
    const o = super.parseObjectData(t, e, s, n)
    for (let a = 0; a < o.length; a++) {
      const r = e[s + a]
      o[a]._custom = T(r && r.r && +r.r, this.resolveDataElementOptions(a + s).radius)
    }
    return o
  }
  getMaxOverflow() {
    const t = this._cachedMeta.data
    let e = 0
    for (let s = t.length - 1; s >= 0; --s) e = Math.max(e, t[s].size(this.resolveDataElementOptions(s)) / 2)
    return e > 0 && e
  }
  getLabelAndValue(t) {
    const e = this._cachedMeta,
      s = this.chart.data.labels || [],
      { xScale: n, yScale: o } = e,
      a = this.getParsed(t),
      r = n.getLabelForValue(a.x),
      l = o.getLabelForValue(a.y),
      c = a._custom
    return { label: s[t] || '', value: '(' + r + ', ' + l + (c ? ', ' + c : '') + ')' }
  }
  update(t) {
    const e = this._cachedMeta.data
    this.updateElements(e, 0, e.length, t)
  }
  updateElements(t, e, s, n) {
    const o = n === 'reset',
      { iScale: a, vScale: r } = this._cachedMeta,
      { sharedOptions: l, includeOptions: c } = this._getSharedOptions(e, n),
      h = a.axis,
      d = r.axis
    for (let u = e; u < e + s; u++) {
      const f = t[u],
        p = !o && this.getParsed(u),
        g = {},
        m = (g[h] = o ? a.getPixelForDecimal(0.5) : a.getPixelForValue(p[h])),
        b = (g[d] = o ? r.getBasePixel() : r.getPixelForValue(p[d]))
      ;(g.skip = isNaN(m) || isNaN(b)),
        c &&
          ((g.options = l || this.resolveDataElementOptions(u, f.active ? 'active' : n)),
          o && (g.options.radius = 0)),
        this.updateElement(f, u, g, n)
    }
  }
  resolveDataElementOptions(t, e) {
    const s = this.getParsed(t)
    let n = super.resolveDataElementOptions(t, e)
    n.$shared && (n = Object.assign({}, n, { $shared: !1 }))
    const o = n.radius
    return e !== 'active' && (n.radius = 0), (n.radius += T(s && s._custom, o)), n
  }
}
C(Ke, 'id', 'bubble'),
  C(Ke, 'defaults', {
    datasetElementType: !1,
    dataElementType: 'point',
    animations: { numbers: { type: 'number', properties: ['x', 'y', 'borderWidth', 'radius'] } },
  }),
  C(Ke, 'overrides', { scales: { x: { type: 'linear' }, y: { type: 'linear' } } })
function jc(i, t, e) {
  let s = 1,
    n = 1,
    o = 0,
    a = 0
  if (t < H) {
    const r = i,
      l = r + t,
      c = Math.cos(r),
      h = Math.sin(r),
      d = Math.cos(l),
      u = Math.sin(l),
      f = (y, v, x) => (Me(y, r, l, !0) ? 1 : Math.max(v, v * e, x, x * e)),
      p = (y, v, x) => (Me(y, r, l, !0) ? -1 : Math.min(v, v * e, x, x * e)),
      g = f(0, c, d),
      m = f($, h, u),
      b = p(W, c, d),
      _ = p(W + $, h, u)
    ;(s = (g - b) / 2), (n = (m - _) / 2), (o = -(g + b) / 2), (a = -(m + _) / 2)
  }
  return { ratioX: s, ratioY: n, offsetX: o, offsetY: a }
}
class zt extends lt {
  constructor(t, e) {
    super(t, e),
      (this.enableOptionSharing = !0),
      (this.innerRadius = void 0),
      (this.outerRadius = void 0),
      (this.offsetX = void 0),
      (this.offsetY = void 0)
  }
  linkScales() {}
  parse(t, e) {
    const s = this.getDataset().data,
      n = this._cachedMeta
    if (this._parsing === !1) n._parsed = s
    else {
      let o = l => +s[l]
      if (O(s[t])) {
        const { key: l = 'value' } = this._parsing
        o = c => +Pt(s[c], l)
      }
      let a, r
      for (a = t, r = t + e; a < r; ++a) n._parsed[a] = o(a)
    }
  }
  _getRotation() {
    return rt(this.options.rotation - 90)
  }
  _getCircumference() {
    return rt(this.options.circumference)
  }
  _getRotationExtents() {
    let t = H,
      e = -H
    for (let s = 0; s < this.chart.data.datasets.length; ++s)
      if (this.chart.isDatasetVisible(s) && this.chart.getDatasetMeta(s).type === this._type) {
        const n = this.chart.getDatasetMeta(s).controller,
          o = n._getRotation(),
          a = n._getCircumference()
        ;(t = Math.min(t, o)), (e = Math.max(e, o + a))
      }
    return { rotation: t, circumference: e - t }
  }
  update(t) {
    const e = this.chart,
      { chartArea: s } = e,
      n = this._cachedMeta,
      o = n.data,
      a = this.getMaxBorderWidth() + this.getMaxOffset(o) + this.options.spacing,
      r = Math.max((Math.min(s.width, s.height) - a) / 2, 0),
      l = Math.min(nl(this.options.cutout, r), 1),
      c = this._getRingWeight(this.index),
      { circumference: h, rotation: d } = this._getRotationExtents(),
      { ratioX: u, ratioY: f, offsetX: p, offsetY: g } = jc(d, h, l),
      m = (s.width - a) / u,
      b = (s.height - a) / f,
      _ = Math.max(Math.min(m, b) / 2, 0),
      y = _o(this.options.radius, _),
      v = Math.max(y * l, 0),
      x = (y - v) / this._getVisibleDatasetWeightTotal()
    ;(this.offsetX = p * y),
      (this.offsetY = g * y),
      (n.total = this.calculateTotal()),
      (this.outerRadius = y - x * this._getRingWeightOffset(this.index)),
      (this.innerRadius = Math.max(this.outerRadius - x * c, 0)),
      this.updateElements(o, 0, o.length, t)
  }
  _circumference(t, e) {
    const s = this.options,
      n = this._cachedMeta,
      o = this._getCircumference()
    return (e && s.animation.animateRotate) ||
      !this.chart.getDataVisibility(t) ||
      n._parsed[t] === null ||
      n.data[t].hidden
      ? 0
      : this.calculateCircumference((n._parsed[t] * o) / H)
  }
  updateElements(t, e, s, n) {
    const o = n === 'reset',
      a = this.chart,
      r = a.chartArea,
      c = a.options.animation,
      h = (r.left + r.right) / 2,
      d = (r.top + r.bottom) / 2,
      u = o && c.animateScale,
      f = u ? 0 : this.innerRadius,
      p = u ? 0 : this.outerRadius,
      { sharedOptions: g, includeOptions: m } = this._getSharedOptions(e, n)
    let b = this._getRotation(),
      _
    for (_ = 0; _ < e; ++_) b += this._circumference(_, o)
    for (_ = e; _ < e + s; ++_) {
      const y = this._circumference(_, o),
        v = t[_],
        x = {
          x: h + this.offsetX,
          y: d + this.offsetY,
          startAngle: b,
          endAngle: b + y,
          circumference: y,
          outerRadius: p,
          innerRadius: f,
        }
      m && (x.options = g || this.resolveDataElementOptions(_, v.active ? 'active' : n)),
        (b += y),
        this.updateElement(v, _, x, n)
    }
  }
  calculateTotal() {
    const t = this._cachedMeta,
      e = t.data
    let s = 0,
      n
    for (n = 0; n < e.length; n++) {
      const o = t._parsed[n]
      o !== null && !isNaN(o) && this.chart.getDataVisibility(n) && !e[n].hidden && (s += Math.abs(o))
    }
    return s
  }
  calculateCircumference(t) {
    const e = this._cachedMeta.total
    return e > 0 && !isNaN(t) ? H * (Math.abs(t) / e) : 0
  }
  getLabelAndValue(t) {
    const e = this._cachedMeta,
      s = this.chart,
      n = s.data.labels || [],
      o = Ae(e._parsed[t], s.options.locale)
    return { label: n[t] || '', value: o }
  }
  getMaxBorderWidth(t) {
    let e = 0
    const s = this.chart
    let n, o, a, r, l
    if (!t) {
      for (n = 0, o = s.data.datasets.length; n < o; ++n)
        if (s.isDatasetVisible(n)) {
          ;(a = s.getDatasetMeta(n)), (t = a.data), (r = a.controller)
          break
        }
    }
    if (!t) return 0
    for (n = 0, o = t.length; n < o; ++n)
      (l = r.resolveDataElementOptions(n)),
        l.borderAlign !== 'inner' && (e = Math.max(e, l.borderWidth || 0, l.hoverBorderWidth || 0))
    return e
  }
  getMaxOffset(t) {
    let e = 0
    for (let s = 0, n = t.length; s < n; ++s) {
      const o = this.resolveDataElementOptions(s)
      e = Math.max(e, o.offset || 0, o.hoverOffset || 0)
    }
    return e
  }
  _getRingWeightOffset(t) {
    let e = 0
    for (let s = 0; s < t; ++s) this.chart.isDatasetVisible(s) && (e += this._getRingWeight(s))
    return e
  }
  _getRingWeight(t) {
    return Math.max(T(this.chart.data.datasets[t].weight, 1), 0)
  }
  _getVisibleDatasetWeightTotal() {
    return this._getRingWeightOffset(this.chart.data.datasets.length) || 1
  }
}
C(zt, 'id', 'doughnut'),
  C(zt, 'defaults', {
    datasetElementType: !1,
    dataElementType: 'arc',
    animation: { animateRotate: !0, animateScale: !1 },
    animations: {
      numbers: {
        type: 'number',
        properties: [
          'circumference',
          'endAngle',
          'innerRadius',
          'outerRadius',
          'startAngle',
          'x',
          'y',
          'offset',
          'borderWidth',
          'spacing',
        ],
      },
    },
    cutout: '50%',
    rotation: 0,
    circumference: 360,
    radius: '100%',
    spacing: 0,
    indexAxis: 'r',
  }),
  C(zt, 'descriptors', { _scriptable: t => t !== 'spacing', _indexable: t => t !== 'spacing' }),
  C(zt, 'overrides', {
    aspectRatio: 1,
    plugins: {
      legend: {
        labels: {
          generateLabels(t) {
            const e = t.data
            if (e.labels.length && e.datasets.length) {
              const {
                labels: { pointStyle: s, color: n },
              } = t.legend.options
              return e.labels.map((o, a) => {
                const l = t.getDatasetMeta(0).controller.getStyle(a)
                return {
                  text: o,
                  fillStyle: l.backgroundColor,
                  strokeStyle: l.borderColor,
                  fontColor: n,
                  lineWidth: l.borderWidth,
                  pointStyle: s,
                  hidden: !t.getDataVisibility(a),
                  index: a,
                }
              })
            }
            return []
          },
        },
        onClick(t, e, s) {
          s.chart.toggleDataVisibility(e.index), s.chart.update()
        },
      },
    },
  })
class Ge extends lt {
  initialize() {
    ;(this.enableOptionSharing = !0), (this.supportsDecimation = !0), super.initialize()
  }
  update(t) {
    const e = this._cachedMeta,
      { dataset: s, data: n = [], _dataset: o } = e,
      a = this.chart._animationsDisabled
    let { start: r, count: l } = Co(e, n, a)
    ;(this._drawStart = r),
      (this._drawCount = l),
      Po(e) && ((r = 0), (l = n.length)),
      (s._chart = this.chart),
      (s._datasetIndex = this.index),
      (s._decimated = !!o._decimated),
      (s.points = n)
    const c = this.resolveDatasetElementOptions(t)
    this.options.showLine || (c.borderWidth = 0),
      (c.segment = this.options.segment),
      this.updateElement(s, void 0, { animated: !a, options: c }, t),
      this.updateElements(n, r, l, t)
  }
  updateElements(t, e, s, n) {
    const o = n === 'reset',
      { iScale: a, vScale: r, _stacked: l, _dataset: c } = this._cachedMeta,
      { sharedOptions: h, includeOptions: d } = this._getSharedOptions(e, n),
      u = a.axis,
      f = r.axis,
      { spanGaps: p, segment: g } = this.options,
      m = Zt(p) ? p : Number.POSITIVE_INFINITY,
      b = this.chart._animationsDisabled || o || n === 'none',
      _ = e + s,
      y = t.length
    let v = e > 0 && this.getParsed(e - 1)
    for (let x = 0; x < y; ++x) {
      const w = t[x],
        M = b ? w : {}
      if (x < e || x >= _) {
        M.skip = !0
        continue
      }
      const S = this.getParsed(x),
        P = E(S[f]),
        A = (M[u] = a.getPixelForValue(S[u], x)),
        L = (M[f] = o || P ? r.getBasePixel() : r.getPixelForValue(l ? this.applyStack(r, S, l) : S[f], x))
      ;(M.skip = isNaN(A) || isNaN(L) || P),
        (M.stop = x > 0 && Math.abs(S[u] - v[u]) > m),
        g && ((M.parsed = S), (M.raw = c.data[x])),
        d && (M.options = h || this.resolveDataElementOptions(x, w.active ? 'active' : n)),
        b || this.updateElement(w, x, M, n),
        (v = S)
    }
  }
  getMaxOverflow() {
    const t = this._cachedMeta,
      e = t.dataset,
      s = (e.options && e.options.borderWidth) || 0,
      n = t.data || []
    if (!n.length) return s
    const o = n[0].size(this.resolveDataElementOptions(0)),
      a = n[n.length - 1].size(this.resolveDataElementOptions(n.length - 1))
    return Math.max(s, o, a) / 2
  }
  draw() {
    const t = this._cachedMeta
    t.dataset.updateControlPoints(this.chart.chartArea, t.iScale.axis), super.draw()
  }
}
C(Ge, 'id', 'line'),
  C(Ge, 'defaults', { datasetElementType: 'line', dataElementType: 'point', showLine: !0, spanGaps: !1 }),
  C(Ge, 'overrides', { scales: { _index_: { type: 'category' }, _value_: { type: 'linear' } } })
class ye extends lt {
  constructor(t, e) {
    super(t, e), (this.innerRadius = void 0), (this.outerRadius = void 0)
  }
  getLabelAndValue(t) {
    const e = this._cachedMeta,
      s = this.chart,
      n = s.data.labels || [],
      o = Ae(e._parsed[t].r, s.options.locale)
    return { label: n[t] || '', value: o }
  }
  parseObjectData(t, e, s, n) {
    return Fo.bind(this)(t, e, s, n)
  }
  update(t) {
    const e = this._cachedMeta.data
    this._updateRadius(), this.updateElements(e, 0, e.length, t)
  }
  getMinMax() {
    const t = this._cachedMeta,
      e = { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY }
    return (
      t.data.forEach((s, n) => {
        const o = this.getParsed(n).r
        !isNaN(o) && this.chart.getDataVisibility(n) && (o < e.min && (e.min = o), o > e.max && (e.max = o))
      }),
      e
    )
  }
  _updateRadius() {
    const t = this.chart,
      e = t.chartArea,
      s = t.options,
      n = Math.min(e.right - e.left, e.bottom - e.top),
      o = Math.max(n / 2, 0),
      a = Math.max(s.cutoutPercentage ? (o / 100) * s.cutoutPercentage : 1, 0),
      r = (o - a) / t.getVisibleDatasetCount()
    ;(this.outerRadius = o - r * this.index), (this.innerRadius = this.outerRadius - r)
  }
  updateElements(t, e, s, n) {
    const o = n === 'reset',
      a = this.chart,
      l = a.options.animation,
      c = this._cachedMeta.rScale,
      h = c.xCenter,
      d = c.yCenter,
      u = c.getIndexAngle(0) - 0.5 * W
    let f = u,
      p
    const g = 360 / this.countVisibleElements()
    for (p = 0; p < e; ++p) f += this._computeAngle(p, n, g)
    for (p = e; p < e + s; p++) {
      const m = t[p]
      let b = f,
        _ = f + this._computeAngle(p, n, g),
        y = a.getDataVisibility(p) ? c.getDistanceFromCenterForValue(this.getParsed(p).r) : 0
      ;(f = _), o && (l.animateScale && (y = 0), l.animateRotate && (b = _ = u))
      const v = {
        x: h,
        y: d,
        innerRadius: 0,
        outerRadius: y,
        startAngle: b,
        endAngle: _,
        options: this.resolveDataElementOptions(p, m.active ? 'active' : n),
      }
      this.updateElement(m, p, v, n)
    }
  }
  countVisibleElements() {
    const t = this._cachedMeta
    let e = 0
    return (
      t.data.forEach((s, n) => {
        !isNaN(this.getParsed(n).r) && this.chart.getDataVisibility(n) && e++
      }),
      e
    )
  }
  _computeAngle(t, e, s) {
    return this.chart.getDataVisibility(t) ? rt(this.resolveDataElementOptions(t, e).angle || s) : 0
  }
}
C(ye, 'id', 'polarArea'),
  C(ye, 'defaults', {
    dataElementType: 'arc',
    animation: { animateRotate: !0, animateScale: !0 },
    animations: {
      numbers: {
        type: 'number',
        properties: ['x', 'y', 'startAngle', 'endAngle', 'innerRadius', 'outerRadius'],
      },
    },
    indexAxis: 'r',
    startAngle: 0,
  }),
  C(ye, 'overrides', {
    aspectRatio: 1,
    plugins: {
      legend: {
        labels: {
          generateLabels(t) {
            const e = t.data
            if (e.labels.length && e.datasets.length) {
              const {
                labels: { pointStyle: s, color: n },
              } = t.legend.options
              return e.labels.map((o, a) => {
                const l = t.getDatasetMeta(0).controller.getStyle(a)
                return {
                  text: o,
                  fillStyle: l.backgroundColor,
                  strokeStyle: l.borderColor,
                  fontColor: n,
                  lineWidth: l.borderWidth,
                  pointStyle: s,
                  hidden: !t.getDataVisibility(a),
                  index: a,
                }
              })
            }
            return []
          },
        },
        onClick(t, e, s) {
          s.chart.toggleDataVisibility(e.index), s.chart.update()
        },
      },
    },
    scales: {
      r: {
        type: 'radialLinear',
        angleLines: { display: !1 },
        beginAtZero: !0,
        grid: { circular: !0 },
        pointLabels: { display: !1 },
        startAngle: 0,
      },
    },
  })
class Yi extends zt {}
C(Yi, 'id', 'pie'), C(Yi, 'defaults', { cutout: 0, rotation: 0, circumference: 360, radius: '100%' })
class Je extends lt {
  getLabelAndValue(t) {
    const e = this._cachedMeta.vScale,
      s = this.getParsed(t)
    return { label: e.getLabels()[t], value: '' + e.getLabelForValue(s[e.axis]) }
  }
  parseObjectData(t, e, s, n) {
    return Fo.bind(this)(t, e, s, n)
  }
  update(t) {
    const e = this._cachedMeta,
      s = e.dataset,
      n = e.data || [],
      o = e.iScale.getLabels()
    if (((s.points = n), t !== 'resize')) {
      const a = this.resolveDatasetElementOptions(t)
      this.options.showLine || (a.borderWidth = 0)
      const r = { _loop: !0, _fullLoop: o.length === n.length, options: a }
      this.updateElement(s, void 0, r, t)
    }
    this.updateElements(n, 0, n.length, t)
  }
  updateElements(t, e, s, n) {
    const o = this._cachedMeta.rScale,
      a = n === 'reset'
    for (let r = e; r < e + s; r++) {
      const l = t[r],
        c = this.resolveDataElementOptions(r, l.active ? 'active' : n),
        h = o.getPointPositionForValue(r, this.getParsed(r).r),
        d = a ? o.xCenter : h.x,
        u = a ? o.yCenter : h.y,
        f = { x: d, y: u, angle: h.angle, skip: isNaN(d) || isNaN(u), options: c }
      this.updateElement(l, r, f, n)
    }
  }
}
C(Je, 'id', 'radar'),
  C(Je, 'defaults', {
    datasetElementType: 'line',
    dataElementType: 'point',
    indexAxis: 'r',
    showLine: !0,
    elements: { line: { fill: 'start' } },
  }),
  C(Je, 'overrides', { aspectRatio: 1, scales: { r: { type: 'radialLinear' } } })
class Ze extends lt {
  getLabelAndValue(t) {
    const e = this._cachedMeta,
      s = this.chart.data.labels || [],
      { xScale: n, yScale: o } = e,
      a = this.getParsed(t),
      r = n.getLabelForValue(a.x),
      l = o.getLabelForValue(a.y)
    return { label: s[t] || '', value: '(' + r + ', ' + l + ')' }
  }
  update(t) {
    const e = this._cachedMeta,
      { data: s = [] } = e,
      n = this.chart._animationsDisabled
    let { start: o, count: a } = Co(e, s, n)
    if (
      ((this._drawStart = o),
      (this._drawCount = a),
      Po(e) && ((o = 0), (a = s.length)),
      this.options.showLine)
    ) {
      const { dataset: r, _dataset: l } = e
      ;(r._chart = this.chart),
        (r._datasetIndex = this.index),
        (r._decimated = !!l._decimated),
        (r.points = s)
      const c = this.resolveDatasetElementOptions(t)
      ;(c.segment = this.options.segment), this.updateElement(r, void 0, { animated: !n, options: c }, t)
    }
    this.updateElements(s, o, a, t)
  }
  addElements() {
    const { showLine: t } = this.options
    !this.datasetElementType && t && (this.datasetElementType = this.chart.registry.getElement('line')),
      super.addElements()
  }
  updateElements(t, e, s, n) {
    const o = n === 'reset',
      { iScale: a, vScale: r, _stacked: l, _dataset: c } = this._cachedMeta,
      h = this.resolveDataElementOptions(e, n),
      d = this.getSharedOptions(h),
      u = this.includeOptions(n, d),
      f = a.axis,
      p = r.axis,
      { spanGaps: g, segment: m } = this.options,
      b = Zt(g) ? g : Number.POSITIVE_INFINITY,
      _ = this.chart._animationsDisabled || o || n === 'none'
    let y = e > 0 && this.getParsed(e - 1)
    for (let v = e; v < e + s; ++v) {
      const x = t[v],
        w = this.getParsed(v),
        M = _ ? x : {},
        S = E(w[p]),
        P = (M[f] = a.getPixelForValue(w[f], v)),
        A = (M[p] = o || S ? r.getBasePixel() : r.getPixelForValue(l ? this.applyStack(r, w, l) : w[p], v))
      ;(M.skip = isNaN(P) || isNaN(A) || S),
        (M.stop = v > 0 && Math.abs(w[f] - y[f]) > b),
        m && ((M.parsed = w), (M.raw = c.data[v])),
        u && (M.options = d || this.resolveDataElementOptions(v, x.active ? 'active' : n)),
        _ || this.updateElement(x, v, M, n),
        (y = w)
    }
    this.updateSharedOptions(d, n, h)
  }
  getMaxOverflow() {
    const t = this._cachedMeta,
      e = t.data || []
    if (!this.options.showLine) {
      let r = 0
      for (let l = e.length - 1; l >= 0; --l)
        r = Math.max(r, e[l].size(this.resolveDataElementOptions(l)) / 2)
      return r > 0 && r
    }
    const s = t.dataset,
      n = (s.options && s.options.borderWidth) || 0
    if (!e.length) return n
    const o = e[0].size(this.resolveDataElementOptions(0)),
      a = e[e.length - 1].size(this.resolveDataElementOptions(e.length - 1))
    return Math.max(n, o, a) / 2
  }
}
C(Ze, 'id', 'scatter'),
  C(Ze, 'defaults', { datasetElementType: !1, dataElementType: 'point', showLine: !1, fill: !1 }),
  C(Ze, 'overrides', {
    interaction: { mode: 'point' },
    scales: { x: { type: 'linear' }, y: { type: 'linear' } },
  })
var Uc = Object.freeze({
  __proto__: null,
  BarController: Xe,
  BubbleController: Ke,
  DoughnutController: zt,
  LineController: Ge,
  PolarAreaController: ye,
  PieController: Yi,
  RadarController: Je,
  ScatterController: Ze,
})
function Et() {
  throw new Error('This method is not implemented: Check that a complete date adapter is provided.')
}
class _s {
  static override(t) {
    Object.assign(_s.prototype, t)
  }
  constructor(t) {
    this.options = t || {}
  }
  init() {}
  formats() {
    return Et()
  }
  parse() {
    return Et()
  }
  format() {
    return Et()
  }
  add() {
    return Et()
  }
  diff() {
    return Et()
  }
  startOf() {
    return Et()
  }
  endOf() {
    return Et()
  }
}
var Yc = { _date: _s }
function qc(i, t, e, s) {
  const { controller: n, data: o, _sorted: a } = i,
    r = n._cachedMeta.iScale
  if (r && t === r.axis && t !== 'r' && a && o.length) {
    const l = r._reversePixels ? ml : yt
    if (s) {
      if (n._sharedOptions) {
        const c = o[0],
          h = typeof c.getRange == 'function' && c.getRange(t)
        if (h) {
          const d = l(o, t, e - h),
            u = l(o, t, e + h)
          return { lo: d.lo, hi: u.hi }
        }
      }
    } else return l(o, t, e)
  }
  return { lo: 0, hi: o.length - 1 }
}
function Le(i, t, e, s, n) {
  const o = i.getSortedVisibleDatasetMetas(),
    a = e[t]
  for (let r = 0, l = o.length; r < l; ++r) {
    const { index: c, data: h } = o[r],
      { lo: d, hi: u } = qc(o[r], t, a, n)
    for (let f = d; f <= u; ++f) {
      const p = h[f]
      p.skip || s(p, c, f)
    }
  }
}
function Xc(i) {
  const t = i.indexOf('x') !== -1,
    e = i.indexOf('y') !== -1
  return function (s, n) {
    const o = t ? Math.abs(s.x - n.x) : 0,
      a = e ? Math.abs(s.y - n.y) : 0
    return Math.sqrt(Math.pow(o, 2) + Math.pow(a, 2))
  }
}
function Li(i, t, e, s, n) {
  const o = []
  return (
    (!n && !i.isPointInArea(t)) ||
      Le(
        i,
        e,
        t,
        function (r, l, c) {
          ;(!n && !ke(r, i.chartArea, 0)) ||
            (r.inRange(t.x, t.y, s) && o.push({ element: r, datasetIndex: l, index: c }))
        },
        !0
      ),
    o
  )
}
function Kc(i, t, e, s) {
  let n = []
  function o(a, r, l) {
    const { startAngle: c, endAngle: h } = a.getProps(['startAngle', 'endAngle'], s),
      { angle: d } = vo(a, { x: t.x, y: t.y })
    Me(d, c, h) && n.push({ element: a, datasetIndex: r, index: l })
  }
  return Le(i, e, t, o), n
}
function Gc(i, t, e, s, n, o) {
  let a = []
  const r = Xc(e)
  let l = Number.POSITIVE_INFINITY
  function c(h, d, u) {
    const f = h.inRange(t.x, t.y, n)
    if (s && !f) return
    const p = h.getCenterPoint(n)
    if (!(!!o || i.isPointInArea(p)) && !f) return
    const m = r(t, p)
    m < l
      ? ((a = [{ element: h, datasetIndex: d, index: u }]), (l = m))
      : m === l && a.push({ element: h, datasetIndex: d, index: u })
  }
  return Le(i, e, t, c), a
}
function Oi(i, t, e, s, n, o) {
  return !o && !i.isPointInArea(t) ? [] : e === 'r' && !s ? Kc(i, t, e, n) : Gc(i, t, e, s, n, o)
}
function nn(i, t, e, s, n) {
  const o = [],
    a = e === 'x' ? 'inXRange' : 'inYRange'
  let r = !1
  return (
    Le(i, e, t, (l, c, h) => {
      l[a](t[e], n) && (o.push({ element: l, datasetIndex: c, index: h }), (r = r || l.inRange(t.x, t.y, n)))
    }),
    s && !r ? [] : o
  )
}
var Jc = {
  evaluateInteractionItems: Le,
  modes: {
    index(i, t, e, s) {
      const n = It(t, i),
        o = e.axis || 'x',
        a = e.includeInvisible || !1,
        r = e.intersect ? Li(i, n, o, s, a) : Oi(i, n, o, !1, s, a),
        l = []
      return r.length
        ? (i.getSortedVisibleDatasetMetas().forEach(c => {
            const h = r[0].index,
              d = c.data[h]
            d && !d.skip && l.push({ element: d, datasetIndex: c.index, index: h })
          }),
          l)
        : []
    },
    dataset(i, t, e, s) {
      const n = It(t, i),
        o = e.axis || 'xy',
        a = e.includeInvisible || !1
      let r = e.intersect ? Li(i, n, o, s, a) : Oi(i, n, o, !1, s, a)
      if (r.length > 0) {
        const l = r[0].datasetIndex,
          c = i.getDatasetMeta(l).data
        r = []
        for (let h = 0; h < c.length; ++h) r.push({ element: c[h], datasetIndex: l, index: h })
      }
      return r
    },
    point(i, t, e, s) {
      const n = It(t, i),
        o = e.axis || 'xy',
        a = e.includeInvisible || !1
      return Li(i, n, o, s, a)
    },
    nearest(i, t, e, s) {
      const n = It(t, i),
        o = e.axis || 'xy',
        a = e.includeInvisible || !1
      return Oi(i, n, o, e.intersect, s, a)
    },
    x(i, t, e, s) {
      const n = It(t, i)
      return nn(i, n, 'x', e.intersect, s)
    },
    y(i, t, e, s) {
      const n = It(t, i)
      return nn(i, n, 'y', e.intersect, s)
    },
  },
}
const qo = ['left', 'top', 'right', 'bottom']
function ae(i, t) {
  return i.filter(e => e.pos === t)
}
function on(i, t) {
  return i.filter(e => qo.indexOf(e.pos) === -1 && e.box.axis === t)
}
function re(i, t) {
  return i.sort((e, s) => {
    const n = t ? s : e,
      o = t ? e : s
    return n.weight === o.weight ? n.index - o.index : n.weight - o.weight
  })
}
function Zc(i) {
  const t = []
  let e, s, n, o, a, r
  for (e = 0, s = (i || []).length; e < s; ++e)
    (n = i[e]),
      ({
        position: o,
        options: { stack: a, stackWeight: r = 1 },
      } = n),
      t.push({
        index: e,
        box: n,
        pos: o,
        horizontal: n.isHorizontal(),
        weight: n.weight,
        stack: a && o + a,
        stackWeight: r,
      })
  return t
}
function Qc(i) {
  const t = {}
  for (const e of i) {
    const { stack: s, pos: n, stackWeight: o } = e
    if (!s || !qo.includes(n)) continue
    const a = t[s] || (t[s] = { count: 0, placed: 0, weight: 0, size: 0 })
    a.count++, (a.weight += o)
  }
  return t
}
function th(i, t) {
  const e = Qc(i),
    { vBoxMaxWidth: s, hBoxMaxHeight: n } = t
  let o, a, r
  for (o = 0, a = i.length; o < a; ++o) {
    r = i[o]
    const { fullSize: l } = r.box,
      c = e[r.stack],
      h = c && r.stackWeight / c.weight
    r.horizontal
      ? ((r.width = h ? h * s : l && t.availableWidth), (r.height = n))
      : ((r.width = s), (r.height = h ? h * n : l && t.availableHeight))
  }
  return e
}
function eh(i) {
  const t = Zc(i),
    e = re(
      t.filter(c => c.box.fullSize),
      !0
    ),
    s = re(ae(t, 'left'), !0),
    n = re(ae(t, 'right')),
    o = re(ae(t, 'top'), !0),
    a = re(ae(t, 'bottom')),
    r = on(t, 'x'),
    l = on(t, 'y')
  return {
    fullSize: e,
    leftAndTop: s.concat(o),
    rightAndBottom: n.concat(l).concat(a).concat(r),
    chartArea: ae(t, 'chartArea'),
    vertical: s.concat(n).concat(l),
    horizontal: o.concat(a).concat(r),
  }
}
function an(i, t, e, s) {
  return Math.max(i[e], t[e]) + Math.max(i[s], t[s])
}
function Xo(i, t) {
  ;(i.top = Math.max(i.top, t.top)),
    (i.left = Math.max(i.left, t.left)),
    (i.bottom = Math.max(i.bottom, t.bottom)),
    (i.right = Math.max(i.right, t.right))
}
function ih(i, t, e, s) {
  const { pos: n, box: o } = e,
    a = i.maxPadding
  if (!O(n)) {
    e.size && (i[n] -= e.size)
    const d = s[e.stack] || { size: 0, count: 1 }
    ;(d.size = Math.max(d.size, e.horizontal ? o.height : o.width)),
      (e.size = d.size / d.count),
      (i[n] += e.size)
  }
  o.getPadding && Xo(a, o.getPadding())
  const r = Math.max(0, t.outerWidth - an(a, i, 'left', 'right')),
    l = Math.max(0, t.outerHeight - an(a, i, 'top', 'bottom')),
    c = r !== i.w,
    h = l !== i.h
  return (i.w = r), (i.h = l), e.horizontal ? { same: c, other: h } : { same: h, other: c }
}
function sh(i) {
  const t = i.maxPadding
  function e(s) {
    const n = Math.max(t[s] - i[s], 0)
    return (i[s] += n), n
  }
  ;(i.y += e('top')), (i.x += e('left')), e('right'), e('bottom')
}
function nh(i, t) {
  const e = t.maxPadding
  function s(n) {
    const o = { left: 0, top: 0, right: 0, bottom: 0 }
    return (
      n.forEach(a => {
        o[a] = Math.max(t[a], e[a])
      }),
      o
    )
  }
  return s(i ? ['left', 'right'] : ['top', 'bottom'])
}
function fe(i, t, e, s) {
  const n = []
  let o, a, r, l, c, h
  for (o = 0, a = i.length, c = 0; o < a; ++o) {
    ;(r = i[o]), (l = r.box), l.update(r.width || t.w, r.height || t.h, nh(r.horizontal, t))
    const { same: d, other: u } = ih(t, e, r, s)
    ;(c |= d && n.length), (h = h || u), l.fullSize || n.push(r)
  }
  return (c && fe(n, t, e, s)) || h
}
function Ne(i, t, e, s, n) {
  ;(i.top = e), (i.left = t), (i.right = t + s), (i.bottom = e + n), (i.width = s), (i.height = n)
}
function rn(i, t, e, s) {
  const n = e.padding
  let { x: o, y: a } = t
  for (const r of i) {
    const l = r.box,
      c = s[r.stack] || { count: 1, placed: 0, weight: 1 },
      h = r.stackWeight / c.weight || 1
    if (r.horizontal) {
      const d = t.w * h,
        u = c.size || l.height
      ot(c.start) && (a = c.start),
        l.fullSize ? Ne(l, n.left, a, e.outerWidth - n.right - n.left, u) : Ne(l, t.left + c.placed, a, d, u),
        (c.start = a),
        (c.placed += d),
        (a = l.bottom)
    } else {
      const d = t.h * h,
        u = c.size || l.width
      ot(c.start) && (o = c.start),
        l.fullSize ? Ne(l, o, n.top, u, e.outerHeight - n.bottom - n.top) : Ne(l, o, t.top + c.placed, u, d),
        (c.start = o),
        (c.placed += d),
        (o = l.right)
    }
  }
  ;(t.x = o), (t.y = a)
}
var J = {
  addBox(i, t) {
    i.boxes || (i.boxes = []),
      (t.fullSize = t.fullSize || !1),
      (t.position = t.position || 'top'),
      (t.weight = t.weight || 0),
      (t._layers =
        t._layers ||
        function () {
          return [
            {
              z: 0,
              draw(e) {
                t.draw(e)
              },
            },
          ]
        }),
      i.boxes.push(t)
  },
  removeBox(i, t) {
    const e = i.boxes ? i.boxes.indexOf(t) : -1
    e !== -1 && i.boxes.splice(e, 1)
  },
  configure(i, t, e) {
    ;(t.fullSize = e.fullSize), (t.position = e.position), (t.weight = e.weight)
  },
  update(i, t, e, s) {
    if (!i) return
    const n = Z(i.options.layout.padding),
      o = Math.max(t - n.width, 0),
      a = Math.max(e - n.height, 0),
      r = eh(i.boxes),
      l = r.vertical,
      c = r.horizontal
    I(i.boxes, g => {
      typeof g.beforeLayout == 'function' && g.beforeLayout()
    })
    const h = l.reduce((g, m) => (m.box.options && m.box.options.display === !1 ? g : g + 1), 0) || 1,
      d = Object.freeze({
        outerWidth: t,
        outerHeight: e,
        padding: n,
        availableWidth: o,
        availableHeight: a,
        vBoxMaxWidth: o / 2 / h,
        hBoxMaxHeight: a / 2,
      }),
      u = Object.assign({}, n)
    Xo(u, Z(s))
    const f = Object.assign({ maxPadding: u, w: o, h: a, x: n.left, y: n.top }, n),
      p = th(l.concat(c), d)
    fe(r.fullSize, f, d, p),
      fe(l, f, d, p),
      fe(c, f, d, p) && fe(l, f, d, p),
      sh(f),
      rn(r.leftAndTop, f, d, p),
      (f.x += f.w),
      (f.y += f.h),
      rn(r.rightAndBottom, f, d, p),
      (i.chartArea = {
        left: f.left,
        top: f.top,
        right: f.left + f.w,
        bottom: f.top + f.h,
        height: f.h,
        width: f.w,
      }),
      I(r.chartArea, g => {
        const m = g.box
        Object.assign(m, i.chartArea), m.update(f.w, f.h, { left: 0, top: 0, right: 0, bottom: 0 })
      })
  },
}
class Ko {
  acquireContext(t, e) {}
  releaseContext(t) {
    return !1
  }
  addEventListener(t, e, s) {}
  removeEventListener(t, e, s) {}
  getDevicePixelRatio() {
    return 1
  }
  getMaximumSize(t, e, s, n) {
    return (
      (e = Math.max(0, e || t.width)),
      (s = s || t.height),
      { width: e, height: Math.max(0, n ? Math.floor(e / n) : s) }
    )
  }
  isAttached(t) {
    return !0
  }
  updateConfig(t) {}
}
class oh extends Ko {
  acquireContext(t) {
    return (t && t.getContext && t.getContext('2d')) || null
  }
  updateConfig(t) {
    t.options.animation = !1
  }
}
const Qe = '$chartjs',
  ah = {
    touchstart: 'mousedown',
    touchmove: 'mousemove',
    touchend: 'mouseup',
    pointerenter: 'mouseenter',
    pointerdown: 'mousedown',
    pointermove: 'mousemove',
    pointerup: 'mouseup',
    pointerleave: 'mouseout',
    pointerout: 'mouseout',
  },
  ln = i => i === null || i === ''
function rh(i, t) {
  const e = i.style,
    s = i.getAttribute('height'),
    n = i.getAttribute('width')
  if (
    ((i[Qe] = {
      initial: { height: s, width: n, style: { display: e.display, height: e.height, width: e.width } },
    }),
    (e.display = e.display || 'block'),
    (e.boxSizing = e.boxSizing || 'border-box'),
    ln(n))
  ) {
    const o = $s(i, 'width')
    o !== void 0 && (i.width = o)
  }
  if (ln(s))
    if (i.style.height === '') i.height = i.width / (t || 2)
    else {
      const o = $s(i, 'height')
      o !== void 0 && (i.height = o)
    }
  return i
}
const Go = cc ? { passive: !0 } : !1
function lh(i, t, e) {
  i.addEventListener(t, e, Go)
}
function ch(i, t, e) {
  i.canvas.removeEventListener(t, e, Go)
}
function hh(i, t) {
  const e = ah[i.type] || i.type,
    { x: s, y: n } = It(i, t)
  return { type: e, chart: t, native: i, x: s !== void 0 ? s : null, y: n !== void 0 ? n : null }
}
function hi(i, t) {
  for (const e of i) if (e === t || e.contains(t)) return !0
}
function dh(i, t, e) {
  const s = i.canvas,
    n = new MutationObserver(o => {
      let a = !1
      for (const r of o) (a = a || hi(r.addedNodes, s)), (a = a && !hi(r.removedNodes, s))
      a && e()
    })
  return n.observe(document, { childList: !0, subtree: !0 }), n
}
function uh(i, t, e) {
  const s = i.canvas,
    n = new MutationObserver(o => {
      let a = !1
      for (const r of o) (a = a || hi(r.removedNodes, s)), (a = a && !hi(r.addedNodes, s))
      a && e()
    })
  return n.observe(document, { childList: !0, subtree: !0 }), n
}
const Ce = new Map()
let cn = 0
function Jo() {
  const i = window.devicePixelRatio
  i !== cn &&
    ((cn = i),
    Ce.forEach((t, e) => {
      e.currentDevicePixelRatio !== i && t()
    }))
}
function fh(i, t) {
  Ce.size || window.addEventListener('resize', Jo), Ce.set(i, t)
}
function ph(i) {
  Ce.delete(i), Ce.size || window.removeEventListener('resize', Jo)
}
function gh(i, t, e) {
  const s = i.canvas,
    n = s && bs(s)
  if (!n) return
  const o = So((r, l) => {
      const c = n.clientWidth
      e(r, l), c < n.clientWidth && e()
    }, window),
    a = new ResizeObserver(r => {
      const l = r[0],
        c = l.contentRect.width,
        h = l.contentRect.height
      ;(c === 0 && h === 0) || o(c, h)
    })
  return a.observe(n), fh(i, o), a
}
function Ei(i, t, e) {
  e && e.disconnect(), t === 'resize' && ph(i)
}
function mh(i, t, e) {
  const s = i.canvas,
    n = So(o => {
      i.ctx !== null && e(hh(o, i))
    }, i)
  return lh(s, t, n), n
}
class bh extends Ko {
  acquireContext(t, e) {
    const s = t && t.getContext && t.getContext('2d')
    return s && s.canvas === t ? (rh(t, e), s) : null
  }
  releaseContext(t) {
    const e = t.canvas
    if (!e[Qe]) return !1
    const s = e[Qe].initial
    ;['height', 'width'].forEach(o => {
      const a = s[o]
      E(a) ? e.removeAttribute(o) : e.setAttribute(o, a)
    })
    const n = s.style || {}
    return (
      Object.keys(n).forEach(o => {
        e.style[o] = n[o]
      }),
      (e.width = e.width),
      delete e[Qe],
      !0
    )
  }
  addEventListener(t, e, s) {
    this.removeEventListener(t, e)
    const n = t.$proxies || (t.$proxies = {}),
      a = { attach: dh, detach: uh, resize: gh }[e] || mh
    n[e] = a(t, e, s)
  }
  removeEventListener(t, e) {
    const s = t.$proxies || (t.$proxies = {}),
      n = s[e]
    if (!n) return
    ;(({ attach: Ei, detach: Ei, resize: Ei }[e] || ch)(t, e, n), (s[e] = void 0))
  }
  getDevicePixelRatio() {
    return window.devicePixelRatio
  }
  getMaximumSize(t, e, s, n) {
    return lc(t, e, s, n)
  }
  isAttached(t) {
    const e = bs(t)
    return !!(e && e.isConnected)
  }
}
function _h(i) {
  return !Bo() || (typeof OffscreenCanvas < 'u' && i instanceof OffscreenCanvas) ? oh : bh
}
class ct {
  constructor() {
    C(this, 'active', !1)
  }
  tooltipPosition(t) {
    const { x: e, y: s } = this.getProps(['x', 'y'], t)
    return { x: e, y: s }
  }
  hasValue() {
    return Zt(this.x) && Zt(this.y)
  }
  getProps(t, e) {
    const s = this.$animations
    if (!e || !s) return this
    const n = {}
    return (
      t.forEach(o => {
        n[o] = s[o] && s[o].active() ? s[o]._to : this[o]
      }),
      n
    )
  }
}
C(ct, 'defaults', {}), C(ct, 'defaultRoutes')
function xh(i, t) {
  const e = i.options.ticks,
    s = yh(i),
    n = Math.min(e.maxTicksLimit || s, s),
    o = e.major.enabled ? wh(t) : [],
    a = o.length,
    r = o[0],
    l = o[a - 1],
    c = []
  if (a > n) return Mh(t, c, o, a / n), c
  const h = vh(o, t, n)
  if (a > 0) {
    let d, u
    const f = a > 1 ? Math.round((l - r) / (a - 1)) : null
    for (We(t, c, h, E(f) ? 0 : r - f, r), d = 0, u = a - 1; d < u; d++) We(t, c, h, o[d], o[d + 1])
    return We(t, c, h, l, E(f) ? t.length : l + f), c
  }
  return We(t, c, h), c
}
function yh(i) {
  const t = i.options.offset,
    e = i._tickSize(),
    s = i._length / e + (t ? 0 : 1),
    n = i._maxLength / e
  return Math.floor(Math.min(s, n))
}
function vh(i, t, e) {
  const s = kh(i),
    n = t.length / e
  if (!s) return Math.max(n, 1)
  const o = ul(s)
  for (let a = 0, r = o.length - 1; a < r; a++) {
    const l = o[a]
    if (l > n) return l
  }
  return Math.max(n, 1)
}
function wh(i) {
  const t = []
  let e, s
  for (e = 0, s = i.length; e < s; e++) i[e].major && t.push(e)
  return t
}
function Mh(i, t, e, s) {
  let n = 0,
    o = e[0],
    a
  for (s = Math.ceil(s), a = 0; a < i.length; a++) a === o && (t.push(i[a]), n++, (o = e[n * s]))
}
function We(i, t, e, s, n) {
  const o = T(s, 0),
    a = Math.min(T(n, i.length), i.length)
  let r = 0,
    l,
    c,
    h
  for (e = Math.ceil(e), n && ((l = n - s), (e = l / Math.floor(l / e))), h = o; h < 0; )
    r++, (h = Math.round(o + r * e))
  for (c = Math.max(o, 0); c < a; c++) c === h && (t.push(i[c]), r++, (h = Math.round(o + r * e)))
}
function kh(i) {
  const t = i.length
  let e, s
  if (t < 2) return !1
  for (s = i[0], e = 1; e < t; ++e) if (i[e] - i[e - 1] !== s) return !1
  return s
}
const Sh = i => (i === 'left' ? 'right' : i === 'right' ? 'left' : i),
  hn = (i, t, e) => (t === 'top' || t === 'left' ? i[t] + e : i[t] - e),
  dn = (i, t) => Math.min(t || i, i)
function un(i, t) {
  const e = [],
    s = i.length / t,
    n = i.length
  let o = 0
  for (; o < n; o += s) e.push(i[Math.floor(o)])
  return e
}
function Ch(i, t, e) {
  const s = i.ticks.length,
    n = Math.min(t, s - 1),
    o = i._startPixel,
    a = i._endPixel,
    r = 1e-6
  let l = i.getPixelForTick(n),
    c
  if (
    !(
      e &&
      (s === 1
        ? (c = Math.max(l - o, a - l))
        : t === 0
        ? (c = (i.getPixelForTick(1) - l) / 2)
        : (c = (l - i.getPixelForTick(n - 1)) / 2),
      (l += n < t ? c : -c),
      l < o - r || l > a + r)
    )
  )
    return l
}
function Ph(i, t) {
  I(i, e => {
    const s = e.gc,
      n = s.length / 2
    let o
    if (n > t) {
      for (o = 0; o < n; ++o) delete e.data[s[o]]
      s.splice(0, n)
    }
  })
}
function le(i) {
  return i.drawTicks ? i.tickLength : 0
}
function fn(i, t) {
  if (!i.display) return 0
  const e = Y(i.font, t),
    s = Z(i.padding)
  return (B(i.text) ? i.text.length : 1) * e.lineHeight + s.height
}
function Dh(i, t) {
  return At(i, { scale: t, type: 'scale' })
}
function Th(i, t, e) {
  return At(i, { tick: e, index: t, type: 'tick' })
}
function Ah(i, t, e) {
  let s = us(i)
  return ((e && t !== 'right') || (!e && t === 'right')) && (s = Sh(s)), s
}
function Lh(i, t, e, s) {
  const { top: n, left: o, bottom: a, right: r, chart: l } = i,
    { chartArea: c, scales: h } = l
  let d = 0,
    u,
    f,
    p
  const g = a - n,
    m = r - o
  if (i.isHorizontal()) {
    if (((f = G(s, o, r)), O(e))) {
      const b = Object.keys(e)[0],
        _ = e[b]
      p = h[b].getPixelForValue(_) + g - t
    } else e === 'center' ? (p = (c.bottom + c.top) / 2 + g - t) : (p = hn(i, e, t))
    u = r - o
  } else {
    if (O(e)) {
      const b = Object.keys(e)[0],
        _ = e[b]
      f = h[b].getPixelForValue(_) - m + t
    } else e === 'center' ? (f = (c.left + c.right) / 2 - m + t) : (f = hn(i, e, t))
    ;(p = G(s, a, n)), (d = e === 'left' ? -$ : $)
  }
  return { titleX: f, titleY: p, maxWidth: u, rotation: d }
}
class jt extends ct {
  constructor(t) {
    super(),
      (this.id = t.id),
      (this.type = t.type),
      (this.options = void 0),
      (this.ctx = t.ctx),
      (this.chart = t.chart),
      (this.top = void 0),
      (this.bottom = void 0),
      (this.left = void 0),
      (this.right = void 0),
      (this.width = void 0),
      (this.height = void 0),
      (this._margins = { left: 0, right: 0, top: 0, bottom: 0 }),
      (this.maxWidth = void 0),
      (this.maxHeight = void 0),
      (this.paddingTop = void 0),
      (this.paddingBottom = void 0),
      (this.paddingLeft = void 0),
      (this.paddingRight = void 0),
      (this.axis = void 0),
      (this.labelRotation = void 0),
      (this.min = void 0),
      (this.max = void 0),
      (this._range = void 0),
      (this.ticks = []),
      (this._gridLineItems = null),
      (this._labelItems = null),
      (this._labelSizes = null),
      (this._length = 0),
      (this._maxLength = 0),
      (this._longestTextCache = {}),
      (this._startPixel = void 0),
      (this._endPixel = void 0),
      (this._reversePixels = !1),
      (this._userMax = void 0),
      (this._userMin = void 0),
      (this._suggestedMax = void 0),
      (this._suggestedMin = void 0),
      (this._ticksLength = 0),
      (this._borderValue = 0),
      (this._cache = {}),
      (this._dataLimitsCached = !1),
      (this.$context = void 0)
  }
  init(t) {
    ;(this.options = t.setContext(this.getContext())),
      (this.axis = t.axis),
      (this._userMin = this.parse(t.min)),
      (this._userMax = this.parse(t.max)),
      (this._suggestedMin = this.parse(t.suggestedMin)),
      (this._suggestedMax = this.parse(t.suggestedMax))
  }
  parse(t, e) {
    return t
  }
  getUserBounds() {
    let { _userMin: t, _userMax: e, _suggestedMin: s, _suggestedMax: n } = this
    return (
      (t = it(t, Number.POSITIVE_INFINITY)),
      (e = it(e, Number.NEGATIVE_INFINITY)),
      (s = it(s, Number.POSITIVE_INFINITY)),
      (n = it(n, Number.NEGATIVE_INFINITY)),
      { min: it(t, s), max: it(e, n), minDefined: V(t), maxDefined: V(e) }
    )
  }
  getMinMax(t) {
    let { min: e, max: s, minDefined: n, maxDefined: o } = this.getUserBounds(),
      a
    if (n && o) return { min: e, max: s }
    const r = this.getMatchingVisibleMetas()
    for (let l = 0, c = r.length; l < c; ++l)
      (a = r[l].controller.getMinMax(this, t)), n || (e = Math.min(e, a.min)), o || (s = Math.max(s, a.max))
    return (e = o && e > s ? s : e), (s = n && e > s ? e : s), { min: it(e, it(s, e)), max: it(s, it(e, s)) }
  }
  getPadding() {
    return {
      left: this.paddingLeft || 0,
      top: this.paddingTop || 0,
      right: this.paddingRight || 0,
      bottom: this.paddingBottom || 0,
    }
  }
  getTicks() {
    return this.ticks
  }
  getLabels() {
    const t = this.chart.data
    return this.options.labels || (this.isHorizontal() ? t.xLabels : t.yLabels) || t.labels || []
  }
  getLabelItems(t = this.chart.chartArea) {
    return this._labelItems || (this._labelItems = this._computeLabelItems(t))
  }
  beforeLayout() {
    ;(this._cache = {}), (this._dataLimitsCached = !1)
  }
  beforeUpdate() {
    z(this.options.beforeUpdate, [this])
  }
  update(t, e, s) {
    const { beginAtZero: n, grace: o, ticks: a } = this.options,
      r = a.sampleSize
    this.beforeUpdate(),
      (this.maxWidth = t),
      (this.maxHeight = e),
      (this._margins = s = Object.assign({ left: 0, right: 0, top: 0, bottom: 0 }, s)),
      (this.ticks = null),
      (this._labelSizes = null),
      (this._gridLineItems = null),
      (this._labelItems = null),
      this.beforeSetDimensions(),
      this.setDimensions(),
      this.afterSetDimensions(),
      (this._maxLength = this.isHorizontal()
        ? this.width + s.left + s.right
        : this.height + s.top + s.bottom),
      this._dataLimitsCached ||
        (this.beforeDataLimits(),
        this.determineDataLimits(),
        this.afterDataLimits(),
        (this._range = Nl(this, o, n)),
        (this._dataLimitsCached = !0)),
      this.beforeBuildTicks(),
      (this.ticks = this.buildTicks() || []),
      this.afterBuildTicks()
    const l = r < this.ticks.length
    this._convertTicksToLabels(l ? un(this.ticks, r) : this.ticks),
      this.configure(),
      this.beforeCalculateLabelRotation(),
      this.calculateLabelRotation(),
      this.afterCalculateLabelRotation(),
      a.display &&
        (a.autoSkip || a.source === 'auto') &&
        ((this.ticks = xh(this, this.ticks)), (this._labelSizes = null), this.afterAutoSkip()),
      l && this._convertTicksToLabels(this.ticks),
      this.beforeFit(),
      this.fit(),
      this.afterFit(),
      this.afterUpdate()
  }
  configure() {
    let t = this.options.reverse,
      e,
      s
    this.isHorizontal() ? ((e = this.left), (s = this.right)) : ((e = this.top), (s = this.bottom), (t = !t)),
      (this._startPixel = e),
      (this._endPixel = s),
      (this._reversePixels = t),
      (this._length = s - e),
      (this._alignToPixels = this.options.alignToPixels)
  }
  afterUpdate() {
    z(this.options.afterUpdate, [this])
  }
  beforeSetDimensions() {
    z(this.options.beforeSetDimensions, [this])
  }
  setDimensions() {
    this.isHorizontal()
      ? ((this.width = this.maxWidth), (this.left = 0), (this.right = this.width))
      : ((this.height = this.maxHeight), (this.top = 0), (this.bottom = this.height)),
      (this.paddingLeft = 0),
      (this.paddingTop = 0),
      (this.paddingRight = 0),
      (this.paddingBottom = 0)
  }
  afterSetDimensions() {
    z(this.options.afterSetDimensions, [this])
  }
  _callHooks(t) {
    this.chart.notifyPlugins(t, this.getContext()), z(this.options[t], [this])
  }
  beforeDataLimits() {
    this._callHooks('beforeDataLimits')
  }
  determineDataLimits() {}
  afterDataLimits() {
    this._callHooks('afterDataLimits')
  }
  beforeBuildTicks() {
    this._callHooks('beforeBuildTicks')
  }
  buildTicks() {
    return []
  }
  afterBuildTicks() {
    this._callHooks('afterBuildTicks')
  }
  beforeTickToLabelConversion() {
    z(this.options.beforeTickToLabelConversion, [this])
  }
  generateTickLabels(t) {
    const e = this.options.ticks
    let s, n, o
    for (s = 0, n = t.length; s < n; s++) (o = t[s]), (o.label = z(e.callback, [o.value, s, t], this))
  }
  afterTickToLabelConversion() {
    z(this.options.afterTickToLabelConversion, [this])
  }
  beforeCalculateLabelRotation() {
    z(this.options.beforeCalculateLabelRotation, [this])
  }
  calculateLabelRotation() {
    const t = this.options,
      e = t.ticks,
      s = dn(this.ticks.length, t.ticks.maxTicksLimit),
      n = e.minRotation || 0,
      o = e.maxRotation
    let a = n,
      r,
      l,
      c
    if (!this._isVisible() || !e.display || n >= o || s <= 1 || !this.isHorizontal()) {
      this.labelRotation = n
      return
    }
    const h = this._getLabelSizes(),
      d = h.widest.width,
      u = h.highest.height,
      f = q(this.chart.width - d, 0, this.maxWidth)
    ;(r = t.offset ? this.maxWidth / s : f / (s - 1)),
      d + 6 > r &&
        ((r = f / (s - (t.offset ? 0.5 : 1))),
        (l = this.maxHeight - le(t.grid) - e.padding - fn(t.title, this.chart.options.font)),
        (c = Math.sqrt(d * d + u * u)),
        (a = hs(
          Math.min(
            Math.asin(q((h.highest.height + 6) / r, -1, 1)),
            Math.asin(q(l / c, -1, 1)) - Math.asin(q(u / c, -1, 1))
          )
        )),
        (a = Math.max(n, Math.min(o, a)))),
      (this.labelRotation = a)
  }
  afterCalculateLabelRotation() {
    z(this.options.afterCalculateLabelRotation, [this])
  }
  afterAutoSkip() {}
  beforeFit() {
    z(this.options.beforeFit, [this])
  }
  fit() {
    const t = { width: 0, height: 0 },
      {
        chart: e,
        options: { ticks: s, title: n, grid: o },
      } = this,
      a = this._isVisible(),
      r = this.isHorizontal()
    if (a) {
      const l = fn(n, e.options.font)
      if (
        (r
          ? ((t.width = this.maxWidth), (t.height = le(o) + l))
          : ((t.height = this.maxHeight), (t.width = le(o) + l)),
        s.display && this.ticks.length)
      ) {
        const { first: c, last: h, widest: d, highest: u } = this._getLabelSizes(),
          f = s.padding * 2,
          p = rt(this.labelRotation),
          g = Math.cos(p),
          m = Math.sin(p)
        if (r) {
          const b = s.mirror ? 0 : m * d.width + g * u.height
          t.height = Math.min(this.maxHeight, t.height + b + f)
        } else {
          const b = s.mirror ? 0 : g * d.width + m * u.height
          t.width = Math.min(this.maxWidth, t.width + b + f)
        }
        this._calculatePadding(c, h, m, g)
      }
    }
    this._handleMargins(),
      r
        ? ((this.width = this._length = e.width - this._margins.left - this._margins.right),
          (this.height = t.height))
        : ((this.width = t.width),
          (this.height = this._length = e.height - this._margins.top - this._margins.bottom))
  }
  _calculatePadding(t, e, s, n) {
    const {
        ticks: { align: o, padding: a },
        position: r,
      } = this.options,
      l = this.labelRotation !== 0,
      c = r !== 'top' && this.axis === 'x'
    if (this.isHorizontal()) {
      const h = this.getPixelForTick(0) - this.left,
        d = this.right - this.getPixelForTick(this.ticks.length - 1)
      let u = 0,
        f = 0
      l
        ? c
          ? ((u = n * t.width), (f = s * e.height))
          : ((u = s * t.height), (f = n * e.width))
        : o === 'start'
        ? (f = e.width)
        : o === 'end'
        ? (u = t.width)
        : o !== 'inner' && ((u = t.width / 2), (f = e.width / 2)),
        (this.paddingLeft = Math.max(((u - h + a) * this.width) / (this.width - h), 0)),
        (this.paddingRight = Math.max(((f - d + a) * this.width) / (this.width - d), 0))
    } else {
      let h = e.height / 2,
        d = t.height / 2
      o === 'start' ? ((h = 0), (d = t.height)) : o === 'end' && ((h = e.height), (d = 0)),
        (this.paddingTop = h + a),
        (this.paddingBottom = d + a)
    }
  }
  _handleMargins() {
    this._margins &&
      ((this._margins.left = Math.max(this.paddingLeft, this._margins.left)),
      (this._margins.top = Math.max(this.paddingTop, this._margins.top)),
      (this._margins.right = Math.max(this.paddingRight, this._margins.right)),
      (this._margins.bottom = Math.max(this.paddingBottom, this._margins.bottom)))
  }
  afterFit() {
    z(this.options.afterFit, [this])
  }
  isHorizontal() {
    const { axis: t, position: e } = this.options
    return e === 'top' || e === 'bottom' || t === 'x'
  }
  isFullSize() {
    return this.options.fullSize
  }
  _convertTicksToLabels(t) {
    this.beforeTickToLabelConversion(), this.generateTickLabels(t)
    let e, s
    for (e = 0, s = t.length; e < s; e++) E(t[e].label) && (t.splice(e, 1), s--, e--)
    this.afterTickToLabelConversion()
  }
  _getLabelSizes() {
    let t = this._labelSizes
    if (!t) {
      const e = this.options.ticks.sampleSize
      let s = this.ticks
      e < s.length && (s = un(s, e)),
        (this._labelSizes = t = this._computeLabelSizes(s, s.length, this.options.ticks.maxTicksLimit))
    }
    return t
  }
  _computeLabelSizes(t, e, s) {
    const { ctx: n, _longestTextCache: o } = this,
      a = [],
      r = [],
      l = Math.floor(e / dn(e, s))
    let c = 0,
      h = 0,
      d,
      u,
      f,
      p,
      g,
      m,
      b,
      _,
      y,
      v,
      x
    for (d = 0; d < e; d += l) {
      if (
        ((p = t[d].label),
        (g = this._resolveTickFontOptions(d)),
        (n.font = m = g.string),
        (b = o[m] = o[m] || { data: {}, gc: [] }),
        (_ = g.lineHeight),
        (y = v = 0),
        !E(p) && !B(p))
      )
        (y = li(n, b.data, b.gc, y, p)), (v = _)
      else if (B(p))
        for (u = 0, f = p.length; u < f; ++u)
          (x = p[u]), !E(x) && !B(x) && ((y = li(n, b.data, b.gc, y, x)), (v += _))
      a.push(y), r.push(v), (c = Math.max(y, c)), (h = Math.max(v, h))
    }
    Ph(o, e)
    const w = a.indexOf(c),
      M = r.indexOf(h),
      S = P => ({ width: a[P] || 0, height: r[P] || 0 })
    return { first: S(0), last: S(e - 1), widest: S(w), highest: S(M), widths: a, heights: r }
  }
  getLabelForValue(t) {
    return t
  }
  getPixelForValue(t, e) {
    return NaN
  }
  getValueForPixel(t) {}
  getPixelForTick(t) {
    const e = this.ticks
    return t < 0 || t > e.length - 1 ? null : this.getPixelForValue(e[t].value)
  }
  getPixelForDecimal(t) {
    this._reversePixels && (t = 1 - t)
    const e = this._startPixel + t * this._length
    return gl(this._alignToPixels ? Ot(this.chart, e, 0) : e)
  }
  getDecimalForPixel(t) {
    const e = (t - this._startPixel) / this._length
    return this._reversePixels ? 1 - e : e
  }
  getBasePixel() {
    return this.getPixelForValue(this.getBaseValue())
  }
  getBaseValue() {
    const { min: t, max: e } = this
    return t < 0 && e < 0 ? e : t > 0 && e > 0 ? t : 0
  }
  getContext(t) {
    const e = this.ticks || []
    if (t >= 0 && t < e.length) {
      const s = e[t]
      return s.$context || (s.$context = Th(this.getContext(), t, s))
    }
    return this.$context || (this.$context = Dh(this.chart.getContext(), this))
  }
  _tickSize() {
    const t = this.options.ticks,
      e = rt(this.labelRotation),
      s = Math.abs(Math.cos(e)),
      n = Math.abs(Math.sin(e)),
      o = this._getLabelSizes(),
      a = t.autoSkipPadding || 0,
      r = o ? o.widest.width + a : 0,
      l = o ? o.highest.height + a : 0
    return this.isHorizontal() ? (l * s > r * n ? r / s : l / n) : l * n < r * s ? l / s : r / n
  }
  _isVisible() {
    const t = this.options.display
    return t !== 'auto' ? !!t : this.getMatchingVisibleMetas().length > 0
  }
  _computeGridLineItems(t) {
    const e = this.axis,
      s = this.chart,
      n = this.options,
      { grid: o, position: a, border: r } = n,
      l = o.offset,
      c = this.isHorizontal(),
      d = this.ticks.length + (l ? 1 : 0),
      u = le(o),
      f = [],
      p = r.setContext(this.getContext()),
      g = p.display ? p.width : 0,
      m = g / 2,
      b = function (N) {
        return Ot(s, N, g)
      }
    let _, y, v, x, w, M, S, P, A, L, R, X
    if (a === 'top')
      (_ = b(this.bottom)), (M = this.bottom - u), (P = _ - m), (L = b(t.top) + m), (X = t.bottom)
    else if (a === 'bottom')
      (_ = b(this.top)), (L = t.top), (X = b(t.bottom) - m), (M = _ + m), (P = this.top + u)
    else if (a === 'left')
      (_ = b(this.right)), (w = this.right - u), (S = _ - m), (A = b(t.left) + m), (R = t.right)
    else if (a === 'right')
      (_ = b(this.left)), (A = t.left), (R = b(t.right) - m), (w = _ + m), (S = this.left + u)
    else if (e === 'x') {
      if (a === 'center') _ = b((t.top + t.bottom) / 2 + 0.5)
      else if (O(a)) {
        const N = Object.keys(a)[0],
          j = a[N]
        _ = b(this.chart.scales[N].getPixelForValue(j))
      }
      ;(L = t.top), (X = t.bottom), (M = _ + m), (P = M + u)
    } else if (e === 'y') {
      if (a === 'center') _ = b((t.left + t.right) / 2)
      else if (O(a)) {
        const N = Object.keys(a)[0],
          j = a[N]
        _ = b(this.chart.scales[N].getPixelForValue(j))
      }
      ;(w = _ - m), (S = w - u), (A = t.left), (R = t.right)
    }
    const et = T(n.ticks.maxTicksLimit, d),
      F = Math.max(1, Math.ceil(d / et))
    for (y = 0; y < d; y += F) {
      const N = this.getContext(y),
        j = o.setContext(N),
        at = r.setContext(N),
        K = j.lineWidth,
        Ut = j.color,
        Oe = at.dash || [],
        Yt = at.dashOffset,
        ee = j.tickWidth,
        ie = j.tickColor,
        se = j.tickBorderDash || [],
        ne = j.tickBorderDashOffset
      ;(v = Ch(this, y, l)),
        v !== void 0 &&
          ((x = Ot(s, v, K)),
          c ? (w = S = A = R = x) : (M = P = L = X = x),
          f.push({
            tx1: w,
            ty1: M,
            tx2: S,
            ty2: P,
            x1: A,
            y1: L,
            x2: R,
            y2: X,
            width: K,
            color: Ut,
            borderDash: Oe,
            borderDashOffset: Yt,
            tickWidth: ee,
            tickColor: ie,
            tickBorderDash: se,
            tickBorderDashOffset: ne,
          }))
    }
    return (this._ticksLength = d), (this._borderValue = _), f
  }
  _computeLabelItems(t) {
    const e = this.axis,
      s = this.options,
      { position: n, ticks: o } = s,
      a = this.isHorizontal(),
      r = this.ticks,
      { align: l, crossAlign: c, padding: h, mirror: d } = o,
      u = le(s.grid),
      f = u + h,
      p = d ? -h : f,
      g = -rt(this.labelRotation),
      m = []
    let b,
      _,
      y,
      v,
      x,
      w,
      M,
      S,
      P,
      A,
      L,
      R,
      X = 'middle'
    if (n === 'top') (w = this.bottom - p), (M = this._getXAxisLabelAlignment())
    else if (n === 'bottom') (w = this.top + p), (M = this._getXAxisLabelAlignment())
    else if (n === 'left') {
      const F = this._getYAxisLabelAlignment(u)
      ;(M = F.textAlign), (x = F.x)
    } else if (n === 'right') {
      const F = this._getYAxisLabelAlignment(u)
      ;(M = F.textAlign), (x = F.x)
    } else if (e === 'x') {
      if (n === 'center') w = (t.top + t.bottom) / 2 + f
      else if (O(n)) {
        const F = Object.keys(n)[0],
          N = n[F]
        w = this.chart.scales[F].getPixelForValue(N) + f
      }
      M = this._getXAxisLabelAlignment()
    } else if (e === 'y') {
      if (n === 'center') x = (t.left + t.right) / 2 - f
      else if (O(n)) {
        const F = Object.keys(n)[0],
          N = n[F]
        x = this.chart.scales[F].getPixelForValue(N)
      }
      M = this._getYAxisLabelAlignment(u).textAlign
    }
    e === 'y' && (l === 'start' ? (X = 'top') : l === 'end' && (X = 'bottom'))
    const et = this._getLabelSizes()
    for (b = 0, _ = r.length; b < _; ++b) {
      ;(y = r[b]), (v = y.label)
      const F = o.setContext(this.getContext(b))
      ;(S = this.getPixelForTick(b) + o.labelOffset),
        (P = this._resolveTickFontOptions(b)),
        (A = P.lineHeight),
        (L = B(v) ? v.length : 1)
      const N = L / 2,
        j = F.color,
        at = F.textStrokeColor,
        K = F.textStrokeWidth
      let Ut = M
      a
        ? ((x = S),
          M === 'inner' &&
            (b === _ - 1
              ? (Ut = this.options.reverse ? 'left' : 'right')
              : b === 0
              ? (Ut = this.options.reverse ? 'right' : 'left')
              : (Ut = 'center')),
          n === 'top'
            ? c === 'near' || g !== 0
              ? (R = -L * A + A / 2)
              : c === 'center'
              ? (R = -et.highest.height / 2 - N * A + A)
              : (R = -et.highest.height + A / 2)
            : c === 'near' || g !== 0
            ? (R = A / 2)
            : c === 'center'
            ? (R = et.highest.height / 2 - N * A)
            : (R = et.highest.height - L * A),
          d && (R *= -1),
          g !== 0 && !F.showLabelBackdrop && (x += (A / 2) * Math.sin(g)))
        : ((w = S), (R = ((1 - L) * A) / 2))
      let Oe
      if (F.showLabelBackdrop) {
        const Yt = Z(F.backdropPadding),
          ee = et.heights[b],
          ie = et.widths[b]
        let se = R - Yt.top,
          ne = 0 - Yt.left
        switch (X) {
          case 'middle':
            se -= ee / 2
            break
          case 'bottom':
            se -= ee
            break
        }
        switch (M) {
          case 'center':
            ne -= ie / 2
            break
          case 'right':
            ne -= ie
            break
        }
        Oe = { left: ne, top: se, width: ie + Yt.width, height: ee + Yt.height, color: F.backdropColor }
      }
      m.push({
        label: v,
        font: P,
        textOffset: R,
        options: {
          rotation: g,
          color: j,
          strokeColor: at,
          strokeWidth: K,
          textAlign: Ut,
          textBaseline: X,
          translation: [x, w],
          backdrop: Oe,
        },
      })
    }
    return m
  }
  _getXAxisLabelAlignment() {
    const { position: t, ticks: e } = this.options
    if (-rt(this.labelRotation)) return t === 'top' ? 'left' : 'right'
    let n = 'center'
    return (
      e.align === 'start'
        ? (n = 'left')
        : e.align === 'end'
        ? (n = 'right')
        : e.align === 'inner' && (n = 'inner'),
      n
    )
  }
  _getYAxisLabelAlignment(t) {
    const {
        position: e,
        ticks: { crossAlign: s, mirror: n, padding: o },
      } = this.options,
      a = this._getLabelSizes(),
      r = t + o,
      l = a.widest.width
    let c, h
    return (
      e === 'left'
        ? n
          ? ((h = this.right + o),
            s === 'near'
              ? (c = 'left')
              : s === 'center'
              ? ((c = 'center'), (h += l / 2))
              : ((c = 'right'), (h += l)))
          : ((h = this.right - r),
            s === 'near'
              ? (c = 'right')
              : s === 'center'
              ? ((c = 'center'), (h -= l / 2))
              : ((c = 'left'), (h = this.left)))
        : e === 'right'
        ? n
          ? ((h = this.left + o),
            s === 'near'
              ? (c = 'right')
              : s === 'center'
              ? ((c = 'center'), (h -= l / 2))
              : ((c = 'left'), (h -= l)))
          : ((h = this.left + r),
            s === 'near'
              ? (c = 'left')
              : s === 'center'
              ? ((c = 'center'), (h += l / 2))
              : ((c = 'right'), (h = this.right)))
        : (c = 'right'),
      { textAlign: c, x: h }
    )
  }
  _computeLabelArea() {
    if (this.options.ticks.mirror) return
    const t = this.chart,
      e = this.options.position
    if (e === 'left' || e === 'right') return { top: 0, left: this.left, bottom: t.height, right: this.right }
    if (e === 'top' || e === 'bottom') return { top: this.top, left: 0, bottom: this.bottom, right: t.width }
  }
  drawBackground() {
    const {
      ctx: t,
      options: { backgroundColor: e },
      left: s,
      top: n,
      width: o,
      height: a,
    } = this
    e && (t.save(), (t.fillStyle = e), t.fillRect(s, n, o, a), t.restore())
  }
  getLineWidthForValue(t) {
    const e = this.options.grid
    if (!this._isVisible() || !e.display) return 0
    const n = this.ticks.findIndex(o => o.value === t)
    return n >= 0 ? e.setContext(this.getContext(n)).lineWidth : 0
  }
  drawGrid(t) {
    const e = this.options.grid,
      s = this.ctx,
      n = this._gridLineItems || (this._gridLineItems = this._computeGridLineItems(t))
    let o, a
    const r = (l, c, h) => {
      !h.width ||
        !h.color ||
        (s.save(),
        (s.lineWidth = h.width),
        (s.strokeStyle = h.color),
        s.setLineDash(h.borderDash || []),
        (s.lineDashOffset = h.borderDashOffset),
        s.beginPath(),
        s.moveTo(l.x, l.y),
        s.lineTo(c.x, c.y),
        s.stroke(),
        s.restore())
    }
    if (e.display)
      for (o = 0, a = n.length; o < a; ++o) {
        const l = n[o]
        e.drawOnChartArea && r({ x: l.x1, y: l.y1 }, { x: l.x2, y: l.y2 }, l),
          e.drawTicks &&
            r(
              { x: l.tx1, y: l.ty1 },
              { x: l.tx2, y: l.ty2 },
              {
                color: l.tickColor,
                width: l.tickWidth,
                borderDash: l.tickBorderDash,
                borderDashOffset: l.tickBorderDashOffset,
              }
            )
      }
  }
  drawBorder() {
    const {
        chart: t,
        ctx: e,
        options: { border: s, grid: n },
      } = this,
      o = s.setContext(this.getContext()),
      a = s.display ? o.width : 0
    if (!a) return
    const r = n.setContext(this.getContext(0)).lineWidth,
      l = this._borderValue
    let c, h, d, u
    this.isHorizontal()
      ? ((c = Ot(t, this.left, a) - a / 2), (h = Ot(t, this.right, r) + r / 2), (d = u = l))
      : ((d = Ot(t, this.top, a) - a / 2), (u = Ot(t, this.bottom, r) + r / 2), (c = h = l)),
      e.save(),
      (e.lineWidth = o.width),
      (e.strokeStyle = o.color),
      e.beginPath(),
      e.moveTo(c, d),
      e.lineTo(h, u),
      e.stroke(),
      e.restore()
  }
  drawLabels(t) {
    if (!this.options.ticks.display) return
    const s = this.ctx,
      n = this._computeLabelArea()
    n && bi(s, n)
    const o = this.getLabelItems(t)
    for (const a of o) {
      const r = a.options,
        l = a.font,
        c = a.label,
        h = a.textOffset
      $t(s, c, 0, h, l, r)
    }
    n && _i(s)
  }
  drawTitle() {
    const {
      ctx: t,
      options: { position: e, title: s, reverse: n },
    } = this
    if (!s.display) return
    const o = Y(s.font),
      a = Z(s.padding),
      r = s.align
    let l = o.lineHeight / 2
    e === 'bottom' || e === 'center' || O(e)
      ? ((l += a.bottom), B(s.text) && (l += o.lineHeight * (s.text.length - 1)))
      : (l += a.top)
    const { titleX: c, titleY: h, maxWidth: d, rotation: u } = Lh(this, l, e, r)
    $t(t, s.text, 0, 0, o, {
      color: s.color,
      maxWidth: d,
      rotation: u,
      textAlign: Ah(r, e, n),
      textBaseline: 'middle',
      translation: [c, h],
    })
  }
  draw(t) {
    this._isVisible() &&
      (this.drawBackground(), this.drawGrid(t), this.drawBorder(), this.drawTitle(), this.drawLabels(t))
  }
  _layers() {
    const t = this.options,
      e = (t.ticks && t.ticks.z) || 0,
      s = T(t.grid && t.grid.z, -1),
      n = T(t.border && t.border.z, 0)
    return !this._isVisible() || this.draw !== jt.prototype.draw
      ? [
          {
            z: e,
            draw: o => {
              this.draw(o)
            },
          },
        ]
      : [
          {
            z: s,
            draw: o => {
              this.drawBackground(), this.drawGrid(o), this.drawTitle()
            },
          },
          {
            z: n,
            draw: () => {
              this.drawBorder()
            },
          },
          {
            z: e,
            draw: o => {
              this.drawLabels(o)
            },
          },
        ]
  }
  getMatchingVisibleMetas(t) {
    const e = this.chart.getSortedVisibleDatasetMetas(),
      s = this.axis + 'AxisID',
      n = []
    let o, a
    for (o = 0, a = e.length; o < a; ++o) {
      const r = e[o]
      r[s] === this.id && (!t || r.type === t) && n.push(r)
    }
    return n
  }
  _resolveTickFontOptions(t) {
    const e = this.options.ticks.setContext(this.getContext(t))
    return Y(e.font)
  }
  _maxDigits() {
    const t = this._resolveTickFontOptions(0).lineHeight
    return (this.isHorizontal() ? this.width : this.height) / t
  }
}
class Ve {
  constructor(t, e, s) {
    ;(this.type = t), (this.scope = e), (this.override = s), (this.items = Object.create(null))
  }
  isForType(t) {
    return Object.prototype.isPrototypeOf.call(this.type.prototype, t.prototype)
  }
  register(t) {
    const e = Object.getPrototypeOf(t)
    let s
    Rh(e) && (s = this.register(e))
    const n = this.items,
      o = t.id,
      a = this.scope + '.' + o
    if (!o) throw new Error('class does not have id: ' + t)
    return o in n || ((n[o] = t), Oh(t, a, s), this.override && U.override(t.id, t.overrides)), a
  }
  get(t) {
    return this.items[t]
  }
  unregister(t) {
    const e = this.items,
      s = t.id,
      n = this.scope
    s in e && delete e[s], n && s in U[n] && (delete U[n][s], this.override && delete Vt[s])
  }
}
function Oh(i, t, e) {
  const s = we(Object.create(null), [e ? U.get(e) : {}, U.get(t), i.defaults])
  U.set(t, s), i.defaultRoutes && Eh(t, i.defaultRoutes), i.descriptors && U.describe(t, i.descriptors)
}
function Eh(i, t) {
  Object.keys(t).forEach(e => {
    const s = e.split('.'),
      n = s.pop(),
      o = [i].concat(s).join('.'),
      a = t[e].split('.'),
      r = a.pop(),
      l = a.join('.')
    U.route(o, n, l, r)
  })
}
function Rh(i) {
  return 'id' in i && 'defaults' in i
}
class Ih {
  constructor() {
    ;(this.controllers = new Ve(lt, 'datasets', !0)),
      (this.elements = new Ve(ct, 'elements')),
      (this.plugins = new Ve(Object, 'plugins')),
      (this.scales = new Ve(jt, 'scales')),
      (this._typedRegistries = [this.controllers, this.scales, this.elements])
  }
  add(...t) {
    this._each('register', t)
  }
  remove(...t) {
    this._each('unregister', t)
  }
  addControllers(...t) {
    this._each('register', t, this.controllers)
  }
  addElements(...t) {
    this._each('register', t, this.elements)
  }
  addPlugins(...t) {
    this._each('register', t, this.plugins)
  }
  addScales(...t) {
    this._each('register', t, this.scales)
  }
  getController(t) {
    return this._get(t, this.controllers, 'controller')
  }
  getElement(t) {
    return this._get(t, this.elements, 'element')
  }
  getPlugin(t) {
    return this._get(t, this.plugins, 'plugin')
  }
  getScale(t) {
    return this._get(t, this.scales, 'scale')
  }
  removeControllers(...t) {
    this._each('unregister', t, this.controllers)
  }
  removeElements(...t) {
    this._each('unregister', t, this.elements)
  }
  removePlugins(...t) {
    this._each('unregister', t, this.plugins)
  }
  removeScales(...t) {
    this._each('unregister', t, this.scales)
  }
  _each(t, e, s) {
    ;[...e].forEach(n => {
      const o = s || this._getRegistryForType(n)
      s || o.isForType(n) || (o === this.plugins && n.id)
        ? this._exec(t, o, n)
        : I(n, a => {
            const r = s || this._getRegistryForType(a)
            this._exec(t, r, a)
          })
    })
  }
  _exec(t, e, s) {
    const n = cs(t)
    z(s['before' + n], [], s), e[t](s), z(s['after' + n], [], s)
  }
  _getRegistryForType(t) {
    for (let e = 0; e < this._typedRegistries.length; e++) {
      const s = this._typedRegistries[e]
      if (s.isForType(t)) return s
    }
    return this.plugins
  }
  _get(t, e, s) {
    const n = e.get(t)
    if (n === void 0) throw new Error('"' + t + '" is not a registered ' + s + '.')
    return n
  }
}
var dt = new Ih()
class Fh {
  constructor() {
    this._init = []
  }
  notify(t, e, s, n) {
    e === 'beforeInit' &&
      ((this._init = this._createDescriptors(t, !0)), this._notify(this._init, t, 'install'))
    const o = n ? this._descriptors(t).filter(n) : this._descriptors(t),
      a = this._notify(o, t, e, s)
    return e === 'afterDestroy' && (this._notify(o, t, 'stop'), this._notify(this._init, t, 'uninstall')), a
  }
  _notify(t, e, s, n) {
    n = n || {}
    for (const o of t) {
      const a = o.plugin,
        r = a[s],
        l = [e, n, o.options]
      if (z(r, l, a) === !1 && n.cancelable) return !1
    }
    return !0
  }
  invalidate() {
    E(this._cache) || ((this._oldCache = this._cache), (this._cache = void 0))
  }
  _descriptors(t) {
    if (this._cache) return this._cache
    const e = (this._cache = this._createDescriptors(t))
    return this._notifyStateChanges(t), e
  }
  _createDescriptors(t, e) {
    const s = t && t.config,
      n = T(s.options && s.options.plugins, {}),
      o = zh(s)
    return n === !1 && !e ? [] : Hh(t, o, n, e)
  }
  _notifyStateChanges(t) {
    const e = this._oldCache || [],
      s = this._cache,
      n = (o, a) => o.filter(r => !a.some(l => r.plugin.id === l.plugin.id))
    this._notify(n(e, s), t, 'stop'), this._notify(n(s, e), t, 'start')
  }
}
function zh(i) {
  const t = {},
    e = [],
    s = Object.keys(dt.plugins.items)
  for (let o = 0; o < s.length; o++) e.push(dt.getPlugin(s[o]))
  const n = i.plugins || []
  for (let o = 0; o < n.length; o++) {
    const a = n[o]
    e.indexOf(a) === -1 && (e.push(a), (t[a.id] = !0))
  }
  return { plugins: e, localIds: t }
}
function Bh(i, t) {
  return !t && i === !1 ? null : i === !0 ? {} : i
}
function Hh(i, { plugins: t, localIds: e }, s, n) {
  const o = [],
    a = i.getContext()
  for (const r of t) {
    const l = r.id,
      c = Bh(s[l], n)
    c !== null && o.push({ plugin: r, options: Nh(i.config, { plugin: r, local: e[l] }, c, a) })
  }
  return o
}
function Nh(i, { plugin: t, local: e }, s, n) {
  const o = i.pluginScopeKeys(t),
    a = i.getOptionScopes(s, o)
  return (
    e && t.defaults && a.push(t.defaults),
    i.createResolver(a, n, [''], { scriptable: !1, indexable: !1, allKeys: !0 })
  )
}
function qi(i, t) {
  const e = U.datasets[i] || {}
  return ((t.datasets || {})[i] || {}).indexAxis || t.indexAxis || e.indexAxis || 'x'
}
function Wh(i, t) {
  let e = i
  return i === '_index_' ? (e = t) : i === '_value_' && (e = t === 'x' ? 'y' : 'x'), e
}
function Vh(i, t) {
  return i === t ? '_index_' : '_value_'
}
function $h(i) {
  if (i === 'top' || i === 'bottom') return 'x'
  if (i === 'left' || i === 'right') return 'y'
}
function di(i, t) {
  if (
    i === 'x' ||
    i === 'y' ||
    i === 'r' ||
    ((i = t.axis || $h(t.position) || (i.length > 1 && di(i[0].toLowerCase(), t))), i)
  )
    return i
  throw new Error(`Cannot determine type of '${name}' axis. Please provide 'axis' or 'position' option.`)
}
function jh(i, t) {
  const e = Vt[i.type] || { scales: {} },
    s = t.scales || {},
    n = qi(i.type, t),
    o = Object.create(null)
  return (
    Object.keys(s).forEach(a => {
      const r = s[a]
      if (!O(r)) return console.error(`Invalid scale configuration for scale: ${a}`)
      if (r._proxy) return console.warn(`Ignoring resolver passed as options for scale: ${a}`)
      const l = di(a, r),
        c = Vh(l, n),
        h = e.scales || {}
      o[a] = me(Object.create(null), [{ axis: l }, r, h[l], h[c]])
    }),
    i.data.datasets.forEach(a => {
      const r = a.type || i.type,
        l = a.indexAxis || qi(r, t),
        h = (Vt[r] || {}).scales || {}
      Object.keys(h).forEach(d => {
        const u = Wh(d, l),
          f = a[u + 'AxisID'] || u
        ;(o[f] = o[f] || Object.create(null)), me(o[f], [{ axis: u }, s[f], h[d]])
      })
    }),
    Object.keys(o).forEach(a => {
      const r = o[a]
      me(r, [U.scales[r.type], U.scale])
    }),
    o
  )
}
function Zo(i) {
  const t = i.options || (i.options = {})
  ;(t.plugins = T(t.plugins, {})), (t.scales = jh(i, t))
}
function Qo(i) {
  return (i = i || {}), (i.datasets = i.datasets || []), (i.labels = i.labels || []), i
}
function Uh(i) {
  return (i = i || {}), (i.data = Qo(i.data)), Zo(i), i
}
const pn = new Map(),
  ta = new Set()
function $e(i, t) {
  let e = pn.get(i)
  return e || ((e = t()), pn.set(i, e), ta.add(e)), e
}
const ce = (i, t, e) => {
  const s = Pt(t, e)
  s !== void 0 && i.add(s)
}
class Yh {
  constructor(t) {
    ;(this._config = Uh(t)), (this._scopeCache = new Map()), (this._resolverCache = new Map())
  }
  get platform() {
    return this._config.platform
  }
  get type() {
    return this._config.type
  }
  set type(t) {
    this._config.type = t
  }
  get data() {
    return this._config.data
  }
  set data(t) {
    this._config.data = Qo(t)
  }
  get options() {
    return this._config.options
  }
  set options(t) {
    this._config.options = t
  }
  get plugins() {
    return this._config.plugins
  }
  update() {
    const t = this._config
    this.clearCache(), Zo(t)
  }
  clearCache() {
    this._scopeCache.clear(), this._resolverCache.clear()
  }
  datasetScopeKeys(t) {
    return $e(t, () => [[`datasets.${t}`, '']])
  }
  datasetAnimationScopeKeys(t, e) {
    return $e(`${t}.transition.${e}`, () => [
      [`datasets.${t}.transitions.${e}`, `transitions.${e}`],
      [`datasets.${t}`, ''],
    ])
  }
  datasetElementScopeKeys(t, e) {
    return $e(`${t}-${e}`, () => [[`datasets.${t}.elements.${e}`, `datasets.${t}`, `elements.${e}`, '']])
  }
  pluginScopeKeys(t) {
    const e = t.id,
      s = this.type
    return $e(`${s}-plugin-${e}`, () => [[`plugins.${e}`, ...(t.additionalOptionScopes || [])]])
  }
  _cachedScopes(t, e) {
    const s = this._scopeCache
    let n = s.get(t)
    return (!n || e) && ((n = new Map()), s.set(t, n)), n
  }
  getOptionScopes(t, e, s) {
    const { options: n, type: o } = this,
      a = this._cachedScopes(t, s),
      r = a.get(e)
    if (r) return r
    const l = new Set()
    e.forEach(h => {
      t && (l.add(t), h.forEach(d => ce(l, t, d))),
        h.forEach(d => ce(l, n, d)),
        h.forEach(d => ce(l, Vt[o] || {}, d)),
        h.forEach(d => ce(l, U, d)),
        h.forEach(d => ce(l, ji, d))
    })
    const c = Array.from(l)
    return c.length === 0 && c.push(Object.create(null)), ta.has(e) && a.set(e, c), c
  }
  chartOptionScopes() {
    const { options: t, type: e } = this
    return [t, Vt[e] || {}, U.datasets[e] || {}, { type: e }, U, ji]
  }
  resolveNamedOptions(t, e, s, n = ['']) {
    const o = { $shared: !0 },
      { resolver: a, subPrefixes: r } = gn(this._resolverCache, t, n)
    let l = a
    if (Xh(a, e)) {
      ;(o.$shared = !1), (s = Dt(s) ? s() : s)
      const c = this.createResolver(t, s, r)
      l = Qt(a, s, c)
    }
    for (const c of e) o[c] = l[c]
    return o
  }
  createResolver(t, e, s = [''], n) {
    const { resolver: o } = gn(this._resolverCache, t, s)
    return O(e) ? Qt(o, e, void 0, n) : o
  }
}
function gn(i, t, e) {
  let s = i.get(t)
  s || ((s = new Map()), i.set(t, s))
  const n = e.join()
  let o = s.get(n)
  return (
    o ||
      ((o = { resolver: ps(t, e), subPrefixes: e.filter(r => !r.toLowerCase().includes('hover')) }),
      s.set(n, o)),
    o
  )
}
const qh = i => O(i) && Object.getOwnPropertyNames(i).reduce((t, e) => t || Dt(i[e]), !1)
function Xh(i, t) {
  const { isScriptable: e, isIndexable: s } = Oo(i)
  for (const n of t) {
    const o = e(n),
      a = s(n),
      r = (a || o) && i[n]
    if ((o && (Dt(r) || qh(r))) || (a && B(r))) return !0
  }
  return !1
}
var Kh = '4.2.1'
const Gh = ['top', 'bottom', 'left', 'right', 'chartArea']
function mn(i, t) {
  return i === 'top' || i === 'bottom' || (Gh.indexOf(i) === -1 && t === 'x')
}
function bn(i, t) {
  return function (e, s) {
    return e[i] === s[i] ? e[t] - s[t] : e[i] - s[i]
  }
}
function _n(i) {
  const t = i.chart,
    e = t.options.animation
  t.notifyPlugins('afterRender'), z(e && e.onComplete, [i], t)
}
function Jh(i) {
  const t = i.chart,
    e = t.options.animation
  z(e && e.onProgress, [i], t)
}
function ea(i) {
  return (
    Bo() && typeof i == 'string' ? (i = document.getElementById(i)) : i && i.length && (i = i[0]),
    i && i.canvas && (i = i.canvas),
    i
  )
}
const ti = {},
  xn = i => {
    const t = ea(i)
    return Object.values(ti)
      .filter(e => e.canvas === t)
      .pop()
  }
function Zh(i, t, e) {
  const s = Object.keys(i)
  for (const n of s) {
    const o = +n
    if (o >= t) {
      const a = i[n]
      delete i[n], (e > 0 || o > t) && (i[o + e] = a)
    }
  }
}
function Qh(i, t, e, s) {
  return !e || i.type === 'mouseout' ? null : s ? t : i
}
function td(i) {
  const { xScale: t, yScale: e } = i
  if (t && e) return { left: t.left, right: t.right, top: e.top, bottom: e.bottom }
}
class ut {
  static register(...t) {
    dt.add(...t), yn()
  }
  static unregister(...t) {
    dt.remove(...t), yn()
  }
  constructor(t, e) {
    const s = (this.config = new Yh(e)),
      n = ea(t),
      o = xn(n)
    if (o)
      throw new Error(
        "Canvas is already in use. Chart with ID '" +
          o.id +
          "' must be destroyed before the canvas with ID '" +
          o.canvas.id +
          "' can be reused."
      )
    const a = s.createResolver(s.chartOptionScopes(), this.getContext())
    ;(this.platform = new (s.platform || _h(n))()), this.platform.updateConfig(s)
    const r = this.platform.acquireContext(n, a.aspectRatio),
      l = r && r.canvas,
      c = l && l.height,
      h = l && l.width
    if (
      ((this.id = sl()),
      (this.ctx = r),
      (this.canvas = l),
      (this.width = h),
      (this.height = c),
      (this._options = a),
      (this._aspectRatio = this.aspectRatio),
      (this._layers = []),
      (this._metasets = []),
      (this._stacks = void 0),
      (this.boxes = []),
      (this.currentDevicePixelRatio = void 0),
      (this.chartArea = void 0),
      (this._active = []),
      (this._lastEvent = void 0),
      (this._listeners = {}),
      (this._responsiveListeners = void 0),
      (this._sortedMetasets = []),
      (this.scales = {}),
      (this._plugins = new Fh()),
      (this.$proxies = {}),
      (this._hiddenIndices = {}),
      (this.attached = !1),
      (this._animationsDisabled = void 0),
      (this.$context = void 0),
      (this._doResize = xl(d => this.update(d), a.resizeDelay || 0)),
      (this._dataChanges = []),
      (ti[this.id] = this),
      !r || !l)
    ) {
      console.error("Failed to create chart: can't acquire context from the given item")
      return
    }
    gt.listen(this, 'complete', _n),
      gt.listen(this, 'progress', Jh),
      this._initialize(),
      this.attached && this.update()
  }
  get aspectRatio() {
    const {
      options: { aspectRatio: t, maintainAspectRatio: e },
      width: s,
      height: n,
      _aspectRatio: o,
    } = this
    return E(t) ? (e && o ? o : n ? s / n : null) : t
  }
  get data() {
    return this.config.data
  }
  set data(t) {
    this.config.data = t
  }
  get options() {
    return this._options
  }
  set options(t) {
    this.config.options = t
  }
  get registry() {
    return dt
  }
  _initialize() {
    return (
      this.notifyPlugins('beforeInit'),
      this.options.responsive ? this.resize() : Vs(this, this.options.devicePixelRatio),
      this.bindEvents(),
      this.notifyPlugins('afterInit'),
      this
    )
  }
  clear() {
    return Hs(this.canvas, this.ctx), this
  }
  stop() {
    return gt.stop(this), this
  }
  resize(t, e) {
    gt.running(this) ? (this._resizeBeforeDraw = { width: t, height: e }) : this._resize(t, e)
  }
  _resize(t, e) {
    const s = this.options,
      n = this.canvas,
      o = s.maintainAspectRatio && this.aspectRatio,
      a = this.platform.getMaximumSize(n, t, e, o),
      r = s.devicePixelRatio || this.platform.getDevicePixelRatio(),
      l = this.width ? 'resize' : 'attach'
    ;(this.width = a.width),
      (this.height = a.height),
      (this._aspectRatio = this.aspectRatio),
      Vs(this, r, !0) &&
        (this.notifyPlugins('resize', { size: a }),
        z(s.onResize, [this, a], this),
        this.attached && this._doResize(l) && this.render())
  }
  ensureScalesHaveIDs() {
    const e = this.options.scales || {}
    I(e, (s, n) => {
      s.id = n
    })
  }
  buildOrUpdateScales() {
    const t = this.options,
      e = t.scales,
      s = this.scales,
      n = Object.keys(s).reduce((a, r) => ((a[r] = !1), a), {})
    let o = []
    e &&
      (o = o.concat(
        Object.keys(e).map(a => {
          const r = e[a],
            l = di(a, r),
            c = l === 'r',
            h = l === 'x'
          return {
            options: r,
            dposition: c ? 'chartArea' : h ? 'bottom' : 'left',
            dtype: c ? 'radialLinear' : h ? 'category' : 'linear',
          }
        })
      )),
      I(o, a => {
        const r = a.options,
          l = r.id,
          c = di(l, r),
          h = T(r.type, a.dtype)
        ;(r.position === void 0 || mn(r.position, c) !== mn(a.dposition)) && (r.position = a.dposition),
          (n[l] = !0)
        let d = null
        if (l in s && s[l].type === h) d = s[l]
        else {
          const u = dt.getScale(h)
          ;(d = new u({ id: l, type: h, ctx: this.ctx, chart: this })), (s[d.id] = d)
        }
        d.init(r, t)
      }),
      I(n, (a, r) => {
        a || delete s[r]
      }),
      I(s, a => {
        J.configure(this, a, a.options), J.addBox(this, a)
      })
  }
  _updateMetasets() {
    const t = this._metasets,
      e = this.data.datasets.length,
      s = t.length
    if ((t.sort((n, o) => n.index - o.index), s > e)) {
      for (let n = e; n < s; ++n) this._destroyDatasetMeta(n)
      t.splice(e, s - e)
    }
    this._sortedMetasets = t.slice(0).sort(bn('order', 'index'))
  }
  _removeUnreferencedMetasets() {
    const {
      _metasets: t,
      data: { datasets: e },
    } = this
    t.length > e.length && delete this._stacks,
      t.forEach((s, n) => {
        e.filter(o => o === s._dataset).length === 0 && this._destroyDatasetMeta(n)
      })
  }
  buildOrUpdateControllers() {
    const t = [],
      e = this.data.datasets
    let s, n
    for (this._removeUnreferencedMetasets(), s = 0, n = e.length; s < n; s++) {
      const o = e[s]
      let a = this.getDatasetMeta(s)
      const r = o.type || this.config.type
      if (
        (a.type && a.type !== r && (this._destroyDatasetMeta(s), (a = this.getDatasetMeta(s))),
        (a.type = r),
        (a.indexAxis = o.indexAxis || qi(r, this.options)),
        (a.order = o.order || 0),
        (a.index = s),
        (a.label = '' + o.label),
        (a.visible = this.isDatasetVisible(s)),
        a.controller)
      )
        a.controller.updateIndex(s), a.controller.linkScales()
      else {
        const l = dt.getController(r),
          { datasetElementType: c, dataElementType: h } = U.datasets[r]
        Object.assign(l, { dataElementType: dt.getElement(h), datasetElementType: c && dt.getElement(c) }),
          (a.controller = new l(this, s)),
          t.push(a.controller)
      }
    }
    return this._updateMetasets(), t
  }
  _resetElements() {
    I(
      this.data.datasets,
      (t, e) => {
        this.getDatasetMeta(e).controller.reset()
      },
      this
    )
  }
  reset() {
    this._resetElements(), this.notifyPlugins('reset')
  }
  update(t) {
    const e = this.config
    e.update()
    const s = (this._options = e.createResolver(e.chartOptionScopes(), this.getContext())),
      n = (this._animationsDisabled = !s.animation)
    if (
      (this._updateScales(),
      this._checkEventBindings(),
      this._updateHiddenIndices(),
      this._plugins.invalidate(),
      this.notifyPlugins('beforeUpdate', { mode: t, cancelable: !0 }) === !1)
    )
      return
    const o = this.buildOrUpdateControllers()
    this.notifyPlugins('beforeElementsUpdate')
    let a = 0
    for (let c = 0, h = this.data.datasets.length; c < h; c++) {
      const { controller: d } = this.getDatasetMeta(c),
        u = !n && o.indexOf(d) === -1
      d.buildOrUpdateElements(u), (a = Math.max(+d.getMaxOverflow(), a))
    }
    ;(a = this._minPadding = s.layout.autoPadding ? a : 0),
      this._updateLayout(a),
      n ||
        I(o, c => {
          c.reset()
        }),
      this._updateDatasets(t),
      this.notifyPlugins('afterUpdate', { mode: t }),
      this._layers.sort(bn('z', '_idx'))
    const { _active: r, _lastEvent: l } = this
    l ? this._eventHandler(l, !0) : r.length && this._updateHoverStyles(r, r, !0), this.render()
  }
  _updateScales() {
    I(this.scales, t => {
      J.removeBox(this, t)
    }),
      this.ensureScalesHaveIDs(),
      this.buildOrUpdateScales()
  }
  _checkEventBindings() {
    const t = this.options,
      e = new Set(Object.keys(this._listeners)),
      s = new Set(t.events)
    ;(!As(e, s) || !!this._responsiveListeners !== t.responsive) && (this.unbindEvents(), this.bindEvents())
  }
  _updateHiddenIndices() {
    const { _hiddenIndices: t } = this,
      e = this._getUniformDataChanges() || []
    for (const { method: s, start: n, count: o } of e) {
      const a = s === '_removeElements' ? -o : o
      Zh(t, n, a)
    }
  }
  _getUniformDataChanges() {
    const t = this._dataChanges
    if (!t || !t.length) return
    this._dataChanges = []
    const e = this.data.datasets.length,
      s = o => new Set(t.filter(a => a[0] === o).map((a, r) => r + ',' + a.splice(1).join(','))),
      n = s(0)
    for (let o = 1; o < e; o++) if (!As(n, s(o))) return
    return Array.from(n)
      .map(o => o.split(','))
      .map(o => ({ method: o[1], start: +o[2], count: +o[3] }))
  }
  _updateLayout(t) {
    if (this.notifyPlugins('beforeLayout', { cancelable: !0 }) === !1) return
    J.update(this, this.width, this.height, t)
    const e = this.chartArea,
      s = e.width <= 0 || e.height <= 0
    ;(this._layers = []),
      I(
        this.boxes,
        n => {
          ;(s && n.position === 'chartArea') ||
            (n.configure && n.configure(), this._layers.push(...n._layers()))
        },
        this
      ),
      this._layers.forEach((n, o) => {
        n._idx = o
      }),
      this.notifyPlugins('afterLayout')
  }
  _updateDatasets(t) {
    if (this.notifyPlugins('beforeDatasetsUpdate', { mode: t, cancelable: !0 }) !== !1) {
      for (let e = 0, s = this.data.datasets.length; e < s; ++e) this.getDatasetMeta(e).controller.configure()
      for (let e = 0, s = this.data.datasets.length; e < s; ++e)
        this._updateDataset(e, Dt(t) ? t({ datasetIndex: e }) : t)
      this.notifyPlugins('afterDatasetsUpdate', { mode: t })
    }
  }
  _updateDataset(t, e) {
    const s = this.getDatasetMeta(t),
      n = { meta: s, index: t, mode: e, cancelable: !0 }
    this.notifyPlugins('beforeDatasetUpdate', n) !== !1 &&
      (s.controller._update(e), (n.cancelable = !1), this.notifyPlugins('afterDatasetUpdate', n))
  }
  render() {
    this.notifyPlugins('beforeRender', { cancelable: !0 }) !== !1 &&
      (gt.has(this)
        ? this.attached && !gt.running(this) && gt.start(this)
        : (this.draw(), _n({ chart: this })))
  }
  draw() {
    let t
    if (this._resizeBeforeDraw) {
      const { width: s, height: n } = this._resizeBeforeDraw
      this._resize(s, n), (this._resizeBeforeDraw = null)
    }
    if (
      (this.clear(),
      this.width <= 0 || this.height <= 0 || this.notifyPlugins('beforeDraw', { cancelable: !0 }) === !1)
    )
      return
    const e = this._layers
    for (t = 0; t < e.length && e[t].z <= 0; ++t) e[t].draw(this.chartArea)
    for (this._drawDatasets(); t < e.length; ++t) e[t].draw(this.chartArea)
    this.notifyPlugins('afterDraw')
  }
  _getSortedDatasetMetas(t) {
    const e = this._sortedMetasets,
      s = []
    let n, o
    for (n = 0, o = e.length; n < o; ++n) {
      const a = e[n]
      ;(!t || a.visible) && s.push(a)
    }
    return s
  }
  getSortedVisibleDatasetMetas() {
    return this._getSortedDatasetMetas(!0)
  }
  _drawDatasets() {
    if (this.notifyPlugins('beforeDatasetsDraw', { cancelable: !0 }) === !1) return
    const t = this.getSortedVisibleDatasetMetas()
    for (let e = t.length - 1; e >= 0; --e) this._drawDataset(t[e])
    this.notifyPlugins('afterDatasetsDraw')
  }
  _drawDataset(t) {
    const e = this.ctx,
      s = t._clip,
      n = !s.disabled,
      o = td(t) || this.chartArea,
      a = { meta: t, index: t.index, cancelable: !0 }
    this.notifyPlugins('beforeDatasetDraw', a) !== !1 &&
      (n &&
        bi(e, {
          left: s.left === !1 ? 0 : o.left - s.left,
          right: s.right === !1 ? this.width : o.right + s.right,
          top: s.top === !1 ? 0 : o.top - s.top,
          bottom: s.bottom === !1 ? this.height : o.bottom + s.bottom,
        }),
      t.controller.draw(),
      n && _i(e),
      (a.cancelable = !1),
      this.notifyPlugins('afterDatasetDraw', a))
  }
  isPointInArea(t) {
    return ke(t, this.chartArea, this._minPadding)
  }
  getElementsAtEventForMode(t, e, s, n) {
    const o = Jc.modes[e]
    return typeof o == 'function' ? o(this, t, s, n) : []
  }
  getDatasetMeta(t) {
    const e = this.data.datasets[t],
      s = this._metasets
    let n = s.filter(o => o && o._dataset === e).pop()
    return (
      n ||
        ((n = {
          type: null,
          data: [],
          dataset: null,
          controller: null,
          hidden: null,
          xAxisID: null,
          yAxisID: null,
          order: (e && e.order) || 0,
          index: t,
          _dataset: e,
          _parsed: [],
          _sorted: !1,
        }),
        s.push(n)),
      n
    )
  }
  getContext() {
    return this.$context || (this.$context = At(null, { chart: this, type: 'chart' }))
  }
  getVisibleDatasetCount() {
    return this.getSortedVisibleDatasetMetas().length
  }
  isDatasetVisible(t) {
    const e = this.data.datasets[t]
    if (!e) return !1
    const s = this.getDatasetMeta(t)
    return typeof s.hidden == 'boolean' ? !s.hidden : !e.hidden
  }
  setDatasetVisibility(t, e) {
    const s = this.getDatasetMeta(t)
    s.hidden = !e
  }
  toggleDataVisibility(t) {
    this._hiddenIndices[t] = !this._hiddenIndices[t]
  }
  getDataVisibility(t) {
    return !this._hiddenIndices[t]
  }
  _updateVisibility(t, e, s) {
    const n = s ? 'show' : 'hide',
      o = this.getDatasetMeta(t),
      a = o.controller._resolveAnimations(void 0, n)
    ot(e)
      ? ((o.data[e].hidden = !s), this.update())
      : (this.setDatasetVisibility(t, s),
        a.update(o, { visible: s }),
        this.update(r => (r.datasetIndex === t ? n : void 0)))
  }
  hide(t, e) {
    this._updateVisibility(t, e, !1)
  }
  show(t, e) {
    this._updateVisibility(t, e, !0)
  }
  _destroyDatasetMeta(t) {
    const e = this._metasets[t]
    e && e.controller && e.controller._destroy(), delete this._metasets[t]
  }
  _stop() {
    let t, e
    for (this.stop(), gt.remove(this), t = 0, e = this.data.datasets.length; t < e; ++t)
      this._destroyDatasetMeta(t)
  }
  destroy() {
    this.notifyPlugins('beforeDestroy')
    const { canvas: t, ctx: e } = this
    this._stop(),
      this.config.clearCache(),
      t &&
        (this.unbindEvents(),
        Hs(t, e),
        this.platform.releaseContext(e),
        (this.canvas = null),
        (this.ctx = null)),
      delete ti[this.id],
      this.notifyPlugins('afterDestroy')
  }
  toBase64Image(...t) {
    return this.canvas.toDataURL(...t)
  }
  bindEvents() {
    this.bindUserEvents(), this.options.responsive ? this.bindResponsiveEvents() : (this.attached = !0)
  }
  bindUserEvents() {
    const t = this._listeners,
      e = this.platform,
      s = (o, a) => {
        e.addEventListener(this, o, a), (t[o] = a)
      },
      n = (o, a, r) => {
        ;(o.offsetX = a), (o.offsetY = r), this._eventHandler(o)
      }
    I(this.options.events, o => s(o, n))
  }
  bindResponsiveEvents() {
    this._responsiveListeners || (this._responsiveListeners = {})
    const t = this._responsiveListeners,
      e = this.platform,
      s = (l, c) => {
        e.addEventListener(this, l, c), (t[l] = c)
      },
      n = (l, c) => {
        t[l] && (e.removeEventListener(this, l, c), delete t[l])
      },
      o = (l, c) => {
        this.canvas && this.resize(l, c)
      }
    let a
    const r = () => {
      n('attach', r), (this.attached = !0), this.resize(), s('resize', o), s('detach', a)
    }
    ;(a = () => {
      ;(this.attached = !1), n('resize', o), this._stop(), this._resize(0, 0), s('attach', r)
    }),
      e.isAttached(this.canvas) ? r() : a()
  }
  unbindEvents() {
    I(this._listeners, (t, e) => {
      this.platform.removeEventListener(this, e, t)
    }),
      (this._listeners = {}),
      I(this._responsiveListeners, (t, e) => {
        this.platform.removeEventListener(this, e, t)
      }),
      (this._responsiveListeners = void 0)
  }
  updateHoverStyle(t, e, s) {
    const n = s ? 'set' : 'remove'
    let o, a, r, l
    for (
      e === 'dataset' &&
        ((o = this.getDatasetMeta(t[0].datasetIndex)), o.controller['_' + n + 'DatasetHoverStyle']()),
        r = 0,
        l = t.length;
      r < l;
      ++r
    ) {
      a = t[r]
      const c = a && this.getDatasetMeta(a.datasetIndex).controller
      c && c[n + 'HoverStyle'](a.element, a.datasetIndex, a.index)
    }
  }
  getActiveElements() {
    return this._active || []
  }
  setActiveElements(t) {
    const e = this._active || [],
      s = t.map(({ datasetIndex: o, index: a }) => {
        const r = this.getDatasetMeta(o)
        if (!r) throw new Error('No dataset found at index ' + o)
        return { datasetIndex: o, element: r.data[a], index: a }
      })
    !oi(s, e) && ((this._active = s), (this._lastEvent = null), this._updateHoverStyles(s, e))
  }
  notifyPlugins(t, e, s) {
    return this._plugins.notify(this, t, e, s)
  }
  isPluginEnabled(t) {
    return this._plugins._cache.filter(e => e.plugin.id === t).length === 1
  }
  _updateHoverStyles(t, e, s) {
    const n = this.options.hover,
      o = (l, c) => l.filter(h => !c.some(d => h.datasetIndex === d.datasetIndex && h.index === d.index)),
      a = o(e, t),
      r = s ? t : o(t, e)
    a.length && this.updateHoverStyle(a, n.mode, !1),
      r.length && n.mode && this.updateHoverStyle(r, n.mode, !0)
  }
  _eventHandler(t, e) {
    const s = { event: t, replay: e, cancelable: !0, inChartArea: this.isPointInArea(t) },
      n = a => (a.options.events || this.options.events).includes(t.native.type)
    if (this.notifyPlugins('beforeEvent', s, n) === !1) return
    const o = this._handleEvent(t, e, s.inChartArea)
    return (
      (s.cancelable = !1), this.notifyPlugins('afterEvent', s, n), (o || s.changed) && this.render(), this
    )
  }
  _handleEvent(t, e, s) {
    const { _active: n = [], options: o } = this,
      a = e,
      r = this._getActiveElements(t, n, s, a),
      l = cl(t),
      c = Qh(t, this._lastEvent, s, l)
    s && ((this._lastEvent = null), z(o.onHover, [t, r, this], this), l && z(o.onClick, [t, r, this], this))
    const h = !oi(r, n)
    return (h || e) && ((this._active = r), this._updateHoverStyles(r, n, e)), (this._lastEvent = c), h
  }
  _getActiveElements(t, e, s, n) {
    if (t.type === 'mouseout') return []
    if (!s) return e
    const o = this.options.hover
    return this.getElementsAtEventForMode(t, o.mode, o, n)
  }
}
C(ut, 'defaults', U),
  C(ut, 'instances', ti),
  C(ut, 'overrides', Vt),
  C(ut, 'registry', dt),
  C(ut, 'version', Kh),
  C(ut, 'getChart', xn)
function yn() {
  return I(ut.instances, i => i._plugins.invalidate())
}
function ed(i, t, e) {
  const { startAngle: s, pixelMargin: n, x: o, y: a, outerRadius: r, innerRadius: l } = t
  let c = n / r
  i.beginPath(),
    i.arc(o, a, r, s - c, e + c),
    l > n ? ((c = n / l), i.arc(o, a, l, e + c, s - c, !0)) : i.arc(o, a, n, e + $, s - $),
    i.closePath(),
    i.clip()
}
function id(i) {
  return fs(i, ['outerStart', 'outerEnd', 'innerStart', 'innerEnd'])
}
function sd(i, t, e, s) {
  const n = id(i.options.borderRadius),
    o = (e - t) / 2,
    a = Math.min(o, (s * t) / 2),
    r = l => {
      const c = ((e - Math.min(o, l)) * s) / 2
      return q(l, 0, Math.min(o, c))
    }
  return {
    outerStart: r(n.outerStart),
    outerEnd: r(n.outerEnd),
    innerStart: q(n.innerStart, 0, a),
    innerEnd: q(n.innerEnd, 0, a),
  }
}
function Kt(i, t, e, s) {
  return { x: e + i * Math.cos(t), y: s + i * Math.sin(t) }
}
function ui(i, t, e, s, n, o) {
  const { x: a, y: r, startAngle: l, pixelMargin: c, innerRadius: h } = t,
    d = Math.max(t.outerRadius + s + e - c, 0),
    u = h > 0 ? h + s + e + c : 0
  let f = 0
  const p = n - l
  if (s) {
    const F = h > 0 ? h - s : 0,
      N = d > 0 ? d - s : 0,
      j = (F + N) / 2,
      at = j !== 0 ? (p * j) / (j + s) : p
    f = (p - at) / 2
  }
  const g = Math.max(0.001, p * d - e / W) / d,
    m = (p - g) / 2,
    b = l + m + f,
    _ = n - m - f,
    { outerStart: y, outerEnd: v, innerStart: x, innerEnd: w } = sd(t, u, d, _ - b),
    M = d - y,
    S = d - v,
    P = b + y / M,
    A = _ - v / S,
    L = u + x,
    R = u + w,
    X = b + x / L,
    et = _ - w / R
  if ((i.beginPath(), o)) {
    const F = (P + A) / 2
    if ((i.arc(a, r, d, P, F), i.arc(a, r, d, F, A), v > 0)) {
      const K = Kt(S, A, a, r)
      i.arc(K.x, K.y, v, A, _ + $)
    }
    const N = Kt(R, _, a, r)
    if ((i.lineTo(N.x, N.y), w > 0)) {
      const K = Kt(R, et, a, r)
      i.arc(K.x, K.y, w, _ + $, et + Math.PI)
    }
    const j = (_ - w / u + (b + x / u)) / 2
    if ((i.arc(a, r, u, _ - w / u, j, !0), i.arc(a, r, u, j, b + x / u, !0), x > 0)) {
      const K = Kt(L, X, a, r)
      i.arc(K.x, K.y, x, X + Math.PI, b - $)
    }
    const at = Kt(M, b, a, r)
    if ((i.lineTo(at.x, at.y), y > 0)) {
      const K = Kt(M, P, a, r)
      i.arc(K.x, K.y, y, b - $, P)
    }
  } else {
    i.moveTo(a, r)
    const F = Math.cos(P) * d + a,
      N = Math.sin(P) * d + r
    i.lineTo(F, N)
    const j = Math.cos(A) * d + a,
      at = Math.sin(A) * d + r
    i.lineTo(j, at)
  }
  i.closePath()
}
function nd(i, t, e, s, n) {
  const { fullCircles: o, startAngle: a, circumference: r } = t
  let l = t.endAngle
  if (o) {
    ui(i, t, e, s, l, n)
    for (let c = 0; c < o; ++c) i.fill()
    isNaN(r) || (l = a + (r % H || H))
  }
  return ui(i, t, e, s, l, n), i.fill(), l
}
function od(i, t, e, s, n) {
  const { fullCircles: o, startAngle: a, circumference: r, options: l } = t,
    { borderWidth: c, borderJoinStyle: h } = l,
    d = l.borderAlign === 'inner'
  if (!c) return
  d ? ((i.lineWidth = c * 2), (i.lineJoin = h || 'round')) : ((i.lineWidth = c), (i.lineJoin = h || 'bevel'))
  let u = t.endAngle
  if (o) {
    ui(i, t, e, s, u, n)
    for (let f = 0; f < o; ++f) i.stroke()
    isNaN(r) || (u = a + (r % H || H))
  }
  d && ed(i, t, u), o || (ui(i, t, e, s, u, n), i.stroke())
}
class ei extends ct {
  constructor(t) {
    super(),
      (this.options = void 0),
      (this.circumference = void 0),
      (this.startAngle = void 0),
      (this.endAngle = void 0),
      (this.innerRadius = void 0),
      (this.outerRadius = void 0),
      (this.pixelMargin = 0),
      (this.fullCircles = 0),
      t && Object.assign(this, t)
  }
  inRange(t, e, s) {
    const n = this.getProps(['x', 'y'], s),
      { angle: o, distance: a } = vo(n, { x: t, y: e }),
      {
        startAngle: r,
        endAngle: l,
        innerRadius: c,
        outerRadius: h,
        circumference: d,
      } = this.getProps(['startAngle', 'endAngle', 'innerRadius', 'outerRadius', 'circumference'], s),
      u = this.options.spacing / 2,
      p = T(d, l - r) >= H || Me(o, r, l),
      g = xt(a, c + u, h + u)
    return p && g
  }
  getCenterPoint(t) {
    const {
        x: e,
        y: s,
        startAngle: n,
        endAngle: o,
        innerRadius: a,
        outerRadius: r,
      } = this.getProps(['x', 'y', 'startAngle', 'endAngle', 'innerRadius', 'outerRadius'], t),
      { offset: l, spacing: c } = this.options,
      h = (n + o) / 2,
      d = (a + r + c + l) / 2
    return { x: e + Math.cos(h) * d, y: s + Math.sin(h) * d }
  }
  tooltipPosition(t) {
    return this.getCenterPoint(t)
  }
  draw(t) {
    const { options: e, circumference: s } = this,
      n = (e.offset || 0) / 4,
      o = (e.spacing || 0) / 2,
      a = e.circular
    if (
      ((this.pixelMargin = e.borderAlign === 'inner' ? 0.33 : 0),
      (this.fullCircles = s > H ? Math.floor(s / H) : 0),
      s === 0 || this.innerRadius < 0 || this.outerRadius < 0)
    )
      return
    t.save()
    const r = (this.startAngle + this.endAngle) / 2
    t.translate(Math.cos(r) * n, Math.sin(r) * n)
    const l = 1 - Math.sin(Math.min(W, s || 0)),
      c = n * l
    ;(t.fillStyle = e.backgroundColor),
      (t.strokeStyle = e.borderColor),
      nd(t, this, c, o, a),
      od(t, this, c, o, a),
      t.restore()
  }
}
C(ei, 'id', 'arc'),
  C(ei, 'defaults', {
    borderAlign: 'center',
    borderColor: '#fff',
    borderJoinStyle: void 0,
    borderRadius: 0,
    borderWidth: 2,
    offset: 0,
    spacing: 0,
    angle: void 0,
    circular: !0,
  }),
  C(ei, 'defaultRoutes', { backgroundColor: 'backgroundColor' })
function ia(i, t, e = t) {
  ;(i.lineCap = T(e.borderCapStyle, t.borderCapStyle)),
    i.setLineDash(T(e.borderDash, t.borderDash)),
    (i.lineDashOffset = T(e.borderDashOffset, t.borderDashOffset)),
    (i.lineJoin = T(e.borderJoinStyle, t.borderJoinStyle)),
    (i.lineWidth = T(e.borderWidth, t.borderWidth)),
    (i.strokeStyle = T(e.borderColor, t.borderColor))
}
function ad(i, t, e) {
  i.lineTo(e.x, e.y)
}
function rd(i) {
  return i.stepped ? Ll : i.tension || i.cubicInterpolationMode === 'monotone' ? Ol : ad
}
function sa(i, t, e = {}) {
  const s = i.length,
    { start: n = 0, end: o = s - 1 } = e,
    { start: a, end: r } = t,
    l = Math.max(n, a),
    c = Math.min(o, r),
    h = (n < a && o < a) || (n > r && o > r)
  return { count: s, start: l, loop: t.loop, ilen: c < l && !h ? s + c - l : c - l }
}
function ld(i, t, e, s) {
  const { points: n, options: o } = t,
    { count: a, start: r, loop: l, ilen: c } = sa(n, e, s),
    h = rd(o)
  let { move: d = !0, reverse: u } = s || {},
    f,
    p,
    g
  for (f = 0; f <= c; ++f)
    (p = n[(r + (u ? c - f : f)) % a]),
      !p.skip && (d ? (i.moveTo(p.x, p.y), (d = !1)) : h(i, g, p, u, o.stepped), (g = p))
  return l && ((p = n[(r + (u ? c : 0)) % a]), h(i, g, p, u, o.stepped)), !!l
}
function cd(i, t, e, s) {
  const n = t.points,
    { count: o, start: a, ilen: r } = sa(n, e, s),
    { move: l = !0, reverse: c } = s || {}
  let h = 0,
    d = 0,
    u,
    f,
    p,
    g,
    m,
    b
  const _ = v => (a + (c ? r - v : v)) % o,
    y = () => {
      g !== m && (i.lineTo(h, m), i.lineTo(h, g), i.lineTo(h, b))
    }
  for (l && ((f = n[_(0)]), i.moveTo(f.x, f.y)), u = 0; u <= r; ++u) {
    if (((f = n[_(u)]), f.skip)) continue
    const v = f.x,
      x = f.y,
      w = v | 0
    w === p
      ? (x < g ? (g = x) : x > m && (m = x), (h = (d * h + v) / ++d))
      : (y(), i.lineTo(v, x), (p = w), (d = 0), (g = m = x)),
      (b = x)
  }
  y()
}
function Xi(i) {
  const t = i.options,
    e = t.borderDash && t.borderDash.length
  return !i._decimated &&
    !i._loop &&
    !t.tension &&
    t.cubicInterpolationMode !== 'monotone' &&
    !t.stepped &&
    !e
    ? cd
    : ld
}
function hd(i) {
  return i.stepped ? hc : i.tension || i.cubicInterpolationMode === 'monotone' ? dc : Ft
}
function dd(i, t, e, s) {
  let n = t._path
  n || ((n = t._path = new Path2D()), t.path(n, e, s) && n.closePath()), ia(i, t.options), i.stroke(n)
}
function ud(i, t, e, s) {
  const { segments: n, options: o } = t,
    a = Xi(t)
  for (const r of n)
    ia(i, o, r.style), i.beginPath(), a(i, t, r, { start: e, end: e + s - 1 }) && i.closePath(), i.stroke()
}
const fd = typeof Path2D == 'function'
function pd(i, t, e, s) {
  fd && !t.options.segment ? dd(i, t, e, s) : ud(i, t, e, s)
}
class kt extends ct {
  constructor(t) {
    super(),
      (this.animated = !0),
      (this.options = void 0),
      (this._chart = void 0),
      (this._loop = void 0),
      (this._fullLoop = void 0),
      (this._path = void 0),
      (this._points = void 0),
      (this._segments = void 0),
      (this._decimated = !1),
      (this._pointsUpdated = !1),
      (this._datasetIndex = void 0),
      t && Object.assign(this, t)
  }
  updateControlPoints(t, e) {
    const s = this.options
    if ((s.tension || s.cubicInterpolationMode === 'monotone') && !s.stepped && !this._pointsUpdated) {
      const n = s.spanGaps ? this._loop : this._fullLoop
      ic(this._points, s, t, n, e), (this._pointsUpdated = !0)
    }
  }
  set points(t) {
    ;(this._points = t), delete this._segments, delete this._path, (this._pointsUpdated = !1)
  }
  get points() {
    return this._points
  }
  get segments() {
    return this._segments || (this._segments = bc(this, this.options.segment))
  }
  first() {
    const t = this.segments,
      e = this.points
    return t.length && e[t[0].start]
  }
  last() {
    const t = this.segments,
      e = this.points,
      s = t.length
    return s && e[t[s - 1].end]
  }
  interpolate(t, e) {
    const s = this.options,
      n = t[e],
      o = this.points,
      a = $o(this, { property: e, start: n, end: n })
    if (!a.length) return
    const r = [],
      l = hd(s)
    let c, h
    for (c = 0, h = a.length; c < h; ++c) {
      const { start: d, end: u } = a[c],
        f = o[d],
        p = o[u]
      if (f === p) {
        r.push(f)
        continue
      }
      const g = Math.abs((n - f[e]) / (p[e] - f[e])),
        m = l(f, p, g, s.stepped)
      ;(m[e] = t[e]), r.push(m)
    }
    return r.length === 1 ? r[0] : r
  }
  pathSegment(t, e, s) {
    return Xi(this)(t, this, e, s)
  }
  path(t, e, s) {
    const n = this.segments,
      o = Xi(this)
    let a = this._loop
    ;(e = e || 0), (s = s || this.points.length - e)
    for (const r of n) a &= o(t, this, r, { start: e, end: e + s - 1 })
    return !!a
  }
  draw(t, e, s, n) {
    const o = this.options || {}
    ;(this.points || []).length && o.borderWidth && (t.save(), pd(t, this, s, n), t.restore()),
      this.animated && ((this._pointsUpdated = !1), (this._path = void 0))
  }
}
C(kt, 'id', 'line'),
  C(kt, 'defaults', {
    borderCapStyle: 'butt',
    borderDash: [],
    borderDashOffset: 0,
    borderJoinStyle: 'miter',
    borderWidth: 3,
    capBezierPoints: !0,
    cubicInterpolationMode: 'default',
    fill: !1,
    spanGaps: !1,
    stepped: !1,
    tension: 0,
  }),
  C(kt, 'defaultRoutes', { backgroundColor: 'backgroundColor', borderColor: 'borderColor' }),
  C(kt, 'descriptors', { _scriptable: !0, _indexable: t => t !== 'borderDash' && t !== 'fill' })
function vn(i, t, e, s) {
  const n = i.options,
    { [e]: o } = i.getProps([e], s)
  return Math.abs(t - o) < n.radius + n.hitRadius
}
class ii extends ct {
  constructor(t) {
    super(),
      (this.options = void 0),
      (this.parsed = void 0),
      (this.skip = void 0),
      (this.stop = void 0),
      t && Object.assign(this, t)
  }
  inRange(t, e, s) {
    const n = this.options,
      { x: o, y: a } = this.getProps(['x', 'y'], s)
    return Math.pow(t - o, 2) + Math.pow(e - a, 2) < Math.pow(n.hitRadius + n.radius, 2)
  }
  inXRange(t, e) {
    return vn(this, t, 'x', e)
  }
  inYRange(t, e) {
    return vn(this, t, 'y', e)
  }
  getCenterPoint(t) {
    const { x: e, y: s } = this.getProps(['x', 'y'], t)
    return { x: e, y: s }
  }
  size(t) {
    t = t || this.options || {}
    let e = t.radius || 0
    e = Math.max(e, (e && t.hoverRadius) || 0)
    const s = (e && t.borderWidth) || 0
    return (e + s) * 2
  }
  draw(t, e) {
    const s = this.options
    this.skip ||
      s.radius < 0.1 ||
      !ke(this, e, this.size(s) / 2) ||
      ((t.strokeStyle = s.borderColor),
      (t.lineWidth = s.borderWidth),
      (t.fillStyle = s.backgroundColor),
      Ui(t, s, this.x, this.y))
  }
  getRange() {
    const t = this.options || {}
    return t.radius + t.hitRadius
  }
}
C(ii, 'id', 'point'),
  C(ii, 'defaults', {
    borderWidth: 1,
    hitRadius: 1,
    hoverBorderWidth: 1,
    hoverRadius: 4,
    pointStyle: 'circle',
    radius: 3,
    rotation: 0,
  }),
  C(ii, 'defaultRoutes', { backgroundColor: 'backgroundColor', borderColor: 'borderColor' })
function na(i, t) {
  const { x: e, y: s, base: n, width: o, height: a } = i.getProps(['x', 'y', 'base', 'width', 'height'], t)
  let r, l, c, h, d
  return (
    i.horizontal
      ? ((d = a / 2), (r = Math.min(e, n)), (l = Math.max(e, n)), (c = s - d), (h = s + d))
      : ((d = o / 2), (r = e - d), (l = e + d), (c = Math.min(s, n)), (h = Math.max(s, n))),
    { left: r, top: c, right: l, bottom: h }
  )
}
function St(i, t, e, s) {
  return i ? 0 : q(t, e, s)
}
function gd(i, t, e) {
  const s = i.options.borderWidth,
    n = i.borderSkipped,
    o = Lo(s)
  return {
    t: St(n.top, o.top, 0, e),
    r: St(n.right, o.right, 0, t),
    b: St(n.bottom, o.bottom, 0, e),
    l: St(n.left, o.left, 0, t),
  }
}
function md(i, t, e) {
  const { enableBorderRadius: s } = i.getProps(['enableBorderRadius']),
    n = i.options.borderRadius,
    o = Ht(n),
    a = Math.min(t, e),
    r = i.borderSkipped,
    l = s || O(n)
  return {
    topLeft: St(!l || r.top || r.left, o.topLeft, 0, a),
    topRight: St(!l || r.top || r.right, o.topRight, 0, a),
    bottomLeft: St(!l || r.bottom || r.left, o.bottomLeft, 0, a),
    bottomRight: St(!l || r.bottom || r.right, o.bottomRight, 0, a),
  }
}
function bd(i) {
  const t = na(i),
    e = t.right - t.left,
    s = t.bottom - t.top,
    n = gd(i, e / 2, s / 2),
    o = md(i, e / 2, s / 2)
  return {
    outer: { x: t.left, y: t.top, w: e, h: s, radius: o },
    inner: {
      x: t.left + n.l,
      y: t.top + n.t,
      w: e - n.l - n.r,
      h: s - n.t - n.b,
      radius: {
        topLeft: Math.max(0, o.topLeft - Math.max(n.t, n.l)),
        topRight: Math.max(0, o.topRight - Math.max(n.t, n.r)),
        bottomLeft: Math.max(0, o.bottomLeft - Math.max(n.b, n.l)),
        bottomRight: Math.max(0, o.bottomRight - Math.max(n.b, n.r)),
      },
    },
  }
}
function Ri(i, t, e, s) {
  const n = t === null,
    o = e === null,
    r = i && !(n && o) && na(i, s)
  return r && (n || xt(t, r.left, r.right)) && (o || xt(e, r.top, r.bottom))
}
function _d(i) {
  return i.topLeft || i.topRight || i.bottomLeft || i.bottomRight
}
function xd(i, t) {
  i.rect(t.x, t.y, t.w, t.h)
}
function Ii(i, t, e = {}) {
  const s = i.x !== e.x ? -t : 0,
    n = i.y !== e.y ? -t : 0,
    o = (i.x + i.w !== e.x + e.w ? t : 0) - s,
    a = (i.y + i.h !== e.y + e.h ? t : 0) - n
  return { x: i.x + s, y: i.y + n, w: i.w + o, h: i.h + a, radius: i.radius }
}
class si extends ct {
  constructor(t) {
    super(),
      (this.options = void 0),
      (this.horizontal = void 0),
      (this.base = void 0),
      (this.width = void 0),
      (this.height = void 0),
      (this.inflateAmount = void 0),
      t && Object.assign(this, t)
  }
  draw(t) {
    const {
        inflateAmount: e,
        options: { borderColor: s, backgroundColor: n },
      } = this,
      { inner: o, outer: a } = bd(this),
      r = _d(a.radius) ? Se : xd
    t.save(),
      (a.w !== o.w || a.h !== o.h) &&
        (t.beginPath(),
        r(t, Ii(a, e, o)),
        t.clip(),
        r(t, Ii(o, -e, a)),
        (t.fillStyle = s),
        t.fill('evenodd')),
      t.beginPath(),
      r(t, Ii(o, e)),
      (t.fillStyle = n),
      t.fill(),
      t.restore()
  }
  inRange(t, e, s) {
    return Ri(this, t, e, s)
  }
  inXRange(t, e) {
    return Ri(this, t, null, e)
  }
  inYRange(t, e) {
    return Ri(this, null, t, e)
  }
  getCenterPoint(t) {
    const { x: e, y: s, base: n, horizontal: o } = this.getProps(['x', 'y', 'base', 'horizontal'], t)
    return { x: o ? (e + n) / 2 : e, y: o ? s : (s + n) / 2 }
  }
  getRange(t) {
    return t === 'x' ? this.width / 2 : this.height / 2
  }
}
C(si, 'id', 'bar'),
  C(si, 'defaults', {
    borderSkipped: 'start',
    borderWidth: 0,
    borderRadius: 0,
    inflateAmount: 'auto',
    pointStyle: void 0,
  }),
  C(si, 'defaultRoutes', { backgroundColor: 'backgroundColor', borderColor: 'borderColor' })
var yd = Object.freeze({ __proto__: null, ArcElement: ei, LineElement: kt, PointElement: ii, BarElement: si })
const Ki = [
    'rgb(54, 162, 235)',
    'rgb(255, 99, 132)',
    'rgb(255, 159, 64)',
    'rgb(255, 205, 86)',
    'rgb(75, 192, 192)',
    'rgb(153, 102, 255)',
    'rgb(201, 203, 207)',
  ],
  wn = Ki.map(i => i.replace('rgb(', 'rgba(').replace(')', ', 0.5)'))
function oa(i) {
  return Ki[i % Ki.length]
}
function aa(i) {
  return wn[i % wn.length]
}
function vd(i, t) {
  return (i.borderColor = oa(t)), (i.backgroundColor = aa(t)), ++t
}
function wd(i, t) {
  return (i.backgroundColor = i.data.map(() => oa(t++))), t
}
function Md(i, t) {
  return (i.backgroundColor = i.data.map(() => aa(t++))), t
}
function kd(i) {
  let t = 0
  return (e, s) => {
    const n = i.getDatasetMeta(s).controller
    n instanceof zt ? (t = wd(e, t)) : n instanceof ye ? (t = Md(e, t)) : n && (t = vd(e, t))
  }
}
function Mn(i) {
  let t
  for (t in i) if (i[t].borderColor || i[t].backgroundColor) return !0
  return !1
}
function Sd(i) {
  return i && (i.borderColor || i.backgroundColor)
}
var Cd = {
  id: 'colors',
  defaults: { enabled: !0, forceOverride: !1 },
  beforeLayout(i, t, e) {
    if (!e.enabled) return
    const {
        data: { datasets: s },
        options: n,
      } = i.config,
      { elements: o } = n
    if (!e.forceOverride && (Mn(s) || Sd(n) || (o && Mn(o)))) return
    const a = kd(i)
    s.forEach(a)
  },
}
function Pd(i, t, e, s, n) {
  const o = n.samples || s
  if (o >= e) return i.slice(t, t + e)
  const a = [],
    r = (e - 2) / (o - 2)
  let l = 0
  const c = t + e - 1
  let h = t,
    d,
    u,
    f,
    p,
    g
  for (a[l++] = i[h], d = 0; d < o - 2; d++) {
    let m = 0,
      b = 0,
      _
    const y = Math.floor((d + 1) * r) + 1 + t,
      v = Math.min(Math.floor((d + 2) * r) + 1, e) + t,
      x = v - y
    for (_ = y; _ < v; _++) (m += i[_].x), (b += i[_].y)
    ;(m /= x), (b /= x)
    const w = Math.floor(d * r) + 1 + t,
      M = Math.min(Math.floor((d + 1) * r) + 1, e) + t,
      { x: S, y: P } = i[h]
    for (f = p = -1, _ = w; _ < M; _++)
      (p = 0.5 * Math.abs((S - m) * (i[_].y - P) - (S - i[_].x) * (b - P))),
        p > f && ((f = p), (u = i[_]), (g = _))
    ;(a[l++] = u), (h = g)
  }
  return (a[l++] = i[c]), a
}
function Dd(i, t, e, s) {
  let n = 0,
    o = 0,
    a,
    r,
    l,
    c,
    h,
    d,
    u,
    f,
    p,
    g
  const m = [],
    b = t + e - 1,
    _ = i[t].x,
    v = i[b].x - _
  for (a = t; a < t + e; ++a) {
    ;(r = i[a]), (l = ((r.x - _) / v) * s), (c = r.y)
    const x = l | 0
    if (x === h) c < p ? ((p = c), (d = a)) : c > g && ((g = c), (u = a)), (n = (o * n + r.x) / ++o)
    else {
      const w = a - 1
      if (!E(d) && !E(u)) {
        const M = Math.min(d, u),
          S = Math.max(d, u)
        M !== f && M !== w && m.push({ ...i[M], x: n }), S !== f && S !== w && m.push({ ...i[S], x: n })
      }
      a > 0 && w !== f && m.push(i[w]), m.push(r), (h = x), (o = 0), (p = g = c), (d = u = f = a)
    }
  }
  return m
}
function ra(i) {
  if (i._decimated) {
    const t = i._data
    delete i._decimated,
      delete i._data,
      Object.defineProperty(i, 'data', { configurable: !0, enumerable: !0, writable: !0, value: t })
  }
}
function kn(i) {
  i.data.datasets.forEach(t => {
    ra(t)
  })
}
function Td(i, t) {
  const e = t.length
  let s = 0,
    n
  const { iScale: o } = i,
    { min: a, max: r, minDefined: l, maxDefined: c } = o.getUserBounds()
  return (
    l && (s = q(yt(t, o.axis, a).lo, 0, e - 1)),
    c ? (n = q(yt(t, o.axis, r).hi + 1, s, e) - s) : (n = e - s),
    { start: s, count: n }
  )
}
var Ad = {
  id: 'decimation',
  defaults: { algorithm: 'min-max', enabled: !1 },
  beforeElementsUpdate: (i, t, e) => {
    if (!e.enabled) {
      kn(i)
      return
    }
    const s = i.width
    i.data.datasets.forEach((n, o) => {
      const { _data: a, indexAxis: r } = n,
        l = i.getDatasetMeta(o),
        c = a || n.data
      if (ue([r, i.options.indexAxis]) === 'y' || !l.controller.supportsDecimation) return
      const h = i.scales[l.xAxisID]
      if ((h.type !== 'linear' && h.type !== 'time') || i.options.parsing) return
      let { start: d, count: u } = Td(l, c)
      const f = e.threshold || 4 * s
      if (u <= f) {
        ra(n)
        return
      }
      E(a) &&
        ((n._data = c),
        delete n.data,
        Object.defineProperty(n, 'data', {
          configurable: !0,
          enumerable: !0,
          get: function () {
            return this._decimated
          },
          set: function (g) {
            this._data = g
          },
        }))
      let p
      switch (e.algorithm) {
        case 'lttb':
          p = Pd(c, d, u, s, e)
          break
        case 'min-max':
          p = Dd(c, d, u, s)
          break
        default:
          throw new Error(`Unsupported decimation algorithm '${e.algorithm}'`)
      }
      n._decimated = p
    })
  },
  destroy(i) {
    kn(i)
  },
}
function Ld(i, t, e) {
  const s = i.segments,
    n = i.points,
    o = t.points,
    a = []
  for (const r of s) {
    let { start: l, end: c } = r
    c = xs(l, c, n)
    const h = Gi(e, n[l], n[c], r.loop)
    if (!t.segments) {
      a.push({ source: r, target: h, start: n[l], end: n[c] })
      continue
    }
    const d = $o(t, h)
    for (const u of d) {
      const f = Gi(e, o[u.start], o[u.end], u.loop),
        p = Vo(r, n, f)
      for (const g of p)
        a.push({
          source: g,
          target: u,
          start: { [e]: Sn(h, f, 'start', Math.max) },
          end: { [e]: Sn(h, f, 'end', Math.min) },
        })
    }
  }
  return a
}
function Gi(i, t, e, s) {
  if (s) return
  let n = t[i],
    o = e[i]
  return i === 'angle' && ((n = st(n)), (o = st(o))), { property: i, start: n, end: o }
}
function Od(i, t) {
  const { x: e = null, y: s = null } = i || {},
    n = t.points,
    o = []
  return (
    t.segments.forEach(({ start: a, end: r }) => {
      r = xs(a, r, n)
      const l = n[a],
        c = n[r]
      s !== null
        ? (o.push({ x: l.x, y: s }), o.push({ x: c.x, y: s }))
        : e !== null && (o.push({ x: e, y: l.y }), o.push({ x: e, y: c.y }))
    }),
    o
  )
}
function xs(i, t, e) {
  for (; t > i; t--) {
    const s = e[t]
    if (!isNaN(s.x) && !isNaN(s.y)) break
  }
  return t
}
function Sn(i, t, e, s) {
  return i && t ? s(i[e], t[e]) : i ? i[e] : t ? t[e] : 0
}
function la(i, t) {
  let e = [],
    s = !1
  return (
    B(i) ? ((s = !0), (e = i)) : (e = Od(i, t)),
    e.length ? new kt({ points: e, options: { tension: 0 }, _loop: s, _fullLoop: s }) : null
  )
}
function Cn(i) {
  return i && i.fill !== !1
}
function Ed(i, t, e) {
  let n = i[t].fill
  const o = [t]
  let a
  if (!e) return n
  for (; n !== !1 && o.indexOf(n) === -1; ) {
    if (!V(n)) return n
    if (((a = i[n]), !a)) return !1
    if (a.visible) return n
    o.push(n), (n = a.fill)
  }
  return !1
}
function Rd(i, t, e) {
  const s = Bd(i)
  if (O(s)) return isNaN(s.value) ? !1 : s
  let n = parseFloat(s)
  return V(n) && Math.floor(n) === n
    ? Id(s[0], t, n, e)
    : ['origin', 'start', 'end', 'stack', 'shape'].indexOf(s) >= 0 && s
}
function Id(i, t, e, s) {
  return (i === '-' || i === '+') && (e = t + e), e === t || e < 0 || e >= s ? !1 : e
}
function Fd(i, t) {
  let e = null
  return (
    i === 'start'
      ? (e = t.bottom)
      : i === 'end'
      ? (e = t.top)
      : O(i)
      ? (e = t.getPixelForValue(i.value))
      : t.getBasePixel && (e = t.getBasePixel()),
    e
  )
}
function zd(i, t, e) {
  let s
  return (
    i === 'start'
      ? (s = e)
      : i === 'end'
      ? (s = t.options.reverse ? t.min : t.max)
      : O(i)
      ? (s = i.value)
      : (s = t.getBaseValue()),
    s
  )
}
function Bd(i) {
  const t = i.options,
    e = t.fill
  let s = T(e && e.target, e)
  return s === void 0 && (s = !!t.backgroundColor), s === !1 || s === null ? !1 : s === !0 ? 'origin' : s
}
function Hd(i) {
  const { scale: t, index: e, line: s } = i,
    n = [],
    o = s.segments,
    a = s.points,
    r = Nd(t, e)
  r.push(la({ x: null, y: t.bottom }, s))
  for (let l = 0; l < o.length; l++) {
    const c = o[l]
    for (let h = c.start; h <= c.end; h++) Wd(n, a[h], r)
  }
  return new kt({ points: n, options: {} })
}
function Nd(i, t) {
  const e = [],
    s = i.getMatchingVisibleMetas('line')
  for (let n = 0; n < s.length; n++) {
    const o = s[n]
    if (o.index === t) break
    o.hidden || e.unshift(o.dataset)
  }
  return e
}
function Wd(i, t, e) {
  const s = []
  for (let n = 0; n < e.length; n++) {
    const o = e[n],
      { first: a, last: r, point: l } = Vd(o, t, 'x')
    if (!(!l || (a && r))) {
      if (a) s.unshift(l)
      else if ((i.push(l), !r)) break
    }
  }
  i.push(...s)
}
function Vd(i, t, e) {
  const s = i.interpolate(t, e)
  if (!s) return {}
  const n = s[e],
    o = i.segments,
    a = i.points
  let r = !1,
    l = !1
  for (let c = 0; c < o.length; c++) {
    const h = o[c],
      d = a[h.start][e],
      u = a[h.end][e]
    if (xt(n, d, u)) {
      ;(r = n === d), (l = n === u)
      break
    }
  }
  return { first: r, last: l, point: s }
}
class ca {
  constructor(t) {
    ;(this.x = t.x), (this.y = t.y), (this.radius = t.radius)
  }
  pathSegment(t, e, s) {
    const { x: n, y: o, radius: a } = this
    return (e = e || { start: 0, end: H }), t.arc(n, o, a, e.end, e.start, !0), !s.bounds
  }
  interpolate(t) {
    const { x: e, y: s, radius: n } = this,
      o = t.angle
    return { x: e + Math.cos(o) * n, y: s + Math.sin(o) * n, angle: o }
  }
}
function $d(i) {
  const { chart: t, fill: e, line: s } = i
  if (V(e)) return jd(t, e)
  if (e === 'stack') return Hd(i)
  if (e === 'shape') return !0
  const n = Ud(i)
  return n instanceof ca ? n : la(n, s)
}
function jd(i, t) {
  const e = i.getDatasetMeta(t)
  return e && i.isDatasetVisible(t) ? e.dataset : null
}
function Ud(i) {
  return (i.scale || {}).getPointPositionForValue ? qd(i) : Yd(i)
}
function Yd(i) {
  const { scale: t = {}, fill: e } = i,
    s = Fd(e, t)
  if (V(s)) {
    const n = t.isHorizontal()
    return { x: n ? s : null, y: n ? null : s }
  }
  return null
}
function qd(i) {
  const { scale: t, fill: e } = i,
    s = t.options,
    n = t.getLabels().length,
    o = s.reverse ? t.max : t.min,
    a = zd(e, t, o),
    r = []
  if (s.grid.circular) {
    const l = t.getPointPositionForValue(0, o)
    return new ca({ x: l.x, y: l.y, radius: t.getDistanceFromCenterForValue(a) })
  }
  for (let l = 0; l < n; ++l) r.push(t.getPointPositionForValue(l, a))
  return r
}
function Fi(i, t, e) {
  const s = $d(t),
    { line: n, scale: o, axis: a } = t,
    r = n.options,
    l = r.fill,
    c = r.backgroundColor,
    { above: h = c, below: d = c } = l || {}
  s &&
    n.points.length &&
    (bi(i, e), Xd(i, { line: n, target: s, above: h, below: d, area: e, scale: o, axis: a }), _i(i))
}
function Xd(i, t) {
  const { line: e, target: s, above: n, below: o, area: a, scale: r } = t,
    l = e._loop ? 'angle' : t.axis
  i.save(),
    l === 'x' &&
      o !== n &&
      (Pn(i, s, a.top),
      Dn(i, { line: e, target: s, color: n, scale: r, property: l }),
      i.restore(),
      i.save(),
      Pn(i, s, a.bottom)),
    Dn(i, { line: e, target: s, color: o, scale: r, property: l }),
    i.restore()
}
function Pn(i, t, e) {
  const { segments: s, points: n } = t
  let o = !0,
    a = !1
  i.beginPath()
  for (const r of s) {
    const { start: l, end: c } = r,
      h = n[l],
      d = n[xs(l, c, n)]
    o ? (i.moveTo(h.x, h.y), (o = !1)) : (i.lineTo(h.x, e), i.lineTo(h.x, h.y)),
      (a = !!t.pathSegment(i, r, { move: a })),
      a ? i.closePath() : i.lineTo(d.x, e)
  }
  i.lineTo(t.first().x, e), i.closePath(), i.clip()
}
function Dn(i, t) {
  const { line: e, target: s, property: n, color: o, scale: a } = t,
    r = Ld(e, s, n)
  for (const { source: l, target: c, start: h, end: d } of r) {
    const { style: { backgroundColor: u = o } = {} } = l,
      f = s !== !0
    i.save(), (i.fillStyle = u), Kd(i, a, f && Gi(n, h, d)), i.beginPath()
    const p = !!e.pathSegment(i, l)
    let g
    if (f) {
      p ? i.closePath() : Tn(i, s, d, n)
      const m = !!s.pathSegment(i, c, { move: p, reverse: !0 })
      ;(g = p && m), g || Tn(i, s, h, n)
    }
    i.closePath(), i.fill(g ? 'evenodd' : 'nonzero'), i.restore()
  }
}
function Kd(i, t, e) {
  const { top: s, bottom: n } = t.chart.chartArea,
    { property: o, start: a, end: r } = e || {}
  o === 'x' && (i.beginPath(), i.rect(a, s, r - a, n - s), i.clip())
}
function Tn(i, t, e, s) {
  const n = t.interpolate(e, s)
  n && i.lineTo(n.x, n.y)
}
var Gd = {
  id: 'filler',
  afterDatasetsUpdate(i, t, e) {
    const s = (i.data.datasets || []).length,
      n = []
    let o, a, r, l
    for (a = 0; a < s; ++a)
      (o = i.getDatasetMeta(a)),
        (r = o.dataset),
        (l = null),
        r &&
          r.options &&
          r instanceof kt &&
          (l = {
            visible: i.isDatasetVisible(a),
            index: a,
            fill: Rd(r, a, s),
            chart: i,
            axis: o.controller.options.indexAxis,
            scale: o.vScale,
            line: r,
          }),
        (o.$filler = l),
        n.push(l)
    for (a = 0; a < s; ++a) (l = n[a]), !(!l || l.fill === !1) && (l.fill = Ed(n, a, e.propagate))
  },
  beforeDraw(i, t, e) {
    const s = e.drawTime === 'beforeDraw',
      n = i.getSortedVisibleDatasetMetas(),
      o = i.chartArea
    for (let a = n.length - 1; a >= 0; --a) {
      const r = n[a].$filler
      r && (r.line.updateControlPoints(o, r.axis), s && r.fill && Fi(i.ctx, r, o))
    }
  },
  beforeDatasetsDraw(i, t, e) {
    if (e.drawTime !== 'beforeDatasetsDraw') return
    const s = i.getSortedVisibleDatasetMetas()
    for (let n = s.length - 1; n >= 0; --n) {
      const o = s[n].$filler
      Cn(o) && Fi(i.ctx, o, i.chartArea)
    }
  },
  beforeDatasetDraw(i, t, e) {
    const s = t.meta.$filler
    !Cn(s) || e.drawTime !== 'beforeDatasetDraw' || Fi(i.ctx, s, i.chartArea)
  },
  defaults: { propagate: !0, drawTime: 'beforeDatasetDraw' },
}
const An = (i, t) => {
    let { boxHeight: e = t, boxWidth: s = t } = i
    return (
      i.usePointStyle && ((e = Math.min(e, t)), (s = i.pointStyleWidth || Math.min(s, t))),
      { boxWidth: s, boxHeight: e, itemHeight: Math.max(t, e) }
    )
  },
  Jd = (i, t) => i !== null && t !== null && i.datasetIndex === t.datasetIndex && i.index === t.index
class Ln extends ct {
  constructor(t) {
    super(),
      (this._added = !1),
      (this.legendHitBoxes = []),
      (this._hoveredItem = null),
      (this.doughnutMode = !1),
      (this.chart = t.chart),
      (this.options = t.options),
      (this.ctx = t.ctx),
      (this.legendItems = void 0),
      (this.columnSizes = void 0),
      (this.lineWidths = void 0),
      (this.maxHeight = void 0),
      (this.maxWidth = void 0),
      (this.top = void 0),
      (this.bottom = void 0),
      (this.left = void 0),
      (this.right = void 0),
      (this.height = void 0),
      (this.width = void 0),
      (this._margins = void 0),
      (this.position = void 0),
      (this.weight = void 0),
      (this.fullSize = void 0)
  }
  update(t, e, s) {
    ;(this.maxWidth = t),
      (this.maxHeight = e),
      (this._margins = s),
      this.setDimensions(),
      this.buildLabels(),
      this.fit()
  }
  setDimensions() {
    this.isHorizontal()
      ? ((this.width = this.maxWidth), (this.left = this._margins.left), (this.right = this.width))
      : ((this.height = this.maxHeight), (this.top = this._margins.top), (this.bottom = this.height))
  }
  buildLabels() {
    const t = this.options.labels || {}
    let e = z(t.generateLabels, [this.chart], this) || []
    t.filter && (e = e.filter(s => t.filter(s, this.chart.data))),
      t.sort && (e = e.sort((s, n) => t.sort(s, n, this.chart.data))),
      this.options.reverse && e.reverse(),
      (this.legendItems = e)
  }
  fit() {
    const { options: t, ctx: e } = this
    if (!t.display) {
      this.width = this.height = 0
      return
    }
    const s = t.labels,
      n = Y(s.font),
      o = n.size,
      a = this._computeTitleHeight(),
      { boxWidth: r, itemHeight: l } = An(s, o)
    let c, h
    ;(e.font = n.string),
      this.isHorizontal()
        ? ((c = this.maxWidth), (h = this._fitRows(a, o, r, l) + 10))
        : ((h = this.maxHeight), (c = this._fitCols(a, n, r, l) + 10)),
      (this.width = Math.min(c, t.maxWidth || this.maxWidth)),
      (this.height = Math.min(h, t.maxHeight || this.maxHeight))
  }
  _fitRows(t, e, s, n) {
    const {
        ctx: o,
        maxWidth: a,
        options: {
          labels: { padding: r },
        },
      } = this,
      l = (this.legendHitBoxes = []),
      c = (this.lineWidths = [0]),
      h = n + r
    let d = t
    ;(o.textAlign = 'left'), (o.textBaseline = 'middle')
    let u = -1,
      f = -h
    return (
      this.legendItems.forEach((p, g) => {
        const m = s + e / 2 + o.measureText(p.text).width
        ;(g === 0 || c[c.length - 1] + m + 2 * r > a) &&
          ((d += h), (c[c.length - (g > 0 ? 0 : 1)] = 0), (f += h), u++),
          (l[g] = { left: 0, top: f, row: u, width: m, height: n }),
          (c[c.length - 1] += m + r)
      }),
      d
    )
  }
  _fitCols(t, e, s, n) {
    const {
        ctx: o,
        maxHeight: a,
        options: {
          labels: { padding: r },
        },
      } = this,
      l = (this.legendHitBoxes = []),
      c = (this.columnSizes = []),
      h = a - t
    let d = r,
      u = 0,
      f = 0,
      p = 0,
      g = 0
    return (
      this.legendItems.forEach((m, b) => {
        const { itemWidth: _, itemHeight: y } = Zd(s, e, o, m, n)
        b > 0 &&
          f + y + 2 * r > h &&
          ((d += u + r), c.push({ width: u, height: f }), (p += u + r), g++, (u = f = 0)),
          (l[b] = { left: p, top: f, col: g, width: _, height: y }),
          (u = Math.max(u, _)),
          (f += y + r)
      }),
      (d += u),
      c.push({ width: u, height: f }),
      d
    )
  }
  adjustHitBoxes() {
    if (!this.options.display) return
    const t = this._computeTitleHeight(),
      {
        legendHitBoxes: e,
        options: {
          align: s,
          labels: { padding: n },
          rtl: o,
        },
      } = this,
      a = Gt(o, this.left, this.width)
    if (this.isHorizontal()) {
      let r = 0,
        l = G(s, this.left + n, this.right - this.lineWidths[r])
      for (const c of e)
        r !== c.row && ((r = c.row), (l = G(s, this.left + n, this.right - this.lineWidths[r]))),
          (c.top += this.top + t + n),
          (c.left = a.leftForLtr(a.x(l), c.width)),
          (l += c.width + n)
    } else {
      let r = 0,
        l = G(s, this.top + t + n, this.bottom - this.columnSizes[r].height)
      for (const c of e)
        c.col !== r && ((r = c.col), (l = G(s, this.top + t + n, this.bottom - this.columnSizes[r].height))),
          (c.top = l),
          (c.left += this.left + n),
          (c.left = a.leftForLtr(a.x(c.left), c.width)),
          (l += c.height + n)
    }
  }
  isHorizontal() {
    return this.options.position === 'top' || this.options.position === 'bottom'
  }
  draw() {
    if (this.options.display) {
      const t = this.ctx
      bi(t, this), this._draw(), _i(t)
    }
  }
  _draw() {
    const { options: t, columnSizes: e, lineWidths: s, ctx: n } = this,
      { align: o, labels: a } = t,
      r = U.color,
      l = Gt(t.rtl, this.left, this.width),
      c = Y(a.font),
      { padding: h } = a,
      d = c.size,
      u = d / 2
    let f
    this.drawTitle(),
      (n.textAlign = l.textAlign('left')),
      (n.textBaseline = 'middle'),
      (n.lineWidth = 0.5),
      (n.font = c.string)
    const { boxWidth: p, boxHeight: g, itemHeight: m } = An(a, d),
      b = function (w, M, S) {
        if (isNaN(p) || p <= 0 || isNaN(g) || g < 0) return
        n.save()
        const P = T(S.lineWidth, 1)
        if (
          ((n.fillStyle = T(S.fillStyle, r)),
          (n.lineCap = T(S.lineCap, 'butt')),
          (n.lineDashOffset = T(S.lineDashOffset, 0)),
          (n.lineJoin = T(S.lineJoin, 'miter')),
          (n.lineWidth = P),
          (n.strokeStyle = T(S.strokeStyle, r)),
          n.setLineDash(T(S.lineDash, [])),
          a.usePointStyle)
        ) {
          const A = {
              radius: (g * Math.SQRT2) / 2,
              pointStyle: S.pointStyle,
              rotation: S.rotation,
              borderWidth: P,
            },
            L = l.xPlus(w, p / 2),
            R = M + u
          Ao(n, A, L, R, a.pointStyleWidth && p)
        } else {
          const A = M + Math.max((d - g) / 2, 0),
            L = l.leftForLtr(w, p),
            R = Ht(S.borderRadius)
          n.beginPath(),
            Object.values(R).some(X => X !== 0)
              ? Se(n, { x: L, y: A, w: p, h: g, radius: R })
              : n.rect(L, A, p, g),
            n.fill(),
            P !== 0 && n.stroke()
        }
        n.restore()
      },
      _ = function (w, M, S) {
        $t(n, S.text, w, M + m / 2, c, { strikethrough: S.hidden, textAlign: l.textAlign(S.textAlign) })
      },
      y = this.isHorizontal(),
      v = this._computeTitleHeight()
    y
      ? (f = { x: G(o, this.left + h, this.right - s[0]), y: this.top + h + v, line: 0 })
      : (f = { x: this.left + h, y: G(o, this.top + v + h, this.bottom - e[0].height), line: 0 }),
      Ho(this.ctx, t.textDirection)
    const x = m + h
    this.legendItems.forEach((w, M) => {
      ;(n.strokeStyle = w.fontColor), (n.fillStyle = w.fontColor)
      const S = n.measureText(w.text).width,
        P = l.textAlign(w.textAlign || (w.textAlign = a.textAlign)),
        A = p + u + S
      let L = f.x,
        R = f.y
      l.setWidth(this.width),
        y
          ? M > 0 &&
            L + A + h > this.right &&
            ((R = f.y += x), f.line++, (L = f.x = G(o, this.left + h, this.right - s[f.line])))
          : M > 0 &&
            R + x > this.bottom &&
            ((L = f.x = L + e[f.line].width + h),
            f.line++,
            (R = f.y = G(o, this.top + v + h, this.bottom - e[f.line].height)))
      const X = l.x(L)
      if ((b(X, R, w), (L = yl(P, L + p + u, y ? L + A : this.right, t.rtl)), _(l.x(L), R, w), y))
        f.x += A + h
      else if (typeof w.text != 'string') {
        const et = c.lineHeight
        f.y += ha(w, et)
      } else f.y += x
    }),
      No(this.ctx, t.textDirection)
  }
  drawTitle() {
    const t = this.options,
      e = t.title,
      s = Y(e.font),
      n = Z(e.padding)
    if (!e.display) return
    const o = Gt(t.rtl, this.left, this.width),
      a = this.ctx,
      r = e.position,
      l = s.size / 2,
      c = n.top + l
    let h,
      d = this.left,
      u = this.width
    if (this.isHorizontal())
      (u = Math.max(...this.lineWidths)), (h = this.top + c), (d = G(t.align, d, this.right - u))
    else {
      const p = this.columnSizes.reduce((g, m) => Math.max(g, m.height), 0)
      h = c + G(t.align, this.top, this.bottom - p - t.labels.padding - this._computeTitleHeight())
    }
    const f = G(r, d, d + u)
    ;(a.textAlign = o.textAlign(us(r))),
      (a.textBaseline = 'middle'),
      (a.strokeStyle = e.color),
      (a.fillStyle = e.color),
      (a.font = s.string),
      $t(a, e.text, f, h, s)
  }
  _computeTitleHeight() {
    const t = this.options.title,
      e = Y(t.font),
      s = Z(t.padding)
    return t.display ? e.lineHeight + s.height : 0
  }
  _getLegendItemAt(t, e) {
    let s, n, o
    if (xt(t, this.left, this.right) && xt(e, this.top, this.bottom)) {
      for (o = this.legendHitBoxes, s = 0; s < o.length; ++s)
        if (((n = o[s]), xt(t, n.left, n.left + n.width) && xt(e, n.top, n.top + n.height)))
          return this.legendItems[s]
    }
    return null
  }
  handleEvent(t) {
    const e = this.options
    if (!eu(t.type, e)) return
    const s = this._getLegendItemAt(t.x, t.y)
    if (t.type === 'mousemove' || t.type === 'mouseout') {
      const n = this._hoveredItem,
        o = Jd(n, s)
      n && !o && z(e.onLeave, [t, n, this], this),
        (this._hoveredItem = s),
        s && !o && z(e.onHover, [t, s, this], this)
    } else s && z(e.onClick, [t, s, this], this)
  }
}
function Zd(i, t, e, s, n) {
  const o = Qd(s, i, t, e),
    a = tu(n, s, t.lineHeight)
  return { itemWidth: o, itemHeight: a }
}
function Qd(i, t, e, s) {
  let n = i.text
  return (
    n && typeof n != 'string' && (n = n.reduce((o, a) => (o.length > a.length ? o : a))),
    t + e.size / 2 + s.measureText(n).width
  )
}
function tu(i, t, e) {
  let s = i
  return typeof t.text != 'string' && (s = ha(t, e)), s
}
function ha(i, t) {
  const e = i.text ? i.text.length + 0.5 : 0
  return t * e
}
function eu(i, t) {
  return !!(
    ((i === 'mousemove' || i === 'mouseout') && (t.onHover || t.onLeave)) ||
    (t.onClick && (i === 'click' || i === 'mouseup'))
  )
}
var iu = {
  id: 'legend',
  _element: Ln,
  start(i, t, e) {
    const s = (i.legend = new Ln({ ctx: i.ctx, options: e, chart: i }))
    J.configure(i, s, e), J.addBox(i, s)
  },
  stop(i) {
    J.removeBox(i, i.legend), delete i.legend
  },
  beforeUpdate(i, t, e) {
    const s = i.legend
    J.configure(i, s, e), (s.options = e)
  },
  afterUpdate(i) {
    const t = i.legend
    t.buildLabels(), t.adjustHitBoxes()
  },
  afterEvent(i, t) {
    t.replay || i.legend.handleEvent(t.event)
  },
  defaults: {
    display: !0,
    position: 'top',
    align: 'center',
    fullSize: !0,
    reverse: !1,
    weight: 1e3,
    onClick(i, t, e) {
      const s = t.datasetIndex,
        n = e.chart
      n.isDatasetVisible(s) ? (n.hide(s), (t.hidden = !0)) : (n.show(s), (t.hidden = !1))
    },
    onHover: null,
    onLeave: null,
    labels: {
      color: i => i.chart.options.color,
      boxWidth: 40,
      padding: 10,
      generateLabels(i) {
        const t = i.data.datasets,
          {
            labels: {
              usePointStyle: e,
              pointStyle: s,
              textAlign: n,
              color: o,
              useBorderRadius: a,
              borderRadius: r,
            },
          } = i.legend.options
        return i._getSortedDatasetMetas().map(l => {
          const c = l.controller.getStyle(e ? 0 : void 0),
            h = Z(c.borderWidth)
          return {
            text: t[l.index].label,
            fillStyle: c.backgroundColor,
            fontColor: o,
            hidden: !l.visible,
            lineCap: c.borderCapStyle,
            lineDash: c.borderDash,
            lineDashOffset: c.borderDashOffset,
            lineJoin: c.borderJoinStyle,
            lineWidth: (h.width + h.height) / 4,
            strokeStyle: c.borderColor,
            pointStyle: s || c.pointStyle,
            rotation: c.rotation,
            textAlign: n || c.textAlign,
            borderRadius: a && (r || c.borderRadius),
            datasetIndex: l.index,
          }
        }, this)
      },
    },
    title: { color: i => i.chart.options.color, display: !1, position: 'center', text: '' },
  },
  descriptors: {
    _scriptable: i => !i.startsWith('on'),
    labels: { _scriptable: i => !['generateLabels', 'filter', 'sort'].includes(i) },
  },
}
class ys extends ct {
  constructor(t) {
    super(),
      (this.chart = t.chart),
      (this.options = t.options),
      (this.ctx = t.ctx),
      (this._padding = void 0),
      (this.top = void 0),
      (this.bottom = void 0),
      (this.left = void 0),
      (this.right = void 0),
      (this.width = void 0),
      (this.height = void 0),
      (this.position = void 0),
      (this.weight = void 0),
      (this.fullSize = void 0)
  }
  update(t, e) {
    const s = this.options
    if (((this.left = 0), (this.top = 0), !s.display)) {
      this.width = this.height = this.right = this.bottom = 0
      return
    }
    ;(this.width = this.right = t), (this.height = this.bottom = e)
    const n = B(s.text) ? s.text.length : 1
    this._padding = Z(s.padding)
    const o = n * Y(s.font).lineHeight + this._padding.height
    this.isHorizontal() ? (this.height = o) : (this.width = o)
  }
  isHorizontal() {
    const t = this.options.position
    return t === 'top' || t === 'bottom'
  }
  _drawArgs(t) {
    const { top: e, left: s, bottom: n, right: o, options: a } = this,
      r = a.align
    let l = 0,
      c,
      h,
      d
    return (
      this.isHorizontal()
        ? ((h = G(r, s, o)), (d = e + t), (c = o - s))
        : (a.position === 'left'
            ? ((h = s + t), (d = G(r, n, e)), (l = W * -0.5))
            : ((h = o - t), (d = G(r, e, n)), (l = W * 0.5)),
          (c = n - e)),
      { titleX: h, titleY: d, maxWidth: c, rotation: l }
    )
  }
  draw() {
    const t = this.ctx,
      e = this.options
    if (!e.display) return
    const s = Y(e.font),
      o = s.lineHeight / 2 + this._padding.top,
      { titleX: a, titleY: r, maxWidth: l, rotation: c } = this._drawArgs(o)
    $t(t, e.text, 0, 0, s, {
      color: e.color,
      maxWidth: l,
      rotation: c,
      textAlign: us(e.align),
      textBaseline: 'middle',
      translation: [a, r],
    })
  }
}
function su(i, t) {
  const e = new ys({ ctx: i.ctx, options: t, chart: i })
  J.configure(i, e, t), J.addBox(i, e), (i.titleBlock = e)
}
var nu = {
  id: 'title',
  _element: ys,
  start(i, t, e) {
    su(i, e)
  },
  stop(i) {
    const t = i.titleBlock
    J.removeBox(i, t), delete i.titleBlock
  },
  beforeUpdate(i, t, e) {
    const s = i.titleBlock
    J.configure(i, s, e), (s.options = e)
  },
  defaults: {
    align: 'center',
    display: !1,
    font: { weight: 'bold' },
    fullSize: !0,
    padding: 10,
    position: 'top',
    text: '',
    weight: 2e3,
  },
  defaultRoutes: { color: 'color' },
  descriptors: { _scriptable: !0, _indexable: !1 },
}
const je = new WeakMap()
var ou = {
  id: 'subtitle',
  start(i, t, e) {
    const s = new ys({ ctx: i.ctx, options: e, chart: i })
    J.configure(i, s, e), J.addBox(i, s), je.set(i, s)
  },
  stop(i) {
    J.removeBox(i, je.get(i)), je.delete(i)
  },
  beforeUpdate(i, t, e) {
    const s = je.get(i)
    J.configure(i, s, e), (s.options = e)
  },
  defaults: {
    align: 'center',
    display: !1,
    font: { weight: 'normal' },
    fullSize: !0,
    padding: 0,
    position: 'top',
    text: '',
    weight: 1500,
  },
  defaultRoutes: { color: 'color' },
  descriptors: { _scriptable: !0, _indexable: !1 },
}
const pe = {
  average(i) {
    if (!i.length) return !1
    let t,
      e,
      s = 0,
      n = 0,
      o = 0
    for (t = 0, e = i.length; t < e; ++t) {
      const a = i[t].element
      if (a && a.hasValue()) {
        const r = a.tooltipPosition()
        ;(s += r.x), (n += r.y), ++o
      }
    }
    return { x: s / o, y: n / o }
  },
  nearest(i, t) {
    if (!i.length) return !1
    let e = t.x,
      s = t.y,
      n = Number.POSITIVE_INFINITY,
      o,
      a,
      r
    for (o = 0, a = i.length; o < a; ++o) {
      const l = i[o].element
      if (l && l.hasValue()) {
        const c = l.getCenterPoint(),
          h = $i(t, c)
        h < n && ((n = h), (r = l))
      }
    }
    if (r) {
      const l = r.tooltipPosition()
      ;(e = l.x), (s = l.y)
    }
    return { x: e, y: s }
  },
}
function ht(i, t) {
  return t && (B(t) ? Array.prototype.push.apply(i, t) : i.push(t)), i
}
function mt(i) {
  return (typeof i == 'string' || i instanceof String) &&
    i.indexOf(`
`) > -1
    ? i.split(`
`)
    : i
}
function au(i, t) {
  const { element: e, datasetIndex: s, index: n } = t,
    o = i.getDatasetMeta(s).controller,
    { label: a, value: r } = o.getLabelAndValue(n)
  return {
    chart: i,
    label: a,
    parsed: o.getParsed(n),
    raw: i.data.datasets[s].data[n],
    formattedValue: r,
    dataset: o.getDataset(),
    dataIndex: n,
    datasetIndex: s,
    element: e,
  }
}
function On(i, t) {
  const e = i.chart.ctx,
    { body: s, footer: n, title: o } = i,
    { boxWidth: a, boxHeight: r } = t,
    l = Y(t.bodyFont),
    c = Y(t.titleFont),
    h = Y(t.footerFont),
    d = o.length,
    u = n.length,
    f = s.length,
    p = Z(t.padding)
  let g = p.height,
    m = 0,
    b = s.reduce((v, x) => v + x.before.length + x.lines.length + x.after.length, 0)
  if (
    ((b += i.beforeBody.length + i.afterBody.length),
    d && (g += d * c.lineHeight + (d - 1) * t.titleSpacing + t.titleMarginBottom),
    b)
  ) {
    const v = t.displayColors ? Math.max(r, l.lineHeight) : l.lineHeight
    g += f * v + (b - f) * l.lineHeight + (b - 1) * t.bodySpacing
  }
  u && (g += t.footerMarginTop + u * h.lineHeight + (u - 1) * t.footerSpacing)
  let _ = 0
  const y = function (v) {
    m = Math.max(m, e.measureText(v).width + _)
  }
  return (
    e.save(),
    (e.font = c.string),
    I(i.title, y),
    (e.font = l.string),
    I(i.beforeBody.concat(i.afterBody), y),
    (_ = t.displayColors ? a + 2 + t.boxPadding : 0),
    I(s, v => {
      I(v.before, y), I(v.lines, y), I(v.after, y)
    }),
    (_ = 0),
    (e.font = h.string),
    I(i.footer, y),
    e.restore(),
    (m += p.width),
    { width: m, height: g }
  )
}
function ru(i, t) {
  const { y: e, height: s } = t
  return e < s / 2 ? 'top' : e > i.height - s / 2 ? 'bottom' : 'center'
}
function lu(i, t, e, s) {
  const { x: n, width: o } = s,
    a = e.caretSize + e.caretPadding
  if ((i === 'left' && n + o + a > t.width) || (i === 'right' && n - o - a < 0)) return !0
}
function cu(i, t, e, s) {
  const { x: n, width: o } = e,
    {
      width: a,
      chartArea: { left: r, right: l },
    } = i
  let c = 'center'
  return (
    s === 'center'
      ? (c = n <= (r + l) / 2 ? 'left' : 'right')
      : n <= o / 2
      ? (c = 'left')
      : n >= a - o / 2 && (c = 'right'),
    lu(c, i, t, e) && (c = 'center'),
    c
  )
}
function En(i, t, e) {
  const s = e.yAlign || t.yAlign || ru(i, e)
  return { xAlign: e.xAlign || t.xAlign || cu(i, t, e, s), yAlign: s }
}
function hu(i, t) {
  let { x: e, width: s } = i
  return t === 'right' ? (e -= s) : t === 'center' && (e -= s / 2), e
}
function du(i, t, e) {
  let { y: s, height: n } = i
  return t === 'top' ? (s += e) : t === 'bottom' ? (s -= n + e) : (s -= n / 2), s
}
function Rn(i, t, e, s) {
  const { caretSize: n, caretPadding: o, cornerRadius: a } = i,
    { xAlign: r, yAlign: l } = e,
    c = n + o,
    { topLeft: h, topRight: d, bottomLeft: u, bottomRight: f } = Ht(a)
  let p = hu(t, r)
  const g = du(t, l, c)
  return (
    l === 'center'
      ? r === 'left'
        ? (p += c)
        : r === 'right' && (p -= c)
      : r === 'left'
      ? (p -= Math.max(h, u) + n)
      : r === 'right' && (p += Math.max(d, f) + n),
    { x: q(p, 0, s.width - t.width), y: q(g, 0, s.height - t.height) }
  )
}
function Ue(i, t, e) {
  const s = Z(e.padding)
  return t === 'center' ? i.x + i.width / 2 : t === 'right' ? i.x + i.width - s.right : i.x + s.left
}
function In(i) {
  return ht([], mt(i))
}
function uu(i, t, e) {
  return At(i, { tooltip: t, tooltipItems: e, type: 'tooltip' })
}
function Fn(i, t) {
  const e = t && t.dataset && t.dataset.tooltip && t.dataset.tooltip.callbacks
  return e ? i.override(e) : i
}
const da = {
  beforeTitle: pt,
  title(i) {
    if (i.length > 0) {
      const t = i[0],
        e = t.chart.data.labels,
        s = e ? e.length : 0
      if (this && this.options && this.options.mode === 'dataset') return t.dataset.label || ''
      if (t.label) return t.label
      if (s > 0 && t.dataIndex < s) return e[t.dataIndex]
    }
    return ''
  },
  afterTitle: pt,
  beforeBody: pt,
  beforeLabel: pt,
  label(i) {
    if (this && this.options && this.options.mode === 'dataset')
      return i.label + ': ' + i.formattedValue || i.formattedValue
    let t = i.dataset.label || ''
    t && (t += ': ')
    const e = i.formattedValue
    return E(e) || (t += e), t
  },
  labelColor(i) {
    const e = i.chart.getDatasetMeta(i.datasetIndex).controller.getStyle(i.dataIndex)
    return {
      borderColor: e.borderColor,
      backgroundColor: e.backgroundColor,
      borderWidth: e.borderWidth,
      borderDash: e.borderDash,
      borderDashOffset: e.borderDashOffset,
      borderRadius: 0,
    }
  },
  labelTextColor() {
    return this.options.bodyColor
  },
  labelPointStyle(i) {
    const e = i.chart.getDatasetMeta(i.datasetIndex).controller.getStyle(i.dataIndex)
    return { pointStyle: e.pointStyle, rotation: e.rotation }
  },
  afterLabel: pt,
  afterBody: pt,
  beforeFooter: pt,
  footer: pt,
  afterFooter: pt,
}
function Q(i, t, e, s) {
  const n = i[t].call(e, s)
  return typeof n > 'u' ? da[t].call(e, s) : n
}
class Ji extends ct {
  constructor(t) {
    super(),
      (this.opacity = 0),
      (this._active = []),
      (this._eventPosition = void 0),
      (this._size = void 0),
      (this._cachedAnimations = void 0),
      (this._tooltipItems = []),
      (this.$animations = void 0),
      (this.$context = void 0),
      (this.chart = t.chart),
      (this.options = t.options),
      (this.dataPoints = void 0),
      (this.title = void 0),
      (this.beforeBody = void 0),
      (this.body = void 0),
      (this.afterBody = void 0),
      (this.footer = void 0),
      (this.xAlign = void 0),
      (this.yAlign = void 0),
      (this.x = void 0),
      (this.y = void 0),
      (this.height = void 0),
      (this.width = void 0),
      (this.caretX = void 0),
      (this.caretY = void 0),
      (this.labelColors = void 0),
      (this.labelPointStyles = void 0),
      (this.labelTextColors = void 0)
  }
  initialize(t) {
    ;(this.options = t), (this._cachedAnimations = void 0), (this.$context = void 0)
  }
  _resolveAnimations() {
    const t = this._cachedAnimations
    if (t) return t
    const e = this.chart,
      s = this.options.setContext(this.getContext()),
      n = s.enabled && e.options.animation && s.animations,
      o = new jo(this.chart, n)
    return n._cacheable && (this._cachedAnimations = Object.freeze(o)), o
  }
  getContext() {
    return this.$context || (this.$context = uu(this.chart.getContext(), this, this._tooltipItems))
  }
  getTitle(t, e) {
    const { callbacks: s } = e,
      n = Q(s, 'beforeTitle', this, t),
      o = Q(s, 'title', this, t),
      a = Q(s, 'afterTitle', this, t)
    let r = []
    return (r = ht(r, mt(n))), (r = ht(r, mt(o))), (r = ht(r, mt(a))), r
  }
  getBeforeBody(t, e) {
    return In(Q(e.callbacks, 'beforeBody', this, t))
  }
  getBody(t, e) {
    const { callbacks: s } = e,
      n = []
    return (
      I(t, o => {
        const a = { before: [], lines: [], after: [] },
          r = Fn(s, o)
        ht(a.before, mt(Q(r, 'beforeLabel', this, o))),
          ht(a.lines, Q(r, 'label', this, o)),
          ht(a.after, mt(Q(r, 'afterLabel', this, o))),
          n.push(a)
      }),
      n
    )
  }
  getAfterBody(t, e) {
    return In(Q(e.callbacks, 'afterBody', this, t))
  }
  getFooter(t, e) {
    const { callbacks: s } = e,
      n = Q(s, 'beforeFooter', this, t),
      o = Q(s, 'footer', this, t),
      a = Q(s, 'afterFooter', this, t)
    let r = []
    return (r = ht(r, mt(n))), (r = ht(r, mt(o))), (r = ht(r, mt(a))), r
  }
  _createItems(t) {
    const e = this._active,
      s = this.chart.data,
      n = [],
      o = [],
      a = []
    let r = [],
      l,
      c
    for (l = 0, c = e.length; l < c; ++l) r.push(au(this.chart, e[l]))
    return (
      t.filter && (r = r.filter((h, d, u) => t.filter(h, d, u, s))),
      t.itemSort && (r = r.sort((h, d) => t.itemSort(h, d, s))),
      I(r, h => {
        const d = Fn(t.callbacks, h)
        n.push(Q(d, 'labelColor', this, h)),
          o.push(Q(d, 'labelPointStyle', this, h)),
          a.push(Q(d, 'labelTextColor', this, h))
      }),
      (this.labelColors = n),
      (this.labelPointStyles = o),
      (this.labelTextColors = a),
      (this.dataPoints = r),
      r
    )
  }
  update(t, e) {
    const s = this.options.setContext(this.getContext()),
      n = this._active
    let o,
      a = []
    if (!n.length) this.opacity !== 0 && (o = { opacity: 0 })
    else {
      const r = pe[s.position].call(this, n, this._eventPosition)
      ;(a = this._createItems(s)),
        (this.title = this.getTitle(a, s)),
        (this.beforeBody = this.getBeforeBody(a, s)),
        (this.body = this.getBody(a, s)),
        (this.afterBody = this.getAfterBody(a, s)),
        (this.footer = this.getFooter(a, s))
      const l = (this._size = On(this, s)),
        c = Object.assign({}, r, l),
        h = En(this.chart, s, c),
        d = Rn(s, c, h, this.chart)
      ;(this.xAlign = h.xAlign),
        (this.yAlign = h.yAlign),
        (o = { opacity: 1, x: d.x, y: d.y, width: l.width, height: l.height, caretX: r.x, caretY: r.y })
    }
    ;(this._tooltipItems = a),
      (this.$context = void 0),
      o && this._resolveAnimations().update(this, o),
      t && s.external && s.external.call(this, { chart: this.chart, tooltip: this, replay: e })
  }
  drawCaret(t, e, s, n) {
    const o = this.getCaretPosition(t, s, n)
    e.lineTo(o.x1, o.y1), e.lineTo(o.x2, o.y2), e.lineTo(o.x3, o.y3)
  }
  getCaretPosition(t, e, s) {
    const { xAlign: n, yAlign: o } = this,
      { caretSize: a, cornerRadius: r } = s,
      { topLeft: l, topRight: c, bottomLeft: h, bottomRight: d } = Ht(r),
      { x: u, y: f } = t,
      { width: p, height: g } = e
    let m, b, _, y, v, x
    return (
      o === 'center'
        ? ((v = f + g / 2),
          n === 'left'
            ? ((m = u), (b = m - a), (y = v + a), (x = v - a))
            : ((m = u + p), (b = m + a), (y = v - a), (x = v + a)),
          (_ = m))
        : (n === 'left'
            ? (b = u + Math.max(l, h) + a)
            : n === 'right'
            ? (b = u + p - Math.max(c, d) - a)
            : (b = this.caretX),
          o === 'top'
            ? ((y = f), (v = y - a), (m = b - a), (_ = b + a))
            : ((y = f + g), (v = y + a), (m = b + a), (_ = b - a)),
          (x = y)),
      { x1: m, x2: b, x3: _, y1: y, y2: v, y3: x }
    )
  }
  drawTitle(t, e, s) {
    const n = this.title,
      o = n.length
    let a, r, l
    if (o) {
      const c = Gt(s.rtl, this.x, this.width)
      for (
        t.x = Ue(this, s.titleAlign, s),
          e.textAlign = c.textAlign(s.titleAlign),
          e.textBaseline = 'middle',
          a = Y(s.titleFont),
          r = s.titleSpacing,
          e.fillStyle = s.titleColor,
          e.font = a.string,
          l = 0;
        l < o;
        ++l
      )
        e.fillText(n[l], c.x(t.x), t.y + a.lineHeight / 2),
          (t.y += a.lineHeight + r),
          l + 1 === o && (t.y += s.titleMarginBottom - r)
    }
  }
  _drawColorBox(t, e, s, n, o) {
    const a = this.labelColors[s],
      r = this.labelPointStyles[s],
      { boxHeight: l, boxWidth: c, boxPadding: h } = o,
      d = Y(o.bodyFont),
      u = Ue(this, 'left', o),
      f = n.x(u),
      p = l < d.lineHeight ? (d.lineHeight - l) / 2 : 0,
      g = e.y + p
    if (o.usePointStyle) {
      const m = {
          radius: Math.min(c, l) / 2,
          pointStyle: r.pointStyle,
          rotation: r.rotation,
          borderWidth: 1,
        },
        b = n.leftForLtr(f, c) + c / 2,
        _ = g + l / 2
      ;(t.strokeStyle = o.multiKeyBackground),
        (t.fillStyle = o.multiKeyBackground),
        Ui(t, m, b, _),
        (t.strokeStyle = a.borderColor),
        (t.fillStyle = a.backgroundColor),
        Ui(t, m, b, _)
    } else {
      ;(t.lineWidth = O(a.borderWidth) ? Math.max(...Object.values(a.borderWidth)) : a.borderWidth || 1),
        (t.strokeStyle = a.borderColor),
        t.setLineDash(a.borderDash || []),
        (t.lineDashOffset = a.borderDashOffset || 0)
      const m = n.leftForLtr(f, c - h),
        b = n.leftForLtr(n.xPlus(f, 1), c - h - 2),
        _ = Ht(a.borderRadius)
      Object.values(_).some(y => y !== 0)
        ? (t.beginPath(),
          (t.fillStyle = o.multiKeyBackground),
          Se(t, { x: m, y: g, w: c, h: l, radius: _ }),
          t.fill(),
          t.stroke(),
          (t.fillStyle = a.backgroundColor),
          t.beginPath(),
          Se(t, { x: b, y: g + 1, w: c - 2, h: l - 2, radius: _ }),
          t.fill())
        : ((t.fillStyle = o.multiKeyBackground),
          t.fillRect(m, g, c, l),
          t.strokeRect(m, g, c, l),
          (t.fillStyle = a.backgroundColor),
          t.fillRect(b, g + 1, c - 2, l - 2))
    }
    t.fillStyle = this.labelTextColors[s]
  }
  drawBody(t, e, s) {
    const { body: n } = this,
      { bodySpacing: o, bodyAlign: a, displayColors: r, boxHeight: l, boxWidth: c, boxPadding: h } = s,
      d = Y(s.bodyFont)
    let u = d.lineHeight,
      f = 0
    const p = Gt(s.rtl, this.x, this.width),
      g = function (S) {
        e.fillText(S, p.x(t.x + f), t.y + u / 2), (t.y += u + o)
      },
      m = p.textAlign(a)
    let b, _, y, v, x, w, M
    for (
      e.textAlign = a,
        e.textBaseline = 'middle',
        e.font = d.string,
        t.x = Ue(this, m, s),
        e.fillStyle = s.bodyColor,
        I(this.beforeBody, g),
        f = r && m !== 'right' ? (a === 'center' ? c / 2 + h : c + 2 + h) : 0,
        v = 0,
        w = n.length;
      v < w;
      ++v
    ) {
      for (
        b = n[v],
          _ = this.labelTextColors[v],
          e.fillStyle = _,
          I(b.before, g),
          y = b.lines,
          r && y.length && (this._drawColorBox(e, t, v, p, s), (u = Math.max(d.lineHeight, l))),
          x = 0,
          M = y.length;
        x < M;
        ++x
      )
        g(y[x]), (u = d.lineHeight)
      I(b.after, g)
    }
    ;(f = 0), (u = d.lineHeight), I(this.afterBody, g), (t.y -= o)
  }
  drawFooter(t, e, s) {
    const n = this.footer,
      o = n.length
    let a, r
    if (o) {
      const l = Gt(s.rtl, this.x, this.width)
      for (
        t.x = Ue(this, s.footerAlign, s),
          t.y += s.footerMarginTop,
          e.textAlign = l.textAlign(s.footerAlign),
          e.textBaseline = 'middle',
          a = Y(s.footerFont),
          e.fillStyle = s.footerColor,
          e.font = a.string,
          r = 0;
        r < o;
        ++r
      )
        e.fillText(n[r], l.x(t.x), t.y + a.lineHeight / 2), (t.y += a.lineHeight + s.footerSpacing)
    }
  }
  drawBackground(t, e, s, n) {
    const { xAlign: o, yAlign: a } = this,
      { x: r, y: l } = t,
      { width: c, height: h } = s,
      { topLeft: d, topRight: u, bottomLeft: f, bottomRight: p } = Ht(n.cornerRadius)
    ;(e.fillStyle = n.backgroundColor),
      (e.strokeStyle = n.borderColor),
      (e.lineWidth = n.borderWidth),
      e.beginPath(),
      e.moveTo(r + d, l),
      a === 'top' && this.drawCaret(t, e, s, n),
      e.lineTo(r + c - u, l),
      e.quadraticCurveTo(r + c, l, r + c, l + u),
      a === 'center' && o === 'right' && this.drawCaret(t, e, s, n),
      e.lineTo(r + c, l + h - p),
      e.quadraticCurveTo(r + c, l + h, r + c - p, l + h),
      a === 'bottom' && this.drawCaret(t, e, s, n),
      e.lineTo(r + f, l + h),
      e.quadraticCurveTo(r, l + h, r, l + h - f),
      a === 'center' && o === 'left' && this.drawCaret(t, e, s, n),
      e.lineTo(r, l + d),
      e.quadraticCurveTo(r, l, r + d, l),
      e.closePath(),
      e.fill(),
      n.borderWidth > 0 && e.stroke()
  }
  _updateAnimationTarget(t) {
    const e = this.chart,
      s = this.$animations,
      n = s && s.x,
      o = s && s.y
    if (n || o) {
      const a = pe[t.position].call(this, this._active, this._eventPosition)
      if (!a) return
      const r = (this._size = On(this, t)),
        l = Object.assign({}, a, this._size),
        c = En(e, t, l),
        h = Rn(t, l, c, e)
      ;(n._to !== h.x || o._to !== h.y) &&
        ((this.xAlign = c.xAlign),
        (this.yAlign = c.yAlign),
        (this.width = r.width),
        (this.height = r.height),
        (this.caretX = a.x),
        (this.caretY = a.y),
        this._resolveAnimations().update(this, h))
    }
  }
  _willRender() {
    return !!this.opacity
  }
  draw(t) {
    const e = this.options.setContext(this.getContext())
    let s = this.opacity
    if (!s) return
    this._updateAnimationTarget(e)
    const n = { width: this.width, height: this.height },
      o = { x: this.x, y: this.y }
    s = Math.abs(s) < 0.001 ? 0 : s
    const a = Z(e.padding),
      r =
        this.title.length ||
        this.beforeBody.length ||
        this.body.length ||
        this.afterBody.length ||
        this.footer.length
    e.enabled &&
      r &&
      (t.save(),
      (t.globalAlpha = s),
      this.drawBackground(o, t, n, e),
      Ho(t, e.textDirection),
      (o.y += a.top),
      this.drawTitle(o, t, e),
      this.drawBody(o, t, e),
      this.drawFooter(o, t, e),
      No(t, e.textDirection),
      t.restore())
  }
  getActiveElements() {
    return this._active || []
  }
  setActiveElements(t, e) {
    const s = this._active,
      n = t.map(({ datasetIndex: r, index: l }) => {
        const c = this.chart.getDatasetMeta(r)
        if (!c) throw new Error('Cannot find a dataset at index ' + r)
        return { datasetIndex: r, element: c.data[l], index: l }
      }),
      o = !oi(s, n),
      a = this._positionChanged(n, e)
    ;(o || a) &&
      ((this._active = n), (this._eventPosition = e), (this._ignoreReplayEvents = !0), this.update(!0))
  }
  handleEvent(t, e, s = !0) {
    if (e && this._ignoreReplayEvents) return !1
    this._ignoreReplayEvents = !1
    const n = this.options,
      o = this._active || [],
      a = this._getActiveElements(t, o, e, s),
      r = this._positionChanged(a, t),
      l = e || !oi(a, o) || r
    return (
      l &&
        ((this._active = a),
        (n.enabled || n.external) && ((this._eventPosition = { x: t.x, y: t.y }), this.update(!0, e))),
      l
    )
  }
  _getActiveElements(t, e, s, n) {
    const o = this.options
    if (t.type === 'mouseout') return []
    if (!n) return e
    const a = this.chart.getElementsAtEventForMode(t, o.mode, o, s)
    return o.reverse && a.reverse(), a
  }
  _positionChanged(t, e) {
    const { caretX: s, caretY: n, options: o } = this,
      a = pe[o.position].call(this, t, e)
    return a !== !1 && (s !== a.x || n !== a.y)
  }
}
C(Ji, 'positioners', pe)
var fu = {
    id: 'tooltip',
    _element: Ji,
    positioners: pe,
    afterInit(i, t, e) {
      e && (i.tooltip = new Ji({ chart: i, options: e }))
    },
    beforeUpdate(i, t, e) {
      i.tooltip && i.tooltip.initialize(e)
    },
    reset(i, t, e) {
      i.tooltip && i.tooltip.initialize(e)
    },
    afterDraw(i) {
      const t = i.tooltip
      if (t && t._willRender()) {
        const e = { tooltip: t }
        if (i.notifyPlugins('beforeTooltipDraw', { ...e, cancelable: !0 }) === !1) return
        t.draw(i.ctx), i.notifyPlugins('afterTooltipDraw', e)
      }
    },
    afterEvent(i, t) {
      if (i.tooltip) {
        const e = t.replay
        i.tooltip.handleEvent(t.event, e, t.inChartArea) && (t.changed = !0)
      }
    },
    defaults: {
      enabled: !0,
      external: null,
      position: 'average',
      backgroundColor: 'rgba(0,0,0,0.8)',
      titleColor: '#fff',
      titleFont: { weight: 'bold' },
      titleSpacing: 2,
      titleMarginBottom: 6,
      titleAlign: 'left',
      bodyColor: '#fff',
      bodySpacing: 2,
      bodyFont: {},
      bodyAlign: 'left',
      footerColor: '#fff',
      footerSpacing: 2,
      footerMarginTop: 6,
      footerFont: { weight: 'bold' },
      footerAlign: 'left',
      padding: 6,
      caretPadding: 2,
      caretSize: 5,
      cornerRadius: 6,
      boxHeight: (i, t) => t.bodyFont.size,
      boxWidth: (i, t) => t.bodyFont.size,
      multiKeyBackground: '#fff',
      displayColors: !0,
      boxPadding: 0,
      borderColor: 'rgba(0,0,0,0)',
      borderWidth: 0,
      animation: { duration: 400, easing: 'easeOutQuart' },
      animations: {
        numbers: { type: 'number', properties: ['x', 'y', 'width', 'height', 'caretX', 'caretY'] },
        opacity: { easing: 'linear', duration: 200 },
      },
      callbacks: da,
    },
    defaultRoutes: { bodyFont: 'font', footerFont: 'font', titleFont: 'font' },
    descriptors: {
      _scriptable: i => i !== 'filter' && i !== 'itemSort' && i !== 'external',
      _indexable: !1,
      callbacks: { _scriptable: !1, _indexable: !1 },
      animation: { _fallback: !1 },
      animations: { _fallback: 'animation' },
    },
    additionalOptionScopes: ['interaction'],
  },
  pu = Object.freeze({
    __proto__: null,
    Colors: Cd,
    Decimation: Ad,
    Filler: Gd,
    Legend: iu,
    SubTitle: ou,
    Title: nu,
    Tooltip: fu,
  })
const gu = (i, t, e, s) => (
  typeof t == 'string' ? ((e = i.push(t) - 1), s.unshift({ index: e, label: t })) : isNaN(t) && (e = null), e
)
function mu(i, t, e, s) {
  const n = i.indexOf(t)
  if (n === -1) return gu(i, t, e, s)
  const o = i.lastIndexOf(t)
  return n !== o ? e : n
}
const bu = (i, t) => (i === null ? null : q(Math.round(i), 0, t))
function zn(i) {
  const t = this.getLabels()
  return i >= 0 && i < t.length ? t[i] : i
}
class Zi extends jt {
  constructor(t) {
    super(t), (this._startValue = void 0), (this._valueRange = 0), (this._addedLabels = [])
  }
  init(t) {
    const e = this._addedLabels
    if (e.length) {
      const s = this.getLabels()
      for (const { index: n, label: o } of e) s[n] === o && s.splice(n, 1)
      this._addedLabels = []
    }
    super.init(t)
  }
  parse(t, e) {
    if (E(t)) return null
    const s = this.getLabels()
    return (e = isFinite(e) && s[e] === t ? e : mu(s, t, T(e, t), this._addedLabels)), bu(e, s.length - 1)
  }
  determineDataLimits() {
    const { minDefined: t, maxDefined: e } = this.getUserBounds()
    let { min: s, max: n } = this.getMinMax(!0)
    this.options.bounds === 'ticks' && (t || (s = 0), e || (n = this.getLabels().length - 1)),
      (this.min = s),
      (this.max = n)
  }
  buildTicks() {
    const t = this.min,
      e = this.max,
      s = this.options.offset,
      n = []
    let o = this.getLabels()
    ;(o = t === 0 && e === o.length - 1 ? o : o.slice(t, e + 1)),
      (this._valueRange = Math.max(o.length - (s ? 0 : 1), 1)),
      (this._startValue = this.min - (s ? 0.5 : 0))
    for (let a = t; a <= e; a++) n.push({ value: a })
    return n
  }
  getLabelForValue(t) {
    return zn.call(this, t)
  }
  configure() {
    super.configure(), this.isHorizontal() || (this._reversePixels = !this._reversePixels)
  }
  getPixelForValue(t) {
    return (
      typeof t != 'number' && (t = this.parse(t)),
      t === null ? NaN : this.getPixelForDecimal((t - this._startValue) / this._valueRange)
    )
  }
  getPixelForTick(t) {
    const e = this.ticks
    return t < 0 || t > e.length - 1 ? null : this.getPixelForValue(e[t].value)
  }
  getValueForPixel(t) {
    return Math.round(this._startValue + this.getDecimalForPixel(t) * this._valueRange)
  }
  getBasePixel() {
    return this.bottom
  }
}
C(Zi, 'id', 'category'), C(Zi, 'defaults', { ticks: { callback: zn } })
function _u(i, t) {
  const e = [],
    {
      bounds: n,
      step: o,
      min: a,
      max: r,
      precision: l,
      count: c,
      maxTicks: h,
      maxDigits: d,
      includeBounds: u,
    } = i,
    f = o || 1,
    p = h - 1,
    { min: g, max: m } = t,
    b = !E(a),
    _ = !E(r),
    y = !E(c),
    v = (m - g) / (d + 1)
  let x = Os((m - g) / p / f) * f,
    w,
    M,
    S,
    P
  if (x < 1e-14 && !b && !_) return [{ value: g }, { value: m }]
  ;(P = Math.ceil(m / x) - Math.floor(g / x)),
    P > p && (x = Os((P * x) / p / f) * f),
    E(l) || ((w = Math.pow(10, l)), (x = Math.ceil(x * w) / w)),
    n === 'ticks' ? ((M = Math.floor(g / x) * x), (S = Math.ceil(m / x) * x)) : ((M = g), (S = m)),
    b && _ && o && fl((r - a) / o, x / 1e3)
      ? ((P = Math.round(Math.min((r - a) / x, h))), (x = (r - a) / P), (M = a), (S = r))
      : y
      ? ((M = b ? a : M), (S = _ ? r : S), (P = c - 1), (x = (S - M) / P))
      : ((P = (S - M) / x), be(P, Math.round(P), x / 1e3) ? (P = Math.round(P)) : (P = Math.ceil(P)))
  const A = Math.max(Es(x), Es(M))
  ;(w = Math.pow(10, E(l) ? A : l)), (M = Math.round(M * w) / w), (S = Math.round(S * w) / w)
  let L = 0
  for (
    b &&
    (u && M !== a
      ? (e.push({ value: a }), M < a && L++, be(Math.round((M + L * x) * w) / w, a, Bn(a, v, i)) && L++)
      : M < a && L++);
    L < P;
    ++L
  )
    e.push({ value: Math.round((M + L * x) * w) / w })
  return (
    _ && u && S !== r
      ? e.length && be(e[e.length - 1].value, r, Bn(r, v, i))
        ? (e[e.length - 1].value = r)
        : e.push({ value: r })
      : (!_ || S === r) && e.push({ value: S }),
    e
  )
}
function Bn(i, t, { horizontal: e, minRotation: s }) {
  const n = rt(s),
    o = (e ? Math.sin(n) : Math.cos(n)) || 0.001,
    a = 0.75 * t * ('' + i).length
  return Math.min(t / o, a)
}
class fi extends jt {
  constructor(t) {
    super(t),
      (this.start = void 0),
      (this.end = void 0),
      (this._startValue = void 0),
      (this._endValue = void 0),
      (this._valueRange = 0)
  }
  parse(t, e) {
    return E(t) || ((typeof t == 'number' || t instanceof Number) && !isFinite(+t)) ? null : +t
  }
  handleTickRangeOptions() {
    const { beginAtZero: t } = this.options,
      { minDefined: e, maxDefined: s } = this.getUserBounds()
    let { min: n, max: o } = this
    const a = l => (n = e ? n : l),
      r = l => (o = s ? o : l)
    if (t) {
      const l = ft(n),
        c = ft(o)
      l < 0 && c < 0 ? r(0) : l > 0 && c > 0 && a(0)
    }
    if (n === o) {
      let l = o === 0 ? 1 : Math.abs(o * 0.05)
      r(o + l), t || a(n - l)
    }
    ;(this.min = n), (this.max = o)
  }
  getTickLimit() {
    const t = this.options.ticks
    let { maxTicksLimit: e, stepSize: s } = t,
      n
    return (
      s
        ? ((n = Math.ceil(this.max / s) - Math.floor(this.min / s) + 1),
          n > 1e3 &&
            (console.warn(
              `scales.${this.id}.ticks.stepSize: ${s} would result generating up to ${n} ticks. Limiting to 1000.`
            ),
            (n = 1e3)))
        : ((n = this.computeTickLimit()), (e = e || 11)),
      e && (n = Math.min(e, n)),
      n
    )
  }
  computeTickLimit() {
    return Number.POSITIVE_INFINITY
  }
  buildTicks() {
    const t = this.options,
      e = t.ticks
    let s = this.getTickLimit()
    s = Math.max(2, s)
    const n = {
        maxTicks: s,
        bounds: t.bounds,
        min: t.min,
        max: t.max,
        precision: e.precision,
        step: e.stepSize,
        count: e.count,
        maxDigits: this._maxDigits(),
        horizontal: this.isHorizontal(),
        minRotation: e.minRotation || 0,
        includeBounds: e.includeBounds !== !1,
      },
      o = this._range || this,
      a = _u(n, o)
    return (
      t.bounds === 'ticks' && yo(a, this, 'value'),
      t.reverse
        ? (a.reverse(), (this.start = this.max), (this.end = this.min))
        : ((this.start = this.min), (this.end = this.max)),
      a
    )
  }
  configure() {
    const t = this.ticks
    let e = this.min,
      s = this.max
    if ((super.configure(), this.options.offset && t.length)) {
      const n = (s - e) / Math.max(t.length - 1, 1) / 2
      ;(e -= n), (s += n)
    }
    ;(this._startValue = e), (this._endValue = s), (this._valueRange = s - e)
  }
  getLabelForValue(t) {
    return Ae(t, this.chart.options.locale, this.options.ticks.format)
  }
}
class Qi extends fi {
  determineDataLimits() {
    const { min: t, max: e } = this.getMinMax(!0)
    ;(this.min = V(t) ? t : 0), (this.max = V(e) ? e : 1), this.handleTickRangeOptions()
  }
  computeTickLimit() {
    const t = this.isHorizontal(),
      e = t ? this.width : this.height,
      s = rt(this.options.ticks.minRotation),
      n = (t ? Math.sin(s) : Math.cos(s)) || 0.001,
      o = this._resolveTickFontOptions(0)
    return Math.ceil(e / Math.min(40, o.lineHeight / n))
  }
  getPixelForValue(t) {
    return t === null ? NaN : this.getPixelForDecimal((t - this._startValue) / this._valueRange)
  }
  getValueForPixel(t) {
    return this._startValue + this.getDecimalForPixel(t) * this._valueRange
  }
}
C(Qi, 'id', 'linear'), C(Qi, 'defaults', { ticks: { callback: mi.formatters.numeric } })
const Pe = i => Math.floor(Mt(i)),
  Rt = (i, t) => Math.pow(10, Pe(i) + t)
function Hn(i) {
  return i / Math.pow(10, Pe(i)) === 1
}
function Nn(i, t, e) {
  const s = Math.pow(10, e),
    n = Math.floor(i / s)
  return Math.ceil(t / s) - n
}
function xu(i, t) {
  const e = t - i
  let s = Pe(e)
  for (; Nn(i, t, s) > 10; ) s++
  for (; Nn(i, t, s) < 10; ) s--
  return Math.min(s, Pe(i))
}
function yu(i, { min: t, max: e }) {
  t = it(i.min, t)
  const s = [],
    n = Pe(t)
  let o = xu(t, e),
    a = o < 0 ? Math.pow(10, Math.abs(o)) : 1
  const r = Math.pow(10, o),
    l = n > o ? Math.pow(10, n) : 0,
    c = Math.round((t - l) * a) / a,
    h = Math.floor((t - l) / r / 10) * r * 10
  let d = Math.floor((c - h) / Math.pow(10, o)),
    u = it(i.min, Math.round((l + h + d * Math.pow(10, o)) * a) / a)
  for (; u < e; )
    s.push({ value: u, major: Hn(u), significand: d }),
      d >= 10 ? (d = d < 15 ? 15 : 20) : d++,
      d >= 20 && (o++, (d = 2), (a = o >= 0 ? 1 : a)),
      (u = Math.round((l + h + d * Math.pow(10, o)) * a) / a)
  const f = it(i.max, u)
  return s.push({ value: f, major: Hn(f), significand: d }), s
}
class ts extends jt {
  constructor(t) {
    super(t), (this.start = void 0), (this.end = void 0), (this._startValue = void 0), (this._valueRange = 0)
  }
  parse(t, e) {
    const s = fi.prototype.parse.apply(this, [t, e])
    if (s === 0) {
      this._zero = !0
      return
    }
    return V(s) && s > 0 ? s : null
  }
  determineDataLimits() {
    const { min: t, max: e } = this.getMinMax(!0)
    ;(this.min = V(t) ? Math.max(0, t) : null),
      (this.max = V(e) ? Math.max(0, e) : null),
      this.options.beginAtZero && (this._zero = !0),
      this._zero &&
        this.min !== this._suggestedMin &&
        !V(this._userMin) &&
        (this.min = t === Rt(this.min, 0) ? Rt(this.min, -1) : Rt(this.min, 0)),
      this.handleTickRangeOptions()
  }
  handleTickRangeOptions() {
    const { minDefined: t, maxDefined: e } = this.getUserBounds()
    let s = this.min,
      n = this.max
    const o = r => (s = t ? s : r),
      a = r => (n = e ? n : r)
    s === n && (s <= 0 ? (o(1), a(10)) : (o(Rt(s, -1)), a(Rt(n, 1)))),
      s <= 0 && o(Rt(n, -1)),
      n <= 0 && a(Rt(s, 1)),
      (this.min = s),
      (this.max = n)
  }
  buildTicks() {
    const t = this.options,
      e = { min: this._userMin, max: this._userMax },
      s = yu(e, this)
    return (
      t.bounds === 'ticks' && yo(s, this, 'value'),
      t.reverse
        ? (s.reverse(), (this.start = this.max), (this.end = this.min))
        : ((this.start = this.min), (this.end = this.max)),
      s
    )
  }
  getLabelForValue(t) {
    return t === void 0 ? '0' : Ae(t, this.chart.options.locale, this.options.ticks.format)
  }
  configure() {
    const t = this.min
    super.configure(), (this._startValue = Mt(t)), (this._valueRange = Mt(this.max) - Mt(t))
  }
  getPixelForValue(t) {
    return (
      (t === void 0 || t === 0) && (t = this.min),
      t === null || isNaN(t)
        ? NaN
        : this.getPixelForDecimal(t === this.min ? 0 : (Mt(t) - this._startValue) / this._valueRange)
    )
  }
  getValueForPixel(t) {
    const e = this.getDecimalForPixel(t)
    return Math.pow(10, this._startValue + e * this._valueRange)
  }
}
C(ts, 'id', 'logarithmic'),
  C(ts, 'defaults', { ticks: { callback: mi.formatters.logarithmic, major: { enabled: !0 } } })
function es(i) {
  const t = i.ticks
  if (t.display && i.display) {
    const e = Z(t.backdropPadding)
    return T(t.font && t.font.size, U.font.size) + e.height
  }
  return 0
}
function vu(i, t, e) {
  return (e = B(e) ? e : [e]), { w: Al(i, t.string, e), h: e.length * t.lineHeight }
}
function Wn(i, t, e, s, n) {
  return i === s || i === n
    ? { start: t - e / 2, end: t + e / 2 }
    : i < s || i > n
    ? { start: t - e, end: t }
    : { start: t, end: t + e }
}
function wu(i) {
  const t = {
      l: i.left + i._padding.left,
      r: i.right - i._padding.right,
      t: i.top + i._padding.top,
      b: i.bottom - i._padding.bottom,
    },
    e = Object.assign({}, t),
    s = [],
    n = [],
    o = i._pointLabels.length,
    a = i.options.pointLabels,
    r = a.centerPointLabels ? W / o : 0
  for (let l = 0; l < o; l++) {
    const c = a.setContext(i.getPointLabelContext(l))
    n[l] = c.padding
    const h = i.getPointPosition(l, i.drawingArea + n[l], r),
      d = Y(c.font),
      u = vu(i.ctx, d, i._pointLabels[l])
    s[l] = u
    const f = st(i.getIndexAngle(l) + r),
      p = Math.round(hs(f)),
      g = Wn(p, h.x, u.w, 0, 180),
      m = Wn(p, h.y, u.h, 90, 270)
    Mu(e, t, f, g, m)
  }
  i.setCenterPoint(t.l - e.l, e.r - t.r, t.t - e.t, e.b - t.b), (i._pointLabelItems = ku(i, s, n))
}
function Mu(i, t, e, s, n) {
  const o = Math.abs(Math.sin(e)),
    a = Math.abs(Math.cos(e))
  let r = 0,
    l = 0
  s.start < t.l
    ? ((r = (t.l - s.start) / o), (i.l = Math.min(i.l, t.l - r)))
    : s.end > t.r && ((r = (s.end - t.r) / o), (i.r = Math.max(i.r, t.r + r))),
    n.start < t.t
      ? ((l = (t.t - n.start) / a), (i.t = Math.min(i.t, t.t - l)))
      : n.end > t.b && ((l = (n.end - t.b) / a), (i.b = Math.max(i.b, t.b + l)))
}
function ku(i, t, e) {
  const s = [],
    n = i._pointLabels.length,
    o = i.options,
    a = es(o) / 2,
    r = i.drawingArea,
    l = o.pointLabels.centerPointLabels ? W / n : 0
  for (let c = 0; c < n; c++) {
    const h = i.getPointPosition(c, r + a + e[c], l),
      d = Math.round(hs(st(h.angle + $))),
      u = t[c],
      f = Pu(h.y, u.h, d),
      p = Su(d),
      g = Cu(h.x, u.w, p)
    s.push({ x: h.x, y: f, textAlign: p, left: g, top: f, right: g + u.w, bottom: f + u.h })
  }
  return s
}
function Su(i) {
  return i === 0 || i === 180 ? 'center' : i < 180 ? 'left' : 'right'
}
function Cu(i, t, e) {
  return e === 'right' ? (i -= t) : e === 'center' && (i -= t / 2), i
}
function Pu(i, t, e) {
  return e === 90 || e === 270 ? (i -= t / 2) : (e > 270 || e < 90) && (i -= t), i
}
function Du(i, t) {
  const {
    ctx: e,
    options: { pointLabels: s },
  } = i
  for (let n = t - 1; n >= 0; n--) {
    const o = s.setContext(i.getPointLabelContext(n)),
      a = Y(o.font),
      { x: r, y: l, textAlign: c, left: h, top: d, right: u, bottom: f } = i._pointLabelItems[n],
      { backdropColor: p } = o
    if (!E(p)) {
      const g = Ht(o.borderRadius),
        m = Z(o.backdropPadding)
      e.fillStyle = p
      const b = h - m.left,
        _ = d - m.top,
        y = u - h + m.width,
        v = f - d + m.height
      Object.values(g).some(x => x !== 0)
        ? (e.beginPath(), Se(e, { x: b, y: _, w: y, h: v, radius: g }), e.fill())
        : e.fillRect(b, _, y, v)
    }
    $t(e, i._pointLabels[n], r, l + a.lineHeight / 2, a, {
      color: o.color,
      textAlign: c,
      textBaseline: 'middle',
    })
  }
}
function ua(i, t, e, s) {
  const { ctx: n } = i
  if (e) n.arc(i.xCenter, i.yCenter, t, 0, H)
  else {
    let o = i.getPointPosition(0, t)
    n.moveTo(o.x, o.y)
    for (let a = 1; a < s; a++) (o = i.getPointPosition(a, t)), n.lineTo(o.x, o.y)
  }
}
function Tu(i, t, e, s, n) {
  const o = i.ctx,
    a = t.circular,
    { color: r, lineWidth: l } = t
  ;(!a && !s) ||
    !r ||
    !l ||
    e < 0 ||
    (o.save(),
    (o.strokeStyle = r),
    (o.lineWidth = l),
    o.setLineDash(n.dash),
    (o.lineDashOffset = n.dashOffset),
    o.beginPath(),
    ua(i, e, a, s),
    o.closePath(),
    o.stroke(),
    o.restore())
}
function Au(i, t, e) {
  return At(i, { label: e, index: t, type: 'pointLabel' })
}
class ge extends fi {
  constructor(t) {
    super(t),
      (this.xCenter = void 0),
      (this.yCenter = void 0),
      (this.drawingArea = void 0),
      (this._pointLabels = []),
      (this._pointLabelItems = [])
  }
  setDimensions() {
    const t = (this._padding = Z(es(this.options) / 2)),
      e = (this.width = this.maxWidth - t.width),
      s = (this.height = this.maxHeight - t.height)
    ;(this.xCenter = Math.floor(this.left + e / 2 + t.left)),
      (this.yCenter = Math.floor(this.top + s / 2 + t.top)),
      (this.drawingArea = Math.floor(Math.min(e, s) / 2))
  }
  determineDataLimits() {
    const { min: t, max: e } = this.getMinMax(!1)
    ;(this.min = V(t) && !isNaN(t) ? t : 0),
      (this.max = V(e) && !isNaN(e) ? e : 0),
      this.handleTickRangeOptions()
  }
  computeTickLimit() {
    return Math.ceil(this.drawingArea / es(this.options))
  }
  generateTickLabels(t) {
    fi.prototype.generateTickLabels.call(this, t),
      (this._pointLabels = this.getLabels()
        .map((e, s) => {
          const n = z(this.options.pointLabels.callback, [e, s], this)
          return n || n === 0 ? n : ''
        })
        .filter((e, s) => this.chart.getDataVisibility(s)))
  }
  fit() {
    const t = this.options
    t.display && t.pointLabels.display ? wu(this) : this.setCenterPoint(0, 0, 0, 0)
  }
  setCenterPoint(t, e, s, n) {
    ;(this.xCenter += Math.floor((t - e) / 2)),
      (this.yCenter += Math.floor((s - n) / 2)),
      (this.drawingArea -= Math.min(this.drawingArea / 2, Math.max(t, e, s, n)))
  }
  getIndexAngle(t) {
    const e = H / (this._pointLabels.length || 1),
      s = this.options.startAngle || 0
    return st(t * e + rt(s))
  }
  getDistanceFromCenterForValue(t) {
    if (E(t)) return NaN
    const e = this.drawingArea / (this.max - this.min)
    return this.options.reverse ? (this.max - t) * e : (t - this.min) * e
  }
  getValueForDistanceFromCenter(t) {
    if (E(t)) return NaN
    const e = t / (this.drawingArea / (this.max - this.min))
    return this.options.reverse ? this.max - e : this.min + e
  }
  getPointLabelContext(t) {
    const e = this._pointLabels || []
    if (t >= 0 && t < e.length) {
      const s = e[t]
      return Au(this.getContext(), t, s)
    }
  }
  getPointPosition(t, e, s = 0) {
    const n = this.getIndexAngle(t) - $ + s
    return { x: Math.cos(n) * e + this.xCenter, y: Math.sin(n) * e + this.yCenter, angle: n }
  }
  getPointPositionForValue(t, e) {
    return this.getPointPosition(t, this.getDistanceFromCenterForValue(e))
  }
  getBasePosition(t) {
    return this.getPointPositionForValue(t || 0, this.getBaseValue())
  }
  getPointLabelPosition(t) {
    const { left: e, top: s, right: n, bottom: o } = this._pointLabelItems[t]
    return { left: e, top: s, right: n, bottom: o }
  }
  drawBackground() {
    const {
      backgroundColor: t,
      grid: { circular: e },
    } = this.options
    if (t) {
      const s = this.ctx
      s.save(),
        s.beginPath(),
        ua(this, this.getDistanceFromCenterForValue(this._endValue), e, this._pointLabels.length),
        s.closePath(),
        (s.fillStyle = t),
        s.fill(),
        s.restore()
    }
  }
  drawGrid() {
    const t = this.ctx,
      e = this.options,
      { angleLines: s, grid: n, border: o } = e,
      a = this._pointLabels.length
    let r, l, c
    if (
      (e.pointLabels.display && Du(this, a),
      n.display &&
        this.ticks.forEach((h, d) => {
          if (d !== 0) {
            l = this.getDistanceFromCenterForValue(h.value)
            const u = this.getContext(d),
              f = n.setContext(u),
              p = o.setContext(u)
            Tu(this, f, l, a, p)
          }
        }),
      s.display)
    ) {
      for (t.save(), r = a - 1; r >= 0; r--) {
        const h = s.setContext(this.getPointLabelContext(r)),
          { color: d, lineWidth: u } = h
        !u ||
          !d ||
          ((t.lineWidth = u),
          (t.strokeStyle = d),
          t.setLineDash(h.borderDash),
          (t.lineDashOffset = h.borderDashOffset),
          (l = this.getDistanceFromCenterForValue(e.ticks.reverse ? this.min : this.max)),
          (c = this.getPointPosition(r, l)),
          t.beginPath(),
          t.moveTo(this.xCenter, this.yCenter),
          t.lineTo(c.x, c.y),
          t.stroke())
      }
      t.restore()
    }
  }
  drawBorder() {}
  drawLabels() {
    const t = this.ctx,
      e = this.options,
      s = e.ticks
    if (!s.display) return
    const n = this.getIndexAngle(0)
    let o, a
    t.save(),
      t.translate(this.xCenter, this.yCenter),
      t.rotate(n),
      (t.textAlign = 'center'),
      (t.textBaseline = 'middle'),
      this.ticks.forEach((r, l) => {
        if (l === 0 && !e.reverse) return
        const c = s.setContext(this.getContext(l)),
          h = Y(c.font)
        if (((o = this.getDistanceFromCenterForValue(this.ticks[l].value)), c.showLabelBackdrop)) {
          ;(t.font = h.string), (a = t.measureText(r.label).width), (t.fillStyle = c.backdropColor)
          const d = Z(c.backdropPadding)
          t.fillRect(-a / 2 - d.left, -o - h.size / 2 - d.top, a + d.width, h.size + d.height)
        }
        $t(t, r.label, 0, -o, h, { color: c.color })
      }),
      t.restore()
  }
  drawTitle() {}
}
C(ge, 'id', 'radialLinear'),
  C(ge, 'defaults', {
    display: !0,
    animate: !0,
    position: 'chartArea',
    angleLines: { display: !0, lineWidth: 1, borderDash: [], borderDashOffset: 0 },
    grid: { circular: !1 },
    startAngle: 0,
    ticks: { showLabelBackdrop: !0, callback: mi.formatters.numeric },
    pointLabels: {
      backdropColor: void 0,
      backdropPadding: 2,
      display: !0,
      font: { size: 10 },
      callback(t) {
        return t
      },
      padding: 5,
      centerPointLabels: !1,
    },
  }),
  C(ge, 'defaultRoutes', {
    'angleLines.color': 'borderColor',
    'pointLabels.color': 'color',
    'ticks.color': 'color',
  }),
  C(ge, 'descriptors', { angleLines: { _fallback: 'grid' } })
const yi = {
    millisecond: { common: !0, size: 1, steps: 1e3 },
    second: { common: !0, size: 1e3, steps: 60 },
    minute: { common: !0, size: 6e4, steps: 60 },
    hour: { common: !0, size: 36e5, steps: 24 },
    day: { common: !0, size: 864e5, steps: 30 },
    week: { common: !1, size: 6048e5, steps: 4 },
    month: { common: !0, size: 2628e6, steps: 12 },
    quarter: { common: !1, size: 7884e6, steps: 4 },
    year: { common: !0, size: 3154e7 },
  },
  tt = Object.keys(yi)
function Lu(i, t) {
  return i - t
}
function Vn(i, t) {
  if (E(t)) return null
  const e = i._adapter,
    { parser: s, round: n, isoWeekday: o } = i._parseOpts
  let a = t
  return (
    typeof s == 'function' && (a = s(a)),
    V(a) || (a = typeof s == 'string' ? e.parse(a, s) : e.parse(a)),
    a === null
      ? null
      : (n && (a = n === 'week' && (Zt(o) || o === !0) ? e.startOf(a, 'isoWeek', o) : e.startOf(a, n)), +a)
  )
}
function $n(i, t, e, s) {
  const n = tt.length
  for (let o = tt.indexOf(i); o < n - 1; ++o) {
    const a = yi[tt[o]],
      r = a.steps ? a.steps : Number.MAX_SAFE_INTEGER
    if (a.common && Math.ceil((e - t) / (r * a.size)) <= s) return tt[o]
  }
  return tt[n - 1]
}
function Ou(i, t, e, s, n) {
  for (let o = tt.length - 1; o >= tt.indexOf(e); o--) {
    const a = tt[o]
    if (yi[a].common && i._adapter.diff(n, s, a) >= t - 1) return a
  }
  return tt[e ? tt.indexOf(e) : 0]
}
function Eu(i) {
  for (let t = tt.indexOf(i) + 1, e = tt.length; t < e; ++t) if (yi[tt[t]].common) return tt[t]
}
function jn(i, t, e) {
  if (!e) i[t] = !0
  else if (e.length) {
    const { lo: s, hi: n } = ds(e, t),
      o = e[s] >= t ? e[s] : e[n]
    i[o] = !0
  }
}
function Ru(i, t, e, s) {
  const n = i._adapter,
    o = +n.startOf(t[0].value, s),
    a = t[t.length - 1].value
  let r, l
  for (r = o; r <= a; r = +n.add(r, 1, s)) (l = e[r]), l >= 0 && (t[l].major = !0)
  return t
}
function Un(i, t, e) {
  const s = [],
    n = {},
    o = t.length
  let a, r
  for (a = 0; a < o; ++a) (r = t[a]), (n[r] = a), s.push({ value: r, major: !1 })
  return o === 0 || !e ? s : Ru(i, s, n, e)
}
class De extends jt {
  constructor(t) {
    super(t),
      (this._cache = { data: [], labels: [], all: [] }),
      (this._unit = 'day'),
      (this._majorUnit = void 0),
      (this._offsets = {}),
      (this._normalized = !1),
      (this._parseOpts = void 0)
  }
  init(t, e = {}) {
    const s = t.time || (t.time = {}),
      n = (this._adapter = new Yc._date(t.adapters.date))
    n.init(e),
      me(s.displayFormats, n.formats()),
      (this._parseOpts = { parser: s.parser, round: s.round, isoWeekday: s.isoWeekday }),
      super.init(t),
      (this._normalized = e.normalized)
  }
  parse(t, e) {
    return t === void 0 ? null : Vn(this, t)
  }
  beforeLayout() {
    super.beforeLayout(), (this._cache = { data: [], labels: [], all: [] })
  }
  determineDataLimits() {
    const t = this.options,
      e = this._adapter,
      s = t.time.unit || 'day'
    let { min: n, max: o, minDefined: a, maxDefined: r } = this.getUserBounds()
    function l(c) {
      !a && !isNaN(c.min) && (n = Math.min(n, c.min)), !r && !isNaN(c.max) && (o = Math.max(o, c.max))
    }
    ;(!a || !r) &&
      (l(this._getLabelBounds()),
      (t.bounds !== 'ticks' || t.ticks.source !== 'labels') && l(this.getMinMax(!1))),
      (n = V(n) && !isNaN(n) ? n : +e.startOf(Date.now(), s)),
      (o = V(o) && !isNaN(o) ? o : +e.endOf(Date.now(), s) + 1),
      (this.min = Math.min(n, o - 1)),
      (this.max = Math.max(n + 1, o))
  }
  _getLabelBounds() {
    const t = this.getLabelTimestamps()
    let e = Number.POSITIVE_INFINITY,
      s = Number.NEGATIVE_INFINITY
    return t.length && ((e = t[0]), (s = t[t.length - 1])), { min: e, max: s }
  }
  buildTicks() {
    const t = this.options,
      e = t.time,
      s = t.ticks,
      n = s.source === 'labels' ? this.getLabelTimestamps() : this._generate()
    t.bounds === 'ticks' &&
      n.length &&
      ((this.min = this._userMin || n[0]), (this.max = this._userMax || n[n.length - 1]))
    const o = this.min,
      a = this.max,
      r = bl(n, o, a)
    return (
      (this._unit =
        e.unit ||
        (s.autoSkip
          ? $n(e.minUnit, this.min, this.max, this._getLabelCapacity(o))
          : Ou(this, r.length, e.minUnit, this.min, this.max))),
      (this._majorUnit = !s.major.enabled || this._unit === 'year' ? void 0 : Eu(this._unit)),
      this.initOffsets(n),
      t.reverse && r.reverse(),
      Un(this, r, this._majorUnit)
    )
  }
  afterAutoSkip() {
    this.options.offsetAfterAutoskip && this.initOffsets(this.ticks.map(t => +t.value))
  }
  initOffsets(t = []) {
    let e = 0,
      s = 0,
      n,
      o
    this.options.offset &&
      t.length &&
      ((n = this.getDecimalForValue(t[0])),
      t.length === 1 ? (e = 1 - n) : (e = (this.getDecimalForValue(t[1]) - n) / 2),
      (o = this.getDecimalForValue(t[t.length - 1])),
      t.length === 1 ? (s = o) : (s = (o - this.getDecimalForValue(t[t.length - 2])) / 2))
    const a = t.length < 3 ? 0.5 : 0.25
    ;(e = q(e, 0, a)), (s = q(s, 0, a)), (this._offsets = { start: e, end: s, factor: 1 / (e + 1 + s) })
  }
  _generate() {
    const t = this._adapter,
      e = this.min,
      s = this.max,
      n = this.options,
      o = n.time,
      a = o.unit || $n(o.minUnit, e, s, this._getLabelCapacity(e)),
      r = T(n.ticks.stepSize, 1),
      l = a === 'week' ? o.isoWeekday : !1,
      c = Zt(l) || l === !0,
      h = {}
    let d = e,
      u,
      f
    if (
      (c && (d = +t.startOf(d, 'isoWeek', l)), (d = +t.startOf(d, c ? 'day' : a)), t.diff(s, e, a) > 1e5 * r)
    )
      throw new Error(e + ' and ' + s + ' are too far apart with stepSize of ' + r + ' ' + a)
    const p = n.ticks.source === 'data' && this.getDataTimestamps()
    for (u = d, f = 0; u < s; u = +t.add(u, r, a), f++) jn(h, u, p)
    return (
      (u === s || n.bounds === 'ticks' || f === 1) && jn(h, u, p),
      Object.keys(h)
        .sort((g, m) => g - m)
        .map(g => +g)
    )
  }
  getLabelForValue(t) {
    const e = this._adapter,
      s = this.options.time
    return s.tooltipFormat ? e.format(t, s.tooltipFormat) : e.format(t, s.displayFormats.datetime)
  }
  format(t, e) {
    const n = this.options.time.displayFormats,
      o = this._unit,
      a = e || n[o]
    return this._adapter.format(t, a)
  }
  _tickFormatFunction(t, e, s, n) {
    const o = this.options,
      a = o.ticks.callback
    if (a) return z(a, [t, e, s], this)
    const r = o.time.displayFormats,
      l = this._unit,
      c = this._majorUnit,
      h = l && r[l],
      d = c && r[c],
      u = s[e],
      f = c && d && u && u.major
    return this._adapter.format(t, n || (f ? d : h))
  }
  generateTickLabels(t) {
    let e, s, n
    for (e = 0, s = t.length; e < s; ++e) (n = t[e]), (n.label = this._tickFormatFunction(n.value, e, t))
  }
  getDecimalForValue(t) {
    return t === null ? NaN : (t - this.min) / (this.max - this.min)
  }
  getPixelForValue(t) {
    const e = this._offsets,
      s = this.getDecimalForValue(t)
    return this.getPixelForDecimal((e.start + s) * e.factor)
  }
  getValueForPixel(t) {
    const e = this._offsets,
      s = this.getDecimalForPixel(t) / e.factor - e.end
    return this.min + s * (this.max - this.min)
  }
  _getLabelSize(t) {
    const e = this.options.ticks,
      s = this.ctx.measureText(t).width,
      n = rt(this.isHorizontal() ? e.maxRotation : e.minRotation),
      o = Math.cos(n),
      a = Math.sin(n),
      r = this._resolveTickFontOptions(0).size
    return { w: s * o + r * a, h: s * a + r * o }
  }
  _getLabelCapacity(t) {
    const e = this.options.time,
      s = e.displayFormats,
      n = s[e.unit] || s.millisecond,
      o = this._tickFormatFunction(t, 0, Un(this, [t], this._majorUnit), n),
      a = this._getLabelSize(o),
      r = Math.floor(this.isHorizontal() ? this.width / a.w : this.height / a.h) - 1
    return r > 0 ? r : 1
  }
  getDataTimestamps() {
    let t = this._cache.data || [],
      e,
      s
    if (t.length) return t
    const n = this.getMatchingVisibleMetas()
    if (this._normalized && n.length) return (this._cache.data = n[0].controller.getAllParsedValues(this))
    for (e = 0, s = n.length; e < s; ++e) t = t.concat(n[e].controller.getAllParsedValues(this))
    return (this._cache.data = this.normalize(t))
  }
  getLabelTimestamps() {
    const t = this._cache.labels || []
    let e, s
    if (t.length) return t
    const n = this.getLabels()
    for (e = 0, s = n.length; e < s; ++e) t.push(Vn(this, n[e]))
    return (this._cache.labels = this._normalized ? t : this.normalize(t))
  }
  normalize(t) {
    return Mo(t.sort(Lu))
  }
}
C(De, 'id', 'time'),
  C(De, 'defaults', {
    bounds: 'data',
    adapters: {},
    time: { parser: !1, unit: !1, round: !1, isoWeekday: !1, minUnit: 'millisecond', displayFormats: {} },
    ticks: { source: 'auto', callback: !1, major: { enabled: !1 } },
  })
function Ye(i, t, e) {
  let s = 0,
    n = i.length - 1,
    o,
    a,
    r,
    l
  e
    ? (t >= i[s].pos && t <= i[n].pos && ({ lo: s, hi: n } = yt(i, 'pos', t)),
      ({ pos: o, time: r } = i[s]),
      ({ pos: a, time: l } = i[n]))
    : (t >= i[s].time && t <= i[n].time && ({ lo: s, hi: n } = yt(i, 'time', t)),
      ({ time: o, pos: r } = i[s]),
      ({ time: a, pos: l } = i[n]))
  const c = a - o
  return c ? r + ((l - r) * (t - o)) / c : r
}
class is extends De {
  constructor(t) {
    super(t), (this._table = []), (this._minPos = void 0), (this._tableRange = void 0)
  }
  initOffsets() {
    const t = this._getTimestampsForTable(),
      e = (this._table = this.buildLookupTable(t))
    ;(this._minPos = Ye(e, this.min)),
      (this._tableRange = Ye(e, this.max) - this._minPos),
      super.initOffsets(t)
  }
  buildLookupTable(t) {
    const { min: e, max: s } = this,
      n = [],
      o = []
    let a, r, l, c, h
    for (a = 0, r = t.length; a < r; ++a) (c = t[a]), c >= e && c <= s && n.push(c)
    if (n.length < 2)
      return [
        { time: e, pos: 0 },
        { time: s, pos: 1 },
      ]
    for (a = 0, r = n.length; a < r; ++a)
      (h = n[a + 1]),
        (l = n[a - 1]),
        (c = n[a]),
        Math.round((h + l) / 2) !== c && o.push({ time: c, pos: a / (r - 1) })
    return o
  }
  _getTimestampsForTable() {
    let t = this._cache.all || []
    if (t.length) return t
    const e = this.getDataTimestamps(),
      s = this.getLabelTimestamps()
    return (
      e.length && s.length ? (t = this.normalize(e.concat(s))) : (t = e.length ? e : s),
      (t = this._cache.all = t),
      t
    )
  }
  getDecimalForValue(t) {
    return (Ye(this._table, t) - this._minPos) / this._tableRange
  }
  getValueForPixel(t) {
    const e = this._offsets,
      s = this.getDecimalForPixel(t) / e.factor - e.end
    return Ye(this._table, s * this._tableRange + this._minPos, !0)
  }
}
C(is, 'id', 'timeseries'), C(is, 'defaults', De.defaults)
var Iu = Object.freeze({
  __proto__: null,
  CategoryScale: Zi,
  LinearScale: Qi,
  LogarithmicScale: ts,
  RadialLinearScale: ge,
  TimeScale: De,
  TimeSeriesScale: is,
})
const Fu = [Uc, yd, pu, Iu]
ut.register(...Fu)
const zu = i => {
    const t = i.map(d => +d.age),
      e = i.map(d => d.department),
      [s, n, o] = [t.filter(d => d < 18), t.filter(d => d >= 18 && d <= 50), t.filter(d => d >= 51)],
      [a, r, l] = [
        e.filter(d => d === 'Dentistry'),
        e.filter(d => d === 'Therapy'),
        e.filter(d => d === 'Cardiology'),
      ],
      c = [o.length, n.length, s.length],
      h = [a.length, r.length, l.length]
    return [c, h]
  },
  Bu = {
    departmentChartOption: {
      responsive: !0,
      plugins: { legend: { position: 'bottom' }, title: { display: !0, text: 'Patients by Department' } },
    },
    ageChartOption: {
      responsive: !0,
      plugins: { legend: { position: 'bottom' }, title: { display: !0, text: 'Patients by Age' } },
    },
  }
Rr()
const Hu = i => {
    const [t, e] = zu(i),
      { departmentChartOption: s, ageChartOption: n } = Bu,
      o = D('#myChart-1'),
      a = D('#myChart-2')
    new ut(o, {
      type: 'doughnut',
      data: {
        labels: ['Dentistry', 'Therapy', 'Cardiology'],
        datasets: [
          { label: 'Patient', data: e, backgroundColor: ['#20a4b6', '#ff6b93', '#ffcd56'], borderWith: 100 },
        ],
      },
      options: s,
    }),
      new ut(a, {
        type: 'doughnut',
        data: {
          labels: ['Elderly', 'Adult', 'Child'],
          datasets: [{ label: 'Patient', data: t, backgroundColor: ['#20a4b6', '#ff6b93', '#ffcd56'] }],
        },
        options: n,
      })
  },
  Nu = './images/filterIcon-60f07d36.svg',
  Wu = './images/rotate-324851a4.svg',
  Vu = i => {
    const t = Wt('.appointment'),
      e = i.target.textContent
    t.forEach(s => {
      const n = s.children[1].textContent,
        o = s.children[4].textContent,
        a = s.children[5].textContent
      e === n || e === o || e === a ? (s.style.display = 'flex') : (s.style.display = 'none')
    })
  },
  $u = () => {
    const i = Wt('.appointment'),
      t = D('.actions'),
      e = k({ el: 'img', css: 'refresh-icon', src: Wu, alt: 'Refresh icon', title: 'Refresh List' })
    e.addEventListener('click', () => i.forEach(s => (s.style.display = 'flex'))), t.append(e)
  },
  zi = (i, t) => {
    const e = D(i),
      s = k({ el: 'img', css: 'filter-icon', src: Nu, alt: 'Filter icon' }),
      n = k({ el: 'div', css: 'filter-wrapper' }),
      o = t.map(a => k({ el: 'span', css: 'drop-item', text: a }))
    n.append(...o), e.append(s, n), n.addEventListener('click', a => Vu(a))
  },
  ju = () => {
    $u(), zi('.priority', Pr), zi('.department', Dr), zi('.status', Tr)
  },
  Uu = (i, t, e) => {
    t === 'Department' &&
      i.forEach(({ department: s }) => {
        const n = Tt('li', 'modal-visit__dropdown-item', `${s}`)
        n.setAttribute('data-post', `${s}`), e.append(n)
      })
  },
  Yu = i => {
    const t = D('.doctor-list')
    i.forEach(({ department: e, doctor: s }) => {
      s.forEach(n => {
        const o = Tt('li', 'modal-visit__dropdown-item', n)
        o.classList.add('doctor-item', `${e}`), t.append(o)
      })
    })
  },
  qu = () => {
    const i = D('.dropDepartment'),
      t = D('.department-title'),
      e = Wt('.doctor-item')
    i.addEventListener('click', s => {
      const n = s.target.getAttribute('data-post')
      Yn(e, n)
    }),
      t.value && Yn(e, t.value)
  },
  Yn = (i, t) => {
    i.forEach(e => {
      e.className.includes(t) ? (e.style.display = 'block') : (e.style.display = 'none')
    })
  },
  fa = ({ img: i, target: t, select: e, title: s }) => {
    i && (i.style.display = 'none'),
      t.getAttribute('data-post') && s && (s.value = ''),
      (e.style.fontWeight = '600'),
      (e.style.color = 'black'),
      (e.value = t.textContent)
  },
  pa = (i, t) => {
    i.addEventListener('click', e => {
      const s = e.target.querySelector('.modal-visit__dropdown-item')
      t.classList.toggle('menu-open'), s && t.classList.remove('menu-open')
    })
  },
  Xu = () => {
    const i = Wt('.dropdown'),
      t = D('.doctor-title'),
      e = D('.modal-visit__img')
    Yu(Wi),
      i.forEach(s => {
        const n = s.querySelector('.modal-visit__dropdown'),
          o = s.querySelector('.modal-visit__dropdown-list'),
          a = s.getAttribute('data-name')
        Uu(Wi, a, o),
          pa(s, o),
          o.addEventListener('click', r => {
            Wt('.dropdown-error').forEach(c => c.remove()),
              fa({ img: e, target: r.target, select: n, title: t }),
              xa(n.value)
          })
      }),
      qu()
  },
  qn = (i, t, e, s, n, o) => `
<div class='modal-visit__wrapper dropdown' data-name='${o}'>
   <input class='modal-visit__gap modal-visit__dropdown placeholder ${i}' name='${s}' type='text' placeholder=' ${t}' value='${n}' required disabled>
   <ul class='modal-visit__dropdown-list ${e}' > </ul>
</div>
`,
  Ku = () => {
    const i = D('.priorities'),
      t = D('.priority-title'),
      e = D('.priority-list')
    pa(i, e),
      e.addEventListener('click', s => {
        const n = { target: s.target, select: t }
        fa(n)
      })
  },
  _t = (i, t, e, s, n, o, a) => `
<label class='${i}'>
     <input class='${t}' name='${o}' type='${e}' pattern='${n}' placeholder='${s}' value='${a}' required>
</label>
`,
  Gu = './images/pacAv1-e6030779.svg',
  Ju = './images/pacAv2-b0210e77.svg',
  Zu = './images/del-351f3847.svg',
  Qu = './images/pen-56b00a16.svg',
  tf = './images/done-ea3b2e61.svg',
  ef = [
    { title: 'Complete', path: tf },
    { title: 'Edit', path: Qu },
    { title: 'Delete', path: Zu },
  ],
  sf = i => {
    const {
        htmlElement: t,
        avatar: e,
        name: s,
        surname: n,
        department: o,
        doctor: a,
        tel: r,
        priority: l,
        status: c,
      } = i,
      h = k({ css: 'actions' }),
      d = k({ css: 'name', text: `${s} ${n}` }),
      u = k({ css: 'avatar' }),
      f = c === 'Closed' ? 'status-close' : 'status'
    u.innerHTML = `<img src = '${e}' alt = 'Client avatar' />`
    const p = [
        k({ css: 'department', text: `${o}` }),
        k({ css: 'doctor', text: `${a}` }),
        k({ css: 'tel', text: `${r}` }),
        k({ css: 'priority', text: `${l}` }),
        k({ css: `${f}`, text: `${c}` }),
      ],
      g = ef.map(({ title: m, path: b }) => {
        const _ = k({ el: 'span', css: 'icon-container' })
        return (
          (_.innerHTML = `<img class='icon-${m.toLowerCase()}' src ='${b}' alt ='${m} icon' title ='${m}'/>`),
          _
        )
      })
    return d.prepend(u), h.append(...g), t.append(d, ...p, h), t
  },
  nf = i => {
    const e = pi().find(n => n.id === i),
      { department: s } = e
    xa(s, e, !0, i)
  }
class vs {
  constructor({ id: t, name: e, surname: s, department: n, doctor: o, tel: a, priority: r, status: l }) {
    C(this, 'parentElement', D('.table-list'))
    ;(this.id = t),
      (this.avatar = Xa(Gu, Ju)),
      (this.name = e),
      (this.surname = s),
      (this.department = n),
      (this.doctor = o),
      (this.tel = a),
      (this.priority = r),
      (this.status = l),
      (this.htmlElement = Tt('div', 'appointment'))
  }
  addNewAppointment() {
    const t = sf(this)
    this.parentElement.append(t), this._addEditOptions()
  }
  _addEditOptions() {
    this.htmlElement.addEventListener('click', async t => {
      const e = t.target.classList.contains('icon-delete'),
        s = t.target.classList.contains('icon-edit'),
        n = t.target.classList.contains('icon-complete'),
        o = this.htmlElement.querySelector('.status')
      e &&
        (await Jt({ url: `${this.id}`, method: 'DELETE' })) === '' &&
        (this.htmlElement.remove(), yr(this.id)),
        n &&
          (o == null ? void 0 : o.textContent) === 'Opened' &&
          (await Jt({ url: `${this.id}`, method: 'PUT', body: { ...this, status: 'Closed' } })) &&
          ((o.textContent = 'Closed'), (o.style.color = '#ff6b93'), vr(this.id)),
        s && nf(this.id)
    })
  }
}
class vi {
  constructor({
    name: t = '',
    surname: e = '',
    priority: s = '',
    goal: n = '',
    description: o = '',
    tel: a = '',
    doctor: r = '',
    department: l = '',
    age: c = '',
  }) {
    C(this, 'commonGapForm', t => {
      t.insertAdjacentHTML(
        'beforeend',
        `
 ${_t('modal-visit__extra small', 'modal-visit__gap placeholder', 'number', 'Age', '', 'age', `${this.age}`)}

${_t(
  'modal-visit__extra',
  'modal-visit__gap placeholder',
  'text',
  'Goal',
  `^[${this.pattern} 0-9 .]+$`,
  'goal',
  `${this.goal}`
)}

    <label class='modal-visit__extra'>
       <textarea class='modal-visit__gap placeholder' name='description' id='w3review' name='w3review' rows='1' cols='50' placeholder='Description'>${
         this.description
       }</textarea>
    </label>
       
       
    ${_t(
      'modal-visit__extra small',
      'modal-visit__gap placeholder',
      'number',
      'Tel.',
      '^[0-9 +]+$',
      'tel',
      `${this.tel}`
    )}
            
    <div class='modal-visit__extra dropdown small priorities'>
     
        <input class='modal-visit__gap modal-visit__dropdown placeholder priority-title' value='${
          this.priority
        }' 
        name='priority' type='text' placeholder='Priority' disabled>
        <ul class='modal-visit__dropdown-list priority-list' >
             <li class='modal-visit__dropdown-item'>High</li>
             <li class='modal-visit__dropdown-item'>Normal</li>
             <li class='modal-visit__dropdown-item'>Low</li>
        </ul>
    </div>`
      ),
        Ku()
    })
    ;(this.name = t),
      (this.surname = e),
      (this.priority = s),
      (this.goal = n),
      (this.description = o),
      (this.tel = a),
      (this.doctor = r),
      (this.department = l),
      (this.age = c),
      (this.status = 'Opened'),
      (this.pattern = 'a-zA-Zа-яА-ЯіІїЇєЄЁё\\s')
  }
  showForm() {
    const t = D('.modal-visit__label-wrapper')
    return (
      (t.innerHTML = `
      
         ${_t(
           'modal-visit__wrapper',
           'modal-visit__gap placeholder',
           'text',
           'Enter name',
           `^[${this.pattern}]+$`,
           'name',
           `${this.name}`
         )}
         ${_t(
           'modal-visit__wrapper',
           'modal-visit__gap placeholder',
           'text',
           'Enter surname',
           `^[${this.pattern}]+$`,
           'surname',
           `${this.surname}`
         )}
        
         ${qn(
           'department-title',
           'Department',
           'dropDepartment',
           'department',
           `${this.department}`,
           'Department'
         )}
         ${qn('doctor-title', 'Doctor', 'doctor-list', 'doctor', `${this.doctor}`)}
         
         <div class='modal-visit__img'>
             <img src='${Ka}' alt='Form'>
         </div>
         
         <div class='modal-visit__label-wrapper new-form'> </div>                        
      `),
      Xu(),
      t
    )
  }
  async postRequest() {
    const t = await Jt({ url: '', method: 'POST', body: this })
    t && (new vs(t).addNewAppointment(), ro(t))
  }
  async putRequest(t) {
    const e = await Jt({ url: `${t}`, method: 'PUT', body: this })
    e && wr(e)
  }
}
const of = './images/Group 1718-ecd5ea02.svg'
class ga extends vi {
  constructor({
    name: t,
    surname: e,
    priority: s,
    goal: n,
    description: o,
    tel: a,
    doctor: r,
    department: l,
    age: c,
    date: h = '',
  }) {
    super({
      name: t,
      surname: e,
      priority: s,
      goal: n,
      description: o,
      tel: a,
      doctor: r,
      department: l,
      age: c,
    }),
      (this.date = h)
  }
  showCalendar(t) {
    t.innerHTML = `<label class='modal-visit__extra small'>
                <input class='modal-visit__gap calendar' name='date' type='date'  value='${this.date}' >
                <div class='modal-visit__calendar-logo'> <img src='${of}' alt='calendar'></div>
            </label>`
  }
}
class ma extends vi {
  constructor({
    name: t,
    surname: e,
    priority: s,
    department: n,
    goal: o,
    description: a,
    tel: r,
    doctor: l,
    age: c,
    pressure: h = '',
    bodyIndex: d = '',
    disease: u = '',
  }) {
    super({
      name: t,
      surname: e,
      priority: s,
      goal: o,
      description: a,
      tel: r,
      doctor: l,
      department: n,
      age: c,
    }),
      (this.pressure = h),
      (this.bodyIndex = d),
      (this.disease = u)
  }
  showHealthInfo(t) {
    t.innerHTML = ` 
 ${_t(
   'modal-visit__extra small',
   'modal-visit__gap placeholder',
   'text',
   'Typical pressure',
   '^[0-9 -.+/]+$',
   'pressure',
   `${this.pressure}`
 )}
 ${_t(
   'modal-visit__extra small',
   'modal-visit__gap placeholder',
   'text',
   'Body mass index',
   '^[0-9 -.+/]+$',
   'bodyIndex',
   `${this.bodyIndex}`
 )}

 ${_t(
   'modal-visit__extra small',
   'modal-visit__gap placeholder',
   'text',
   'Diseases of cardiovascular',
   `^[${this.pattern} 0-9]+$`,
   'disease',
   `${this.disease}`
 )}`
  }
}
class ba extends vi {
  constructor({
    name: t,
    surname: e,
    priority: s,
    goal: n,
    description: o,
    tel: a,
    doctor: r,
    department: l,
    age: c,
    email: h = '',
  }) {
    super({
      name: t,
      surname: e,
      priority: s,
      goal: n,
      description: o,
      tel: a,
      doctor: r,
      department: l,
      age: c,
    }),
      (this.email = h)
  }
  showEmail(t) {
    t.innerHTML = ` 
 ${_t(
   'modal-visit__extra small',
   'modal-visit__gap placeholder',
   'email',
   'Email',
   '^\\S+@\\S+\\.\\S+$',
   'email',
   `${this.email}`
 )}
`
  }
}
const af = i => {
    const t = k({ css: 'dark-block' })
    return (
      (t.innerHTML = `
<div class='modal-visit'>
  <div class='visit-container'>
  <h1 class='modal-visit__title'>Fill in the form</h1>
  <form class='modal-visit__form'> 
  <div class='modal-visit__label-wrapper'> 
  
  </div>
  <div class='modal-visit__box-button'>
          ${Bt('modal-visit__button-cancel', 'Cancel').outerHTML}
          ${
            i === 'Edit'
              ? Bt('modal-visit__button-save', 'Edit').outerHTML
              : Bt('modal-visit__button-save', 'Save').outerHTML
          }
  </div>
  
  </form>
  </div>
</div>
  `),
      t
    )
  },
  rf = (i, t) => {
    i.forEach(e => {
      if (!e.value) {
        const s = k({ el: 'p', css: 'dropdown-error', text: 'Enter the apt value' })
        e.after(s)
      }
    })
  },
  lf = (i, t, e) => {
    const s = D('#app')
    La(s, i, 'Edit', e)
    const n = D('.modal-visit__img'),
      o = D('.new-form')
    ;(n.style.display = 'none'), t.bind(i, o)(), i.commonGapForm(o)
  }
class _a {
  constructor() {
    C(this, 'handleForm', (t, e) => {
      const s = D('.modal-visit__form'),
        n = D('.dark-block')
      s.addEventListener('submit', async o => {
        o.preventDefault()
        const a = D('.department-title'),
          r = Wt('.modal-visit__dropdown'),
          l = {}
        let c = !0
        rf(r)
        {
          r.forEach(d => d.removeAttribute('disabled'))
          const h = new FormData(o.target)
          for (const [d, u] of h.entries()) l[d] = u
          switch (a.value) {
            case 'Cardiology':
              const d = new ma(l)
              t === 'Edit' ? await d.putRequest(e) : await d.postRequest()
              break
            case 'Dentistry':
              const u = new ga(l)
              t === 'Edit' ? await u.putRequest(e) : await u.postRequest()
              break
            case 'Therapy':
              const f = new ba(l)
              t === 'Edit' ? await f.putRequest(e) : await f.postRequest()
          }
          r.forEach(d => d.setAttribute('disabled', c)), n.remove()
        }
      })
    })
    C(this, 'renderExtraForm', (t, e, s, n, o) => {
      t ? lf(e, n.bind(e), o) : (n.bind(e, s)(), e.commonGapForm(s))
    })
  }
  renderModal(t, e) {
    const s = af(e)
    t.append(s)
  }
  closeModal() {
    const t = D('.dark-block'),
      e = D('.modal-visit'),
      s = D('.modal-visit__button-cancel')
    t.addEventListener('click', n => {
      n.composedPath().includes(e) || t.remove()
    }),
      s.addEventListener('click', n => {
        n.preventDefault(), t.remove()
      })
  }
}
const cf = () => {
    D('.register').addEventListener('click', () => {
      const t = D('#app'),
        e = new vi({})
      La(t, e)
    })
  },
  xa = (i, t = {}, e = !1, s) => {
    const n = D('.new-form'),
      o = new _a()
    switch (i) {
      case 'Cardiology':
        const a = new ma(t)
        o.renderExtraForm(e, a, n, a.showHealthInfo, s)
        break
      case 'Dentistry':
        const r = new ga(t)
        o.renderExtraForm(e, r, n, r.showCalendar, s)
        break
      case 'Therapy':
        const l = new ba(t)
        o.renderExtraForm(e, l, n, l.showEmail, s)
    }
  },
  ya = i => {
    D('.main-content').append(i)
  },
  hf = './images/noData-6783ee5e.svg',
  va = i => {
    const t = document.querySelector(i),
      e = k({ el: 'img', css: 'nodata-image', src: hf })
    t.append(e)
  },
  df = async () => {
    const i = await Jt({ url: '', method: 'GET' })
    !i.length && va('.table-list'),
      i.forEach(t => {
        new vs(t).addNewAppointment(), ro(t)
      })
  },
  uf = () => {
    const i = D('.search')
    i.oninput = () => {
      const t = Wt('.appointment'),
        e = i.value.trim()
      e !== ''
        ? t.forEach(s => {
            const n = s.querySelector('.name'),
              o = s.querySelector('.doctor')
            n.innerText.indexOf(e) === -1 && o.innerText.indexOf(e) === -1
              ? (s.style.display = 'none')
              : (s.style.display = 'flex')
          })
        : t.forEach(s => (s.style.display = 'flex'))
    }
  },
  ff = () => {
    const i = D('.main-content'),
      t = D('.header-logo-wrapp'),
      e = D('.header-search-wrap'),
      s = D('.sidebar'),
      n = D('.header-content'),
      o = D('.header-button'),
      a = D('.header-avatar'),
      r = Bt('register', 'New Patient').outerHTML
    ;(i.innerHTML = ''),
      s.classList.add('fade-out'),
      t.classList.add('active'),
      n.classList.add('active'),
      e.classList.add('fade-out'),
      a.classList.add('fade-out'),
      (o.innerHTML = r)
  },
  Xn = async () => {
    ff(), ya(fo), uf(), cf(), await df()
    const i = pi()
    ju(), Hu(i)
  },
  pf = './images/logo-img-dd586def.svg',
  gf = './images/logo-text-53f265d1.svg',
  mf = './images/avatar-fc360bdf.svg',
  bf = './images/search-input-c9afc348.svg',
  _f = () => {
    const i = k({ el: 'header', css: 'header' })
    return (
      (i.innerHTML = `
    <div class="header-logo-wrapp">
      <div class="header-logo">
        <a class="header-logo-link" href="#">
          <img src="${pf}" alt="Logo" />
          <img src="${gf}" alt="Logo Text" />
        </a>
      </div>
    </div>
    <div class="header-content">
      <div class="header-search">
        <div class="header-search-wrap">
          <img class="icon-input" src="${bf}" alt="Search" />
          <input class="search" type="text" placeholder="Search"
        </div>
      </div>
    </div>
    <div class="header-actions">
      <div class="header-button">${Bt('header-login', 'Log in').outerHTML}</div>
      <div class="header-avatar"><img src="${mf}" alt="Avatar" /></div>
    </div>`),
      i
    )
  },
  ss = './images/ukraine-942b52f6.png',
  wa = k({ css: 'sidebar-info' }),
  Ma = k({ css: 'sidebar-covid' }),
  ka = k({ css: 'covid-body' }),
  xf = k({ css: 'covid-title', text: 'Covid information' }),
  Sa = k({ css: 'covid-icon' }),
  yf = k({ el: 'img', css: 'covid-icon-img', src: ss, alt: 'Ukraine' }),
  vf = k({ css: 'covid-icon-title', text: 'Ukraine' }),
  Ca = k({ css: 'covid-info' }),
  wf = [
    k({ css: 'covid-new-recoverdet' }),
    k({ css: 'covid-infected' }),
    k({ css: 'covid-deaths' }),
    Bt('covid-button', 'Show World'),
  ],
  Pa = k({ css: 'sidebar-footer' }),
  Mf = k({ css: 'sidebar-footer-title', text: '© HendyHealth 2023' }),
  kf = k({
    css: 'sidebar-footer-text',
    text: 'HendyHealth is medical management for all doctors, patient & Staff',
  })
ka.append(xf, Sa, Ca)
Sa.append(yf, vf)
Ca.append(...wf)
Pa.append(Mf, kf)
Ma.append(ka)
wa.append(Ma, Pa)
const Sf = './images/sidebar-dashbord-1d50b842.svg',
  Cf = './images/sidebar-appointments-24264bee.svg',
  Pf = './images/sidebar-doctors-bd325400.svg',
  Df = './images/sidebar-patient-b904ac30.svg',
  Kn = './images/sidebar-support-941f31fb.svg',
  Tf = [
    { name: 'Dashboard', path: Sf },
    { name: 'Appointments', path: Cf },
    { name: 'Doctors', path: Pf },
    { name: 'Patient', path: Df },
  ],
  Af = [
    { name: 'Messages', path: Kn },
    { name: 'Settings', path: Kn },
  ],
  Lf = () => {
    const i = k({ css: 'sidebar-menu' }),
      t = k({ css: 'menu-title', text: 'Management' }),
      e = k({ el: 'ul', css: 'sidebar-list' }),
      s = k({ css: 'support-line' }),
      n = k({ css: 'menu-support', text: 'Supports' }),
      o = k({ el: 'ul', css: 'sidebar-list' }),
      a = Tf.map(({ name: l, path: c }) => {
        const h = k({ el: 'li', css: 'sidebar-item' }),
          d = k({ el: 'img', src: c, alt: 'icons' }),
          u = k({ el: 'a', css: 'aside-link', text: l })
        return h.append(d, u), h
      }),
      r = Af.map(({ name: l, path: c }) => {
        const h = k({ el: 'li', css: 'sidebar-item' }),
          d = k({ el: 'img', src: c, alt: 'icons' }),
          u = k({ el: 'a', css: 'aside-link', text: l })
        return h.append(d, u), h
      })
    return o.append(...r), e.append(...a), i.append(t, e, s, n, o), i
  },
  Da = k({ css: 'sidebar' }),
  Ta = k({ css: 'sidebar-content' })
Ta.append(Lf(), wa)
Da.append(Ta)
const Aa = k({ el: 'main', css: 'main' }),
  Of = k({ el: 'div', css: 'main-content' })
Aa.append(Da, Of)
const he = i => i.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
  Ef = {
    UAnewConfirmed: '132',
    UAConfirmed: '212.321',
    UADeaths: '332.131.212',
    worldNewConfirmed: '433.21',
    worldConfirmed: '432.435',
    worldDeaths: '643.214.234',
  },
  Rf = async () => {
    const { Countries: i, Global: t } = await Ni.get('https://api.covid19api.com/summary').json()
    if (i) {
      const e = i.filter(h => h.Country === 'Ukraine'),
        [{ NewConfirmed: s, TotalConfirmed: n, TotalDeaths: o }] = e,
        { NewConfirmed: a, TotalConfirmed: r, TotalDeaths: l } = t
      return {
        UAnew: s,
        UAConfirmed: he(n),
        UADeaths: he(o),
        worldNew: he(a),
        worldConfirmed: he(r),
        worldDeaths: he(l),
      }
    } else return Ef
  },
  If = './images/global-80796eab.png',
  Bi = (i, t, e, s) => {
    const [n, o, a] = t,
      { covidNewRecovered: r, covidInfected: l, covidDeaths: c, covidIconImg: h, covidIconTitle: d } = i
    ;(r.textContent = `Today infected - ${n}`),
      (l.textContent = `All infected - ${o}`),
      (c.textContent = `All deaths - ${a}`),
      (h.src = e),
      (d.textContent = s)
  },
  Ff = async () => {
    const i = Object.values(await Rf()),
      t = D('.covid-button'),
      e = {
        covidNewRecovered: D('.covid-new-recoverdet'),
        covidInfected: D('.covid-infected'),
        covidDeaths: D('.covid-deaths'),
        covidIconImg: D('.covid-icon-img'),
        covidIconTitle: D('.covid-icon-title'),
      }
    Bi(e, i.slice(0, 3), ss, 'Ukraine'),
      t.addEventListener('click', s => {
        s.target.textContent === 'Show World'
          ? ((t.textContent = 'Show Ukraine'), Bi(e, i.slice(0, 3), If, 'World'))
          : ((t.textContent = 'Show World'), Bi(e, i.slice(3), ss, 'Ukraine'))
      })
  },
  zf = () => {
    const i = document.getElementById('app')
    ;(i.innerHTML = ''), i.append(_f(), Aa), ya(oo), fr(), Ff()
  },
  La = (i, t, e, s) => {
    const n = new _a()
    n.renderModal(i, e), t.showForm(), n.closeModal(), n.handleForm(e, s)
  }
zf()
