"use client";

import { MotionConfig } from "motion/react";

/**
 * La règle prefers-reduced-motion de globals.css ne neutralise que les
 * animations et transitions CSS. Motion anime en JavaScript via la Web
 * Animations API, hors de portée de cette règle : sans MotionConfig, un
 * utilisateur ayant demandé la réduction des animations subissait quand
 * même les slide-in du tiroir de filtres, des modales et des toasts.
 *
 * reducedMotion="user" délègue la décision à la préférence système plutôt
 * que de la coder en dur, et Motion remplace alors les animations de
 * transformation par de simples fondus.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
