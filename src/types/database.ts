// ============================================
// SUPABASE DATABASE TYPES
// ============================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      players: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          username: string | null
          avatar_id: number
          level: number
          xp: number
          coins: number
          diamonds: number
          subscription_type: 'free' | 'pro' | 'master'
          streak_freezes: number
          last_login: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          username?: string | null
          avatar_id?: number
          level?: number
          xp?: number
          coins?: number
          diamonds?: number
          subscription_type?: 'free' | 'pro' | 'master'
          streak_freezes?: number
          last_login?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          username?: string | null
          avatar_id?: number
          level?: number
          xp?: number
          coins?: number
          diamonds?: number
          subscription_type?: 'free' | 'pro' | 'master'
          streak_freezes?: number
          last_login?: string
        }
      }
      streaks: {
        Row: {
          id: string
          player_id: string
          current_streak: number
          longest_streak: number
          last_activity_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          player_id: string
          current_streak?: number
          longest_streak?: number
          last_activity_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          player_id?: string
          current_streak?: number
          longest_streak?: number
          last_activity_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      lesson_progress: {
        Row: {
          id: string
          player_id: string
          lesson_id: string
          completed: boolean
          score: number | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          player_id: string
          lesson_id: string
          completed?: boolean
          score?: number | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          player_id?: string
          lesson_id?: string
          completed?: boolean
          score?: number | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      daily_limits: {
        Row: {
          id: string
          player_id: string
          date: string
          lessons_completed: number
          max_lessons: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          player_id: string
          date: string
          lessons_completed?: number
          max_lessons?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          player_id?: string
          date?: string
          lessons_completed?: number
          max_lessons?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      subscription_type: 'free' | 'premium' | 'vip'
    }
  }
}
