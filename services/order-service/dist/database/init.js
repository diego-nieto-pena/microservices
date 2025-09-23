"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = initializeDatabase;
const database_1 = __importDefault(require("../config/database"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function initializeDatabase() {
    try {
        // Read and execute migration files
        const migrationDir = path_1.default.join(__dirname, 'migrations');
        const migrationFiles = fs_1.default.readdirSync(migrationDir).sort();
        for (const file of migrationFiles) {
            if (file.endsWith('.sql')) {
                const migrationPath = path_1.default.join(migrationDir, file);
                const migrationSQL = fs_1.default.readFileSync(migrationPath, 'utf8');
                console.log(`Executing migration: ${file}`);
                await database_1.default.query(migrationSQL);
                console.log(`Migration ${file} completed successfully`);
            }
        }
        console.log('Database initialization completed');
    }
    catch (error) {
        console.error('Database initialization failed:', error);
        throw error;
    }
}
