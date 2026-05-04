import Dexie, { Table } from 'dexie';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  farm_name?: string;
  created_at: string;
}

export interface Farm {
  id: string;
  user_id: string;
  name: string;
  location: string;
  created_at: string;
}

export interface Flock {
  id: string;
  user_id: string;
  farm_id: string;
  name: string;
  breed: string;
  initial_count: number;
  current_count: number;
  status: 'active' | 'archived';
  updated_at: string;
}

export interface JournalEvent {
  id: string;
  user_id: string;
  farm_id?: string;
  flock_id?: string;
  event_type: string;
  payload: any;
  device_timestamp: number;
  device_id: string;
  status: 'pending' | 'synced';
}

export interface License {
  id: string;
  user_id: string;
  tier: string;
  expiry_date: string;
  signed_token: string;
}

export class SharedFarmDB extends Dexie {
  users!: Table<UserProfile>;
  farms!: Table<Farm>;
  flocks!: Table<Flock>;
  events!: Table<JournalEvent>;
  licenses!: Table<License>;

  constructor(userId: string) {
    super(`kukusoft_db_${userId}`);
    this.version(1).stores({
      users: 'id, email',
      farms: 'id, user_id',
      flocks: 'id, user_id, farm_id',
      events: 'id, user_id, status, device_timestamp',
      licenses: 'id, user_id'
    });
  }
}

// Function to get DB instance for a specific user
export const getDatabase = (userId: string) => {
  return new SharedFarmDB(userId);
};
