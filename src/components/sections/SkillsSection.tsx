'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

import { SKILLS } from '@/data/registry';
import type { SkillEntry } from '@/types';

const CATEGORY_ORDER: SkillEntry['category'][] = [
  'offensive',
  'defensive',
  'development',
  'platform',
];

export function SkillsSection(): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const [scanFired, setScanFired] = useState<boolean>(prefersReducedMotion);
  const sectionRef = useRef<HTMLElement | null>(null);

  const groupedSkills = useMemo(() => {
    return CATEGORY_ORDER.map((category) => ({
      category,
      skills: SKILLS.filter((skill) => !skill.hidden && skill.category === category),
    }));
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (typeof window === 'undefined') return;
    const target = sectionRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setScanFired(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="min-h-screen border-b border-matrix-green/20 px-4 py-20 lg:px-8"
    >
      <div className="relative mx-auto w-full max-w-6xl overflow-hidden">
        <h2 className="mb-6 text-xl font-bold text-matrix-green">SKILLS</h2>

        {!prefersReducedMotion && scanFired ? (
          <motion.div
            aria-hidden="true"
            initial={{ y: '-8%' }}
            animate={{ y: '108%' }}
            transition={{ duration: 1.1, ease: 'easeInOut' }}
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-12 bg-gradient-to-b from-transparent via-matrix-green/25 to-transparent"
          />
        ) : null}

        <div className="space-y-6">
          {groupedSkills.map(({ category, skills }, groupIndex) => (
            <div key={category}>
              <h3 className="mb-3 text-sm uppercase tracking-wide text-matrix-green/70">
                {category}
              </h3>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
                {skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.id}
                    initial={
                      prefersReducedMotion || scanFired
                        ? false
                        : {
                            opacity: 0.35,
                          }
                    }
                    animate={
                      prefersReducedMotion || scanFired
                        ? { opacity: 1 }
                        : {
                            opacity: 0.35,
                          }
                    }
                    transition={{
                      duration: 0.22,
                      delay: prefersReducedMotion ? 0 : groupIndex * 0.06 + skillIndex * 0.05,
                    }}
                    className={`rounded border border-matrix-green/30 bg-component p-3 ${
                      scanFired || prefersReducedMotion
                        ? 'text-matrix-green'
                        : 'text-matrix-green/50'
                    }`}
                    aria-label={`${skill.name}, proficiency ${skill.proficiency} of 5`}
                  >
                    <div className="flex items-center gap-2">
                      {skill.iconPath ? (
                        <Image
                          src={skill.iconPath}
                          alt={`${skill.name} logo`}
                          width={18}
                          height={18}
                        />
                      ) : null}
                      <span className="text-sm">{skill.name}</span>
                    </div>
                    <p className="mt-2 text-xs text-matrix-green/70">
                      {'['}
                      {'#'.repeat(skill.proficiency)}
                      {'.'.repeat(5 - skill.proficiency)}
                      {']'}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
