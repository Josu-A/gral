import rateLimit, { MemoryStore } from "express-rate-limit";

const IPV6_SUBNET = 56;
const LEGACY_HEADERS = false;
const STANDARD_HEADERS = 'draft-8';

const generalLimiter = rateLimit({
    ipv6Subnet: IPV6_SUBNET,
    legacyHeaders: LEGACY_HEADERS,
    limit: 100,
    message: {
        error: "Eskaera gehiegi, itxaron zertxobait."
    },
    standardHeaders: STANDARD_HEADERS,
    store: new MemoryStore(),
    windowMs: 15 * 60 * 1000
});

const authLimiter = rateLimit({
    ipv6Subnet: IPV6_SUBNET,
    legacyHeaders: LEGACY_HEADERS,
    limit: 5,
    message: {
        error: "Kautotze eskaera gehiegi, itxaron zertxobait."
    },
    skipSuccessfulRequests: true,
    standardHeaders: STANDARD_HEADERS,
    store: new MemoryStore(),
    windowMs: 10 * 60 * 1000
});

const restorePasswordLimiter = rateLimit({
    ipv6Subnet: IPV6_SUBNET,
    legacyHeaders: LEGACY_HEADERS,
    limit: 10,
    message: {
        error: "Pasahitza berreskuratze eskaera gehiegi, itxaron zertxobait."
    },
    skipSuccessfulRequests: false,
    standardHeaders: STANDARD_HEADERS,
    store: new MemoryStore(),
    windowMs: 60 * 60 * 1000
});

export {
    authLimiter,
    generalLimiter,
    restorePasswordLimiter
};
