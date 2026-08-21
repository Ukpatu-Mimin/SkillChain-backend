"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
let UploadsService = class UploadsService {
    constructor(cfg) {
        this.cfg = cfg;
        this.supabase = (0, supabase_js_1.createClient)(cfg.getOrThrow('SUPABASE_URL'), cfg.getOrThrow('SUPABASE_SERVICE_ROLE_KEY'));
    }
    async getSignedUploadUrl(bucket, fileName, userId) {
        const path = `${userId}/${Date.now()}-${fileName}`;
        const { data, error } = await this.supabase.storage
            .from(bucket)
            .createSignedUploadUrl(path);
        if (error)
            throw error;
        const { data: urlData } = this.supabase.storage.from(bucket).getPublicUrl(path);
        return {
            uploadUrl: data.signedUrl,
            path,
            publicUrl: urlData.publicUrl,
        };
    }
};
exports.UploadsService = UploadsService;
exports.UploadsService = UploadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UploadsService);
//# sourceMappingURL=uploads.service.js.map