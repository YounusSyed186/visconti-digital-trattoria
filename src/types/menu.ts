export interface MenuItem {
  name: string;
  description: string;
  price: string;
  image: string;
}

export interface MenuCategory {
  [key: string]: MenuItem[];
}

export interface TabLabels {
  [key: string]: string;
}

export interface MenuListingPageProps {
  category: string;
  items: MenuItem[];
  categoryLabel: string;
}