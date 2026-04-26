const TW_NAMES = {
  "0050.TW":"元大台灣50","0051.TW":"元大中型100","0052.TW":"富邦科技",
  "0053.TW":"元大電子","0056.TW":"元大高股息","006208.TW":"富邦台50",
  "00631L.TW":"元大台灣50正2","00646.TW":"元大S&P500","00662.TW":"富邦NASDAQ",
  "00713.TW":"元大台灣高息低波","00757.TW":"統一FANG+","00878.TW":"國泰永續高股息",
  "00881.TW":"國泰台灣5G+","00900.TW":"富邦特選高股息30","00919.TW":"群益台灣精選高息",
  "00922.TW":"國泰台灣ESG永續","00929.TW":"復華台灣科技優息","00940.TW":"元大台灣價值高息",
  "1101.TW":"台泥","1102.TW":"亞泥","1216.TW":"統一","1301.TW":"台塑",
  "1303.TW":"南亞","1326.TW":"台化","2002.TW":"中鋼","2207.TW":"和泰車",
  "2301.TW":"光寶科","2303.TW":"聯電","2308.TW":"台達電","2317.TW":"鴻海",
  "2327.TW":"國巨","2330.TW":"台積電","2337.TW":"旺宏","2344.TW":"華邦電",
  "2345.TW":"智邦","2347.TW":"聯強","2356.TW":"英業達","2357.TW":"華碩",
  "2360.TW":"致茂","2379.TW":"瑞昱","2382.TW":"廣達","2383.TW":"台光電",
  "2395.TW":"研華","2408.TW":"南亞科","2409.TW":"友達","2412.TW":"中華電",
  "2454.TW":"聯發科","2603.TW":"長榮","2609.TW":"陽明","2615.TW":"萬海",
  "2618.TW":"長榮航","2633.TW":"台灣高鐵","2880.TW":"華南金","2881.TW":"富邦金",
  "2882.TW":"國泰金","2883.TW":"開發金","2884.TW":"玉山金","2885.TW":"元大金",
  "2886.TW":"兆豐金","2887.TW":"台新金","2888.TW":"新光金","2890.TW":"永豐金",
  "2891.TW":"中信金","2892.TW":"第一金","2912.TW":"統一超","3008.TW":"大立光",
  "3017.TW":"奇鋐","3034.TW":"聯詠","3037.TW":"欣興","3045.TW":"台灣大",
  "3231.TW":"緯創","3443.TW":"創意","3481.TW":"群創","3711.TW":"日月光投控",
  "4904.TW":"遠傳","4938.TW":"和碩","5871.TW":"中租控股","5876.TW":"上海商銀",
  "5880.TW":"合庫金","6505.TW":"台塑化","6669.TW":"緯穎","6770.TW":"力積電",
  "8046.TW":"南電",
};

const US_NAMES = {
  // ── 科技巨頭 FAANG+ ──
  "AAPL":"蘋果","MSFT":"微軟","GOOGL":"谷歌-A","GOOG":"谷歌-C",
  "AMZN":"亞馬遜","META":"Meta（臉書）","NVDA":"英偉達","TSLA":"特斯拉",
  "NFLX":"網飛","ORCL":"甲骨文",

  // ── 半導體 ──
  "AMD":"超微半導體","INTC":"英特爾","QCOM":"高通","TXN":"德州儀器",
  "AMAT":"應用材料","ASML":"艾司摩爾","MU":"美光科技","AVGO":"博通",
  "LRCX":"泛林半導體","KLAC":"科磊","MRVL":"邁威爾科技","ON":"安森美",
  "MPWR":"邁信普威","ADI":"亞德諾半導體","SWKS":"天工解決方案",
  "QRVO":"科沃","WOLF":"Wolfspeed","MCHP":"微芯科技","NXPI":"恩智浦",
  "STM":"意法半導體","IFNNY":"英飛凌","TOELY":"東京威力科創",
  "ACLS":"軸心科技","ENTG":"恩特格里斯","MKSI":"MKS儀器",
  "COHU":"Cohu","ONTO":"Onto Innovation","FORM":"FormFactor",
  "UCTT":"超潔淨科技","ICHR":"Ichor Holdings",

  // ── 雲端/企業軟體 ──
  "CRM":"Salesforce","NOW":"ServiceNow","SNOW":"雪花","PLTR":"Palantir",
  "WDAY":"Workday","ADBE":"Adobe","INTU":"Intuit","ADSK":"Autodesk",
  "TEAM":"Atlassian","ZM":"Zoom","DOCU":"DocuSign","OKTA":"Okta",
  "CRWD":"CrowdStrike","ZS":"Zscaler","PANW":"Palo Alto Networks",
  "FTNT":"Fortinet","CHKP":"Check Point","CYBR":"CyberArk",
  "S":"SentinelOne","DDOG":"Datadog","ESTC":"Elastic","MDB":"MongoDB",
  "CFLT":"Confluent","GTLB":"GitLab","HCP":"HashiCorp","PD":"PagerDuty",
  "NCNO":"nCino","BRZE":"Braze","HUBS":"HubSpot","SPRK":"Sprinklr",
  "FROG":"JFrog","SMAR":"Smartsheet","BOX":"Box","DRCT":"Direct Digital",
  "RNG":"RingCentral","EGHT":"8x8","TWLO":"Twilio","BAND":"Bandwidth",
  "NET":"Cloudflare","FSLY":"Fastly","AKAM":"Akamai","LLNW":"Limelight",
  "CLDR":"Cloudera","PSTG":"Pure Storage","NTAP":"NetApp","VRNS":"Varonis",
  "PING":"Ping Identity","SAIL":"SailPoint",

  // ── AI / 機器學習 ──
  "AI":"C3.ai","BBAI":"BigBear.ai","SOUN":"SoundHound AI",
  "UPST":"Upstart","AIOT":"IoTex","IREN":"Iris Energy",
  "SMCI":"超微電腦","DELL":"戴爾科技","HPE":"惠普企業",
  "IONQ":"IonQ（量子運算）","RGTI":"Rigetti Computing",
  "QUBT":"Quantum Computing","ARQQ":"Arqit Quantum",

  // ── 網路/社群/串流 ──
  "SNAP":"Snapchat","PINS":"Pinterest","TWTR":"Twitter（已下市）",
  "RDDT":"Reddit","LYFT":"Lyft","UBER":"優步","DASH":"DoorDash",
  "ABNB":"Airbnb","BKNG":"Booking Holdings","EXPE":"Expedia",
  "SPOT":"Spotify","PARA":"派拉蒙","WBD":"華納兄弟探索",
  "FOXA":"福斯A類","FOX":"福斯B類","NYT":"紐約時報",

  // ── 電商/零售科技 ──
  "SHOP":"Shopify","MELI":"美卡多","SE":"冬海集團","GRAB":"Grab",
  "GLBE":"Global-E Online","BIGC":"BigCommerce","WIX":"Wix",
  "ETSY":"Etsy","EBAY":"eBay","WISH":"ContextLogic",
  "CPNG":"Coupang","OZON":"Ozon","KSPI":"Kaspi.kz",

  // ── 金融科技 ──
  "SQ":"Block（Square）","PYPL":"PayPal","AFRM":"Affirm",
  "COIN":"Coinbase","HOOD":"Robinhood","SOFI":"SoFi",
  "OPEN":"Opendoor","RELY":"Remitly","FLYW":"Flywire",
  "MQ":"Marqeta","XP":"XP Inc","NU":"Nubank","STNE":"StoneCo",
  "V":"Visa","MA":"萬事達卡","AXP":"美國運通","COF":"首都一號",

  // ── 硬體/設備 ──
  "IBM":"IBM","HPQ":"惠普","CSCO":"思科","JNPR":"瞻博網路",
  "ANET":"Arista Networks","CIEN":"Ciena","VIAV":"Viavi Solutions",
  "LITE":"Lumentum","IIVI":"II-VI（現Coherent）","COHR":"Coherent",
  "AMBA":"安巴雷拉","SLAB":"矽實驗室","MTSI":"MACOM",
  "DIOD":"二極體公司","POWI":"Power Integrations",
  "IPHI":"Inphi（已被Marvell收購）",

  // ── 電動車/能源科技 ──
  "RIVN":"Rivian","LCID":"Lucid Motors","NIO":"蔚來","XPEV":"小鵬汽車",
  "LI":"理想汽車","ZEEKR":"極氪","CHPT":"ChargePoint",
  "BLNK":"Blink Charging","EVGO":"EVgo","NKLA":"Nikola",
  "FCEL":"FuelCell Energy","PLUG":"Plug Power","BE":"Bloom Energy",
  "ENPH":"Enphase Energy","SEDG":"SolarEdge","FSLR":"第一太陽能",
  "RUN":"Sunrun","SPWR":"SunPower",

  // ── 中概股ADR ──
  "BABA":"阿里巴巴","JD":"京東","PDD":"拼多多","BIDU":"百度",
  "TCEHY":"騰訊（場外）","NTES":"網易","BILI":"嗶哩嗶哩",
  "IQ":"愛奇藝","TIGR":"老虎證券","FUTU":"富途控股",
  "LAIX":"乂學教育","TAL":"好未來","EDU":"新東方","RLX":"悅刻",
  "DIDI":"滴滴（已下市）","VNET":"21Vianet","CAN":"嘉楠科技",
  "BTBT":"Bit Digital","MARA":"Marathon Digital","RIOT":"Riot Platforms",

  // ── ETF ──
  "SPY":"標普500ETF-SPDR","VOO":"標普500ETF-Vanguard","IVV":"標普500ETF-iShares",
  "QQQ":"納斯達克100ETF-Invesco","TQQQ":"納斯達克100正3ETF","SQQQ":"納斯達克100反3ETF",
  "VTI":"全市場指數ETF-Vanguard","VT":"全球股票ETF-Vanguard",
  "VEA":"已開發市場ETF-Vanguard","VWO":"新興市場ETF-Vanguard",
  "EEM":"新興市場ETF-iShares","EFA":"已開發市場ETF-iShares",
  "GLD":"黃金ETF-SPDR","IAU":"黃金ETF-iShares","SLV":"白銀ETF",
  "TLT":"20年期美債ETF","IEF":"7-10年美債ETF","SHY":"1-3年美債ETF",
  "HYG":"高收益債ETF","LQD":"投資級公司債ETF",
  "XLK":"科技類股ETF","XLF":"金融類股ETF","XLE":"能源類股ETF",
  "XLV":"醫療類股ETF","XLI":"工業類股ETF","XLY":"非必需消費ETF",
  "SOXX":"費城半導體ETF","SMH":"半導體ETF-VanEck",
  "ARKK":"ARK創新ETF","ARKG":"ARK基因革命ETF","ARKW":"ARK下一代網路ETF",
  "ARKF":"ARK金融科技ETF","ARKO":"ARK太空探索ETF",
  "VNQ":"不動產ETF-Vanguard","IYR":"不動產ETF-iShares",
  "DIA":"道瓊ETF","MDY":"標普中型400ETF","IWM":"羅素2000ETF",
  "SOXL":"費城半導體正3ETF","SOXS":"費城半導體反3ETF",
  "UPRO":"標普500正3ETF","SPXS":"標普500反3ETF",
  "TECL":"科技類股正3ETF","TECS":"科技類股反3ETF",
  "FNGU":"FANG+正3ETF","FNGD":"FANG+反3ETF",

  // ── 其他大型科技/軟體 ──
  "UBER":"優步","ABNB":"Airbnb","RBLX":"Roblox","U":"Unity",
  "PLTK":"Playtika","EA":"藝電","TTWO":"Take-Two互動",
  "ATVI":"動視暴雪（已被微軟收購）","NTES":"網易",
  "ZEN":"Zendesk","SPSC":"SPS Commerce","PCTY":"Paylocity",
  "PAYC":"Paycom","COUP":"Coupa Software","APPF":"AppFolio",
  "ASAN":"Asana","MNDY":"Monday.com","TASK":"TaskUs",
  "EXLS":"ExlService","EPAM":"EPAM Systems","GLOB":"Globant",
};

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const q = (url.searchParams.get("q") ?? "").trim().toUpperCase();
  if (!q) return new Response("[]", { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });

  // 1. TW names
  const twMatches = Object.entries(TW_NAMES)
    .filter(([ticker, name]) =>
      ticker.replace(".TW","").startsWith(q) || ticker.replace(".TW","") === q || name.includes(q)
    ).slice(0, 5).map(([ticker, name]) => ({ ticker, name }));
  if (twMatches.length > 0) {
    return new Response(JSON.stringify(twMatches), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }

  // 2. US names
  const usMatches = Object.entries(US_NAMES)
    .filter(([ticker, name]) => ticker.startsWith(q) || ticker === q || name.includes(q))
    .slice(0, 5).map(([ticker, name]) => ({ ticker, name }));
  if (usMatches.length > 0) {
    return new Response(JSON.stringify(usMatches), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }

  // 3. Yahoo fallback
  try {
    const yahooUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&lang=zh-TW&region=TW&quotesCount=6&newsCount=0`;
    const res = await fetch(yahooUrl, { headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/json" } });
    const data = await res.json();
    const quotes = (data?.quotes ?? [])
      .filter(q => q.quoteType === "EQUITY" || q.quoteType === "ETF")
      .map(q => ({ ticker: q.symbol, name: q.longname || q.shortname || q.symbol }))
      .slice(0, 5);
    return new Response(JSON.stringify(quotes), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  } catch {
    return new Response("[]", { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
  }
}
