import { useState, useCallback } from 'react';

export const useFormSections = () => {
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set([
      'company',
      'contact',
      'mailing',
      'trip',
      'vehicle',
      'route',
      'vehicleConfig',
    ]),
  );

  const toggleSection = useCallback((sectionName: string) => {
    setCollapsedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionName)) {
        newSet.delete(sectionName);
      } else {
        newSet.add(sectionName);
      }
      return newSet;
    });
  }, []);

  const expandSection = useCallback((sectionName: string) => {
    setCollapsedSections((prev) => {
      const newSet = new Set(prev);
      newSet.delete(sectionName);
      return newSet;
    });
  }, []);

  const collapseSection = useCallback((sectionName: string) => {
    setCollapsedSections((prev) => {
      const newSet = new Set(prev);
      newSet.add(sectionName);
      return newSet;
    });
  }, []);

  const expandSections = useCallback((sectionNames: string[]) => {
    setCollapsedSections((prev) => {
      const newSet = new Set(prev);
      sectionNames.forEach((section) => {
        newSet.delete(section);
      });
      return newSet;
    });
  }, []);

  const isSectionCollapsed = useCallback(
    (sectionName: string) => {
      return collapsedSections.has(sectionName);
    },
    [collapsedSections],
  );

  return {
    collapsedSections,
    setCollapsedSections,
    toggleSection,
    expandSection,
    collapseSection,
    expandSections,
    isSectionCollapsed,
  };
};
