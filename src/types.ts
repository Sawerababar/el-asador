export type MenuCategory = 
  | 'asador'
  | 'tacos'
  | 'especialidades'
  | 'cantina'
  | 'guarniciones'
  | 'postres';

export type DietaryTag = 'chef-special' | 'spicy' | 'gluten-free' | 'popular' | 'vegetarian';

export interface MenuItem {
  id: string;
  name: string;
  spanishName?: string;
  category: MenuCategory;
  price: number;
  description: string;
  tags: DietaryTag[];
  image: string;
  calories?: string;
  options?: string[];
  spiceLevel?: 1 | 2 | 3;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  selectedOption?: string;
  specialInstructions?: string;
}

export interface ReservationDetails {
  fullName: string;
  email: string;
  phone: string;
  partySize: number;
  date: string;
  time: string;
  seatingPreference: 'main-dining' | 'rustic-patio' | 'cantina-bar';
  specialOccasion?: string;
  dietaryNotes?: string;
  confirmationCode?: string;
}

export interface CateringInquiry {
  fullName: string;
  email: string;
  phone: string;
  guestCount: number;
  eventDate: string;
  eventType: string;
  notes: string;
}
