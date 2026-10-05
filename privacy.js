/* Privacy policy text, 5 languages. {email} is replaced with SITE.email.
   Keep this in sync with what the site actually does (reservation form,
   Netlify, Resend, Google Maps/Fonts, language stored in localStorage). */
const PRIVACY = {
  en: {
    title: "Privacy Policy",
    back: "← Back to the website",
    updated: "Last updated: 5 October 2026",
    sections: [
      ["Who we are", "This website is operated by Restaurant SHASI, Šasko Jezero, Ulcinj, Montenegro. For anything related to your personal data, contact us at {email}."],
      ["What we collect", "When you request a table we collect the details you enter: your name, email address, phone number (optional), the date, time and number of guests, any notes, and the language you were using. Our hosting provider also processes technical data such as your IP address when you visit the site. We do not use advertising or tracking cookies."],
      ["Why we use it", "We use your details only to handle your reservation request: to email you that your request was received and to tell you whether it is confirmed or declined. The legal basis is taking steps at your request before a booking (GDPR Art. 6(1)(b))."],
      ["Who receives it", "Your request is emailed to the restaurant owner. To do this we use Netlify (website hosting and the booking function) and Resend (email delivery, servers in the United States). The page also loads Google Maps and Google Fonts, so Google may receive your IP address when you visit. We do not sell your data."],
      ["How long we keep it", "Reservation emails are kept for up to 12 months and then deleted. We do not keep a separate reservation database."],
      ["Your rights", "You can ask us for a copy of your data, to correct it, or to delete it, and you can object to how we use it. Write to {email}. You also have the right to complain to your data protection authority."],
      ["Browser storage", "The site stores your chosen language in your browser (local storage) so it can remember it. This is not used to track you."]
    ]
  },
  mne: {
    title: "Politika privatnosti",
    back: "← Nazad na sajt",
    updated: "Posljednje ažuriranje: 5. oktobar 2026.",
    sections: [
      ["Ko smo", "Ovaj sajt vodi Restoran SHASI, Šasko Jezero, Ulcinj, Crna Gora. Za sva pitanja o vašim ličnim podacima obratite se na {email}."],
      ["Koje podatke prikupljamo", "Kada tražite rezervaciju stola prikupljamo podatke koje unesete: ime i prezime, email adresu, broj telefona (opciono), datum, vrijeme i broj gostiju, napomenu i jezik koji ste koristili. Naš hosting provajder takođe obrađuje tehničke podatke, poput vaše IP adrese, kada posjetite sajt. Ne koristimo reklamne kolačiće ni kolačiće za praćenje."],
      ["Zašto ih koristimo", "Vaše podatke koristimo isključivo za obradu zahtjeva za rezervaciju: da vam pošaljemo email da je zahtjev primljen i da vas obavijestimo da li je potvrđen ili odbijen. Pravni osnov je preduzimanje radnji na vaš zahtjev prije rezervacije (GDPR čl. 6(1)(b))."],
      ["Ko ih prima", "Vaš zahtjev se šalje emailom vlasniku restorana. Za to koristimo Netlify (hosting sajta i funkciju za rezervacije) i Resend (slanje emailova, serveri u Sjedinjenim Državama). Stranica učitava i Google Maps i Google Fonts, pa Google može primiti vašu IP adresu kada posjetite sajt. Vaše podatke ne prodajemo."],
      ["Koliko dugo ih čuvamo", "Emailovi o rezervacijama čuvaju se do 12 mjeseci, a zatim se brišu. Ne vodimo posebnu bazu rezervacija."],
      ["Vaša prava", "Možete zatražiti kopiju svojih podataka, njihovu ispravku ili brisanje, i možete uložiti prigovor na način na koji ih koristimo. Pišite na {email}. Imate i pravo da podnesete žalbu organu nadležnom za zaštitu podataka."],
      ["Pohranjivanje u pregledaču", "Sajt čuva izabrani jezik u vašem pregledaču (local storage) kako bi ga zapamtio. To se ne koristi za praćenje."]
    ]
  },
  sq: {
    title: "Politika e privatësisë",
    back: "← Kthehu te faqja",
    updated: "Përditësuar së fundi: 5 tetor 2026",
    sections: [
      ["Kush jemi", "Ky uebsajt administrohet nga Restorant SHASI, Liqeni i Shasit, Ulqin, Mal i Zi. Për çdo çështje lidhur me të dhënat tuaja personale na kontaktoni në {email}."],
      ["Çfarë të dhënash mbledhim", "Kur kërkoni një tavolinë mbledhim të dhënat që plotësoni: emrin, adresën e emailit, numrin e telefonit (opsionale), datën, orën dhe numrin e mysafirëve, çdo shënim dhe gjuhën që keni përdorur. Ofruesi ynë i hostimit përpunon edhe të dhëna teknike, si adresa juaj IP, kur vizitoni faqen. Ne nuk përdorim cookies reklamuese ose gjurmuese."],
      ["Pse i përdorim", "I përdorim të dhënat tuaja vetëm për të trajtuar kërkesën tuaj për rezervim: t'ju dërgojmë një email se kërkesa u mor dhe t'ju njoftojmë nëse është konfirmuar ose refuzuar. Baza ligjore është ndërmarrja e hapave me kërkesën tuaj përpara një rezervimi (GDPR neni 6(1)(b))."],
      ["Kush i merr", "Kërkesa juaj i dërgohet me email pronarit të restorantit. Për këtë përdorim Netlify (hostimi i faqes dhe funksioni i rezervimit) dhe Resend (dërgimi i emailit, serverë në Shtetet e Bashkuara). Faqja ngarkon edhe Google Maps dhe Google Fonts, prandaj Google mund të marrë adresën tuaj IP kur vizitoni faqen. Ne nuk i shesim të dhënat tuaja."],
      ["Sa gjatë i ruajmë", "Emailet e rezervimeve ruhen deri në 12 muaj dhe pastaj fshihen. Ne nuk mbajmë një bazë të dhënash të veçantë rezervimesh."],
      ["Të drejtat tuaja", "Mund të kërkoni një kopje të të dhënave tuaja, korrigjimin ose fshirjen e tyre, dhe mund të kundërshtoni mënyrën si i përdorim. Shkruani në {email}. Keni gjithashtu të drejtë të bëni ankesë te autoriteti juaj për mbrojtjen e të dhënave."],
      ["Ruajtja në shfletues", "Faqja ruan gjuhën që zgjidhni në shfletuesin tuaj (local storage) për ta mbajtur mend. Kjo nuk përdoret për t'ju gjurmuar."]
    ]
  },
  de: {
    title: "Datenschutzerklärung",
    back: "← Zurück zur Website",
    updated: "Zuletzt aktualisiert: 5. Oktober 2026",
    sections: [
      ["Wer wir sind", "Diese Website wird betrieben vom Restaurant SHASI, Šasko Jezero, Ulcinj, Montenegro. Bei allen Fragen zu Ihren personenbezogenen Daten erreichen Sie uns unter {email}."],
      ["Welche Daten wir erheben", "Wenn Sie einen Tisch anfragen, erheben wir die von Ihnen eingegebenen Angaben: Name, E-Mail-Adresse, Telefonnummer (optional), Datum, Uhrzeit und Anzahl der Gäste, Anmerkungen sowie die verwendete Sprache. Unser Hosting-Anbieter verarbeitet beim Besuch der Seite außerdem technische Daten wie Ihre IP-Adresse. Wir verwenden keine Werbe- oder Tracking-Cookies."],
      ["Wofür wir sie verwenden", "Wir verwenden Ihre Angaben ausschließlich zur Bearbeitung Ihrer Reservierungsanfrage: um Ihnen den Eingang per E-Mail zu bestätigen und Sie zu informieren, ob die Reservierung bestätigt oder abgelehnt wurde. Rechtsgrundlage sind vorvertragliche Maßnahmen auf Ihre Anfrage (Art. 6 Abs. 1 lit. b DSGVO)."],
      ["Wer sie erhält", "Ihre Anfrage wird per E-Mail an den Inhaber des Restaurants gesendet. Dafür nutzen wir Netlify (Website-Hosting und Buchungsfunktion) und Resend (E-Mail-Versand, Server in den USA). Die Seite lädt außerdem Google Maps und Google Fonts, daher kann Google beim Besuch Ihre IP-Adresse erhalten. Wir verkaufen Ihre Daten nicht."],
      ["Wie lange wir sie speichern", "Reservierungs-E-Mails werden bis zu 12 Monate aufbewahrt und danach gelöscht. Wir führen keine separate Reservierungsdatenbank."],
      ["Ihre Rechte", "Sie können Auskunft über Ihre Daten, deren Berichtigung oder Löschung verlangen und der Verarbeitung widersprechen. Schreiben Sie an {email}. Außerdem haben Sie das Recht, sich bei Ihrer Datenschutzbehörde zu beschweren."],
      ["Speicherung im Browser", "Die Website speichert Ihre gewählte Sprache in Ihrem Browser (Local Storage), um sie sich zu merken. Das dient nicht dem Tracking."]
    ]
  },
  ru: {
    title: "Политика конфиденциальности",
    back: "← Назад на сайт",
    updated: "Последнее обновление: 5 октября 2026 г.",
    sections: [
      ["Кто мы", "Этот сайт принадлежит ресторану SHASI, Шасское озеро, Улцинь, Черногория. По всем вопросам о ваших персональных данных пишите на {email}."],
      ["Какие данные мы собираем", "Когда вы запрашиваете столик, мы собираем указанные вами данные: имя, адрес электронной почты, телефон (необязательно), дату, время и количество гостей, примечание и язык, которым вы пользовались. Наш хостинг-провайдер также обрабатывает технические данные, например ваш IP-адрес, когда вы посещаете сайт. Мы не используем рекламные и отслеживающие cookie."],
      ["Зачем мы их используем", "Мы используем ваши данные только для обработки запроса на бронирование: чтобы отправить вам письмо о получении запроса и сообщить, подтверждён он или отклонён. Правовое основание — действия по вашему запросу до заключения договора о бронировании (GDPR, ст. 6(1)(b))."],
      ["Кто их получает", "Ваш запрос отправляется по электронной почте владельцу ресторана. Для этого мы используем Netlify (хостинг сайта и функцию бронирования) и Resend (отправка писем, серверы в США). Страница также загружает Google Maps и Google Fonts, поэтому Google может получить ваш IP-адрес при посещении сайта. Мы не продаём ваши данные."],
      ["Как долго мы их храним", "Письма с бронированиями хранятся до 12 месяцев, затем удаляются. Отдельной базы бронирований мы не ведём."],
      ["Ваши права", "Вы можете запросить копию своих данных, их исправление или удаление, а также возразить против их использования. Пишите на {email}. Вы также вправе подать жалобу в орган по защите данных."],
      ["Хранение в браузере", "Сайт сохраняет выбранный вами язык в вашем браузере (local storage), чтобы его запомнить. Это не используется для отслеживания."]
    ]
  }
};

(function () {
  "use strict";
  let lang = localStorage.getItem("shasi_lang") || "en";
  if (!LANGS.includes(lang)) lang = "en";

  function render() {
    const t = PRIVACY[lang];
    document.documentElement.lang = lang === "mne" ? "sr" : lang;
    document.title = t.title + " — Restaurant SHASI";
    document.getElementById("lang-current").textContent = lang.toUpperCase();
    document.querySelectorAll("#lang-list button").forEach((b) =>
      b.classList.toggle("active", b.dataset.lang === lang));
    document.getElementById("privacy-back").textContent = t.back;
    document.getElementById("privacy-title").textContent = t.title;
    document.getElementById("privacy-updated").textContent = t.updated;
    const body = document.getElementById("privacy-sections");
    body.innerHTML = "";
    t.sections.forEach(([h, p]) => {
      const h2 = document.createElement("h2");
      h2.textContent = h;
      const para = document.createElement("p");
      para.textContent = p.replace(/\{email\}/g, SITE.email);
      body.append(h2, para);
    });
    document.getElementById("footer-rights").textContent = UI[lang].footer_rights;
  }

  function init() {
    const list = document.getElementById("lang-list");
    LANGS.forEach((code) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.textContent = LANG_LABELS[code];
      btn.dataset.lang = code;
      btn.addEventListener("click", () => {
        lang = code;
        localStorage.setItem("shasi_lang", code);
        list.classList.remove("open");
        render();
      });
      li.appendChild(btn);
      list.appendChild(li);
    });
    const langBtn = document.getElementById("lang-btn");
    langBtn.addEventListener("click", () => {
      const open = list.classList.toggle("open");
      langBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".lang-switch")) list.classList.remove("open");
    });
    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
