import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Lesson {
    id: bigint;
    creditCost: bigint;
    title: string;
    creator: Principal;
    video: Uint8Array;
    createdAt: Time;
    description: string;
}
export interface UserProfile {
    name: string;
    gmail?: string;
    profileCreatedAt: Time;
    remainingLearningCredits: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    completeLesson(lessonId: bigint): Promise<void>;
    createLesson(title: string, description: string, video: Uint8Array, creditCost: bigint): Promise<bigint>;
    getAllLessons(): Promise<Array<Lesson>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLesson(id: bigint): Promise<Lesson>;
    getLessonsByCreator(creator: Principal): Promise<Array<Lesson>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
