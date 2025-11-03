// ============================================
// SUPABASE PÉLDA KOMPONENS
// ============================================
// Ez egy példa komponens, ami bemutatja a Supabase hook-ok használatát
// Használd referenciának saját komponenseid írásához!

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, ScrollView } from 'react-native';
import { usePlayer, useStreak, useLessonProgress } from '../../hooks';
import { testSupabaseConnection } from '../../config/supabase';

export function SupabaseExample() {
  // Hook-ok használata
  const {
    player,
    loading: playerLoading,
    addPlayerXP,
    addCoins,
    addDiamonds,
  } = usePlayer();

  const { streak, recordActivity } = useStreak();

  const {
    progress,
    completedCount,
    saveProgress,
    isLessonCompleted,
  } = useLessonProgress();

  // Első betöltéskor rögzítjük az aktivitást (streak frissítés)
  useEffect(() => {
    recordActivity();
  }, []);

  // Tesztelés funkciók
  const handleConnectionTest = async () => {
    const connected = await testSupabaseConnection();
    Alert.alert(
      connected ? 'Sikeres kapcsolat! ✅' : 'Kapcsolat hiba ❌',
      connected
        ? 'Sikeresen csatlakoztál a Supabase-hez!'
        : 'Nem sikerült csatlakozni. Ellenőrizd a .env fájlt.'
    );
  };

  const handleAddXP = async () => {
    const { leveledUp } = await addPlayerXP(50);
    if (leveledUp) {
      Alert.alert('Szintlépés! 🎉', 'Gratulálok, új szintet értél el!');
    } else {
      Alert.alert('XP hozzáadva', '+50 XP 📈');
    }
  };

  const handleAddCoins = async () => {
    await addCoins(100);
    Alert.alert('Érmék hozzáadva', '+100 érme 💰');
  };

  const handleAddDiamonds = async () => {
    await addDiamonds(10);
    Alert.alert('Gyémántok hozzáadva', '+10 gyémánt 💎');
  };

  const handleCompleteLesson = async () => {
    const lessonId = 'example-lesson-1';
    const score = Math.floor(Math.random() * 100); // Véletlenszerű pontszám

    await saveProgress(lessonId, true, score);
    Alert.alert('Lecke befejezve! 📚', `Pontszám: ${score}%`);
  };

  if (playerLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Betöltés...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Supabase Integráció Példa</Text>

      {/* Kapcsolat teszt */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔗 Kapcsolat Teszt</Text>
        <Button title="Kapcsolat Tesztelése" onPress={handleConnectionTest} />
      </View>

      {/* Játékos adatok */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👤 Játékos Adatok</Text>
        {player ? (
          <>
            <Text style={styles.infoText}>ID: {player.id}</Text>
            <Text style={styles.infoText}>
              Felhasználónév: {player.username || 'Nincs beállítva'}
            </Text>
            <Text style={styles.infoText}>Szint: {player.level}</Text>
            <Text style={styles.infoText}>XP: {player.xp}</Text>
            <Text style={styles.infoText}>Érmék: {player.coins} 💰</Text>
            <Text style={styles.infoText}>Gyémántok: {player.diamonds} 💎</Text>
            <Text style={styles.infoText}>
              Előfizetés: {player.subscription_type}
            </Text>
          </>
        ) : (
          <Text style={styles.errorText}>Nincs játékos adat</Text>
        )}
      </View>

      {/* Játékos műveletek */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ Játékos Műveletek</Text>
        <View style={styles.buttonRow}>
          <Button title="+50 XP" onPress={handleAddXP} />
        </View>
        <View style={styles.buttonRow}>
          <Button title="+100 Érme" onPress={handleAddCoins} />
        </View>
        <View style={styles.buttonRow}>
          <Button title="+10 Gyémánt" onPress={handleAddDiamonds} />
        </View>
      </View>

      {/* Streak adatok */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔥 Streak</Text>
        {streak ? (
          <>
            <Text style={styles.infoText}>
              Jelenlegi sorozat: {streak.current_streak} nap
            </Text>
            <Text style={styles.infoText}>
              Leghosszabb sorozat: {streak.longest_streak} nap
            </Text>
            <Text style={styles.infoText}>
              Utolsó aktivitás: {new Date(streak.last_activity_date).toLocaleDateString('hu-HU')}
            </Text>
          </>
        ) : (
          <Text style={styles.infoText}>Még nincs streak adat</Text>
        )}
        <View style={styles.buttonRow}>
          <Button title="Aktivitás Rögzítése" onPress={recordActivity} />
        </View>
      </View>

      {/* Lecke előrehaladás */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📚 Lecke Előrehaladás</Text>
        <Text style={styles.infoText}>
          Befejezett leckék: {completedCount}
        </Text>
        <Text style={styles.infoText}>
          Összes előrehaladás: {progress.length} lecke
        </Text>
        <View style={styles.buttonRow}>
          <Button title="Lecke Befejezése" onPress={handleCompleteLesson} />
        </View>
      </View>

      {/* Előrehaladás lista */}
      {progress.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Leckék Listája</Text>
          {progress.slice(0, 5).map((item) => (
            <View key={item.id} style={styles.lessonItem}>
              <Text style={styles.lessonId}>
                {item.completed ? '✅' : '⏳'} {item.lesson_id}
              </Text>
              {item.score !== null && (
                <Text style={styles.lessonScore}>Pontszám: {item.score}%</Text>
              )}
            </View>
          ))}
          {progress.length > 5 && (
            <Text style={styles.moreText}>
              ...és még {progress.length - 5} lecke
            </Text>
          )}
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Ez csak egy példa komponens. Használd referenciának!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#444',
  },
  infoText: {
    fontSize: 14,
    marginVertical: 3,
    color: '#666',
  },
  errorText: {
    fontSize: 14,
    color: '#d32f2f',
    fontStyle: 'italic',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
  buttonRow: {
    marginVertical: 5,
  },
  lessonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  lessonId: {
    fontSize: 14,
    color: '#333',
  },
  lessonScore: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  moreText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 10,
    textAlign: 'center',
  },
  footer: {
    marginTop: 20,
    marginBottom: 40,
    padding: 15,
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
  },
  footerText: {
    fontSize: 12,
    color: '#1976d2',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
