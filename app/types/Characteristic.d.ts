export type Characteristic = {
  id: number | string;
  name: string;
  icon_url: string;
  beach_has_characteristics?: { featured: boolean };
};
