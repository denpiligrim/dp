import { ReactNode } from 'react';

export interface GuideStep {
  id: string;
  title: string;
  detail?: string;
  heading?: string;
  description?: string;
}

export interface GuideSeoData {
  url: string;
  title: string;
  description: string;
  heading: string;
}

export interface GuideLink {
  label: string;
  href: string;
  sponsored?: boolean;
}

export interface GuidePartner extends GuideLink {
  detail?: string;
  icon: ReactNode;
}

export interface GuideFlowNode {
  id: string;
  label: string;
  title: ReactNode;
  detail: ReactNode;
  icon?: ReactNode;
}

export interface GuideFaqItem {
  question: string;
  answer: ReactNode;
}

export const guideLinkRel = (sponsored = false) =>
  sponsored ? 'sponsored noopener noreferrer' : 'noopener noreferrer';
