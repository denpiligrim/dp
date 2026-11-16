import { createContext, useContext } from 'react';
export const GuideValidationContext = createContext<string[]>([]);
export const useGuideErrors = () => useContext(GuideValidationContext);
