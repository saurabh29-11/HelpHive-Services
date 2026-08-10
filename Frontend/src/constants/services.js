// This file mirrors the services from the backend constants.
// Keep this in sync with backend/src/constants.js

export const ServiceTypesEnum = {
    MAID: "Maid Service",
    COOK: "Cooking Service",
    BABYSITTER: "Babysitting",
    ELDERLY_CARE: "Elderly Care",
    HOUSE_CLEANING: "House Cleaning",
    DEEP_CLEANING: "Deep Cleaning",
    PET_CARE: "Pet Care",
};

// This list includes ALL available services for filtering and display.
export const AvailableServiceTypes = Object.values(ServiceTypesEnum);

// --- NEW ---
// This list includes ONLY the services a worker can select as their primary role.
export const WorkerRegisterableServices = [
    ServiceTypesEnum.MAID,
    ServiceTypesEnum.COOK,
    ServiceTypesEnum.BABYSITTER,
    ServiceTypesEnum.ELDERLY_CARE,
    ServiceTypesEnum.HOUSE_CLEANING,
    ServiceTypesEnum.DEEP_CLEANING,
    ServiceTypesEnum.PET_CARE,
];