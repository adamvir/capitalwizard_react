/**
 * Pénzügyi Alapismeretek Book View Component - React Native
 *
 * Speciális könyv olvasó komponens a "Pénzügyi Alapismeretek" könyv tartalmához.
 * Teljes fejezetek és szakaszok lapozható formátumban.
 *
 * HASZNÁLAT:
 *
 * import { PenzugyiAlapismeretkBookView } from './components/books/PenzugyiAlapismeretkBookView';
 *
 * <PenzugyiAlapismeretkBookView
 *   onBack={() => setShowBook(false)}
 * />
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Modal,
  Dimensions,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  SlideInRight,
  SlideOutLeft,
  SlideInLeft,
  SlideOutRight,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SPACING, FONT_WEIGHT, SHADOWS } from '../../utils/styleConstants';

const { width, height } = Dimensions.get('window');

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
  // BEFEKTETÉS
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

export function PenzugyiAlapismeretkBookView({ onBack }: PenzugyiAlapismeretkBookViewProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

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

  const currentPageData = bookPages[currentPage];

  return (
    <Modal
      visible={true}
      animationType="fade"
      transparent={false}
      onRequestClose={onBack}
    >
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#FFFBEB', '#FEF3C7']}
          style={styles.bookContainer}
        >
          {/* Header */}
          <LinearGradient
            colors={['#1E293B', '#334155']}
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.headerLeft}>
              <MaterialCommunityIcons
                name="book-open-variant"
                size={SIZES.iconLG}
                color="#FBBF24"
              />
              <Text style={styles.headerTitle} numberOfLines={1}>
                Pénzügyi Alapismeretek
              </Text>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.pageCounter}>
                {currentPage + 1} / {bookPages.length}
              </Text>
              {currentPage > 0 && (
                <TouchableOpacity
                  onPress={goToStart}
                  style={styles.homeButton}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name="home"
                    size={SIZES.iconBase}
                    color={COLORS.white}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={onBack}
                style={styles.closeButton}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={SIZES.iconBase}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Page Content */}
          <View style={styles.pageContent}>
            <Animated.View
              key={currentPage}
              entering={direction === 1 ? SlideInRight.duration(300) : SlideInLeft.duration(300)}
              exiting={direction === 1 ? SlideOutLeft.duration(200) : SlideOutRight.duration(200)}
              style={styles.pageAnimationWrapper}
            >
              <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                <View style={styles.pageInner}>
                  {/* Chapter header */}
                  {currentPageData.chapter && (
                    <View style={styles.chapterHeader}>
                      <Text style={styles.chapterTitle}>
                        {currentPageData.chapter}
                      </Text>
                    </View>
                  )}

                  {/* Section header */}
                  {currentPageData.section && (
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>
                        {currentPageData.section}
                      </Text>
                    </View>
                  )}

                  {/* Content */}
                  <View style={styles.contentContainer}>
                    {currentPageData.content.map((paragraph, idx) => {
                      if (paragraph === '') {
                        return <View key={idx} style={styles.spacer} />;
                      }

                      // Címlap speciális stílus
                      if (currentPage === 0) {
                        if (paragraph.includes('PÉNZÜGYI')) {
                          return (
                            <Text key={idx} style={styles.coverTitleMain}>
                              {paragraph}
                            </Text>
                          );
                        } else if (paragraph.includes('Átfogó') || paragraph.includes('Budapest')) {
                          return (
                            <Text key={idx} style={styles.coverSubtitleText}>
                              {paragraph}
                            </Text>
                          );
                        }
                        return (
                          <Text key={idx} style={styles.coverNormalText}>
                            {paragraph}
                          </Text>
                        );
                      }

                      // Normál bekezdések - könyv stílus
                      return (
                        <Text key={idx} style={styles.normalParagraph}>
                          {paragraph}
                        </Text>
                      );
                    })}
                  </View>

                  {/* Page number at bottom */}
                  <Text style={styles.pageNumber}>
                    — {currentPage + 1} —
                  </Text>
                </View>
              </ScrollView>
            </Animated.View>
          </View>

          {/* Navigation */}
          <LinearGradient
            colors={['#1E293B', '#334155']}
            style={styles.navigation}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TouchableOpacity
              onPress={prevPage}
              disabled={currentPage === 0}
              style={[
                styles.navButton,
                currentPage === 0 && styles.navButtonDisabled
              ]}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="chevron-left"
                size={SIZES.iconBase}
                color={COLORS.white}
              />
              <Text style={styles.navButtonText}>Előző</Text>
            </TouchableOpacity>

            <View style={styles.navChapterInfo}>
              {currentPageData.chapter && (
                <Text style={styles.navChapterText} numberOfLines={1}>
                  {currentPageData.chapter}
                </Text>
              )}
            </View>

            <TouchableOpacity
              onPress={nextPage}
              disabled={currentPage === bookPages.length - 1}
              style={[
                styles.navButton,
                currentPage === bookPages.length - 1 && styles.navButtonDisabled
              ]}
              activeOpacity={0.7}
            >
              <Text style={styles.navButtonText}>Következő</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={SIZES.iconBase}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </LinearGradient>
        </LinearGradient>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
  },
  bookContainer: {
    flex: 1,
    overflow: 'hidden',
  },

  // Header
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 4,
    borderBottomColor: '#D97706',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  headerTitle: {
    fontSize: SIZES.fontLG,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
    flex: 1,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  pageCounter: {
    color: '#FCD34D',
    fontSize: SIZES.fontSM,
    fontWeight: FONT_WEIGHT.medium,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },
  homeButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(51, 65, 85, 0.6)',
    borderRadius: SIZES.radiusLG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(51, 65, 85, 0.6)',
    borderRadius: SIZES.radiusLG,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Page Content
  pageContent: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#FFFBEB',
  },
  pageAnimationWrapper: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
  },
  pageInner: {
    maxWidth: 768,
    alignSelf: 'center',
    width: '100%',
  },

  // Chapter Header
  chapterHeader: {
    marginBottom: SPACING.base,
  },
  chapterTitle: {
    fontSize: SIZES.fontXL,
    fontWeight: FONT_WEIGHT.bold,
    color: '#1E293B',
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#D97706',
    paddingBottom: SPACING.sm,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    letterSpacing: 0.8,
  },

  // Section Header
  sectionHeader: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: SIZES.fontLG,
    fontWeight: FONT_WEIGHT.semibold,
    color: '#334155',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },

  // Content
  contentContainer: {
    gap: SPACING.base,
  },
  spacer: {
    height: 8,
  },

  // Cover Page Styles
  coverTitleMain: {
    color: '#1E293B',
    textAlign: 'center',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: SIZES.font2XL,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 2,
  },
  coverSubtitleText: {
    color: '#1E293B',
    textAlign: 'center',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: SIZES.fontBase,
    fontWeight: FONT_WEIGHT.normal,
  },
  coverNormalText: {
    color: '#1E293B',
    textAlign: 'center',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: SIZES.fontSM,
  },

  // Normal Paragraph
  normalParagraph: {
    color: '#1E293B',
    lineHeight: 26,
    textAlign: 'justify',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: SIZES.fontSM,
  },

  // Page Number
  pageNumber: {
    textAlign: 'center',
    marginTop: SPACING.xxxl,
    color: '#64748B',
    fontSize: SIZES.fontSM,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },

  // Navigation Footer
  navigation: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 4,
    borderTopColor: '#D97706',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: '#D97706',
    borderRadius: SIZES.radiusLG,
    ...SHADOWS.medium,
  },
  navButtonDisabled: {
    backgroundColor: '#475569',
    opacity: 0.5,
  },
  navButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontBase,
    fontWeight: FONT_WEIGHT.semibold,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },
  navChapterInfo: {
    maxWidth: 120,
  },
  navChapterText: {
    color: '#FCD34D',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: SIZES.fontXS,
    textAlign: 'center',
  },
});

export default PenzugyiAlapismeretkBookView;
