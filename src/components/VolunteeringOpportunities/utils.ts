const aubergineColorActivities = [
  "doctors appointment",
  "government office",
  "apartment viewing",
  "school/kindergarten",
  "way/path accompanying",
  "accompanying",
  "arzttermine",
  "behörde",
  "wohnungsbesichtigung",
  "schule/kindergarten",
  "wegbegleitung",
  "begleitung",
];

export const getActivityBackgroundColor = (activity: string) => {
  return aubergineColorActivities.includes(activity.toLowerCase())
    ? "var(--color-aubergine-light)"
    : "var(--color-papaya)";
};
