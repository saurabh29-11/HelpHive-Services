export const DB_NAME = "helphive";

export const UserRolesEnum = {
    USER: "USER",
    WORKER: "WORKER",
    ADMIN: "ADMIN",
};

export const AvailableUserRoles = Object.values(UserRolesEnum);

export const ServiceTypesEnum = {
    MAID: "Maid Service",
    COOK: "Cooking Service",
    BABYSITTER: "Babysitting",
    ELDERLY_CARE: "Elderly Care",
    // --- ADD NEW SERVICES HERE ---
    HOUSE_CLEANING: "House Cleaning",
    DEEP_CLEANING: "Deep Cleaning",
    PET_CARE: "Pet Care",
};

export const AvailableServiceTypes = Object.values(ServiceTypesEnum);

export const WorkerAvailabilityEnum = {
    AVAILABLE: "Available",
    UNAVAILABLE: "Not Available",
};

export const AvailableWorkerAvailabilities = Object.values(WorkerAvailabilityEnum);