/** Default uuidv4 autoincrement id in database */
export type UUIDString = string;

/** Default integer autoincrement id in database */
export type DefaultId = number;

/** String that converts to a number */
export type NumberString = string;

/** String that converts to a date */
export type DateString = string;

export type AutomaticFields = {
  createdAt: DateString;
  updatedAt: DateString;
};
