/* ═══════════════════════════════════════════════════════════
   Shared TypeScript types for the coaching platform
   ═══════════════════════════════════════════════════════════ */

// ── Auth ──
export type UserRole = "admin" | "client";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ── Client Profile ──
export type ExperienceLevel = "beginner" | "intermediate" | "advanced";
export type FitnessGoal = "fat_loss" | "muscle_gain" | "recomposition" | "athletic";

export interface Client {
  id: string;
  userId: string;
  name: string;
  age: number | null;
  heightCm: number | null;
  currentWeightKg: number | null;
  experienceLevel: ExperienceLevel | null;
  goal: FitnessGoal | null;
  healthNotes: string | null;
  startDate: string | null;
  targetDate: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── Exercise Library ──
export interface ExerciseLibraryItem {
  id: string;
  name: string;
  nameAr: string | null;
  muscleGroup: string;
  equipment: string | null;
  instructions: string | null;
  videoUrl: string | null;
  createdBy: string | null;
}

// ── Workout ──
export interface WorkoutPlan {
  id: string;
  clientId: string;
  name: string;
  isActive: boolean;
  days: WorkoutDay[];
  createdAt: string;
}

export interface WorkoutDay {
  id: string;
  planId: string;
  dayNumber: number;
  dayName: string;
  dayNameAr: string | null;
  sortOrder: number;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  dayId: string;
  libraryId: string | null;
  name: string;
  sets: number;
  reps: string;
  restSeconds: number;
  notes: string | null;
  coachHighlight: string | null;
  videoUrl: string | null;
  sortOrder: number;
}

export interface WorkoutLog {
  id: string;
  clientId: string;
  exerciseId: string;
  loggedAt: string;
  setNumber: number;
  weightKg: number | null;
  repsDone: number | null;
  completed: boolean;
}

// ── Nutrition ──
export type NutritionMode = "fixed" | "flexible";

export interface NutritionPlan {
  id: string;
  clientId: string;
  mode: NutritionMode;
  caloriesTarget: number | null;
  proteinG: number | null;
  carbsG: number | null;
  fatG: number | null;
  isActive: boolean;
  meals: Meal[];
  createdAt: string;
}

export interface Meal {
  id: string;
  planId: string;
  mealType: string;
  sortOrder: number;
  foodItems: FoodItem[];
}

export interface FoodItem {
  name: string;
  grams: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodDatabaseEntry {
  id: string;
  name: string;
  nameAr: string | null;
  brand: string | null;
  barcode: string | null;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  isVerified: boolean;
}

export interface FoodLogEntry {
  id: string;
  clientId: string;
  foodId: string | null;
  loggedAt: string;
  mealType: string | null;
  weightGrams: number;
  calculatedCalories: number;
  calculatedProtein: number;
  calculatedCarbs: number;
  calculatedFat: number;
  customFoodName: string | null;
}

// ── Progress ──
export interface WeightEntry {
  clientId: string;
  loggedAt: string;
  weightKg: number;
  notes: string | null;
}

export interface BodyMeasurement {
  clientId: string;
  measuredAt: string;
  weightKg: number | null;
  waistCm: number | null;
  chestCm: number | null;
  shouldersCm: number | null;
  hipsCm: number | null;
  leftArmCm: number | null;
  rightArmCm: number | null;
  leftThighCm: number | null;
  rightThighCm: number | null;
  bodyFatPercent: number | null;
  notes: string | null;
}

export type PhotoPose = "front" | "side" | "back";

export interface ProgressPhoto {
  id: string;
  clientId: string;
  photoUrl: string;
  publicId: string;
  takenAt: string;
  pose: PhotoPose | null;
  note: string | null;
  showOnLanding: boolean;
}

// ── Check-in ──
export type WorkoutStatus = "completed" | "partial" | "skipped";

export interface DailyCheckin {
  id: string;
  clientId: string;
  checkinDate: string;
  workoutStatus: WorkoutStatus | null;
  workoutSetsDone: number | null;
  dietCompliance: number | null;
  cardioDone: boolean | null;
  cardioMinutes: number | null;
  sleepQuality: number | null;
  sleepHours: number | null;
  waterIntakeCups: number | null;
  clientNote: string | null;
  submittedAt: string;
}

// ── Messaging ──
export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  readAt: string | null;
  createdAt: string;
}

// ── CMS ──
export interface SiteContent {
  id: string;
  sectionKey: string;
  contentJson: Record<string, unknown>;
  updatedBy: string | null;
  updatedAt: string;
}

export interface HeroContent {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaUrl: string;
  imageUrl: string;
  metrics: { value: string; label: string }[];
}

export interface FeatureItem {
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
}

export interface TransformationItem {
  beforeUrl: string;
  afterUrl: string;
  name: string;
  duration: string;
  weightLost: string;
}

// ── Notifications ──
export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string | null;
  read: boolean;
  createdAt: string;
}

// ── Component state patterns ──
export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: T };
