// Pénzügyi Alapismeretek - Lecke rendszer
// Minden lecke 3 játékot tartalmaz: Olvasás, Párosítás, Kvíz

export interface ReadingQuestion {
  question: string;
  answer: string;
  keywords: string[];
}

export interface ReadingContent {
  title: string;
  content: string;
  questions: ReadingQuestion[];
}

export interface MatchingPair {
  id: number;
  left: string;
  right: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Lesson {
  id: number;
  pageNumber: number;
  reading: ReadingContent;
  matching: MatchingPair[];
  quiz: QuizQuestion[];
}

export const penzugyiAlapismeretkLessons: Lesson[] = [
  // 1. oldal - Bevezetés
  {
    id: 1,
    pageNumber: 1,
    reading: {
      title: "Bevezetés",
      content: `Ez a könyv azért készült, hogy általános ismereteket nyújtson a gazdaság működésének alapvető folyamatairól, azon belül is leginkább a tőkepiacokkal ismertesse meg az érdeklődőket, tanulókat. Segítségével nem feltétlenül válhatunk azonnal tapasztalt befektetési szakemberekké, de a tartalom elsajátításával széleskörű ismereteket szerezhetünk, ami egy kezdő lépés lehet, hogy elindulhassunk a tőkepiacok varázslatos világában.

El kell fogadnunk azt a tényt, hogy a mai világ legalapvetőbb emberi szükséglete a pénz, ebben fejezzük ki a legtöbb igényünket, elégítjük ki szükségleteink jelentős részét. Az út, ami a pénzügyek működésének megértéséhez vezet rendkívül hosszú és bonyolult.`,
      questions: [
        {
          question: "Milyen ismereteket nyújt a könyv?",
          answer: "általános pénzügyi és tőkepiaci ismereteket",
          keywords: ["általános", "pénzügy", "tőkepiac", "ismeret", "gazdaság"]
        },
        {
          question: "Mi a mai világ legalapvetőbb emberi szükséglete?",
          answer: "pénz",
          keywords: ["pénz"]
        },
        {
          question: "Mivel ismerteti meg ez a könyv az olvasókat?",
          answer: "a tőkepiacokkal",
          keywords: ["tőkepiac", "piac"]
        },
        {
          question: "Mivé nem válhatunk azonnal a könyv segítségével?",
          answer: "tapasztalt befektetési szakemberré",
          keywords: ["szakember", "befektető", "befektetési"]
        },
        {
          question: "Milyen út vezet a pénzügyek működésének megértéséhez?",
          answer: "rendkívül hosszú és bonyolult",
          keywords: ["hosszú", "bonyolult", "nehéz", "összetett"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Tőkepiac", right: "Pénzügyi világ" },
      { id: 2, left: "Befektetés", right: "Pénzügyi döntés" },
      { id: 3, left: "Ismeretek", right: "Tudás" },
      { id: 4, left: "Szükséglet", right: "Igény" },
      { id: 5, left: "Folyamat", right: "Működés" },
      { id: 6, left: "Varázslatos", right: "Csodálatos" },
      { id: 7, left: "Könyv", right: "Tananyag" },
      { id: 8, left: "Gazdasági", right: "Pénzügyi" },
      { id: 9, left: "Alapfolyamat", right: "Alapvető működés" },
      { id: 10, left: "Megértés", right: "Felfogás" },
      { id: 11, left: "Szakember", right: "Hozzáértő" },
      { id: 12, left: "Út", right: "Folyamat" },
      { id: 13, left: "Tartalom", right: "Anyag" },
      { id: 14, left: "Elsajátítás", right: "Megtanulás" },
      { id: 15, left: "Cél", right: "Szándék" }
    ],
    quiz: [
      {
        question: "Mi a könyv fő célja?",
        options: [
          "Szakemberré képezni azonnal",
          "Általános pénzügyi ismereteket nyújtani",
          "Tőzsdei kereskedést tanítani",
          "Számviteli tudást adni"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi a mai világ legalapvetőbb emberi szükséglete a könyv szerint?",
        options: [
          "Egészség",
          "Szeretet",
          "Pénz",
          "Szabadság"
        ],
        correctAnswer: 2
      },
      {
        question: "Mivel ismerteti meg a könyv az olvasókat?",
        options: [
          "Számvitellel",
          "Tőkepiacokkal",
          "Ingatlanokkal",
          "Biztosítással"
        ],
        correctAnswer: 1
      },
      {
        question: "Milyen az út a pénzügyek megértéséhez?",
        options: [
          "Rövid és egyszerű",
          "Közepes nehézségű",
          "Hosszú és bonyolult",
          "Lehetetlen"
        ],
        correctAnswer: 2
      },
      {
        question: "Mit nyerhetünk a könyv tartalmának elsajátításával?",
        options: [
          "Azonnali gazdagságot",
          "Szakértői címet",
          "Széleskörű ismereteket",
          "Befektetési garanciát"
        ],
        correctAnswer: 2
      },
      {
        question: "Miért nem válhatunk azonnal szakemberré a könyv segítségével?",
        options: [
          "Mert túl rövid a könyv",
          "Mert csak alapismereteket ad",
          "Mert nincs gyakorlat benne",
          "Mert rossz a könyv"
        ],
        correctAnswer: 1
      },
      {
        question: "Miben fejezzük ki igényeink jelentős részét?",
        options: [
          "Időben",
          "Pénzben",
          "Szavakban",
          "Érzésekben"
        ],
        correctAnswer: 1
      },
      {
        question: "Milyen útról beszél a könyv?",
        options: [
          "Autópályáról",
          "Tanulási útról",
          "Pénzügyek megértésének útjáról",
          "Utazásról"
        ],
        correctAnswer: 2
      },
      {
        question: "Mi a könyv tartalma?",
        options: [
          "Történelmi események",
          "Gazdasági alapfolyamatok",
          "Sport eredmények",
          "Receptek"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi a tőkepiacok világa a könyv szerint?",
        options: [
          "Unalmas",
          "Veszélyes",
          "Varázslatos",
          "Egyszerű"
        ],
        correctAnswer: 2
      }
    ]
  },
  
  // 2. oldal - Megtakarítások fontossága
  {
    id: 2,
    pageNumber: 2,
    reading: {
      title: "Megtakarítások fontossága",
      content: `A magyar lakosság általánosságban nagyon keveset foglalkozik a pénzügyeivel. Az alapvető cél az lenne, hogy pontosan ismerjük pénzügyi bevételeinket, kiadásainkat, rendszerezni és értékelni tudjuk azt a folyamatot, aminek alapján megtakarítással rendelkezhetünk, amely megtakarítás gondosan felügyelt, megalapozott döntések útján történő befektetéssel tovább gyarapodhat.

A lakossági megtakarítások növekedése nem csak egyéni, hanem társadalmi érdek is egyaránt. A magasabb életszínvonal kialakulásának egyik legfontosabb pillére a lakossági megtakarítások növekedése.`,
      questions: [
        {
          question: "Mit kellene jobban ismernünk pénzügyeink kezeléséhez?",
          answer: "bevételeinket és kiadásainkat",
          keywords: ["bevétel", "kiadás", "pénzügy", "ismerni"]
        },
        {
          question: "Kinek az érdeke a megtakarítások növekedése?",
          answer: "egyéni és társadalmi is",
          keywords: ["egyéni", "társadalmi", "mindkettő", "egyaránt"]
        },
        {
          question: "Mivel foglalkozik keveset a magyar lakosság?",
          answer: "a pénzügyeivel",
          keywords: ["pénzügy", "pénz"]
        },
        {
          question: "Hogyan gyarapodhat a megtakarítás?",
          answer: "befektetéssel",
          keywords: ["befektetés", "befektet", "gyarapít"]
        },
        {
          question: "Minek a pillére a lakossági megtakarítások növekedése?",
          answer: "a magasabb életszínvonal kialakulásának",
          keywords: ["életszínvonal", "jólét", "magasabb"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Megtakarítás", right: "Félretett pénz" },
      { id: 2, left: "Bevétel", right: "Jövedelem" },
      { id: 3, left: "Kiadás", right: "Költés" },
      { id: 4, left: "Befektetés", right: "Gyarapítás" },
      { id: 5, left: "Életszínvonal", right: "Jólét" },
      { id: 6, left: "Lakosság", right: "Emberek" },
      { id: 7, left: "Rendszerezés", right: "Szervezés" },
      { id: 8, left: "Értékelés", right: "Elemzés" },
      { id: 9, left: "Gondos", right: "Alapos" },
      { id: 10, left: "Megalapozott", right: "Indokolt" },
      { id: 11, left: "Döntés", right: "Választás" },
      { id: 12, left: "Gyarapodás", right: "Növekedés" },
      { id: 13, left: "Felügyelet", right: "Ellenőrzés" },
      { id: 14, left: "Társadalmi", right: "Közösségi" },
      { id: 15, left: "Érdek", right: "Haszon" }
    ],
    quiz: [
      {
        question: "Mivel kellene többet foglalkoznia a magyar lakosságnak?",
        options: [
          "Sporttal",
          "Pénzügyeivel",
          "Tanulással",
          "Utazással"
        ],
        correctAnswer: 1
      },
      {
        question: "Kinek az érdeke a lakossági megtakarítások növekedése?",
        options: [
          "Csak egyéni",
          "Csak társadalmi",
          "Egyéni és társadalmi is",
          "Egyik sem"
        ],
        correctAnswer: 2
      },
      {
        question: "Mit kellene ismernünk pénzügyeink kezeléséhez?",
        options: [
          "Csak bevételeinket",
          "Csak kiadásainkat",
          "Bevételeinket és kiadásainkat",
          "Csak befektetéseinket"
        ],
        correctAnswer: 2
      },
      {
        question: "Hogyan gyarapodhat a megtakarítás?",
        options: [
          "Magától",
          "Befektetéssel",
          "Rejtve",
          "Sehogy"
        ],
        correctAnswer: 1
      },
      {
        question: "Minek a pillére a lakossági megtakarítások növekedése?",
        options: [
          "Gazdasági válságnak",
          "Politikai stabilitásnak",
          "Magasabb életszínvonalnak",
          "Infláció csökkenésének"
        ],
        correctAnswer: 2
      },
      {
        question: "Mit jelent rendszerezni a pénzügyeket?",
        options: [
          "Elrejteni a pénzt",
          "Értékelni a folyamatokat",
          "Elkölteni mindent",
          "Kölcsön kérni"
        ],
        correctAnswer: 1
      },
      {
        question: "Milyennek kell lennie a befektetési döntéseknek?",
        options: [
          "Gyorsnak",
          "Megalapozottnak",
          "Véletlenszerűnek",
          "Impulzívnak"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi a megtakarítás alapja?",
        options: [
          "Szerencse",
          "Bevételek és kiadások ismerete",
          "Lottó",
          "Örökség"
        ],
        correctAnswer: 1
      },
      {
        question: "Mit kellene rendszerezni?",
        options: [
          "Könyveket",
          "Pénzügyi folyamatokat",
          "Ruhákat",
          "Ételeket"
        ],
        correctAnswer: 1
      },
      {
        question: "Milyen megtakarításról beszél a szöveg?",
        options: [
          "Időmegtakarításról",
          "Pénzügyi megtakarításról",
          "Energiamegtakarításról",
          "Helymegatakarításról"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 3. oldal - Pénzügyi tudás hiánya
  {
    id: 3,
    pageNumber: 3,
    reading: {
      title: "Pénzügyi tudás hiánya",
      content: `Az elmúlt években határozott emelkedésnek indultak a magyar bérek, nőttek a megtakarítások, de a pénzügyekkel kapcsolatos időráfordítás nagyon minimálisan emelkedett. Tanulás, tapasztalat és folyamatos odafigyelésre lenne szükség abban a témakörben, ami gyakorlatilag mindenkit érint a háztartások napi pénzügyi teendői révén.

A magyar pénzügyi ismeretek hiánya azonban nem csak a lakossági szegmensben, nem csak a háztartások esetében probléma. Az intézmények pénzügyi irányításának felkészültsége is rendkívül alacsony színvonalú. A KKV és mikró vállalkozások esetében szinte nem is létezik a gondos vállalati pénzügyi irányítás megléte.`,
      questions: [
        {
          question: "Mi történt a bérekkel az elmúlt években?",
          answer: "emelkedtek",
          keywords: ["emelked", "nőtt", "növeked"]
        },
        {
          question: "Hol még probléma a pénzügyi ismeretek hiánya?",
          answer: "intézményeknél és vállalkozásoknál is",
          keywords: ["intézmény", "vállalkozás", "KKV", "vállalat"]
        },
        {
          question: "Mennyire emelkedett a pénzügyekkel kapcsolatos időráfordítás?",
          answer: "nagyon minimálisan",
          keywords: ["minimális", "kevés", "alig"]
        },
        {
          question: "Mire lenne szükség a pénzügyek területén?",
          answer: "tanulásra, tapasztalatra és folyamatos odafigyelésre",
          keywords: ["tanulás", "tapasztalat", "odafigyelés"]
        },
        {
          question: "Milyen vállalkozásoknál szinte nem létezik gondos pénzügyi irányítás?",
          answer: "KKV és mikró vállalkozásoknál",
          keywords: ["KKV", "mikró", "kisvállalkozás"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Bér", right: "Fizetés" },
      { id: 2, left: "KKV", right: "Kis- és középvállalkozás" },
      { id: 3, left: "Háztartás", right: "Család gazdasága" },
      { id: 4, left: "Irányítás", right: "Menedzsment" },
      { id: 5, left: "Tapasztalat", right: "Gyakorlat" },
      { id: 6, left: "Odafigyelés", right: "Figyelem" },
      { id: 7, left: "Tanulás", right: "Oktatás" },
      { id: 8, left: "Elmúlt", right: "Korábbi" },
      { id: 9, left: "Emelkedés", right: "Növekedés" },
      { id: 10, left: "Időráfordítás", right: "Időbefektetés" },
      { id: 11, left: "Minimális", right: "Csekély" },
      { id: 12, left: "Témakör", right: "Terület" },
      { id: 13, left: "Intézmény", right: "Szervezet" },
      { id: 14, left: "Felkészültség", right: "Tudás szint" },
      { id: 15, left: "Mikró", right: "Nagyon kicsi" }
    ],
    quiz: [
      {
        question: "Mi történt az elmúlt években a magyar bérekkel?",
        options: [
          "Csökkentek",
          "Stagnáltak",
          "Emelkedtek",
          "Megszűntek"
        ],
        correctAnswer: 2
      },
      {
        question: "Hol is probléma a pénzügyi ismeretek hiánya?",
        options: [
          "Csak a háztartásokban",
          "Csak a vállalatokban",
          "Háztartásokban és vállalatokban is",
          "Sehol"
        ],
        correctAnswer: 2
      },
      {
        question: "Mennyire emelkedett a pénzügyekkel kapcsolatos időráfordítás?",
        options: [
          "Nagyon sokat",
          "Minimálisan",
          "Közepesen",
          "Egyáltalán nem"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi jellemezte a megtakarításokat az elmúlt években?",
        options: [
          "Csökkentek",
          "Stagnáltak",
          "Nőttek",
          "Megszűntek"
        ],
        correctAnswer: 2
      },
      {
        question: "Milyen vállalkozásoknál szinte nem létezik gondos pénzügyi irányítás?",
        options: [
          "Multinacionális cégeknél",
          "KKV és mikró vállalkozásoknál",
          "Állami cégeknél",
          "Nagyvállalatoknál"
        ],
        correctAnswer: 1
      },
      {
        question: "Mire lenne szükség a pénzügyek területén?",
        options: [
          "Szerencsére",
          "Tanulásra és odafigyelésre",
          "Több pénzre",
          "Kevesebb munkára"
        ],
        correctAnswer: 1
      },
      {
        question: "Kit érint a pénzügyi témakör?",
        options: [
          "Senkit",
          "Csak a gazdagokat",
          "Gyakorlatilag mindenkit",
          "Csak a bankárokat"
        ],
        correctAnswer: 2
      },
      {
        question: "Milyen a pénzügyi irányítás felkészültsége az intézményeknél?",
        options: [
          "Magas színvonalú",
          "Kiváló",
          "Alacsony színvonalú",
          "Tökéletes"
        ],
        correctAnswer: 2
      },
      {
        question: "Milyen szegmensben probléma a pénzügyi ismeretek hiánya?",
        options: [
          "Csak lakossági",
          "Csak vállalati",
          "Lakossági és vállalati is",
          "Egyik sem"
        ],
        correctAnswer: 2
      },
      {
        question: "Mit jelent a KKV rövidítés?",
        options: [
          "Közös Kereskedelmi Vállalat",
          "Kis- és középvállalkozás",
          "Kormányzati Költségvetési Válasz",
          "Kereskedelmi Központi Végrehajtás"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 4. oldal - A pénz bevezetése
  {
    id: 4,
    pageNumber: 4,
    reading: {
      title: "A pénz - Bevezetés",
      content: `Kezünkbe fogunk értékes papírokat, érméket. Súlyuk, anyaguk lényegtelen az értékük tekintetében? Hogy milyen értékkel bírnak leginkább attól függ, hogy milyen szám van rájuk írva? Persze, ha ez ilyen egyszerű lenne, akkor fognánk egy papírt, ráírnánk egy számot és könnyedén gazdagok lehetnénk.

Színes, képes papírok, dombornyomott érmék. Lehetnek szépek, ritkák, lényegesen értékesebbek, mint amit az \"előállításuk\", anyaguk képvisel. Ezek a papírok, fémek közel sem szolgálnak mindenképpen fizetési eszközként.`,
      questions: [
        {
          question: "Mitől függ a pénz értéke?",
          answer: "a rá írt számtól",
          keywords: ["szám", "címlet", "érték"]
        },
        {
          question: "Miért nem lehet egyszerűen pénzt készíteni?",
          answer: "mert elfogadottnak kell lennie",
          keywords: ["elfogad", "érvény", "társadalom", "törvény"]
        },
        {
          question: "Mire nem feltétlenül szolgálnak a színes, képes papírok és érmék?",
          answer: "fizetési eszközként",
          keywords: ["fizetési eszköz", "fizetés", "pénz"]
        },
        {
          question: "Mi lényegtelen a pénz értékének tekintetében?",
          answer: "a súlya és anyaga",
          keywords: ["súly", "anyag"]
        },
        {
          question: "Lehetnek-e a pénzek értékesebbek, mint amit az előállításuk képvisel?",
          answer: "igen",
          keywords: ["igen", "lehet", "értékesebb"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Pénz", right: "Fizetőeszköz" },
      { id: 2, left: "Érme", right: "Fém pénz" },
      { id: 3, left: "Bankjegy", right: "Papírpénz" },
      { id: 4, left: "Érték", right: "Címlet" },
      { id: 5, left: "Ritkaság", right: "Gyűjtői darab" },
      { id: 6, left: "Súly", right: "Tömeg" },
      { id: 7, left: "Anyag", right: "Összetétel" },
      { id: 8, left: "Szám", right: "Számjegy" },
      { id: 9, left: "Képes", right: "Illusztrált" },
      { id: 10, left: "Színes", right: "Tarka" },
      { id: 11, left: "Dombornyomott", right: "Domború" },
      { id: 12, left: "Előállítás", right: "Gyártás" },
      { id: 13, left: "Lényegtelen", right: "Nem fontos" },
      { id: 14, left: "Gazdag", right: "Tehetős" },
      { id: 15, left: "Szolgálat", right: "Funkció" }
    ],
    quiz: [
      {
        question: "Mitől függ elsősorban a pénz értéke?",
        options: [
          "A súlyától",
          "Az anyagától",
          "A rá írt számtól",
          "A színétől"
        ],
        correctAnswer: 2
      },
      {
        question: "Miért nem lehet egyszerűen pénzt készíteni?",
        options: [
          "Mert drága az anyag",
          "Mert bonyolult",
          "Mert elfogadottnak kell lennie",
          "Mert nehéz papírt találni"
        ],
        correctAnswer: 2
      },
      {
        question: "Mi lényegtelen a pénz értéke szempontjából?",
        options: [
          "A rá írt szám",
          "A súlya és anyaga",
          "Az elfogadottsága",
          "A címlete"
        ],
        correctAnswer: 1
      },
      {
        question: "Lehetnek-e a pénzek értékesebbek az előállításuknál?",
        options: [
          "Nem, soha",
          "Igen, lehetnek",
          "Csak ritkán",
          "Csak régen"
        ],
        correctAnswer: 1
      },
      {
        question: "Mit képviselnek a színes, képes papírok és érmék?",
        options: [
          "Mindig fizetési eszközt",
          "Csak díszítést",
          "Nem feltétlenül fizetési eszközt",
          "Műtárgyakat"
        ],
        correctAnswer: 2
      },
      {
        question: "Mit fogunk kézbe értékesként?",
        options: [
          "Köveket",
          "Papírokat és érméket",
          "Gyümölcsöket",
          "Könyveket"
        ],
        correctAnswer: 1
      },
      {
        question: "Milyen lehetnek a pénzek?",
        options: [
          "Szépek és ritkák",
          "Mindig olcsók",
          "Értéktelenek",
          "Egyformák"
        ],
        correctAnswer: 0
      },
      {
        question: "Mi van rá írva a pénzre?",
        options: [
          "Történetek",
          "Szám",
          "Képek",
          "Nevek"
        ],
        correctAnswer: 1
      },
      {
        question: "Miért nem lehetnénk gazdagok egy papír és egy szám írásával?",
        options: [
          "Mert túl könnyű lenne",
          "Mert a pénznek elfogadottnak kell lennie",
          "Mert nincs papír",
          "Mert rossz az írásunk"
        ],
        correctAnswer: 1
      },
      {
        question: "Milyen érmékről beszél a szöveg?",
        options: [
          "Játékérmékről",
          "Dombornyomott érmékről",
          "Csokoládé érmékről",
          "Sport érmékről"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 5. oldal - A pénz mint fizetőeszköz
  {
    id: 5,
    pageNumber: 5,
    reading: {
      title: "A pénz mint fizetőeszköz",
      content: `Ahhoz, hogy a pénz valójában pénz lehessen, forgalmi értékkel rendelkezzen, ahhoz az szükséges, hogy a piac, a társadalom, a törvényi és prudenciális szabályozás is fizetési eszköznek ismerje, fogadja el.

A pénz egy \"áru\", ami elfogadott értékkel bír és ezáltal elcserélhetjük olyan árucikkekre, amiknek az értékét pénzben is ki tudjuk fejezni. Ugyanakkor a mai világban sem minden árucikk és nem is fejezhető ki minden értékben, pénzben.`,
      questions: [
        {
          question: "Mi szükséges ahhoz, hogy a pénz fizetőeszköz legyen?",
          answer: "a piac, társadalom és szabályozás elfogadása",
          keywords: ["piac", "társadalom", "szabályozás", "elfogad"]
        },
        {
          question: "Mi a pénz a gazdaságban?",
          answer: "egy elfogadott értékkel bíró áru",
          keywords: ["áru", "elfogad", "érték"]
        },
        {
          question: "Mivel kell rendelkeznie a pénznek?",
          answer: "forgalmi értékkel",
          keywords: ["forgalmi", "érték"]
        },
        {
          question: "Mire cserélhetjük el a pénzt?",
          answer: "árucikkekre",
          keywords: ["áru", "cikk", "csere"]
        },
        {
          question: "Fejezhető-e ki minden érték pénzben?",
          answer: "nem",
          keywords: ["nem", "nem minden"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Forgalom", right: "Kereskedelem" },
      { id: 2, left: "Társadalom", right: "Közösség" },
      { id: 3, left: "Szabályozás", right: "Törvény" },
      { id: 4, left: "Elfogadás", right: "Érvényesség" },
      { id: 5, left: "Csere", right: "Vásárlás" },
      { id: 6, left: "Piac", right: "Kereskedési hely" },
      { id: 7, left: "Törvényi", right: "Jogi" },
      { id: 8, left: "Prudenciális", right: "Óvatos" },
      { id: 9, left: "Áru", right: "Termék" },
      { id: 10, left: "Árucikk", right: "Portéka" },
      { id: 11, left: "Kifejezés", right: "Megjelenítés" },
      { id: 12, left: "Mai világ", right: "Jelenkor" },
      { id: 13, left: "Forgalmi", right: "Kereskedelmi" },
      { id: 14, left: "Rendelkezik", right: "Birtokol" },
      { id: 15, left: "Valójában", right: "Ténylegesen" }
    ],
    quiz: [
      {
        question: "Mi kell ahhoz, hogy a pénz fizetőeszköz legyen?",
        options: [
          "Csak a társadalom elfogadása",
          "Csak a törvényi szabályozás",
          "A piac, társadalom és szabályozás elfogadása",
          "Csak a kormány döntése"
        ],
        correctAnswer: 2
      },
      {
        question: "Mi a pénz a gazdaságban?",
        options: [
          "Egy áru elfogadott értékkel",
          "Csak papír",
          "Értéktelen dolog",
          "Csak fém"
        ],
        correctAnswer: 0
      },
      {
        question: "Mivel kell rendelkeznie a pénznek?",
        options: [
          "Nehéz súllyal",
          "Forgalmi értékkel",
          "Színes megjelenéssel",
          "Nagy mérettel"
        ],
        correctAnswer: 1
      },
      {
        question: "Mire cserélhetjük a pénzt?",
        options: [
          "Semmi másra",
          "Csak szolgáltatásokra",
          "Árucikkekre",
          "Csak ingatlanokra"
        ],
        correctAnswer: 2
      },
      {
        question: "Fejezhető-e ki minden érték pénzben?",
        options: [
          "Igen, minden",
          "Nem, nem minden",
          "Csak néhány",
          "Soha semmi"
        ],
        correctAnswer: 1
      },
      {
        question: "Ki kell hogy fogadja el a pénzt fizetőeszközként?",
        options: [
          "Senki",
          "Csak a bank",
          "A piac, társadalom és szabályozás",
          "Csak a kormány"
        ],
        correctAnswer: 2
      },
      {
        question: "Minek egy fajtája a pénz?",
        options: [
          "Fémnek",
          "Árunak",
          "Papírnak",
          "Játéknak"
        ],
        correctAnswer: 1
      },
      {
        question: "Mit jelent a prudenciális szabályozás?",
        options: [
          "Politikai döntést",
          "Pénzügyi biztonságot szolgáló szabályozást",
          "Környezetvédelmet",
          "Közlekedési szabályt"
        ],
        correctAnswer: 1
      },
      {
        question: "Milyen értékkel rendelkezik a pénz?",
        options: [
          "Csak érzelmi értékkel",
          "Forgalmi értékkel",
          "Művészeti értékkel",
          "Történelmi értékkel"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi történik a pénzzel a gazdaságban?",
        options: [
          "Csak gyűjtik",
          "Elcserélhető árucikkekre",
          "Elégetik",
          "Elrejtik"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 6. oldal - Ősközösség
  {
    id: 6,
    pageNumber: 6,
    reading: {
      title: "Ősközösség - Önellátó társadalom",
      content: `Ahhoz, hogy megérthessük a pénz, mint forgalmi értékkel bíró fizetőeszköz kialakulásának az okát, nagyon messzire kell visszautaznunk az emberiség történelmében. Az \"önellátó társadalom\" kifejezés inkább az ősközösségi társadalom életmódjára utal, amit tanulmányainkból így ismerhetünk: vadászás, halászás, gyűjtögetés.

Az ősközösségek történelmi fejlődése erősen korlátozott volt, pontosan az önellátó életmód miatt. Alacsony népsűrűség, változó sikerű önellátás, alacsony népszaporulat jellemezték ezeket a társadalmakat.`,
      questions: [
        {
          question: "Mi jellemezte az ősközösségek életmódját?",
          answer: "vadászás, halászás, gyűjtögetés",
          keywords: ["vadász", "halász", "gyűjtöget", "önellát"]
        },
        {
          question: "Miért volt korlátozott az ősközösségek fejlődése?",
          answer: "az önellátó életmód miatt",
          keywords: ["önellát", "életmód"]
        },
        {
          question: "Milyen népsűrűség jellemezte az ősközösségeket?",
          answer: "alacsony",
          keywords: ["alacsony", "kevés"]
        },
        {
          question: "Milyen volt a népszaporulat az ősközösségekben?",
          answer: "alacsony",
          keywords: ["alacsony", "kevés", "lassú"]
        },
        {
          question: "Milyen volt az önellátás sikeressége?",
          answer: "változó",
          keywords: ["változó", "bizonytalan"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Ősközösség", right: "Ősi társadalom" },
      { id: 2, left: "Önellátás", right: "Saját termelés" },
      { id: 3, left: "Vadászat", right: "Táplálékszerzés" },
      { id: 4, left: "Gyűjtögetés", right: "Élelem keresés" },
      { id: 5, left: "Fejlődés", right: "Haladás" },
      { id: 6, left: "Halászat", right: "Halfogás" },
      { id: 7, left: "Történelmi", right: "Múltbéli" },
      { id: 8, left: "Korlátozott", right: "Beszűkült" },
      { id: 9, left: "Életmód", right: "Életforma" },
      { id: 10, left: "Népsűrűség", right: "Lakossűrűség" },
      { id: 11, left: "Változó", right: "Ingadozó" },
      { id: 12, left: "Sikeres", right: "Eredményes" },
      { id: 13, left: "Népszaporulat", right: "Népesedés" },
      { id: 14, left: "Jellemez", right: "Jelöl" },
      { id: 15, left: "Kifejezés", right: "Szóhasználat" }
    ],
    quiz: [
      {
        question: "Mi jellemezte az ősközösségek életmódját?",
        options: [
          "Kereskedelem",
          "Vadászás, halászás, gyűjtögetés",
          "Iparosodás",
          "Pénzgazdálkodás"
        ],
        correctAnswer: 1
      },
      {
        question: "Miért volt korlátozott az ősközösségek fejlődése?",
        options: [
          "A háborúk miatt",
          "Az önellátó életmód miatt",
          "A betegségek miatt",
          "A hideg miatt"
        ],
        correctAnswer: 1
      },
      {
        question: "Milyen volt a népsűrűség az ősközösségekben?",
        options: [
          "Magas",
          "Alacsony",
          "Közepes",
          "Változó"
        ],
        correctAnswer: 1
      },
      {
        question: "Milyen volt a népszaporulat?",
        options: [
          "Gyors",
          "Alacsony",
          "Közepes",
          "Magas"
        ],
        correctAnswer: 1
      },
      {
        question: "Milyen volt az önellátás sikeressége?",
        options: [
          "Mindig sikeres",
          "Változó",
          "Mindig sikertelen",
          "Garantált"
        ],
        correctAnswer: 1
      },
      {
        question: "Milyen társadalmi formáról beszél a szöveg?",
        options: [
          "Modern társadalomról",
          "Önellátó társadalomról",
          "Ipari társadalomról",
          "Digitális társadalomról"
        ],
        correctAnswer: 1
      },
      {
        question: "Meddig kell visszautaznunk a történelemben a pénz kialakulásának megértéséhez?",
        options: [
          "10 évet",
          "100 évet",
          "Nagyon messzire",
          "Néhány évet"
        ],
        correctAnswer: 2
      },
      {
        question: "Mit jellemez az ősközösségi társadalom?",
        options: [
          "Gyárak",
          "Vadászat, halászat, gyűjtögetés",
          "Gépek",
          "Írás"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi jellemezte a társadalmakat?",
        options: [
          "Magas népsűrűség",
          "Gyors fejlődés",
          "Alacsony népsűrűség és népszaporulat",
          "Technológiai haladás"
        ],
        correctAnswer: 2
      },
      {
        question: "Milyen fizetőeszközről beszél a szöveg?",
        options: [
          "Bankkártyáról",
          "Forgalmi értékkel bíró pénzről",
          "Mobilfizetésről",
          "Kriptovalutáról"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 7. oldal - Cserekereskedelem kezdete
  {
    id: 7,
    pageNumber: 7,
    reading: {
      title: "Cserekereskedelem",
      content: `Az idő múlt és a világ fejlődött. A fejlődéssel pedig jelentkeztek az igények. Elkezdődött a magasabb színvonalú munka elvégzése, ami a hozzáértőket a szakosodás útjára vezette. A szakosodás mind aktívabban tette lehetővé a sokrétű árukészlet felhalmozását, ahol a helyileg kialakult többlet, más helyek hiányának betöltését tette lehetővé.

Elkezdődött a cserekereskedelem. Az elkezdődött szakosodás körülbelül az Őskor végére és az Ókor elejére tehető. Az árucikkekből megtermelt többlet \"útnak indult\", hogy keresse a helyét olyan helyeken, ahol nem volt elég belőle.`,
      questions: [
        {
          question: "Mi tette lehetővé a cserekereskedelem kialakulását?",
          answer: "a szakosodás és a többlet",
          keywords: ["szakosodás", "többlet", "fejlődés"]
        },
        {
          question: "Mikor kezdődött a szakosodás?",
          answer: "az Őskor végén és az Ókor elején",
          keywords: ["őskor", "ókor", "végén", "elején"]
        },
        {
          question: "Milyen színvonalú munka kezdődött?",
          answer: "magasabb színvonalú",
          keywords: ["magasabb", "jobb", "fejlettebb"]
        },
        {
          question: "Hová indult el a megtermelt többlet?",
          answer: "olyan helyekre, ahol hiány volt",
          keywords: ["hiány", "kevés", "szükség"]
        },
        {
          question: "Mit tett lehetővé a szakosodás?",
          answer: "sokrétű árukészlet felhalmozását",
          keywords: ["árukészlet", "felhalmozás", "termék"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Szakosodás", right: "Specializáció" },
      { id: 2, left: "Többlet", right: "Felesleg" },
      { id: 3, left: "Hiány", right: "Szűkösség" },
      { id: 4, left: "Csere", right: "Kereskedelem" },
      { id: 5, left: "Árukészlet", right: "Termékek" },
      { id: 6, left: "Fejlődés", right: "Előrelépés" },
      { id: 7, left: "Igény", right: "Szükséglet" },
      { id: 8, left: "Magasabb", right: "Fejlettebb" },
      { id: 9, left: "Színvonal", right: "Minőség" },
      { id: 10, left: "Munka", right: "Tevékenység" },
      { id: 11, left: "Hozzáértő", right: "Szakember" },
      { id: 12, left: "Sokrétű", right: "Változatos" },
      { id: 13, left: "Felhalmozás", right: "Gyűjtés" },
      { id: 14, left: "Helyileg", right: "Lokálisan" },
      { id: 15, left: "Betöltés", right: "Kielégítés" }
    ],
    quiz: [
      {
        question: "Mi tette lehetővé a cserekereskedelem kialakulását?",
        options: [
          "A pénz",
          "A szakosodás és a többlet",
          "A bankok",
          "A szabályozás"
        ],
        correctAnswer: 1
      },
      {
        question: "Mikor kezdődött a szakosodás?",
        options: [
          "Az újkorban",
          "A középkorban",
          "Az Őskor végén és Ókor elején",
          "A jelenkorban"
        ],
        correctAnswer: 2
      },
      {
        question: "Milyen munka kezdődött a fejlődéssel?",
        options: [
          "Egyszerűbb munka",
          "Magasabb színvonalú munka",
          "Gépi munka",
          "Monoton munka"
        ],
        correctAnswer: 1
      },
      {
        question: "Hová ment a megtermelt többlet?",
        options: [
          "Megsemmisült",
          "Otthon maradt",
          "Hiányos helyekre",
          "Exportra"
        ],
        correctAnswer: 2
      },
      {
        question: "Mit tett lehetővé a szakosodás?",
        options: [
          "Háborút",
          "Árukészlet felhalmozását",
          "Munkanélküliséget",
          "Stagnálást"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi történt az idővel?",
        options: [
          "Megállt",
          "Múlt és a világ fejlődött",
          "Visszafelé ment",
          "Lassult"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi jelentkezett a fejlődéssel?",
        options: [
          "Problémák",
          "Igények",
          "Háborúk",
          "Betegségek"
        ],
        correctAnswer: 1
      },
      {
        question: "Kik indultak a szakosodás útjára?",
        options: [
          "Mindenki",
          "A gyerekek",
          "A hozzáértők",
          "A kormány"
        ],
        correctAnswer: 2
      },
      {
        question: "Mit töltött be a helyileg kialakult többlet?",
        options: [
          "Semmit",
          "Más helyek hiányát",
          "Tárolókat",
          "Raktárakat"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi indult útnak?",
        options: [
          "Az emberek",
          "Az árucikkekből megtermelt többlet",
          "A pénz",
          "A király"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 8. oldal - Cserekereskedelem problémái
  {
    id: 8,
    pageNumber: 8,
    reading: {
      title: "Cserekereskedelem nehézségei",
      content: `A többlet árut kínálót eladónak, az áruhiányban szenvedőt vevőnek nevezzük. Az áru cserekereskedelmének kezdeteként az árukat közvetlenül cserélték más árukra, adott helyenként a kereslet-kínálat együtthatójából következő cserearány szerint. Ennek a közvetlen cserekereskedelemnek azonban az volt a feltétele, hogy a kínált áru helyébe olyan árut kapjunk, amire nekünk is szükségünk van.

Ha halam volt és sóért akartam elcserélni, akkor bizony olyan vevőt kellett találnom a halamra, aki sót akart adni érte. Ha ez a két igény nem jelentkezett egyszerre, akkor a csere nem tudott létrejönni.`,
      questions: [
        {
          question: "Mi volt a közvetlen cserekereskedelem feltétele?",
          answer: "hogy mindkét fél akarjon cserélni",
          keywords: ["mindkét", "fél", "akarat", "szükség", "igény"]
        },
        {
          question: "Mi a probléma, ha halamat sóért akarom cserélni?",
          answer: "olyan vevőt kell találni, akinek van sója",
          keywords: ["vevő", "találni", "só", "egyezés"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Eladó", right: "Áru kínáló" },
      { id: 2, left: "Vevő", right: "Áru kereső" },
      { id: 3, left: "Kereslet", right: "Igény" },
      { id: 4, left: "Kínálat", right: "Ajánlat" },
      { id: 5, left: "Cserearány", right: "Értékarány" }
    ],
    quiz: [
      {
        question: "Mi volt a közvetlen cserekereskedelem feltétele?",
        options: [
          "Pénz megléte",
          "Hogy mindkét fél akarjon cserélni",
          "Bank jelenléte",
          "Szabályozás"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi a probléma, ha halamat sóért akarom cserélni?",
        options: [
          "Nincs probléma",
          "Olyan vevőt kell találni, akinek van sója",
          "A hal drága",
          "A só drága"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 9. oldal - Árupénz kialakulása
  {
    id: 9,
    pageNumber: 9,
    reading: {
      title: "Árupénz",
      content: `Az \"áruért áruval fizetek\" cserekereskedelem számtalan problémát hordozott és hamarosan igény jelentkezett arra, hogy a zökkenőmentesebb cserekereskedelem bonyolításához valamilyen árupénzzel lehessen fizetni.

Az árupénz egy olyan köztes áru az áruk cserekereskedelmében, amit a legkönnyebben volt lehetséges más árukra cserélni és amely áru értéke könnyen meghatározható volt más áruk viszonylatában. Viszonylagosan tartani kellett az értékét, kis- és nagyobb mértékkel is rendelkeznie kellett az oszthatóság végett és már itt jelentkezett az, a mai világban is alapvető feltétel, hogy általánosan elfogadottnak kellett lennie.`,
      questions: [
        {
          question: "Mi az árupénz?",
          answer: "köztes áru a cserekereskedelemben",
          keywords: ["köztes", "áru", "csere", "kereskedelem"]
        },
        {
          question: "Milyen tulajdonsággal kellett rendelkeznie az árupénznek?",
          answer: "értékálló, osztható és elfogadott",
          keywords: ["értékálló", "oszthat", "elfogad"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Árupénz", right: "Köztes áru" },
      { id: 2, left: "Értékállóság", right: "Stabil érték" },
      { id: 3, left: "Oszthatóság", right: "Méretezhetőség" },
      { id: 4, left: "Elfogadottság", right: "Érvényesség" },
      { id: 5, left: "Só", right: "Árupénz példa" }
    ],
    quiz: [
      {
        question: "Mi az árupénz?",
        options: [
          "Papírpénz",
          "Köztes áru a cserekereskedelemben",
          "Banki termék",
          "Modern pénz"
        ],
        correctAnswer: 1
      },
      {
        question: "Milyen tulajdonsággal kellett rendelkeznie az árupénznek?",
        options: [
          "Csak értékállónak",
          "Csak oszthatónak",
          "Értékálló, osztható és elfogadott",
          "Csak elfogadottnak"
        ],
        correctAnswer: 2
      }
    ]
  },

  // 10. oldal - Nemesfémek
  {
    id: 10,
    pageNumber: 10,
    reading: {
      title: "Nemesfémek - Árupénz vagy pénzhelyettesítő?",
      content: `Az emberiség fejlődése során, valószínűleg a 6.-7. század környékén jelentek meg az első nemesfém alapú fizetőeszközök, amiket már joggal nevezhetünk pénznek, fizető-eszköznek. Érméket öntöttek arany és ezüst anyagból és ezeket az akkori \"gazdasági\" szereplők elfogadták, ismerték a nemesfémek ritkaságát, értékét.

Bimetalizmus: az arany és az ezüst együtt töltötték be a pénz funkcióját. Monometalizmus: amikor egyetlen nemesfém (alapvetően az arany) töltötte be a pénz funkcióját.`,
      questions: [
        {
          question: "Mikor jelentek meg az első nemesfém alapú fizetőeszközök?",
          answer: "a 6-7. század környékén",
          keywords: ["6", "7", "század"]
        },
        {
          question: "Mi a bimetalizmus?",
          answer: "arany és ezüst együtt töltik be a pénz funkcióját",
          keywords: ["arany", "ezüst", "együtt", "két"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Nemesfém", right: "Arany, ezüst" },
      { id: 2, left: "Érme", right: "Öntött pénz" },
      { id: 3, left: "Bimetalizmus", right: "Két fém alapú" },
      { id: 4, left: "Monometalizmus", right: "Egy fém alapú" },
      { id: 5, left: "Ritkaság", right: "Értékalapítás" }
    ],
    quiz: [
      {
        question: "Mikor jelentek meg az első nemesfém alapú fizetőeszközök?",
        options: [
          "Az újkorban",
          "A 6-7. század környékén",
          "A múlt században",
          "Az ókorban"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi a bimetalizmus?",
        options: [
          "Egy fém alapú pénz",
          "Papír alapú pénz",
          "Arany és ezüst együtt töltik be a pénz funkcióját",
          "Modern pénz"
        ],
        correctAnswer: 2
      }
    ]
  },

  // 11. oldal - Pénzhelyettesítő elméletek
  {
    id: 11,
    pageNumber: 11,
    reading: {
      title: "Pénzhelyettesítő elméletek",
      content: `Sajnos az aranyból és ezüstből önthető \"pénzérmék\" mennyisége sem végtelen. A fejlődés és leginkább az iparosodás, óriási mértékű árukészletek, eszközök, ingatlanok, ingóságok cseréjének lebonyolítását tette szükségessé, amihez nem lehetett elégséges arany, ezüst pénzhelyettesítőt alkalmazni.

Currency elmélet: annyi pénzhelyettesítőt lehet, szabad forgalomba hozni, amennyi a mögöttes aranyfedezet. Banking elmélet: a pénzhelyettesítők kibocsátását nem a meglévő aranyfedezethez, hanem árufedezethez kell kötni.`,
      questions: [
        {
          question: "Miért volt szükség az aranyon túlmutató megoldásra?",
          answer: "az iparosodás óriási csereigényt teremtett",
          keywords: ["iparosodás", "csere", "óriási", "fejlődés"]
        },
        {
          question: "Mi a Currency elmélet lényege?",
          answer: "aranyfedezetű pénz",
          keywords: ["arany", "fedezet"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Currency", right: "Aranyfedezetű" },
      { id: 2, left: "Banking", right: "Árufedezetű" },
      { id: 3, left: "Fedezet", right: "Mögöttes érték" },
      { id: 4, left: "Iparosodás", right: "Gazdasági fejlődés" },
      { id: 5, left: "Kibocsátás", right: "Forgalomba hozás" }
    ],
    quiz: [
      {
        question: "Miért volt szükség az aranyon túlmutató megoldásra?",
        options: [
          "Mert elfogyott az arany",
          "Mert az iparosodás óriási csereigényt teremtett",
          "Mert drága volt",
          "Mert nehéz volt"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi a Currency elmélet lényege?",
        options: [
          "Árufedezetű pénz",
          "Aranyfedezetű pénz",
          "Szabadon kibocsátható pénz",
          "Papírpénz"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 12. oldal - Rendeleti pénz
  {
    id: 12,
    pageNumber: 12,
    reading: {
      title: "Rendeleti pénz",
      content: `Meg is érkeztünk a modern pénz, fizetőeszköz fogalmához. A rendeleti pénz olyan pénz, amit valaki kötelezően forgalomba helyező, tartó és onnan kivonható, átalakítható jelleggel bocsát a gazdaságba, nyilvánvalóan erre jogosultsága az állami szabályozásnak lehet.

A rendeleti pénz mögöttes értéke egyéb áruban, de akár nemesfémben is kifejezhető, amint azt az \"Elrendelő\" a gazdaságba vezeti, de meghatározás nélkül is forgalomba bocsájthatja. A rendeleti jelleggel forgalomba helyezett rendeleti pénz elfogadásának kötelező a jellege.`,
      questions: [
        {
          question: "Ki bocsáthat ki rendeleti pénzt?",
          answer: "állami szabályozás jogosultja",
          keywords: ["állam", "szabályoz��s", "jogosult"]
        },
        {
          question: "Milyen a rendeleti pénz elfogadása?",
          answer: "kötelező",
          keywords: ["kötelező"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Rendeleti pénz", right: "Modern pénz" },
      { id: 2, left: "Állami szabályozás", right: "Jogosultság" },
      { id: 3, left: "Forgalomba helyezés", right: "Kibocsátás" },
      { id: 4, left: "Kötelező elfogadás", right: "Törvényes fizetőeszköz" },
      { id: 5, left: "Nemzeti valuta", right: "Ország pénze" }
    ],
    quiz: [
      {
        question: "Ki bocsáthat ki rendeleti pénzt?",
        options: [
          "Bárki",
          "Bankok",
          "Állami szabályozás jogosultja",
          "Vállalatok"
        ],
        correctAnswer: 2
      },
      {
        question: "Milyen a rendeleti pénz elfogadása?",
        options: [
          "Önkéntes",
          "Kötelező",
          "Nem kötelező",
          "Opcionális"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 13. oldal - Cserekereskedelem
  {
    id: 13,
    pageNumber: 13,
    reading: {
      title: "Cserekereskedelem",
      content: `Az elkezdődött szakosodás körülbelül az Őskor végére és az Ókor elejére tehető. Az árucikkekből megtermelt többlet "útnak indult", hogy keresse a helyét olyan helyeken, ahol nem volt elég belőle.

A többlet árut kínálót eladónak, az áruhiányban szenvedőt vevőnek nevezzük. Az áru cserekereskedelmének kezdeteként az árukat közvetlenül cserélték más árukra, adott helyenként a kereslet-kínálat együtthatójából következő cserearány szerint.

Ennek a közvetlen cserekereskedelemnek azonban az volt a feltétele, hogy a kínált áru helyébe olyan árut kapjunk, amire nekünk is szükségünk van.`,
      questions: [
        {
          question: "Mikor kezdődött a szakosodás?",
          answer: "az Őskor végére és az Ókor elejére",
          keywords: ["Őskor", "Ókor", "vége", "eleje"]
        },
        {
          question: "Mit nevezünk eladónak?",
          answer: "a többlet árut kínálót",
          keywords: ["többlet", "áru", "kínáló", "kínál"]
        },
        {
          question: "Mit nevezünk vevőnek?",
          answer: "az áruhiányban szenvedőt",
          keywords: ["áruhiány", "hiány", "szenved"]
        },
        {
          question: "Mi volt a közvetlen cserekereskedelem feltétele?",
          answer: "olyan árut kapjunk, amire szükségünk van",
          keywords: ["szükség", "áru", "kap", "cseré"]
        },
        {
          question: "Mi alapján határozódott meg a cserearány?",
          answer: "kereslet-kínálat együtthatója",
          keywords: ["kereslet", "kínálat", "együttható"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Eladó", right: "Többlet árut kínáló" },
      { id: 2, left: "Vevő", right: "Áruhiányban szenvedő" },
      { id: 3, left: "Cserekereskedelem", right: "Árucsere" },
      { id: 4, left: "Szakosodás", right: "Specializáció" },
      { id: 5, left: "Többlet", right: "Felesleg" },
      { id: 6, left: "Kereslet", right: "Igény" },
      { id: 7, left: "Kínálat", right: "Ajánlat" },
      { id: 8, left: "Cserearány", right: "Csereérték" },
      { id: 9, left: "Árucikk", right: "Termék" },
      { id: 10, left: "Közvetlen csere", right: "Direkt csere" },
      { id: 11, left: "Őskor", right: "Ősi időszak" },
      { id: 12, left: "Ókor", right: "Ókori kor" },
      { id: 13, left: "Hiány", right: "Szűkösség" },
      { id: 14, left: "Felhalmozás", right: "Gyűjtés" },
      { id: 15, left: "Együttható", right: "Arány" }
    ],
    quiz: [
      {
        question: "Mikor kezdődött a szakosodás?",
        options: [
          "A középkorban",
          "Az Őskor végén és az Ókor elején",
          "Az újkorban",
          "A modernkorban"
        ],
        correctAnswer: 1
      },
      {
        question: "Kit nevezünk eladónak?",
        options: [
          "Aki pénzt ad",
          "A többlet árut kínálót",
          "Aki vásárol",
          "Aki szállít"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi a cserekereskedelem lényege?",
        options: [
          "Pénzzel fizetni",
          "Árukat közvetlenül cserélni",
          "Hitelezni",
          "Befektetni"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 14. oldal - A cserekereskedelem problémái
  {
    id: 14,
    pageNumber: 14,
    reading: {
      title: "A cserekereskedelem problémái",
      content: `A probléma a cserekereskedelem esetében azonban nem csak a kínált és cserébe elvárt áruk találkozásának problémája volt. Gondot jelentett az is, hogy azonos helyen és időben kellett lebonyolítani az üzletet, ami igencsak nehézkes volt és nem is mindig sikeres.

Nem beszélve arról, hogy az áruhiány és a kereslet időben nem feltétlenül kiszámíthatóan jelentkezett, egy-egy helyen túl sok felesleg adódott vagy rendkívül nagy hiány.

Azt sem szabad figyelmen kívül hagyni, hogy egy értékesebb árut egy másik értékesebb áruért cserébe nem feltétlenül lehetett az áru számának többszöröseként kifejezni.`,
      questions: [
        {
          question: "Milyen problémák voltak a cserekereskedelmben?",
          answer: "azonos helyen és időben kellett lebonyolítani",
          keywords: ["hely", "idő", "azonos", "együtt", "nehézkes"]
        },
        {
          question: "Mi volt kiszámíthatatlan?",
          answer: "az áruhiány és a kereslet",
          keywords: ["áruhiány", "kereslet", "kiszámíthatatlan"]
        },
        {
          question: "Mi adódott néhol túl sok?",
          answer: "felesleg",
          keywords: ["felesleg", "többlet"]
        },
        {
          question: "Mit nem lehetett számként kifejezni?",
          answer: "értékesebb áru cseréjét",
          keywords: ["értékesebb", "áru", "csere", "szám"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Probléma", right: "Gond" },
      { id: 2, left: "Nehézkes", right: "Bonyolult" },
      { id: 3, left: "Felesleg", right: "Többlet" },
      { id: 4, left: "Hiány", right: "Szűkösség" },
      { id: 5, left: "Kiszámíthatatlan", right: "Bizonytalan" },
      { id: 6, left: "Üzlet", right: "Tranzakció" },
      { id: 7, left: "Időben", right: "Időpontban" },
      { id: 8, left: "Értékesebb", right: "Drágább" },
      { id: 9, left: "Figyelmen kívül", right: "Elfelejteni" },
      { id: 10, left: "Többszörös", right: "Sokszoros" },
      { id: 11, left: "Lebonyolítani", right: "Végrehajtani" },
      { id: 12, left: "Sikeres", right: "Eredményes" },
      { id: 13, left: "Azonos", right: "Ugyanaz" },
      { id: 14, left: "Kifejezni", right: "Meghatározni" },
      { id: 15, left: "Csere", right: "Váltás" }
    ],
    quiz: [
      {
        question: "Mi volt a cserekereskedelem fő problémája?",
        options: [
          "Túl sok pénz volt",
          "Azonos helyen és időben kellett lebonyolítani",
          "Nem volt áru",
          "Túl drága volt"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi volt kiszámíthatatlan?",
        options: [
          "A pénz értéke",
          "Az áruhiány és a kereslet",
          "A kereskedők száma",
          "Az utak hossza"
        ],
        correctAnswer: 1
      },
      {
        question: "Mit nem lehetett jól kifejezni?",
        options: [
          "Az árak árfolyamát",
          "Értékesebb áruk cseréjét számban",
          "A távolságot",
          "Az időt"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 15. oldal - Árupénz
  {
    id: 15,
    pageNumber: 15,
    reading: {
      title: "Árupénz",
      content: `Az "áruért áruval fizetek" cserekereskedelem számtalan problémát hordozott és hamarosan igény jelentkezett arra, hogy a zökkenőmentesebb cserekereskedelem bonyolításához valamilyen árupénzzel lehessen fizetni.

Az árupénz egy olyan köztes áru az áruk cserekereskedelmében, amit a legkönnyebben volt lehetséges más árukra cserélni és amely áru értéke könnyen meghatározható volt más áruk viszonylatában.

Különböző helyeken különböző árukat használtak árupénzként: sót, gabonát, marhát, dohányt, kagylót és még számos más árut.`,
      questions: [
        {
          question: "Mi az árupénz?",
          answer: "köztes áru a cserekereskedelmében",
          keywords: ["köztes", "áru", "csere", "közvetítő"]
        },
        {
          question: "Miért volt szükség árupénzre?",
          answer: "zökkenőmentesebb cserekereskedelem",
          keywords: ["zökkenőmentes", "csere", "kereskedelem", "könnyebb"]
        },
        {
          question: "Mit használtak árupénzként?",
          answer: "sót, gabonát, marhát, dohányt, kagylót",
          keywords: ["só", "gabona", "marha", "dohány", "kagyló"]
        },
        {
          question: "Mi volt az árupénz fő jellemzője?",
          answer: "könnyen cserélhető más árukra",
          keywords: ["könnyen", "cserélhető", "áru"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Árupénz", right: "Köztes áru" },
      { id: 2, left: "Só", right: "Árupénz példa" },
      { id: 3, left: "Gabona", right: "Árupénz példa" },
      { id: 4, left: "Marha", right: "Állat árupénz" },
      { id: 5, left: "Kagyló", right: "Tengeri árupénz" },
      { id: 6, left: "Zökkenőmentes", right: "Gördülékeny" },
      { id: 7, left: "Köztes", right: "Közvetítő" },
      { id: 8, left: "Cserélhető", right: "Váltható" },
      { id: 9, left: "Meghatározható", right: "Számítható" },
      { id: 10, left: "Viszonylatában", right: "Összehasonlítva" },
      { id: 11, left: "Igény", right: "Szükség" },
      { id: 12, left: "Bonyolítás", right: "Lebonyolítás" },
      { id: 13, left: "Könnyen", right: "Egyszerűen" },
      { id: 14, left: "Számtalan", right: "Sok" },
      { id: 15, left: "Különböző", right: "Eltérő" }
    ],
    quiz: [
      {
        question: "Mi az árupénz?",
        options: [
          "Modern papírpénz",
          "Köztes áru a cserekereskedelmében",
          "Bankjegy",
          "Érme"
        ],
        correctAnswer: 1
      },
      {
        question: "Miért találták fel az árupénzt?",
        options: [
          "Díszítésre",
          "Zökkenőmentesebb kereskedelem miatt",
          "Gyűjtésre",
          "Szórakozásra"
        ],
        correctAnswer: 1
      },
      {
        question: "Melyik NEM volt árupénz?",
        options: [
          "Só",
          "Gabona",
          "Laptop",
          "Kagyló"
        ],
        correctAnswer: 2
      }
    ]
  },

  // 16. oldal - Fémpénz
  {
    id: 16,
    pageNumber: 16,
    reading: {
      title: "Fémpénz",
      content: `Az árupénzek azonban nem minden esetben voltak alkalmasak a fizetésre. Romlandóak voltak, nehézkesen szállíthatóak, tárolásuk gondot okozott.

A kereskedelem fejlődésével egyre inkább a nemesfémek kerültek előtérbe mint árupénz. Az arany és az ezüst könnyen osztható volt, nem romlott meg, tartós volt és viszonylag kis térfogatban nagy értéket képviselt.

A fémpénzek először súly szerint voltak használatban, majd később szabványos súlyú és formájú érmék kerültek forgalomba.`,
      questions: [
        {
          question: "Milyen problémák voltak az árupénzekkel?",
          answer: "romlandóak, nehézkesen szállíthatóak",
          keywords: ["romlandó", "nehéz", "szállít", "tárolás"]
        },
        {
          question: "Milyen nemesfémek kerültek előtérbe?",
          answer: "arany és ezüst",
          keywords: ["arany", "ezüst"]
        },
        {
          question: "Milyen előnyei voltak a nemesfémeknek?",
          answer: "könnyen osztható, nem romlott, tartós",
          keywords: ["osztható", "romlott", "tartós", "értékes"]
        },
        {
          question: "Hogyan voltak először használatban a fémpénzek?",
          answer: "súly szerint",
          keywords: ["súly", "szerinti", "mérték"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Fémpénz", right: "Nemesfém pénz" },
      { id: 2, left: "Arany", right: "Nemesfém" },
      { id: 3, left: "Ezüst", right: "Nemesfém" },
      { id: 4, left: "Romlandó", right: "Tönkremegy" },
      { id: 5, left: "Osztható", right: "Felosztható" },
      { id: 6, left: "Tartós", right: "Maradandó" },
      { id: 7, left: "Érme", right: "Pénzdarab" },
      { id: 8, left: "Szabványos", right: "Egységes" },
      { id: 9, left: "Súly", right: "Tömeg" },
      { id: 10, left: "Térfogat", right: "Űrtartalom" },
      { id: 11, left: "Szállítható", right: "Hordozható" },
      { id: 12, left: "Tárolás", right: "Megőrzés" },
      { id: 13, left: "Forgalom", right: "Használat" },
      { id: 14, left: "Értékes", right: "Drága" },
      { id: 15, left: "Fejlődés", right: "Haladás" }
    ],
    quiz: [
      {
        question: "Mi volt a probléma az árupénzekkel?",
        options: [
          "Túl értékesek voltak",
          "Romlandóak és nehezen szállíthatóak",
          "Túl kicsik voltak",
          "Túl könnyűek voltak"
        ],
        correctAnswer: 1
      },
      {
        question: "Milyen nemesfémek lettek előtérbe?",
        options: [
          "Vas és réz",
          "Arany és ezüst",
          "Ólom és cink",
          "Alumínium és titán"
        ],
        correctAnswer: 1
      },
      {
        question: "Hogyan használták először a fémpénzt?",
        options: [
          "Darabszám szerint",
          "Súly szerint",
          "Szín szerint",
          "Forma szerint"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 17. oldal - Papírpénz kialakulása
  {
    id: 17,
    pageNumber: 17,
    reading: {
      title: "Papírpénz kialakulása",
      content: `Az arany és ezüst mennyisége azonban véges volt, és a kereskedelem további növekedése új megoldást igényelt.

A papírpénz kialakulása szorosan kapcsolódik a bankok létrejöttéhez. Eredetileg a bankok őrizték az emberek aranyát és ezüstjét, cserébe a letétről szóló igazolást adtak.

Ezek az igazolások fokozatosan pénzként kezdtek forgalomban lenni, mivel bizalmat élveztek és sokkal kényelmesebb volt használni őket, mint magát az aranyat szállítani.`,
      questions: [
        {
          question: "Miért volt szükség új megoldásra?",
          answer: "az arany és ezüst véges volt",
          keywords: ["arany", "ezüst", "véges", "kevés", "mennyiség"]
        },
        {
          question: "Mihez kapcsolódik a papírpénz kialakulása?",
          answer: "a bankok létrejöttéhez",
          keywords: ["bank", "létrejött", "létrehozás"]
        },
        {
          question: "Mit csináltak eredetileg a bankok?",
          answer: "őrizték az emberek aranyát és ezüstjét",
          keywords: ["őriz", "arany", "ezüst", "letét"]
        },
        {
          question: "Miért használták az igazolásokat pénzként?",
          answer: "bizalmat élveztek és kényelmesebb volt",
          keywords: ["bizalom", "kényelmes", "könnyebb"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Papírpénz", right: "Bankjegy" },
      { id: 2, left: "Bank", right: "Pénzintézet" },
      { id: 3, left: "Letét", right: "Betét" },
      { id: 4, left: "Igazolás", right: "Bizonyítvány" },
      { id: 5, left: "Őrzés", right: "Megőrzés" },
      { id: 6, left: "Bizalom", right: "Hit" },
      { id: 7, left: "Kényelmes", right: "Praktikus" },
      { id: 8, left: "Véges", right: "Korlátozott" },
      { id: 9, left: "Forgalom", right: "Használat" },
      { id: 10, left: "Szállítani", right: "Fuvarozni" },
      { id: 11, left: "Növekedés", right: "Fejlődés" },
      { id: 12, left: "Mennyiség", right: "Mérték" },
      { id: 13, left: "Eredet", right: "Kezdet" },
      { id: 14, left: "Fokozatosan", right: "Lassanként" },
      { id: 15, left: "Létrejött", right: "Kialakult" }
    ],
    quiz: [
      {
        question: "Miért volt szükség új pénzrendszerre?",
        options: [
          "Mert unalmas volt az arany",
          "Mert az arany és ezüst véges volt",
          "Mert a papír olcsóbb",
          "Mert divatosabb volt"
        ],
        correctAnswer: 1
      },
      {
        question: "Mihez kapcsolódik a papírpénz létrejötte?",
        options: [
          "Az iskolákhoz",
          "A bankokhoz",
          "A templomokhoz",
          "A kastélyokhoz"
        ],
        correctAnswer: 1
      },
      {
        question: "Miért használták az igazolásokat pénzként?",
        options: [
          "Mert szépebbek voltak",
          "Mert bizalmat élveztek és kényelmesebbek",
          "Mert kötelező volt",
          "Mert színesebbek voltak"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 18. oldal - Bimetalizmus és Monometalizmus
  {
    id: 18,
    pageNumber: 18,
    reading: {
      title: "Bimetalizmus és Monometalizmus",
      content: `Bimetalizmus: az arany és az ezüst együtt töltötték be a pénz funkcióját.

Monometalizmus: amikor egyetlen nemesfém (alapvetően az arany) töltötte be a pénz funkcióját.

Miközben az arany és az ezüst - a nemesfémek - még a saját mivoltukban az árucsere áruit is képviselték, funkciójukban már inkább nevezhetőek pénzhelyettesítőnek, mert a nemesfém bázisú pénzkibocsátás mögöttes értéke évszázadokon keresztül, a modern pénz kialakulásáig az aranyhoz, aranytartalékhoz volt kötve.`,
      questions: [
        {
          question: "Mi a bimetalizmus?",
          answer: "arany és ezüst együtt töltik be a pénz funkcióját",
          keywords: ["arany", "ezüst", "együtt", "kettő"]
        },
        {
          question: "Mi a monometalizmus?",
          answer: "egyetlen nemesfém tölti be a pénz funkcióját",
          keywords: ["egyetlen", "egy", "nemesfém", "arany"]
        },
        {
          question: "Mihez volt kötve a nemesfém pénzkibocsátás?",
          answer: "aranyhoz, aranytartalékhoz",
          keywords: ["arany", "tartalék", "fedezet"]
        },
        {
          question: "Minek nevezhetőek a nemesfémek funkciójukban?",
          answer: "pénzhelyettesítőnek",
          keywords: ["pénzhelyettesítő", "helyettesítő"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Bimetalizmus", right: "Két fém rendszer" },
      { id: 2, left: "Monometalizmus", right: "Egy fém rendszer" },
      { id: 3, left: "Arany", right: "Magasabb értékű nemesfém" },
      { id: 4, left: "Ezüst", right: "Alacsonyabb értékű nemesfém" },
      { id: 5, left: "Pénzhelyettesítő", right: "Pénz funkció" },
      { id: 6, left: "Nemesfém", right: "Értékes fém" },
      { id: 7, left: "Aranytartalék", right: "Arany fedezet" },
      { id: 8, left: "Funkció", right: "Szerep" },
      { id: 9, left: "Mögöttes érték", right: "Fedezet" },
      { id: 10, left: "Kibocsátás", right: "Forgalomba hozás" },
      { id: 11, left: "Évszázadok", right: "Hosszú idő" },
      { id: 12, left: "Modern pénz", right: "Mai pénz" },
      { id: 13, left: "Árucsere", right: "Kereskedelem" },
      { id: 14, left: "Mivolt", right: "Tulajdonság" },
      { id: 15, left: "Bázis", right: "Alap" }
    ],
    quiz: [
      {
        question: "Mi a bimetalizmus?",
        options: [
          "Csak arany van használatban",
          "Arany és ezüst együtt van használatban",
          "Csak ezüst van használatban",
          "Papírpénz van használatban"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi a monometalizmus?",
        options: [
          "Két nemesfém van használatban",
          "Egyetlen nemesfém van használatban",
          "Sok nemesfém van használatban",
          "Nincs nemesfém használatban"
        ],
        correctAnswer: 1
      },
      {
        question: "Mihez volt kötve a nemesfém pénzkibocsátás?",
        options: [
          "Ezüsthöz",
          "Aranyhoz",
          "Rézhez",
          "Vashoz"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 19. oldal - Pénzelméletek
  {
    id: 19,
    pageNumber: 19,
    reading: {
      title: "Pénzelméletek",
      content: `Az átmenet részeként megjelent az árufedezet alapú pénzhelyettesítők kibocsátása is.

Currency elmélet: annyi pénzhelyettesítőt lehet, szabad forgalomba hozni, amennyi a mögöttes aranyfedezet.

Banking elmélet: a pénzhelyettesítők kibocsátását nem a meglévő aranyfedezethez, hanem árufedezethez kell kötni.`,
      questions: [
        {
          question: "Mi a Currency elmélet?",
          answer: "annyi pénzt lehet kibocsátani, amennyi az aranyfedezet",
          keywords: ["arany", "fedezet", "annyi", "mennyi"]
        },
        {
          question: "Mi a Banking elmélet?",
          answer: "árufedezethez kell kötni a kibocsátást",
          keywords: ["áru", "fedezet", "kötni"]
        },
        {
          question: "Mi jelent meg az átmenet részeként?",
          answer: "árufedezet alapú pénzhelyettesítők",
          keywords: ["árufedezet", "pénzhelyettesítő"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Currency elmélet", right: "Aranyfedezetű" },
      { id: 2, left: "Banking elmélet", right: "Árufedezetű" },
      { id: 3, left: "Aranyfedezet", right: "Arany bázis" },
      { id: 4, left: "Árufedezet", right: "Áru bázis" },
      { id: 5, left: "Pénzhelyettesítő", right: "Pénz funkció" },
      { id: 6, left: "Kibocsátás", right: "Forgalomba hozás" },
      { id: 7, left: "Mögöttes", right: "Háttér" },
      { id: 8, left: "Átmenet", right: "Váltás" },
      { id: 9, left: "Elmélet", right: "Koncepció" },
      { id: 10, left: "Forgalom", right: "Használat" },
      { id: 11, left: "Meglévő", right: "Rendelkezésre álló" },
      { id: 12, left: "Kötni", right: "Kapcsolni" },
      { id: 13, left: "Szabad", right: "Korlátlan" },
      { id: 14, left: "Alapú", right: "Bázisú" },
      { id: 15, left: "Részeként", right: "Elemként" }
    ],
    quiz: [
      {
        question: "Mi a Currency elmélet lényege?",
        options: [
          "Árufedezetű pénz",
          "Aranyfedezetű pénz",
          "Szabadon kibocsátható pénz",
          "Papírpénz"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi a Banking elmélet lényege?",
        options: [
          "Aranyfedezetű pénz",
          "Árufedezetű pénz",
          "Ezüstfedezetű pénz",
          "Fedezet nélküli pénz"
        ],
        correctAnswer: 1
      },
      {
        question: "Mihez kötötték a Currency elméletet?",
        options: [
          "Áruhoz",
          "Aranyhoz",
          "Ezüsthöz",
          "Sóhoz"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 20. oldal - Szabad pénz kora
  {
    id: 20,
    pageNumber: 20,
    reading: {
      title: "Szabad pénz kora",
      content: `Az Egyesült Államokban a szabályozás hiánya, vagy megengedő mivolta miatt, gyakorlatilag bárki "bocsáthatott ki" saját pénzt. Magánbankok, boltok, éttermek, de akár magánszemélyek is.

Ékes példája mindez annak, hogy a piac pénzelfogadó mechanizmusa képes arra, hogy bármilyen "eszközből" fizetőeszközt tudjon létrehozni.

Kijelenthető, hogy napjainkban nem létezhet határtalanul (szabályozatlanul) a "szabad pénz" fogalma.`,
      questions: [
        {
          question: "Hol volt szabad pénz kora?",
          answer: "az Egyesült Államokban",
          keywords: ["Egyesült Államok", "USA", "Amerika"]
        },
        {
          question: "Ki bocsáthatott ki pénzt?",
          answer: "gyakorlatilag bárki",
          keywords: ["bárki", "mindenki", "magán"]
        },
        {
          question: "Mit bizonyít a szabad pénz példája?",
          answer: "a piac képes fizetőeszközt létrehozni",
          keywords: ["piac", "fizetőeszköz", "létrehoz", "képes"]
        },
        {
          question: "Létezhet-e ma szabályozatlan szabad pénz?",
          answer: "nem",
          keywords: ["nem", "nincs"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Szabad pénz", right: "Szabályozatlan pénz" },
      { id: 2, left: "Egyesült Államok", right: "USA" },
      { id: 3, left: "Szabályozás hiánya", right: "Nincs szabály" },
      { id: 4, left: "Magánbank", right: "Privát bank" },
      { id: 5, left: "Magánszemély", right: "Egyén" },
      { id: 6, left: "Piac", right: "Gazdaság" },
      { id: 7, left: "Mechanizmus", right: "Rendszer" },
      { id: 8, left: "Fizetőeszköz", right: "Pénz" },
      { id: 9, left: "Létrehozni", right: "Megteremteni" },
      { id: 10, left: "Ékes példa", right: "Jó példa" },
      { id: 11, left: "Határtalanul", right: "Korlátlanul" },
      { id: 12, left: "Napjainkban", right: "Ma" },
      { id: 13, left: "Fogalom", right: "Koncepció" },
      { id: 14, left: "Mivolt", right: "Jelleg" },
      { id: 15, left: "Elfogadó", right: "Befogadó" }
    ],
    quiz: [
      {
        question: "Hol volt a szabad pénz kora?",
        options: [
          "Európában",
          "Az Egyesült Államokban",
          "Ázsiában",
          "Afrikában"
        ],
        correctAnswer: 1
      },
      {
        question: "Ki bocsáthatott ki pénzt a szabad pénz korában?",
        options: [
          "Csak a kormány",
          "Gyakorlatilag bárki",
          "Csak bankok",
          "Senki"
        ],
        correctAnswer: 1
      },
      {
        question: "Létezhet-e ma szabályozatlan szabad pénz?",
        options: [
          "Igen",
          "Nem",
          "Csak Amerikában",
          "Csak Európában"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 21. oldal - Rendeleti pénz
  {
    id: 21,
    pageNumber: 21,
    reading: {
      title: "Rendeleti pénz",
      content: `Meg is érkeztünk a modern pénz, fizetőeszköz fogalmához. A rendeleti pénz olyan pénz, amit valaki kötelezően forgalomba helyező, tartó és onnan kivonható, átalakítható jelleggel bocsát a gazdaságba.

A rendeleti pénz mögöttes értéke egyéb áruban, de akár nemesfémben is kifejezhető, de meghatározás nélkül is forgalomba bocsájthatja.

A legmegfelelőbb kifejezés: nemzeti valutaként kibocsájtott, állami garanciával bíró, nemzeti fizetési eszköz.`,
      questions: [
        {
          question: "Mi a rendeleti pénz?",
          answer: "kötelezően forgalomba helyezett modern pénz",
          keywords: ["kötelező", "forgalom", "modern", "pénz"]
        },
        {
          question: "Ki bocsáthat ki rendeleti pénzt?",
          answer: "állami garanciával bíró szerv",
          keywords: ["állam", "garancia", "nemzeti"]
        },
        {
          question: "Miben fejezhető ki a mögöttes értéke?",
          answer: "áruban vagy nemesfémben",
          keywords: ["áru", "nemesfém", "érték"]
        },
        {
          question: "Mi a legmegfelelőbb kifejezés rá?",
          answer: "nemzeti fizetési eszköz",
          keywords: ["nemzeti", "fizetési", "eszköz", "valuta"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Rendeleti pénz", right: "Modern pénz" },
      { id: 2, left: "Nemzeti valuta", right: "Ország pénze" },
      { id: 3, left: "Állami garancia", right: "Kormány biztosíték" },
      { id: 4, left: "Fizetési eszköz", right: "Pénz" },
      { id: 5, left: "Forgalomba helyezés", right: "Kibocsátás" },
      { id: 6, left: "Mögöttes érték", right: "Fedezet" },
      { id: 7, left: "Kötelező", right: "Kényszerű" },
      { id: 8, left: "Átalakítható", right: "Változtatható" },
      { id: 9, left: "Nemesfém", right: "Arany vagy ezüst" },
      { id: 10, left: "Gazdaság", right: "Piac" },
      { id: 11, left: "Meghatározás", right: "Definíció" },
      { id: 12, left: "Kivonható", right: "Eltávolítható" },
      { id: 13, left: "Jelleg", right: "Tulajdonság" },
      { id: 14, left: "Kifejezés", right: "Megnevezés" },
      { id: 15, left: "Megfelelő", right: "Alkalmas" }
    ],
    quiz: [
      {
        question: "Mi a rendeleti pénz?",
        options: [
          "Árupénz",
          "Modern, állami pénz",
          "Nemesfém",
          "Kagyló"
        ],
        correctAnswer: 1
      },
      {
        question: "Ki bocsáthat ki rendeleti pénzt?",
        options: [
          "Bárki",
          "Állami szerv",
          "Csak bankok",
          "Magánszemélyek"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi a rendeleti pénz legfontosabb jellemzője?",
        options: [
          "Romlékony",
          "Kötelező elfogadása",
          "Súlyos",
          "Színes"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 22. oldal - A modern pénz jelentősége
  {
    id: 22,
    pageNumber: 22,
    reading: {
      title: "A modern pénz jelentősége",
      content: `A gazdaság ismeri és elismeri a fizetőeszköz árukereskedelemben, szolgáltatásban résztvevő közvetítő szerepét, fizetési eszköz mivoltát.

A társadalmi szabályrendszer, a törvények szigorúan büntetik a fizetőeszköz hamisítását, eltulajdonítását, a pénzzel való visszaéléseket.

A modern pénz, a rendeleti pénz a közgazdaságtan alapvető fogalma. Nélküle nem létezik a mai modern közgazdaságtan, tudomány.`,
      questions: [
        {
          question: "Mit ismer el a gazdaság?",
          answer: "a fizetőeszköz közvetítő szerepét",
          keywords: ["fizetőeszköz", "közvetítő", "szerep"]
        },
        {
          question: "Mit büntetnek a törvények?",
          answer: "pénzhamisítást, eltulajdonítást, visszaéléseket",
          keywords: ["hamisítás", "eltulajdonít", "visszaél", "büntet"]
        },
        {
          question: "Mi a modern pénz a közgazdaságtanban?",
          answer: "alapvető fogalom",
          keywords: ["alapvető", "alap", "fogalom"]
        },
        {
          question: "Mi lenne a közgazdaságtan nélküle?",
          answer: "nem létezne",
          keywords: ["nem", "létezik", "nincs"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Modern pénz", right: "Rendeleti pénz" },
      { id: 2, left: "Közgazdaságtan", right: "Gazdaságtan" },
      { id: 3, left: "Hamisítás", right: "Utánzás" },
      { id: 4, left: "Eltulajdonítás", right: "Lopás" },
      { id: 5, left: "Visszaélés", right: "Csalás" },
      { id: 6, left: "Büntetés", right: "Szankció" },
      { id: 7, left: "Fizetőeszköz", right: "Pénz" },
      { id: 8, left: "Közvetítő", right: "Köztes" },
      { id: 9, left: "Árukereskedelem", right: "Kereskedés" },
      { id: 10, left: "Szolgáltatás", right: "Szerviz" },
      { id: 11, left: "Szabályrendszer", right: "Törvények" },
      { id: 12, left: "Társadalmi", right: "Szociális" },
      { id: 13, left: "Alapvető", right: "Alapfogalom" },
      { id: 14, left: "Tudomány", right: "Diszciplína" },
      { id: 15, left: "Mivolt", right: "Jelleg" }
    ],
    quiz: [
      {
        question: "Mit büntetnek szigorúan a törvények?",
        options: [
          "Pénz használatát",
          "Pénzhamisítást és visszaéléseket",
          "Pénz gyűjtését",
          "Pénz megtakarítását"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi a modern pénz a közgazdaságtanban?",
        options: [
          "Mellékfogalom",
          "Alapvető fogalom",
          "Felesleges fogalom",
          "Járulékos fogalom"
        ],
        correctAnswer: 1
      },
      {
        question: "Létezhet-e közgazdaságtan modern pénz nélkül?",
        options: [
          "Igen",
          "Nem",
          "Talán",
          "Csak részben"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 23. oldal - Készpénz és számlapénz
  {
    id: 23,
    pageNumber: 23,
    reading: {
      title: "Készpénz és számlapénz",
      content: `A modern pénz alapvetően egyrészről többféle fizikálisan megjelenő papírpénzformában (bankjegyben) és érmében jelentkezik, másrészről számlapénzben, ami gyakorlatilag virtuális, a bankszámlák közötti forgalom lebonyolítását szolgáló eszköz.

A modern pénznek tehát két alapvető formáját különböztetjük meg: a készpénzt és a számlapénzt.`,
      questions: [
        {
          question: "Milyen két formája van a modern pénznek?",
          answer: "készpénz és számlapénz",
          keywords: ["készpénz", "számlapénz", "két", "forma"]
        },
        {
          question: "Mi a készpénz?",
          answer: "fizikálisan megjelenő papírpénz és érme",
          keywords: ["fizikális", "papírpénz", "érme", "bankjegy"]
        },
        {
          question: "Mi a számlapénz?",
          answer: "virtuális, bankszámlák közötti forgalom eszköze",
          keywords: ["virtuális", "bankszámla", "forgalom"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Készpénz", right: "Fizikai pénz" },
      { id: 2, left: "Számlapénz", right: "Virtuális pénz" },
      { id: 3, left: "Bankjegy", right: "Papírpénz" },
      { id: 4, left: "Érme", right: "Fém pénz" },
      { id: 5, left: "Bankszámla", right: "Számla" },
      { id: 6, left: "Virtuális", right: "Digitális" },
      { id: 7, left: "Forgalom", right: "Kereskedés" },
      { id: 8, left: "Fizikálisan", right: "Testesen" },
      { id: 9, left: "Megjelenő", right: "Látható" },
      { id: 10, left: "Lebonyolítás", right: "Végrehajtás" },
      { id: 11, left: "Eszköz", right: "Módszer" },
      { id: 12, left: "Alapvetően", right: "Elsősorban" },
      { id: 13, left: "Különböztetni", right: "Megkülönböztetni" },
      { id: 14, left: "Forma", right: "Típus" },
      { id: 15, left: "Modern", right: "Mai" }
    ],
    quiz: [
      {
        question: "Hány alapvető formája van a modern pénznek?",
        options: [
          "Egy",
          "Kettő",
          "Három",
          "Négy"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi a számlapénz?",
        options: [
          "Fizikai pénz",
          "Virtuális, bankszámlák közötti pénz",
          "Aranyérme",
          "Papírpénz"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi tartozik a készpénzhez?",
        options: [
          "Csak bankszámla",
          "Papírpénz és érmék",
          "Csak kártya",
          "Csak arany"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 24. oldal - Magyar forint érmék
  {
    id: 24,
    pageNumber: 24,
    reading: {
      title: "Magyar forint érmék",
      content: `A ma forgalomban lévő, leginkább a váltást elősegítő készpénzérmék:

5 forintos
10 forintos
20 forintos
50 forintos
100 forintos
200 forintos`,
      questions: [
        {
          question: "Milyen címletű érmék vannak forgalomban?",
          answer: "5, 10, 20, 50, 100, 200 forintos",
          keywords: ["5", "10", "20", "50", "100", "200", "forint"]
        },
        {
          question: "Mit segítenek elő az érmék?",
          answer: "a váltást",
          keywords: ["váltás", "visszajáró"]
        },
        {
          question: "Mi a legnagyobb címletű érme?",
          answer: "200 forintos",
          keywords: ["200", "legnagyobb"]
        }
      ]
    },
    matching: [
      { id: 1, left: "5 forint", right: "Legkisebb érme" },
      { id: 2, left: "200 forint", right: "Legnagyobb érme" },
      { id: 3, left: "Érme", right: "Fém pénz" },
      { id: 4, left: "Váltás", right: "Visszajáró" },
      { id: 5, left: "Forgalom", right: "Használat" },
      { id: 6, left: "Készpénz", right: "Fizikai pénz" },
      { id: 7, left: "Címlet", right: "Értékegység" },
      { id: 8, left: "Forint", right: "Magyar valuta" },
      { id: 9, left: "Ma", right: "Jelenleg" },
      { id: 10, left: "Lévő", right: "Meglévő" },
      { id: 11, left: "Elősegítő", right: "Segítő" },
      { id: 12, left: "Leginkább", right: "Főleg" },
      { id: 13, left: "10 forint", right: "Kis érme" },
      { id: 14, left: "100 forint", right: "Nagy érme" },
      { id: 15, left: "50 forint", right: "Közepes érme" }
    ],
    quiz: [
      {
        question: "Mi a legnagyobb címletű forint érme?",
        options: [
          "100 Ft",
          "200 Ft",
          "500 Ft",
          "1000 Ft"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi a legkisebb címletű forint érme?",
        options: [
          "1 Ft",
          "5 Ft",
          "10 Ft",
          "20 Ft"
        ],
        correctAnswer: 1
      },
      {
        question: "Mit segítenek elő az érmék?",
        options: [
          "Megtakarítást",
          "Váltást",
          "Beruházást",
          "Hitelt"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 25. oldal - Magyar forint bankjegyek
  {
    id: 25,
    pageNumber: 25,
    reading: {
      title: "Magyar forint bankjegyek",
      content: `A jelenben készpénzként létező papírpénzek, bankjegyek:

500 forintos
1000 forintos
2000 forintos
5000 forintos
10000 forintos
20000 forintos

A pénzhamisítást a törvény szigorúan bünteti, az a társadalomra kiemelten káros, megzavarja a gazdaság szereplőinek bizalmát, ami tömeges méretekben akár válsághelyzetet is indukálhat!`,
      questions: [
        {
          question: "Milyen címletű bankjegyek vannak forgalomban?",
          answer: "500, 1000, 2000, 5000, 10000, 20000 forintos",
          keywords: ["500", "1000", "2000", "5000", "10000", "20000"]
        },
        {
          question: "Hogyan bünteti a törvény a pénzhamisítást?",
          answer: "szigorúan",
          keywords: ["szigorú", "szigorúan", "keményen"]
        },
        {
          question: "Miért káros a pénzhamisítás?",
          answer: "megzavarja a gazdaság szereplőinek bizalmát",
          keywords: ["bizalom", "zavar", "káros", "gazdaság"]
        },
        {
          question: "Mi a legnagyobb bankjegy címlet?",
          answer: "20000 forint",
          keywords: ["20000", "legnagyobb"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Bankjegy", right: "Papírpénz" },
      { id: 2, left: "500 Ft", right: "Legkisebb bankjegy" },
      { id: 3, left: "20000 Ft", right: "Legnagyobb bankjegy" },
      { id: 4, left: "Pénzhamisítás", right: "Pénz utánzása" },
      { id: 5, left: "Szigorú büntetés", right: "Kemény szankció" },
      { id: 6, left: "Káros", right: "Ártalmas" },
      { id: 7, left: "Bizalom", right: "Megbízhatóság" },
      { id: 8, left: "Válsághelyzet", right: "Krízis" },
      { id: 9, left: "Tömeges", right: "Nagy számú" },
      { id: 10, left: "Indukál", right: "Előidéz" },
      { id: 11, left: "Gazdaság", right: "Piac" },
      { id: 12, left: "Szereplő", right: "Résztvevő" },
      { id: 13, left: "Megzavar", right: "Felbillent" },
      { id: 14, left: "Kiemelten", right: "Különösen" },
      { id: 15, left: "Címlet", right: "Értékegység" }
    ],
    quiz: [
      {
        question: "Mi a legnagyobb magyar forint bankjegy?",
        options: [
          "10000 Ft",
          "20000 Ft",
          "50000 Ft",
          "100000 Ft"
        ],
        correctAnswer: 1
      },
      {
        question: "Hogyan bünteti a törvény a pénzhamisítást?",
        options: [
          "Enyhén",
          "Szigorúan",
          "Nem bünteti",
          "Ritkán"
        ],
        correctAnswer: 1
      },
      {
        question: "Miért veszélyes a pénzhamisítás?",
        options: [
          "Mert színes",
          "Mert megzavarja a bizalmat",
          "Mert könnyű",
          "Mert gyors"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 26. oldal - A pénz értéket képvisel
  {
    id: 26,
    pageNumber: 26,
    reading: {
      title: "A pénz értéket képvisel",
      content: `A pénz szerepe és egyben a tőle elvárható alapvető feladata, hogy értéket fejezzen ki, benne számítottan meghatározható legyen egy áru, termék, szolgáltatás ára.

Minden értéket képviselő jószág általában kifejezhető pénz alapú értékként. Mégis fontos megjegyezni, hogy azonos vagy egymásra jelentős mértékben hasonlító áruk ára is különbözhet.

Egy kiló fehér kenyér ára különböző lehet a sok-sok pékségben, áruházban, ahol árulják őket.`,
      questions: [
        {
          question: "Mi a pénz alapvető feladata?",
          answer: "értéket kifejezni",
          keywords: ["érték", "kifejez", "meghatároz"]
        },
        {
          question: "Mit határoz meg a pénz?",
          answer: "áru, termék, szolgáltatás árát",
          keywords: ["ár", "áru", "termék", "szolgáltatás"]
        },
        {
          question: "Különbözhet-e azonos áruk ára?",
          answer: "igen",
          keywords: ["igen", "különbözhet", "más"]
        },
        {
          question: "Miben fejezhető ki az értéket képviselő jószág?",
          answer: "pénz alapú értékként",
          keywords: ["pénz", "érték", "alapú"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Érték", right: "Ár" },
      { id: 2, left: "Pénz", right: "Fizetőeszköz" },
      { id: 3, left: "Áru", right: "Termék" },
      { id: 4, left: "Szolgáltatás", right: "Szerviz" },
      { id: 5, left: "Alapvető feladat", right: "Fő funkció" },
      { id: 6, left: "Kifejezni", right: "Meghatározni" },
      { id: 7, left: "Jószág", right: "Dolog" },
      { id: 8, left: "Képvisel", right: "Jelent" },
      { id: 9, left: "Azonos", right: "Ugyanaz" },
      { id: 10, left: "Hasonlító", right: "Hasonló" },
      { id: 11, left: "Különbözik", right: "Eltér" },
      { id: 12, left: "Pékség", right: "Pékműhely" },
      { id: 13, left: "Áruház", right: "Bolt" },
      { id: 14, left: "Meghatározható", right: "Számítható" },
      { id: 15, left: "Elvárható", right: "Kívánatos" }
    ],
    quiz: [
      {
        question: "Mi a pénz alapvető feladata?",
        options: [
          "Díszítés",
          "Értéket kifejezni",
          "Gyűjtés",
          "Dekoráció"
        ],
        correctAnswer: 1
      },
      {
        question: "Különbözhet-e azonos áruk ára különböző helyeken?",
        options: [
          "Nem",
          "Igen",
          "Soha",
          "Tilos"
        ],
        correctAnswer: 1
      },
      {
        question: "Mit határoz meg a pénz?",
        options: [
          "Csak színeket",
          "Áruk, szolgáltatások árát",
          "Csak formákat",
          "Csak méreteket"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 27. oldal - Az érték fogalma
  {
    id: 27,
    pageNumber: 27,
    reading: {
      title: "Az érték fogalma",
      content: `Az érték: egy anyagi, szellemi tulajdonsággal bíró dolog minősége, hasznossága, ami miatt az adott dolgot megszerezni, tartani, birtokolni érdemes, valamint az adott dolog meghatározható ára.

Ez az a két dolog, ami összessége értéket képvisel és amely értéket pénzben fejezhetünk ki.

És akkor újra leírva, mert meghatározó jelentőségű, hogy az életben nem minden érték fejezhető ki pénzben. Léteznek eszmei értékkel, pénzben nem kifejezhetően létező értékek is. Szeretet, szabadság, egészség és még számos dologi és eszmei érték pénzben történő kifejezése, csupán szubjektív alapú, képzeleti együttható.`,
      questions: [
        {
          question: "Mi az érték?",
          answer: "dolog minősége, hasznossága és ára",
          keywords: ["minőség", "hasznosság", "ár", "tulajdonság"]
        },
        {
          question: "Minden érték kifejezhető pénzben?",
          answer: "nem",
          keywords: ["nem", "nincs"]
        },
        {
          question: "Milyen értékek nem fejezhetők ki pénzben?",
          answer: "eszmei értékek, szeretet, szabadság, egészség",
          keywords: ["eszmei", "szeretet", "szabadság", "egészség"]
        },
        {
          question: "Mi az érték két összetevője?",
          answer: "minőség, hasznosság és meghatározható ár",
          keywords: ["minőség", "hasznosság", "ár"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Érték", right: "Minőség és ár" },
      { id: 2, left: "Anyagi", right: "Fizikai" },
      { id: 3, left: "Szellemi", right: "Intellektuális" },
      { id: 4, left: "Hasznosság", right: "Használhatóság" },
      { id: 5, left: "Minőség", right: "Kvalitás" },
      { id: 6, left: "Eszmei", right: "Ideális" },
      { id: 7, left: "Szeretet", right: "Érzelem" },
      { id: 8, left: "Szabadság", right: "Függetlenség" },
      { id: 9, left: "Egészség", right: "Jólét" },
      { id: 10, left: "Szubjektív", right: "Személyes" },
      { id: 11, left: "Képzeleti", right: "Elképzelt" },
      { id: 12, left: "Együttható", right: "Faktor" },
      { id: 13, left: "Megszerezni", right: "Elnyerni" },
      { id: 14, left: "Birtokolni", right: "Tulajdonolni" },
      { id: 15, left: "Összesség", right: "Teljesség" }
    ],
    quiz: [
      {
        question: "Mi az érték fogalma?",
        options: [
          "Csak az ár",
          "Minőség, hasznosság és ár",
          "Csak a szín",
          "Csak a méret"
        ],
        correctAnswer: 1
      },
      {
        question: "Minden érték kifejezhető pénzben?",
        options: [
          "Igen, minden",
          "Nem, vannak eszmei értékek is",
          "Mindig",
          "Sosem"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi NEM fejezhető ki pénzben?",
        options: [
          "Autó ára",
          "Szeretet, szabadság, egészség",
          "Ház ára",
          "Étel ára"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 28. oldal - Kartellezés és árverseny
  {
    id: 28,
    pageNumber: 28,
    reading: {
      title: "Kartellezés és árverseny",
      content: `Egy kiló fehér kenyér ára különböző lehet a sok-sok pékségben, áruházban, ahol árulják őket. Nincsen rögzített ár és nem is lehet, mivel a piacgazdaság alapja, hogy az áruk, termékek, szolgáltatások értékének meghatározása versenyhelyzetet teremtsen a termelők, szolgáltatók között.

A javak árának versenye a piacgazdaság meghatározó alapfeltétele. Az árazás, piacfelosztás előre eltervezett versenytársak közötti kölcsönös rögzítését kartellezésnek nevezzük, amit a hatályos törvények szigorúan büntetnek.`,
      questions: [
        {
          question: "Mi a piacgazdaság alapja?",
          answer: "az áruk értékének meghatározása versenyhelyzetet teremt",
          keywords: ["verseny", "érték", "meghatározás", "árak"]
        },
        {
          question: "Mi a kartellezés?",
          answer: "előre eltervezett árrögzítés versenytársak között",
          keywords: ["ár", "rögzít", "versenytárs", "előre"]
        },
        {
          question: "Hogyan bünteti a törvény a kartellezést?",
          answer: "szigorúan",
          keywords: ["szigorú", "büntet"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Kartellezés", right: "Tilos árrögzítés" },
      { id: 2, left: "Piacgazdaság", right: "Szabad verseny" },
      { id: 3, left: "Versenyhelyzet", right: "Konkurencia" },
      { id: 4, left: "Árrögzítés", right: "Ár meghatározás" },
      { id: 5, left: "Versenytárs", right: "Konkurens" },
      { id: 6, left: "Szigorú büntetés", right: "Kemény szankció" },
      { id: 7, left: "Piacfelosztás", right: "Terület felosztás" },
      { id: 8, left: "Kölcsönös", right: "Közös" },
      { id: 9, left: "Alapfeltétel", right: "Alapkövetelmény" },
      { id: 10, left: "Előre eltervezett", right: "Megtervezett" },
      { id: 11, left: "Törvény", right: "Jogszabály" },
      { id: 12, left: "Termelő", right: "Gyártó" },
      { id: 13, left: "Szolgáltató", right: "Szolgáltatás nyújtó" },
      { id: 14, left: "Jószág", right: "Termék" },
      { id: 15, left: "Rögzítés", right: "Fixálás" }
    ],
    quiz: [
      {
        question: "Mi a piacgazdaság alapfeltétele?",
        options: [
          "Árrögzítés",
          "Árverseny",
          "Kartellezés",
          "Monopólium"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi a kartellezés?",
        options: [
          "Szabad verseny",
          "Előre eltervezett árrögzítés",
          "Árcsökkentés",
          "Marketing kampány"
        ],
        correctAnswer: 1
      },
      {
        question: "Hogyan bünteti a törvény a kartellezést?",
        options: [
          "Nem bünteti",
          "Szigorúan bünteti",
          "Enyhén bünteti",
          "Támogatja"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 29. oldal - A pénz mint fizetési és forgalmi eszköz
  {
    id: 29,
    pageNumber: 29,
    reading: {
      title: "A pénz mint fizetési és forgalmi eszköz",
      content: `Sokszor válik eggyé a fizetési eszköz és a forgalmi eszköz kifejezés. A mai korban a számtalan láncolatú vásárlási és eladási igény teljesen összemosta e két funkció megkülönböztetését.

Fizetési eszköz: a pénz és az áru eltérő időben, ellentétes irányban mozog.

Forgalmi eszköz: az áruforgalomban a tranzakciók a pénz segítségével bonyolódnak le, a pénz és az áru azonos időben, de ellentétesen mozog.`,
      questions: [
        {
          question: "Mi a fizetési eszköz?",
          answer: "pénz és áru eltérő időben mozog",
          keywords: ["pénz", "áru", "eltérő", "idő"]
        },
        {
          question: "Mi a forgalmi eszköz?",
          answer: "pénz és áru azonos időben mozog",
          keywords: ["pénz", "áru", "azonos", "idő"]
        },
        {
          question: "Mit mosott össze a mai kor?",
          answer: "a két funkció megkülönböztetését",
          keywords: ["funkció", "megkülönböztet", "kettő"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Fizetési eszköz", right: "Eltérő időben mozog" },
      { id: 2, left: "Forgalmi eszköz", right: "Azonos időben mozog" },
      { id: 3, left: "Tranzakció", right: "Ügylet" },
      { id: 4, left: "Áruforgalom", right: "Kereskedelem" },
      { id: 5, left: "Láncolatú", right: "Sorozatos" },
      { id: 6, left: "Vásárlási igény", right: "Vételi szándék" },
      { id: 7, left: "Eltérő", right: "Különböző" },
      { id: 8, left: "Ellentétes", right: "Fordított" },
      { id: 9, left: "Mozog", right: "Cserél gazdát" },
      { id: 10, left: "Funkció", right: "Szerep" },
      { id: 11, left: "Megkülönböztetés", right: "Differenciálás" },
      { id: 12, left: "Összemosta", right: "Összekeverte" },
      { id: 13, left: "Azonos", right: "Ugyanaz" },
      { id: 14, left: "Kifejezés", right: "Megnevezés" },
      { id: 15, left: "Segítségével", right: "Révén" }
    ],
    quiz: [
      {
        question: "Mi a fizetési eszköz jellemzője?",
        options: [
          "Pénz és áru azonos időben mozog",
          "Pénz és áru eltérő időben mozog",
          "Nincs mozgás",
          "Csak a pénz mozog"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi a forgalmi eszköz jellemzője?",
        options: [
          "Pénz és áru eltérő időben mozog",
          "Pénz és áru azonos időben mozog",
          "Nincs mozgás",
          "Csak az áru mozog"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi mosta össze a két funkciót?",
        options: [
          "A törvény",
          "A mai kor",
          "A банки",
          "Az államok"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 30. oldal - A pénz mint felhalmozási eszköz
  {
    id: 30,
    pageNumber: 30,
    reading: {
      title: "A pénz mint felhalmozási eszköz",
      content: `A pénz szerepe nem csak abban merül ki, hogy azonnali vásárlásra fordíthatjuk. A pénz felhalmozási eszköz is, ráadásul a leglikvidebb vagyontárgy.

A pénz feletti rendelkezés érték, a rendelkezési jog átadása pedig egy jövőbeni visszavárt, megtérüléssel, haszonnal gyarapodó pénz reménye miatt indokolt.

A pénzt a lakosság jelentős része, nem csak befektetési célból tartja, hanem a biztonság megléte miatt is.`,
      questions: [
        {
          question: "Milyen vagyontárgy a pénz?",
          answer: "a leglikvidebb",
          keywords: ["leglikvidebb", "likvid"]
        },
        {
          question: "Miért adják át a pénz rendelkezési jogát?",
          answer: "jövőbeni haszontól várva",
          keywords: ["jövő", "haszon", "megtérülés"]
        },
        {
          question: "Miért tartja a lakosság a pénzt?",
          answer: "befektetési célból és biztonságért",
          keywords: ["befektetés", "biztonság"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Felhalmozási eszköz", right: "Megtakarítási forma" },
      { id: 2, left: "Leglikvidebb", right: "Legkönnyebben mozgósítható" },
      { id: 3, left: "Vagyontárgy", right: "Vagyon elem" },
      { id: 4, left: "Rendelkezési jog", right: "Tulajdonjog" },
      { id: 5, left: "Átadás", right: "Transzfer" },
      { id: 6, left: "Jövőbeni", right: "Későbbi" },
      { id: 7, left: "Megtérülés", right: "Hozam" },
      { id: 8, left: "Haszon", right: "Profit" },
      { id: 9, left: "Gyarapodó", right: "Növekvő" },
      { id: 10, left: "Befektetés", right: "Invesztíció" },
      { id: 11, left: "Biztonság", right: "Védelem" },
      { id: 12, left: "Lakosság", right: "Népesség" },
      { id: 13, left: "Jelentős rész", right: "Nagy hányad" },
      { id: 14, left: "Indokolt", right: "Jogos" },
      { id: 15, left: "Reményében", right: "Elvárásával" }
    ],
    quiz: [
      {
        question: "Milyen vagyontárgy a pénz?",
        options: [
          "A legkevésbé likvid",
          "A leglikvidebb",
          "Közepesen likvid",
          "Nem likvid"
        ],
        correctAnswer: 1
      },
      {
        question: "Mire használható a pénz?",
        options: [
          "Csak vásárlásra",
          "Vásárlásra és felhalmozásra",
          "Csak felhalmozásra",
          "Semmire"
        ],
        correctAnswer: 1
      },
      {
        question: "Miért tartják a pénzt biztonságként?",
        options: [
          "Mert színes",
          "Mert likvid és megőrizhető",
          "Mert nehéz",
          "Mert papírból van"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 31. oldal - Gazdag halottak teória
  {
    id: 31,
    pageNumber: 31,
    reading: {
      title: "Gazdag halottak teória",
      content: `A "gazdag halottak" teória. A szerző véleménye az, hogy a jelenkor tehetős emberének többsége egy életen át vagyont halmozó, de a halmozott vagyon csak kisebb részét a szükségleteinek kielégítésére fordító ember.

A teória lényege az, hogy becsületes, jól fizető munkabérből is teljesíthető a legtöbb valós és általánosan elvárható szükséglet kielégítése, azok meglétéhez nem feltétlenül szükséges a vagyonhalmozás.`,
      questions: [
        {
          question: "Mi a gazdag halottak teória?",
          answer: "vagyont halmoznak, de keveset használnak",
          keywords: ["vagyon", "halmoz", "kevés", "használ"]
        },
        {
          question: "Miből teljesíthető a szükségletek kielégítése?",
          answer: "becsületes munkabérből",
          keywords: ["munkabér", "becsületes", "munka"]
        },
        {
          question: "Szükséges-e a vagyonhalmozás?",
          answer: "nem feltétlenül szükséges",
          keywords: ["nem", "feltétlenül", "szükséges"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Gazdag halottak", right: "Felhalmozók teória" },
      { id: 2, left: "Vagyonhalmozás", right: "Vagyon gyűjtés" },
      { id: 3, left: "Tehetős", right: "Gazdag" },
      { id: 4, left: "Munkabér", right: "Fizetés" },
      { id: 5, left: "Szükséglet", right: "Igény" },
      { id: 6, left: "Kielégítés", right: "Teljesítés" },
      { id: 7, left: "Becsületes", right: "Tisztességes" },
      { id: 8, left: "Jól fizető", right: "Magas bérű" },
      { id: 9, left: "Valós", right: "Tényleges" },
      { id: 10, left: "Általánosan elvárható", right: "Normális" },
      { id: 11, left: "Megléte", right: "Létezés" },
      { id: 12, left: "Feltétlenül", right: "Mindenképpen" },
      { id: 13, left: "Lényeg", right: "Esszencia" },
      { id: 14, left: "Életen át", right: "Egész életen" },
      { id: 15, left: "Kisebb rész", right: "Töredék" }
    ],
    quiz: [
      {
        question: "Mi a gazdag halottak teória lényege?",
        options: [
          "Mindig költeni kell",
          "Vagyont halmoznak, de keveset használnak",
          "Nincs szükség munkára",
          "Mindenki gazdag"
        ],
        correctAnswer: 1
      },
      {
        question: "Miből teljesíthető a szükségletek kielégítése?",
        options: [
          "Csak vagyonból",
          "Munkabérből",
          "Kölcsönből",
          "Ajándékból"
        ],
        correctAnswer: 1
      },
      {
        question: "Szükséges-e mindenképpen a vagyonhalmozás?",
        options: [
          "Igen, mindenképpen",
          "Nem feltétlenül",
          "Mindig",
          "Soha"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 32. oldal - Mire való a pénz?
  {
    id: 32,
    pageNumber: 32,
    reading: {
      title: "Mire való a pénz?",
      content: `A pénz rengeteg mindenre való. Az egyén szempontjából azt mondjuk, hogy a pénz, a szükségleteink kielégítésére szolgál.

A "szükséglet" szó azonban rengeteg mindent jelent és értelmezésekor a legfontosabb tisztázni, hogy minden ember szükséglete - az alapszükségleteken kívül - változó és eltérő lehet.

Az emberiség fejlődésének nagyon fontos velejárója a szükségletek, igények változása.`,
      questions: [
        {
          question: "Mire való a pénz?",
          answer: "szükségleteink kielégítésére",
          keywords: ["szükséglet", "kielégít"]
        },
        {
          question: "Milyenek az emberek szükségletei?",
          answer: "változó és eltérő",
          keywords: ["változó", "eltérő", "különböző"]
        },
        {
          question: "Mi a fejlődés velejárója?",
          answer: "a szükségletek változása",
          keywords: ["szükséglet", "változás", "igény"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Szükséglet", right: "Igény" },
      { id: 2, left: "Kielégítés", right: "Teljesítés" },
      { id: 3, left: "Változó", right: "Dinamikus" },
      { id: 4, left: "Eltérő", right: "Különböző" },
      { id: 5, left: "Alapszükséglet", right: "Elsődleges igény" },
      { id: 6, left: "Fejlődés", right: "Evolúció" },
      { id: 7, left: "Velejáró", right: "Kísérő jelenség" },
      { id: 8, left: "Értelmezés", right: "Magyarázat" },
      { id: 9, left: "Tisztázni", right: "Megmagyarázni" },
      { id: 10, left: "Rengeteg", right: "Sok" },
      { id: 11, left: "Egyén", right: "Személy" },
      { id: 12, left: "Szempontjából", right: "Nézőpontjából" },
      { id: 13, left: "Emberiség", right: "Emberi faj" },
      { id: 14, left: "Fontos", right: "Lényeges" },
      { id: 15, left: "Szolgál", right: "Használható" }
    ],
    quiz: [
      {
        question: "Mire szolgál a pénz?",
        options: [
          "Csak dísznek",
          "Szükségletek kielégítésére",
          "Csak gyűjtésre",
          "Semmire"
        ],
        correctAnswer: 1
      },
      {
        question: "Milyenek az emberek szükségletei?",
        options: [
          "Mindenkinél ugyanazok",
          "Változók és eltérőek",
          "Csak alapvetőek",
          "Nincsenek"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi jellemzi a fejlődést?",
        options: [
          "Változatlanság",
          "Szükségletek változása",
          "Nincs változás",
          "Csökkenés"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 33. oldal - Alapvető szükségletek
  {
    id: 33,
    pageNumber: 33,
    reading: {
      title: "Alapvető szükségletek",
      content: `De mit is takar az a kifejezés, hogy alapvető szükséglet? A szükséglet hiány, amely hiány megszüntetésére törekszik az ember.

Érdemes megismerni a Maslow piramist, ami megfelelően csoportosítja azokat a szükségleteket, amik az embert általánosan motiválják.

Étel, víz (ital) olyan szükségletek, amiért fizetünk, ráadásul nem is keveset. Nem beszélve a "menedék" szóhasználatban megfogalmazott lakás, ház értékéről.`,
      questions: [
        {
          question: "Mi az alapvető szükséglet?",
          answer: "hiány, amit meg akarunk szüntetni",
          keywords: ["hiány", "megszüntet"]
        },
        {
          question: "Mi a Maslow piramis?",
          answer: "szükségletek csoportosítása",
          keywords: ["szükséglet", "csoport", "piramis"]
        },
        {
          question: "Milyen alapszükségletek vannak?",
          answer: "étel, víz, lakás",
          keywords: ["étel", "víz", "lakás", "menedék"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Alapvető szükséglet", right: "Elsődleges igény" },
      { id: 2, left: "Maslow piramis", right: "Szükséglet hierarchia" },
      { id: 3, left: "Hiány", right: "Szükség" },
      { id: 4, left: "Megszüntetés", right: "Eltüntetés" },
      { id: 5, left: "Étel", right: "Táplálék" },
      { id: 6, left: "Víz", right: "Ital" },
      { id: 7, left: "Menedék", right: "Lakóhely" },
      { id: 8, left: "Lakás", right: "Otthon" },
      { id: 9, left: "Motiváció", right: "Ösztönzés" },
      { id: 10, left: "Csoportosítás", right: "Kategorizálás" },
      { id: 11, left: "Általánosan", right: "Közösen" },
      { id: 12, left: "Törekszik", right: "Akar" },
      { id: 13, left: "Megfelelően", right: "Helyesen" },
      { id: 14, left: "Értékéről", right: "Áráról" },
      { id: 15, left: "Kifejezés", right: "Megnevezés" }
    ],
    quiz: [
      {
        question: "Mi a szükséglet?",
        options: [
          "Túlkínálat",
          "Hiány",
          "Felesleg",
          "Pazarlás"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi a Maslow piramis?",
        options: [
          "Építmény",
          "Szükségletek hierarchiája",
          "Pénzügyi eszköz",
          "Épület"
        ],
        correctAnswer: 1
      },
      {
        question: "Milyen alapszükséglet az étel?",
        options: [
          "Nem szükséglet",
          "Alapvető szükséglet",
          "Luxus",
          "Opcionális"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 34. oldal - Életminőség
  {
    id: 34,
    pageNumber: 34,
    reading: {
      title: "Életminőség",
      content: `Az alapvető szükségleteink kielégítése emberi minimum. Nem jelenti azt, hogy egy teljes, boldog életet le lehetne élni csupán azzal, hogy biztosítjuk az alapvető szükségleteink kielégítését.

Az életminőség közvetlen kapcsolatban állhat az életszínvonallal, de közel sem rokonértelmű szavak. Az életszínvonal meghatározója az anyagi jólét, míg az életminőség alapja szintén lehet az anyagi jólét, de szélesebb fogalomkört ötvöz.`,
      questions: [
        {
          question: "Mi az alapszükségletek kielégítése?",
          answer: "emberi minimum",
          keywords: ["minimum", "alapvető"]
        },
        {
          question: "Különbözik-e az életminőség és életszínvonal?",
          answer: "igen, nem rokonértelmű",
          keywords: ["igen", "különböző", "nem rokon"]
        },
        {
          question: "Mi az életszínvonal meghatározója?",
          answer: "anyagi jólét",
          keywords: ["anyag", "jólét"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Életminőség", right: "Élet színvonala" },
      { id: 2, left: "Életszínvonal", right: "Anyagi helyzet" },
      { id: 3, left: "Emberi minimum", right: "Alapvető szint" },
      { id: 4, left: "Anyagi jólét", right: "Gazdagság" },
      { id: 5, left: "Rokonértelmű", right: "Hasonló jelentésű" },
      { id: 6, left: "Szélesebb", right: "Tágabb" },
      { id: 7, left: "Fogalomkör", right: "Terület" },
      { id: 8, left: "Ötvöz", right: "Egyesít" },
      { id: 9, left: "Közvetlen kapcsolat", right: "Direkt összefüggés" },
      { id: 10, left: "Meghatározó", right: "Megadó" },
      { id: 11, left: "Boldog élet", right: "Jó élet" },
      { id: 12, left: "Biztosítás", right: "Garantálás" },
      { id: 13, left: "Teljes", right: "Komplett" },
      { id: 14, left: "Alapja", right: "Fundamentuma" },
      { id: 15, left: "Jelenti", right: "Azt jelenti" }
    ],
    quiz: [
      {
        question: "Mi az alapszükségletek kielégítése?",
        options: [
          "Maximális szint",
          "Emberi minimum",
          "Luxus",
          "Felesleges"
        ],
        correctAnswer: 1
      },
      {
        question: "Rokonértelmű-e az életminőség és életszínvonal?",
        options: [
          "Igen, teljesen",
          "Nem, különbözőek",
          "Azonosak",
          "Mindig"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi határozza meg az életszínvonalat?",
        options: [
          "Csak érzelmek",
          "Anyagi jólét",
          "Csak szeretet",
          "Csak barátok"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 35. oldal - Életszínvonal
  {
    id: 35,
    pageNumber: 35,
    reading: {
      title: "Életszínvonal",
      content: `Az életszínvonal viszont alapvetően a pénz függvénye. Csakhogy nem kizárólag az egyén "jólététől" függ, hanem együttesen érvényesül az egyén és az adott közösség általános, átlagos színvonala.

A nemzetközi összehasonlításban gyakran használják az életszínvonal mérésére az egy főre jutó GDP-t.

Függetlenül azonban az egy főre bontástól, vannak területek, ahol a fejlettség és színvonal kérdése csak összességében mérhető.`,
      questions: [
        {
          question: "Mi az életszínvonal függvénye?",
          answer: "a pénz",
          keywords: ["pénz", "függvény"]
        },
        {
          question: "Mit használnak az életszínvonal mérésére?",
          answer: "egy főre jutó GDP",
          keywords: ["GDP", "egy főre", "főre jutó"]
        },
        {
          question: "Mitől függ az életszínvonal?",
          answer: "egyén és közösség színvonalától",
          keywords: ["egyén", "közösség", "színvonal"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Életszínvonal", right: "Anyagi helyzet" },
      { id: 2, left: "GDP", right: "Bruttó hazai termék" },
      { id: 3, left: "Egy főre jutó", right: "Per capita" },
      { id: 4, left: "Függvény", right: "Függés" },
      { id: 5, left: "Jólét", right: "Gazdagság" },
      { id: 6, left: "Közösség", right: "Társadalom" },
      { id: 7, left: "Általános", right: "Átlagos" },
      { id: 8, left: "Nemzetközi", right: "Globális" },
      { id: 9, left: "Összehasonlítás", right: "Komparáció" },
      { id: 10, left: "Mérés", right: "Mérés" },
      { id: 11, left: "Fejlettség", right: "Fejlődés szintje" },
      { id: 12, left: "Összességében", right: "Összesen" },
      { id: 13, left: "Mérhető", right: "Számszerűsíthető" },
      { id: 14, left: "Terület", right: "Szektor" },
      { id: 15, left: "Kizárólag", right: "Csak" }
    ],
    quiz: [
      {
        question: "Mi az életszínvonal függvénye?",
        options: [
          "Csak barátok",
          "A pénz",
          "Csak időjárás",
          "Csak szerencse"
        ],
        correctAnswer: 1
      },
      {
        question: "Mit használnak az életszínvonal mérésére?",
        options: [
          "Barátok száma",
          "Egy főre jutó GDP",
          "Autók száma",
          "Telefon típusa"
        ],
        correctAnswer: 1
      },
      {
        question: "Mitől függ az életszínvonal?",
        options: [
          "Csak egyéntől",
          "Egyéntől és közösségtől",
          "Csak időjárástól",
          "Semmitől"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 36. oldal - Miért kell az egyénnek a pénz?
  {
    id: 36,
    pageNumber: 36,
    reading: {
      title: "Miért kell az egyénnek a pénz?",
      content: `Alapvetően azért kell az egyénnek a pénz, mert az életünket, életszínvonalunkat meghatározó javak elérése, megszerzése és az ezeken alapuló szükségleteink, igényeink kielégítése pénzben mérhető és pénzben megszerezhető.

A jelenkor embere és igénye ezen lényegesen túlmutat, legalábbis erősen kategorizálja vagy meghaladja az alapvető szükségletek fogalmának körét.`,
      questions: [
        {
          question: "Miért kell a pénz?",
          answer: "javak megszerzéséhez és szükségletek kielégítéséhez",
          keywords: ["javak", "szükséglet", "kielégít", "megszerez"]
        },
        {
          question: "Hogyan mérhető a javak értéke?",
          answer: "pénzben",
          keywords: ["pénz", "mérhető"]
        },
        {
          question: "Mit haladja meg a jelenkor embere?",
          answer: "az alapvető szükségletek körét",
          keywords: ["alapvető", "szükséglet", "meghalad"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Javak", right: "Termékek" },
      { id: 2, left: "Elérés", right: "Megszerzés" },
      { id: 3, left: "Szükséglet", right: "Igény" },
      { id: 4, left: "Kielégítés", right: "Teljesítés" },
      { id: 5, left: "Mérhető", right: "Számszerűsíthető" },
      { id: 6, left: "Megszerezhető", right: "Elérhető" },
      { id: 7, left: "Jelenkor", right: "Mai kor" },
      { id: 8, left: "Túlmutat", right: "Meghalad" },
      { id: 9, left: "Kategorizál", right: "Csoportosít" },
      { id: 10, left: "Alapvető", right: "Elsődleges" },
      { id: 11, left: "Fogalom", right: "Koncepció" },
      { id: 12, left: "Kör", right: "Határ" },
      { id: 13, left: "Lényegesen", right: "Jelentősen" },
      { id: 14, left: "Életszínvonal", right: "Anyagi helyzet" },
      { id: 15, left: "Meghatározó", right: "Döntő" }
    ],
    quiz: [
      {
        question: "Miért szükséges a pénz?",
        options: [
          "Csak dísznek",
          "Javak megszerzéséhez",
          "Semmire",
          "Csak gyűjtésre"
        ],
        correctAnswer: 1
      },
      {
        question: "Hogyan fejezhető ki a javak értéke?",
        options: [
          "Csak kilóban",
          "Pénzben",
          "Csak méterben",
          "Csak színekben"
        ],
        correctAnswer: 1
      },
      {
        question: "Mit haladja meg a mai ember igénye?",
        options: [
          "Semmit",
          "Az alapvető szükségleteket",
          "Mindent",
          "Nincs igény"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 37. oldal - A pénz romlása, infláció
  {
    id: 37,
    pageNumber: 37,
    reading: {
      title: "A pénz romlása, infláció",
      content: `A pénznek, vagyis a fizetőeszköznek sincs egyértelmű értékállósága. A pénz értékének meghatározása a vásárlóerejében rejlik.

Amikor pénzzel fizetünk, az áru értékét az adott fizetőeszköz értékében fejezzük ki, ez az érték azonban nem állandó.

Az infláció nem feltétlenül negatív folyamat. Az alacsony mértékű infláció serkenti a gazdaságot, ösztönzi a gazdaság szereplőit az aktivitásra.`,
      questions: [
        {
          question: "Mi határozza meg a pénz értékét?",
          answer: "a vásárlóereje",
          keywords: ["vásárlóerő", "vásárol"]
        },
        {
          question: "Állandó-e a pénz értéke?",
          answer: "nem, nem állandó",
          keywords: ["nem", "változó"]
        },
        {
          question: "Mindig negatív-e az infláció?",
          answer: "nem, az alacsony mértékű serkenti a gazdaságot",
          keywords: ["nem", "serkent", "gazdaság", "alacsony"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Infláció", right: "Pénzromlás" },
      { id: 2, left: "Értékállóság", right: "Érték megőrzés" },
      { id: 3, left: "Vásárlóerő", right: "Vételi képesség" },
      { id: 4, left: "Fizetőeszköz", right: "Pénz" },
      { id: 5, left: "Serkent", right: "Ösztönöz" },
      { id: 6, left: "Gazdaság", right: "Piac" },
      { id: 7, left: "Aktivitás", right: "Tevékenység" },
      { id: 8, left: "Alacsony mértékű", right: "Kismértékű" },
      { id: 9, left: "Állandó", right: "Változatlan" },
      { id: 10, left: "Meghatározás", right: "Definiálás" },
      { id: 11, left: "Rejlik", right: "Benne van" },
      { id: 12, left: "Feltétlenül", right: "Mindenképpen" },
      { id: 13, left: "Negatív", right: "Káros" },
      { id: 14, left: "Folyamat", right: "Folyam" },
      { id: 15, left: "Szereplő", right: "Résztvevő" }
    ],
    quiz: [
      {
        question: "Miben rejlik a pénz értéke?",
        options: [
          "Színében",
          "Vásárlóerejében",
          "Súlyában",
          "Méretében"
        ],
        correctAnswer: 1
      },
      {
        question: "Állandó-e a pénz értéke?",
        options: [
          "Igen, mindig",
          "Nem, változó",
          "Mindig ugyanaz",
          "Soha nem változik"
        ],
        correctAnswer: 1
      },
      {
        question: "Mit okoz az alacsony infláció?",
        options: [
          "Károsítja a gazdaságot",
          "Serkenti a gazdaságot",
          "Semmit",
          "Leállítja a gazdaságot"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 38. oldal - Inflációs elméletek
  {
    id: 38,
    pageNumber: 38,
    reading: {
      title: "Inflációs elméletek",
      content: `Neoklasszikus elmélet: Egy adott gazdaságban a pénzmennyiség növekedése okozza az inflációt. Ez az elmélet az alapja a mai általánosan használatos szabályozói elveknek is.

Keynesi elmélet: John Maynard Keynes szerint a pénzmennyiség növekedéséből adódó kereslet növekedés nem feltétlenül okoz inflációt.

Az osztrák közgazdaságtani iskola: a gazdaságba bocsájtott pénzmennyiség közvetlenül alakítja az inflációt függetlenül a kereslet növekedésétől.`,
      questions: [
        {
          question: "Mi a neoklasszikus elmélet?",
          answer: "pénzmennyiség növekedése okozza az inflációt",
          keywords: ["pénzmennyiség", "növekedés", "infláció"]
        },
        {
          question: "Mi a Keynesi elmélet lényege?",
          answer: "kereslet növekedés nem feltétlenül okoz inflációt",
          keywords: ["kereslet", "nem feltétlenül", "infláció"]
        },
        {
          question: "Mi az osztrák iskola álláspontja?",
          answer: "pénzmennyiség közvetlenül alakítja az inflációt",
          keywords: ["pénzmennyiség", "közvetlenül", "infláció"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Neoklasszikus", right: "Pénzmennyiség alapú" },
      { id: 2, left: "Keynesi", right: "Keresleti elmélet" },
      { id: 3, left: "Osztrák iskola", right: "Közvetlen hatás" },
      { id: 4, left: "Pénzmennyiség", right: "Pénz összeg" },
      { id: 5, left: "Növekedés", right: "Bővülés" },
      { id: 6, left: "Kereslet", right: "Igény" },
      { id: 7, left: "Okoz", right: "Előidéz" },
      { id: 8, left: "Alakít", right: "Befolyásol" },
      { id: 9, left: "Függetlenül", right: "Attól független" },
      { id: 10, left: "Közvetlen", right: "Direkt" },
      { id: 11, left: "Közgazdaságtan", right: "Gazdaságtan" },
      { id: 12, left: "Szabályozói elv", right: "Szabályozási elv" },
      { id: 13, left: "Általánosan", right: "Közösen" },
      { id: 14, left: "Használatos", right: "Használt" },
      { id: 15, left: "Alap", right: "Bázis" }
    ],
    quiz: [
      {
        question: "Mi okozza az inflációt a neoklasszikus elmélet szerint?",
        options: [
          "Kereslet csökkenés",
          "Pénzmennyiség növekedés",
          "Munkanélküliség",
          "Export növekedés"
        ],
        correctAnswer: 1
      },
      {
        question: "Ki alkotta a Keynesi elméletet?",
        options: [
          "Adam Smith",
          "John Maynard Keynes",
          "Karl Marx",
          "Milton Friedman"
        ],
        correctAnswer: 1
      },
      {
        question: "Az osztrák iskola szerint mi alakítja az inflációt?",
        options: [
          "Csak a kereslet",
          "Közvetlenül a pénzmennyiség",
          "Csak a kínálat",
          "Semmilyen tényező"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 39. oldal - Az infláció üteme
  {
    id: 39,
    pageNumber: 39,
    reading: {
      title: "Az infláció üteme",
      content: `Lassú infláció: "kúszó" infláció. A gazdaság szempontjából kívánatos, éves néhány százalékos ütemű pénzromlás. Támogatja a szereplők aktivitását.

Vágtató infláció: a pénzromlás ütemének néhány százalék feletti értéke. A gazdaság képes lehet megőrizni stabilitását, de a folyamat könnyen fordulhat a kezelhetetlenség irányába.

Hiper infláció: akár több száz százalékot is meghaladó mértékű, megfékezése már csak kormányzati beavatkozással lehetséges.`,
      questions: [
        {
          question: "Mi a lassú infláció?",
          answer: "kúszó, néhány százalékos pénzromlás",
          keywords: ["kúszó", "néhány százalék", "lassú"]
        },
        {
          question: "Mi a vágtató infláció?",
          answer: "néhány százalék feletti pénzromlás",
          keywords: ["néhány százalék feletti", "vágtató"]
        },
        {
          question: "Mi a hiper infláció?",
          answer: "több száz százalékos pénzromlás",
          keywords: ["több száz", "hiper", "magas"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Lassú infláció", right: "Kúszó infláció" },
      { id: 2, left: "Vágtató infláció", right: "Közepesen gyors" },
      { id: 3, left: "Hiper infláció", right: "Extrém magas" },
      { id: 4, left: "Kúszó", right: "Lassan haladó" },
      { id: 5, left: "Ütem", right: "Sebesség" },
      { id: 6, left: "Pénzromlás", right: "Infláció" },
      { id: 7, left: "Kívánatos", right: "Pozitív" },
      { id: 8, left: "Stabilitás", right: "Egyensúly" },
      { id: 9, left: "Kezelhetetlenség", right: "Kontrollvesztés" },
      { id: 10, left: "Kormányzati", right: "Állami" },
      { id: 11, left: "Beavatkozás", right: "Intervenció" },
      { id: 12, left: "Megfékezés", right: "Megállítás" },
      { id: 13, left: "Meghaladó", right: "Feletti" },
      { id: 14, left: "Aktivitás", right: "Tevékenység" },
      { id: 15, left: "Támogat", right: "Segít" }
    ],
    quiz: [
      {
        question: "Milyen a lassú infláció a gazdaságra?",
        options: [
          "Káros",
          "Kívánatos",
          "Veszélyes",
          "Katasztrofális"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi jellemzi a hiper inflációt?",
        options: [
          "Néhány százalék",
          "Több száz százalék",
          "Nulla százalék",
          "Egy százalék"
        ],
        correctAnswer: 1
      },
      {
        question: "Hogyan fékezhető meg a hiper infláció?",
        options: [
          "Magától megáll",
          "Kormányzati beavatkozással",
          "Nem lehet",
          "Piaci erőkkel"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 40. oldal - Az infláció okai és fajtái
  {
    id: 40,
    pageNumber: 40,
    reading: {
      title: "Az infláció okai és fajtái",
      content: `Keresleti infláció: az árszínvonal emelkedését a keresleti oldal okozza. A kereslet lehet belső és külső is.

Kínálati infláció: másik elterjedt nevén költséginfláció. A jószág előállításának költségei növekednek.

Pénz-és tőkepiaci infláció: a szolgáltatótól és ügyfelétől függetlenül bekövetkező szabályozói változások hatásai.`,
      questions: [
        {
          question: "Mi a keresleti infláció?",
          answer: "keresleti oldal okozza az áremelkedést",
          keywords: ["kereslet", "áremelkedés", "okoz"]
        },
        {
          question: "Mi a kínálati infláció?",
          answer: "költséginfláció, előállítási költségek nőnek",
          keywords: ["költség", "előállítás", "nő"]
        },
        {
          question: "Mi a tőkepiaci infláció?",
          answer: "szabályozói változások hatása",
          keywords: ["szabályozó", "változás", "hatás"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Keresleti infláció", right: "Kereslet okozza" },
      { id: 2, left: "Kínálati infláció", right: "Költséginfláció" },
      { id: 3, left: "Tőkepiaci infláció", right: "Szabályozói hatás" },
      { id: 4, left: "Árszínvonal", right: "Árszint" },
      { id: 5, left: "Emelkedés", right: "Növekedés" },
      { id: 6, left: "Kereslet", right: "Igény" },
      { id: 7, left: "Kínálat", right: "Ajánlat" },
      { id: 8, left: "Belső", right: "Hazai" },
      { id: 9, left: "Külső", right: "Külföldi" },
      { id: 10, left: "Költség", right: "Kiadás" },
      { id: 11, left: "Előállítás", right: "Gyártás" },
      { id: 12, left: "Szabályozó", right: "Regulátor" },
      { id: 13, left: "Változás", right: "Módosítás" },
      { id: 14, left: "Hatás", right: "Befolyás" },
      { id: 15, left: "Függetlenül", right: "Attól független" }
    ],
    quiz: [
      {
        question: "Mi okozza a keresleti inflációt?",
        options: [
          "Kínálat csökkenés",
          "Kereslet növekedés",
          "Munkanélküliség",
          "Export növekedés"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi a kínálati infláció másik neve?",
        options: [
          "Keresleti infláció",
          "Költséginfláció",
          "Hiper infláció",
          "Defláció"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi okozza a tőkepiaci inflációt?",
        options: [
          "Csak a kereslet",
          "Szabályozói változások",
          "Csak a kínálat",
          "Időjárás"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 41. oldal - Hogyan lehet mérni az inflációt
  {
    id: 41,
    pageNumber: 41,
    reading: {
      title: "Hogyan lehet mérni az inflációt",
      content: `Az inflációt sok szempont alapján lehet és szokták mérni. Általában egy kosarat hoznak létre, amibe belepakolják azokat az árukat, termékeket, szolgáltatásokat, amiknek az árváltozását akarják kimutatni.

Magyarországon a lakosság és a jogi személyek pénzét és pénzügyi eszközeit két fajta alap védi: OBA és BEVA.

A kosár összetételét hazánkban jelenleg mintegy 1000 reprezentáns alkotja, amiket 140 csoportba sorolnak.`,
      questions: [
        {
          question: "Hogyan mérik az inflációt?",
          answer: "kosár módszerrel, áruk árváltozását követik",
          keywords: ["kosár", "ár", "változás", "követ"]
        },
        {
          question: "Mi védi a pénzt Magyarországon?",
          answer: "OBA és BEVA",
          keywords: ["OBA", "BEVA", "védelem"]
        },
        {
          question: "Hány termék van a magyar kosárban?",
          answer: "mintegy 1000 reprezentáns",
          keywords: ["1000", "ezer", "reprezentáns"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Kosár módszer", right: "Inflációmérés" },
      { id: 2, left: "OBA", right: "Országos Betétbiztosítás" },
      { id: 3, left: "BEVA", right: "Befektetővédelmi Alap" },
      { id: 4, left: "Reprezentáns", right: "Termék" },
      { id: 5, left: "Árváltozás", right: "Áremelkedés" },
      { id: 6, left: "Kimutatni", right: "Mérni" },
      { id: 7, left: "Összetétel", right: "Felépítés" },
      { id: 8, left: "Csoport", right: "Kategória" },
      { id: 9, left: "Védelem", right: "Biztosítás" },
      { id: 10, left: "Jogi személy", right: "Cég" },
      { id: 11, left: "Pénzügyi eszköz", right: "Befektetés" },
      { id: 12, left: "Lakosság", right: "Népesség" },
      { id: 13, left: "Szempont", right: "Nézőpont" },
      { id: 14, left: "Általában", right: "Jellemzően" },
      { id: 15, left: "Létrehoz", right: "Összeállít" }
    ],
    quiz: [
      {
        question: "Hogyan mérik az inflációt?",
        options: [
          "Pénzmennyiség számolással",
          "Kosár módszerrel",
          "Népszámlálással",
          "Választással"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi védi a betéteket Magyarországon?",
        options: [
          "Csak a bankok",
          "OBA és BEVA",
          "Csak a kormány",
          "Senki"
        ],
        correctAnswer: 1
      },
      {
        question: "Hány termék van az inflációs kosárban?",
        options: [
          "Kb. 100",
          "Kb. 1000",
          "Kb. 10",
          "Kb. 10000"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 42. oldal - Megtakarítás bevezetés
  {
    id: 42,
    pageNumber: 42,
    reading: {
      title: "Megtakarítás bevezetés",
      content: `Megtakarítás: A bevételeink és kiadásaink egyenlegeként jelentkező pozitív többlet.

A megtakarítás az a jövedelemrész, amit nem fordítunk azonnal szükségleteink kielégítésére, nem költjük el. A megtakarítás egy későbbi időpontra halasztott szükségletkielégítést jelent.

Ha valaki képes megtakarítani, úgy dönteni, hogy az azonnali pénzköltését elhalasztja, akkor már elindult a tudatosság útján.`,
      questions: [
        {
          question: "Mi a megtakarítás?",
          answer: "bevételek és kiadások pozitív egyenlege",
          keywords: ["bevétel", "kiadás", "pozitív", "egyenleg"]
        },
        {
          question: "Mit jelent a megtakarítás?",
          answer: "későbbre halasztott szükségletkielégítés",
          keywords: ["később", "halaszt", "szükséglet"]
        },
        {
          question: "Mit jelez a megtakarítás képessége?",
          answer: "tudatosságot",
          keywords: ["tudatosság", "tudatos"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Megtakarítás", right: "Pozitív egyenleg" },
      { id: 2, left: "Bevétel", right: "Jövedelem" },
      { id: 3, left: "Kiadás", right: "Költés" },
      { id: 4, left: "Egyenleg", right: "Különbözet" },
      { id: 5, left: "Pozitív", right: "Plusz" },
      { id: 6, left: "Többlet", right: "Feleslég" },
      { id: 7, left: "Jövedelemrész", right: "Pénz rész" },
      { id: 8, left: "Kielégítés", right: "Teljesítés" },
      { id: 9, left: "Halaszt", right: "Későbbre tesz" },
      { id: 10, left: "Későbbi időpont", right: "Jövő" },
      { id: 11, left: "Tudatosság", right: "Tudatos gondolkodás" },
      { id: 12, left: "Képes", right: "Tud" },
      { id: 13, left: "Dönteni", right: "Határozni" },
      { id: 14, left: "Azonnal", right: "Rögtön" },
      { id: 15, left: "Elindult", right: "Nekikezdett" }
    ],
    quiz: [
      {
        question: "Mi a megtakarítás?",
        options: [
          "Negatív egyenleg",
          "Pozitív bevétel-kiadás egyenleg",
          "Csak bevétel",
          "Csak kiadás"
        ],
        correctAnswer: 1
      },
      {
        question: "Mit jelent megtakarítani?",
        options: [
          "Mindent elkölteni",
          "Későbbre halasztani a költést",
          "Kölcsönvenni",
          "Ajándékozni"
        ],
        correctAnswer: 1
      },
      {
        question: "Mit jelez a megtakarítás képessége?",
        options: [
          "Pazarlást",
          "Tudatosságot",
          "Lustaságot",
          "Gazdagságot"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 43. oldal - Bevételek
  {
    id: 43,
    pageNumber: 43,
    reading: {
      title: "Bevételek",
      content: `Rendszeres bevétel (munka): A munkának nevezzük az ember által a saját fizikai és szellemi képességeit használva kifejtett erőfeszítést.

Munkabér: a munkánkért cserébe juttatást várunk, ami az esetek túlnyomó többségében pénz vagy pénzben kifejezhető egyéb juttatás.

A munka nélkülözhetetlen eleme az emberi létnek és fogalomként a közgazdaságtannak is.`,
      questions: [
        {
          question: "Mi a munka?",
          answer: "fizikai és szellemi képességek használata",
          keywords: ["fizikai", "szellemi", "képesség"]
        },
        {
          question: "Mi a munkabér?",
          answer: "pénz vagy pénzben kifejezhető juttatás",
          keywords: ["pénz", "juttatás", "bér"]
        },
        {
          question: "Mennyire fontos a munka?",
          answer: "nélkülözhetetlen",
          keywords: ["nélkülözhetetlen", "fontos", "lényeges"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Munka", right: "Erőfeszítés" },
      { id: 2, left: "Munkabér", right: "Fizetés" },
      { id: 3, left: "Rendszeres bevétel", right: "Folyamatos jövedelem" },
      { id: 4, left: "Fizikai", right: "Testi" },
      { id: 5, left: "Szellemi", right: "Mentális" },
      { id: 6, left: "Képesség", right: "Tudás" },
      { id: 7, left: "Erőfeszítés", right: "Munka" },
      { id: 8, left: "Juttatás", right: "Fizetség" },
      { id: 9, left: "Túlnyomó többség", right: "Legtöbb eset" },
      { id: 10, left: "Pénzben kifejezhető", right: "Pénzben mérhető" },
      { id: 11, left: "Nélkülözhetetlen", right: "Elengedhetetlen" },
      { id: 12, left: "Emberi lét", right: "Emberi élet" },
      { id: 13, left: "Közgazdaságtan", right: "Gazdaságtan" },
      { id: 14, left: "Fogalom", right: "Koncepció" },
      { id: 15, left: "Kifejtett", right: "Végzett" }
    ],
    quiz: [
      {
        question: "Mi a munka?",
        options: [
          "Csak pihenés",
          "Fizikai és szellemi erőfeszítés",
          "Csak alvás",
          "Semmittevés"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi a munkabér?",
        options: [
          "Ajándék",
          "Pénz vagy juttatás",
          "Kölcsön",
          "Büntetés"
        ],
        correctAnswer: 1
      },
      {
        question: "Mennyire fontos a munka az embernek?",
        options: [
          "Felesleges",
          "Nélkülözhetetlen",
          "Opcionális",
          "Ritka"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 44. oldal - Kiadások
  {
    id: 44,
    pageNumber: 44,
    reading: {
      title: "Kiadások",
      content: `Állandó kiadások: azokat a kiadásainkat tartjuk számon, amik rendszeresen jelentkeznek és az életünk, életvitelünk szerves, elengedhetetlen részét képezik.

Egyéb kiadások: azokat a kiadásainkat, amikre úgy költünk el pénzt, hogy azt a havi állandó költségvetésünkbe nem illesztettük.

Luxus kiadások: olyan kiadás, amit azért engedhetünk meg magunknak, mert rendelkezünk egy egyszeri vagy folyamatos pénzügyi többlettel.`,
      questions: [
        {
          question: "Mi az állandó kiadás?",
          answer: "rendszeres, elengedhetetlen kiadás",
          keywords: ["rendszeres", "elengedhetetlen"]
        },
        {
          question: "Mi az egyéb kiadás?",
          answer: "költségvetésen kívüli kiadás",
          keywords: ["költségvetés", "kívül", "nem tervezett"]
        },
        {
          question: "Mi a luxus kiadás?",
          answer: "pénzügyi többletből fedezett kiadás",
          keywords: ["többlet", "luxus", "enged meg"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Állandó kiadás", right: "Rendszeres költség" },
      { id: 2, left: "Egyéb kiadás", right: "Nem tervezett költés" },
      { id: 3, left: "Luxus kiadás", right: "Extra költés" },
      { id: 4, left: "Rendszeres", right: "Folyamatos" },
      { id: 5, left: "Jelentkezik", right: "Előfordul" },
      { id: 6, left: "Életvitel", right: "Életmód" },
      { id: 7, left: "Szerves rész", right: "Fontos elem" },
      { id: 8, left: "Elengedhetetlen", right: "Nélkülözhetetlen" },
      { id: 9, left: "Költségvetés", right: "Budget" },
      { id: 10, left: "Illesztett", right: "Betervezett" },
      { id: 11, left: "Többlet", right: "Felesleg" },
      { id: 12, left: "Egyszeri", right: "Alkalmi" },
      { id: 13, left: "Folyamatos", right: "Rendszeres" },
      { id: 14, left: "Enged meg", right: "Megenged" },
      { id: 15, left: "Rendelkezik", right: "Birtokol" }
    ],
    quiz: [
      {
        question: "Mi jellemzi az állandó kiadást?",
        options: [
          "Ritkán jelentkezik",
          "Rendszeresen jelentkezik",
          "Soha nem jelentkezik",
          "Véletlenszerű"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi az egyéb kiadás?",
        options: [
          "Tervezett költés",
          "Költségvetésen kívüli költés",
          "Rendszeres költés",
          "Nincs ilyen"
        ],
        correctAnswer: 1
      },
      {
        question: "Miből fedezzük a luxus kiadást?",
        options: [
          "Kölcsönből",
          "Pénzügyi többletből",
          "Segélyből",
          "Ajándékból"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 45. oldal - Kiadások tervezése
  {
    id: 45,
    pageNumber: 45,
    reading: {
      title: "Kiadások tervezése, rendszerezése",
      content: `Ahhoz, hogy értelmezni, átlátni, kezelni, tervezni, rendszerezni tudjuk a bevételeinket, valami többletre van szükség.

A tudatosság két csoport meghatározását teszi lehetővé: egyrészt a kötelező és nem kötelező kiadások halmazait, másrészről a "sok kicsi sokra megy" mondását.

Ha minden nap 1000 forinttal többet engedünk meg magunknak, az havi szinten átlagosan 30.500 forintot, éves szinten 366.000 forint többletkiadást jelent.`,
      questions: [
        {
          question: "Mire van szükség a tervezéshez?",
          answer: "tudatosságra",
          keywords: ["tudatosság", "tudatos"]
        },
        {
          question: "Milyen csoportokat határoz meg a tudatosság?",
          answer: "kötelező és nem kötelező kiadások",
          keywords: ["kötelező", "nem kötelező", "kiadás"]
        },
        {
          question: "Mennyi a napi 1000 Ft éves szinten?",
          answer: "366.000 forint",
          keywords: ["366", "366000", "éves"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Tervezés", right: "Előre gondolkodás" },
      { id: 2, left: "Rendszerezés", right: "Szervezés" },
      { id: 3, left: "Tudatosság", right: "Tudatos gondolkodás" },
      { id: 4, left: "Kötelező kiadás", right: "Szükséges költés" },
      { id: 5, left: "Nem kötelező", right: "Opcionális" },
      { id: 6, left: "Halmaz", right: "Csoport" },
      { id: 7, left: "Sok kicsi sokra megy", right: "Összegződés" },
      { id: 8, left: "Napi", right: "Minden nap" },
      { id: 9, left: "Havi szint", right: "Egy hónapra" },
      { id: 10, left: "Éves szint", right: "Egy évre" },
      { id: 11, left: "Többletkiadás", right: "Extra költés" },
      { id: 12, left: "Értelmezni", right: "Megérteni" },
      { id: 13, left: "Átlátni", right: "Belátni" },
      { id: 14, left: "Kezelni", right: "Irányítani" },
      { id: 15, left: "Enged meg", right: "Megenged" }
    ],
    quiz: [
      {
        question: "Mire van szükség a kiadások tervezéséhez?",
        options: [
          "Semmire",
          "Tudatosságra",
          "Szerencsére",
          "Véletlenre"
        ],
        correctAnswer: 1
      },
      {
        question: "Milyen kiadásokat különböztetünk meg?",
        options: [
          "Csak kötelezőt",
          "Kötelezőt és nem kötelezőt",
          "Csak luxust",
          "Nincs különbség"
        ],
        correctAnswer: 1
      },
      {
        question: "Mennyi a napi 1000 Ft összege évente?",
        options: [
          "12.000 Ft",
          "366.000 Ft",
          "1.000 Ft",
          "100.000 Ft"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 46. oldal - Megtakarítás fontossága
  {
    id: 46,
    pageNumber: 46,
    reading: {
      title: "Megtakarítás fontossága",
      content: `Miért fontos megtakarítani? A kiadásaink mérete és időbeni jelentkezése sok esetben nem tervezhető, a kiadások szempontjából a jövő nem mindig látható.

A megtakarítás folyamata nem csak a "létfontosságú" kiadások anyagi biztonsága miatt lényeges.

A rendszeres megtakarítás képessége már önmagában tudatosságot feltételez.`,
      questions: [
        {
          question: "Miért fontos megtakarítani?",
          answer: "a jövő nem mindig tervezhető",
          keywords: ["jövő", "nem tervezhető", "biztosíték"]
        },
        {
          question: "Mit feltételez a megtakarítás?",
          answer: "tudatosságot",
          keywords: ["tudatosság", "tudatos"]
        },
        {
          question: "Tervezhető-e minden kiadás?",
          answer: "nem, sok esetben nem",
          keywords: ["nem", "nem mindig", "változó"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Megtakarítás", right: "Tartalékolás" },
      { id: 2, left: "Tervezhető", right: "Előre látható" },
      { id: 3, left: "Időbeni", right: "Időzítés" },
      { id: 4, left: "Jelentkezés", right: "Előfordulás" },
      { id: 5, left: "Létfontosságú", right: "Elengedhetetlen" },
      { id: 6, left: "Anyagi biztonság", right: "Pénzügyi védelem" },
      { id: 7, left: "Rendszeres", right: "Folyamatos" },
      { id: 8, left: "Képesség", right: "Tudás" },
      { id: 9, left: "Önmagában", right: "Egyedül" },
      { id: 10, left: "Feltételez", right: "Megkövetel" },
      { id: 11, left: "Folyamat", right: "Procedúra" },
      { id: 12, left: "Lényeges", right: "Fontos" },
      { id: 13, left: "Szempontjából", right: "Nézőpontjából" },
      { id: 14, left: "Látható", right: "Előrelátható" },
      { id: 15, left: "Méret", right: "Nagyság" }
    ],
    quiz: [
      {
        question: "Miért fontos megtakarítani?",
        options: [
          "Csak szórakozásból",
          "A jövő nem mindig tervezhető",
          "Nem fontos",
          "Kötelező"
        ],
        correctAnswer: 1
      },
      {
        question: "Mit feltételez a rendszeres megtakarítás?",
        options: [
          "Gazdagságot",
          "Tudatosságot",
          "Szerencsét",
          "Semmit"
        ],
        correctAnswer: 1
      },
      {
        question: "Minden kiadás tervezhető?",
        options: [
          "Igen, mind",
          "Nem, sok esetben nem",
          "Mindig",
          "Soha"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 47. oldal - Befektetés
  {
    id: 47,
    pageNumber: 47,
    reading: {
      title: "Befektetés",
      content: `Befektetés: A befektetés egy olyan művelet, ahol a jelenben rendelkezésünkre álló szabad pénzünket, tőkénket egy jövőbeni pénzre cseréljük a nagyobb jövedelem, hozam reményében.

A befektetés azonban kockázattal is jár, amit mindenkor mérlegelnünk kell és a lehető legkörültekintőbben értékelni a befektetéseink során.

A legalapvetőbb kérdések: Mennyit? Meddig? Mibe?`,
      questions: [
        {
          question: "Mi a befektetés?",
          answer: "jelenbeli pénzt jövőbeni hozamra cserélünk",
          keywords: ["jelen", "jövő", "hozam", "pénz"]
        },
        {
          question: "Mivel jár a befektetés?",
          answer: "kockázattal",
          keywords: ["kockázat", "veszély"]
        },
        {
          question: "Milyen alapkérdések vannak?",
          answer: "mennyit, meddig, mibe",
          keywords: ["mennyit", "meddig", "mibe"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Befektetés", right: "Invesztíció" },
      { id: 2, left: "Művelet", right: "Akció" },
      { id: 3, left: "Tőke", right: "Pénz" },
      { id: 4, left: "Jövőbeni", right: "Későbbi" },
      { id: 5, left: "Hozam", right: "Profit" },
      { id: 6, left: "Jövedelem", right: "Bevétel" },
      { id: 7, left: "Kockázat", right: "Rizikó" },
      { id: 8, left: "Mérlegelni", right: "Fontolóra venni" },
      { id: 9, left: "Körültekintő", right: "Óvatos" },
      { id: 10, left: "Értékelni", right: "Elemezni" },
      { id: 11, left: "Reményében", right: "Elvárásával" },
      { id: 12, left: "Rendelkezésre áll", right: "Elérhető" },
      { id: 13, left: "Szabad", right: "Fel nem használt" },
      { id: 14, left: "Csere", right: "Transzfer" },
      { id: 15, left: "Legalapvetőbb", right: "Legfontosabb" }
    ],
    quiz: [
      {
        question: "Mi a befektetés?",
        options: [
          "Csak pénzköltés",
          "Jelenbeli pénzt jövőbeni hozamra cserélünk",
          "Pénz égetése",
          "Ajándékozás"
        ],
        correctAnswer: 1
      },
      {
        question: "Mivel jár a befektetés?",
        options: [
          "Garantált nyereséggel",
          "Kockázattal",
          "Veszteség nélkül",
          "Biztos sikerrel"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi a három alapkérdés?",
        options: [
          "Ki, mit, mikor",
          "Mennyit, meddig, mibe",
          "Hol, hogyan, miért",
          "Nincs kérdés"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 48. oldal - Befektetés és az idő
  {
    id: 48,
    pageNumber: 48,
    reading: {
      title: "Befektetés és az idő",
      content: `Meghatározó szempont a befektetéseknél az idő. Egyrészt a hozamot időben fejezzük ki.

A befektetéseket a következő időtávokban határozzuk meg: rövid-, közép- és hosszútávú befektetések.

A rövidtávú befektetéseknek a 0 és 3 év közötti, középtávúnak a 3-5 év közötti és hosszútávúnak az 5 évet meghaladó időtávú befektetéseket nevezzük.

A pénznek időértéke van.`,
      questions: [
        {
          question: "Mi a rövidtávú befektetés?",
          answer: "0-3 év közötti",
          keywords: ["0", "3", "év", "rövid"]
        },
        {
          question: "Mi a középtávú befektetés?",
          answer: "3-5 év közötti",
          keywords: ["3", "5", "év", "közép"]
        },
        {
          question: "Mi a hosszútávú befektetés?",
          answer: "5 évet meghaladó",
          keywords: ["5", "meghalad", "hosszú"]
        },
        {
          question: "Van-e időértéke a pénznek?",
          answer: "igen",
          keywords: ["igen", "van", "időérték"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Rövidtávú", right: "0-3 év" },
      { id: 2, left: "Középtávú", right: "3-5 év" },
      { id: 3, left: "Hosszútávú", right: "5+ év" },
      { id: 4, left: "Időérték", right: "Időbeni érték" },
      { id: 5, left: "Meghatározó", right: "Fontos" },
      { id: 6, left: "Szempont", right: "Nézőpont" },
      { id: 7, left: "Hozam", right: "Profit" },
      { id: 8, left: "Kifejezni", right: "Meghatározni" },
      { id: 9, left: "Időtáv", right: "Időintervallum" },
      { id: 10, left: "Meghaladó", right: "Feletti" },
      { id: 11, left: "Határozzuk meg", right: "Definiáljuk" },
      { id: 12, left: "Következő", right: "Alábbi" },
      { id: 13, left: "Közötti", right: "Között lévő" },
      { id: 14, left: "Nevezzük", right: "Hívjuk" },
      { id: 15, left: "Egyrészt", right: "Részben" }
    ],
    quiz: [
      {
        question: "Mennyi a rövidtávú befektetés időtartama?",
        options: [
          "5-10 év",
          "0-3 év",
          "10+ év",
          "1 hónap"
        ],
        correctAnswer: 1
      },
      {
        question: "Mennyi a középtávú befektetés időtartama?",
        options: [
          "0-3 év",
          "3-5 év",
          "5+ év",
          "1 év"
        ],
        correctAnswer: 1
      },
      {
        question: "Van-e időértéke a pénznek?",
        options: [
          "Nem",
          "Igen",
          "Lehet",
          "Ritkán"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 49. oldal - Sajátkezelés és vagyonkezelés
  {
    id: 49,
    pageNumber: 49,
    reading: {
      title: "Sajátkezelés és vagyonkezelés",
      content: `A megtakarításunk, vagyonunk értékének megőrzése és a gyarapodásának biztosítása a saját felelősségünk.

Függetlenül attól, hogy mi végezzük a saját vagyonunk kezelését vagy más végzi azt helyettünk, a felelősség a legtöbb esetben minket terhel.

A vagyonkezelés azt jelenti, hogy a pénzünkkel kapcsolatos befektetési döntéseink meghozatalában tanácsot kapunk, vagy a befektetési döntéseket is mások hozzák meg helyettünk.`,
      questions: [
        {
          question: "Kié a felelősség a vagyon megőrzéséért?",
          answer: "a sajátunk",
          keywords: ["saját", "felelősség", "miénk"]
        },
        {
          question: "Ki kezelheti a vagyont?",
          answer: "mi vagy mások helyettünk",
          keywords: ["mi", "mások", "helyett"]
        },
        {
          question: "Mi a vagyonkezelés?",
          answer: "tanácsadás vagy döntéshozatal helyettünk",
          keywords: ["tanács", "döntés", "helyett"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Sajátkezelés", right: "Önálló kezelés" },
      { id: 2, left: "Vagyonkezelés", right: "Professzionális kezelés" },
      { id: 3, left: "Felelősség", right: "Kötelezettség" },
      { id: 4, left: "Megőrzés", right: "Védelem" },
      { id: 5, left: "Gyarapodás", right: "Növekedés" },
      { id: 6, left: "Biztosítás", right: "Garantálás" },
      { id: 7, left: "Függetlenül", right: "Attól független" },
      { id: 8, left: "Végez", right: "Csinál" },
      { id: 9, left: "Helyettünk", right: "Helyett" },
      { id: 10, left: "Terhel", right: "Nyomja" },
      { id: 11, left: "Tanács", right: "Javaslat" },
      { id: 12, left: "Döntés", right: "Választás" },
      { id: 13, left: "Meghozatal", right: "Létrehozás" },
      { id: 14, left: "Mások", right: "Szakértők" },
      { id: 15, left: "Kapcsolatos", right: "Összefüggő" }
    ],
    quiz: [
      {
        question: "Kié a felelősség a vagyonért?",
        options: [
          "Csak a banké",
          "A sajátunk",
          "Senkie",
          "Csak az államé"
        ],
        correctAnswer: 1
      },
      {
        question: "Ki kezelheti a vagyont?",
        options: [
          "Csak bankok",
          "Mi vagy mások helyettünk",
          "Senki",
          "Csak az állam"
        ],
        correctAnswer: 1
      },
      {
        question: "Mit jelent a vagyonkezelés?",
        options: [
          "Elköltés",
          "Tanácsadás vagy döntéshozatal",
          "Elrejtés",
          "Megsemmisítés"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 50. oldal - Pénzügyi kockázat bevezetés
  {
    id: 50,
    pageNumber: 50,
    reading: {
      title: "Pénzügyi kockázat bevezetés",
      content: `Kockázat: A kockázat egy olyan veszély, ami ha bekövetkezik, annak negatív hatása van a kockázat viselőjére.

A kockázatok egy jelentős részénél sikerrel lehet törekedni a megelőzésre (prevenció).

A pénzügyi kockázatok rendkívül sokrétűek, ráadásul mátrixszerűen következhetnek egymásból is.`,
      questions: [
        {
          question: "Mi a kockázat?",
          answer: "veszély negatív hatással",
          keywords: ["veszély", "negatív", "hatás"]
        },
        {
          question: "Lehet-e megelőzni a kockázatokat?",
          answer: "igen, egy jelentős részét",
          keywords: ["igen", "megelőzés", "prevenció"]
        },
        {
          question: "Milyenek a pénzügyi kockázatok?",
          answer: "rendkívül sokrétűek, mátrixszerűek",
          keywords: ["sokrétű", "mátrix", "összetett"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Kockázat", right: "Rizikó" },
      { id: 2, left: "Veszély", right: "Fenyegetés" },
      { id: 3, left: "Negatív hatás", right: "Káros következmény" },
      { id: 4, left: "Viselő", right: "Hordozó" },
      { id: 5, left: "Megelőzés", right: "Prevenció" },
      { id: 6, left: "Jelentős rész", right: "Nagy hányad" },
      { id: 7, left: "Sikerrel", right: "Eredményesen" },
      { id: 8, left: "Törekedni", right: "Igyekezni" },
      { id: 9, left: "Sokrétű", right: "Változatos" },
      { id: 10, left: "Mátrixszerű", right: "Összefonódó" },
      { id: 11, left: "Következik", right: "Eredeztethető" },
      { id: 12, left: "Bekövetkezik", right: "Megtörténik" },
      { id: 13, left: "Ráadásul", right: "Sőt" },
      { id: 14, left: "Rendkívül", right: "Nagyon" },
      { id: 15, left: "Egymásból", right: "Egymás után" }
    ],
    quiz: [
      {
        question: "Mi a kockázat?",
        options: [
          "Hasznos dolog",
          "Veszély negatív hatással",
          "Pozitív esemény",
          "Nincs jelentése"
        ],
        correctAnswer: 1
      },
      {
        question: "Megelőzhető-e a kockázat?",
        options: [
          "Soha",
          "Igen, egy részénél",
          "Mindig",
          "Nem érdemes"
        ],
        correctAnswer: 1
      },
      {
        question: "Milyenek a pénzügyi kockázatok?",
        options: [
          "Egyszerűek",
          "Rendkívül sokrétűek",
          "Nem léteznek",
          "Egysíkúak"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 51. oldal - Közvetett kockázatok
  {
    id: 51,
    pageNumber: 51,
    reading: {
      title: "Közvetett kockázatok",
      content: `Országkockázat: országkockázatnak nevezzük a befektetési és hitelezési tevékenység folytatásának kockázatát egy országban.

Szektorkockázat: A gazdasági élet különböző működési területeit szektorokra szokták osztani.

Vállalati kockázat: A vállalkozás kockázata minden olyan lehetséges veszély, amelynek bekövetkezte negatívan befolyásolja a vállalkozás tevékenységét.`,
      questions: [
        {
          question: "Mi az országkockázat?",
          answer: "befektetési kockázat egy országban",
          keywords: ["ország", "befektetés", "kockázat"]
        },
        {
          question: "Mi a szektorkockázat?",
          answer: "gazdasági szektorok kockázata",
          keywords: ["szektor", "gazdaság", "kockázat"]
        },
        {
          question: "Mi a vállalati kockázat?",
          answer: "vállalkozást negatívan befolyásoló veszély",
          keywords: ["vállalat", "negatív", "veszély"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Országkockázat", right: "Nemzeti rizikó" },
      { id: 2, left: "Szektorkockázat", right: "Iparági rizikó" },
      { id: 3, left: "Vállalati kockázat", right: "Céges rizikó" },
      { id: 4, left: "Befektetés", right: "Invesztíció" },
      { id: 5, left: "Hitelezés", right: "Kölcsönnyújtás" },
      { id: 6, left: "Tevékenység", right: "Működés" },
      { id: 7, left: "Folytatás", right: "Végzés" },
      { id: 8, left: "Gazdasági élet", right: "Gazdaság" },
      { id: 9, left: "Szektor", right: "Ágazat" },
      { id: 10, left: "Osztani", right: "Felosztani" },
      { id: 11, left: "Vállalkozás", right: "Cég" },
      { id: 12, left: "Lehetséges", right: "Potenciális" },
      { id: 13, left: "Bekövetkezte", right: "Megtörténte" },
      { id: 14, left: "Befolyásol", right: "Hatással van" },
      { id: 15, left: "Negatívan", right: "Károsan" }
    ],
    quiz: [
      {
        question: "Mi az országkockázat?",
        options: [
          "Csak politikai kockázat",
          "Befektetési kockázat egy országban",
          "Csak deviza kockázat",
          "Nincs ilyen"
        ],
        correctAnswer: 1
      },
      {
        question: "Mire osztják a gazdaságot?",
        options: [
          "Régiókra",
          "Szektorokra",
          "Városokra",
          "Családokra"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi a vállalati kockázat?",
        options: [
          "Hasznos dolog",
          "Vállalkozást negatívan befolyásoló veszély",
          "Pozitív hatás",
          "Nincs jelentése"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 52. oldal - A pénzügyi termék kockázata
  {
    id: 52,
    pageNumber: 52,
    reading: {
      title: "A pénzügyi termék kockázata",
      content: `Likviditási kockázat: A pénzügyi termék likviditásának fogalma egy olyan mérőszám, ami azt vizsgálja, hogy egy adott termék egy bizonyos időszakon belül mennyire forgalmas.

Árfolyamkockázat: A pénzügyi termékekkel alapvetően kétféle módon tudunk árfolyamnyereséget elérni: Long ügyletek és Short ügyletek.

Hozamkockázat: A befektetések tőkenövekménye.`,
      questions: [
        {
          question: "Mi a likviditási kockázat?",
          answer: "termék forgalmassága időszakon belül",
          keywords: ["forgalom", "időszak", "likviditás"]
        },
        {
          question: "Milyen ügyletek vannak?",
          answer: "Long és Short ügyletek",
          keywords: ["Long", "Short", "ügylet"]
        },
        {
          question: "Mi a hozamkockázat?",
          answer: "befektetések tőkenövekménye",
          keywords: ["tőke", "növekmény", "hozam"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Likviditási kockázat", right: "Forgalmi rizikó" },
      { id: 2, left: "Árfolyamkockázat", right: "Ár rizikó" },
      { id: 3, left: "Hozamkockázat", right: "Profit rizikó" },
      { id: 4, left: "Likviditás", right: "Forgalmasság" },
      { id: 5, left: "Mérőszám", right: "Mutató" },
      { id: 6, left: "Forgalmas", right: "Likvid" },
      { id: 7, left: "Árfolyam", right: "Ár" },
      { id: 8, left: "Long ügylet", right: "Vételi pozíció" },
      { id: 9, left: "Short ügylet", right: "Eladási pozíció" },
      { id: 10, left: "Hozam", right: "Nyereség" },
      { id: 11, left: "Tőkenövekmény", right: "Tőke növekedés" },
      { id: 12, left: "Befektetés", right: "Invesztíció" },
      { id: 13, left: "Időszak", right: "Periódus" },
      { id: 14, left: "Vizsgál", right: "Elemez" },
      { id: 15, left: "Alapvetően", right: "Elsősorban" }
    ],
    quiz: [
      {
        question: "Mi a likviditási kockázat?",
        options: [
          "Árfolyam kockázat",
          "Forgalmi kockázat",
          "Deviza kockázat",
          "Nincs ilyen"
        ],
        correctAnswer: 1
      },
      {
        question: "Milyen ügylettípusok vannak?",
        options: [
          "Csak Long",
          "Long és Short",
          "Csak Short",
          "Nincs ilyen"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi a hozamkockázat?",
        options: [
          "Árfolyam változás",
          "Tőkenövekmény",
          "Likviditás",
          "Deviza"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 53. oldal - Szolgáltatói kockázat
  {
    id: 53,
    pageNumber: 53,
    reading: {
      title: "Szolgáltatói kockázat",
      content: `A pénzügyi termékek közvetítése engedélyhez kötött, ellenőrzött és felügyelt szolgáltatások összessége.

A legfontosabb kockázatok: A szolgáltató csődjének kockázata, szerződéses jogviszonyból eredő kockázat, ügyletek végrehajtásának kockázata.

OBA - Országos Betétbiztosítási Alap: maximum 100 ezer euró forintban kifejezve.

BEVA - Befektető Védelmi Alap: maximum 100 ezer euró forintban kifejezve.`,
      questions: [
        {
          question: "Mihez kötött a pénzügyi közvetítés?",
          answer: "engedélyhez",
          keywords: ["engedély", "kötött"]
        },
        {
          question: "Mennyi az OBA védelem?",
          answer: "maximum 100 ezer euró",
          keywords: ["100", "ezer", "euró", "OBA"]
        },
        {
          question: "Mennyi a BEVA védelem?",
          answer: "maximum 100 ezer euró",
          keywords: ["100", "ezer", "euró", "BEVA"]
        }
      ]
    },
    matching: [
      { id: 1, left: "OBA", right: "Betétbiztosítás" },
      { id: 2, left: "BEVA", right: "Befektetővédelem" },
      { id: 3, left: "Szolgáltatói kockázat", right: "Közvetítői rizikó" },
      { id: 4, left: "Engedély", right: "Licensz" },
      { id: 5, left: "Ellenőrzött", right: "Felügyelt" },
      { id: 6, left: "Közvetítés", right: "Közvetítői tevékenység" },
      { id: 7, left: "Csőd", right: "Fizetésképtelenség" },
      { id: 8, left: "Szerződéses", right: "Kontraktuális" },
      { id: 9, left: "Jogviszony", right: "Jogi kapcsolat" },
      { id: 10, left: "Végrehajtás", right: "Teljesítés" },
      { id: 11, left: "100 ezer euró", right: "Maximális védelem" },
      { id: 12, left: "Összesség", right: "Teljesség" },
      { id: 13, left: "Eredő", right: "Származó" },
      { id: 14, left: "Legfontosabb", right: "Legjelentősebb" },
      { id: 15, left: "Védelem", right: "Biztosítás" }
    ],
    quiz: [
      {
        question: "Mihez kötött a pénzügyi közvetítés?",
        options: [
          "Semmih ez",
          "Engedélyhez",
          "Csak pénzhez",
          "Nincs szabály"
        ],
        correctAnswer: 1
      },
      {
        question: "Mennyi az OBA maximális védelme?",
        options: [
          "50 ezer euró",
          "100 ezer euró",
          "200 ezer euró",
          "Nincs limit"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi a BEVA?",
        options: [
          "Bank",
          "Befektetővédelmi Alap",
          "Biztosító",
          "Vállalat"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 54. oldal - Élet a pénzügyi kockázatokkal
  {
    id: 54,
    pageNumber: 54,
    reading: {
      title: "Élet a pénzügyi kockázatokkal",
      content: `A kockázatokkal együtt kell élnünk, de minél professzionálisabban igyekszünk mérlegelni és kezelni a kockázatainkat, annál nagyobb valószínűséggel érhetünk el eredményeket.

Kockázatelemzés szakaszai: 1. Kockázatok kutatása 2. Kockázatok azonosítása 3. Kockázatok csoportosítása 4. Valószínűség meghatározása 5. Hatásfok meghatározása 6. Döntés előkészítése.

Kockázatkezelés: Vállalt kockázatok nyomon követése, érvényesülés esetén alkalmazott folyamatok, kockázatok felülvizsgálata.`,
      questions: [
        {
          question: "Hogyan élünk a kockázatokkal?",
          answer: "együtt kell élnünk velük",
          keywords: ["együtt", "élni", "kezelni"]
        },
        {
          question: "Hány szakasza van a kockázatelemzésnek?",
          answer: "6 szakasz",
          keywords: ["6", "hat", "szakasz"]
        },
        {
          question: "Mi a kockázatkezelés?",
          answer: "nyomon követés, alkalmazott folyamatok",
          keywords: ["nyomon", "követ", "folyamat"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Kockázatelemzés", right: "Rizikó analízis" },
      { id: 2, left: "Kockázatkezelés", right: "Rizikó menedzsment" },
      { id: 3, left: "Kutatás", right: "Felderítés" },
      { id: 4, left: "Azonosítás", right: "Meghatározás" },
      { id: 5, left: "Csoportosítás", right: "Kategorizálás" },
      { id: 6, left: "Valószínűség", right: "Esély" },
      { id: 7, left: "Hatásfok", right: "Hatás mértéke" },
      { id: 8, left: "Döntés", right: "Határozat" },
      { id: 9, left: "Előkészítés", right: "Preparálás" },
      { id: 10, left: "Nyomon követés", right: "Monitorozás" },
      { id: 11, left: "Érvényesülés", right: "Bekövetkezés" },
      { id: 12, left: "Alkalmazott", right: "Használt" },
      { id: 13, left: "Felülvizsgálat", right: "Ellenőrzés" },
      { id: 14, left: "Professzionális", right: "Szakszerű" },
      { id: 15, left: "Mérlegelni", right: "Fontolóra venni" }
    ],
    quiz: [
      {
        question: "Hogyan kell élni a kockázatokkal?",
        options: [
          "Figyelmen kívül hagyni",
          "Együtt élni és kezelni",
          "Elkerülni",
          "Félni tőlük"
        ],
        correctAnswer: 1
      },
      {
        question: "Hány szakasza van a kockázatelemzésnek?",
        options: [
          "3",
          "6",
          "10",
          "1"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi a kockázatkezelés része?",
        options: [
          "Csak azonosítás",
          "Nyomon követés és folyamatok",
          "Csak kutatás",
          "Semmilyen"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 55. oldal - Risk-Reward
  {
    id: 55,
    pageNumber: 55,
    reading: {
      title: "Risk-Reward",
      content: `Kockázat - Megtérülés: arányszám, ami azt jelöli, hogy egységnyi kockázathoz képest mekkora a megtérülésünk, mint elvárt hozam.

A kockázat mindig 1-es értékű és hozzá számítandó, a kockázati értékként meghatározott mutató többszöröse. Például 1:2, 1:3, 1:4.

Az általánosan elfogadott minimum érték az 1:2 arány.`,
      questions: [
        {
          question: "Mi a Risk-Reward?",
          answer: "kockázat-megtérülés arányszám",
          keywords: ["kockázat", "megtérülés", "arány"]
        },
        {
          question: "Mennyi a kockázat értéke?",
          answer: "mindig 1",
          keywords: ["1", "egy", "egység"]
        },
        {
          question: "Mi a minimum elfogadott arány?",
          answer: "1:2",
          keywords: ["1:2", "kettő"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Risk-Reward", right: "Kockázat-Hozam" },
      { id: 2, left: "Arányszám", right: "Ráta" },
      { id: 3, left: "Megtérülés", right: "Hozam" },
      { id: 4, left: "Egységnyi", right: "Egy darab" },
      { id: 5, left: "Elvárt", right: "Várt" },
      { id: 6, left: "1:2 arány", right: "Dupla hozam" },
      { id: 7, left: "1:3 arány", right: "Tripla hozam" },
      { id: 8, left: "1:4 arány", right: "Négyszeres hozam" },
      { id: 9, left: "Többszörös", right: "Multiplikátor" },
      { id: 10, left: "Mutató", right: "Indikátor" },
      { id: 11, left: "Minimum érték", right: "Alsó határ" },
      { id: 12, left: "Általánosan elfogadott", right: "Közösen elfogadott" },
      { id: 13, left: "Számítandó", right: "Kalkulálandó" },
      { id: 14, left: "Meghatározott", right: "Definiált" },
      { id: 15, left: "Jelöli", right: "Mutatja" }
    ],
    quiz: [
      {
        question: "Mi a Risk-Reward?",
        options: [
          "Csak kockázat",
          "Kockázat-megtérülés arány",
          "Csak hozam",
          "Nincs jelentése"
        ],
        correctAnswer: 1
      },
      {
        question: "Mennyi a kockázat értéke mindig?",
        options: [
          "2",
          "1",
          "0",
          "Változó"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi a minimum elfogadott Risk-Reward arány?",
        options: [
          "1:1",
          "1:2",
          "1:5",
          "2:1"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 56. oldal - Mi a diverzifikáció?
  {
    id: 56,
    pageNumber: 56,
    reading: {
      title: "Mi a diverzifikáció?",
      content: `Diverzifikáció: alapvetően a kockázatok megosztását jelenti, a befektetések változatosságával.

A diverzifikáció célja a vagyon megőrzése, míg a befektetések koncentrációja a vagyon aktívabb növelését szolgálja.

A leggyakrabban használt osztályozás a "3-as megosztás": 1. Pénz-, és pénzügyi eszköz 2. Ingatlan 3. Vállalkozás`,
      questions: [
        {
          question: "Mi a diverzifikáció?",
          answer: "kockázatok megosztása, befektetések változatossága",
          keywords: ["kockázat", "megosztás", "változatos"]
        },
        {
          question: "Mi a diverzifikáció célja?",
          answer: "vagyon megőrzése",
          keywords: ["vagyon", "megőrzés", "védelem"]
        },
        {
          question: "Mi a 3-as megosztás?",
          answer: "pénzügyi eszköz, ingatlan, vállalkozás",
          keywords: ["pénzügyi", "ingatlan", "vállalkozás"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Diverzifikáció", right: "Szétoszlás" },
      { id: 2, left: "Koncentráció", right: "Összpontosítás" },
      { id: 3, left: "Megosztás", right: "Felosztás" },
      { id: 4, left: "Változatosság", right: "Diverzitás" },
      { id: 5, left: "Vagyon megőrzés", right: "Védelem" },
      { id: 6, left: "Vagyon növelés", right: "Gyarapítás" },
      { id: 7, left: "Pénzügyi eszköz", right: "Pénzügyi termék" },
      { id: 8, left: "Ingatlan", right: "Tulajdon" },
      { id: 9, left: "Vállalkozás", right: "Üzlet" },
      { id: 10, left: "3-as megosztás", right: "Háromosztatú" },
      { id: 11, left: "Osztályozás", right: "Kategorizálás" },
      { id: 12, left: "Használt", right: "Alkalmazott" },
      { id: 13, left: "Aktívabb", right: "Agresszívebb" },
      { id: 14, left: "Szolgál", right: "Céloz" },
      { id: 15, left: "Cél", right: "Célkitűzés" }
    ],
    quiz: [
      {
        question: "Mi a diverzifikáció?",
        options: [
          "Koncentráció",
          "Kockázatok megosztása",
          "Egyszempontú befektetés",
          "Nincs jelentése"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi a diverzifikáció célja?",
        options: [
          "Vagyon elvesztése",
          "Vagyon megőrzése",
          "Kockázat növelése",
          "Veszteség"
        ],
        correctAnswer: 1
      },
      {
        question: "Hány elem van a 3-as megosztásban?",
        options: [
          "2",
          "3",
          "5",
          "10"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 57. oldal - Befektetési formák szerinti allokáció
  {
    id: 57,
    pageNumber: 57,
    reading: {
      title: "Befektetési formák szerinti allokáció",
      content: `A befektetési formák szerinti diverzifikálás a kockázatmegosztás csúcsa és általában a már nagyobb méretű megtakarítással rendelkezők számára egy követendő út.

A helyes diverzifikálás azt jelenti, hogy a befektetett összeget megosztjuk osztályonként és az osztályokba soroltan különböző befektetési csoportok szerint is diverzifikálunk.

Minél sokrétűbb, szerteágazóbb a befektetések összessége, az annál több időt, figyelmet, körültekintést igényel.`,
      questions: [
        {
          question: "Kinek való a befektetési formák szerinti diverzifikálás?",
          answer: "nagyobb megtakarítással rendelkezőknek",
          keywords: ["nagyobb", "megtakarítás", "jelentős"]
        },
        {
          question: "Mit jelent a helyes diverzifikálás?",
          answer: "osztályonként és csoportonként megosztani",
          keywords: ["osztály", "csoport", "megosztás"]
        },
        {
          question: "Mit igényel a sokrétű diverzifikáció?",
          answer: "több időt, figyelmet, körültekintést",
          keywords: ["idő", "figyelem", "körültekintés"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Allokáció", right: "Elosztás" },
      { id: 2, left: "Diverzifikálás", right: "Szétoszlás" },
      { id: 3, left: "Csúcs", right: "Maximum" },
      { id: 4, left: "Nagyobb méret", right: "Jelentős összeg" },
      { id: 5, left: "Követendő", right: "Ajánlott" },
      { id: 6, left: "Osztály", right: "Kategória" },
      { id: 7, left: "Csoport", right: "Szegmens" },
      { id: 8, left: "Sokrétű", right: "Változatos" },
      { id: 9, left: "Szerteágazó", right: "Széles körű" },
      { id: 10, left: "Összesség", right: "Teljesség" },
      { id: 11, left: "Figyelem", right: "Odafigyelés" },
      { id: 12, left: "Körültekintés", right: "Óvatosság" },
      { id: 13, left: "Igényel", right: "Megkövetel" },
      { id: 14, left: "Helyes", right: "Megfelelő" },
      { id: 15, left: "Megosztás", right: "Felosztás" }
    ],
    quiz: [
      {
        question: "Kinek ajánlott a befektetési formák szerinti diverzifikálás?",
        options: [
          "Mindenkinek",
          "Nagyobb megtakarítással rendelkezőknek",
          "Csak kezdőknek",
          "Senkinek"
        ],
        correctAnswer: 1
      },
      {
        question: "Mit jelent a helyes diverzifikálás?",
        options: [
          "Csak egy eszközbe fektetni",
          "Osztályonként és csoportonként megosztani",
          "Mindent egy helyen tartani",
          "Véletlen befektetés"
        ],
        correctAnswer: 1
      },
      {
        question: "Mit igényel a sokrétű diverzifikáció?",
        options: [
          "Semmit",
          "Több időt és figyelmet",
          "Csak pénzt",
          "Csak szerencsét"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 58. oldal - Kockázati felülvizsgálás
  {
    id: 58,
    pageNumber: 58,
    reading: {
      title: "Kockázati felülvizsgálás",
      content: `A kockázatok folyamatosan velünk vannak, de nem csak azonosított jelenlétük okozhat veszélyt, hanem kiszámíthatóságuk is.

A kockázatok és felvállalásuk értékelése mindenkinek egy folyamatos feladat.

A pénzünk gondos befektetésével kapcsolatos eljárásunk hatékonyságának csökkenése a kockázatok csökkentésének irányába kell, hogy tereljen bennünket.

Pénzünk, megtakarításunk, vagyonunk megőrzése sokkal fontosabb feladat, mint a befektetési hozam maximalizálásának igénye!`,
      questions: [
        {
          question: "Milyen a kockázatok jelenléte?",
          answer: "folyamatos",
          keywords: ["folyamatos", "mindig", "állandó"]
        },
        {
          question: "Mi a feladat mindenkinek?",
          answer: "kockázatok folyamatos értékelése",
          keywords: ["kockázat", "értékelés", "folyamatos"]
        },
        {
          question: "Mi a fontosabb: megőrzés vagy maximalizálás?",
          answer: "megőrzés",
          keywords: ["megőrzés", "védelem", "fontosabb"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Felülvizsgálás", right: "Ellenőrzés" },
      { id: 2, left: "Folyamatos", right: "Állandó" },
      { id: 3, left: "Azonosított", right: "Felismert" },
      { id: 4, left: "Jelenlét", right: "Létezés" },
      { id: 5, left: "Kiszámíthatóság", right: "Előreláthatóság" },
      { id: 6, left: "Felvállalás", right: "Átvállalás" },
      { id: 7, left: "Értékelés", right: "Elemzés" },
      { id: 8, left: "Hatékonyság", right: "Eredményesség" },
      { id: 9, left: "Csökkenés", right: "Visszaesés" },
      { id: 10, left: "Csökkentés", right: "Redukálás" },
      { id: 11, left: "Tereljen", right: "Irányítson" },
      { id: 12, left: "Megőrzés", right: "Védelem" },
      { id: 13, left: "Maximalizálás", right: "Növelés" },
      { id: 14, left: "Igény", right: "Vágy" },
      { id: 15, left: "Gondos", right: "Körültekintő" }
    ],
    quiz: [
      {
        question: "Milyen a kockázatok jelenléte?",
        options: [
          "Ritkán előforduló",
          "Folyamatos",
          "Alkalmi",
          "Soha"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi a mindenkinek folyamatos feladata?",
        options: [
          "Pihenés",
          "Kockázatok értékelése",
          "Vásárlás",
          "Alvás"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi a fontosabb feladat?",
        options: [
          "Hozam maximalizálás",
          "Vagyon megőrzés",
          "Kockázat növelés",
          "Gyors gazdagodás"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 59. oldal - Záró gondolatok (előtte)
  {
    id: 59,
    pageNumber: 59,
    reading: {
      title: "Összegzés és folyamatos tanulás",
      content: `Ebben a könyvben megismerhettük a pénzügyi alapismeretek legfontosabb elemeit: a pénz kialakulását, tulajdonságait, az infláció jelenségét, a megtakarítás fontosságát, a befektetések alapjait és a pénzügyi kockázatok kezelését.

A pénzügyi tudatosság nem egy célállapot, hanem folyamatos tanulás és fejlődés. A megszerzett ismeretek alkalmazása a mindennapi életben segít abban, hogy felelős döntéseket hozzunk pénzügyeinkkel kapcsolatban.

Kívánunk minden Olvasónknak sikeres befektetéseket, gondos pénzkezelést és pénzügyileg tudatos, boldog jövőt!`,
      questions: [
        {
          question: "Mit ismertünk meg a könyvben?",
          answer: "pénz, infláció, megtakarítás, befektetés, kockázatok",
          keywords: ["pénz", "infláció", "megtakarítás", "befektetés", "kockázat"]
        },
        {
          question: "Mi a pénzügyi tudatosság?",
          answer: "folyamatos tanulás és fejlődés",
          keywords: ["folyamatos", "tanulás", "fejlődés"]
        },
        {
          question: "Mit kíván a könyv?",
          answer: "sikeres befektetéseket és tudatos jövőt",
          keywords: ["sikeres", "befektetés", "tudatos", "jövő"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Pénzügyi tudatosság", right: "Pénzügyi felelősség" },
      { id: 2, left: "Célállapot", right: "Végcél" },
      { id: 3, left: "Folyamatos tanulás", right: "Élethosszig tartó tanulás" },
      { id: 4, left: "Fejlődés", right: "Progress" },
      { id: 5, left: "Megszerzett ismeret", right: "Tanult tudás" },
      { id: 6, left: "Alkalmazás", right: "Használat" },
      { id: 7, left: "Mindennapi élet", right: "Napi rutin" },
      { id: 8, left: "Felelős döntés", right: "Tudatos választás" },
      { id: 9, left: "Sikeres befektetés", right: "Nyereséges invesztíció" },
      { id: 10, left: "Gondos", right: "Körültekintő" },
      { id: 11, left: "Pénzkezelés", right: "Pénzügyek irányítása" },
      { id: 12, left: "Tudatos jövő", right: "Tervezett jövő" },
      { id: 13, left: "Kialakulás", right: "Fejlődés" },
      { id: 14, left: "Tulajdonság", right: "Jellemző" },
      { id: 15, left: "Jelenség", right: "Folyamat" }
    ],
    quiz: [
      {
        question: "Mi a pénzügyi tudatosság?",
        options: [
          "Egyszeri tanulás",
          "Folyamatos tanulás és fejlődés",
          "Nincs szükség tanulásra",
          "Csak könyvolvasás"
        ],
        correctAnswer: 1
      },
      {
        question: "Mit tanultunk a könyvben?",
        options: [
          "Csak a pénzről",
          "Pénz, infláció, megtakarítás, befektetés",
          "Semmit",
          "Csak kockázatokról"
        ],
        correctAnswer: 1
      },
      {
        question: "Mit kíván az olvasónak a könyv?",
        options: [
          "Veszteségeket",
          "Sikeres befektetéseket és tudatos jövőt",
          "Semmit",
          "Pazarlást"
        ],
        correctAnswer: 1
      }
    ]
  },

  // 60. oldal - Záró gondolatok (címlap utolsó szavai)
  {
    id: 60,
    pageNumber: 60,
    reading: {
      title: "Záró gondolatok",
      content: `A pénzügyi tudatosság útja nem ér véget ezzel a könyvvel. Ez csak a kezdet, egy alapozás, amire építkezve folytathatjuk pénzügyi ismereteink bővítését.

Az egész életen át tartó tanulás különösen fontos a pénzügyek területén, hiszen a gazdasági környezet folyamatosan változik, új befektetési lehetőségek jelennek meg, és a kockázatok is változnak.

Emlékezz: a legfontosabb nem az, hogy mennyit tudsz, hanem az, hogy mit teszel a tudásoddal. A pénzügyi ismeretek csak akkor válnak értékessé, ha alkalmazzuk őket a mindennapi életünkben.

Köszönjük, hogy végigolvastátad ezt a könyvet. Sok sikert kívánunk pénzügyi utadon!`,
      questions: [
        {
          question: "Véget ér-e a pénzügyi tudatosság útja?",
          answer: "nem, ez csak a kezdet",
          keywords: ["nem", "kezdet", "folytatódik"]
        },
        {
          question: "Miért fontos az élethosszig tartó tanulás?",
          answer: "a gazdasági környezet folyamatosan változik",
          keywords: ["változik", "környezet", "gazdaság"]
        },
        {
          question: "Mi a legfontosabb?",
          answer: "mit teszel a tudásoddal",
          keywords: ["teszel", "tudás", "alkalmaz"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Véget ér", right: "Lezárul" },
      { id: 2, left: "Kezdet", right: "Indulás" },
      { id: 3, left: "Alapozás", right: "Fundamentum" },
      { id: 4, left: "Építkezés", right: "Fejlesztés" },
      { id: 5, left: "Élethosszig tartó", right: "Folyamatos" },
      { id: 6, left: "Gazdasági környezet", right: "Piaci helyzet" },
      { id: 7, left: "Változik", right: "Módosul" },
      { id: 8, left: "Lehetőség", right: "Opció" },
      { id: 9, left: "Jelenik meg", right: "Megjelenik" },
      { id: 10, left: "Emlékezz", right: "Ne felejtsd" },
      { id: 11, left: "Legfontosabb", right: "Kulcsfontosságú" },
      { id: 12, left: "Tudás", right: "Ismeret" },
      { id: 13, left: "Alkalmazás", right: "Használat" },
      { id: 14, left: "Értékes", right: "Hasznos" },
      { id: 15, left: "Mindennapi élet", right: "Napi rutin" }
    ],
    quiz: [
      {
        question: "Véget ér-e a pénzügyi tanulás?",
        options: [
          "Igen, a könyvvel",
          "Nem, ez csak a kezdet",
          "Mindig véget ér",
          "Nincs tanulás"
        ],
        correctAnswer: 1
      },
      {
        question: "Miért fontos a folyamatos tanulás?",
        options: [
          "Nem fontos",
          "A környezet változik",
          "Csak szórakozásból",
          "Kötelező"
        ],
        correctAnswer: 1
      },
      {
        question: "Mi a legfontosabb?",
        options: [
          "Mennyit tudsz",
          "Mit teszel a tudásoddal",
          "Hol tanulsz",
          "Mikor tanulsz"
        ],
        correctAnswer: 1
      }
    ]
  }
];

export const getTotalPages = () => penzugyiAlapismeretkLessons.length;

export const getTotalLessonsInFirstRound = () => penzugyiAlapismeretkLessons.length * 3; // 3 játék típus per oldal

export const getTotalLessonsInSecondRound = () => penzugyiAlapismeretkLessons.length; // Csak olvasás

export const getTotalLessons = () => getTotalLessonsInFirstRound() + getTotalLessonsInSecondRound();
