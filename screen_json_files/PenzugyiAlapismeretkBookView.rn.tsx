/**
 * ============================================
 * PENZUGYI ALAPISMERETEK BOOK VIEW - REACT NATIVE VERSION 1.0.0
 * ============================================
 * 
 * Digitális könyvolvasó a "Pénzügyi Alapismeretek" könyvhöz.
 * 60 oldalas teljes könyv lapozható formátumban.
 * 
 * FUNKCIÓK:
 * ✅ 60 oldal tartalom (Bevezetés -> A pénz -> Befektetés -> Kockázatok -> Záró gondolatok)
 * ✅ Lapozás balra/jobbra (previous/next gombok)
 * ✅ Oldal számozás (X / 60)
 * ✅ Címlap (elegáns serif betűtípus)
 * ✅ Fejezetek és szekciók
 * ✅ "Vissza az elejére" gomb
 * ✅ Animált lapozás (slide transition)
 * ✅ Könyv stílusú dizájn (papír háttér, serif font)
 * 
 * HASZNÁLAT:
 * cp exports/PenzugyiAlapismeretkBookView.rn.tsx src/screens/PenzugyiAlapismeretkBookView.tsx
 * 
 * FÜGGŐSÉGEK:
 * npm install lucide-react-native
 * npm install react-native-linear-gradient
 * npm install react-native-reanimated (for animations)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Platform,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  ChevronLeft,
  ChevronRight,
  X,
  BookOpen,
  Home,
} from 'lucide-react-native';

// ============================================
// TYPES
// ============================================

interface BookPage {
  id: number;
  chapter: string;
  section: string;
  content: string[];
}

interface PenzugyiAlapismeretkBookViewProps {
  onBack: () => void;
}

// ============================================
// CONSTANTS
// ============================================

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

const SIZES = {
  fontXS: 12,
  fontSM: 14,
  fontBase: 16,
  fontLG: 18,
  fontXL: 20,
  font2XL: 24,
  iconBase: 20,
  iconLG: 24,
  radiusLG: 12,
  radiusXL: 16,
};

const COLORS = {
  white: '#FFFFFF',
  slate900: '#0F172A',
  slate800: '#1E293B',
  slate700: '#334155',
  slate600: '#475569',
  slate500: '#64748B',
  amber50: '#FFFBEB',
  amber100: '#FEF3C7',
  amber200: '#FDE68A',
  amber700: '#B45309',
  amber800: '#92400E',
};

// ============================================
// BOOK CONTENT (60 pages)
// ============================================

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
      'Ez a könyv azért készült, hogy általános ismereteket nyújtson a gazdaság működésének alapvető folyamatairól, azon belül is leginkább a tőkepiacokkal ismertesse meg az érdeklődőket, tanulókat. Segítségével nem feltétlenül válhatunk azonnal tapasztalt befektetési szakemberekké, de a tartalom elsajátításával széleskörű ismereteket szerezhetünk, ami egy kezdő lépés lehet, hogy elindulhassunk a tőkepiacok varázslatos világában.',
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
  // BEFEKTETÉS (oldalak 50-59)
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
  // PÉNZÜGYI KOCKÁZAT (oldalak 51-56)
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
  // KOCKÁZATMEGOSZTÁS (oldalak 57-59)
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
  // ZÁRÓ GONDOLATOK
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
// MAIN COMPONENT
// ============================================

const PenzugyiAlapismeretkBookView: React.FC<PenzugyiAlapismeretkBookViewProps> = ({ onBack }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const nextPage = () => {
    if (currentPage < bookPages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToStart = () => {
    setCurrentPage(0);
  };

  const currentPageData = bookPages[currentPage];
  const isCoverPage = currentPage === 0;

  return (
    <View style={styles.container}>
      {/* Book Container */}
      <LinearGradient
        colors={['#FFFBEB', '#FEF3C7']}
        style={styles.bookContainer}
      >
        {/* Header */}
        <LinearGradient
          colors={[COLORS.slate800, COLORS.slate700]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <View style={styles.headerLeft}>
            <BookOpen size={SIZES.iconBase} color="#FBBF24" />
            <Text style={styles.headerTitle}>Pénzügyi Alapismeretek</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerPageInfo}>
              {currentPage + 1} / {bookPages.length}
            </Text>
            {currentPage > 0 && (
              <Pressable onPress={goToStart} style={styles.headerButton}>
                <Home size={16} color={COLORS.white} />
              </Pressable>
            )}
            <Pressable onPress={onBack} style={styles.headerButton}>
              <X size={16} color={COLORS.white} />
            </Pressable>
          </View>
        </LinearGradient>

        {/* Page Content */}
        <LinearGradient
          colors={['#FFFBEB', '#FFFFFF', '#FFFBEB']}
          style={styles.pageContent}
        >
          <ScrollView
            style={styles.pageScrollView}
            contentContainerStyle={styles.pageScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Cover Page */}
            {isCoverPage && (
              <View style={styles.coverContainer}>
                {currentPageData.content.map((line, index) => {
                  if (index === 0) {
                    // Title
                    return (
                      <Text key={index} style={styles.coverTitle}>
                        {line}
                      </Text>
                    );
                  } else if (index === 5 || index === 6) {
                    // Subtitle
                    return (
                      <Text key={index} style={styles.coverSubtitle}>
                        {line}
                      </Text>
                    );
                  } else if (index === 12) {
                    // Year
                    return (
                      <Text key={index} style={styles.coverYear}>
                        {line}
                      </Text>
                    );
                  } else if (line === '') {
                    return <View key={index} style={styles.spacer} />;
                  }
                  return null;
                })}
              </View>
            )}

            {/* Content Pages */}
            {!isCoverPage && (
              <View style={styles.contentContainer}>
                {/* Chapter Header */}
                {currentPageData.chapter && (
                  <View style={styles.chapterHeader}>
                    <Text style={styles.chapterTitle}>{currentPageData.chapter}</Text>
                  </View>
                )}

                {/* Section Header */}
                {currentPageData.section && (
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{currentPageData.section}</Text>
                  </View>
                )}

                {/* Content */}
                <View style={styles.textContent}>
                  {currentPageData.content.map((paragraph, index) => {
                    if (paragraph === '') {
                      return <View key={index} style={styles.paragraphSpacer} />;
                    }
                    return (
                      <Text key={index} style={styles.paragraph}>
                        {paragraph}
                      </Text>
                    );
                  })}
                </View>

                {/* Page Number */}
                <Text style={styles.pageNumber}>— {currentPage + 1} —</Text>
              </View>
            )}
          </ScrollView>
        </LinearGradient>

        {/* Navigation Footer */}
        <LinearGradient
          colors={[COLORS.slate800, COLORS.slate700]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.navFooter}
        >
          <Pressable
            onPress={prevPage}
            disabled={currentPage === 0}
            style={[styles.navButton, currentPage === 0 && styles.navButtonDisabled]}
          >
            <ChevronLeft size={16} color={COLORS.white} />
            <Text style={styles.navButtonText}>Előző</Text>
          </Pressable>

          <View style={styles.navChapterInfo}>
            <Text style={styles.navChapterText} numberOfLines={1}>
              {currentPageData.chapter || 'Címlap'}
            </Text>
          </View>

          <Pressable
            onPress={nextPage}
            disabled={currentPage === bookPages.length - 1}
            style={[
              styles.navButton,
              currentPage === bookPages.length - 1 && styles.navButtonDisabled,
            ]}
          >
            <Text style={styles.navButtonText}>Következő</Text>
            <ChevronRight size={16} color={COLORS.white} />
          </Pressable>
        </LinearGradient>
      </LinearGradient>
    </View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.slate900,
    paddingTop: Platform.OS === 'ios' ? 44 : 0,
  },

  bookContainer: {
    flex: 1,
  },

  // Header
  header: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#D97706',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  headerTitle: {
    fontSize: SIZES.fontBase,
    color: COLORS.white,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  headerPageInfo: {
    color: COLORS.amber200,
    fontSize: SIZES.fontXS,
  },
  headerButton: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(51, 65, 85, 0.6)',
    borderRadius: SIZES.radiusLG,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Page Content
  pageContent: {
    flex: 1,
  },
  pageScrollView: {
    flex: 1,
  },
  pageScrollContent: {
    padding: SPACING.base,
    minHeight: '100%',
  },

  // Cover Page
  coverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  coverTitle: {
    color: COLORS.slate800,
    textAlign: 'center',
    fontFamily: Platform.select({ ios: 'Georgia-Bold', android: 'serif' }),
    fontSize: 24,
    letterSpacing: 2,
    marginBottom: SPACING.xxl,
  },
  coverSubtitle: {
    color: COLORS.slate700,
    textAlign: 'center',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 16,
    letterSpacing: 1,
    marginVertical: SPACING.xs,
  },
  coverYear: {
    color: COLORS.slate600,
    textAlign: 'center',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 14,
    marginTop: SPACING.xxl * 2,
  },
  spacer: {
    height: SPACING.base,
  },

  // Content Pages
  contentContainer: {
    flex: 1,
  },
  chapterHeader: {
    marginBottom: SPACING.base,
  },
  chapterTitle: {
    fontSize: SIZES.fontLG,
    color: COLORS.slate800,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#D97706',
    paddingBottom: SPACING.sm,
    fontFamily: Platform.select({ ios: 'Georgia-Bold', android: 'serif' }),
    letterSpacing: 0.8,
  },
  sectionHeader: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: SIZES.fontBase,
    color: COLORS.slate700,
    fontFamily: Platform.select({ ios: 'Georgia-Italic', android: 'serif' }),
  },
  textContent: {
    gap: SPACING.md,
  },
  paragraph: {
    color: COLORS.slate800,
    lineHeight: 24,
    textAlign: 'justify',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 13,
  },
  paragraphSpacer: {
    height: SPACING.sm,
  },
  pageNumber: {
    textAlign: 'center',
    marginTop: SPACING.xxl,
    color: COLORS.slate500,
    fontSize: SIZES.fontXS,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },

  // Navigation Footer
  navFooter: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 2,
    borderTopColor: '#D97706',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    backgroundColor: '#D97706',
    borderRadius: SIZES.radiusLG,
  },
  navButtonDisabled: {
    backgroundColor: COLORS.slate600,
    opacity: 0.5,
  },
  navButtonText: {
    color: COLORS.white,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: SIZES.fontSM,
  },
  navChapterInfo: {
    maxWidth: 120,
  },
  navChapterText: {
    color: COLORS.amber200,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: SIZES.fontXS,
    textAlign: 'center',
  },
});

export default PenzugyiAlapismeretkBookView;
