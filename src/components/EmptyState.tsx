import { useTranslations } from "next-intl";
import React from "react";
interface EmptyState {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
}
const EmptyState = () => {
  const t = useTranslations();
  return <div>{t("EmptyState.nocruises")}</div>;
};

export default EmptyState;
