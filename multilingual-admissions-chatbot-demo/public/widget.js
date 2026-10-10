/* ============================================================
   Yashoda Assistant — admissions chat widget (vanilla, no deps)
   Drop-in for the YTC Satara admissions demo. Talks to /api/chat,
   answers only from the college knowledge base, hands off to
   WhatsApp when unsure, and captures callbacks via /api/callback.
   ============================================================ */
(function () {
  "use strict";

  /* ---------------- config ---------------- */
  var API_CHAT = "/api/chat";
  var API_CALLBACK = "/api/callback";
  var WA_NUMBER = "91917220775";
  var MAX_LEN = 500;

  /* ---------------- i18n ---------------- */
  var L = {
    en: {
      title: "Yashoda Assistant",
      subtitle: "Admissions · Satara",
      fabLabel: "Ask me",
      placeholder: "Type your question…",
      greet:
        "Namaskar! Welcome to Yashoda Technical Campus, Satara. I'm the Yashoda admissions assistant — ask me about courses and intake, the admission process, eligibility, fees, hostels and transport, scholarships or placements. How can I help your family today?",
      chips: {
        admissions: { l: "Admissions", q: "What is the admission process at Yashoda?" },
        courses: { l: "Courses & intake", q: "Which courses are offered and what is the intake?" },
        eligibility: { l: "Eligibility", q: "What is the eligibility for B.Tech admission?" },
        fees: { l: "Fees", q: "What are the fees? Please share the fee structure." },
        hostel: { l: "Hostel & transport", q: "Tell me about hostels and the bus facility." },
        scholarships: { l: "Scholarships", q: "Which scholarships can I apply for, and how?" },
        placements: { l: "Placements", q: "How are placements at Yashoda? What packages do students get?" },
      },
      listening: "Listening… speak now",
      voiceNo: "Voice input isn't supported on this browser — please type instead.",
      typing: "typing…",
      waGo: "Continue on WhatsApp",
      verify: "Verify with the office",
      srcPre: "From:",
      cbCta: "Request a callback",
      formTitle: "The admission office will call you",
      nameL: "Your name",
      namePh: "e.g. Suresh Pawar",
      phoneL: "Mobile number",
      phonePh: "10-digit mobile",
      intL: "Course interest",
      consL: "The office may call / WhatsApp me about admission.",
      submit: "Submit request",
      sending: "Sending…",
      chipNote: "Quick topics",
      nextLabel: "Next",
      powered: "Answers only from YTC's published info · prototype, not an official college service",
      networkErr: "Connectivity issue on my side — please try again, or continue on WhatsApp with the office.",
      newChat: "Restart",
      langName: "English",
    },
    hi: {
      title: "यशोदा सहायक",
      subtitle: "एडमिशन · सातारा",
      fabLabel: "पूछें",
      placeholder: "अपना सवाल लिखें…",
      greet:
        "नमस्कार! यशोदा टेक्निकल कैंपस, सातारा में आपका स्वागत है। मैं यशोदा एडमिशन सहायक हूँ — कोर्स और सीटें, एडमिशन प्रक्रिया, पात्रता, फीस, हॉस्टेल और बस, छात्रवृत्ति या प्लेसमेंट — कुछ भी पूछिए। आज आपके परिवार की क्या मदद करूँ?",
      chips: {
        admissions: { l: "एडमिशन", q: "यशोदा में एडमिशन की प्रक्रिया क्या है?" },
        courses: { l: "कोर्स और सीटें", q: "कौन से कोर्स हैं और सीटें कितनी हैं?" },
        eligibility: { l: "पात्रता", q: "बी.टेक एडमिशन के लिए पात्रता क्या है?" },
        fees: { l: "फीस", q: "फीस कितनी है? फी स्ट्रक्चर बताएं।" },
        hostel: { l: "हॉस्टेल और बस", q: "हॉस्टेल और बस सुविधा के बारे में बताएं।" },
        scholarships: { l: "छात्रवृत्ति", q: "मैं कौन सी छात्रवृत्ति के लिए अप्लाई कर सकता हूँ और कैसे?" },
        placements: { l: "प्लेसमेंट", q: "यशोदा में प्लेसमेंट कैसा है? कितना पैकेज मिलता है?" },
      },
      listening: "सुन रहा है… बोलिए",
      voiceNo: "इस ब्राउज़र में वॉइस इनपुट नहीं चलता — कृपया टाइप करें।",
      typing: "लिख रहा है…",
      waGo: "WhatsApp पर आगे बात करें",
      verify: "ऑफिस से कन्फर्म करें",
      srcPre: "स्रोत:",
      cbCta: "कॉलबैक मागवा",
      formTitle: "एडमिशन ऑफिस आपको कॉल करेगा",
      nameL: "आपका नाम",
      namePh: "जैसे: सुरेश पवार",
      phoneL: "मोबाइल नंबर",
      phonePh: "10 अंकों का मोबाइल",
      intL: "किस कोर्स में रुचि?",
      consL: "ऑफिस मुझसे एडमिशन बाबत कॉल / WhatsApp कर सकता है।",
      submit: "रिक्वेस्ट भेजें",
      sending: "भेजा जा रहा है…",
      chipNote: "त्वरित विषय",
      nextLabel: "आगे",
      powered: "सिर्फ़ YTC की प्रकाशित जानकारी से उत्तर · यह प्रोटोटाइप है, आधिकारिक सेवा नहीं",
      networkErr: "मेरी तरफ़ संपर्क में दिक्कत है — फिर कोशिश करें, या WhatsApp पर ऑफिस से बात करें।",
      newChat: "नई बातचीत",
      langName: "हिन्दी",
    },
    mr: {
      title: "यशोदा सहाय्यक",
      subtitle: "ऍडमिशन · सातारा",
      fabLabel: "विचारा",
      placeholder: "तुमचा प्रश्न लिहा…",
      greet:
        "नमस्कार! यशोदा टेक्निकल कॅम्पस, सातारा मध्ये आपले स्वागत आहे. मी यशोदा ऍडमिशन सहाय्यक आहे — अभ्यासक्रम व जागा, प्रवेश प्रक्रिया, पात्रता, फी, वसतिगृह व बस, शिष्यवृत्ती किंवा प्लेसमेंट — काहीही विचारा. आज आपल्या कुटुंबाला कशी मदत करू?",
      chips: {
        admissions: { l: "ऍडमिशन", q: "यशोदामध्ये ऍडमिशनची प्रक्रिया कशी आहे?" },
        courses: { l: "अभ्यासक्रम व जागा", q: "कोणते अभ्यासक्रम आहेत आणि प्रवेश क्षमता किती?" },
        eligibility: { l: "पात्रता", q: "बी.टेक ऍडमिशनसाठी पात्रता काय आहे?" },
        fees: { l: "फी", q: "फी किती आहे? फी स्ट्रक्चर सांगा." },
        hostel: { l: "वसतिगृह व बस", q: "वसतिगृह आणि बस सुविधेबद्दल सांगा." },
        scholarships: { l: "शिष्यवृत्ती", q: "मी कोणत्या शिष्यवृत्तींसाठी अर्ज करू शकतो/शकते आणि कसा?" },
        placements: { l: "प्लेसमेंट", q: "यशोदामध्ये प्लेसमेंट कसा आहे? किती पॅकेज मिळते?" },
      },
      listening: "ऐकत आहे… बोला",
      voiceNo: "या ब्राउझरमध्ये व्हॉइस इनपुट नाही — कृपया टाइप करा.",
      typing: "टाइप करत आहे…",
      waGo: "WhatsApp वर पुढे बोला",
      verify: "ऑफिसकडून कन्फर्म करा",
      srcPre: "स्त्रोत:",
      cbCta: "कॉलबैकची विनंती करा",
      formTitle: "ऍडमिशन ऑफिस तुम्हाला कॉल करेल",
      nameL: "तुमचे नाव",
      namePh: "उदा. सुरेश पवार",
      phoneL: "मोबाईल नंबर",
      phonePh: "१० अंकी मोबाईल",
      intL: "कोणत्या अभ्यासक्रमात रस?",
      consL: "ऑफिस मला ऍडमिशनबाबत कॉल / WhatsApp करू शकते.",
      submit: "विनंती पाठवा",
      sending: "पाठवत आहे…",
      chipNote: "त्वरित विषय",
      nextLabel: "पुढे",
      powered: "फक्त YTC च्या प्रकाशित माहितीवरून उत्तरे · हे प्रोटोटाइप आहे, अधिकृत सेवा नाही",
      networkErr: "माझ्या बाजूने संपर्कात अडचण आहे — पुन्हा प्रयत्न करा, किंवा WhatsApp वर ऑफिसशी बोला.",
      newChat: "नवीन संवाद",
      langName: "मराठी",
    },
  };

  var INTERESTS = [
    "B.Tech — Engineering",
    "M.Tech — Engineering",
    "Polytechnic Diploma",
    "D.Pharmacy",
    "B.Pharmacy / Pharm D",
    "M.Pharmacy",
    "MBA",
    "MCA",
    "BBA / BCA",
    "Architecture (YCOA)",
    "Not sure yet",
  ];

  var SR_LANG = { en: "en-IN", hi: "hi-IN", mr: "mr-IN" };

  /* ---------------- state ---------------- */
  var lang = "en";
  try {
    var saved = window.localStorage.getItem("yc-lang");
    if (saved && L[saved]) lang = saved;
  } catch (e) {}
  var history = []; // {role, text}
  var opened = false;
  var busy = false;
  var greeted = false;
  var recognizing = false;
  var lastIntent = ""; // which canned answer we're currently threading from

  function t() {
    return L[lang];
  }

  /* ---------------- shadow root ---------------- */
  var host = document.createElement("div");
  host.id = "yashoda-assistant-host";
  document.body.appendChild(host);
  var root = host.attachShadow ? host.attachShadow({ mode: "open" }) : host;

  var css = "" +
    ":host{all:initial;--navy:#0f4c81;--navy-deep:#003560;--orange:#e15108;--orange2:#ee8003;--gold:#ea9c30;--ink:#212331;--line:rgba(15,27,46,.12);font-family:'Noto Sans','Noto Sans Devanagari',system-ui,sans-serif;}" +
    "*{box-sizing:border-box;margin:0;padding:0;font-family:inherit;}" +
    "button{font-family:inherit;cursor:pointer;border:0;background:none;}" +
    ".fab{position:fixed;right:18px;bottom:18px;z-index:99999;display:flex;align-items:center;gap:9px;height:58px;padding:0 22px 0 18px;border-radius:999px;" +
    "background:linear-gradient(135deg,#e15108,#ee8003);color:#fff;box-shadow:0 10px 30px rgba(225,81,8,.42),0 2px 6px rgba(0,0,0,.18);transition:transform .18s ease,box-shadow .18s ease;}" +
    ".fab:hover{transform:translateY(-2px) scale(1.02);}" +
    ".fab svg{width:24px;height:24px;}" +
    ".fab .lbl{font-size:15px;font-weight:700;letter-spacing:.01em;}" +
    ".fab .dot{position:absolute;top:-2px;right:-2px;width:15px;height:15px;border-radius:50%;background:#128c5e;border:2.5px solid #fff;}" +
    ".fab.hide{display:none;}" +
    "@media(max-width:640px){.fab .lbl{display:none;}.fab{width:58px;padding:0;justify-content:center;}}" +
    ".panel{position:fixed;z-index:100000;right:18px;bottom:88px;width:404px;max-width:calc(100vw - 24px);height:min(660px,calc(100dvh - 116px));" +
    "display:flex;flex-direction:column;background:#fbf8f2;border:1px solid var(--line);border-radius:22px;overflow:hidden;" +
    "box-shadow:0 24px 70px rgba(10,42,74,.30),0 4px 16px rgba(10,42,74,.18);}" +
    ".panel[hidden]{display:none;}" +
    ".panel{animation:rise .26s cubic-bezier(.2,.9,.3,1.15);}" +
    "@keyframes rise{from{transform:translateY(18px) scale(.98);opacity:0;}}" +
    "@media(max-width:640px){.panel{inset:0;width:auto;max-width:none;height:auto;border-radius:0;border:0;bottom:0;right:0;}}" +
    ".p-head{display:flex;align-items:center;gap:11px;padding:13px 14px;background:linear-gradient(135deg,#003560,#0f4c81);color:#fff;flex:0 0 auto;}" +
    ".p-ava{width:42px;height:42px;border-radius:13px;background:#fff;color:var(--navy);display:grid;place-items:center;font-weight:800;font-size:20px;flex:0 0 auto;box-shadow:inset 0 0 0 1.5px rgba(234,156,48,.6);}" +
    ".p-tit{line-height:1.22;min-width:0;}" +
    ".p-tit b{font-size:15.5px;display:block;white-space:nowrap;}" +
    ".p-tit small{font-size:11.5px;opacity:.85;display:flex;align-items:center;gap:5px;}" +
    ".p-tit small i{width:6px;height:6px;border-radius:50%;background:#4ade80;display:inline-block;}" +
    ".p-langs{margin-left:auto;display:flex;gap:4px;flex:0 0 auto;}" +
    ".p-langs button{font-size:11.5px;font-weight:700;padding:6px 9px;border-radius:999px;border:1px solid rgba(255,255,255,.4);color:#fff;min-height:32px;}" +
    ".p-langs button.on{background:#fff;color:var(--navy);border-color:#fff;}" +
    ".p-hbtn{width:36px;height:36px;border-radius:10px;display:grid;place-items:center;color:#fff;flex:0 0 auto;}" +
    ".p-hbtn:hover{background:rgba(255,255,255,.14);}" +
    ".p-hbtn svg{width:18px;height:18px;}" +
    ".p-body{flex:1;overflow-y:auto;padding:16px 14px 10px;display:flex;flex-direction:column;gap:12px;scroll-behavior:smooth;-webkit-overflow-scrolling:touch;}" +
    ".day{align-self:center;font-size:10.5px;color:#8a8ea3;background:rgba(15,76,129,.07);padding:4px 11px;border-radius:999px;}" +
    ".msg{max-width:88%;padding:11px 14px;border-radius:16px;font-size:14.2px;line-height:1.6;color:var(--ink);word-wrap:break-word;}" +
    ".msg.bot{align-self:flex-start;background:#fff;border:1px solid var(--line);border-bottom-left-radius:6px;box-shadow:0 1px 3px rgba(10,42,74,.06);}" +
    ".msg.user{align-self:flex-end;background:linear-gradient(135deg,#0f4c81,#0a3a63);color:#fff;border-bottom-right-radius:6px;}" +
    ".msg .meta{display:block;margin-top:8px;font-size:10.8px;color:#8a8ea3;}" +
    ".acts{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;}" +
    ".fups{display:flex;flex-wrap:wrap;gap:7px;margin-top:11px;padding-top:11px;border-top:1px dashed var(--line);}" +
    ".fups .fl{flex-basis:100%;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#9aa0b5;margin-bottom:1px;}" +
    ".fup{background:rgba(15,76,129,.07);border:1px solid rgba(15,76,129,.18);color:var(--navy);border-radius:999px;padding:9px 14px;font-size:12.6px;font-weight:600;min-height:40px;text-align:left;}" +
    ".fup:hover{background:var(--navy);color:#fff;border-color:var(--navy);}" +
    ".fup::after{content:\" \\2192\";opacity:.55;}" +
    ".wa-btn{display:inline-flex;align-items:center;gap:8px;background:#12a04f;color:#fff;font-size:13px;font-weight:700;padding:10px 14px;border-radius:11px;text-decoration:none;min-height:44px;}" +
    ".wa-btn:hover{background:#0d8a42;}" +
    ".wa-btn svg{width:17px;height:17px;}" +
    ".ghost-btn{display:inline-flex;align-items:center;gap:7px;background:rgba(15,76,129,.08);color:var(--navy);font-size:12.6px;font-weight:700;padding:9px 13px;border-radius:11px;min-height:40px;}" +
    ".ghost-btn:hover{background:rgba(15,76,129,.14);}" +
    ".verify{display:inline-flex;align-items:center;gap:6px;font-size:11.5px;color:#8a8ea3;text-decoration:none;padding:6px 2px;}" +
    ".verify:hover{color:var(--navy);}" +
    ".typing{display:inline-flex;gap:5px;align-items:center;padding:13px 16px;}" +
    ".typing i{width:7px;height:7px;border-radius:50%;background:#9aa0b5;animation:tp 1.2s infinite;}" +
    ".typing i:nth-child(2){animation-delay:.18s;}.typing i:nth-child(3){animation-delay:.36s;}" +
    "@keyframes tp{0%,60%,100%{transform:translateY(0);opacity:.5;}30%{transform:translateY(-4px);opacity:1;}}" +
    ".p-chips{flex:0 0 auto;padding:9px 12px 7px;border-top:1px solid var(--line);background:#fff;}" +
    ".p-chips .lbl{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#9aa0b5;margin-bottom:6px;}" +
    ".crow{display:flex;gap:7px;overflow-x:auto;padding-bottom:4px;scrollbar-width:thin;}" +
    ".cbtn{flex:0 0 auto;white-space:nowrap;background:#fff;border:1px solid var(--line);border-radius:999px;padding:9px 14px;font-size:12.4px;font-weight:600;color:#39415e;min-height:40px;}" +
    ".cbtn:hover{border-color:var(--navy);color:var(--navy);background:rgba(15,76,129,.05);}" +
    ".p-in{flex:0 0 auto;display:flex;gap:8px;align-items:center;padding:10px 12px;background:#fff;border-top:1px solid var(--line);}" +
    ".p-in input{flex:1;min-width:0;height:48px;border:1.5px solid var(--line);border-radius:14px;padding:0 14px;font-size:14.5px;font-family:inherit;color:var(--ink);background:#fdfcf9;outline:none;}" +
    ".p-in input:focus{border-color:var(--navy);box-shadow:0 0 0 3px rgba(15,76,129,.12);}" +
    ".icn-btn{width:48px;height:48px;border-radius:14px;display:grid;place-items:center;flex:0 0 auto;color:var(--navy);background:rgba(15,76,129,.08);}" +
    ".icn-btn:hover{background:rgba(15,76,129,.15);}" +
    ".icn-btn svg{width:20px;height:20px;}" +
    ".icn-btn.send{background:linear-gradient(135deg,#e15108,#ee8003);color:#fff;box-shadow:0 4px 14px rgba(225,81,8,.35);}" +
    ".icn-btn.rec{background:#d92d20;color:#fff;animation:recp 1.1s infinite;}" +
    "@keyframes recp{0%,100%{box-shadow:0 0 0 0 rgba(217,45,32,.4);}60%{box-shadow:0 0 0 9px rgba(217,45,32,0);}}" +
    ".p-foot{flex:0 0 auto;text-align:center;font-size:9.8px;color:#a4a9bc;padding:6px 10px 8px;background:#fff;}" +
    ".listen-bar{font-size:12px;color:#b3540a;background:#fef1e4;border:1px solid #f3d3a9;padding:7px 12px;border-radius:10px;align-self:center;}" +
    /* callback card */
    ".cb{align-self:stretch;background:#fff;border:1.5px solid rgba(15,76,129,.22);border-radius:16px;padding:14px;box-shadow:0 2px 10px rgba(10,42,74,.07);}" +
    ".cb h5{font-size:14px;color:var(--navy);margin-bottom:10px;display:flex;gap:8px;align-items:center;}" +
    ".cb label{display:block;font-size:11.5px;font-weight:700;color:#6d7289;margin:9px 0 4px;}" +
    ".cb input[type=text],.cb input[type=tel],.cb select{width:100%;height:46px;border:1.5px solid var(--line);border-radius:11px;padding:0 12px;font-size:14px;font-family:inherit;color:var(--ink);background:#fdfcf9;outline:none;}" +
    ".cb input:focus,.cb select:focus{border-color:var(--navy);}" +
    ".cb .cons{display:flex;gap:9px;align-items:flex-start;margin-top:11px;font-size:12.4px;color:#4a4e66;line-height:1.5;}" +
    ".cb .cons input{width:19px;height:19px;margin-top:2px;accent-color:var(--navy);flex:0 0 auto;}" +
    ".cb .sub{width:100%;margin-top:13px;height:48px;border-radius:12px;background:linear-gradient(135deg,#0f4c81,#003560);color:#fff;font-size:14px;font-weight:700;}" +
    ".cb .sub[disabled]{opacity:.6;cursor:default;}" +
    ".cb .cancel{margin-top:8px;width:100%;font-size:12px;color:#8a8ea3;padding:8px;}" +
    ".sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);}";

  var style = document.createElement("style");
  style.textContent = css;
  root.appendChild(style);

  /* ---------------- icons ---------------- */
  var SVG = {
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>',
    mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 19v3M12 19h0"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    restart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.9L2 22l5.25-1.5A9.9 9.9 0 1 0 12.04 2zm0 1.8a8.1 8.1 0 1 1-4.13 15.06l-.3-.17-3.07.88.86-2.98-.2-.31A8.1 8.1 0 0 1 12.04 3.8zm-3.3 3.9c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.1 4.48.7.3 1.26.48 1.7.62.7.22 1.35.19 1.86.11.57-.08 1.74-.7 1.98-1.4.24-.68.24-1.27.17-1.4-.07-.12-.27-.2-.57-.35-.3-.15-1.74-.85-2-1s-.47-.15-.67.15-.77.99-.94 1.2c-.17.2-.35.22-.65.07a8.2 8.2 0 0 1-2.4-1.48 9 9 0 0 1-1.66-2.07c-.17-.3-.02-.46.13-.6.14-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.67-.51h-.63z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  };

  /* ---------------- DOM ---------------- */
  function el(tag, cls, html) {
    var d = document.createElement(tag);
    if (cls) d.className = cls;
    if (html != null) d.innerHTML = html;
    return d;
  }

  var fab = el("button", "fab");
  fab.setAttribute("aria-label", "Open Yashoda admissions assistant");
  fab.innerHTML = SVG.chat + '<span class="lbl"></span><span class="dot"></span>';
  root.appendChild(fab);

  var panel = el("div", "panel");
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Yashoda admissions assistant");
  panel.hidden = true;

  var head = el("div", "p-head");
  head.innerHTML =
    '<div class="p-ava">य</div>' +
    '<div class="p-tit"><b></b><small><i></i><span class="sub"></span></small></div>' +
    '<div class="p-langs">' +
    '<button data-l="en">EN</button><button data-l="hi">हिं</button><button data-l="mr">मराठी</button>' +
    "</div>" +
    '<button class="p-hbtn rs" aria-label="Restart conversation">' + SVG.restart + "</button>" +
    '<button class="p-hbtn cl" aria-label="Close chat">' + SVG.x + "</button>";
  panel.appendChild(head);

  var body = el("div", "p-body");
  panel.appendChild(body);

  var chipBox = el("div", "p-chips");
  panel.appendChild(chipBox);

  var inputBar = el("form", "p-in");
  var micBtn = el("button", "icn-btn mic");
  micBtn.type = "button";
  micBtn.innerHTML = SVG.mic;
  micBtn.setAttribute("aria-label", "Voice input");
  var input = document.createElement("input");
  input.type = "text";
  input.maxLength = MAX_LEN;
  input.setAttribute("aria-label", "Message");
  var sendBtn = el("button", "icn-btn send");
  sendBtn.type = "submit";
  sendBtn.innerHTML = SVG.send;
  sendBtn.setAttribute("aria-label", "Send");
  inputBar.appendChild(micBtn);
  inputBar.appendChild(input);
  inputBar.appendChild(sendBtn);
  panel.appendChild(inputBar);

  var foot = el("div", "p-foot");
  panel.appendChild(foot);
  root.appendChild(panel);

  /* ---------------- rendering helpers ---------------- */
  function scrollBody() {
    body.scrollTop = body.scrollHeight + 200;
  }

  function renderRich(container, text) {
    var blocks = String(text).split(/\n{2,}/);
    blocks.forEach(function (b, bi) {
      var p = document.createElement("div");
      if (bi > 0) p.style.marginTop = "8px";
      var lines = b.split("\n");
      lines.forEach(function (ln, li) {
        if (li > 0) p.appendChild(document.createElement("br"));
        p.appendChild(document.createTextNode(ln));
      });
      container.appendChild(p);
    });
  }

  function waHref(url) {
    return url || "https://wa.me/" + WA_NUMBER;
  }

  function addActions(container, opts) {
    var acts = el("div", "acts");
    if (opts.handoff && opts.primary) {
      var a = el("a", "wa-btn");
      a.href = waHref(opts.handoff);
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.innerHTML = SVG.wa + "<span></span>";
      a.querySelector("span").textContent = t().waGo;
      acts.appendChild(a);
      var cb = el("button", "ghost-btn");
      cb.type = "button";
      cb.innerHTML = SVG.phone + "<span></span>";
      cb.querySelector("span").textContent = t().cbCta;
      cb.addEventListener("click", showCallbackForm);
      acts.appendChild(cb);
    } else {
      if (opts.handoff) {
        var v = el("a", "verify");
        v.href = waHref(opts.handoff);
        v.target = "_blank";
        v.rel = "noopener noreferrer";
        v.textContent = t().verify + " ↗";
        acts.appendChild(v);
      }
      var cb2 = el("button", "verify");
      cb2.type = "button";
      cb2.style.background = "none";
      cb2.style.cursor = "pointer";
      cb2.textContent = t().cbCta + " →";
      cb2.addEventListener("click", showCallbackForm);
      acts.appendChild(cb2);
    }
    container.appendChild(acts);
  }

  function botMsg(text, opts) {
    opts = opts || {};
    var m = el("div", "msg bot");
    renderRich(m, text);
    if (opts.source) {
      var s = el("span", "meta");
      s.textContent = t().srcPre + " " + opts.source.title + " — " + opts.source.heading;
      m.appendChild(s);
    }
    if (opts.followUps && opts.followUps.length) {
      var fw = el("div", "fups");
      var fl = el("span", "fl");
      fl.textContent = t().nextLabel || "Next";
      fw.appendChild(fl);
      opts.followUps.slice(0, 4).forEach(function (f) {
        var b = el("button", "fup");
        b.type = "button";
        b.textContent = f.label;
        b.addEventListener("click", function () {
          send(f.label, f.intent);
        });
        fw.appendChild(b);
      });
      m.appendChild(fw);
    }
    if (opts.actions !== false) addActions(m, opts);
    body.appendChild(m);
    scrollBody();
    return m;
  }

  function userMsg(text) {
    var m = el("div", "msg user");
    m.textContent = text;
    body.appendChild(m);
    scrollBody();
  }

  function typingOn() {
    var m = el("div", "msg bot typing");
    m.setAttribute("aria-label", t().typing);
    m.innerHTML = "<i></i><i></i><i></i>";
    body.appendChild(m);
    scrollBody();
    return m;
  }

  /* ---------------- greeting ---------------- */
  function greet(force) {
    if (greeted && !force) return;
    greeted = true;
    body.innerHTML = "";
    var day = el("span", "day");
    day.textContent = new Date().toLocaleDateString(lang === "en" ? "en-IN" : lang + "-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    body.appendChild(day);
    botMsg(t().greet, { actions: false });
  }

  /* ---------------- language ---------------- */
  function applyLang(next, opts) {
    lang = next;
    try {
      window.localStorage.setItem("yc-lang", next);
    } catch (e) {}
    fab.querySelector(".lbl").textContent = t().fabLabel;
    head.querySelector(".p-tit b").textContent = t().title;
    head.querySelector(".p-tit .sub").textContent = t().subtitle;
    input.placeholder = t().placeholder;
    foot.textContent = t().powered;
    head.querySelectorAll(".p-langs button").forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-l") === lang);
    });
    renderChips();
    if (opts && opts.regreet) greet(true);
  }

  function renderChips() {
    chipBox.innerHTML = "";
    var lbl = el("div", "lbl");
    lbl.textContent = t().chipNote;
    chipBox.appendChild(lbl);
    var row = el("div", "crow");
    Object.keys(t().chips).forEach(function (key) {
      var c = el("button", "cbtn");
      c.type = "button";
      c.textContent = t().chips[key].l;
      c.addEventListener("click", function () {
        send(t().chips[key].q, key);
      });
      row.appendChild(c);
    });
    chipBox.appendChild(row);
  }

  /* ---------------- send flow ---------------- */
  function send(text, intent) {
    text = String(text || "").trim();
    if (!text || busy) return;
    if (text.length > MAX_LEN) text = text.slice(0, MAX_LEN);
    busy = true;
    userMsg(text);
    input.value = "";
    history.push({ role: "user", text: text });
    var tp = typingOn();

    var ctl = new AbortController();
    var killer = setTimeout(function () {
      ctl.abort();
    }, 30000);

    fetch(API_CHAT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, lang: lang, intent: intent || "", lastIntent: lastIntent || "", history: history.slice(-8) }),
      signal: ctl.signal,
    })
      .then(function (r) {
        return r.json().catch(function () {
          return { ok: false };
        });
      })
      .then(function (res) {
        clearTimeout(killer);
        tp.remove();
        busy = false;
        if (res && res.reply) {
          history.push({ role: "assistant", text: res.reply.slice(0, 600) });
          var primaryHandoff = res.via === "handoff" || res.via === "error";
          lastIntent = typeof res.intent === "string" ? res.intent : "";
          botMsg(res.reply, {
            source: res.source || null,
            handoff: res.handoff || null,
            primary: primaryHandoff,
            followUps: res.followUps || null,
          });
        } else {
          botMsg(t().networkErr, { handoff: waFallback(text), primary: true });
        }
      })
      .catch(function () {
        clearTimeout(killer);
        tp.remove();
        busy = false;
        botMsg(t().networkErr, { handoff: waFallback(text), primary: true });
      });
  }

  function waFallback(q) {
    var txt = "Namaskar! I was chatting with the Yashoda admissions assistant (online demo).\n\nMy question: " + q.slice(0, 240) + "\n\nPlease guide me. Dhanyavad!";
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(txt);
  }

  /* ---------------- callback form ---------------- */
  var cbOpen = false;
  function showCallbackForm() {
    if (cbOpen) return;
    cbOpen = true;
    var card = el("div", "cb");
    var h = el("h5", null, SVG.phone + "<span></span>");
    h.querySelector("span").textContent = t().formTitle;
    card.appendChild(h);

    function field(labelTxt, node) {
      var lb = el("label");
      lb.textContent = labelTxt;
      var wrap = el("div");
      wrap.appendChild(lb);
      wrap.appendChild(node);
      return wrap;
    }

    var nameI = document.createElement("input");
    nameI.type = "text";
    nameI.maxLength = 60;
    nameI.placeholder = t().namePh;
    var phoneI = document.createElement("input");
    phoneI.type = "tel";
    phoneI.inputMode = "numeric";
    phoneI.maxLength = 13;
    phoneI.placeholder = t().phonePh;
    var sel = document.createElement("select");
    INTERESTS.forEach(function (i) {
      var o = document.createElement("option");
      o.value = i;
      o.textContent = i;
      sel.appendChild(o);
    });

    card.appendChild(field(t().nameL, nameI));
    card.appendChild(field(t().phoneL, phoneI));
    card.appendChild(field(t().intL, sel));

    var cons = el("label", "cons");
    var consI = document.createElement("input");
    consI.type = "checkbox";
    var consT = el("span");
    consT.textContent = t().consL;
    cons.appendChild(consI);
    cons.appendChild(consT);
    card.appendChild(cons);

    var sub = el("button", "sub");
    sub.type = "button";
    sub.textContent = t().submit;
    var cancel = el("button", "cancel");
    cancel.type = "button";
    cancel.textContent = "✕";
    cancel.setAttribute("aria-label", "Cancel");
    cancel.addEventListener("click", function () {
      card.remove();
      cbOpen = false;
    });
    card.appendChild(sub);
    card.appendChild(cancel);
    body.appendChild(card);
    scrollBody();
    nameI.focus();

    sub.addEventListener("click", function () {
      var name = nameI.value.trim();
      var phone = phoneI.value.replace(/[^\d]/g, "");
      if (phone.length === 12 && phone.indexOf("91") === 0) phone = phone.slice(2);
      if (name.length < 2 || !/^[6-9]\d{9}$/.test(phone) || !consI.checked) {
        phoneI.style.borderColor = !/^[6-9]\d{9}$/.test(phone) ? "#d92d20" : "";
        nameI.style.borderColor = name.length < 2 ? "#d92d20" : "";
        cons.style.color = !consI.checked ? "#d92d20" : "";
        return;
      }
      sub.disabled = true;
      sub.textContent = t().sending;
      fetch(API_CALLBACK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name, phone: phone, interest: sel.value, consent: true, lang: lang }),
      })
        .then(function (r) {
          return r.json();
        })
        .then(function (res) {
          card.remove();
          cbOpen = false;
          if (res && res.ok) {
            botMsg(res.reply, { handoff: waFallback("Callback requested by " + name), primary: false });
          } else {
            botMsg(res && res.reply ? res.reply : t().networkErr, { handoff: waFallback("Callback request failed"), primary: true });
          }
        })
        .catch(function () {
          card.remove();
          cbOpen = false;
          botMsg(t().networkErr, { handoff: waFallback("Callback request (network error)"), primary: true });
        });
    });
  }

  /* ---------------- voice input ---------------- */
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var rec = null;
  var listenBar = null;

  function ensureRec() {
    if (rec || !SR) return rec;
    rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.onresult = function (ev) {
      var txt = "";
      var isFinal = false;
      for (var i = 0; i < ev.results.length; i++) {
        txt += ev.results[i][0].transcript;
        if (ev.results[i].isFinal) isFinal = true;
      }
      input.value = txt.slice(0, MAX_LEN);
      if (isFinal) {
        stopRec();
        setTimeout(function () {
          if (input.value.trim()) send(input.value);
        }, 200);
      }
    };
    rec.onerror = function () {
      stopRec();
    };
    rec.onend = function () {
      stopRec();
    };
    return rec;
  }

  function stopRec() {
    recognizing = false;
    micBtn.classList.remove("rec");
    if (listenBar) {
      listenBar.remove();
      listenBar = null;
    }
    try {
      rec && rec.stop && rec.stop();
    } catch (e) {}
  }

  micBtn.addEventListener("click", function () {
    if (!SR) {
      botMsg(t().voiceNo, { actions: false });
      return;
    }
    if (recognizing) {
      stopRec();
      return;
    }
    ensureRec();
    try {
      rec.lang = SR_LANG[lang] || "en-IN";
      rec.start();
      recognizing = true;
      micBtn.classList.add("rec");
      listenBar = el("div", "listen-bar");
      listenBar.textContent = "🎙 " + t().listening;
      body.appendChild(listenBar);
      scrollBody();
    } catch (e) {
      stopRec();
    }
  });

  /* ---------------- open/close ---------------- */
  function openPanel(topic) {
    panel.hidden = false;
    fab.classList.add("hide");
    opened = true;
    var dot = fab.querySelector(".dot");
    if (dot) dot.style.display = "none";
    greet(false);
    if (topic && t().chips[topic]) {
      send(t().chips[topic].q, topic);
    } else {
      input.focus();
    }
    if (window.innerWidth <= 640) document.body.style.overflow = "hidden";
  }

  function closePanel() {
    panel.hidden = true;
    fab.classList.remove("hide");
    opened = false;
    stopRec();
    document.body.style.overflow = "";
    fab.focus();
  }

  fab.addEventListener("click", function () {
    openPanel();
  });
  head.querySelector(".cl").addEventListener("click", closePanel);
  head.querySelector(".rs").addEventListener("click", function () {
    history = [];
    lastIntent = "";
    greeted = false;
    greet(true);
  });
  head.querySelectorAll(".p-langs button").forEach(function (b) {
    b.addEventListener("click", function () {
      applyLang(b.getAttribute("data-l"), { regreet: true });
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && opened) closePanel();
  });

  inputBar.addEventListener("submit", function (e) {
    e.preventDefault();
    send(input.value);
  });

  /* ---------------- init ---------------- */
  applyLang(lang);
  fab.querySelector(".lbl").textContent = t().fabLabel;

  window.YashodaAssistant = {
    open: function (topic) {
      if (panel.hidden) {
        openPanel(topic);
      } else if (topic && t().chips[topic]) {
        send(t().chips[topic].q, topic);
      }
    },
    close: closePanel,
  };
})();
