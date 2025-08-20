import { useState, useCallback } from 'react';
import { AxleConfigurationData } from '../components/AxleGroup';

export const useVehicleConfiguration = () => {
  const [selectedTrailers, setSelectedTrailers] = useState<string[]>(['']);
  const [axleConfigurations, setAxleConfigurations] = useState<
    AxleConfigurationData[]
  >([
    {
      numberOfAxles: '',
      axleSpread: '',
      interaxleSpacing: '',
      axleUnitWeight: '',
      numberOfTires: '',
      tireSize: '',
    },
    {
      numberOfAxles: '',
      axleSpread: '',
      interaxleSpacing: '',
      axleUnitWeight: '',
      numberOfTires: '',
      tireSize: '',
    },
  ]);

  const updateAxleConfigurationsForTrailers = useCallback(
    (trailerCount: number) => {
      const requiredAxleGroups = trailerCount + 2; // 2 default + 1 per trailer

      setAxleConfigurations((prev) => {
        const newConfigs = [...prev];

        // Add more axle groups if needed
        while (newConfigs.length < requiredAxleGroups) {
          newConfigs.push({
            numberOfAxles: '',
            axleSpread: '',
            interaxleSpacing: '',
            axleUnitWeight: '',
            numberOfTires: '',
            tireSize: '',
          });
        }

        // Remove excess axle groups if needed
        while (newConfigs.length > requiredAxleGroups) {
          newConfigs.pop();
        }

        return newConfigs;
      });
    },
    [],
  );

  const handleTrailerChange = useCallback(
    (index: number, value: string) => {
      setSelectedTrailers((prev) => {
        const newTrailers = [...prev];
        newTrailers[index] = value;

        // If a trailer is selected, add a new empty dropdown at the end
        if (value && value.trim() !== '') {
          // Remove any trailing empty selections first
          while (
            newTrailers.length > 0 &&
            newTrailers[newTrailers.length - 1] === ''
          ) {
            newTrailers.pop();
          }
          // Add a new empty dropdown
          newTrailers.push('');
        } else {
          // If value is empty, remove trailing empty selections
          while (
            newTrailers.length > 0 &&
            newTrailers[newTrailers.length - 1] === ''
          ) {
            newTrailers.pop();
          }
        }

        return newTrailers;
      });

      // Calculate the new trailer count and update axle configurations
      const currentTrailers = selectedTrailers.filter(
        (trailer) => trailer && trailer.trim() !== '',
      );
      const newTrailerCount =
        value && value.trim() !== ''
          ? currentTrailers.length + 1
          : currentTrailers.length;
      updateAxleConfigurationsForTrailers(newTrailerCount);
    },
    [selectedTrailers, updateAxleConfigurationsForTrailers],
  );

  const removeTrailer = useCallback(
    (index: number) => {
      setSelectedTrailers((prev) => {
        const newTrailers = [...prev];
        newTrailers.splice(index, 1);

        // Remove trailing empty selections, but keep at least one empty dropdown
        while (
          newTrailers.length > 1 &&
          newTrailers[newTrailers.length - 1] === ''
        ) {
          newTrailers.pop();
        }

        // Always ensure we have at least one empty dropdown at the end
        if (
          newTrailers.length === 0 ||
          newTrailers[newTrailers.length - 1] !== ''
        ) {
          newTrailers.push('');
        }

        return newTrailers;
      });

      // Calculate the new trailer count and update axle configurations
      const currentTrailers = selectedTrailers.filter(
        (trailer) => trailer && trailer.trim() !== '',
      );
      const newTrailerCount = currentTrailers.length - 1; // Remove one trailer
      updateAxleConfigurationsForTrailers(newTrailerCount);
    },
    [selectedTrailers, updateAxleConfigurationsForTrailers],
  );

  const handleAxleConfigurationChange = useCallback(
    (axleIndex: number, field: string, value: string) => {
      setAxleConfigurations((prev) => {
        const newConfigs = [...prev];
        newConfigs[axleIndex] = {
          ...newConfigs[axleIndex],
          [field]: value,
        };
        return newConfigs;
      });
    },
    [],
  );

  const resetVehicleConfiguration = useCallback(() => {
    setSelectedTrailers(['']);
    setAxleConfigurations([
      {
        numberOfAxles: '',
        axleSpread: '',
        interaxleSpacing: '',
        axleUnitWeight: '',
        numberOfTires: '',
        tireSize: '',
      },
      {
        numberOfAxles: '',
        axleSpread: '',
        interaxleSpacing: '',
        axleUnitWeight: '',
        numberOfTires: '',
        tireSize: '',
      },
    ]);
  }, []);

  const setTrailersFromData = useCallback(
    (trailers: any[]) => {
      const trailerTypes = trailers.map(
        (trailer: any) => trailer.vehicleSubType,
      );
      setSelectedTrailers([...trailerTypes, '']); // Add empty dropdown at the end

      // Update axle configurations based on trailer count
      const trailerCount = trailerTypes.length;
      updateAxleConfigurationsForTrailers(trailerCount);
    },
    [updateAxleConfigurationsForTrailers],
  );

  const setAxleConfigurationsFromData = useCallback((axleConfigs: any[]) => {
    const configs = axleConfigs.map((axle: any) => ({
      numberOfAxles: axle.numberOfAxles?.toString() || '',
      axleSpread: axle.axleSpread?.toString() || '',
      interaxleSpacing: axle.interaxleSpacing?.toString() || '',
      axleUnitWeight: axle.axleUnitWeight?.toString() || '',
      numberOfTires: axle.numberOfTires?.toString() || '',
      tireSize: axle.tireSize?.toString() || '',
    }));
    setAxleConfigurations(configs);
  }, []);

  return {
    selectedTrailers,
    axleConfigurations,
    handleTrailerChange,
    removeTrailer,
    handleAxleConfigurationChange,
    resetVehicleConfiguration,
    setTrailersFromData,
    setAxleConfigurationsFromData,
  };
};
