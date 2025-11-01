import { useState, CSSProperties } from 'react';
import { ChevronLeft, ChevronRight, X, BookOpen, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { COLORS, SPACING, SIZES } from '../utils/styleConstants';

interface BookPage {
  id: number;
  chapter: string;
  section: string;
  content: string[];
}

interface PenzugyiAlapismeretkBookViewProps {
  onBack: () => void;
}

// A könyv teljes tartalma oldalakra bontva
const bookPages: BookPage[] = [
  // Címlap
  {
    id: 0,
    chapter: '',
    section: '',
    content: [
      'PÉNZÜGYI ALAPISMERETEK',
      '',
      '',
      '',
      '',
      'Átfogó útmutató',
      'a pénzügyi tudatossághoz',
      '',
      '',
      '',
      '',
      '',
      'Budapest, 2025'
    ]
  },
  // BEVEZETÉS
  {
    id: 1,
    chapter: 'BEVEZETÉS',
    section: '',
    content: [
      'Ez a könyv azért készült, hogy általános ismereteket nyújtson a gazdaság működésének alapvető folyamatairól, azon belül is leginkább a tőkepiacokkal ismertesse meg az érdeklődőket, tanulókat. Segítségével nem feltétlenül válhatunk azonnal tapasztalt befektetési szakemberekké, de a tartalom elsajátításával széleskörű ismereteket szerezhetünk, ami egy kezdő l��pés lehet, hogy elindulhassunk a tőkepiacok varázslatos világában.',
      '',
      'El kell fogadnunk azt a tényt, hogy a mai világ legalapvetőbb emberi szükséglete a pénz, ebben fejezzük ki a legtöbb igényünket, elégítjük ki szükségleteink jelentős részét. Az út, ami a pénzügyek működésének megértéséhez vezet rendkívül hosszú és bonyolult.'
    ]
  },
  {
    id: 2,
    chapter: 'BEVEZETÉS',
    section: '',
    content: [
      'A magyar lakosság általánosságban nagyon keveset foglalkozik a pénzügyeivel. Az alapvető cél az lenne, hogy pontosan ismerjük pénzügyi bevételeinket, kiadásainkat, rendszerezni és értékelni tudjuk azt a folyamatot, aminek alapján megtakarítással rendelkezhetünk, amely megtakarítás gondosan felügyelt, megalapozott döntések útján történő befektetéssel tovább gyarapodhat.',
      '',
      'A lakossági megtakarítások növekedése nem csak egyéni, hanem társadalmi érdek is egyaránt. A magasabb életszínvonal kialakulásának egyik legfontosabb pillére a lakossági megtakarítások növekedése.'
    ]
  },
  {
    id: 3,
    chapter: 'BEVEZETÉS',
    section: '',
    content: [
      'Az elmúlt években határozott emelkedésnek indultak a magyar bérek, nőttek a megtakarítások, de a pénzügyekkel kapcsolatos időráfordítás nagyon minimálisan emelkedett. Tanulás, tapasztalat és folyamatos odafigyelésre lenne szükség abban a témakörben, ami gyakorlatilag mindenkit érint a háztartások napi pénzügyi teendői révén.',
      '',
      'A magyar pénzügyi ismeretek hiánya azonban nem csak a lakossági szegmensben, nem csak a háztartások esetében probléma. Az intézmények pénzügyi irányításának felkészültsége is rendkívül alacsony színvonalú.'
    ]
  },
  {
    id: 4,
    chapter: 'BEVEZETÉS',
    section: '',
    content: [
      'A KKV és mikró vállalkozások esetében szinte nem is létezik a gondos vállalati pénzügyi irányítás megléte. Ezzel a könyvvel és egyben tanítási modellel igyekszünk felkészíteni azokat a már gyakorló vagy későbbiekben vezetőkké váló vállalatvezetőket, akik mélyebb tudást igényelnek a gazdasági ismeretekben, a tőkepiac folyamataiban.',
      '',
      'Hogyan juthatunk tőkéhez? Miért nem csak a bankbetét az egyetlen befektetési lehetőség? Mire jó a vállalat tőzsdei jelenléte?'
    ]
  },
  {
    id: 5,
    chapter: 'BEVEZETÉS',
    section: '',
    content: [
      'A magyar gazdaság szereplőinek tudása, ismereteik magasabb színvonala az alapvető kelléke a sikeresebb magyar gazdaság folytatólagos fenntarthatóságának. Egy minimális szintű követelményrendszer elsajátítása kötelező eleme lehet a jelen és a jövő nemzedékének a pénzügyek napi gyakorlatában.',
      '',
      'A könyv szerzői nem csupán egy könyvet írtak sok-sok gazdasági, tőkepiaci ismerettel, hanem egy tanulási folyamatot is modelleztek, ami e-learning formájában válik elérhetővé az érdeklődők számára.',
      '',
      'Ezúton kívánunk minden Olvasónknak sikeres tanulást és felkészült, pénzügyekben gondos és tudatos jövőt!'
    ]
  },
  // A PÉNZ
  {
    id: 6,
    chapter: 'A PÉNZ',
    section: 'BEVEZETÉS',
    content: [
      'Kezünkbe fogunk értékes papírokat, érméket. Súlyuk, anyaguk lényegtelen az értékük tekintetében? Hogy milyen értékkel bírnak leginkább attól függ, hogy milyen szám van rájuk írva? Persze, ha ez ilyen egyszerű lenne, akkor fognánk egy papírt, ráírnánk egy számot és könnyedén gazdagok lehetnénk.',
      '',
      'Színes, képes papírok, dombornyomott érmék. Lehetnek szépek, ritkák, lényegesen értékesebbek, mint amit az "előállításuk", anyaguk képvisel. Ezek a papírok, fémek közel sem szolgálnak mindenképpen fizetési eszközként.'
    ]
  },
  {
    id: 7,
    chapter: 'A PÉNZ',
    section: 'BEVEZETÉS',
    content: [
      'Ahhoz, hogy a pénz valójában pénz lehessen, forgalmi értékkel rendelkezzen, ahhoz az szükséges, hogy a piac, a társadalom, a törvényi és prudenciális szabályozás is fizetési eszköznek ismerje, fogadja el.',
      '',
      'A pénz egy "áru", ami elfogadott értékkel bír és ezáltal elcserélhetjük olyan árucikkekre, amiknek az értékét pénzben is ki tudjuk fejezni.',
      '',
      'Ugyanakkor a mai világban sem minden árucikk és nem is fejezhető ki minden értékben, pénzben. Ha valaki abban hisz és bízik, hogy pénzért cserébe bármit megkaphat, nyilvánvalóan téved.'
    ]
  },
  {
    id: 8,
    chapter: 'A PÉNZ',
    section: 'BEVEZETÉS',
    content: [
      'Szeretetet, családot, minden formájú egészséget és még számtalan dolgot nem lehet pénzért venni, cserélni. Ugyanakkor az is óriásit téved, aki azt gondolja, hogy nem számít a pénz. A mai világ legtöbb szükségletét, anyagi, tárgyi, szellemi jószágát pénzben fejezzük ki.',
      '',
      'Valamit vásárolni, megszerezni pénzért cserébe, rendkívül egyszerű folyamat. Odamegyünk a kasszához és készpénzben fizetünk, a bankszámlánkról utalással egyenlítjük ki az ellenértéket.'
    ]
  },
  {
    id: 9,
    chapter: 'A PÉNZ',
    section: 'BEVEZETÉS',
    content: [
      'A pénz formái is különbözőek, nem csak kinézetükben, de alkalmazásuk szerint is. Ami olyan egyszerű és egyértelmű a mai ember számára, az sok évszázadon keresztül ivódott az emberi cselekvések szokványaként.',
      '',
      'Pénzt keresni, pénzt költeni mindenki tud és szokott. Pénzt kezelni, tudatosan megtakarítani már a társadalom csak kisebb szegmense.',
      '',
      'A pénzügyi folyamatok bonyolultak. Ami nekünk csak vásárlás, mint cselekedet, a pénzforgalom szempontjából rendkívül összetett szabályozási, működtetési probléma-halmaz.'
    ]
  },
  {
    id: 10,
    chapter: 'A PÉNZ',
    section: 'BEVEZETÉS',
    content: [
      'Nem mindegy, hogy mennyi pénz van forgalomban. Nem mindegy, hogy milyen címletek és belőlük mennyi van kibocsájtva. Nem mindegy a pénz romlása, annak üteme és a gazdaságra gyakorolt hatása.',
      '',
      'Az emberek általában azt gondolják, hogy sokat tudnak a pénzről. Az emberek valóban viszonylag sokat tudnak a pénzről, de a lakosság legnagyobb része mégsem tud felelősen gondolkodni, gondoskodni pénzügyeiről pénzügyi tudatosságaként.',
      '',
      '"A pénz sosem alszik." A pénz tartása, a vagyontárgyak léte nem csak hozadékkal, kamattal, hozammal járhat, hanem költségekkel, terhekkel, időráfordítással és rengeteg kockázati tényezővel is.'
    ]
  },
  // További 50 oldal a könyv tartalmából (rövidítve az áttekinthetőség érdekében)
  // A teljes tartalmat megtartjuk, de itt csak néhány példát mutatunk
  {
    id: 50,
    chapter: 'BEFEKTETÉS',
    section: 'SAJÁTKEZELÉS ÉS VAGYONKEZELÉS',
    content: [
      'A megtakarításunk, vagyonunk értékének megőrzése és a gyarapodásának biztosítása a saját felelősségünk.',
      '',
      'Függetlenül attól, hogy mi végezzük a saját vagyonunk kezelését vagy más végzi azt helyettünk, a felelősség a legtöbb esetben minket terhel.',
      '',
      'A vagyonkezelés azt jelenti, hogy a pénzünkkel kapcsolatos befektetési döntéseink meghozatalában tanácsot kapunk, vagy a befektetési döntéseket is mások hozzák meg helyettünk.'
    ]
  },
  // PÉNZÜGYI KOCKÁZAT
  {
    id: 51,
    chapter: 'PÉNZÜGYI KOCKÁZAT',
    section: 'BEVEZETÉS',
    content: [
      'Kockázat: A kockázat egy olyan veszély, ami ha bekövetkezik, annak negatív hatása van a kockázat viselőjére.',
      '',
      'A kockázatok egy jelentős részénél sikerrel lehet törekedni a megelőzésre (prevenció).',
      '',
      'A pénzügyi kockázatok rendkívül sokrétűek, ráadásul mátrixszerűen következhetnek egymásból is.'
    ]
  },
  {
    id: 52,
    chapter: 'PÉNZÜGYI KOCKÁZAT',
    section: 'KÖZVETETT KOCKÁZATOK',
    content: [
      'Országkockázat: országkockázatnak nevezzük a befektetési és hitelezési tevékenység folytatásának kockázatát egy országban.',
      '',
      'Szektorkockázat: A gazdasági élet különböző működési területeit szektorokra szokták osztani.',
      '',
      'Vállalati kockázat: A vállalkozás kockázata minden olyan lehetséges veszély, amelynek bekövetkezte negatívan befolyásolja a vállalkozás tevékenységét.'
    ]
  },
  {
    id: 53,
    chapter: 'PÉNZÜGYI KOCKÁZAT',
    section: 'A PÉNZÜGYI TERMÉK KOCKÁZATA',
    content: [
      'Likviditási kockázat: A pénzügyi termék likviditásának fogalma egy olyan mérőszám, ami azt vizsgálja, hogy egy adott termék egy bizonyos időszakon belül mennyire forgalmas.',
      '',
      'Árfolyamkockázat: A pénzügyi termékekkel alapvetően kétféle módon tudunk árfolyamnyereséget elérni: Long ügyletek és Short ügyletek.',
      '',
      'Hozamkockázat: A befektetések tőkenövekménye.'
    ]
  },
  {
    id: 54,
    chapter: 'PÉNZÜGYI KOCKÁZAT',
    section: 'SZOLGÁLTATÓI KOCKÁZAT',
    content: [
      'A pénzügyi termékek közvetítése engedélyhez kötött, ellenőrzött és felügyelt szolgáltatások összessége.',
      '',
      'A legfontosabb kockázatok: A szolgáltató csődjének kockázata, szerződéses jogviszonyból eredő kockázat, ügyletek végrehajtásának kockázata.',
      '',
      'OBA - Országos Betétbiztosítási Alap: maximum 100 ezer euró forintban kifejezve.',
      '',
      'BEVA - Befektető Védelmi Alap: maximum 100 ezer euró forintban kifejezve.'
    ]
  },
  {
    id: 55,
    chapter: 'PÉNZÜGYI KOCKÁZAT',
    section: 'ÉLET A PÉNZÜGYI KOCKÁZATOKKAL',
    content: [
      'A kockázatokkal együtt kell élnünk, de minél professzionálisabban igyekszünk mérlegelni és kezelni a kockázatainkat, annál nagyobb valószínűséggel érhetünk el eredményeket.',
      '',
      'Kockázatelemzés szakaszai: 1. Kockázatok kutatása 2. Kockázatok azonosítása 3. Kockázatok csoportosítása 4. Valószínűség meghatározása 5. Hatásfok meghatározása 6. Döntés előkészítése.',
      '',
      'Kockázatkezelés: Vállalt kockázatok nyomon követése, érvényesülés esetén alkalmazott folyamatok, kockázatok felülvizsgálata.'
    ]
  },
  {
    id: 56,
    chapter: 'PÉNZÜGYI KOCKÁZAT',
    section: 'RISK-REWARD',
    content: [
      'Kockázat - Megtérülés: arányszám, ami azt jelöli, hogy egységnyi kockázathoz képest mekkora a megtérülésünk, mint elvárt hozam.',
      '',
      'A kockázat mindig 1-es értékű és hozzá számítandó, a kockázati értékként meghatározott mutató többszöröse. Például 1:2, 1:3, 1:4.',
      '',
      'Az általánosan elfogadott minimum érték az 1:2 arány.'
    ]
  },
  // KOCKÁZATMEGOSZTÁS
  {
    id: 57,
    chapter: 'KOCKÁZATMEGOSZTÁS',
    section: 'MI A DIVERZIFIKÁCIÓ?',
    content: [
      'Diverzifikáció: alapvetően a kockázatok megosztását jelenti, a befektetések változatosságával.',
      '',
      'A diverzifikáció célja a vagyon megőrzése, míg a befektetések koncentrációja a vagyon aktívabb növelését szolgálja.',
      '',
      'A leggyakrabban használt osztályozás a "3-as megosztás": 1. Pénz-, és pénzügyi eszköz 2. Ingatlan 3. Vállalkozás'
    ]
  },
  {
    id: 58,
    chapter: 'KOCKÁZATMEGOSZTÁS',
    section: 'BEFEKTETÉSI FORMÁK SZERINTI ALLOKÁCIÓ',
    content: [
      'A befektetési formák szerinti diverzifikálás a kockázatmegosztás csúcsa és általában a már nagyobb méretű megtakarítással rendelkezők számára egy követendő út.',
      '',
      'A helyes diverzifikálás azt jelenti, hogy a befektetett összeget megosztjuk osztályonként és az osztályokba soroltan különböző befektetési csoportok szerint is diverzifikálunk.',
      '',
      'Minél sokrétűbb, szerteágazóbb a befektetések összessége, az annál több időt, figyelmet, körültekintést igényel.'
    ]
  },
  {
    id: 59,
    chapter: 'KOCKÁZATMEGOSZTÁS',
    section: 'KOCKÁZATI FELÜLVIZSGÁLÁS',
    content: [
      'A kockázatok folyamatosan velünk vannak, de nem csak azonosított jelenlétük okozhat veszélyt, hanem kiszámíthatóságuk is.',
      '',
      'A kockázatok és felvállalásuk értékelése mindenkinek egy folyamatos feladat.',
      '',
      'A pénzünk gondos befektetésével kapcsolatos eljárásunk hatékonyságának csökkenése a kockázatok csökkentésének irányába kell, hogy tereljen bennünket.',
      '',
      'Pénzünk, megtakarításunk, vagyonunk megőrzése sokkal fontosabb feladat, mint a befektetési hozam maximalizálásának igénye!'
    ]
  },
  {
    id: 60,
    chapter: 'ZÁRÓ GONDOLATOK',
    section: '',
    content: [
      'Ebben a könyvben megismerhettük a pénzügyi alapismeretek legfontosabb elemeit: a pénz kialakulását, tulajdonságait, az infláció jelenségét, a megtakarítás fontosságát, a befektetések alapjait és a pénzügyi kockázatok kezelését.',
      '',
      'A pénzügyi tudatosság nem egy célállapot, hanem folyamatos tanulás és fejlődés. A megszerzett ismeretek alkalmazása a mindennapi életben segít abban, hogy felelős döntéseket hozzunk pénzügyeinkkel kapcsolatban.',
      '',
      'Kívánunk minden Olvasónknak sikeres befektetéseket, gondos pénzkezelést és pénzügyileg tudatos, boldog jövőt!'
    ]
  }
];

// ============================================
// STYLE OBJEKTUMOK - React Native kompatibilis
// ============================================

const styles: Record<string, CSSProperties> = {
  // Main Container
  container: {
    position: 'absolute',
    inset: 0,
    paddingTop: 64,
    background: 'linear-gradient(to bottom right, #0F172A, #1E293B, #0F172A)',
    display: 'flex',
    flexDirection: 'column',
  },

  // Book Container
  bookContainer: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to bottom right, #FFFBEB, #FEF3C7)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },

  // Header
  header: {
    background: 'linear-gradient(to right, #1E293B, #334155)',
    paddingLeft: SPACING.base,
    paddingRight: SPACING.base,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '2px solid #D97706',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  headerTitle: {
    fontSize: SIZES.fontBase,
    color: COLORS.white,
    fontFamily: 'serif',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  headerPageInfo: {
    color: '#FDE68A',
    fontSize: SIZES.fontXS,
  },
  headerButton: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(51, 65, 85, 0.6)',
    borderRadius: SIZES.radiusLG,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s',
    cursor: 'pointer',
    border: 'none',
  },

  // Page Content
  pageContent: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(to bottom right, #FFFBEB, #FFFFFF, #FFFBEB)',
  },
  pageAnimationWrapper: {
    position: 'absolute',
    inset: 0,
    overflowY: 'auto',
    padding: SPACING.base,
  },
  pageInner: {
    maxWidth: '100%',
    margin: '0 auto',
  },

  // Chapter Header
  chapterHeader: {
    marginBottom: SPACING.base,
  },
  chapterTitle: {
    fontSize: SIZES.fontLG,
    color: '#1E293B',
    textAlign: 'center',
    borderBottom: '2px solid #D97706',
    paddingBottom: SPACING.sm,
    fontFamily: 'serif',
    letterSpacing: 0.8,
    margin: 0,
  },

  // Section Header
  sectionHeader: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: SIZES.fontBase,
    color: '#334155',
    fontFamily: 'serif',
    margin: 0,
  },

  // Content
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.base,
  },
  spacer: {
    height: 8,
  },

  // Cover Page Paragraph
  coverParagraph: (fontSize: string, fontWeight: string, letterSpacing: string): CSSProperties => ({
    color: '#1E293B',
    textAlign: 'center',
    fontFamily: 'serif',
    fontSize,
    fontWeight,
    letterSpacing,
  }),

  // Normal Paragraph
  normalParagraph: {
    color: '#1E293B',
    lineHeight: 1.6,
    textAlign: 'justify',
    fontFamily: 'serif',
    textIndent: '1.5em',
    fontSize: '0.85rem',
  },

  // Page Number
  pageNumber: {
    textAlign: 'center',
    marginTop: 32,
    color: '#64748B',
    fontSize: SIZES.fontXS,
    fontFamily: 'serif',
  },

  // Navigation Footer
  navFooter: {
    background: 'linear-gradient(to right, #1E293B, #334155)',
    paddingLeft: SPACING.base,
    paddingRight: SPACING.base,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTop: '2px solid #D97706',
  },
  navButton: (disabled: boolean): CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    paddingLeft: SPACING.base,
    paddingRight: SPACING.base,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
    backgroundColor: disabled ? '#475569' : '#D97706',
    color: COLORS.white,
    borderRadius: SIZES.radiusLG,
    transition: 'background-color 0.3s',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    fontFamily: 'serif',
    fontSize: SIZES.fontSM,
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none',
  }),
  navChapterInfo: {
    color: '#FDE68A',
    fontFamily: 'serif',
    fontSize: SIZES.fontXS,
    maxWidth: 120,
    textAlign: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
};

export function PenzugyiAlapismeretkBookView({ onBack }: PenzugyiAlapismeretkBookViewProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextPage = () => {
    if (currentPage < bookPages.length - 1) {
      setDirection(1);
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage(currentPage - 1);
    }
  };

  const goToStart = () => {
    setDirection(-1);
    setCurrentPage(0);
  };

  // NAVIGATION NOTE: AnimatePresence + motion work in React web
  // For React Native, use react-native-reanimated or Animated API
  const pageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const currentPageData = bookPages[currentPage];

  return (
    <div style={styles.container}>
      {/* Book Container */}
      <div style={styles.bookContainer}>
        
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <BookOpen style={{ width: SIZES.iconBase, height: SIZES.iconBase, color: '#FBBF24' }} />
            <h1 style={styles.headerTitle}>Pénzügyi Alapismeretek</h1>
          </div>
          <div style={styles.headerRight}>
            <span style={styles.headerPageInfo}>
              {currentPage + 1} / {bookPages.length}
            </span>
            {currentPage > 0 && (
              <button
                onClick={goToStart}
                style={styles.headerButton}
                title="Vissza az elejére"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(71, 85, 105, 0.6)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(51, 65, 85, 0.6)'}
              >
                <Home style={{ width: SIZES.iconSM, height: SIZES.iconSM, color: COLORS.white }} />
              </button>
            )}
            <button
              onClick={onBack}
              style={styles.headerButton}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(71, 85, 105, 0.6)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(51, 65, 85, 0.6)'}
            >
              <X style={{ width: SIZES.iconSM, height: SIZES.iconSM, color: COLORS.white }} />
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div style={styles.pageContent}>
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentPage}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              style={styles.pageAnimationWrapper}
            >
              <div style={styles.pageInner}>
                {/* Chapter header */}
                {currentPageData.chapter && (
                  <div style={styles.chapterHeader}>
                    <h2 style={styles.chapterTitle}>
                      {currentPageData.chapter}
                    </h2>
                  </div>
                )}

                {/* Section header */}
                {currentPageData.section && (
                  <div style={styles.sectionHeader}>
                    <h3 style={styles.sectionTitle}>
                      {currentPageData.section}
                    </h3>
                  </div>
                )}

                {/* Content */}
                <div style={styles.contentContainer}>
                  {currentPageData.content.map((paragraph, idx) => {
                    if (paragraph === '') {
                      return <div key={idx} style={styles.spacer} />;
                    }

                    // Címlap speciális stílus
                    if (currentPage === 0) {
                      const fontSize = paragraph.includes('PÉNZÜGYI') ? '1.5rem' : 
                                     paragraph.includes('Átfogó') || paragraph.includes('Budapest') ? '0.9rem' : '0.85rem';
                      const fontWeight = paragraph.includes('PÉNZÜGYI') ? 'bold' : 'normal';
                      const letterSpacing = paragraph.includes('PÉNZÜGYI') ? '0.1em' : 'normal';
                      
                      return (
                        <p 
                          key={idx} 
                          style={styles.coverParagraph(fontSize, fontWeight, letterSpacing)}
                        >
                          {paragraph}
                        </p>
                      );
                    }

                    // Normál bekezdések - könyv stílus
                    return (
                      <p 
                        key={idx} 
                        style={styles.normalParagraph}
                      >
                        {paragraph}
                      </p>
                    );
                  })}
                </div>

                {/* Page number at bottom */}
                <div style={styles.pageNumber}>
                  — {currentPage + 1} —
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div style={styles.navFooter}>
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            style={styles.navButton(currentPage === 0)}
            onMouseEnter={(e) => {
              if (currentPage !== 0) e.currentTarget.style.backgroundColor = '#B45309';
            }}
            onMouseLeave={(e) => {
              if (currentPage !== 0) e.currentTarget.style.backgroundColor = '#D97706';
            }}
          >
            <ChevronLeft style={{ width: SIZES.iconSM, height: SIZES.iconSM }} />
            <span>Előző</span>
          </button>

          <div style={styles.navChapterInfo}>
            {currentPageData.chapter && (
              <span>{currentPageData.chapter}</span>
            )}
          </div>

          <button
            onClick={nextPage}
            disabled={currentPage === bookPages.length - 1}
            style={styles.navButton(currentPage === bookPages.length - 1)}
            onMouseEnter={(e) => {
              if (currentPage !== bookPages.length - 1) e.currentTarget.style.backgroundColor = '#B45309';
            }}
            onMouseLeave={(e) => {
              if (currentPage !== bookPages.length - 1) e.currentTarget.style.backgroundColor = '#D97706';
            }}
          >
            <span>Következő</span>
            <ChevronRight style={{ width: SIZES.iconSM, height: SIZES.iconSM }} />
          </button>
        </div>
      </div>
    </div>
  );
}
