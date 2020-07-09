type Id = number;

export interface Update {
  coll_id: Id;
  folder_id: Id;
  val: string;
  field_id?: string;
  release_id?: number;
  notes: string;
}

export interface Broadcast {
  exists: boolean;
  object_id: Id;
  preview: {
    title: string;
    url: string;
  };
  signature: string;
  timestamp: number;
  type: string;
  uid: Id;
}

export interface Release {
  broadcast: Broadcast;
  id: Id;
}

export interface Item {
  id: Id;
  master_id: Id;
}
