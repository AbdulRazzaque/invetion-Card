import { useState, useCallback, useMemo } from 'react';
import { InvitationData, DEFAULT_INVITATION_DATA } from '../types/invitation';

export const useInvitation = (initialData: InvitationData = DEFAULT_INVITATION_DATA) => {
  const [data, setData] = useState<InvitationData>(initialData);

  const updateField = useCallback(<K extends keyof InvitationData>(field: K, value: InvitationData[K]) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const resetToDefault = useCallback(() => {
    setData(DEFAULT_INVITATION_DATA);
  }, []);

  const hasChanges = useMemo(() => {
    return JSON.stringify(data) !== JSON.stringify(DEFAULT_INVITATION_DATA);
  }, [data]);

  return {
    data,
    setData,
    updateField,
    resetToDefault,
    hasChanges,
  };
};
