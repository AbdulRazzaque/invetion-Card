import React from 'react';
import { InvitationData } from '../types/invitation';
import { InvitationCard } from '../components/InvitationGenerator/InvitationCard';

interface FloralInvitationTemplateProps {
  data: InvitationData;
  cardRef?: React.Ref<HTMLDivElement>;
  isExporting?: boolean;
}

export const FloralInvitationTemplate: React.FC<FloralInvitationTemplateProps> = ({
  data,
  cardRef,
  isExporting,
}) => {
  return (
    <InvitationCard
      ref={cardRef}
      data={data}
      isExporting={isExporting}
    />
  );
};
