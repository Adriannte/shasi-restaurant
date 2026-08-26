/* ===========================================================
   Restaurant SHASI — content & menu data
   Transcribed by hand from the physical menu (5 language pages).
   Please proofread names / prices / weights against the real
   menu before publishing, especially the Albanian & Russian text.
   =========================================================== */

const LANGS = ["en", "mne", "sq", "de", "ru"];

const LANG_LABELS = {
  en: "English",
  mne: "Crnogorski",
  sq: "Shqip",
  de: "Deutsch",
  ru: "Русский"
};

const SITE = {
  phones: ["+382 69 567 555", "+382 69 592 873"],
  email: "restorantshasi@gmail.com",
  instagram: "https://www.instagram.com/restaurantshasii/",
  facebook: "https://www.facebook.com/restaurantshaii/",
  booking: "https://www.booking.com/Share-xgmSoY",
  // Direct "write a review" links (not just the listing page)
  tripadvisor:
    "https://www.tripadvisor.com/UserReviewEdit-g4559581-d19940670-Restaurant_Shasi-Vladimir_Ulcinj_Municipality.html",
  // Opens straight to the Reviews tab with "Write a review" one click away
  googleReview:
    "https://www.google.com/maps/place/Restaurant+Shasi/@41.9799378,19.3375589,17z/data=!4m8!3m7!1s0x134e0fd613ce7cd3:0xddb79295aefe1157!8m2!3d41.9799378!4d19.3375589!9m1!1b1!16s%2Fg%2F1tdv2vvy",
  mapQuery: "Restaurant SHASI, Šasko jezero, Ulcinj, Montenegro",
  mapEmbedSrc:
    "https://www.google.com/maps?q=Restaurant+SHASI+%C5%A0asko+jezero+Ulcinj&output=embed",
  // Drop a real clip at media/hero.mp4 (+ media/hero-poster.jpg) and it is
  // picked up automatically — the animated fallback only shows until then.
  heroVideo: "media/hero.mp4",
  heroPoster: "media/hero-poster.jpg"
};

/* Seasonal opening hours */
const HOURS = [
  {
    period: {
      en: "January – April",
      mne: "Januar – April",
      sq: "Janar – Prill",
      de: "Januar – April",
      ru: "Январь – Апрель"
    },
    time: "12:00 – 21:00"
  },
  {
    period: {
      en: "May – September",
      mne: "Maj – Septembar",
      sq: "Maj – Shtator",
      de: "Mai – September",
      ru: "Май – Сентябрь"
    },
    time: "10:00 – 23:00"
  },
  {
    period: {
      en: "October – December",
      mne: "Oktobar – Decembar",
      sq: "Tetor – Dhjetor",
      de: "Oktober – Dezember",
      ru: "Октябрь – Декабрь"
    },
    time: "12:00 – 21:00"
  }
];

/* "Moments" strip — official Instagram embeds (no scraping/downloading).
   Add permalinks to reels/posts you want featured, e.g.
   "https://www.instagram.com/reel/XXXXXXXXXXX/" — leave empty for now and
   the section shows a "Follow along" card instead. */
const MOMENTS = [];

const UI = {
  en: {
    nav_home: "Home",
    nav_about: "About Us",
    nav_moments: "Moments",
    nav_menu: "Menu",
    nav_activities: "Activities",
    nav_reservations: "Reserve",
    nav_location: "Location",
    nav_contact: "Contact",
    activities_title: "Activities & Camping",
    hero_tag: "Since 2002",
    hero_title: "Restaurant SHASI",
    hero_subtitle:
      "Fresh fish, lakeside serenity, and family hospitality on Lake Shasi",
    cta_menu: "View Menu",
    cta_book: "Book a Room",
    about_title: "About Us",
    moments_title: "From the Lake",
    moments_subtitle:
      "A few scenes from life at SHASI — light on the water, the day's catch, evenings by the reeds.",
    moments_cta: "Follow @restaurantshasii",
    menu_title: "Our Menu",
    tab_food: "Food",
    tab_wine: "Wine",
    tab_drinks: "Drinks",
    tab_kids: "Kids Menu",
    location_title: "Find Us",
    location_text: "On the shore of Lake Shasi, Ulcinj, Montenegro",
    directions: "Get Directions",
    contact_title: "Contact & Info",
    phone_label: "Call Us",
    hours_label: "Opening Hours",
    rooms_label: "Rooms & Camping",
    rooms_text:
      "4 double rooms available year-round, plus auto-camp services.",
    follow_label: "Follow Us",
    book_label: "Book a Room",
    review_label: "Leave a Review",
    reserve_title: "Reserve a Table",
    reserve_subtitle: "Choose a date and time — your table is held for two hours. We'll confirm by email.",
    reserve_name: "Full name",
    reserve_guests: "Guests",
    reserve_date: "Date",
    reserve_time: "Time",
    reserve_email: "Email",
    reserve_phone: "Phone (optional)",
    reserve_notes: "Notes (optional)",
    reserve_submit: "Request Table",
    reserve_sending: "Sending your request…",
    reserve_success: "Thank you! Your request has been sent — check your email, your table is waiting to be confirmed by the owner.",
    reserve_error: "Something went wrong sending your request. Please try again, or call us directly.",
    reserve_error_fields: "Please check the highlighted fields and try again.",
    footer_rights: "All rights reserved.",
    search_placeholder: "Search the menu…",
    weight: "weight",
    no_results: "No dishes match your search."
  },
  mne: {
    nav_home: "Početna",
    nav_about: "O nama",
    nav_moments: "Trenuci",
    nav_menu: "Meni",
    nav_activities: "Aktivnosti",
    nav_reservations: "Rezervacija",
    nav_location: "Lokacija",
    nav_contact: "Kontakt",
    activities_title: "Aktivnosti i kampovanje",
    hero_tag: "Od 2002.",
    hero_title: "Restoran SHASI",
    hero_subtitle:
      "Svježa riba, mir jezera i porodično gostoprimstvo na Šaskom jezeru",
    cta_menu: "Pogledaj meni",
    cta_book: "Rezerviši sobu",
    about_title: "O nama",
    moments_title: "Sa jezera",
    moments_subtitle:
      "Nekoliko prizora iz svakodnevice restorana SHASI — svjetlost na vodi, ulov dana, večeri pored trske.",
    moments_cta: "Pratite @restaurantshasii",
    menu_title: "Naš meni",
    tab_food: "Jela",
    tab_wine: "Vino",
    tab_drinks: "Pića",
    tab_kids: "Dječji meni",
    location_title: "Pronađite nas",
    location_text: "Na obali Šaskog jezera, Ulcinj, Crna Gora",
    directions: "Uputstva za dolazak",
    contact_title: "Kontakt i info",
    phone_label: "Pozovite nas",
    hours_label: "Radno vrijeme",
    rooms_label: "Sobe i kamp",
    rooms_text:
      "4 dvokrevetne sobe dostupne tokom cijele godine, kao i usluge auto kampa.",
    follow_label: "Pratite nas",
    book_label: "Rezervišite sobu",
    review_label: "Ostavite recenziju",
    reserve_title: "Rezervišite sto",
    reserve_subtitle: "Izaberite datum i vrijeme — sto se drži dva sata. Potvrdu šaljemo mejlom.",
    reserve_name: "Ime i prezime",
    reserve_guests: "Broj gostiju",
    reserve_date: "Datum",
    reserve_time: "Vrijeme",
    reserve_email: "Email",
    reserve_phone: "Telefon (opciono)",
    reserve_notes: "Napomena (opciono)",
    reserve_submit: "Pošalji zahtjev",
    reserve_sending: "Slanje zahtjeva…",
    reserve_success: "Hvala! Vaš zahtjev je poslat — provjerite email, vaš sto čeka na potvrdu vlasnika.",
    reserve_error: "Došlo je do greške pri slanju zahtjeva. Pokušajte ponovo ili nas pozovite direktno.",
    reserve_error_fields: "Provjerite označena polja i pokušajte ponovo.",
    footer_rights: "Sva prava zadržana.",
    search_placeholder: "Pretraži meni…",
    weight: "količina",
    no_results: "Nema jela koja odgovaraju pretrazi."
  },
  sq: {
    nav_home: "Ballina",
    nav_about: "Rreth nesh",
    nav_moments: "Çaste",
    nav_menu: "Menu",
    nav_activities: "Aktivitete",
    nav_reservations: "Rezervo",
    nav_location: "Vendndodhja",
    nav_contact: "Kontakt",
    activities_title: "Aktivitete & Kampim",
    hero_tag: "Që nga 2002",
    hero_title: "Restorant SHASI",
    hero_subtitle:
      "Peshk i freskët, qetësia e liqenit dhe mikpritje familjare në Liqenin e Shasit",
    cta_menu: "Shiko Menunë",
    cta_book: "Rezervo Dhomë",
    about_title: "Rreth nesh",
    moments_title: "Nga Liqeni",
    moments_subtitle:
      "Disa çaste nga jeta në SHASI — drita mbi ujë, zëri i ditës, mbrëmje pranë kallamishteve.",
    moments_cta: "Na ndiqni @restaurantshasii",
    menu_title: "Menuja jonë",
    tab_food: "Ushqim",
    tab_wine: "Verë",
    tab_drinks: "Pije",
    tab_kids: "Menu për Fëmijë",
    location_title: "Na gjeni",
    location_text: "Në breg të Liqenit të Shasit, Ulqin, Mal i Zi",
    directions: "Merr Drejtimet",
    contact_title: "Kontakt & Info",
    phone_label: "Na telefononi",
    hours_label: "Orari i Punës",
    rooms_label: "Dhoma & Kamping",
    rooms_text:
      "4 dhoma dyshe në dispozicion gjatë gjithë vitit, si dhe shërbime kampingu.",
    follow_label: "Na ndiqni",
    book_label: "Rezervo Dhomë",
    review_label: "Lini një Vlerësim",
    reserve_title: "Rezervo një Tavolinë",
    reserve_subtitle: "Zgjidhni datën dhe orën — tavolina mbahet për dy orë. Konfirmimin e dërgojmë me email.",
    reserve_name: "Emri i plotë",
    reserve_guests: "Numri i mysafirëve",
    reserve_date: "Data",
    reserve_time: "Ora",
    reserve_email: "Email",
    reserve_phone: "Telefon (opsionale)",
    reserve_notes: "Shënim (opsionale)",
    reserve_submit: "Dërgo Kërkesën",
    reserve_sending: "Duke dërguar kërkesën…",
    reserve_success: "Faleminderit! Kërkesa juaj u dërgua — kontrolloni email-in, tavolina juaj është duke pritur konfirmimin e pronarit.",
    reserve_error: "Diçka shkoi keq gjatë dërgimit të kërkesës. Provoni përsëri ose na telefononi direkt.",
    reserve_error_fields: "Kontrolloni fushat e theksuara dhe provoni përsëri.",
    footer_rights: "Të gjitha të drejtat e rezervuara.",
    search_placeholder: "Kërko në menu…",
    weight: "sasia",
    no_results: "Asnjë pjatë nuk përputhet me kërkimin tuaj."
  },
  de: {
    nav_home: "Startseite",
    nav_about: "Über uns",
    nav_moments: "Momente",
    nav_menu: "Speisekarte",
    nav_activities: "Aktivitäten",
    nav_reservations: "Reservieren",
    nav_location: "Standort",
    nav_contact: "Kontakt",
    activities_title: "Aktivitäten & Camping",
    hero_tag: "Seit 2002",
    hero_title: "Restaurant SHASI",
    hero_subtitle:
      "Frischer Fisch, Ruhe am See und familiäre Gastfreundschaft am Shasi-See",
    cta_menu: "Speisekarte ansehen",
    cta_book: "Zimmer buchen",
    about_title: "Über uns",
    moments_title: "Vom See",
    moments_subtitle:
      "Ein paar Momente aus dem Alltag im SHASI — Licht auf dem Wasser, der Fang des Tages, Abende am Schilf.",
    moments_cta: "Folgen Sie @restaurantshasii",
    menu_title: "Unsere Speisekarte",
    tab_food: "Speisen",
    tab_wine: "Wein",
    tab_drinks: "Getränke",
    tab_kids: "Kindermenü",
    location_title: "So finden Sie uns",
    location_text: "Am Ufer des Shasi-Sees, Ulcinj, Montenegro",
    directions: "Route anzeigen",
    contact_title: "Kontakt & Info",
    phone_label: "Rufen Sie uns an",
    hours_label: "Öffnungszeiten",
    rooms_label: "Zimmer & Camping",
    rooms_text:
      "4 Doppelzimmer ganzjährig verfügbar, sowie Campingplatz-Service.",
    follow_label: "Folgen Sie uns",
    book_label: "Zimmer buchen",
    review_label: "Bewertung abgeben",
    reserve_title: "Tisch reservieren",
    reserve_subtitle: "Wählen Sie Datum und Uhrzeit — Ihr Tisch wird für zwei Stunden gehalten. Wir bestätigen per E-Mail.",
    reserve_name: "Vollständiger Name",
    reserve_guests: "Anzahl der Gäste",
    reserve_date: "Datum",
    reserve_time: "Uhrzeit",
    reserve_email: "E-Mail",
    reserve_phone: "Telefon (optional)",
    reserve_notes: "Anmerkungen (optional)",
    reserve_submit: "Tisch anfragen",
    reserve_sending: "Ihre Anfrage wird gesendet…",
    reserve_success: "Vielen Dank! Ihre Anfrage wurde gesendet — prüfen Sie Ihre E-Mails, Ihr Tisch wartet auf die Bestätigung des Inhabers.",
    reserve_error: "Beim Senden Ihrer Anfrage ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder rufen Sie uns direkt an.",
    reserve_error_fields: "Bitte überprüfen Sie die markierten Felder und versuchen Sie es erneut.",
    footer_rights: "Alle Rechte vorbehalten.",
    search_placeholder: "Speisekarte durchsuchen…",
    weight: "Menge",
    no_results: "Keine Gerichte entsprechen Ihrer Suche."
  },
  ru: {
    nav_home: "Главная",
    nav_about: "О нас",
    nav_moments: "Моменты",
    nav_menu: "Меню",
    nav_activities: "Мероприятия",
    nav_reservations: "Бронь",
    nav_location: "Расположение",
    nav_contact: "Контакты",
    activities_title: "Мероприятия и кемпинг",
    hero_tag: "С 2002 года",
    hero_title: "Ресторан SHASI",
    hero_subtitle:
      "Свежая рыба, спокойствие озера и семейное гостеприимство на Шасском озере",
    cta_menu: "Смотреть меню",
    cta_book: "Забронировать номер",
    about_title: "О нас",
    moments_title: "С озера",
    moments_subtitle:
      "Несколько моментов из жизни ресторана SHASI — свет на воде, улов дня, вечера у камыша.",
    moments_cta: "Подписывайтесь на @restaurantshasii",
    menu_title: "Наше меню",
    tab_food: "Еда",
    tab_wine: "Вино",
    tab_drinks: "Напитки",
    tab_kids: "Детское меню",
    location_title: "Как нас найти",
    location_text: "На берегу Шасского озера, Улцинь, Черногория",
    directions: "Проложить маршрут",
    contact_title: "Контакты и инфо",
    phone_label: "Позвоните нам",
    hours_label: "Часы работы",
    rooms_label: "Номера и кемпинг",
    rooms_text:
      "4 двухместных номера доступны круглый год, а также услуги автокемпинга.",
    follow_label: "Подписывайтесь",
    book_label: "Забронировать номер",
    review_label: "Оставить отзыв",
    reserve_title: "Забронировать столик",
    reserve_subtitle: "Выберите дату и время — столик удерживается два часа. Подтверждение придёт по email.",
    reserve_name: "Полное имя",
    reserve_guests: "Количество гостей",
    reserve_date: "Дата",
    reserve_time: "Время",
    reserve_email: "Email",
    reserve_phone: "Телефон (необязательно)",
    reserve_notes: "Примечание (необязательно)",
    reserve_submit: "Отправить запрос",
    reserve_sending: "Отправка запроса…",
    reserve_success: "Спасибо! Ваш запрос отправлен — проверьте почту, столик ожидает подтверждения владельца.",
    reserve_error: "Не удалось отправить запрос. Попробуйте ещё раз или позвоните нам напрямую.",
    reserve_error_fields: "Проверьте отмеченные поля и попробуйте снова.",
    footer_rights: "Все права защищены.",
    search_placeholder: "Поиск по меню…",
    weight: "вес",
    no_results: "Нет блюд, соответствующих вашему запросу."
  }
};

const ABOUT = {
  en: `In the immediate vicinity of Lake Shasi in the municipality of Ulcinj lies the beautiful Restaurant SHASI. It fits perfectly into the space and ambience of nature. Beyond the beautiful view and surroundings, we offer top-quality fish specialities — always fresh — and service of an exceptional level.

The restaurant also has 4 double rooms available year-round, and offers auto-camp services.

And finally, a few interesting facts about the lake itself: it lies some 20km from Ulcinj, covers an area of 5.5km², and reaches depths of up to 8m. It is also the second crypto-depression in Montenegro.

Welcome!`,
  mne: `U neposrednoj blizini Šaskog jezera, u opštini Ulcinj, nalazi se prelijepi restoran SHASI. Savršeno se uklapa u prostor i ambijent prirode. Osim predivnog pogleda i okruženja, nudimo vrhunske riblje specijalitete – riba je uvijek svježa, a usluga na izuzetnom nivou!

Restoran takođe raspolaže sa 4 dvokrevetne sobe dostupne tokom cijele godine, kao i uslugama auto kampa.

I na kraju, nekoliko zanimljivih podataka o samom jezeru – udaljeno je oko 20km od Ulcinja, površine je 5.5km² i dubine do 8m. Ujedno, ovo jezero predstavlja drugu kripto-depresiju u Crnoj Gori.

Dobrodošli!`,
  sq: `Në afërsi të menjëhershme të Liqenit të Shasit, në komunën e Ulqinit, gjendet restoranti i bukur SHASI. Ai përshtatet në mënyrë të përsosur me hapësirën dhe ambientin e natyrës. Përveç pamjes së mrekullueshme dhe rrethinës, ne ofrojmë specialitete peshku të cilësisë më të lartë – gjithmonë të freskët – dhe shërbim në nivel të jashtëzakonshëm!

Restoranti gjithashtu ka 4 dhoma dyshe në dispozicion gjatë gjithë vitit, si dhe shërbime kampingu.

Së fundmi, disa fakte interesante rreth vetë liqenit – ndodhet rreth 20km nga Ulqini, ka një sipërfaqe prej 5.5km² dhe thellësi deri në 8m. Ky liqen përfaqëson gjithashtu kripto-depresionin e dytë në Mal të Zi.

Mirë se vini!`,
  de: `In unmittelbarer Nähe des Shasi-Sees, in der Gemeinde Ulcinj, liegt das wunderschöne Restaurant SHASI. Es fügt sich perfekt in die Landschaft und das Ambiente der Natur ein. Neben dem herrlichen Blick und der Umgebung bieten wir erstklassige Fischspezialitäten – immer frisch – und einen Service auf höchstem Niveau!

Das Restaurant verfügt zudem über 4 Doppelzimmer, die ganzjährig verfügbar sind, sowie einen Campingplatz.

Zum Schluss noch ein paar interessante Fakten über den See selbst: Er liegt etwa 20 km von Ulcinj entfernt, hat eine Fläche von 5,5 km² und eine Tiefe von bis zu 8 m. Zugleich ist dieser See die zweite Kryptodepression Montenegros.

Willkommen!`,
  ru: `Неподалёку от Шасского озера, в общине Улцинь, расположен прекрасный ресторан SHASI. Он идеально вписывается в окружающую природу и атмосферу. Помимо великолепного вида и живописной местности, мы предлагаем рыбные деликатесы высшего качества – всегда свежие – и обслуживание на исключительном уровне!

При ресторане также есть 4 двухместных номера, доступных круглый год, а также услуги автокемпинга.

И напоследок несколько интересных фактов о самом озере: оно находится примерно в 20 км от Улциня, имеет площадь 5,5 км² и глубину до 8 м. Кроме того, это озеро является второй крипто-депрессией в Черногории.

Добро пожаловать!`
};

/* ---------- helpers ---------- */
function T(en, mne, sq, de, ru) {
  return { en, mne, sq, de, ru };
}

/* ---------- FOOD MENU ---------- */
const FOOD_MENU = [
  {
    key: "salads",
    name: T("Salads", "Salate", "Sallatë", "Salate", "Салаты"),
    items: [
      { name: T("Shopska Salad", "Šopska salata", "Sallatë Shope", "Schopska-Salat", "Шопский салат"), weight: "300gr", price: 4.0 },
      { name: T("Mixed Salad", "Miješana salata", "Sallatë Mikse", "Gemischter Salat", "Ассорти салат"), weight: "300gr", price: 3.5 },
      { name: T("Greek Salad", "Grčka salata", "Sallatë Greke", "Griechischer Salat", "Греческий салат"), weight: "300gr", price: 4.0 },
      { name: T("Green Salad", "Zelena salata", "Sallatë Gjelbër", "Grüner Salat", "Зелёный салат"), weight: "250gr", price: 3.5 },
      { name: T("Roasted Peppers", "Pečena paprika", "Speca të Fërguar", "Gebratene Paprika", "Печёный перец"), weight: "250gr", price: 4.0 },
      { name: T("Olives", "Masline", "Ullinj", "Oliven", "Маслины"), weight: "150gr", price: 4.0 },
      { name: T("Chicken Salad", "Pileća salata", "Sallatë Pule", "Hühnersalat", "Куриный салат"), weight: "300gr", price: 7.0 }
    ]
  },
  {
    key: "cold-starters",
    name: T("Cold Starters", "Hladna predjela", "Paragjellë të Ftohta", "Kalte Vorspeisen", "Холодные закуски"),
    items: [
      { name: T("Octopus Salad", "Salata od hobotnice", "Sallatë Oktapodi", "Oktopussalat", "Салат из осьминога"), weight: "200gr", price: 14.0 },
      { name: T("Smoked Beef", "Govedja pršuta", "Proshutë Viçi", "Getrocknetes Rindfleisch", "Пршут говяжий"), weight: "150gr", price: 6.0 },
      { name: T("Yellow Cheese (homemade)", "Kačkavalj (domaći)", "Djathë Kaçkavall (i shpisë)", "Hausgemachter Kaskavalkäse", "Сыр Качкавал (домашний)"), weight: "150gr", price: 5.0 },
      { name: T("White Cheese (homemade)", "Bijeli sir (domaći)", "Djathë i Bardhë (i shpisë)", "Hausgemachter Weißkäse", "Белый сыр (домашний)"), weight: "150gr", price: 4.0 },
      { name: T("Goat Cheese (homemade)", "Kozji sir (domaći)", "Djathë Dhie (i shpisë)", "Hausgemachter Ziegenkäse", "Козий сыр (домашний)"), weight: "150gr", price: 6.0 }
    ]
  },
  {
    key: "warm-starters",
    name: T("Warm Starters", "Topla predjela", "Paragjellë të Nxehta", "Warme Vorspeisen", "Тёплые закуски"),
    items: [
      { name: T("Seafood Platter for 2 (calamari, seafood risotto, shrimp)", "Morski pijat za 2 osobe (lignje, rižoto sa morskim plodovima, škampi)", "Paragjellë Deti për 2 Persona (kallamar, oriz me fruta deti, karkaleca)", "Meeresvorspeise für 2 Personen (Tintenfisch, Risotto mit Meeresfrüchten, Garnelen)", "Блюдо из морепродуктов на 2 персоны (кальмары, ризотто с морепродуктами, креветки)"), weight: "950gr", price: 37.0 },
      { name: T("Grilled Vegetables", "Pečeno povrće na žaru", "Perime në Zgarë", "Gegrilltes Gemüse", "Овощи на гриле"), weight: "300gr", price: 4.5 },
      { name: T("Grilled Octopus", "Hobotnica na žaru", "Oktapod në Zgarë", "Oktopus vom Grill", "Осьминог на гриле"), weight: "200gr", price: 16.0 },
      { name: T("Seafood Risotto", "Rižoto sa morskim plodovima", "Oriz me Fruta Deti", "Risotto mit Meeresfrüchten", "Ризотто с морепродуктами"), weight: "300gr", price: 10.0 },
      { name: T("Spaghetti Bolognese", "Špageti bolonjez", "Shpageti Bolonjeze", "Spaghetti Bolognese", "Спагетти болоньезе"), weight: "300gr", price: 8.0 },
      { name: T("Seafood Spaghetti", "Špageti frutti di mare", "Shpageti Frutti di Mare", "Spaghetti mit Meeresfrüchten", "Спагетти с морепродуктами"), weight: "300gr", price: 10.0 },
      { name: T("Shrimp Spaghetti", "Špageti sa gamborima", "Shpageti me Karkaleca Deti", "Spaghetti mit Garnelen", "Спагетти с креветками"), weight: "300gr", price: 11.0 }
    ]
  },
  {
    key: "soups",
    name: T("Soups", "Čorbe i supe", "Çorbat dhe Supat", "Suppen", "Супы"),
    items: [
      { name: T("Fish Soup", "Riblja čorba", "Çorbë Peshku", "Fischsuppe", "Рыбный суп"), weight: "250ml", price: 3.0 },
      { name: T("Beef Soup", "Govedja čorba", "Çorbë Viçi", "Rindersuppe", "Говяжий суп"), weight: "250ml", price: 3.0 },
      { name: T("Chicken Soup", "Pileća supa", "Supë Pule", "Hühnersuppe", "Куриный суп"), weight: "250ml", price: 2.5 }
    ]
  },
  {
    key: "specialities",
    name: T("Home Specialities", "Specijalitet kuće", "Specialitete Shtëpie", "Spezialitäten", "Фирменные блюда"),
    items: [
      { name: T("Eel in Risotto", "Jegulja u rižotu", "Njala në Oriz", "Aal im Risotto", "Угорь в ризотто"), weight: "250gr", price: 17.0 },
      { name: T("Mullet in Sauce", "Skakavica u sosu", "Qefull në Kapamah", "Meeräsche in Soße", "Кефаль в соусе"), weight: "300-400gr", price: 15.0 },
      { name: T("Carp in Sauce", "Šaran u sosu", "Krap në Kapamah", "Karpfen in Soße", "Карп в соусе"), weight: "300-400gr", price: 15.0 },
      { name: T("Trout in Sauce", "Pastrmka u sosu", "Troftë në Kapamah", "Forelle in Soße", "Форель в соусе"), weight: "300-400gr", price: 15.0 }
    ]
  },
  {
    key: "meat",
    name: T("Meat Menu", "Mesni meni", "Menu e Mishit", "Fleisch Menü", "Блюда из мяса"),
    note: T(
      "Served with: French fries, white mushroom sauce, vegetables, rice",
      "Prilog: pomfrit, bijeli sos sa pečurkama, povrće, riža",
      "Shoqëruar me: patate të skuqura, sos i bardhë me këpurdha, perime, oriz",
      "Beilage: Pommes, weiße Soße mit Pilzen, Gemüse, Reis",
      "Гарнир: картофель фри, белый соус с грибами, овощи, рис"
    ),
    items: [
      { name: T("Beef Steak", "Biftek", "Biftek", "Beefsteak", "Бифштекс"), weight: "250gr", price: 20.0 },
      { name: T("Medallions", "Medaljoni", "Medalonë", "Medaillons", "Медальоны"), weight: "250gr", price: 20.0 },
      { name: T("Chicken Fillet", "Pileći file", "Filetо Pule", "Hühnerfilet", "Куриное филе"), weight: "250gr", price: 8.0 }
    ]
  },
  {
    key: "fish",
    name: T("Fish", "Riba", "Peshk", "Fisch", "Рыба"),
    note: T(
      "Served with: boiled potatoes and grilled vegetables",
      "Prilog: kuvani krompir i grilovano povrće",
      "Shoqëruar me: patate të ziera dhe perime nga zgara",
      "Beilage: gekochte Kartoffeln und gegrilltes Gemüse",
      "Гарнир: отварной картофель и овощи гриль"
    ),
    items: [
      { name: T("Sea Bass", "Brancin", "Levrek", "Seebarsch", "Сибас"), weight: "1kg", price: 32.0 },
      { name: T("Gilthead Bream", "Orada", "Oradë", "Dorade", "Дорада"), weight: "1kg", price: 32.0 },
      { name: T("Fish (1st category)", "Riba (prva kategorija)", "Peshk (kategoria e parë)", "Fisch (1. Kategorie)", "Рыба (первая категория)"), weight: "1kg", price: 50.0 },
      { name: T("Eel", "Jegulja", "Njala", "Aal", "Угорь"), weight: "300gr", price: 16.0 },
      { name: T("Trout", "Pastrmka", "Troftë", "Forelle", "Форель"), weight: "1kg", price: 25.0 },
      { name: T("Mullet", "Skakavica", "Qefull", "Meeräsche", "Кефаль"), weight: "1kg", price: 25.0 },
      { name: T("Carp", "Šaran", "Krap", "Karpfen", "Карп"), weight: "1kg", price: 27.0 },
      { name: T("Shrimp", "Škampi", "Karkaleca Deti", "Garnelen", "Креветки"), weight: "300gr", price: 15.0 },
      { name: T("Shrimp Saganaki", "Škampi na buzaru (saganać)", "Karkaleca në Sos (saganaki)", "Garnelen am Buzara (Saganaki)", "Креветки в соусе (саганаки)"), weight: "300gr", price: 16.0 },
      { name: T("Grilled Calamari", "Lignje", "Kallamari", "Tintenfisch (gegrillt)", "Кальмары (гриль)"), weight: "300gr", price: 13.0 },
      { name: T("Fried Calamari", "Pohovane lignje", "Kalamarë të Skuqur", "Frittierter Tintenfisch", "Панированные кальмары"), weight: "300gr", price: 14.0 },
      { name: T("Fish Fillet", "Riblji file", "Filetо Peshku", "Fischfilet", "Рыбное филе"), weight: "250gr", price: 10.0 }
    ]
  },
  {
    key: "dessert",
    name: T("Dessert", "Poslastice", "Ëmbëlsira", "Nachtisch", "Десерт"),
    items: [
      { name: T("Dessert of the Day", "Dezert dana", "Ëmbëlsira e Ditës", "Nachtisch des Tages", "Десерт дня"), weight: "200gr", price: 4.0 },
      { name: T("Tespixhe (traditional)", "Tespidža (tradicionalna)", "Tespixhe (tradicionale)", "Tespixha (heimische Spezialität)", "Тэспиджа (традиционная)"), weight: "200gr", price: 2.5 },
      { name: T("Pancakes", "Palačinke", "Krepa", "Pfannkuchen", "Блины"), weight: "300gr", price: 4.0 }
    ]
  }
];

/* ---------- KIDS MENU ---------- */
const KIDS_MENU = [
  {
    key: "kids",
    name: T("Kids Menu", "Dječji meni", "Menu për Fëmijë", "Kindermenü", "Детское меню"),
    items: [
      { name: T("Fish Fingers", "Riblji štapići", "Kroketa Peshku", "Fischstäbchen", "Рыбные палочки"), weight: "", price: 4.0 },
      { name: T("Chicken Fillet", "Pileći file", "Fileto Pule", "Hühnerfilet", "Куриное филе"), weight: "", price: 4.0 },
      { name: T("Fried Chicken Fillet", "Pohovani pileći file", "Kroketa Pule", "Paniertes Hühnerfilet", "Панированное куриное филе"), weight: "", price: 4.0 },
      { name: T("Spaghetti Bolognese", "Špageti bolonjez", "Shpageti Bolonjeze", "Spaghetti Bolognese", "Спагетти болоньезе"), weight: "", price: 4.0 },
      { name: T("French Fries", "Pomfrit", "Patate të Skuqura", "Pommes Frites", "Картофель фри"), weight: "", price: 2.5 }
    ]
  }
];

/* ---------- DRINKS ---------- */
const DRINKS_MENU = [
  {
    key: "non-alcoholic",
    name: T("Non-Alcoholic Drinks", "Bezalkoholna pića", "Pije Jo Alkoolike", "Alkoholfreie Getränke", "Безалкогольные напитки"),
    items: [
      { name: T("Coca Cola", "Koka kola", "Koka Kola", "Coca Cola", "Кока-кола"), weight: "0.25L", price: 2.5 },
      { name: T("Fanta", "Fanta", "Fanta", "Fanta", "Фанта"), weight: "0.25L", price: 2.5 },
      { name: T("Sprite", "Sprajt", "Sprite", "Sprite", "Спрайт"), weight: "0.25L", price: 2.5 },
      { name: T("Bitter Lemon", "Biter lemon", "Bitter Lemon", "Bitter Lemon", "Биттер лимон"), weight: "0.25L", price: 2.5 },
      { name: T("Tonic Water", "Tonik voda", "Tonic Water", "Tonic Water", "Тоник вода"), weight: "0.25L", price: 2.5 },
      { name: T("Fruit Juice (still)", "Voćni sok negaziran", "Lëngje Frutash, jo-gazuara", "Fruchtsaft (still)", "Фруктовый сок (негазированный)"), weight: "0.20L", price: 2.5 },
      { name: T("Ice Tea", "Ledeni čaj", "Ice Tea (çaj i ftohtë)", "Ice Tea", "Холодный чай"), weight: "0.33L", price: 2.5 },
      { name: T("Sparkling Water", "Gazirana mineralna voda", "Ujë i Gazuar", "Mineralwasser (spritzig)", "Газированная минеральная вода"), weight: "0.25L", price: 1.5 },
      { name: T("Sparkling Water", "Gazirana mineralna voda", "Ujë i Gazuar", "Mineralwasser (spritzig)", "Газированная минеральная вода"), weight: "0.70L", price: 3.0 },
      { name: T("Still Water", "Negazirana voda", "Ujë Natyral", "Stilles Mineralwasser", "Негазированная вода"), weight: "0.25L", price: 1.5 },
      { name: T("Still Water", "Negazirana voda", "Ujë Natyral", "Stilles Mineralwasser", "Негазированная вода"), weight: "0.70L", price: 3.0 },
      { name: T("Red Bull", "Red bull", "Red Bull", "Red Bull", "Ред Булл"), weight: "0.25L", price: 4.0 },
      { name: T("Freshly Squeezed Orange", "Cijeđena pomorandža", "Portokall i Shtrydhur", "Frisch gepresster Orangensaft", "Свежевыжатый апельсиновый сок"), weight: "0.33L", price: 3.5 },
      { name: T("Freshly Squeezed Lemon", "Cijeđeni limun", "Limon i Shtrydhur", "Frisch gepresster Zitronensaft", "Напиток из свежевыжатого лимона"), weight: "0.33L", price: 3.0 },
      { name: T("Pomegranate Juice", "Sok od šipka", "Lëng Shege", "Granatapfelsaft", "Сок шиповника"), weight: "0.33L", price: 3.0 }
    ]
  },
  {
    key: "warm-drinks",
    name: T("Warm Drinks", "Topli napici", "Pije të Ngrohta", "Warme Getränke", "Горячие напитки"),
    items: [
      { name: T("Turkish Coffee", "Kuvana kafa", "Kafe Turke", "Türkischer Kaffee", "Турецкий кофе"), weight: "0.20L", price: 2.0 },
      { name: T("Espresso", "Espreso", "Espresso", "Espresso", "Кофе эспрессо"), weight: "0.10L", price: 1.5 },
      { name: T("Cappuccino", "Kapućino", "Kapucino", "Cappuccino", "Кофе капучино"), weight: "0.20L", price: 2.5 },
      { name: T("Nescafe", "Nескafe", "Nescafe", "Nescaffe", "Нескафе"), weight: "0.20L", price: 2.5 },
      { name: T("Filter Coffee", "Deutsch (filter kafa)", "Kafe Gjermane (filtër)", "Filterkaffee (Deutsch)", "Немецкий кофе (фильтр)"), weight: "0.20L", price: 2.5 },
      { name: T("Tea", "Čaj po želji", "Çaj sipas dëshirës", "Tee nach Geschmack", "Чай по желанию"), weight: "0.20L", price: 1.5 }
    ]
  },
  {
    key: "beer",
    name: T("Beer", "Piva", "Birrë", "Bier", "Пиво"),
    items: [
      { name: T("Nikšić Unfiltered", "Nikšićko nefiltrirano", "Nikshiqko i pafiltruar", "Nikšićko ungefiltert", "Никшич нефильтрованное"), weight: "0.33L", price: 3.0 },
      { name: T("Nikšićko", "Nikšićko flaša", "Nikshiqko", "Nikšićko", "Никшичко"), weight: "0.33L", price: 2.5 },
      { name: T("Nikšićko Gold", "Nikšićko Gold", "Nikshiqko Gold", "Nikšićko Gold", "Никшичко Голд"), weight: "0.33L", price: 2.5 },
      { name: T("Tuborg", "Tuborg", "Tuborg", "Tuborg", "Туборг"), weight: "0.33L", price: 2.5 },
      { name: T("Heineken", "Heineken", "Heineken", "Heineken", "Хейнекен"), weight: "0.25L", price: 3.0 },
      { name: T("Draught Beer", "Točeno pivo", "Birrë Kriglë", "Bier vom Fass", "Разливное пиво"), weight: "0.33L", price: 2.5 }
    ]
  },
  {
    key: "whiskey",
    name: T("Whiskey", "Viski", "Uiski", "Whiskey", "Виски"),
    items: [
      { name: "Johnny Walker Red Label", weight: "0.03L", price: 2.5 },
      { name: "Johnny Walker Black Label", weight: "0.03L", price: 4.0 },
      { name: "Chivas Regal", weight: "0.03L", price: 4.0 },
      { name: "Jack Daniels", weight: "0.03L", price: 4.0 }
    ]
  },
  {
    key: "cognac",
    name: T("Cognac", "Konjak", "Konjak", "Cognac", "Коньяк"),
    items: [
      { name: "Courvoisier V.S", weight: "0.03L", price: 5.0 },
      { name: "Hennessy V.S", weight: "0.03L", price: 5.0 },
      { name: "Skenderbeg", weight: "0.03L", price: 2.5 },
      { name: "Stock 84", weight: "0.03L", price: 2.5 }
    ]
  },
  {
    key: "brandies",
    name: T(
      "Natural Fruit Brandies & Spirits",
      "Prirodne voćne rakije i alkoholna pića",
      "Raki Natyral Frutash dhe Pije Alkoolike",
      "Natürliche Obstschnäpse & Spirituosen",
      "Натуральные фруктовые самогоны и алкогольные напитки"
    ),
    items: [
      { name: T("Grape Brandy", "Loza prirodna", "Raki Rrushi", "Traubenschnaps", "Виноградный самогон"), weight: "0.03L", price: 2.5 },
      { name: T("Quince Brandy", "Dunja", "Raki Ftoni", "Quittenschnaps", "Самогон из айвы"), weight: "0.03L", price: 3.0 },
      { name: T("Apricot Brandy", "Kajsija", "Raki Kajsie", "Aprikosenschnaps", "Самогон из абрикоса"), weight: "0.03L", price: 3.0 },
      { name: T("Plum Brandy", "Šljiva", "Raki Kumbulle", "Pflaumenschnaps", "Самогон из сливы"), weight: "0.03L", price: 3.0 },
      { name: "Prvijenac", weight: "0.03L", price: 2.5 },
      { name: "Beluga Noble (vodka)", weight: "0.03L", price: 4.0 },
      { name: "Oyster Adriatic Gin", weight: "0.03L", price: 4.0 },
      { name: "Oyster Adriatic Citrus", weight: "0.03L", price: 4.0 }
    ]
  },
  {
    key: "liqueurs",
    name: T("Liqueurs", "Likeri", "Likere", "Liköre", "Ликёры"),
    items: [
      { name: "Gorki List", weight: "0.03L", price: 2.5 },
      { name: "Jägermeister", weight: "0.03L", price: 3.0 },
      { name: "Amaro Montenegro", weight: "0.03L", price: 3.0 },
      { name: "Baileys", weight: "0.03L", price: 3.0 }
    ]
  }
];

/* ---------- WINE LIST ---------- */
const COUNTRY = {
  montenegro: T("Montenegro", "Crna Gora", "Mal i Zi", "Montenegro", "Черногория"),
  italy: T("Italy", "Italija", "Itali", "Italien", "Италия"),
  france: T("France", "Francuska", "Francë", "Frankreich", "Франция"),
  croatia: T("Croatia", "Hrvatska", "Kroaci", "Kroatien", "Хорватия"),
  serbia: T("Serbia", "Srbija", "Serbi", "Serbien", "Сербия")
};

const WINE_MENU = [
  {
    key: "red",
    name: T("Red Wines", "Crveno vino", "Verë e Kuqe", "Rotwein", "Красные вина"),
    groups: [
      {
        country: COUNTRY.montenegro,
        items: [
          { name: "Zavjet Vranac", vol: "0.75L", price: 16.0 },
          { name: "Zavjet Vranac Barrique", vol: "0.75L", price: 20.0 },
          { name: "Vranac", vol: "0.75L", price: 15.0 },
          { name: "Vranac", vol: "0.187L", price: 4.0 },
          { name: "Cabernet", vol: "0.75L", price: 15.0 },
          { name: "Merlot", vol: "0.75L", price: 15.0 },
          { name: "Vranac Pro Corde", vol: "0.75L", price: 18.0 },
          { name: "Vranac Pro Corde", vol: "0.187L", price: 4.5 },
          { name: "Epoha", vol: "0.75L", price: 30.0 },
          { name: "Meduna", vol: "0.5L", price: 28.0 },
          { name: "Vladika", vol: "0.75L", price: 30.0 },
          { name: "Vranac Barrique", vol: "0.75L", price: 35.0 },
          { name: "Vranac Reserve", vol: "0.75L", price: 65.0 },
          { name: "Premijer", vol: "0.75L", price: 180.0 }
        ]
      },
      {
        country: COUNTRY.italy,
        items: [
          { name: "Montepulciano D'Abruzzo — Marina Cvetić", vol: "0.75L", price: 75.0 },
          { name: "Primitivo Puglia — Cantina Denese", vol: "0.75L", price: 28.0 }
        ]
      },
      {
        country: COUNTRY.france,
        items: [
          { name: "Château La Prade — Francs-Côtes de Bordeaux", vol: "0.75L", price: 35.0 },
          { name: "Monsieur Louis Reserve", vol: "0.75L", price: 30.0 }
        ]
      },
      {
        country: COUNTRY.croatia,
        items: [
          { name: "De Gotho Pinot Crni", vol: "0.75L", price: 35.0 },
          { name: "Dingač Matuško", vol: "0.75L", price: 60.0 },
          { name: "Plavac Mali Grgić", vol: "0.75L", price: 90.0 }
        ]
      }
    ]
  },
  {
    key: "white",
    name: T("White Wine", "Bijela vina", "Verë e Bardhë", "Weißwein", "Белые вина"),
    groups: [
      {
        country: COUNTRY.montenegro,
        items: [
          { name: "Zavjet (domaća)", vol: "0.75L", price: 18.0 },
          { name: "Krstač", vol: "0.75L", price: 15.0 },
          { name: "Sauvignon", vol: "0.75L", price: 15.0 },
          { name: "Chardonnay", vol: "0.75L", price: 15.0 },
          { name: "Chardonnay", vol: "0.187L", price: 4.0 },
          { name: "Pro Anima Chardonnay-Sauvignon", vol: "0.75L", price: 22.0 },
          { name: "Malvazija", vol: "0.75L", price: 24.0 },
          { name: "Pro Anima Pinot Blanc", vol: "0.75L", price: 24.0 },
          { name: "Luča", vol: "0.75L", price: 30.0 },
          { name: "Chardonnay Barrique", vol: "0.75L", price: 32.0 },
          { name: "Nota", vol: "0.75L", price: 48.0 }
        ]
      },
      {
        country: COUNTRY.serbia,
        items: [{ name: "Kovačević Chardonnay", vol: "0.75L", price: 35.0 }]
      },
      {
        country: COUNTRY.croatia,
        items: [
          { name: "Pošip Grgić", vol: "0.75L", price: 80.0 },
          { name: "Pošip Čara", vol: "0.75L", price: 40.0 },
          { name: "Malvazija Benvenuti", vol: "0.75L", price: 42.0 },
          { name: "De Gotho Graševina", vol: "0.75L", price: 33.0 },
          { name: "Graševina Kutjevo", vol: "0.75L", price: 25.0 },
          { name: "Graševina Kutjevo", vol: "0.187L", price: 5.0 }
        ]
      },
      {
        country: COUNTRY.italy,
        items: [
          { name: "Marina Cvetić Masciarelli Chardonnay", vol: "0.75L", price: 120.0 },
          { name: "Pinot Grigio Anticavigna", vol: "0.75L", price: 27.0 }
        ]
      }
    ]
  },
  {
    key: "rose",
    name: T("Rosé Wine", "Rose vina", "Verë Rozé", "Roséwein", "Розовые вина"),
    groups: [
      {
        country: COUNTRY.montenegro,
        items: [
          { name: "Rosé", vol: "0.75L", price: 15.0 },
          { name: "Rosé", vol: "0.187L", price: 4.0 }
        ]
      },
      {
        country: COUNTRY.croatia,
        items: [{ name: "Rosé Kutjevo", vol: "0.75L", price: 25.0 }]
      }
    ]
  },
  {
    key: "sparkling",
    name: T("Sparkling Wine", "Penušava vina", "Verë Gazuar", "Schaumwein", "Игристые вина"),
    groups: [
      {
        country: null,
        items: [
          { name: "Moët & Chandon Brut Imperial", vol: "0.75L", price: 150.0 },
          { name: "Val Rosé Plantaže", vol: "0.75L", price: 30.0 },
          { name: "Val Brut Plantaže", vol: "0.75L", price: 20.0 }
        ]
      }
    ]
  }
];

/* ---------- ACTIVITIES & CAMPING ---------- */
const ACTIVITIES_MENU = [
  {
    key: "camping",
    name: T("Camping", "Kampovanje", "Kampim", "Camping", "Кемпинг"),
    items: [
      {
        name: T("Campervan", "Kamper", "Kamper", "Wohnmobil", "Кемпер"),
        unit: T("per night", "po noći", "për natë", "pro Nacht", "за ночь"),
        price: 20.0
      },
      {
        name: T("Car Camp", "Auto kamp", "Kamp me Makinë", "Autocamp", "Автокемпинг"),
        unit: T("per night", "po noći", "për natë", "pro Nacht", "за ночь"),
        price: 15.0
      },
      {
        name: T("Moto Camp", "Moto kamp", "Kamp me Motor", "Motorrad-Camp", "Мотокемпинг"),
        unit: T("per night", "po noći", "për natë", "pro Nacht", "за ночь"),
        price: 15.0
      }
    ],
    note: T(
      "Includes electricity, toilet, and shower.",
      "Uključeno: struja, toalet i tuš.",
      "Përfshihet: energji elektrike, tualet dhe dush.",
      "Inklusive Strom, Toilette und Dusche.",
      "Включено: электричество, туалет и душ."
    )
  },
  {
    key: "lake",
    name: T("On the Lake", "Na jezeru", "Në Liqen", "Auf dem See", "На озере"),
    items: [
      {
        name: T(
          "Platform Restaurant Boat (10+ guests)",
          "Splav-restoran (10+ osoba)",
          "Varkë-Restorant Platformë (10+ persona)",
          "Plattform-Restaurant-Boot (10+ Gäste)",
          "Плавучий ресторан-платформа (10+ человек)"
        ),
        unit: T("per hour", "po satu", "në orë", "pro Stunde", "в час"),
        price: 70.0
      },
      {
        name: T("Boat Tour", "Vožnja čamcem", "Xhiro me Varkë", "Bootstour", "Прогулка на лодке"),
        unit: T("40 minutes", "40 minuta", "40 minuta", "40 Minuten", "40 минут"),
        price: 30.0
      }
    ]
  },
  {
    key: "fishing",
    name: T("Fishing Trip", "Ribolovni izlet", "Udhëtim Peshkimi", "Angelausflug", "Рыболовная поездка"),
    items: [
      {
        name: T(
          "Transport to Fishing Spot",
          "Prevoz do mjesta za pecanje",
          "Transport në Vendin e Peshkimit",
          "Transport zum Angelplatz",
          "Трансфер к месту рыбалки"
        ),
        unit: T("round trip", "povratno", "vajtje-ardhje", "Hin- und Rückfahrt", "туда и обратно"),
        price: 30.0
      }
    ],
    note: T(
      "All fishing equipment is your own.",
      "Sav ribolovni pribor je vaš vlastiti.",
      "I gjithë pajisja e peshkimit është juaja.",
      "Die gesamte Angelausrüstung bringen Sie selbst mit.",
      "Всё рыболовное снаряжение — своё."
    )
  }
];
