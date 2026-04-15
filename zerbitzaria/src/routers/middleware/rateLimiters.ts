import rateLimit, { MemoryStore } from "express-rate-limit";

const generalLimiter = rateLimit({
    ipv6Subnet: 56,
    legacyHeaders: false,
    limit: 100,
    message: {
        error: "Eskaera gehiegi, itxaron zertxobait."
    },
    standardHeaders: 'draft-8',
    store: new MemoryStore(),
    windowMs: 15 * 60 * 1000
});

export { generalLimiter };
